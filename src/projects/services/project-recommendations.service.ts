import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectVendorMatch } from '../entities/project-vendor-match.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { VendorResponseDto } from '../../vendors/dto/vendor-response.dto';
import { ProjectRecommendationsResponseDto } from '../dto/project-recommendations-response.dto';
import { VendorsService } from '../../vendors/vendors.service';
import { VendorListingFiltersDto } from '../../vendors/dto/vendor-listing-filters.dto';
import {
  MatchReason,
  ProjectRecommendationReasoningService,
  RecommendationProjectReasoningInput,
  RecommendationVendorReasoningInput,
} from './project-recommendation-reasoning.service';

interface DimensionScore {
  points: number;
  maxPoints: number;
}

interface VendorRecommendationResult {
  vendor: Vendor;
  rawScore: number;
  displayScore: number;
  breakdown: Record<string, unknown>;
}

@Injectable()
export class ProjectRecommendationsService {
  private readonly ACTIVE_VENDOR_STATUSES = ['Prospect', 'Validated', 'Active'];
  private readonly SCORING_VERSION = 'v6';
  private readonly BASE_RECOMMENDATION_LIMIT = 6;
  private readonly OVERFLOW_DISPLAY_SCORE_THRESHOLD = 70;
  private readonly MAX_RAW_SCORE = 98;

  private readonly WEIGHTS = {
    CAPABILITY: 30,
    SYSTEM: 25,
    PRICING: 15,
    TIMELINE: 5,
    PROOF_REVIEWS: 10,
    CERTIFICATIONS: 5,
    ILTA: 5,
    BONUS: {
      MICROSOFT: 1,
      SERVICENOW: 1,
      WORKDAY: 1,
    },
  };

  private readonly CATEGORY_KEYWORDS: Record<string, string[]> = {
    'legal-apps': ['legal', 'document management', 'imanage', 'netdocuments', 'intapp'],
    'cloud-migration': ['cloud', 'azure', 'aws', 'gcp', 'modernization'],
    'enterprise-it': ['enterprise', 'servicenow', 'workday', 'microsoft 365', 'm365'],
    'app-upgrades': ['upgrade', 'integration', 'api', 'legacy modernization'],
    'app-bug-fixes': ['upgrade', 'integration', 'api', 'legacy modernization'],
    collaboration: ['collaboration', 'sharepoint', 'teams', 'microsoft 365'],
    security: ['security', 'identity', 'entra', 'compliance', 'iam'],
    'data-archive': ['archive', 'ediscovery', 'retention', 'data migration'],
    other: [],
  };

  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private readonly vendorsRepository: Repository<Vendor>,
    @InjectRepository(ProjectVendorMatch)
    private readonly projectVendorMatchesRepository: Repository<ProjectVendorMatch>,
    private readonly vendorsService: VendorsService,
    private readonly projectRecommendationReasoningService: ProjectRecommendationReasoningService,
  ) {}

  async computeAndStoreRecommendations(
    projectId: number,
    userId: number,
  ): Promise<ProjectRecommendationsResponseDto> {
    const project = await this.getProjectForUser(projectId, userId);
    const vendors = await this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.status IN (:...statuses)', {
        statuses: this.ACTIVE_VENDOR_STATUSES,
      })
      .getMany();

    const ranked = vendors
      .map((vendor) => this.scoreVendor(vendor, project))
      .filter((result) => result.rawScore > 0)
      .sort((a, b) => {
        if (b.rawScore !== a.rawScore) {
          return b.rawScore - a.rawScore;
        }

        return String(a.vendor.brand_name || '').localeCompare(
          String(b.vendor.brand_name || ''),
        );
      });

    const primary = ranked.slice(0, this.BASE_RECOMMENDATION_LIMIT);
    const overflow = ranked
      .slice(this.BASE_RECOMMENDATION_LIMIT)
      .filter(
        (result) =>
          Number(result.displayScore) > this.OVERFLOW_DISPLAY_SCORE_THRESHOLD,
      );
    const scored = [...primary, ...overflow];
    const reasoningByVendorId =
      await this.projectRecommendationReasoningService.generateTopMatchReasons(
        this.toProjectReasoningInput(project),
        scored.map((result) => this.toReasoningVendorInput(result)),
      );

    const computedAt = new Date();
    const records = scored.map((result, index) =>
      this.projectVendorMatchesRepository.create(
        this.toStoredRecommendationRecord(
          project.id,
          result,
          index + 1,
          computedAt,
          reasoningByVendorId.get(result.vendor.id) || null,
        ),
      ),
    );

    await this.projectVendorMatchesRepository.manager.transaction(
      async (entityManager) => {
        await entityManager.delete(ProjectVendorMatch, { project_id: project.id });
        if (records.length > 0) {
          await entityManager.save(ProjectVendorMatch, records);
        }
      },
    );

    return {
      projectId: project.id,
      scoringVersion: this.SCORING_VERSION,
      computedAt,
      totalRecommended: scored.length,
      recommendedVendors: scored.map((result) =>
        this.toVendorResponseDto(
          result.vendor,
          result.displayScore,
          result.rawScore,
          this.attachReasonToBreakdown(
            result.breakdown,
            reasoningByVendorId.get(result.vendor.id) || null,
          ),
          reasoningByVendorId.get(result.vendor.id) || null,
        ),
      ),
    };
  }

  async getStoredRecommendations(
    projectId: number,
    userId: number,
    filtersDto?: VendorListingFiltersDto,
  ): Promise<ProjectRecommendationsResponseDto> {
    const project = await this.getProjectForUser(projectId, userId);

    const latestStoredMatch = await this.projectVendorMatchesRepository
      .createQueryBuilder('match')
      .where('match.project_id = :projectId', { projectId })
      .orderBy('match.rank_position', 'ASC')
      .getOne();

    if (!latestStoredMatch) {
      return this.computeAndStoreRecommendations(projectId, userId);
    }

    if (latestStoredMatch.scoring_version !== this.SCORING_VERSION) {
      await this.computeAndStoreRecommendations(projectId, userId);
      return this.getStoredRecommendations(projectId, userId, filtersDto);
    }

    const queryBuilder = this.projectVendorMatchesRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.vendor', 'vendor')
      .where('match.project_id = :projectId', { projectId })
      .orderBy('match.rank_position', 'ASC');

    this.vendorsService.applyListingFiltersToQueryBuilder(queryBuilder, filtersDto);

    const matches = await queryBuilder.getMany();

    const computedAt = latestStoredMatch.computed_at;
    const scoringVersion =
      latestStoredMatch.scoring_version || this.SCORING_VERSION;

    return {
      projectId: project.id,
      scoringVersion,
      computedAt,
      totalRecommended: matches.length,
      recommendedVendors: matches.map((match) => {
        const scoreBreakdown = (match.score_breakdown_json || {}) as Record<
          string,
          unknown
        >;
        const matchReason = this.extractMatchReason(scoreBreakdown);

        return this.toVendorResponseDto(
          match.vendor,
          match.display_score,
          Number(match.raw_score),
          scoreBreakdown,
          matchReason,
          scoringVersion,
        );
      }),
    };
  }

  private async getProjectForUser(
    projectId: number,
    userId: number,
  ): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: {
        id: projectId,
        user_id: userId,
      },
      relations: ['projectCategory', 'clientIndustry'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  private scoreVendor(vendor: Vendor, project: Project): VendorRecommendationResult {
    const capability = this.calculateCapabilityScore(vendor, project);
    const system = this.calculateSystemScore(vendor, project);
    const pricing = this.calculatePricingScore(vendor, project);
    const timeline = this.calculateTimelineScore(vendor, project);
    const proofReviews = this.calculateProofReviewsScore(vendor);
    const certifications = this.calculateCertificationsScore(vendor, project);
    const ilta = this.calculateIltaScore(vendor);
    const bonus = this.calculateBonusScore(vendor, project);

    const baseScore =
      capability.points +
      system.points +
      pricing.points +
      timeline.points +
      proofReviews.points +
      certifications.points +
      ilta.points;

    const rawScore = Number((baseScore + bonus.points).toFixed(2));
    const displayScore = Math.max(
      0,
      Math.min(100, Math.round((rawScore / this.MAX_RAW_SCORE) * 100)),
    );

    return {
      vendor,
      rawScore,
      displayScore,
      breakdown: {
        capability,
        system,
        pricing,
        timeline,
        proofReviews,
        certifications,
        ilta,
        bonus,
        baseScore: Number(baseScore.toFixed(2)),
        rawScore,
        maxRawScore: this.MAX_RAW_SCORE,
      },
    };
  }

  private calculateCapabilityScore(vendor: Vendor, project: Project): DimensionScore {
    const categoryValue = project.projectCategory?.value || '';
    const categoryKeywords =
      this.CATEGORY_KEYWORDS[categoryValue] || this.CATEGORY_KEYWORDS.other;
    const vendorText = this.toSearchText(
      vendor.service_domains,
      vendor.vendor_type,
      vendor.listing_specialty,
      vendor.listing_description,
      vendor.legal_tech_stack,
    );

    let normalized = 0.4;

    if (categoryKeywords.length > 0) {
      const matched = categoryKeywords.filter((keyword) =>
        vendorText.includes(keyword),
      ).length;
      normalized = matched > 0 ? matched / categoryKeywords.length : 0.1;
    }

    const isLegalProject = categoryValue.includes('legal');
    if (isLegalProject) {
      if (vendor.legal_focus_level === 'Legal-only') normalized += 0.2;
      else if (vendor.legal_focus_level === 'Strong') normalized += 0.15;
      else if (vendor.legal_focus_level === 'Some') normalized += 0.08;
    }

    const points = this.pointsFromNormalized(
      normalized,
      this.WEIGHTS.CAPABILITY,
    );
    return { points, maxPoints: this.WEIGHTS.CAPABILITY };
  }

  private calculateSystemScore(vendor: Vendor, project: Project): DimensionScore {
    const systemName = (project.system_name || '').trim().toLowerCase();
    if (!systemName) {
      return {
        points: this.WEIGHTS.SYSTEM * 0.4,
        maxPoints: this.WEIGHTS.SYSTEM,
      };
    }

    const vendorText = this.toSearchText(
      vendor.legal_tech_stack,
      vendor.platforms_experience,
      vendor.service_domains,
    );

    if (!vendorText) {
      return {
        points: this.WEIGHTS.SYSTEM * 0.3,
        maxPoints: this.WEIGHTS.SYSTEM,
      };
    }

    if (vendorText.includes(systemName)) {
      return { points: this.WEIGHTS.SYSTEM, maxPoints: this.WEIGHTS.SYSTEM };
    }

    const tokens = systemName
      .split(/[\s,;/()+-]+/g)
      .map((token) => token.trim())
      .filter((token) => token.length > 2);

    if (tokens.length === 0) {
      return { points: this.WEIGHTS.SYSTEM * 0.2, maxPoints: this.WEIGHTS.SYSTEM };
    }

    const matchedTokens = tokens.filter((token) => vendorText.includes(token)).length;
    const normalized = matchedTokens / tokens.length;
    const points = this.pointsFromNormalized(normalized, this.WEIGHTS.SYSTEM);

    return { points, maxPoints: this.WEIGHTS.SYSTEM };
  }

  private calculatePricingScore(vendor: Vendor, project: Project): DimensionScore {
    const projectBudget = this.resolveProjectBudget(project);
    const vendorMin = this.toNumber(vendor.min_project_size_usd);
    const vendorMax = this.toNumber(vendor.max_project_size_usd);

    if (!projectBudget || !vendorMin || !vendorMax) {
      return {
        points: this.WEIGHTS.PRICING * 0.5,
        maxPoints: this.WEIGHTS.PRICING,
      };
    }

    if (projectBudget >= vendorMin && projectBudget <= vendorMax) {
      return { points: this.WEIGHTS.PRICING, maxPoints: this.WEIGHTS.PRICING };
    }

    let normalized = 0.1;

    if (projectBudget < vendorMin) {
      const ratio = projectBudget / vendorMin;
      if (ratio >= 0.8) normalized = 0.7;
      else if (ratio >= 0.6) normalized = 0.4;
    } else {
      const ratio = vendorMax / projectBudget;
      if (ratio >= 0.8) normalized = 0.7;
      else if (ratio >= 0.6) normalized = 0.4;
    }

    const points = this.pointsFromNormalized(normalized, this.WEIGHTS.PRICING);
    return { points, maxPoints: this.WEIGHTS.PRICING };
  }

  private calculateTimelineScore(vendor: Vendor, project: Project): DimensionScore {
    if (!project.start_date || !vendor.lead_time_weeks) {
      return {
        points: this.WEIGHTS.TIMELINE * 0.5,
        maxPoints: this.WEIGHTS.TIMELINE,
      };
    }

    const startDate = new Date(project.start_date);
    const today = new Date();
    const weeksUntilStart = Math.ceil(
      (startDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );

    let normalized = 0.2;
    if (weeksUntilStart >= vendor.lead_time_weeks) normalized = 1;
    else if (weeksUntilStart >= vendor.lead_time_weeks * 0.8) normalized = 0.7;
    else if (weeksUntilStart >= vendor.lead_time_weeks * 0.6) normalized = 0.4;

    const points = this.pointsFromNormalized(normalized, this.WEIGHTS.TIMELINE);
    return { points, maxPoints: this.WEIGHTS.TIMELINE };
  }

  private calculateProofReviewsScore(vendor: Vendor): DimensionScore {
    const ratingSignals = this.extractRatingSignals(vendor);
    let ratingPoints = 0;

    if (ratingSignals.rating > 0) {
      const reviewGate = this.resolveReviewGate(ratingSignals.reviewCount);
      ratingPoints = 8 * (ratingSignals.rating / 5) * reviewGate;
    }

    const caseStudyCount = Math.max(
      this.toNumber(vendor.case_study_count_public),
      this.toNumber(vendor.legal_case_studies_count),
    );

    let caseStudyPoints = 0;
    if (caseStudyCount >= 15) caseStudyPoints = 2;
    else if (caseStudyCount >= 8) caseStudyPoints = 1.5;
    else if (caseStudyCount >= 3) caseStudyPoints = 1;
    else if (caseStudyCount >= 1) caseStudyPoints = 0.5;

    const points = Number(Math.min(10, ratingPoints + caseStudyPoints).toFixed(2));
    return { points, maxPoints: this.WEIGHTS.PROOF_REVIEWS };
  }

  private calculateCertificationsScore(
    vendor: Vendor,
    project: Project,
  ): DimensionScore {
    const projectText = this.toSearchText(
      project.system_name,
      project.project_objective,
      project.business_requirements,
      project.technical_requirements,
    );

    const requiresSoc2 = projectText.includes('soc2') || projectText.includes('soc 2');
    const requiresIso27001 =
      projectText.includes('iso27001') || projectText.includes('iso 27001');

    const required = [requiresSoc2, requiresIso27001].filter(Boolean).length;
    if (required === 0) {
      return {
        points: this.WEIGHTS.CERTIFICATIONS * 0.5,
        maxPoints: this.WEIGHTS.CERTIFICATIONS,
      };
    }

    let matched = 0;
    if (requiresSoc2 && vendor.has_soc2 === 'Y') matched++;
    if (requiresIso27001 && vendor.has_iso27001 === 'Y') matched++;

    const normalized = matched / required;
    const points = this.pointsFromNormalized(normalized, this.WEIGHTS.CERTIFICATIONS);
    return { points, maxPoints: this.WEIGHTS.CERTIFICATIONS };
  }

  private calculateIltaScore(vendor: Vendor): DimensionScore {
    return {
      points: vendor.ilta_present ? this.WEIGHTS.ILTA : 0,
      maxPoints: this.WEIGHTS.ILTA,
    };
  }

  private calculateBonusScore(vendor: Vendor, project: Project): DimensionScore {
    const projectText = this.toSearchText(
      project.system_name,
      project.project_objective,
      project.business_requirements,
      project.technical_requirements,
    );

    const microsoftRelevant =
      this.hasAnyKeyword(projectText, [
        'azure',
        'm365',
        'microsoft 365',
        'office 365',
        'entra',
        'active directory',
        'sharepoint',
        'teams',
        'dynamics',
      ]);
    const serviceNowRelevant = this.hasAnyKeyword(projectText, ['servicenow']);
    const workdayRelevant = this.hasAnyKeyword(projectText, ['workday']);

    const microsoftPoints =
      microsoftRelevant && vendor.is_microsoft_partner
        ? this.WEIGHTS.BONUS.MICROSOFT
        : 0;
    const serviceNowPoints =
      serviceNowRelevant && vendor.is_servicenow_partner
        ? this.WEIGHTS.BONUS.SERVICENOW
        : 0;
    const workdayPoints =
      workdayRelevant && vendor.is_workday_partner ? this.WEIGHTS.BONUS.WORKDAY : 0;

    const totalPoints = microsoftPoints + serviceNowPoints + workdayPoints;

    return {
      points: totalPoints,
      maxPoints:
        this.WEIGHTS.BONUS.MICROSOFT +
        this.WEIGHTS.BONUS.SERVICENOW +
        this.WEIGHTS.BONUS.WORKDAY,
      microsoftRelevant,
      serviceNowRelevant,
      workdayRelevant,
      microsoftPoints,
      serviceNowPoints,
      workdayPoints,
    } as DimensionScore;
  }

  private toProjectReasoningInput(
    project: Project,
  ): RecommendationProjectReasoningInput {
    return {
      projectTitle: String(project.project_title || ''),
      industry: String(
        project.clientIndustry?.label || project.clientIndustry?.value || '',
      ),
      category: String(
        project.projectCategory?.label || project.projectCategory?.value || '',
      ),
      systemName: String(project.system_name || ''),
      projectObjective: String(project.project_objective || ''),
      businessRequirements: String(project.business_requirements || ''),
      technicalRequirements: String(project.technical_requirements || ''),
    };
  }

  private toReasoningVendorInput(
    result: VendorRecommendationResult,
  ): RecommendationVendorReasoningInput {
    const vendor = result.vendor;
    const ratingSignals = this.extractRatingSignals(vendor);
    const caseStudyCount = Math.max(
      this.toNumber(vendor.case_study_count_public),
      this.toNumber(vendor.legal_case_studies_count),
    );

    return {
      vendorId: vendor.id,
      vendorName: String(vendor.brand_name || ''),
      matchingScore: result.displayScore,
      tier: vendor.listing_tier || this.calculateTier(vendor),
      legalFocusLevel: String(vendor.legal_focus_level || 'Some'),
      specialty: String(vendor.listing_specialty || this.determineSpecialty(vendor)),
      serviceDomains: this.parseCsvValues(vendor.service_domains, 3),
      legalTechStack: this.parseCsvValues(vendor.legal_tech_stack, 4),
      topStrengths: this.extractTopStrengthLabels(result.breakdown),
      partnerSignals: this.extractPartnerSignals(vendor),
      rating: ratingSignals.rating,
      reviewCount: ratingSignals.reviewCount,
      caseStudyCount,
    };
  }

  private toStoredRecommendationRecord(
    projectId: number,
    result: VendorRecommendationResult,
    rankPosition: number,
    computedAt: Date,
    matchReason: MatchReason | null,
  ): Partial<ProjectVendorMatch> {
    return {
      project_id: projectId,
      vendor_id: result.vendor.id,
      rank_position: rankPosition,
      raw_score: Number(result.rawScore.toFixed(2)),
      display_score: result.displayScore,
      score_breakdown_json: this.attachReasonToBreakdown(result.breakdown, matchReason),
      scoring_version: this.SCORING_VERSION,
      computed_at: computedAt,
    };
  }

  private attachReasonToBreakdown(
    scoreBreakdown: Record<string, unknown>,
    matchReason: MatchReason | null,
  ): Record<string, unknown> {
    if (!matchReason?.text) {
      return scoreBreakdown;
    }

    return {
      ...scoreBreakdown,
      matchingReason: matchReason.text,
      matchingReasonSource: matchReason.source,
    };
  }

  private extractMatchReason(
    scoreBreakdown: Record<string, unknown>,
  ): MatchReason | null {
    const reasonRaw = scoreBreakdown['matchingReason'];
    if (typeof reasonRaw !== 'string' || !reasonRaw.trim()) {
      return null;
    }

    const sourceRaw = scoreBreakdown['matchingReasonSource'];
    const source = sourceRaw === 'openai' ? 'openai' : 'fallback';

    return {
      text: reasonRaw.trim(),
      source,
    };
  }

  private extractTopStrengthLabels(
    breakdown: Record<string, unknown>,
  ): string[] {
    const dimensions = [
      { key: 'capability', label: 'capability fit' },
      { key: 'system', label: 'system alignment' },
      { key: 'pricing', label: 'budget fit' },
      { key: 'timeline', label: 'timeline readiness' },
      { key: 'proofReviews', label: 'proof and reviews' },
      { key: 'certifications', label: 'security certifications' },
      { key: 'ilta', label: 'ILTA presence' },
    ];

    const normalizedDimensionScores = dimensions
      .map((dimension) => {
        const value = breakdown[dimension.key] as
          | Record<string, unknown>
          | undefined;
        const points = this.toNumber(value?.points);
        const maxPoints = this.toNumber(value?.maxPoints);
        const normalized = maxPoints > 0 ? points / maxPoints : 0;

        return {
          label: dimension.label,
          points,
          normalized,
        };
      })
      .filter((dimension) => dimension.points > 0)
      .sort((a, b) => {
        if (b.normalized !== a.normalized) {
          return b.normalized - a.normalized;
        }

        return b.points - a.points;
      });

    return normalizedDimensionScores.slice(0, 2).map((entry) => entry.label);
  }

  private extractPartnerSignals(vendor: Vendor): string[] {
    const signals: string[] = [];
    if (vendor.is_microsoft_partner) signals.push('Microsoft Partner');
    if (vendor.is_servicenow_partner) signals.push('ServiceNow Partner');
    if (vendor.is_workday_partner) signals.push('Workday Partner');
    if (vendor.ilta_present) signals.push('ILTA Presence');
    return signals;
  }

  private parseCsvValues(value: string, limit: number): string[] {
    return String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, limit);
  }

  private toVendorResponseDto(
    vendor: Vendor,
    matchingScore: number,
    rawScore: number,
    scoreBreakdown: Record<string, unknown>,
    matchReason: MatchReason | null = null,
    scoringVersion = this.SCORING_VERSION,
  ): VendorResponseDto {
    const tier = vendor.listing_tier || this.calculateTier(vendor);
    const logo = this.generateLogo(vendor.brand_name);

    const response: VendorResponseDto = {
      id: vendor.id,
      vendorId: vendor.vendor_id,
      name: vendor.brand_name,
      logo,
      logoUrl: vendor.logo_url || null,
      category: vendor.vendor_type || 'Technology Services',
      location: this.formatLocation(vendor),
      rating: Number(this.resolveRating(vendor)),
      tier,
      description: vendor.listing_description || this.generateDescription(vendor),
      specialty: vendor.listing_specialty || this.determineSpecialty(vendor),
      startFrom: this.formatStartFrom(vendor.min_project_size_usd),
      matchingScore,
      rawScore: Number(rawScore.toFixed(2)),
      maxScore: this.MAX_RAW_SCORE,
      scoringVersion,
      scoreBreakdown,
    };

    if (matchReason?.text) {
      response.matchingReason = matchReason.text;
      response.matchingReasonSource = matchReason.source;
    }

    return response;
  }

  private resolveProjectBudget(project: Project): number | null {
    const budgetAmount = this.toNumber(project.budget_amount);
    const budgetMax = this.toNumber(project.budget_max);
    const budgetMin = this.toNumber(project.budget_min);
    return budgetAmount || budgetMax || budgetMin || null;
  }

  private extractRatingSignals(vendor: Vendor): {
    source: string;
    rating: number;
    reviewCount: number;
  } {
    const sources = [
      {
        source: String(vendor.rating_source_1 || '').trim(),
        rating: this.toNumber(vendor.rating_1),
        reviewCount: this.toNumber(vendor.review_count_1),
      },
      {
        source: String(vendor.rating_source_2 || '').trim(),
        rating: this.toNumber(vendor.rating_2),
        reviewCount: this.toNumber(vendor.review_count_2),
      },
    ].filter((item) => item.rating > 0);

    if (sources.length === 0) {
      return { source: '', rating: 0, reviewCount: 0 };
    }

    const clutch = sources.find((item) =>
      item.source.toLowerCase().includes('clutch'),
    );
    if (clutch) {
      return clutch;
    }

    return sources.sort((a, b) => b.reviewCount - a.reviewCount)[0];
  }

  private resolveReviewGate(reviewCount: number): number {
    if (reviewCount >= 15) return 1;
    if (reviewCount >= 5) return 0.7;
    return 0.4;
  }

  private pointsFromNormalized(normalized: number, maxPoints: number): number {
    const value = Math.max(0, Math.min(1, normalized));
    return Number((value * maxPoints).toFixed(2));
  }

  private toSearchText(...values: unknown[]): string {
    return values
      .map((value) => String(value || '').trim().toLowerCase())
      .filter(Boolean)
      .join(' ');
  }

  private hasAnyKeyword(haystack: string, keywords: string[]): boolean {
    return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
  }

  private toNumber(value: unknown): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  private calculateTier(vendor: Vendor): string {
    if (
      vendor.company_size_band?.includes('1000+') ||
      vendor.legal_focus_level === 'Legal-only'
    ) {
      return 'Tier 1';
    }

    if (
      vendor.company_size_band?.includes('100-') ||
      vendor.legal_focus_level === 'Strong'
    ) {
      return 'Tier 2';
    }

    return 'Tier 3';
  }

  private generateLogo(brandName: string): string {
    const words = String(brandName || '').split(' ').filter(Boolean);
    if (words.length >= 2) {
      return words
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    }

    return String(brandName || '').substring(0, 3).toUpperCase();
  }

  private generateDescription(vendor: Vendor): string {
    const parts: string[] = [];

    if (vendor.vendor_type) {
      parts.push(vendor.vendor_type);
    }

    if (vendor.legal_focus_level && vendor.legal_focus_level !== 'None') {
      parts.push(`with ${vendor.legal_focus_level.toLowerCase()} legal focus`);
    }

    if (vendor.service_domains) {
      const domains = vendor.service_domains.split(',').slice(0, 2).join(', ');
      parts.push(`specializing in ${domains}`);
    }

    return (
      parts.join(' ') || 'Technology consulting and implementation services'
    );
  }

  private determineSpecialty(vendor: Vendor): string {
    if (vendor.legal_tech_stack) {
      return vendor.legal_tech_stack.split(',').slice(0, 2).join(', ');
    }

    if (vendor.platforms_experience) {
      return vendor.platforms_experience.split(',').slice(0, 2).join(', ');
    }

    if (vendor.service_domains) {
      return vendor.service_domains.split(',')[0];
    }

    return vendor.vendor_type || 'General IT Services';
  }

  private formatLocation(vendor: Vendor): string {
    if (vendor.hq_state && vendor.hq_country) {
      return `${vendor.hq_state}, ${vendor.hq_country}`;
    }

    return vendor.hq_country || 'United States';
  }

  private resolveRating(vendor: Vendor): number {
    const rating1 = this.toNumber(vendor.rating_1);
    const rating2 = this.toNumber(vendor.rating_2);
    if (rating1 > 0 && rating2 > 0) {
      return Number(((rating1 + rating2) / 2).toFixed(2));
    }
    return rating1 || rating2 || 0;
  }

  private formatStartFrom(minProjectSizeUsd: number): string {
    const min = this.toNumber(minProjectSizeUsd);
    if (!min) {
      return 'Contact for pricing';
    }

    return `$${(min / 1000).toFixed(0)}k`;
  }
}
