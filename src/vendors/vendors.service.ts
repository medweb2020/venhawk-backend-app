import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { VendorListingResponseDto } from './dto/vendor-listing-response.dto';
import { VendorListingFiltersDto } from './dto/vendor-listing-filters.dto';
import { VendorListingFilterOptionsResponseDto } from './dto/vendor-listing-filter-options-response.dto';
import {
  VENDOR_FILTER_ALLOWED_VALUES,
  VENDOR_FILTER_GROUPS,
  VendorFilterGroupKey,
} from './constants/vendor-filters.constants';

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
    const systemNameLower = projectCriteria.systemName.toLowerCase();
    const systemSupportingVendors = vendorsWithScores.filter(({ vendor }) => {
      // Check if vendor has the system in their tech stack or platforms
      const hasSystemSupport =
        (vendor.legal_tech_stack &&
          vendor.legal_tech_stack.toLowerCase().includes(systemNameLower)) ||
        (vendor.platforms_experience &&
          vendor.platforms_experience.toLowerCase().includes(systemNameLower));

      return hasSystemSupport;
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

    // Legal focus bonus for legal-related projects
    if (
      criteria.projectCategory.includes('legal') &&
      vendor.legal_focus_level
    ) {
      if (vendor.legal_focus_level === 'Legal-only') score += 0.3;
      else if (vendor.legal_focus_level === 'Strong') score += 0.2;
      else if (vendor.legal_focus_level === 'Some') score += 0.1;
    }

    return Math.min(score, 1); // Cap at 1
  }

  private calculateSystemMatch(
    vendor: Vendor,
    criteria: ProjectCriteria,
  ): number {
    let score = 0;
    let hasData = false;

    const systemName = criteria.systemName.toLowerCase();

    // Check legal tech stack
    if (vendor.legal_tech_stack) {
      hasData = true;
      const techStack = vendor.legal_tech_stack.toLowerCase();
      if (techStack.includes(systemName)) {
        score += 0.6;
      }
    }

    // Check platforms experience
    if (vendor.platforms_experience) {
      hasData = true;
      const platforms = vendor.platforms_experience.toLowerCase();
      if (platforms.includes(systemName)) {
        score += 0.4;
      }
    }

    // If no tech stack data available, give neutral score
    // This ensures vendors without specific system data aren't completely excluded
    if (!hasData) {
      return 0.4;
    }

    return Math.min(score, 1);
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
    const specialty =
      vendor.listing_specialty || this.determineSpecialty(vendor);
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
      specialty: vendor.listing_specialty || this.determineSpecialty(vendor),
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

  private determineSpecialty(vendor: Vendor): string {
    // Priority: legal_tech_stack > platforms_experience > service_domains
    if (vendor.legal_tech_stack) {
      const techs = vendor.legal_tech_stack.split(',').slice(0, 2);
      return techs.join(', ');
    }

    if (vendor.platforms_experience) {
      const platforms = vendor.platforms_experience.split(',').slice(0, 2);
      return platforms.join(', ');
    }

    if (vendor.service_domains) {
      const domains = vendor.service_domains.split(',')[0];
      return domains;
    }

    return vendor.vendor_type || 'General IT Services';
  }

  private formatLocation(vendor: Vendor): string {
    return vendor.hq_state
      ? `${vendor.hq_state}, ${vendor.hq_country}`
      : vendor.hq_country;
  }

  private resolveRating(vendor: Vendor): number {
    return Number(vendor.rating_1 || vendor.rating_2 || 0);
  }

  private formatStartFrom(minProjectSizeUsd: number): string {
    if (!minProjectSizeUsd) {
      return 'Contact for pricing';
    }

    return `$${(Number(minProjectSizeUsd) / 1000).toFixed(0)}k`;
  }
}
