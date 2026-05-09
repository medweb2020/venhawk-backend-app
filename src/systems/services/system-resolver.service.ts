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
  RelatedSystemDto,
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

  // Vendor-count cache (per system_id) — refreshed every 5 minutes
  private vendorCountCache: Map<number, number> | null = null;
  private vendorCountCacheExpiry = 0;
  private readonly VENDOR_COUNT_CACHE_TTL_MS = 5 * 60 * 1000;

  constructor(
    @InjectRepository(System)
    private readonly systemRepo: Repository<System>,
    @InjectRepository(SystemResolverLog)
    private readonly logRepo: Repository<SystemResolverLog>,
    private readonly configService: ConfigService,
  ) {
    // Read directly from process.env first — bypasses ConfigService scoping issues.
    const apiKey =
      process.env['ANTHROPIC_API_KEY'] ||
      process.env['Anthropic_API_Key'] ||
      this.configService.get<string>('ANTHROPIC_API_KEY') ||
      this.configService.get<string>('Anthropic_API_Key') ||
      '';
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
   * Order: Tier 1 exact → Tier 2 alias → Tier 2.5 word-tokenization
   *        → Tier 3 fuzzy → Tier 4 LLM → Tier 5 unresolved
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

    // Tier 2.5 — word-tokenization for multi-word inputs.
    // Splits input on whitespace and checks each token against Tier 1/2.
    // Treats non-matching words (e.g. "Upgrade", "Migration") as context noise.
    if (input.includes(' ')) {
      const tier25Result = await this.resolveTier25(input);
      if (tier25Result !== null) {
        return tier25Result;
      }
      // null → no high-confidence token match, fall through to Tier 3
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
   * Returns all active system IDs in the same product_family as the given
   * systemId. Used by the eligibility gate for family-wide vendor expansion.
   *
   * Returns [systemId] if the system has no family or is the sole member of
   * its family (one-of-a-kind). Reads from the in-memory cache — O(n) on
   * number of systems, no DB round-trip.
   */
  async getSystemIdsInFamily(systemId: number): Promise<number[]> {
    const system = this.systemsCache.find((s) => s.id === systemId);
    if (!system?.product_family) {
      return [systemId];
    }
    const familyIds = this.systemsCache
      .filter((s) => s.product_family === system.product_family)
      .map((s) => s.id);
    return familyIds.length > 0 ? familyIds : [systemId];
  }

  /**
   * Expand system IDs to all sibling IDs sharing the same product_family.
   *
   * NOTE: The eligibility gate now uses getSystemIdsInFamily() for single-system
   * expansion. expandSystemIds() remains available for bulk/admin use cases.
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

  /**
   * Returns sibling systems in the same product_family that have at least one
   * vendor in vendor_systems. Excludes the requesting system itself.
   * Results are sorted by vendorCount descending and capped at `limit`.
   *
   * Vendor counts are cached in-memory for VENDOR_COUNT_CACHE_TTL_MS (5 min)
   * because they change rarely and are queried frequently during empty-state responses.
   */
  async getRelatedSystemsForFamily(
    productFamily: string,
    excludeSystemId: number | null,
    limit: number,
  ): Promise<RelatedSystemDto[]> {
    const vendorCounts = await this.getVendorCountsBySystem();

    return this.systemsCache
      .filter(
        (s) =>
          s.product_family === productFamily &&
          s.id !== excludeSystemId &&
          (vendorCounts.get(s.id) ?? 0) > 0,
      )
      .map((s) => ({
        id: s.id,
        canonicalName: s.canonical_name,
        productFamily: s.product_family,
        vendorCount: vendorCounts.get(s.id) ?? 0,
      }))
      .sort((a, b) => b.vendorCount - a.vendorCount)
      .slice(0, limit);
  }

  /**
   * Fetches vendor counts per system_id from vendor_systems, with a 5-minute
   * in-memory cache. Uses a single aggregation query — no N+1.
   */
  private async getVendorCountsBySystem(): Promise<Map<number, number>> {
    const now = Date.now();
    if (this.vendorCountCache && now < this.vendorCountCacheExpiry) {
      return this.vendorCountCache;
    }

    const rows: Array<{ system_id: number; cnt: string }> =
      await this.systemRepo.manager.query(
        'SELECT system_id, COUNT(*) AS cnt FROM vendor_systems GROUP BY system_id',
      );

    const map = new Map<number, number>();
    for (const row of rows) {
      map.set(Number(row.system_id), Number(row.cnt));
    }

    this.vendorCountCache = map;
    this.vendorCountCacheExpiry = now + this.VENDOR_COUNT_CACHE_TTL_MS;
    return map;
  }

  // ─── Tier 2.5 (word-tokenization) ─────────────────────────────────────────

  /**
   * Splits a multi-word input on whitespace and tests each token individually
   * against Tier 1 (exactMap) and Tier 2 (aliasMap).
   *
   * - Single high-confidence token match → resolve with confidence 0.90
   * - Multiple tokens → different systems → escalate to Tier 4 (ambiguous)
   * - No high-confidence matches → return null (caller falls through to Tier 3)
   */
  private async resolveTier25(input: string): Promise<ResolveSystemResponseDto | null> {
    const tokens = input.split(/\s+/).filter(Boolean);

    type TokenResolution = { token: string; system: CachedSystemRecord; confidence: number };
    const matched: TokenResolution[] = [];

    for (const token of tokens) {
      const t = token.toLowerCase();
      const exact = this.exactMap.get(t);
      if (exact) {
        matched.push({ token, system: exact, confidence: 1.0 });
        continue;
      }
      const alias = this.aliasMap.get(t);
      if (alias) {
        matched.push({ token, system: alias, confidence: 0.95 });
      }
    }

    // Only act on high-confidence (≥ 0.95) token resolutions
    const highConf = matched.filter((r) => r.confidence >= 0.95);
    if (highConf.length === 0) {
      return null;
    }

    const uniqueIds = new Set(highConf.map((r) => r.system.id));

    if (uniqueIds.size === 1) {
      // Clear single winner — other words are project-context noise
      const { system, token } = highConf[0];
      this.logger.debug(
        `Tier 2.5: "${input}" → token "${token}" resolved "${system.canonical_name}" ` +
          `(id=${system.id}); remaining words treated as context noise`,
      );
      return this.buildResponse(input, 2, 0.90, system, []);
    }

    // Multiple tokens resolved to different systems — ambiguous
    const candidates = highConf.map((r) => this.toCandidate(r.system, r.confidence));
    const tokenContext =
      `These tokens in the user's input each resolved to different systems: ` +
      highConf.map((r) => `"${r.token}" → ${r.system.canonical_name}`).join(', ') +
      `. Which is the primary system the user wants help with?`;

    this.logger.debug(`Tier 2.5: "${input}" — ambiguous token resolutions, escalating to Tier 4`);
    return this.resolveTier4(input, candidates, tokenContext);
  }

  // ─── Tier 4 (LLM) ─────────────────────────────────────────────────────────

  private async resolveTier4(
    input: string,
    candidates: SystemCandidateDto[],
    extraContext?: string,
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
        await this.callLlm(input, candidates, extraContext);

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
    extraContext?: string,
  ): Promise<{ resolvedId: number | null; confidence: number; reasoning: string }> {
    const candidateList = candidates
      .map(
        (c, i) =>
          `${i + 1}. id=${c.id} | "${c.canonicalName}" | family=${c.productFamily} | category=${c.category} | confidence=${c.confidence}`,
      )
      .join('\n');

    const contextBlock = extraContext ? `\n${extraContext}\n` : '';

    const prompt = `You are a system name resolver for a legal technology vendor matching platform.

The user entered this system name: "${input}"
${contextBlock}
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
