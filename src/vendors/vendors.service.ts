import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorClient } from './entities/vendor-client.entity';
import { VendorCaseStudy } from './entities/vendor-case-study.entity';
import { VendorReview } from './entities/vendor-review.entity';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { VendorListingResponseDto } from './dto/vendor-listing-response.dto';
import { VendorListingFiltersDto } from './dto/vendor-listing-filters.dto';
import { VendorListingFilterOptionsResponseDto } from './dto/vendor-listing-filter-options-response.dto';
import {
  VendorDetailCaseStudyDto,
  VendorDetailClientDto,
  VendorDetailResponseDto,
  VendorDetailReviewDto,
} from './dto/vendor-detail-response.dto';
import {
  VENDOR_FILTER_ALLOWED_VALUES,
  VENDOR_FILTER_GROUPS,
  VendorFilterGroupKey,
} from './constants/vendor-filters.constants';
import { textContainsSystemKeyword } from '../projects/constants/project-matching.constants';
import { Project } from '../projects/entities/project.entity';
import { ProjectVendorMatch } from '../projects/entities/project-vendor-match.entity';
import { ProjectVendorReason } from '../projects/entities/project-vendor-reason.entity';

interface ProjectCriteria {
  projectCategory: string;
  systemName: string;
  budgetAmount?: number;
  budgetMin?: number;
  budgetMax?: number;
  startDate?: string;
  endDate?: string;
}

interface VendorListingFilters {
  coreCapabilities: string[];
  industryExperience: string[];
  startTimeline: string[];
  verifiedCertifications: string[];
  clientValidation: string[];
}

interface VendorDetailContextOptions {
  projectId: number | null;
  userId: number;
}

interface VendorProjectContext {
  projectId: number;
  projectCategoryId: number | null;
}

@Injectable()
export class VendorsService {
  private readonly LISTING_STATUSES = ['Prospect', 'Validated', 'Active'];
  private readonly SEARCHABLE_VENDOR_TEXT_SQL = `LOWER(CONCAT_WS(' ',
    COALESCE(vendor.brand_name, ''),
    COALESCE(vendor.vendor_type, ''),
    COALESCE(vendor.listing_specialty, ''),
    COALESCE(vendor.listing_description, ''),
    COALESCE(vendor.service_domains, ''),
    COALESCE(vendor.platforms_experience, ''),
    COALESCE(vendor.legal_tech_stack, ''),
    COALESCE(vendor.security_notes, ''),
    COALESCE(vendor.data_source_notes, ''),
    COALESCE(vendor.internal_notes, '')
  ))`;

  private readonly CORE_CAPABILITY_KEYWORDS: Record<string, string[]> = {
    'document-management-systems': [
      'document management',
      'dms',
      'sharepoint',
      'netdocuments',
      'imanage',
    ],
    'ediscovery-platforms': ['ediscovery', 'e-discovery', 'relativity', 'nuix'],
    'practice-management-systems': [
      'practice management',
      'aderant',
      'elite 3e',
      'intapp',
    ],
    'erp-financial-systems': [
      'erp',
      'financial systems',
      'sap',
      'oracle',
      'workday',
      'dynamics',
    ],
    'cloud-migration': [
      'cloud migration',
      'cloud modernization',
      'azure',
      'aws',
      'gcp',
    ],
    'data-migration': [
      'data migration',
      'archive migration',
      'etl',
      'data conversion',
    ],
    'cybersecurity-compliance': [
      'cybersecurity',
      'security',
      'compliance',
      'soc 2',
      'iso 27001',
      'zero trust',
    ],
    'ai-automation': [
      'artificial intelligence',
      'ai',
      'automation',
      'machine learning',
    ],
    'custom-application-development': [
      'custom application',
      'application development',
      'software development',
      'legacy modernization',
    ],
    'integration-apis': [
      'integration',
      'api',
      'middleware',
      'system integration',
    ],
  };

  private readonly INDUSTRY_EXPERIENCE_KEYWORDS: Record<string, string[]> = {
    legal: ['legal', 'law firm'],
    'financial-services': [
      'financial services',
      'bank',
      'asset management',
      'fintech',
    ],
    healthcare: ['healthcare', 'health care', 'hospital', 'payer', 'provider'],
    government: ['government', 'public sector', 'federal', 'state'],
    'enterprise-corporate': ['enterprise', 'corporate', 'fortune'],
    'technology-saas': ['technology', 'saas', 'software company', 'tech'],
    insurance: ['insurance', 'insurer', 'carrier'],
    other: ['other'],
  };

  private readonly TIMELINE_CONDITIONS: Record<string, string> = {
    'immediate-0-30-days':
      '(vendor.lead_time_weeks IS NULL OR vendor.lead_time_weeks <= 4)',
    '30-60-days':
      '(vendor.lead_time_weeks IS NULL OR vendor.lead_time_weeks <= 8)',
    '60-plus-days': '1 = 1',
  };

  private readonly CERTIFICATION_CONDITIONS: Record<string, string> = {
    'iso-27001': "vendor.has_iso27001 = 'Y'",
    'soc-2': "vendor.has_soc2 = 'Y'",
  };

  private readonly CERTIFICATION_KEYWORDS: Record<string, string[]> = {
    'microsoft-partner': ['microsoft partner', 'microsoft gold'],
    'aws-partner': ['aws partner', 'amazon web services partner'],
    'google-cloud-partner': ['google cloud partner', 'gcp partner'],
    'industry-certifications': [
      'relativity',
      'epic',
      'servicenow',
      'certified',
    ],
    'ilta-member': ['ilta', 'international legal technology association'],
  };

  private readonly CLIENT_VALIDATION_CONDITIONS: Record<string, string> = {
    'case-studies-available':
      '(vendor.case_study_count_public > 0 OR vendor.legal_case_studies_count > 0)',
    'reference-clients-available':
      "(vendor.reference_available = 'Y' OR vendor.legal_references_available = 'Y')",
    'five-plus-projects-completed':
      '(vendor.case_study_count_public >= 5 OR vendor.legal_case_studies_count >= 5 OR vendor.legal_delivery_years >= 5)',
    'repeat-clients':
      "(vendor.reference_available = 'Y' OR vendor.legal_references_available = 'Y' OR vendor.case_study_count_public >= 3 OR vendor.legal_case_studies_count >= 3)",
    'fortune-500-clients':
      "(vendor.company_size_band LIKE '%1000+%' OR vendor.company_size_band LIKE '%10000+%' OR vendor.company_size_band LIKE '%25000+%' OR vendor.company_size_band LIKE '%300000+%' OR (vendor.reference_available = 'Y' AND vendor.case_study_count_public >= 5) OR (vendor.legal_references_available = 'Y' AND vendor.legal_case_studies_count >= 5))",
  };

  private readonly CLIENT_VALIDATION_KEYWORDS: Record<string, string[]> = {
    'repeat-clients': ['repeat client', 'repeat clients', 'retainer'],
    'fortune-500-clients': ['fortune 500', 'fortune500'],
  };

  // Matching weights as per requirement
  private readonly WEIGHTS = {
    CAPABILITY_MATCH: 0.4, // 40% - Project Category
    SYSTEM_MATCH: 0.25, // 25% - Primary Application / extracted systems
    PRICING_FIT: 0.1, // 10% - Budget vs vendor pricing
    TIMELINE_AVAILABILITY: 0, // 0% - Timeline & availability
    PROOF_REVIEWS: 0.12, // 12% - Reviews + case studies
    CERTIFICATIONS: 0.05, // 5% - Certs required by project
    ILTA_PRESENCE: 0.05, // 5% - Yes / No field
    BONUS: {
      MICROSOFT: 0.01, // +1%
      SERVICENOW: 0.01, // +1%
      WORKDAY: 0.01, // +1%
    },
  };

  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    @InjectRepository(VendorClient)
    private vendorClientsRepository: Repository<VendorClient>,
    @InjectRepository(VendorCaseStudy)
    private vendorCaseStudiesRepository: Repository<VendorCaseStudy>,
    @InjectRepository(VendorReview)
    private vendorReviewsRepository: Repository<VendorReview>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(ProjectVendorMatch)
    private projectVendorMatchesRepository: Repository<ProjectVendorMatch>,
    @InjectRepository(ProjectVendorReason)
    private projectVendorReasonsRepository: Repository<ProjectVendorReason>,
  ) {}

  async getListingFilterOptions(): Promise<VendorListingFilterOptionsResponseDto> {
    return {
      groups: VENDOR_FILTER_GROUPS.map((group) => ({
        key: group.key,
        label: group.label,
        options: group.options.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      })),
    };
  }

  async getListingVendors(
    filtersDto?: VendorListingFiltersDto,
  ): Promise<VendorListingResponseDto[]> {
    const filters = this.normalizeListingFilters(filtersDto);
    const queryBuilder = this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.status IN (:...statuses)', {
        statuses: this.LISTING_STATUSES,
      });

    this.applyListingFilters(queryBuilder, filters);

    const vendors = await queryBuilder
      .orderBy(
        'CASE WHEN vendor.listing_order IS NULL THEN 1 ELSE 0 END',
        'ASC',
      )
      .addOrderBy('vendor.listing_order', 'ASC')
      .addOrderBy('vendor.brand_name', 'ASC')
      .getMany();

    return vendors.map((vendor) => this.transformToListingResponseDto(vendor));
  }

  applyListingFiltersToQueryBuilder(
    queryBuilder: SelectQueryBuilder<any>,
    filtersDto?: VendorListingFiltersDto,
  ): void {
    const filters = this.normalizeListingFilters(filtersDto);
    this.applyListingFilters(queryBuilder, filters);
  }

  async getListingVendorById(
    vendorId: string,
  ): Promise<VendorListingResponseDto> {
    const vendor = await this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.vendor_id = :vendorId', { vendorId })
      .andWhere('vendor.status IN (:...statuses)', {
        statuses: this.LISTING_STATUSES,
      })
      .getOne();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return this.transformToListingResponseDto(vendor);
  }

  async getVendorDetailById(
    vendorId: string,
    context: VendorDetailContextOptions,
  ): Promise<VendorDetailResponseDto> {
    const vendor = await this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.vendor_id = :vendorId', { vendorId })
      .andWhere('vendor.status IN (:...statuses)', {
        statuses: this.LISTING_STATUSES,
      })
      .getOne();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const projectContext = await this.resolveProjectContext(
      context.projectId,
      context.userId,
    );

    const [clients, caseStudies, reviews, matchReason] = await Promise.all([
      this.getVendorClients(vendor.id, projectContext?.projectCategoryId || null),
      this.getVendorCaseStudies(
        vendor.id,
        projectContext?.projectCategoryId || null,
      ),
      this.getVendorReviews(vendor.id, projectContext?.projectCategoryId || null),
      this.resolveProjectMatchReason(vendor.id, projectContext?.projectId || null),
    ]);

    return this.transformToVendorDetailResponseDto(
      vendor,
      clients,
      caseStudies,
      reviews,
      matchReason,
    );
  }

  private async resolveProjectContext(
    projectId: number | null,
    userId: number,
  ): Promise<VendorProjectContext | null> {
    if (!projectId || !Number.isInteger(projectId) || projectId <= 0) {
      return null;
    }

    const project = await this.projectsRepository.findOne({
      where: {
        id: projectId,
        user_id: userId,
      },
      select: {
        id: true,
        project_category_id: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      projectId: project.id,
      projectCategoryId: Number(project.project_category_id) || null,
    };
  }

  private async getVendorClients(
    vendorId: number,
    projectCategoryId: number | null,
  ): Promise<VendorClient[]> {
    const queryBuilder = this.vendorClientsRepository
      .createQueryBuilder('client')
      .where('client.vendor_id = :vendorId', { vendorId });

    if (projectCategoryId) {
      queryBuilder
        .andWhere(
          '(client.project_category_id = :projectCategoryId OR client.project_category_id IS NULL)',
          { projectCategoryId },
        )
        .orderBy(
          'CASE WHEN client.project_category_id = :projectCategoryId THEN 0 ELSE 1 END',
          'ASC',
        )
        .setParameter('projectCategoryId', projectCategoryId);
    } else {
      queryBuilder.andWhere('client.project_category_id IS NULL');
    }

    return queryBuilder
      .addOrderBy('client.display_order', 'ASC')
      .addOrderBy('client.id', 'ASC')
      .getMany();
  }

  private async getVendorCaseStudies(
    vendorId: number,
    projectCategoryId: number | null,
  ): Promise<VendorCaseStudy[]> {
    const queryBuilder = this.vendorCaseStudiesRepository
      .createQueryBuilder('caseStudy')
      .where('caseStudy.vendor_id = :vendorId', { vendorId });

    if (projectCategoryId) {
      queryBuilder
        .andWhere(
          '(caseStudy.project_category_id = :projectCategoryId OR caseStudy.project_category_id IS NULL)',
          { projectCategoryId },
        )
        .orderBy(
          'CASE WHEN caseStudy.project_category_id = :projectCategoryId THEN 0 ELSE 1 END',
          'ASC',
        )
        .setParameter('projectCategoryId', projectCategoryId);
    } else {
      queryBuilder.andWhere('caseStudy.project_category_id IS NULL');
    }

    return queryBuilder
      .addOrderBy('caseStudy.display_order', 'ASC')
      .addOrderBy('caseStudy.id', 'ASC')
      .getMany();
  }

  private async getVendorReviews(
    vendorId: number,
    projectCategoryId: number | null,
  ): Promise<VendorReview[]> {
    const queryBuilder = this.vendorReviewsRepository
      .createQueryBuilder('review')
      .where('review.vendor_id = :vendorId', { vendorId });

    if (projectCategoryId) {
      queryBuilder
        .andWhere(
          '(review.project_category_id = :projectCategoryId OR review.project_category_id IS NULL)',
          { projectCategoryId },
        )
        .orderBy(
          'CASE WHEN review.project_category_id = :projectCategoryId THEN 0 ELSE 1 END',
          'ASC',
        )
        .setParameter('projectCategoryId', projectCategoryId);
    } else {
      queryBuilder.andWhere('review.project_category_id IS NULL');
    }

    return queryBuilder
      .addOrderBy('review.display_order', 'ASC')
      .addOrderBy('review.id', 'ASC')
      .getMany();
  }

  private async resolveProjectMatchReason(
    vendorId: number,
    projectId: number | null,
  ): Promise<{ text: string; source: 'openai' | 'fallback' } | null> {
    if (!projectId) {
      return null;
    }

    const match = await this.projectVendorMatchesRepository
      .createQueryBuilder('match')
      .where('match.project_id = :projectId', { projectId })
      .andWhere('match.vendor_id = :vendorId', { vendorId })
      .getOne();

    const reasonFromBreakdown = this.extractMatchReasonFromBreakdown(
      match?.score_breakdown_json,
    );
    if (reasonFromBreakdown) {
      return reasonFromBreakdown;
    }

    const cachedReason = await this.projectVendorReasonsRepository
      .createQueryBuilder('reason')
      .where('reason.project_id = :projectId', { projectId })
      .andWhere('reason.vendor_id = :vendorId', { vendorId })
      .getOne();

    if (!cachedReason?.reason_text) {
      return null;
    }

    return {
      text: String(cachedReason.reason_text).trim(),
      source: cachedReason.reason_source === 'openai' ? 'openai' : 'fallback',
    };
  }

  private extractMatchReasonFromBreakdown(
    scoreBreakdown: Record<string, unknown> | null | undefined,
  ): { text: string; source: 'openai' | 'fallback' } | null {
    if (!scoreBreakdown || typeof scoreBreakdown !== 'object') {
      return null;
    }

    const reasonText = String(scoreBreakdown['matchingReason'] || '').trim();
    if (!reasonText) {
      return null;
    }

    const source =
      scoreBreakdown['matchingReasonSource'] === 'openai'
        ? 'openai'
        : 'fallback';

    return {
      text: reasonText,
      source,
    };
  }

  private transformToVendorDetailResponseDto(
    vendor: Vendor,
    clients: VendorClient[],
    caseStudies: VendorCaseStudy[],
    reviews: VendorReview[],
    matchReason: { text: string; source: 'openai' | 'fallback' } | null,
  ): VendorDetailResponseDto {
    const listingDto = this.transformToListingResponseDto(vendor);
    const detailClients = this.dedupeVendorClients(clients);
    const detailCaseStudies = this.dedupeVendorCaseStudies(caseStudies);
    const detailReviews = this.dedupeVendorReviews(reviews).map((review) =>
      this.toVendorDetailReviewDto(review),
    );
    const response: VendorDetailResponseDto = {
      ...listingDto,
      keyClients: detailClients.map((client) => this.toVendorDetailClientDto(client)),
      caseStudies: detailCaseStudies.map((caseStudy) =>
        this.toVendorDetailCaseStudyDto(caseStudy),
      ),
      reviews: detailReviews,
    };

    if (matchReason?.text) {
      response.matchingReason = matchReason.text;
      response.matchingReasonSource = matchReason.source;
    }

    return response;
  }

  private toVendorDetailClientDto(client: VendorClient): VendorDetailClientDto {
    return {
      id: Number(client.id),
      name: String(client.client_name || '').trim(),
      logoUrl: client.client_logo_url || null,
      websiteUrl: client.client_website_url || null,
      sourceName: client.source_name || null,
      sourceUrl: client.source_url || null,
    };
  }

  private toVendorDetailCaseStudyDto(
    caseStudy: VendorCaseStudy,
  ): VendorDetailCaseStudyDto {
    return {
      id: Number(caseStudy.id),
      title: String(caseStudy.title || '').trim(),
      summary: String(caseStudy.summary || '').trim(),
      studyUrl: caseStudy.study_url || null,
      sourceName: caseStudy.source_name || null,
      sourceUrl: caseStudy.source_url || null,
    };
  }

  private toVendorDetailReviewDto(review: VendorReview): VendorDetailReviewDto {
    return {
      id: Number(review.id),
      reviewerName: String(review.reviewer_name || '').trim(),
      reviewerRole: review.reviewer_role || null,
      headline: review.headline || null,
      quote: String(review.review_text || '').trim(),
      rating: this.toNullablePositiveNumber(review.rating),
      source: review.review_source || null,
      sourceUrl: review.review_url || null,
      publishedAt: review.published_at || null,
    };
  }

  private dedupeVendorClients(clients: VendorClient[]): VendorClient[] {
    const seen = new Set<string>();
    const deduped: VendorClient[] = [];

    for (const client of clients) {
      const name = String(client.client_name || '').trim();
      const key = this.normalizeKey(name);
      if (!key || seen.has(key)) {
        continue;
      }

      seen.add(key);
      deduped.push(client);
    }

    return deduped;
  }

  private dedupeVendorCaseStudies(
    caseStudies: VendorCaseStudy[],
  ): VendorCaseStudy[] {
    const seen = new Set<string>();
    const deduped: VendorCaseStudy[] = [];

    for (const caseStudy of caseStudies) {
      const title = String(caseStudy.title || '').trim();
      const key = this.normalizeKey(title);

      if (!key || seen.has(key)) {
        continue;
      }

      seen.add(key);
      deduped.push(caseStudy);
    }

    return deduped;
  }

  private dedupeVendorReviews(reviews: VendorReview[]): VendorReview[] {
    const seen = new Set<string>();
    const deduped: VendorReview[] = [];

    for (const review of reviews) {
      const reviewerName = String(review.reviewer_name || '').trim();
      const quote = String(review.review_text || '').trim();
      const key = `${this.normalizeKey(reviewerName)}::${this.normalizeKey(quote).slice(0, 180)}`;

      if (!reviewerName || !quote || !key || seen.has(key)) {
        continue;
      }

      seen.add(key);
      deduped.push(review);
    }

    return deduped;
  }

  private normalizeKey(value: string): string {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private normalizeListingFilters(
    filtersDto?: VendorListingFiltersDto,
  ): VendorListingFilters {
    const normalizeFilterValues = (key: VendorFilterGroupKey): string[] => {
      const rawValues = Array.isArray(filtersDto?.[key]) ? filtersDto[key] : [];
      const allowedValues = VENDOR_FILTER_ALLOWED_VALUES[key];

      return Array.from(
        new Set(
          rawValues
            .map((value) => String(value).trim().toLowerCase())
            .filter((value) => allowedValues.has(value)),
        ),
      );
    };

    return {
      coreCapabilities: normalizeFilterValues('coreCapabilities'),
      industryExperience: normalizeFilterValues('industryExperience'),
      startTimeline: normalizeFilterValues('startTimeline'),
      verifiedCertifications: normalizeFilterValues('verifiedCertifications'),
      clientValidation: normalizeFilterValues('clientValidation'),
    };
  }

  private applyListingFilters(
    queryBuilder: SelectQueryBuilder<Vendor>,
    filters: VendorListingFilters,
  ): void {
    const groupConditions: Brackets[] = [];

    const coreCapabilitiesCondition = this.buildKeywordBasedFilter(
      filters.coreCapabilities,
      this.CORE_CAPABILITY_KEYWORDS,
      'core_capability',
    );
    if (coreCapabilitiesCondition) {
      groupConditions.push(coreCapabilitiesCondition);
    }

    const industryExperienceCondition = this.buildKeywordBasedFilter(
      filters.industryExperience,
      this.INDUSTRY_EXPERIENCE_KEYWORDS,
      'industry_experience',
    );
    if (industryExperienceCondition) {
      groupConditions.push(industryExperienceCondition);
    }

    const startTimelineCondition = this.buildClauseBasedFilter(
      filters.startTimeline,
      this.TIMELINE_CONDITIONS,
    );
    if (startTimelineCondition) {
      groupConditions.push(startTimelineCondition);
    }

    const verifiedCertificationsCondition = this.buildMixedFilter(
      filters.verifiedCertifications,
      this.CERTIFICATION_CONDITIONS,
      this.CERTIFICATION_KEYWORDS,
      'verified_certifications',
    );
    if (verifiedCertificationsCondition) {
      groupConditions.push(verifiedCertificationsCondition);
    }

    const clientValidationCondition = this.buildMixedFilter(
      filters.clientValidation,
      this.CLIENT_VALIDATION_CONDITIONS,
      this.CLIENT_VALIDATION_KEYWORDS,
      'client_validation',
    );
    if (clientValidationCondition) {
      groupConditions.push(clientValidationCondition);
    }

    if (groupConditions.length === 0) {
      return;
    }

    queryBuilder.andWhere(
      new Brackets((groupBuilder) => {
        groupConditions.forEach((condition) => {
          groupBuilder.orWhere(condition);
        });
      }),
    );
  }

  private buildClauseBasedFilter(
    selectedValues: string[],
    clauseMap: Record<string, string>,
  ): Brackets | null {
    const matchedClauses = selectedValues
      .map((selectedValue) => clauseMap[selectedValue])
      .filter(Boolean);

    if (matchedClauses.length === 0) {
      return null;
    }

    return new Brackets((clauseBuilder) => {
      matchedClauses.forEach((clause) => {
        clauseBuilder.orWhere(clause);
      });
    });
  }

  private buildKeywordBasedFilter(
    selectedValues: string[],
    keywordMap: Record<string, string[]>,
    parameterPrefix: string,
  ): Brackets | null {
    const matchedKeywords = selectedValues
      .map((selectedValue) => keywordMap[selectedValue])
      .filter((keywords) => Array.isArray(keywords) && keywords.length > 0);

    if (matchedKeywords.length === 0) {
      return null;
    }

    return new Brackets((groupBuilder) => {
      matchedKeywords.forEach((keywords, selectedIndex) => {
        groupBuilder.orWhere(
          new Brackets((keywordBuilder) => {
            keywords.forEach((keyword, keywordIndex) => {
              const parameterName = `${parameterPrefix}_${selectedIndex}_${keywordIndex}`;
              keywordBuilder.orWhere(
                `${this.SEARCHABLE_VENDOR_TEXT_SQL} LIKE :${parameterName}`,
                {
                  [parameterName]: `%${keyword.toLowerCase()}%`,
                },
              );
            });
          }),
        );
      });
    });
  }

  private buildMixedFilter(
    selectedValues: string[],
    clauseMap: Record<string, string>,
    keywordMap: Record<string, string[]>,
    parameterPrefix: string,
  ): Brackets | null {
    const matchedClauses = selectedValues
      .map((selectedValue) => clauseMap[selectedValue])
      .filter(Boolean);

    const matchedKeywords = selectedValues
      .map((selectedValue) => keywordMap[selectedValue])
      .filter((keywords) => Array.isArray(keywords) && keywords.length > 0);

    if (matchedClauses.length === 0 && matchedKeywords.length === 0) {
      return null;
    }

    return new Brackets((groupBuilder) => {
      matchedClauses.forEach((clause) => {
        groupBuilder.orWhere(clause);
      });

      matchedKeywords.forEach((keywords, selectedIndex) => {
        groupBuilder.orWhere(
          new Brackets((keywordBuilder) => {
            keywords.forEach((keyword, keywordIndex) => {
              const parameterName = `${parameterPrefix}_${selectedIndex}_${keywordIndex}`;
              keywordBuilder.orWhere(
                `${this.SEARCHABLE_VENDOR_TEXT_SQL} LIKE :${parameterName}`,
                {
                  [parameterName]: `%${keyword.toLowerCase()}%`,
                },
              );
            });
          }),
        );
      });
    });
  }

  async findMatchingVendors(
    projectCategory: string,
    systemName: string,
    budgetMin?: number,
    budgetMax?: number,
    budgetAmount?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<VendorResponseDto[]> {
    // Get all active vendors (including Prospect status)
    const vendors = await this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.status IN (:...statuses)', {
        statuses: ['Prospect', 'Validated', 'Active'],
      })
      .getMany();

    const projectCriteria: ProjectCriteria = {
      projectCategory,
      systemName,
      budgetAmount,
      budgetMin,
      budgetMax,
      startDate,
      endDate,
    };

    // Calculate matching score for each vendor
    const vendorsWithScores = vendors.map((vendor) => {
      const matchingScore = this.calculateMatchingScore(
        vendor,
        projectCriteria,
      );
      return {
        vendor,
        matchingScore,
      };
    });

    // Filter vendors that support the system name
    const systemKeyword = String(projectCriteria.systemName || '').trim();
    if (!systemKeyword) {
      return [];
    }

    const systemSupportingVendors = vendorsWithScores.filter(({ vendor }) => {
      return textContainsSystemKeyword(
        String(vendor.legal_tech_stack || ''),
        systemKeyword,
      );
    });

    // Filter out vendors with 0 or null matching scores
    const validVendors = systemSupportingVendors.filter(
      ({ matchingScore }) => matchingScore > 0,
    );

    // Sort by matching score (highest first)
    validVendors.sort((a, b) => b.matchingScore - a.matchingScore);

    // Return only top 5 vendors
    const top5Vendors = validVendors.slice(0, 5);

    // Transform to response format
    return top5Vendors.map(({ vendor, matchingScore }) =>
      this.transformToResponseDto(vendor, matchingScore),
    );
  }

  private calculateMatchingScore(
    vendor: Vendor,
    criteria: ProjectCriteria,
  ): number {
    let totalScore = 0;

    // 1. Capability Match (40%) - Project Category + Work Type
    totalScore +=
      this.calculateCapabilityMatch(vendor, criteria) *
      this.WEIGHTS.CAPABILITY_MATCH;

    // 2. System Match (25%) - Primary Application / extracted systems
    totalScore +=
      this.calculateSystemMatch(vendor, criteria) * this.WEIGHTS.SYSTEM_MATCH;

    // 3. Pricing Fit (10%) - Budget vs vendor pricing
    totalScore +=
      this.calculatePricingFit(vendor, criteria) * this.WEIGHTS.PRICING_FIT;

    // 4. Timeline & Availability Fit (0%)
    totalScore +=
      this.calculateTimelineAvailabilityFit(vendor, criteria) *
      this.WEIGHTS.TIMELINE_AVAILABILITY;

    // 5. Proof & Reviews (12%)
    totalScore +=
      this.calculateProofReviews(vendor) * this.WEIGHTS.PROOF_REVIEWS;

    // 6. Certifications & Credentials (5%)
    totalScore +=
      this.calculateCertifications(vendor) * this.WEIGHTS.CERTIFICATIONS;

    // 7. ILTA Presence (5%)
    totalScore +=
      this.calculateILTAPresence(vendor) * this.WEIGHTS.ILTA_PRESENCE;

    // 8. Partner bonus (+1% each)
    totalScore += this.calculatePartnerBonus(vendor);

    return Math.max(0, Math.min(100, Math.round(totalScore * 100)));
  }

  private calculateCapabilityMatch(
    vendor: Vendor,
    criteria: ProjectCriteria,
  ): number {
    let score = 0;

    // Map project categories to service domain keywords
    const categoryMapping: Record<string, string[]> = {
      'legal-apps': ['enterprise apps', 'collaboration', 'legal'],
      'cloud-migration': ['cloud'],
      'enterprise-it': ['enterprise apps', 'service mgmt'],
      'app-upgrades': ['enterprise apps'],
      collaboration: ['collaboration'],
      security: ['identity', 'security'],
      'data-archive': ['enterprise apps'],
      other: [],
    };

    // Check if service domains match the project category
    if (vendor.service_domains) {
      const serviceDomains = vendor.service_domains.toLowerCase();
      const category = criteria.projectCategory.toLowerCase();
      const keywords = categoryMapping[category] || [];

      // Check for keyword matches
      let matchCount = 0;
      for (const keyword of keywords) {
        if (serviceDomains.includes(keyword)) {
          matchCount++;
        }
      }

      if (keywords.length > 0) {
        score += (matchCount / keywords.length) * 0.7;
      } else {
        // If no mapping exists, give neutral score
        score += 0.3;
      }
    } else {
      // No service domains data - give minimal score
      score += 0.2;
    }

    return Math.min(score, 1); // Cap at 1
  }

  private calculateSystemMatch(
    vendor: Vendor,
    criteria: ProjectCriteria,
  ): number {
    const systemKeyword = String(criteria.systemName || '').trim();
    if (!systemKeyword) {
      return 0;
    }

    return textContainsSystemKeyword(
      String(vendor.legal_tech_stack || ''),
      systemKeyword,
    )
      ? 1
      : 0;
  }

  private calculatePricingFit(
    vendor: Vendor,
    criteria: ProjectCriteria,
  ): number {
    const projectBudget =
      criteria.budgetAmount || criteria.budgetMax || criteria.budgetMin;

    if (
      !projectBudget ||
      !vendor.min_project_size_usd ||
      !vendor.max_project_size_usd
    ) {
      return 0.5; // Neutral score if no pricing data
    }

    // Perfect fit: project budget within vendor range
    if (
      projectBudget >= vendor.min_project_size_usd &&
      projectBudget <= vendor.max_project_size_usd
    ) {
      return 1.0;
    }

    // Slightly below minimum
    if (projectBudget < vendor.min_project_size_usd) {
      const ratio = projectBudget / vendor.min_project_size_usd;
      if (ratio >= 0.8) return 0.7; // Within 20% of minimum
      if (ratio >= 0.6) return 0.4; // Within 40% of minimum
      return 0.1; // Too low
    }

    // Above maximum
    if (projectBudget > vendor.max_project_size_usd) {
      const ratio = vendor.max_project_size_usd / projectBudget;
      if (ratio >= 0.8) return 0.7; // Within 20% over
      if (ratio >= 0.6) return 0.4; // Within 40% over
      return 0.1; // Too high
    }

    return 0.5;
  }

  private calculateTimelineAvailabilityFit(
    vendor: Vendor,
    criteria: ProjectCriteria,
  ): number {
    if (!criteria.startDate || !vendor.lead_time_weeks) {
      return 0.5; // Neutral if no timeline data
    }

    const startDate = new Date(criteria.startDate);
    const today = new Date();
    const weeksUntilStart = Math.ceil(
      (startDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );

    // Check if vendor can meet the timeline
    if (weeksUntilStart >= vendor.lead_time_weeks) {
      return 1.0; // Perfect fit
    } else if (weeksUntilStart >= vendor.lead_time_weeks * 0.8) {
      return 0.7; // Close fit
    } else if (weeksUntilStart >= vendor.lead_time_weeks * 0.6) {
      return 0.4; // Tight but possible
    }

    return 0.2; // May not meet timeline
  }

  private calculateProofReviews(vendor: Vendor): number {
    let score = 0;

    // Reviews and ratings (50% weight)
    if (vendor.rating_1 || vendor.rating_2) {
      const avgRating = ((vendor.rating_1 || 0) + (vendor.rating_2 || 0)) / 2;
      score += (avgRating / 5) * 0.5; // Normalize to 0-0.5
    }

    // Case studies (30% weight)
    if (vendor.case_study_count_public > 0) {
      const caseStudyScore = Math.min(vendor.case_study_count_public / 10, 1); // Cap at 10 case studies
      score += caseStudyScore * 0.3;
    }

    // References available (20% weight)
    if (vendor.reference_available === 'Y') {
      score += 0.2;
    } else if (vendor.reference_available === 'Unk') {
      score += 0.1;
    }

    return Math.min(score, 1);
  }

  private calculateCertifications(vendor: Vendor): number {
    let score = 0;

    // SOC2 compliance
    if (vendor.has_soc2 === 'Y') {
      score += 0.5;
    }

    // ISO27001 compliance
    if (vendor.has_iso27001 === 'Y') {
      score += 0.5;
    }

    return Math.min(score, 1);
  }

  private calculateILTAPresence(vendor: Vendor): number {
    return vendor.ilta_present ? 1 : 0;
  }

  private calculatePartnerBonus(vendor: Vendor): number {
    let score = 0;

    if (vendor.is_microsoft_partner) {
      score += this.WEIGHTS.BONUS.MICROSOFT;
    }

    if (vendor.is_servicenow_partner) {
      score += this.WEIGHTS.BONUS.SERVICENOW;
    }

    if (vendor.is_workday_partner) {
      score += this.WEIGHTS.BONUS.WORKDAY;
    }

    return score;
  }

  private transformToResponseDto(
    vendor: Vendor,
    matchingScore: number,
  ): VendorResponseDto {
    const tier = vendor.listing_tier || this.calculateTier(vendor);

    // Generate logo (first 2-3 letters of brand name)
    const logo = this.generateLogo(vendor.brand_name);

    const location = this.formatLocation(vendor);
    const rating = this.resolveRating(vendor);
    const description =
      vendor.listing_description || this.generateDescription(vendor);
    const specialty = this.determineSpecialty(vendor, 2);
    const specialtyFull = this.determineSpecialty(vendor, 0);
    const startFrom = this.formatStartFrom(vendor.min_project_size_usd);

    return {
      id: vendor.id,
      vendorId: vendor.vendor_id,
      name: vendor.brand_name,
      logo,
      logoUrl: vendor.logo_url || null,
      category: vendor.vendor_type || 'Technology Services',
      location,
      rating: Number(rating),
      tier,
      description,
      specialty,
      specialtyFull,
      startFrom,
      matchingScore,
    };
  }

  private transformToListingResponseDto(
    vendor: Vendor,
  ): VendorListingResponseDto {
    return {
      id: vendor.id,
      vendorId: vendor.vendor_id,
      name: vendor.brand_name,
      logoUrl: vendor.logo_url || null,
      websiteUrl: vendor.website_url || null,
      headquarter: vendor.hq_country,
      category: vendor.vendor_type || 'Technology Services',
      location: this.formatLocation(vendor),
      rating: this.resolveRating(vendor),
      tier: vendor.listing_tier || this.calculateTier(vendor),
      description:
        vendor.listing_description || this.generateDescription(vendor),
      specialty: this.determineSpecialty(vendor, 2),
      specialtyFull: this.determineSpecialty(vendor, 0),
      startFrom: this.formatStartFrom(vendor.min_project_size_usd),
    };
  }

  private calculateTier(vendor: Vendor): string {
    // Tier logic based on company size, ratings, and legal focus
    if (
      vendor.company_size_band?.includes('1000+') ||
      vendor.legal_focus_level === 'Legal-only'
    ) {
      return 'Tier 1';
    } else if (
      vendor.company_size_band?.includes('100-') ||
      vendor.legal_focus_level === 'Strong'
    ) {
      return 'Tier 2';
    }
    return 'Tier 3';
  }

  private generateLogo(brandName: string): string {
    // Extract first 2-3 letters for logo
    const words = brandName.split(' ');
    if (words.length >= 2) {
      return words
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
    }
    return brandName.substring(0, 3).toUpperCase();
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

  private determineSpecialty(vendor: Vendor, maxItems: number): string {
    const specialtyValues = this.extractSpecialtyValues(vendor);
    if (specialtyValues.length === 0) {
      return vendor.vendor_type || 'General IT Services';
    }

    const visibleValues =
      maxItems > 0 ? specialtyValues.slice(0, maxItems) : specialtyValues;

    return visibleValues.join(', ');
  }

  private extractSpecialtyValues(vendor: Vendor): string[] {
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
      const normalizedValue = this.normalizeForDedup(value);
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

  private normalizeForDedup(value: string): string {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9+\s.-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private formatLocation(vendor: Vendor): string {
    return vendor.hq_state
      ? `${vendor.hq_state}, ${vendor.hq_country}`
      : vendor.hq_country;
  }

  private resolveRating(vendor: Vendor): number {
    return Number(vendor.rating_1 || vendor.rating_2 || 0);
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private toNullablePositiveNumber(value: unknown): number | null {
    const parsed = this.toNumber(value);
    if (parsed <= 0) {
      return null;
    }

    return parsed;
  }

  private formatStartFrom(minProjectSizeUsd: number): string {
    if (!minProjectSizeUsd) {
      return 'Contact for pricing';
    }

    return `$${(Number(minProjectSizeUsd) / 1000).toFixed(0)}k`;
  }

}
