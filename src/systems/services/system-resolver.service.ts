import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type FuseType from 'fuse.js';
// fuse.js v7 ships CJS that exports the constructor directly (no .default).
// Without esModuleInterop, `import Fuse from 'fuse.js'` resolves to undefined at runtime.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Fuse: typeof FuseType = require('fuse.js');
import { System } from '../entities/system.entity';
import { SystemResolverLog } from '../entities/system-resolver-log.entity';
import {
  ELIGIBILITY_POLICY,
  ResolveSystemResponseDto,
  SystemCandidateDto,
  SystemSearchResultDto,
} from '../dto/system-response.dto';

// ─── Internal cache record ───────────────────────────────────────────────────

interface CachedSystemRecord {
  id: number;
  canonical_name: string;
  product_family: string;
  vendor_owner: string | null;
  category: string;
  aliases: string[];
}

interface LlmCacheEntry {
  result: ResolveSystemResponseDto;
  expiresAt: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Fuse.js score ≤ this → confidence ≥ TIER3_MIN_CONFIDENCE */
const TIER3_FUSE_THRESHOLD = 0.05;
const TIER3_MIN_CONFIDENCE = 0.7;

/** Two candidates are "ambiguous" if their Fuse scores differ by less than this */
const AMBIGUITY_GAP = 0.05;

/** Tier 4 LLM cache TTL (ms) */
const LLM_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 h

const LLM_DAILY_CAP = 100;

@Injectable()
export class SystemResolverService implements OnModuleInit {
  private readonly logger = new Logger(SystemResolverService.name);

  // In-memory caches rebuilt on startup
  private systemsCache: CachedSystemRecord[] = [];
  private exactMap = new Map<string, CachedSystemRecord>(); // normalized canonical → record
  private aliasMap = new Map<string, CachedSystemRecord>(); // alias → record
  private fuse: InstanceType<typeof FuseType<CachedSystemRecord>> | null = null;

  // Tier 4 (LLM) state
  private llmCache = new Map<string, LlmCacheEntry>();
  private llmCallCount = 0;
  private llmCallDate = new Date().toDateString();
  private readonly anthropic: Anthropic | null;
  private readonly llmModel: string;

  constructor(
    @InjectRepository(System)
    private readonly systemRepo: Repository<System>,
    @InjectRepository(SystemResolverLog)
    private readonly logRepo: Repository<SystemResolverLog>,
    private readonly configService: ConfigService,
  ) {
    // Accept both naming conventions — ANTHROPIC_API_KEY (new standard) and
    // Anthropic_API_Key (legacy codebase convention).
    const apiKey =
      this.configService.get<string>('ANTHROPIC_API_KEY') ??
      this.configService.get<string>('Anthropic_API_Key');
    this.anthropic = apiKey ? new Anthropic({ apiKey }) : null;
    this.llmModel =
      this.configService.get<string>('ANTHROPIC_RECOMMENDATIONS_MODEL') ??
      'claude-haiku-4-5-20251001';
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  async onModuleInit(): Promise<void> {
    await this.reloadCache();
  }

  async reloadCache(): Promise<void> {
    const systems = await this.systemRepo.find({
      where: { is_active: true as unknown as boolean },
      select: ['id', 'canonical_name', 'product_family', 'vendor_owner', 'category', 'aliases'],
    });

    this.systemsCache = systems.map((s) => ({
      id: s.id,
      canonical_name: s.canonical_name,
      product_family: s.product_family,
      vendor_owner: s.vendor_owner,
      category: s.category,
      aliases: s.aliases ?? [],
    }));

    // Build exact and alias lookup maps
    this.exactMap.clear();
    this.aliasMap.clear();

    for (const sys of this.systemsCache) {
      this.exactMap.set(sys.canonical_name.toLowerCase().trim(), sys);
      for (const alias of sys.aliases) {
        const key = alias.toLowerCase().trim();
        if (!this.aliasMap.has(key)) {
          this.aliasMap.set(key, sys);
        }
      }
    }

    // Build Fuse.js index
    // Using Fuse v7 with array field support: 'aliases' searches all array elements.
    // Weight 2 on canonical_name so exact-ish canonical matches outscore alias-only matches.
    this.fuse = new Fuse<CachedSystemRecord>(this.systemsCache, {
      keys: [
        { name: 'canonical_name', weight: 2 },
        { name: 'aliases', weight: 1 },
      ],
      includeScore: true,
      threshold: 1.0,   // include all — we filter confidence ourselves
      ignoreLocation: true,
      minMatchCharLength: 2,
      useExtendedSearch: false,
      shouldSort: true,
    });

    this.logger.log(
      `SystemResolverService cache loaded: ${this.systemsCache.length} active systems`,
    );
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Full 5-tier resolution. Logs Tier-4 invocations to the DB.
   */
  async resolve(rawInput: string): Promise<ResolveSystemResponseDto> {
    const input = rawInput.trim();
    const normalized = input.toLowerCase();

    // Tier 1 — exact canonical name match
    const tier1 = this.exactMap.get(normalized);
    if (tier1) {
      return this.buildResponse(input, 1, 1.0, tier1, []);
    }

    // Tier 2 — alias exact match
    const tier2 = this.aliasMap.get(normalized);
    if (tier2) {
      return this.buildResponse(input, 2, 0.95, tier2, []);
    }

    // Very short inputs (< 4 chars) that weren't caught by exact/alias maps
    // are almost certainly abbreviations we don't recognise — skip fuzzy to
    // avoid false positives (e.g. "PST" fuzzy-matching unrelated systems).
    if (input.length < 4) {
      return this.buildResponse(input, 5, null, null, []);
    }

    // Tier 3 / 4 / 5 — fuzzy via Fuse.js
    const fuseResults = this.fuse?.search(input) ?? [];

    const aboveThreshold = fuseResults.filter(
      (r) => (r.score ?? 1) <= TIER3_FUSE_THRESHOLD,
    );

    if (aboveThreshold.length === 0) {
      // Tier 5 — UNRESOLVED: return top 3 weak candidates
      const top3 = fuseResults.slice(0, 3).map((r) =>
        this.toCandidate(r.item, 1 - (r.score ?? 1)),
      );
      return this.buildResponse(input, 5, null, null, top3);
    }

    // Check for ambiguity among top candidates
    const topScore = aboveThreshold[0].score ?? 0;
    const ambiguous = aboveThreshold.filter(
      (r) => (r.score ?? 1) - topScore <= AMBIGUITY_GAP,
    );

    if (ambiguous.length === 1) {
      // Tier 3 — clear winner
      const winner = aboveThreshold[0].item;
      const confidence = 1 - topScore;
      const candidates = aboveThreshold
        .slice(0, 5)
        .map((r) => this.toCandidate(r.item, 1 - (r.score ?? 1)));
      return this.buildResponse(input, 3, confidence, winner, candidates);
    }

    // Tier 4 — ambiguous: ask LLM
    const candidates = ambiguous
      .slice(0, 5)
      .map((r) => this.toCandidate(r.item, 1 - (r.score ?? 1)));
    return this.resolveTier4(input, candidates);
  }

  /**
   * Search-only: Tiers 1–3, no LLM, max 5 results. Safe for autocomplete.
   */
  searchSystems(rawQuery: string): SystemSearchResultDto[] {
    if (!rawQuery || rawQuery.trim().length < 2) return [];
    const query = rawQuery.trim();
    const normalized = query.toLowerCase();

    // Tier 1
    const exact = this.exactMap.get(normalized);
    if (exact) {
      return [{ id: exact.id, canonicalName: exact.canonical_name, productFamily: exact.product_family, category: exact.category, confidence: 1.0 }];
    }

    // Tier 2
    const alias = this.aliasMap.get(normalized);
    if (alias) {
      return [{ id: alias.id, canonicalName: alias.canonical_name, productFamily: alias.product_family, category: alias.category, confidence: 0.95 }];
    }

    // Tier 3 — fuzzy, top 5 with any score
    const results = this.fuse?.search(query, { limit: 5 }) ?? [];
    return results.map((r) => ({
      id: r.item.id,
      canonicalName: r.item.canonical_name,
      productFamily: r.item.product_family,
      category: r.item.category,
      confidence: Math.round((1 - (r.score ?? 1)) * 1000) / 1000,
    }));
  }

  /**
   * Returns all active systems (for bulk picker / admin).
   */
  listAll(): CachedSystemRecord[] {
    return this.systemsCache;
  }

  /**
   * Expand system IDs to all sibling IDs sharing the same product_family.
   *
   * NOTE: This method EXISTS per the design spec but is NOT called by the
   * eligibility gate. The eligibility gate uses strict system-id matching
   * (see ELIGIBILITY_POLICY.productFamilyExpansion = false).
   */
  expandSystemIds(systemIds: number[]): number[] {
    const families = new Set(
      systemIds.flatMap((id) => {
        const s = this.systemsCache.find((r) => r.id === id);
        return s ? [s.product_family] : [];
      }),
    );

    return this.systemsCache
      .filter((s) => families.has(s.product_family))
      .map((s) => s.id);
  }

  // ─── Tier 4 (LLM) ─────────────────────────────────────────────────────────

  private async resolveTier4(
    input: string,
    candidates: SystemCandidateDto[],
  ): Promise<ResolveSystemResponseDto> {
    const cacheKey = input.toLowerCase().trim();

    // Check in-memory cache
    const cached = this.llmCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      this.logger.debug(`Tier-4 cache hit for "${input}"`);
      return { ...cached.result, cached: true };
    }

    // LLM unavailable or daily cap reached → Tier 5
    if (!this.anthropic) {
      this.logger.warn('Tier-4 skipped: Anthropic client not configured');
      return this.buildResponse(input, 5, null, null, candidates);
    }

    this.resetDailyCapIfNewDay();
    if (this.llmCallCount >= LLM_DAILY_CAP) {
      this.logger.warn(
        `Tier-4 LLM cap reached (${LLM_DAILY_CAP}/day). Falling back to Tier 5.`,
      );
      return this.buildResponse(input, 5, null, null, candidates);
    }

    if (this.llmCallCount >= LLM_DAILY_CAP * 0.8) {
      this.logger.warn(
        `Tier-4 LLM cap at ${this.llmCallCount}/${LLM_DAILY_CAP} — approaching limit`,
      );
    }

    try {
      this.llmCallCount++;
      const { resolvedId, confidence, reasoning } =
        await this.callLlm(input, candidates);

      const resolvedSystem = resolvedId
        ? this.systemsCache.find((s) => s.id === resolvedId) ?? null
        : null;

      const resolved = resolvedSystem !== null;
      const tier = resolved ? 4 : 5;
      const result = this.buildResponse(
        input,
        tier as 4 | 5,
        resolved ? confidence : null,
        resolvedSystem,
        candidates,
      );

      // Write cache entry
      this.llmCache.set(cacheKey, {
        result,
        expiresAt: Date.now() + LLM_CACHE_TTL_MS,
      });

      // Persist log entry (fire-and-forget)
      void this.persistLog({
        input,
        tier,
        resolvedSystemId: resolvedId ?? null,
        confidence: resolved ? confidence : null,
        candidates,
        llmReasoning: reasoning,
        cached: false,
      });

      return result;
    } catch (err) {
      this.logger.error(`Tier-4 LLM error for "${input}": ${(err as Error).message}`);
      return this.buildResponse(input, 5, null, null, candidates);
    }
  }

  private async callLlm(
    input: string,
    candidates: SystemCandidateDto[],
  ): Promise<{ resolvedId: number | null; confidence: number; reasoning: string }> {
    const candidateList = candidates
      .map(
        (c, i) =>
          `${i + 1}. id=${c.id} | "${c.canonicalName}" | family=${c.productFamily} | category=${c.category} | confidence=${c.confidence}`,
      )
      .join('\n');

    const prompt = `You are a system name resolver for a legal technology vendor matching platform.

The user entered this system name: "${input}"

Top matching canonical systems from our database:
${candidateList}

Choose the single best match for the user's input, or respond with UNRESOLVED if none is a confident match.
Respond with valid JSON only — no markdown, no commentary:
{"system_id": <integer or null>, "confidence": <0.00–1.00>, "reasoning": "<one sentence>"}`;

    const response = await this.anthropic!.messages.create({
      model: this.llmModel,
      max_tokens: 256,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }],
    });

    let text = (response.content[0] as { type: string; text: string }).text.trim();
    // Strip markdown code fences if the model wraps the JSON (common with Haiku)
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    const parsed = JSON.parse(text) as {
      system_id: number | null;
      confidence: number;
      reasoning: string;
    };

    return {
      resolvedId: parsed.system_id ?? null,
      confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.8)),
      reasoning: parsed.reasoning ?? '',
    };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private buildResponse(
    input: string,
    tier: 1 | 2 | 3 | 4 | 5,
    confidence: number | null,
    system: CachedSystemRecord | null,
    candidates: SystemCandidateDto[],
  ): ResolveSystemResponseDto {
    return {
      input,
      resolved: system !== null,
      tier,
      confidence: confidence !== null ? Math.round(confidence * 1000) / 1000 : null,
      system: system
        ? {
            id: system.id,
            canonicalName: system.canonical_name,
            productFamily: system.product_family,
            category: system.category,
            confidence: confidence ?? 0,
          }
        : null,
      candidates,
      eligibilityPolicy: ELIGIBILITY_POLICY,
    };
  }

  private toCandidate(sys: CachedSystemRecord, confidence: number): SystemCandidateDto {
    return {
      id: sys.id,
      canonicalName: sys.canonical_name,
      productFamily: sys.product_family,
      category: sys.category,
      confidence: Math.round(confidence * 1000) / 1000,
    };
  }

  private resetDailyCapIfNewDay(): void {
    const today = new Date().toDateString();
    if (today !== this.llmCallDate) {
      this.llmCallCount = 0;
      this.llmCallDate = today;
    }
  }

  private async persistLog(params: {
    input: string;
    tier: number;
    resolvedSystemId: number | null;
    confidence: number | null;
    candidates: SystemCandidateDto[];
    llmReasoning: string;
    cached: boolean;
  }): Promise<void> {
    try {
      const entry = this.logRepo.create({
        input: params.input,
        tier: params.tier,
        resolved_system_id: params.resolvedSystemId,
        confidence: params.confidence,
        candidates_json: params.candidates.map((c) => ({
          id: c.id,
          canonicalName: c.canonicalName,
          confidence: c.confidence,
        })),
        llm_reasoning: params.llmReasoning,
        cached: params.cached,
      });
      await this.logRepo.save(entry);
    } catch (err) {
      this.logger.error(`Failed to persist resolver log: ${(err as Error).message}`);
    }
  }
}
