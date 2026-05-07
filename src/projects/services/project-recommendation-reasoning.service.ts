import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Anthropic from '@anthropic-ai/sdk';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { VendorClient } from '../../vendors/entities/vendor-client.entity';
import { RecommendationReasoningCache } from '../entities/recommendation-reasoning-cache.entity';

// Kept for backward compatibility with project-recommendations.service.ts
export type MatchReasonSource = 'claude' | 'fallback';
export interface MatchReason {
  text: string;
  source: MatchReasonSource;
}

export interface ResolvedSystemContext {
  id: number;
  canonicalName: string;
  productFamily: string;
}

const CACHE_TTL_DAYS = 7;
const RICH_RANK_LIMIT = 3;
const LIGHT_RANK_LIMIT = 10;
const DAILY_CAP_SOFT_ALERT = 200;
const DAILY_CAP_DEFAULT = 500;

export type ReasoningDebugSource =
  | 'llm-cached'
  | 'llm-generated'
  | 'unavailable';

export interface ReasoningResult {
  text: string;
  source: ReasoningDebugSource;
}

@Injectable()
export class ProjectRecommendationReasoningService {
  private readonly logger = new Logger(
    ProjectRecommendationReasoningService.name,
  );

  private readonly primaryModel: string;
  private readonly secondaryModel: string;
  private readonly anthropicClient: Anthropic | null;
  private readonly dailyCap: number;
  private dailyCallCount = 0;
  private dailyCapResetAt: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(RecommendationReasoningCache)
    private readonly cacheRepo: Repository<RecommendationReasoningCache>,
    @InjectRepository(VendorClient)
    private readonly vendorClientRepo: Repository<VendorClient>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    const apiKey = String(
      this.configService.get<string>('Anthropic_API_Key') || '',
    ).trim();

    this.primaryModel = String(
      this.configService.get<string>('ANTHROPIC_REASONING_MODEL_PRIMARY') ||
        'claude-sonnet-4-5',
    ).trim();

    this.secondaryModel = String(
      this.configService.get<string>('ANTHROPIC_REASONING_MODEL_SECONDARY') ||
        'claude-haiku-4-5',
    ).trim();

    const capRaw = Number(
      this.configService.get<string>('ANTHROPIC_REASONING_DAILY_CAP') ??
        DAILY_CAP_DEFAULT,
    );
    this.dailyCap = Number.isFinite(capRaw) && capRaw > 0 ? capRaw : DAILY_CAP_DEFAULT;
    this.dailyCapResetAt = this.nextMidnightUtc();

    this.anthropicClient = apiKey
      ? new Anthropic({ apiKey, timeout: 15_000, maxRetries: 1 })
      : null;

    if (!this.anthropicClient) {
      this.logger.warn(
        'Anthropic_API_Key is missing — reasoning service disabled.',
      );
    }
  }

  private nextMidnightUtc(): number {
    const now = new Date();
    return Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
    );
  }

  private checkAndIncrementDailyCap(): boolean {
    if (Date.now() >= this.dailyCapResetAt) {
      this.dailyCallCount = 0;
      this.dailyCapResetAt = this.nextMidnightUtc();
    }
    if (this.dailyCallCount >= this.dailyCap) {
      this.logger.error(
        `reasoning daily hard cap reached (${this.dailyCap}) — returning null without API call`,
      );
      return false;
    }
    this.dailyCallCount++;
    if (this.dailyCallCount === DAILY_CAP_SOFT_ALERT) {
      this.logger.warn(
        `reasoning daily call count hit soft alert threshold (${DAILY_CAP_SOFT_ALERT} / ${this.dailyCap})`,
      );
    }
    return true;
  }

  /**
   * Returns cached reasoning text for (project, vendor) if not expired,
   * otherwise generates fresh reasoning and upserts into cache.
   *
   * Rank > 10  → null immediately (no API call, no cache check).
   * Rank 1-3   → rich 2-3 sentence prompt, claude-sonnet model.
   * Rank 4-10  → 1-sentence prompt, claude-haiku model.
   *
   * On generation failure → returns null and logs error.
   * Does not block the recommendation response.
   */
  async getCachedOrGenerate(
    project: Project,
    vendor: Vendor,
    resolvedSystem: ResolvedSystemContext | null,
    rank: number,
  ): Promise<ReasoningResult | null> {
    if (rank > LIGHT_RANK_LIMIT) {
      return null;
    }

    if (!this.anthropicClient) {
      return null;
    }

    // Cache hit check — does not count against daily cap
    const now = new Date();
    const cached = await this.cacheRepo.findOne({
      where: {
        project_id: project.id,
        vendor_id: vendor.id,
        expires_at: MoreThan(now),
      },
    });

    if (cached) {
      this.logger.debug(
        `reasoning cache hit projectId=${project.id} vendorId=${vendor.id} rank=${rank}`,
      );
      return { text: cached.reasoning, source: 'llm-cached' };
    }

    // Cache miss — check daily cap before making API call
    if (!this.checkAndIncrementDailyCap()) {
      return null;
    }

    // Generate
    try {
      const reasoning = await this.generateReasoning(
        project,
        vendor,
        resolvedSystem,
        rank,
      );

      if (!reasoning) {
        return null;
      }

      const model =
        rank <= RICH_RANK_LIMIT ? this.primaryModel : this.secondaryModel;
      const expiresAt = new Date(
        now.getTime() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000,
      );

      await this.cacheRepo.upsert(
        {
          project_id: project.id,
          vendor_id: vendor.id,
          reasoning,
          model_used: model,
          vendor_rank: rank,
          generated_at: now,
          expires_at: expiresAt,
        },
        ['project_id', 'vendor_id'],
      );

      this.logger.debug(
        `reasoning generated+cached projectId=${project.id} vendorId=${vendor.id} rank=${rank} model=${model} dailyCount=${this.dailyCallCount}`,
      );

      return { text: reasoning, source: 'llm-generated' };
    } catch (error) {
      this.logger.error(
        `reasoning generation failed projectId=${project.id} vendorId=${vendor.id} rank=${rank}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return null;
    }
  }

  private async generateReasoning(
    project: Project,
    vendor: Vendor,
    resolvedSystem: ResolvedSystemContext | null,
    rank: number,
  ): Promise<string | null> {
    const isRich = rank <= RICH_RANK_LIMIT;
    const model =
      rank <= RICH_RANK_LIMIT ? this.primaryModel : this.secondaryModel;

    const [familySystems, clientNames] = await Promise.all([
      resolvedSystem
        ? this.getVendorSystemsInFamily(vendor.id, resolvedSystem.productFamily)
        : Promise.resolve([] as string[]),
      this.getVendorClientNames(vendor.id, 3),
    ]);

    const certifications = this.buildCertificationsList(vendor);
    const partnerships = this.buildPartnershipsList(vendor);

    const systemPrompt = `You are a legal technology vendor analyst. Your job is to write a brief, factual, convincing explanation of why a specific vendor fits a specific legal IT project.

CRITICAL RULES — VIOLATING THESE WILL RESULT IN LEGAL AND COMMERCIAL HARM:
1. Use ONLY the facts provided in the VENDOR DATA section. Do NOT invent, estimate, or extrapolate any numbers, statistics, dates, project counts, or specific past engagements.
2. If the vendor data does not include a specific count or year, do NOT include one in the output. Phrases like "served 12 AmLaw firms" or "completed 3 projects in 2024" are FORBIDDEN unless those exact numbers appear in the vendor data.
3. Reference vendor's named clients, partnerships, and certifications ONLY if they appear verbatim in the data. Do not paraphrase or embellish.
4. If a vendor has weak alignment to the project, say so honestly using vague language ("coverage of similar systems", "general experience") rather than inventing specifics.
5. Output plain text only. No markdown, no bullets, no headers, no quotation marks around the response.

TONE: Direct, professional, fact-based. No marketing language. No superlatives unless backed by data ("top-tier" is allowed only if vendor tier is Tier 1).`;

    let userPrompt: string;

    if (isRich) {
      const otherSystems = await this.getVendorOtherSystems(
        vendor.id,
        resolvedSystem?.productFamily ?? null,
        3,
      );

      userPrompt = `Generate 2-3 sentences explaining why this vendor matches this project.

PROJECT:
- Resolved system: ${resolvedSystem?.canonicalName ?? 'Not specified'} (family: ${resolvedSystem?.productFamily ?? 'Not specified'})
- Project category: ${project.projectCategory?.label ?? project.project_category_custom ?? 'Not specified'}
- Project objective: ${project.project_objective ?? 'Not specified'}
- Business requirements: ${project.business_requirements ?? 'Not specified'}
- Technical requirements: ${project.technical_requirements ?? 'Not specified'}

VENDOR (rank #${rank}):
- Name: ${vendor.brand_name}
- Tier: ${vendor.listing_tier ?? 'Not specified'}
- Vendor's systems in the ${resolvedSystem?.productFamily ?? ''} family: ${familySystems.length > 0 ? familySystems.join(', ') : 'None listed'}
- Vendor's other notable systems: ${otherSystems.length > 0 ? otherSystems.join(', ') : 'None listed'}
- Named key legal clients (from DB): ${clientNames.length > 0 ? clientNames.join(', ') : 'None listed'}
- Named certifications (from DB): ${certifications || 'None listed'}
- Named partnerships (from DB): ${partnerships || 'None listed'}
- ILTA member: ${vendor.ilta_present ? 'Yes' : 'No'}

Write the reasoning.`;
    } else {
      const strongest = this.pickStrongestCredential(
        partnerships,
        certifications,
        clientNames,
      );

      userPrompt = `Generate ONE sentence explaining why this vendor is a relevant match for this project.

PROJECT:
- Resolved system: ${resolvedSystem?.canonicalName ?? 'Not specified'}

VENDOR (rank #${rank}):
- Name: ${vendor.brand_name}
- Vendor's systems in the ${resolvedSystem?.productFamily ?? ''} family: ${familySystems.length > 0 ? familySystems.join(', ') : 'None listed'}
- Strongest credential: ${strongest}

Write one sentence.`;
    }

    const response = await this.anthropicClient!.messages.create({
      model,
      max_tokens: isRich ? 250 : 80,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text =
      response.content[0]?.type === 'text'
        ? response.content[0].text.trim()
        : '';

    return text || null;
  }

  private async getVendorSystemsInFamily(
    vendorId: number,
    productFamily: string,
  ): Promise<string[]> {
    const rows: Array<{ canonical_name: string }> =
      await this.dataSource.query(
        `SELECT s.canonical_name
         FROM vendor_systems vs
         INNER JOIN systems s ON s.id = vs.system_id
         WHERE vs.vendor_id = ? AND s.product_family = ? AND s.is_active = 1
         ORDER BY s.canonical_name`,
        [vendorId, productFamily],
      );
    return rows.map((r) => r.canonical_name);
  }

  private async getVendorOtherSystems(
    vendorId: number,
    excludeFamily: string | null,
    limit: number,
  ): Promise<string[]> {
    if (excludeFamily) {
      const rows: Array<{ canonical_name: string }> =
        await this.dataSource.query(
          `SELECT s.canonical_name
           FROM vendor_systems vs
           INNER JOIN systems s ON s.id = vs.system_id
           WHERE vs.vendor_id = ? AND s.product_family != ? AND s.is_active = 1
           ORDER BY s.canonical_name
           LIMIT ?`,
          [vendorId, excludeFamily, limit],
        );
      return rows.map((r) => r.canonical_name);
    }

    const rows: Array<{ canonical_name: string }> =
      await this.dataSource.query(
        `SELECT s.canonical_name
         FROM vendor_systems vs
         INNER JOIN systems s ON s.id = vs.system_id
         WHERE vs.vendor_id = ? AND s.is_active = 1
         ORDER BY s.canonical_name
         LIMIT ?`,
        [vendorId, limit],
      );
    return rows.map((r) => r.canonical_name);
  }

  private async getVendorClientNames(
    vendorId: number,
    limit: number,
  ): Promise<string[]> {
    const clients = await this.vendorClientRepo.find({
      where: { vendor_id: vendorId },
      order: { display_order: 'ASC' },
      take: limit,
      select: ['client_name'],
    });
    return clients.map((c) => c.client_name);
  }

  private buildCertificationsList(vendor: Vendor): string {
    const certs: string[] = [];
    if (vendor.has_soc2 === 'Y') certs.push('SOC 2');
    if (vendor.has_iso27001 === 'Y') certs.push('ISO 27001');
    return certs.join(', ');
  }

  private buildPartnershipsList(vendor: Vendor): string {
    const partners: string[] = [];
    if (vendor.is_microsoft_partner) partners.push('Microsoft Partner');
    if (vendor.is_servicenow_partner) partners.push('ServiceNow Partner');
    if (vendor.is_workday_partner) partners.push('Workday Partner');
    return partners.join(', ');
  }

  private pickStrongestCredential(
    partnerships: string,
    certifications: string,
    clientNames: string[],
  ): string {
    if (partnerships) return partnerships.split(', ')[0];
    if (certifications) return certifications.split(', ')[0];
    if (clientNames.length > 0) return `key client: ${clientNames[0]}`;
    return 'General legal IT experience';
  }
}
