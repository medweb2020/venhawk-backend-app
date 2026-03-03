import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { Project } from '../entities/project.entity';
import { ProjectVendorMatch } from '../entities/project-vendor-match.entity';
import { VendorProjectCategory } from '../entities/vendor-project-category.entity';
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
import {
  LEGAL_CLIENT_INDUSTRY_VALUE,
  normalizeMatchingText,
  textContainsSystemKeyword,
} from '../constants/project-matching.constants';

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
  private readonly BASE_RECOMMENDATION_LIMIT = 6;
  private readonly OVERFLOW_DISPLAY_SCORE_THRESHOLD = 70;
  private readonly MAX_RAW_SCORE = 100;
  private readonly LISTING_SPECIALTY_LIMIT = 2;

  private readonly WEIGHTS = {
    CAPABILITY: 40,
    SYSTEM: 25,
    PRICING: 10,
    TIMELINE: 0,
    PROOF_REVIEWS: 12,
    CERTIFICATIONS: 5,
    ILTA: 5,
    BONUS: {
      MICROSOFT: 1,
      SERVICENOW: 1,
      WORKDAY: 1,
    },
  };

  private readonly SCORING_VERSION = this.buildScoringVersion();

  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private readonly vendorsRepository: Repository<Vendor>,
    @InjectRepository(ProjectVendorMatch)
    private readonly projectVendorMatchesRepository: Repository<ProjectVendorMatch>,
    @InjectRepository(VendorProjectCategory)
    private readonly vendorProjectCategoriesRepository: Repository<VendorProjectCategory>,
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

    const vendorIdsMappedToProjectCategory =
      await this.getVendorIdsMappedToProjectCategory(
        project.project_category_id,
        vendors.map((vendor) => vendor.id),
      );

    const eligibleVendors = vendors.filter((vendor) =>
      this.isVendorEligibleForProject(
        vendor,
        project,
        vendorIdsMappedToProjectCategory,
      ),
    );

    const ranked = eligibleVendors
      .map((vendor) =>
        this.scoreVendor(vendor, project, vendorIdsMappedToProjectCategory),
      )
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
        project.id,
        this.toProjectReasoningInput(project),
        scored.map((result) => this.toReasoningVendorInput(result, project)),
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
        await entityManager.delete(ProjectVendorMatch, {
          project_id: project.id,
        });
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
          project,
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

    if (
      this.projectChangedSinceComputation(
        project,
        latestStoredMatch.computed_at,
      )
    ) {
      await this.computeAndStoreRecommendations(projectId, userId);
      return this.getStoredRecommendations(projectId, userId, filtersDto);
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

    this.vendorsService.applyListingFiltersToQueryBuilder(
      queryBuilder,
      filtersDto,
    );

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
          project,
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

  private async getVendorIdsMappedToProjectCategory(
    projectCategoryId: number,
    vendorIds: number[],
  ): Promise<Set<number>> {
    if (!projectCategoryId || vendorIds.length === 0) {
      return new Set<number>();
    }

    const rows = await this.vendorProjectCategoriesRepository
      .createQueryBuilder('vpc')
      .select('vpc.vendor_id', 'vendor_id')
      .where('vpc.project_category_id = :projectCategoryId', {
        projectCategoryId,
      })
      .andWhere('vpc.vendor_id IN (:...vendorIds)', { vendorIds })
      .getRawMany<{ vendor_id: string }>();

    return new Set(rows.map((row) => Number(row.vendor_id)));
  }

  private isVendorEligibleForProject(
    vendor: Vendor,
    project: Project,
    vendorIdsMappedToProjectCategory: Set<number>,
  ): boolean {
    const projectIndustry = this.resolveProjectIndustryValue(project);
    if (projectIndustry !== LEGAL_CLIENT_INDUSTRY_VALUE) {
      return false;
    }

    if (!vendorIdsMappedToProjectCategory.has(vendor.id)) {
      return false;
    }

    const projectSystemKeyword = this.resolveProjectSystemKeyword(project);
    if (!projectSystemKeyword) {
      return false;
    }

    return this.vendorSupportsSystemKeyword(vendor, projectSystemKeyword);
  }

  private resolveProjectIndustryValue(project: Project): string {
    return String(project.clientIndustry?.value || '')
      .trim()
      .toLowerCase();
  }

  private resolveProjectSystemKeyword(project: Project): string | null {
    const normalizedSystemName = normalizeMatchingText(project.system_name);
    return normalizedSystemName || null;
  }

  private vendorSupportsSystemKeyword(
    vendor: Vendor,
    projectSystemKeyword: string,
  ): boolean {
    return textContainsSystemKeyword(
      String(vendor.legal_tech_stack || ''),
      projectSystemKeyword,
    );
  }

  private scoreVendor(
    vendor: Vendor,
    project: Project,
    vendorIdsMappedToProjectCategory: Set<number>,
  ): VendorRecommendationResult {
    const capability = this.calculateCapabilityScore(
      vendor,
      vendorIdsMappedToProjectCategory,
    );
    const system = this.calculateSystemScore(vendor, project);
    const pricing = this.calculatePricingScore(vendor, project);
    const timeline = this.calculateTimelineScore(vendor, project);
    const proofReviews = this.calculateProofReviewsScore(vendor);
    const certifications = this.calculateCertificationsScore(vendor, project);
    const ilta = this.calculateIltaScore(vendor);
    const bonus = this.calculateBonusScore(vendor);

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

  private calculateCapabilityScore(
    vendor: Vendor,
    vendorIdsMappedToProjectCategory: Set<number>,
  ): DimensionScore {
    const points = vendorIdsMappedToProjectCategory.has(vendor.id)
      ? this.WEIGHTS.CAPABILITY
      : 0;
    return { points, maxPoints: this.WEIGHTS.CAPABILITY };
  }

  private calculateSystemScore(
    vendor: Vendor,
    project: Project,
  ): DimensionScore {
    const projectSystemKeyword = this.resolveProjectSystemKeyword(project);
    if (!projectSystemKeyword) {
      return { points: 0, maxPoints: this.WEIGHTS.SYSTEM };
    }

    const points = this.vendorSupportsSystemKeyword(
      vendor,
      projectSystemKeyword,
    )
      ? this.WEIGHTS.SYSTEM
      : 0;

    return { points, maxPoints: this.WEIGHTS.SYSTEM };
  }

  private calculatePricingScore(
    vendor: Vendor,
    project: Project,
  ): DimensionScore {
    const projectBudget = this.resolveProjectBudget(project);
    const vendorMin = this.toNumber(vendor.min_project_size_usd);
    const vendorMax = this.toNumber(vendor.max_project_size_usd);

    if (!projectBudget || !vendorMin || !vendorMax) {
      return {
        points: 0,
        maxPoints: this.WEIGHTS.PRICING,
      };
    }

    if (projectBudget >= vendorMin && projectBudget <= vendorMax) {
      return { points: this.WEIGHTS.PRICING, maxPoints: this.WEIGHTS.PRICING };
    }

    return { points: 0, maxPoints: this.WEIGHTS.PRICING };
  }

  private calculateTimelineScore(
    vendor: Vendor,
    project: Project,
  ): DimensionScore {
    if (!project.start_date || !vendor.lead_time_weeks) {
      return {
        points: 0,
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
    const ratingMaxPoints = this.WEIGHTS.PROOF_REVIEWS * 0.8;
    const caseStudyMaxPoints = this.WEIGHTS.PROOF_REVIEWS * 0.2;
    let ratingPoints = 0;

    if (ratingSignals.rating > 0) {
      const reviewGate = this.resolveReviewGate(ratingSignals.reviewCount);
      ratingPoints = ratingMaxPoints * (ratingSignals.rating / 5) * reviewGate;
    }

    const caseStudyCount = Math.max(
      this.toNumber(vendor.case_study_count_public),
      this.toNumber(vendor.legal_case_studies_count),
    );

    let caseStudyPoints = 0;
    if (caseStudyCount >= 15) caseStudyPoints = caseStudyMaxPoints;
    else if (caseStudyCount >= 8) caseStudyPoints = caseStudyMaxPoints * 0.75;
    else if (caseStudyCount >= 3) caseStudyPoints = caseStudyMaxPoints * 0.5;
    else if (caseStudyCount >= 1) caseStudyPoints = caseStudyMaxPoints * 0.25;

    const points = Number(
      Math.min(
        this.WEIGHTS.PROOF_REVIEWS,
        ratingPoints + caseStudyPoints,
      ).toFixed(2),
    );
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

    const requiresSoc2 =
      projectText.includes('soc2') || projectText.includes('soc 2');
    const requiresIso27001 =
      projectText.includes('iso27001') || projectText.includes('iso 27001');

    const required = [requiresSoc2, requiresIso27001].filter(Boolean).length;
    if (required === 0) {
      return {
        points: 0,
        maxPoints: this.WEIGHTS.CERTIFICATIONS,
      };
    }

    let matched = 0;
    if (requiresSoc2 && vendor.has_soc2 === 'Y') matched++;
    if (requiresIso27001 && vendor.has_iso27001 === 'Y') matched++;

    const normalized = matched / required;
    const points = this.pointsFromNormalized(
      normalized,
      this.WEIGHTS.CERTIFICATIONS,
    );
    return { points, maxPoints: this.WEIGHTS.CERTIFICATIONS };
  }

  private calculateIltaScore(vendor: Vendor): DimensionScore {
    return {
      points: vendor.ilta_present ? this.WEIGHTS.ILTA : 0,
      maxPoints: this.WEIGHTS.ILTA,
    };
  }

  private calculateBonusScore(vendor: Vendor): DimensionScore {
    const microsoftPoints = vendor.is_microsoft_partner
      ? this.WEIGHTS.BONUS.MICROSOFT
      : 0;
    const serviceNowPoints = vendor.is_servicenow_partner
      ? this.WEIGHTS.BONUS.SERVICENOW
      : 0;
    const workdayPoints = vendor.is_workday_partner
      ? this.WEIGHTS.BONUS.WORKDAY
      : 0;

    const totalPoints = microsoftPoints + serviceNowPoints + workdayPoints;

    return {
      points: totalPoints,
      maxPoints:
        this.WEIGHTS.BONUS.MICROSOFT +
        this.WEIGHTS.BONUS.SERVICENOW +
        this.WEIGHTS.BONUS.WORKDAY,
      microsoftRelevant: true,
      serviceNowRelevant: true,
      workdayRelevant: true,
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
    project: Project,
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
      specialty: this.buildVendorSpecialty(vendor, project, 3),
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
      score_breakdown_json: this.attachReasonToBreakdown(
        result.breakdown,
        matchReason,
      ),
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
    project: Project,
    matchingScore: number,
    rawScore: number,
    scoreBreakdown: Record<string, unknown>,
    matchReason: MatchReason | null = null,
    scoringVersion = this.SCORING_VERSION,
  ): VendorResponseDto {
    const tier = vendor.listing_tier || this.calculateTier(vendor);
    const logo = this.generateLogo(vendor.brand_name);
    const specialty = this.buildVendorSpecialty(
      vendor,
      project,
      this.LISTING_SPECIALTY_LIMIT,
    );
    const specialtyFull = this.buildVendorSpecialty(vendor, project, 0);

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
      description:
        vendor.listing_description || this.generateDescription(vendor),
      specialty,
      specialtyFull,
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

  private projectChangedSinceComputation(
    project: Project,
    computedAt: Date | null,
  ): boolean {
    if (!project.updated_at || !computedAt) {
      return false;
    }

    return (
      new Date(project.updated_at).getTime() > new Date(computedAt).getTime()
    );
  }

  private pointsFromNormalized(normalized: number, maxPoints: number): number {
    const value = Math.max(0, Math.min(1, normalized));
    return Number((value * maxPoints).toFixed(2));
  }

  private toSearchText(...values: unknown[]): string {
    return values
      .map((value) =>
        String(value || '')
          .trim()
          .toLowerCase(),
      )
      .filter(Boolean)
      .join(' ');
  }

  private toNumber(value: unknown): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  private buildScoringVersion(): string {
    const signature = JSON.stringify({
      maxRawScore: this.MAX_RAW_SCORE,
      weights: this.WEIGHTS,
      eligibilityPolicy: {
        legalClientIndustryOnly: LEGAL_CLIENT_INDUSTRY_VALUE,
        strictCategoryGate: true,
        categoryMatchSource: 'vendor_project_categories',
        strictSystemGate: true,
        projectSystemMatchMode: 'first-word',
        vendorSystemField: 'legal_tech_stack',
      },
      reasoningPolicy: {
        allMatchesHaveReason: true,
        openAiTopMatchLimit: 3,
        minSentences: 2,
        maxSentences: 2,
      },
      scoringFns: {
        capability: this.calculateCapabilityScore.toString(),
        system: this.calculateSystemScore.toString(),
        pricing: this.calculatePricingScore.toString(),
        timeline: this.calculateTimelineScore.toString(),
        proofReviews: this.calculateProofReviewsScore.toString(),
        certifications: this.calculateCertificationsScore.toString(),
        ilta: this.calculateIltaScore.toString(),
        bonus: this.calculateBonusScore.toString(),
      },
    });

    return `auto-${createHash('sha1').update(signature).digest('hex').slice(0, 12)}`;
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
    const words = String(brandName || '')
      .split(' ')
      .filter(Boolean);
    if (words.length >= 2) {
      return words
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    }

    return String(brandName || '')
      .substring(0, 3)
      .toUpperCase();
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

  private buildVendorSpecialty(
    vendor: Vendor,
    project: Project,
    maxItems: number,
  ): string {
    const specialties = this.extractVendorSpecialtyValues(vendor);
    if (specialties.length === 0) {
      return vendor.vendor_type || 'General IT Services';
    }

    const prioritizedSpecialties = this.prioritizeSpecialtiesForProject(
      specialties,
      project,
    );
    const visibleSpecialties =
      maxItems > 0
        ? prioritizedSpecialties.slice(0, maxItems)
        : prioritizedSpecialties;

    return visibleSpecialties.join(', ');
  }

  private extractVendorSpecialtyValues(vendor: Vendor): string[] {
    const primarySpecialties = [
      ...this.parseListValues(vendor.listing_specialty),
      ...this.parseListValues(vendor.legal_tech_stack),
      ...this.parseListValues(vendor.platforms_experience),
    ];
    const rawValues =
      primarySpecialties.length > 0
        ? primarySpecialties
        : this.parseListValues(vendor.service_domains);

    const seen = new Set<string>();
    const deduplicatedValues: string[] = [];

    rawValues.forEach((value) => {
      const normalizedValue = normalizeMatchingText(value);
      if (!normalizedValue || seen.has(normalizedValue)) {
        return;
      }

      seen.add(normalizedValue);
      deduplicatedValues.push(value);
    });

    return deduplicatedValues;
  }

  private parseListValues(value: unknown): string[] {
    return String(value || '')
      .split(/[;,]+/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private prioritizeSpecialtiesForProject(
    specialties: string[],
    project: Project,
  ): string[] {
    const projectSystemText = normalizeMatchingText(project.system_name);
    const projectSystemTokens =
      this.extractProjectSystemTokens(projectSystemText);

    if (!projectSystemText) {
      return specialties;
    }

    return specialties
      .map((specialty, index) => ({
        specialty,
        index,
        relevance: this.scoreSpecialtyRelevance(
          specialty,
          projectSystemText,
          projectSystemTokens,
        ),
      }))
      .sort((a, b) => {
        if (b.relevance !== a.relevance) {
          return b.relevance - a.relevance;
        }

        return a.index - b.index;
      })
      .map((entry) => entry.specialty);
  }

  private extractProjectSystemTokens(projectSystemText: string): string[] {
    return projectSystemText
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(
        (token) =>
          token.length >= 3 &&
          ![
            'and',
            'for',
            'with',
            'the',
            'app',
            'apps',
            'system',
            'systems',
            'terms',
          ].includes(token),
      );
  }

  private scoreSpecialtyRelevance(
    specialty: string,
    projectSystemText: string,
    projectSystemTokens: string[],
  ): number {
    const normalizedSpecialty = normalizeMatchingText(specialty);
    if (!normalizedSpecialty) {
      return 0;
    }

    let score = 0;

    if (normalizedSpecialty === projectSystemText) {
      score += 6;
    }

    if (normalizedSpecialty.includes(projectSystemText)) {
      score += 5;
    }

    if (
      projectSystemText.includes(normalizedSpecialty) &&
      normalizedSpecialty.length >= 4
    ) {
      score += 4;
    }

    projectSystemTokens.forEach((token) => {
      if (!normalizedSpecialty.includes(token)) {
        return;
      }

      score += 2;

      if (normalizedSpecialty.startsWith(token)) {
        score += 0.5;
      }
    });

    return score;
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
