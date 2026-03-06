import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { createHash } from 'crypto';
import {
  getAllowedSystemsForCategory,
  normalizeMatchingText,
} from '../constants/project-matching.constants';

type ProjectSystemResolutionSource = 'exact' | 'openai' | 'fallback';

interface ProjectSystemResolutionResponse {
  resolvedLabel?: string | null;
  matchedAllowedSystem?: string | null;
  searchTerms?: string[] | null;
}

export interface ProjectSystemResolutionContext {
  legalTechStackTerms?: string[];
  vendorCategories?: string[];
}

export interface ResolvedProjectSystem {
  rawInput: string;
  resolvedLabel: string;
  matchedAllowedSystem: string | null;
  searchTerms: string[];
  source: ProjectSystemResolutionSource;
}

@Injectable()
export class ProjectSystemResolutionService {
  private readonly logger = new Logger(ProjectSystemResolutionService.name);
  private readonly openAiClient: OpenAI | null;
  private readonly model: string;
  private readonly promptVersion = 'project-system-resolution-v1';
  private readonly resolutionCache = new Map<string, ResolvedProjectSystem | null>();
  private readonly inFlightResolutions = new Map<
    string,
    Promise<ResolvedProjectSystem | null>
  >();
  private readonly leadingNoisePatterns = [
    /^(?:i|we)\s+(?:need|want)(?:\s+\w+){0,4}?\s+(?:for|with|on)\s+/i,
    /^(?:looking|searching)\s+for\s+(?:help|support)?\s*(?:with|for|on)?\s*/i,
    /^(?:need|want|require)\s+(?:help|support|assistance)\s+(?:with|for|on)\s+/i,
    /^(?:help|support|assistance)\s+(?:with|for|on)\s+/i,
    /^(?:implementation|migration|upgrade|optimization|consulting)\s+(?:for|of|with)\s+/i,
  ];
  private readonly ignoredTerms = new Set([
    'a',
    'an',
    'and',
    'for',
    'help',
    'i',
    'implementation',
    'me',
    'migration',
    'need',
    'of',
    'on',
    'optimization',
    'our',
    'platform',
    'please',
    'regarding',
    'some',
    'support',
    'system',
    'the',
    'to',
    'upgrade',
    'us',
    'we',
    'with',
    'work',
    'working',
    'want',
  ]);

  constructor(private readonly configService: ConfigService) {
    const apiKey = String(
      this.configService.get<string>('OPENAI_API_KEY') || '',
    ).trim();
    const timeoutMs = this.parseTimeoutMs(
      this.configService.get<string>('OPENAI_RECOMMENDATIONS_TIMEOUT_MS'),
    );

    this.model = String(
      this.configService.get<string>('OPENAI_SYSTEM_RESOLUTION_MODEL') ||
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
  }

  getPolicyVersion(): string {
    return JSON.stringify({
      promptVersion: this.promptVersion,
      model: this.model,
      openAiEnabled: Boolean(this.openAiClient),
      fallbackPatternCount: this.leadingNoisePatterns.length,
    });
  }

  async resolveProjectSystem(
    projectCategory: string,
    rawSystemName: string,
    context: ProjectSystemResolutionContext = {},
  ): Promise<ResolvedProjectSystem | null> {
    const rawInput = String(rawSystemName || '').trim();
    if (!rawInput) {
      return null;
    }

    const cacheKey = this.buildCacheKey(projectCategory, rawInput, context);
    if (this.resolutionCache.has(cacheKey)) {
      return this.resolutionCache.get(cacheKey) || null;
    }

    const existingResolution = this.inFlightResolutions.get(cacheKey);
    if (existingResolution) {
      return existingResolution;
    }

    const resolutionPromise = this.resolveProjectSystemInternal(
      projectCategory,
      rawInput,
      context,
    ).finally(() => {
      if (this.inFlightResolutions.get(cacheKey) === resolutionPromise) {
        this.inFlightResolutions.delete(cacheKey);
      }
    });

    this.inFlightResolutions.set(cacheKey, resolutionPromise);
    const resolved = await resolutionPromise;
    this.resolutionCache.set(cacheKey, resolved);
    return resolved;
  }

  private async resolveProjectSystemInternal(
    projectCategory: string,
    rawInput: string,
    context: ProjectSystemResolutionContext,
  ): Promise<ResolvedProjectSystem | null> {
    const allowedSystems = getAllowedSystemsForCategory(projectCategory);
    const deterministicResolution = this.resolveDeterministically(
      rawInput,
      allowedSystems,
      context,
    );
    if (deterministicResolution) {
      return deterministicResolution;
    }

    const aiResolution = await this.resolveWithOpenAi(
      projectCategory,
      rawInput,
      allowedSystems,
      context,
    );
    if (aiResolution) {
      return aiResolution;
    }

    return this.resolveWithFallbackPhrase(rawInput, allowedSystems, context);
  }

  private resolveDeterministically(
    rawInput: string,
    allowedSystems: string[],
    context: ProjectSystemResolutionContext,
  ): ResolvedProjectSystem | null {
    const normalizedInput = normalizeMatchingText(rawInput);
    if (!normalizedInput) {
      return null;
    }

    const exactAllowedSystem = allowedSystems.find(
      (systemName) => normalizeMatchingText(systemName) === normalizedInput,
    );
    if (exactAllowedSystem) {
      return this.buildResolution(
        rawInput,
        exactAllowedSystem,
        exactAllowedSystem,
        'exact',
        [exactAllowedSystem],
      );
    }

    const exactStackTerm = (context.legalTechStackTerms || []).find(
      (term) => normalizeMatchingText(term) === normalizedInput,
    );
    if (!exactStackTerm) {
      return null;
    }

    return this.buildResolution(
      rawInput,
      exactStackTerm,
      allowedSystems.find(
        (systemName) => normalizeMatchingText(systemName) === normalizedInput,
      ) || null,
      'exact',
      [exactStackTerm],
    );
  }

  private async resolveWithOpenAi(
    projectCategory: string,
    rawInput: string,
    allowedSystems: string[],
    context: ProjectSystemResolutionContext,
  ): Promise<ResolvedProjectSystem | null> {
    if (!this.openAiClient) {
      return null;
    }

    try {
      const completion = await this.openAiClient.chat.completions.create({
        model: this.model,
        temperature: 0,
        max_tokens: 180,
        messages: [
          {
            role: 'system',
            content:
              'You extract the software or platform name from buyer intake text. Return strict JSON only with shape {"resolvedLabel":"...","matchedAllowedSystem":"...","searchTerms":["..."]}. resolvedLabel must be a concise product/platform name, not the full sentence. matchedAllowedSystem must be null or one of the allowed systems provided. searchTerms must contain 1 to 4 short phrases that may appear in vendor capability text.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              projectCategory,
              allowedSystems,
              vendorCategories: (context.vendorCategories || []).slice(0, 25),
              legalTechStackTerms: (context.legalTechStackTerms || []).slice(
                0,
                80,
              ),
              rawSystemName: rawInput,
            }),
          },
        ],
      });

      const rawResponse = completion.choices?.[0]?.message?.content || '';
      const parsed = this.parseModelResponse(rawResponse);
      if (!parsed) {
        return null;
      }

      const matchedAllowedSystem =
        typeof parsed.matchedAllowedSystem === 'string' &&
        allowedSystems.includes(parsed.matchedAllowedSystem)
          ? parsed.matchedAllowedSystem
          : null;

      const resolvedLabel = String(
        parsed.resolvedLabel || matchedAllowedSystem || '',
      ).trim();
      if (!resolvedLabel) {
        return null;
      }

      return this.buildResolution(
        rawInput,
        resolvedLabel,
        matchedAllowedSystem,
        'openai',
        Array.isArray(parsed.searchTerms) ? parsed.searchTerms : [],
      );
    } catch (error) {
      this.logger.warn(
        `OpenAI system resolution failed for projectCategory="${projectCategory}" rawSystem="${rawInput}": ${this.getErrorMessage(
          error,
        )}`,
      );
      return null;
    }
  }

  private resolveWithFallbackPhrase(
    rawInput: string,
    allowedSystems: string[],
    context: ProjectSystemResolutionContext,
  ): ResolvedProjectSystem | null {
    const fallbackPhrase = this.extractFallbackPhrase(rawInput);
    if (!fallbackPhrase) {
      return null;
    }

    const normalizedFallbackPhrase = normalizeMatchingText(fallbackPhrase);
    const matchedAllowedSystem =
      allowedSystems.find(
        (systemName) =>
          normalizeMatchingText(systemName) === normalizedFallbackPhrase,
      ) || null;
    const contextTerms = (context.legalTechStackTerms || []).filter((term) =>
      normalizeMatchingText(term).includes(normalizedFallbackPhrase),
    );

    return this.buildResolution(
      rawInput,
      fallbackPhrase,
      matchedAllowedSystem,
      'fallback',
      contextTerms,
    );
  }

  private buildResolution(
    rawInput: string,
    resolvedLabel: string,
    matchedAllowedSystem: string | null,
    source: ProjectSystemResolutionSource,
    extraSearchTerms: string[] = [],
  ): ResolvedProjectSystem {
    const searchTerms = this.sanitizeSearchTerms([
      ...extraSearchTerms,
      resolvedLabel,
      matchedAllowedSystem || '',
      this.extractFallbackPhrase(rawInput) || '',
    ]);

    return {
      rawInput,
      resolvedLabel,
      matchedAllowedSystem,
      searchTerms,
      source,
    };
  }

  private sanitizeSearchTerms(values: string[]): string[] {
    const seen = new Set<string>();
    const sanitized: string[] = [];

    values.forEach((value) => {
      const normalized = normalizeMatchingText(value);
      const tokenCount = normalized.split(/\s+/).filter(Boolean).length;
      if (
        !normalized ||
        seen.has(normalized) ||
        tokenCount === 0 ||
        tokenCount > 5 ||
        normalized.length < 2 ||
        normalized.length > 60
      ) {
        return;
      }

      seen.add(normalized);
      sanitized.push(value.trim());
    });

    return sanitized.slice(0, 4);
  }

  private extractFallbackPhrase(rawInput: string): string | null {
    let candidate = String(rawInput || '').trim();
    if (!candidate) {
      return null;
    }

    this.leadingNoisePatterns.forEach((pattern) => {
      candidate = candidate.replace(pattern, '').trim();
    });

    const normalized = normalizeMatchingText(candidate);
    const meaningfulTokens = normalized
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(
        (token) =>
          Boolean(token) &&
          token.length >= 2 &&
          !this.ignoredTerms.has(token),
      );

    if (meaningfulTokens.length === 0) {
      return null;
    }

    const trimmedTokens = meaningfulTokens.slice(0, 4);
    return trimmedTokens
      .map((token) => (token === 'microsoft' ? 'Microsoft' : token))
      .join(' ')
      .replace(/\bdynamics\b/i, 'Dynamics')
      .replace(/\bazure\b/i, 'Azure')
      .replace(/\baws\b/i, 'AWS')
      .replace(/\bgcp\b/i, 'GCP')
      .replace(/\bimanage\b/i, 'iManage')
      .replace(/\bintapp\b/i, 'Intapp')
      .replace(/\bservicenow\b/i, 'ServiceNow')
      .replace(/\bworkday\b/i, 'Workday')
      .replace(/\bnetdocuments\b/i, 'NetDocuments')
      .replace(/\baderant\b/i, 'Aderant')
      .replace(/\belite\b/i, 'Elite')
      .replace(/\bmicrosoft 365\b/i, 'Microsoft 365')
      .trim();
  }

  private parseModelResponse(
    rawResponse: string,
  ): ProjectSystemResolutionResponse | null {
    const trimmed = String(rawResponse || '').trim();
    if (!trimmed) {
      return null;
    }

    const normalizedJson = trimmed
      .replace(/^```json/i, '')
      .replace(/^```/i, '')
      .replace(/```$/i, '')
      .trim();

    try {
      const parsed = JSON.parse(normalizedJson);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      return parsed as ProjectSystemResolutionResponse;
    } catch {
      return null;
    }
  }

  private buildCacheKey(
    projectCategory: string,
    rawInput: string,
    context: ProjectSystemResolutionContext = {},
  ): string {
    return createHash('sha1')
      .update(
        JSON.stringify({
          projectCategory,
          rawInput,
          legalTechStackTerms: (context.legalTechStackTerms || []).slice(0, 80),
          vendorCategories: (context.vendorCategories || []).slice(0, 25),
        }),
      )
      .digest('hex');
  }

  private parseTimeoutMs(value: string | undefined): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 12_000;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return String(error || 'Unknown error');
  }
}
