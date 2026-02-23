import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { VendorListingResponseDto } from './dto/vendor-listing-response.dto';

interface ProjectCriteria {
  projectCategory: string;
  systemName: string;
  budgetAmount?: number;
  budgetMin?: number;
  budgetMax?: number;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class VendorsService {
  private readonly LISTING_VENDOR_IDS = [
    'dff94198-9f09-4e32-934a-d367d5eb9af7',
    'be8ab7ca-8cf9-41e1-a031-d9c75f6345f8',
    '9ebe8dd2-b6ec-4f65-99f1-3048fdb6f9e0',
    '65fe96d7-315f-4c4f-a046-a9d48f7bb56d',
    '86593b74-3f79-4c83-b484-8813f8f3d760',
    '3d11b0ec-e51d-4a25-9d6f-41c56566ce7c',
  ];

  // Matching weights as per requirement
  private readonly WEIGHTS = {
    CAPABILITY_MATCH: 0.30,    // 30% - Project Category + Work Type
    SYSTEM_MATCH: 0.25,        // 25% - Primary Application / extracted systems
    PRICING_FIT: 0.15,         // 15% - Budget vs vendor pricing
    TIMELINE_AVAILABILITY: 0.10, // 10% - Timeline vs capacity
    PROOF_REVIEWS: 0.10,       // 10% - Reviews + case studies
    CERTIFICATIONS: 0.05,      // 5% - Certs required by project
    ILTA_PRESENCE: 0.05,       // 5% - Yes / No field
  };

  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) {}

  async getListingVendors(): Promise<VendorListingResponseDto[]> {
    const vendors = await this.vendorsRepository.find({
      where: {
        vendor_id: In(this.LISTING_VENDOR_IDS),
        status: In(['Prospect', 'Validated', 'Active']),
      },
    });

    const orderIndex = new Map(this.LISTING_VENDOR_IDS.map((id, index) => [id, index]));

    const orderedVendors = vendors.sort((a, b) =>
      (orderIndex.get(a.vendor_id) ?? Number.MAX_SAFE_INTEGER) -
      (orderIndex.get(b.vendor_id) ?? Number.MAX_SAFE_INTEGER)
    );

    return orderedVendors.map((vendor) => this.transformToListingResponseDto(vendor));
  }

  async getListingVendorById(vendorId: string): Promise<VendorListingResponseDto> {
    const vendor = await this.vendorsRepository.findOne({
      where: {
        vendor_id: vendorId,
        status: In(['Prospect', 'Validated', 'Active']),
      },
    });

    if (!vendor || !this.LISTING_VENDOR_IDS.includes(vendor.vendor_id)) {
      throw new NotFoundException('Vendor not found');
    }

    return this.transformToListingResponseDto(vendor);
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
      .where('vendor.status IN (:...statuses)', { statuses: ['Prospect', 'Validated', 'Active'] })
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
    const vendorsWithScores = vendors.map(vendor => {
      const matchingScore = this.calculateMatchingScore(vendor, projectCriteria);
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
        (vendor.legal_tech_stack && vendor.legal_tech_stack.toLowerCase().includes(systemNameLower)) ||
        (vendor.platforms_experience && vendor.platforms_experience.toLowerCase().includes(systemNameLower));

      return hasSystemSupport;
    });

    // Filter out vendors with 0 or null matching scores
    const validVendors = systemSupportingVendors.filter(
      ({ matchingScore }) => matchingScore > 0
    );

    // Sort by matching score (highest first)
    validVendors.sort((a, b) => b.matchingScore - a.matchingScore);

    // Return only top 5 vendors
    const top5Vendors = validVendors.slice(0, 5);

    // Transform to response format
    return top5Vendors.map(({ vendor, matchingScore }) =>
      this.transformToResponseDto(vendor, matchingScore)
    );
  }

  private calculateMatchingScore(vendor: Vendor, criteria: ProjectCriteria): number {
    let totalScore = 0;

    // 1. Capability Match (30%) - Project Category + Work Type
    totalScore += this.calculateCapabilityMatch(vendor, criteria) * this.WEIGHTS.CAPABILITY_MATCH;

    // 2. System Match (25%) - Primary Application / extracted systems
    totalScore += this.calculateSystemMatch(vendor, criteria) * this.WEIGHTS.SYSTEM_MATCH;

    // 3. Pricing Fit (15%) - Budget vs vendor pricing
    totalScore += this.calculatePricingFit(vendor, criteria) * this.WEIGHTS.PRICING_FIT;

    // 4. Timeline & Availability Fit (10%)
    totalScore += this.calculateTimelineAvailabilityFit(vendor, criteria) * this.WEIGHTS.TIMELINE_AVAILABILITY;

    // 5. Proof & Reviews (10%)
    totalScore += this.calculateProofReviews(vendor) * this.WEIGHTS.PROOF_REVIEWS;

    // 6. Certifications & Credentials (5%)
    totalScore += this.calculateCertifications(vendor) * this.WEIGHTS.CERTIFICATIONS;

    // 7. ILTA Presence (5%)
    totalScore += this.calculateILTAPresence(vendor) * this.WEIGHTS.ILTA_PRESENCE;

    return Math.round(totalScore * 100); // Return as percentage (0-100)
  }

  private calculateCapabilityMatch(vendor: Vendor, criteria: ProjectCriteria): number {
    let score = 0;

    // Map project categories to service domain keywords
    const categoryMapping: Record<string, string[]> = {
      'legal-apps': ['enterprise apps', 'collaboration', 'legal'],
      'cloud-migration': ['cloud'],
      'enterprise-it': ['enterprise apps', 'service mgmt'],
      'app-upgrades': ['enterprise apps'],
      'collaboration': ['collaboration'],
      'security': ['identity', 'security'],
      'data-archive': ['enterprise apps'],
      'other': [],
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
    if (criteria.projectCategory.includes('legal') && vendor.legal_focus_level) {
      if (vendor.legal_focus_level === 'Legal-only') score += 0.3;
      else if (vendor.legal_focus_level === 'Strong') score += 0.2;
      else if (vendor.legal_focus_level === 'Some') score += 0.1;
    }

    return Math.min(score, 1); // Cap at 1
  }

  private calculateSystemMatch(vendor: Vendor, criteria: ProjectCriteria): number {
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

  private calculatePricingFit(vendor: Vendor, criteria: ProjectCriteria): number {
    const projectBudget = criteria.budgetAmount || criteria.budgetMax || criteria.budgetMin;

    if (!projectBudget || !vendor.min_project_size_usd || !vendor.max_project_size_usd) {
      return 0.5; // Neutral score if no pricing data
    }

    // Perfect fit: project budget within vendor range
    if (projectBudget >= vendor.min_project_size_usd && projectBudget <= vendor.max_project_size_usd) {
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

  private calculateTimelineAvailabilityFit(vendor: Vendor, criteria: ProjectCriteria): number {
    if (!criteria.startDate || !vendor.lead_time_weeks) {
      return 0.5; // Neutral if no timeline data
    }

    const startDate = new Date(criteria.startDate);
    const today = new Date();
    const weeksUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));

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
    // Check if vendor has legal focus (proxy for ILTA presence)
    if (vendor.legal_focus_level === 'Legal-only') {
      return 1.0;
    } else if (vendor.legal_focus_level === 'Strong') {
      return 0.7;
    } else if (vendor.legal_focus_level === 'Some') {
      return 0.4;
    }

    return 0;
  }

  private transformToResponseDto(vendor: Vendor, matchingScore: number): VendorResponseDto {
    const tier = vendor.listing_tier || this.calculateTier(vendor);

    // Generate logo (first 2-3 letters of brand name)
    const logo = this.generateLogo(vendor.brand_name);

    const location = this.formatLocation(vendor);
    const rating = this.resolveRating(vendor);
    const description = vendor.listing_description || this.generateDescription(vendor);
    const specialty = vendor.listing_specialty || this.determineSpecialty(vendor);
    const startFrom = this.formatStartFrom(vendor.min_project_size_usd);

    return {
      id: vendor.id,
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

  private transformToListingResponseDto(vendor: Vendor): VendorListingResponseDto {
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
      description: vendor.listing_description || this.generateDescription(vendor),
      specialty: vendor.listing_specialty || this.determineSpecialty(vendor),
      startFrom: this.formatStartFrom(vendor.min_project_size_usd),
    };
  }

  private calculateTier(vendor: Vendor): string {
    // Tier logic based on company size, ratings, and legal focus
    if (vendor.company_size_band?.includes('1000+') || vendor.legal_focus_level === 'Legal-only') {
      return 'Tier 1';
    } else if (vendor.company_size_band?.includes('100-') || vendor.legal_focus_level === 'Strong') {
      return 'Tier 2';
    }
    return 'Tier 3';
  }

  private generateLogo(brandName: string): string {
    // Extract first 2-3 letters for logo
    const words = brandName.split(' ');
    if (words.length >= 2) {
      return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
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

    return parts.join(' ') || 'Technology consulting and implementation services';
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
    return vendor.hq_state ? `${vendor.hq_state}, ${vendor.hq_country}` : vendor.hq_country;
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
