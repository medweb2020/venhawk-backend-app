import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

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

  constructor(private readonly configService: ConfigService) {
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
    project: RecommendationProjectReasoningInput,
    candidates: RecommendationVendorReasoningInput[],
  ): Promise<Map<number, MatchReason>> {
    const topCandidates = candidates.slice(0, this.topMatchReasoningLimit);
    if (topCandidates.length === 0) {
      return new Map();
    }

    const fallbackReasons = this.buildFallbackReasonMap(project, topCandidates);
    if (!this.openAiClient) {
      return fallbackReasons;
    }

    try {
      const completion = await this.openAiClient.chat.completions.create({
        model: this.model,
        temperature: 0.45,
        max_tokens: 420,
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
                vendors: topCandidates,
              },
              null,
              2,
            ),
          },
        ],
      });

      const rawContent = completion.choices?.[0]?.message?.content || '';
      const parsedReasons = this.parseModelReasonResponse(rawContent, topCandidates);

      if (parsedReasons.size === 0) {
        return fallbackReasons;
      }

      const mergedReasons = new Map<number, MatchReason>(fallbackReasons);
      for (const [vendorId, reasonText] of parsedReasons.entries()) {
        mergedReasons.set(vendorId, {
          text: reasonText,
          source: 'openai',
        });
      }

      return mergedReasons;
    } catch (error) {
      this.logger.warn(
        `OpenAI reasoning generation failed for project "${project.projectTitle}": ${this.getErrorMessage(
          error,
        )}`,
      );
      return fallbackReasons;
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
    topCandidates: RecommendationVendorReasoningInput[],
  ): Map<number, string> {
    const response = this.parseJsonContent<ReasoningModelResponse>(rawContent);
    const parsed = new Map<number, string>();
    const allowedVendorIds = new Set(topCandidates.map((candidate) => candidate.vendorId));

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
    const boundedText = firstTwoSentences || normalized;

    return boundedText;
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

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown error';
  }
}
