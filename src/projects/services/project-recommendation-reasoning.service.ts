import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'crypto';
import { In, Repository } from 'typeorm';
import { ProjectVendorReason } from '../entities/project-vendor-reason.entity';

export type MatchReasonSource = 'claude' | 'fallback';

export interface MatchReason {
  text: string;
  source: MatchReasonSource;
}

export interface RecommendationProjectReasoningInput {
  projectTitle: string;
  industry: string;
  category: string;
  systemName: string;
  projectObjective: string;
  businessRequirements: string;
  technicalRequirements: string;
}

export interface RecommendationVendorReasoningInput {
  vendorId: number;
  vendorName: string;
  matchingScore: number;
  tier: string;
  legalFocusLevel: string;
  specialty: string;
  serviceDomains: string[];
  legalTechStack: string[];
  topStrengths: string[];
  partnerSignals: string[];
  rating: number;
  reviewCount: number;
  caseStudyCount: number;
}

interface ReasoningModelResponse {
  reasons?: Array<{
    vendorId: number;
    reason: string;
  }>;
}

@Injectable()
export class ProjectRecommendationReasoningService {
  private readonly logger = new Logger(
    ProjectRecommendationReasoningService.name,
  );
  private readonly model: string;
  private readonly aiReasoningLimit = 3;
  private readonly minReasonSentences = 2;
  private readonly maxReasonSentences = 2;
  private readonly maxReasonChars = 260;
  private readonly anthropicClient: Anthropic | null;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ProjectVendorReason)
    private readonly projectVendorReasonRepository: Repository<ProjectVendorReason>,
  ) {
    const apiKey = String(
      this.configService.get<string>('Anthropic_API_Key') || '',
    ).trim();
    const timeoutMs = this.parseTimeoutMs(
      this.configService.get<string>('ANTHROPIC_RECOMMENDATIONS_TIMEOUT_MS'),
    );

    this.model = String(
      this.configService.get<string>('ANTHROPIC_RECOMMENDATIONS_MODEL') ||
        'claude-sonnet-4-20250514',
    ).trim();

    this.anthropicClient = apiKey
      ? new Anthropic({
          apiKey,
          timeout: timeoutMs,
          maxRetries: 1,
        })
      : null;

    if (!this.anthropicClient) {
      this.logger.warn(
        'Anthropic_API_Key is missing. Recommendation reasoning will use fallback copy.',
      );
    }
  }

  async generateTopMatchReasons(
    projectId: number,
    project: RecommendationProjectReasoningInput,
    candidates: RecommendationVendorReasoningInput[],
  ): Promise<Map<number, MatchReason>> {
    if (candidates.length === 0) {
      return new Map();
    }

    const aiCandidates = candidates.slice(0, this.aiReasoningLimit);
    const fallbackReasons = this.buildFallbackReasonMap(project, candidates);
    const resolvedReasons = new Map<number, MatchReason>(fallbackReasons);
    if (aiCandidates.length === 0) {
      return resolvedReasons;
    }

    const contextHashByVendorId = new Map<number, string>(
      aiCandidates.map((candidate) => [
        candidate.vendorId,
        this.computeReasonContextHash(project, candidate),
      ]),
    );

    const vendorIds = aiCandidates.map((candidate) => candidate.vendorId);
    const cachedReasons = await this.projectVendorReasonRepository.find({
      where: {
        project_id: projectId,
        vendor_id: In(vendorIds),
      },
    });

    const cachedByVendorId = new Map<number, ProjectVendorReason>(
      cachedReasons.map((reason) => [reason.vendor_id, reason]),
    );

    const missingCandidates: RecommendationVendorReasoningInput[] = [];

    for (const candidate of aiCandidates) {
      const cached = cachedByVendorId.get(candidate.vendorId);
      const expectedHash = contextHashByVendorId.get(candidate.vendorId) || '';

      if (!cached || cached.context_hash !== expectedHash) {
        missingCandidates.push(candidate);
        continue;
      }

      const cachedText = this.sanitizeReason(cached.reason_text);
      if (!cachedText) {
        missingCandidates.push(candidate);
        continue;
      }

      resolvedReasons.set(candidate.vendorId, {
        text: cachedText,
        source: cached.reason_source === 'claude' ? 'claude' : 'fallback',
      });
    }

    const generatedReasons = await this.generateAiReasons(
      projectId,
      project,
      missingCandidates,
    );
    const now = new Date();
    const upsertRows: Partial<ProjectVendorReason>[] = [];

    for (const candidate of missingCandidates) {
      const generatedText = generatedReasons.get(candidate.vendorId);
      const fallbackReason = fallbackReasons.get(candidate.vendorId);

      const resolvedReason = generatedText
        ? { text: generatedText, source: 'claude' as const }
        : fallbackReason || {
            text: this.buildFallbackReason(project, candidate),
            source: 'fallback' as const,
          };

      resolvedReasons.set(candidate.vendorId, resolvedReason);

      upsertRows.push({
        project_id: projectId,
        vendor_id: candidate.vendorId,
        reason_text: resolvedReason.text,
        reason_source: resolvedReason.source,
        context_hash: contextHashByVendorId.get(candidate.vendorId) || '',
        model: this.model || null,
        computed_at: now,
      });
    }

    if (upsertRows.length > 0) {
      try {
        await this.projectVendorReasonRepository.upsert(upsertRows, [
          'project_id',
          'vendor_id',
        ]);
      } catch (error) {
        this.logger.warn(
          `Failed to persist recommendation reasons for project ${projectId}: ${this.getErrorMessage(
            error,
          )}`,
        );
      }
    }

    return resolvedReasons;
  }

  private async generateAiReasons(
    projectId: number,
    project: RecommendationProjectReasoningInput,
    candidates: RecommendationVendorReasoningInput[],
  ): Promise<Map<number, string>> {
    if (!this.anthropicClient || candidates.length === 0) {
      return new Map();
    }

    const startedAt = Date.now();
    try {
      const message = await this.anthropicClient.messages.create({
        model: this.model,
        max_tokens: 2048,
        system:
          'You are Venhawk, a B2B vendor matching assistant. Generate focused match explanations for vendor recommendations. Return strict JSON only with shape {"reasons":[{"vendorId":123,"reason":"..."}]}. Each reason must be exactly 2 short sentences, mention concrete system/category fit, reference legal industry relevance, and avoid marketing fluff, repetition, formulas, or internal scoring math.',
        messages: [
          {
            role: 'user',
            content: JSON.stringify(
              {
                task: 'Create reasoning for top vendor matches',
                constraints: {
                  minSentencesPerReason: this.minReasonSentences,
                  maxSentencesPerReason: this.maxReasonSentences,
                  maxCharactersPerReason: this.maxReasonChars,
                  style: 'specific, concise, outcome-focused',
                  audience: 'business buyer',
                },
                project,
                vendors: candidates,
              },
              null,
              2,
            ),
          },
        ],
      });

      const rawContent =
        message.content[0]?.type === 'text' ? message.content[0].text : '';
      const parsedReasons = this.parseModelReasonResponse(rawContent, candidates);
      this.logger.log(
        `claude reasoning completed projectId=${projectId} requestedCount=${candidates.length} generatedCount=${parsedReasons.size} durationMs=${Date.now() - startedAt}`,
      );
      return parsedReasons;
    } catch (error) {
      this.logger.warn(
        `Claude reasoning generation failed for projectId=${projectId} projectTitle="${project.projectTitle}" durationMs=${Date.now() - startedAt}: ${this.getErrorMessage(
          error,
        )}`,
      );
      return new Map();
    }
  }

  private parseTimeoutMs(value: string | undefined): number {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 2000) {
      return parsed;
    }

    return 10000;
  }

  private parseModelReasonResponse(
    rawContent: string,
    candidates: RecommendationVendorReasoningInput[],
  ): Map<number, string> {
    const response = this.parseJsonContent<ReasoningModelResponse>(rawContent);
    const parsed = new Map<number, string>();
    const allowedVendorIds = new Set(
      candidates.map((candidate) => candidate.vendorId),
    );

    if (!response || !Array.isArray(response.reasons)) {
      return parsed;
    }

    for (const entry of response.reasons) {
      if (!entry || !allowedVendorIds.has(Number(entry.vendorId))) {
        continue;
      }

      const sanitizedReason = this.sanitizeReason(entry.reason);
      if (!sanitizedReason) {
        continue;
      }

      parsed.set(Number(entry.vendorId), sanitizedReason);
    }

    return parsed;
  }

  private parseJsonContent<T>(rawContent: string): T | null {
    const trimmed = String(rawContent || '').trim();
    if (!trimmed) {
      return null;
    }

    const normalized = trimmed
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const direct = this.tryJsonParse<T>(normalized);
    if (direct) {
      return direct;
    }

    const jsonMatch = normalized.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }

    return this.tryJsonParse<T>(jsonMatch[0]);
  }

  private tryJsonParse<T>(value: string): T | null {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  private sanitizeReason(reason: string): string {
    const normalized = String(reason || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!normalized) {
      return '';
    }

    const sentenceMatches =
      normalized
        .match(/[^.!?]+[.!?]?/g)
        ?.map((item) => item.trim())
        .filter(Boolean) || [];

    const boundedBySentences =
      sentenceMatches.slice(0, this.maxReasonSentences).join(' ').trim() ||
      normalized;

    const boundedSentenceCount = this.countSentences(boundedBySentences);
    if (boundedSentenceCount < this.minReasonSentences) {
      return '';
    }

    if (boundedBySentences.length <= this.maxReasonChars) {
      return boundedBySentences;
    }

    return `${boundedBySentences.slice(0, this.maxReasonChars - 3).trimEnd()}...`;
  }

  private buildFallbackReasonMap(
    project: RecommendationProjectReasoningInput,
    candidates: RecommendationVendorReasoningInput[],
  ): Map<number, MatchReason> {
    const reasons = new Map<number, MatchReason>();

    for (const candidate of candidates) {
      reasons.set(candidate.vendorId, {
        text: this.buildFallbackReason(project, candidate),
        source: 'fallback',
      });
    }

    return reasons;
  }

  private buildFallbackReason(
    project: RecommendationProjectReasoningInput,
    candidate: RecommendationVendorReasoningInput,
  ): string {
    const industryLabel = project.industry || 'your industry';
    const categoryLabel = project.category || 'this project category';
    const systemLabel =
      candidate.legalTechStack[0] ||
      project.systemName ||
      candidate.specialty ||
      'the requested platform stack';

    const strengths = candidate.topStrengths.slice(0, 2).join(' and ');
    const secondSentence = strengths
      ? `Strengths in ${strengths} support low-risk delivery.`
      : 'Their delivery profile supports a stable rollout.';
    const fallback = `${candidate.vendorName} fits this ${industryLabel} ${categoryLabel} project with relevant ${systemLabel} experience. ${secondSentence}`;

    return this.sanitizeReason(fallback);
  }

  private computeReasonContextHash(
    project: RecommendationProjectReasoningInput,
    candidate: RecommendationVendorReasoningInput,
  ): string {
    const hashInput = JSON.stringify({
      model: this.model,
      reasonPolicy: {
        minSentences: this.minReasonSentences,
        maxSentences: this.maxReasonSentences,
        maxChars: this.maxReasonChars,
      },
      project,
      candidate,
    });

    return createHash('sha1').update(hashInput).digest('hex');
  }

  private countSentences(value: string): number {
    return (
      value
        .match(/[^.!?]+[.!?]?/g)
        ?.map((item) => item.trim())
        .filter(Boolean).length || 0
    );
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown error';
  }
}
