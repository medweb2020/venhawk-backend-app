import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { createHash } from 'crypto';
import { In, Repository } from 'typeorm';
import { ProjectVendorReason } from '../entities/project-vendor-reason.entity';

export type MatchReasonSource = 'openai' | 'fallback';

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
  private readonly logger = new Logger(ProjectRecommendationReasoningService.name);
  private readonly model: string;
  private readonly topMatchReasoningLimit = 3;
  private readonly maxReasonChars = 420;
  private readonly openAiClient: OpenAI | null;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ProjectVendorReason)
    private readonly projectVendorReasonRepository: Repository<ProjectVendorReason>,
  ) {
    const apiKey = String(this.configService.get<string>('OPENAI_API_KEY') || '').trim();
    const timeoutMs = this.parseTimeoutMs(
      this.configService.get<string>('OPENAI_RECOMMENDATIONS_TIMEOUT_MS'),
    );

    this.model = String(
      this.configService.get<string>('OPENAI_RECOMMENDATIONS_MODEL') ||
        'gpt-4.1-mini',
    ).trim();

    this.openAiClient = apiKey
      ? new OpenAI({
          apiKey,
          timeout: timeoutMs,
          maxRetries: 1,
        })
      : null;

    if (!this.openAiClient) {
      this.logger.warn(
        'OPENAI_API_KEY is missing. Recommendation tooltip reasoning will use fallback copy.',
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

    const fallbackReasons = this.buildFallbackReasonMap(project, candidates);
    const resolvedReasons = new Map<number, MatchReason>(fallbackReasons);

    const topCandidates = candidates.slice(0, this.topMatchReasoningLimit);
    if (topCandidates.length === 0) {
      return resolvedReasons;
    }

    const contextHashByVendorId = new Map<number, string>(
      topCandidates.map((candidate) => [
        candidate.vendorId,
        this.computeReasonContextHash(project, candidate),
      ]),
    );

    const vendorIds = topCandidates.map((candidate) => candidate.vendorId);
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

    for (const candidate of topCandidates) {
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
        source: cached.reason_source === 'openai' ? 'openai' : 'fallback',
      });
    }

    const generatedReasons = await this.generateOpenAiReasons(project, missingCandidates);
    const now = new Date();
    const upsertRows: Partial<ProjectVendorReason>[] = [];

    for (const candidate of missingCandidates) {
      const generatedText = generatedReasons.get(candidate.vendorId);
      const fallbackReason = fallbackReasons.get(candidate.vendorId);

      const resolvedReason = generatedText
        ? { text: generatedText, source: 'openai' as const }
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

  private async generateOpenAiReasons(
    project: RecommendationProjectReasoningInput,
    candidates: RecommendationVendorReasoningInput[],
  ): Promise<Map<number, string>> {
    if (!this.openAiClient || candidates.length === 0) {
      return new Map();
    }

    try {
      const completion = await this.openAiClient.chat.completions.create({
        model: this.model,
        temperature: 0.1,
        max_tokens: 320,
        messages: [
          {
            role: 'system',
            content:
              'You are Venhawk, a B2B vendor matching assistant. Generate concise match explanations for tooltips. Return strict JSON only with shape {"reasons":[{"vendorId":123,"reason":"..."}]}. Each reason must be exactly 2 short sentences, mention both project fit and industry relevance, and avoid formulas or internal scoring math.',
          },
          {
            role: 'user',
            content: JSON.stringify(
              {
                task: 'Create reasoning for top vendor matches',
                constraints: {
                  exactSentencesPerReason: 2,
                  maxCharactersPerReason: this.maxReasonChars,
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

      const rawContent = completion.choices?.[0]?.message?.content || '';
      return this.parseModelReasonResponse(rawContent, candidates);
    } catch (error) {
      this.logger.warn(
        `OpenAI reasoning generation failed for project "${project.projectTitle}": ${this.getErrorMessage(
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
    const allowedVendorIds = new Set(candidates.map((candidate) => candidate.vendorId));

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
    const normalized = String(reason || '').replace(/\s+/g, ' ').trim();
    if (!normalized) {
      return '';
    }

    const sentenceMatches =
      normalized.match(/[^.!?]+[.!?]?/g)?.map((item) => item.trim()).filter(Boolean) ||
      [];

    const firstTwoSentences = sentenceMatches.slice(0, 2).join(' ').trim();
    const boundedBySentences = firstTwoSentences || normalized;

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
      project,
      candidate,
    });

    return createHash('sha1').update(hashInput).digest('hex');
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown error';
  }
}
