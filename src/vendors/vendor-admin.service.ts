import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { In, Repository } from 'typeorm';
import { ProjectCategory } from '../projects/entities/project-category.entity';
import { VendorProjectCategory } from '../projects/entities/vendor-project-category.entity';
import { SupabaseService } from '../supabase/supabase.service';
import {
  UpsertVendorAdminCaseStudyDto,
  UpsertVendorAdminClientDto,
  UpsertVendorAdminDto,
  VendorAdminCaseStudyDto,
  VendorAdminClientDto,
  VendorAdminFieldOptionsDto,
  VendorAdminOptionDto,
  VendorAdminOverviewResponseDto,
  VendorAdminProjectCategoryOptionDto,
  VendorAdminVendorDetailDto,
  VendorAdminVendorListItemDto,
  VendorAdminVendorRatingDto,
} from './dto/vendor-admin.dto';
import { VendorCaseStudy } from './entities/vendor-case-study.entity';
import { VendorClient } from './entities/vendor-client.entity';
import { Vendor } from './entities/vendor.entity';

@Injectable()
export class VendorAdminService {
  private readonly VENDOR_ADMIN_STATUS_OPTIONS: VendorAdminOptionDto[] = [
    { value: 'Prospect', label: 'Prospect' },
    { value: 'Validated', label: 'Validated' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Do-not-use', label: 'Do Not Use' },
  ];

  private readonly VENDOR_ADMIN_LEGAL_FOCUS_OPTIONS: VendorAdminOptionDto[] = [
    { value: 'None', label: 'None' },
    { value: 'Some', label: 'Some' },
    { value: 'Strong', label: 'Strong' },
    { value: 'Legal-only', label: 'Legal-only' },
  ];

  private readonly VENDOR_ADMIN_TRI_STATE_OPTIONS: VendorAdminOptionDto[] = [
    { value: 'Y', label: 'Yes' },
    { value: 'N', label: 'No' },
    { value: 'Unk', label: 'Unknown' },
  ];

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorsRepository: Repository<Vendor>,
    @InjectRepository(VendorClient)
    private readonly vendorClientsRepository: Repository<VendorClient>,
    @InjectRepository(VendorCaseStudy)
    private readonly vendorCaseStudiesRepository: Repository<VendorCaseStudy>,
    @InjectRepository(ProjectCategory)
    private readonly projectCategoriesRepository: Repository<ProjectCategory>,
    @InjectRepository(VendorProjectCategory)
    private readonly vendorProjectCategoriesRepository: Repository<VendorProjectCategory>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async getVendorAdminOverview(): Promise<VendorAdminOverviewResponseDto> {
    const [vendorRows, projectCategories, vendorProjectCategories] = await Promise.all([
      this.vendorsRepository
        .createQueryBuilder('vendor')
        .select([
          'vendor.id AS vendor_id',
          'vendor.vendor_id AS vendor_vendor_id',
          'vendor.brand_name AS vendor_brand_name',
          'vendor.logo_url AS vendor_logo_url',
          'vendor.website_url AS vendor_website_url',
          'vendor.status AS vendor_status',
        ])
        .orderBy('vendor.brand_name', 'ASC')
        .getRawMany(),
      this.projectCategoriesRepository.find({
        order: { label: 'ASC' },
      }),
      this.vendorProjectCategoriesRepository.find(),
    ]);

    const categoryOptions = projectCategories.map((category) => this.toProjectCategoryOption(category));
    const categoryLookup = new Map(categoryOptions.map((category) => [category.id, category]));
    const categoriesByVendorId = new Map<number, VendorAdminProjectCategoryOptionDto[]>();

    vendorProjectCategories.forEach((mapping) => {
      const category = categoryLookup.get(mapping.project_category_id);
      if (!category) {
        return;
      }

      const currentCategories = categoriesByVendorId.get(mapping.vendor_id) || [];
      currentCategories.push(category);
      categoriesByVendorId.set(mapping.vendor_id, currentCategories);
    });

    const vendors: VendorAdminVendorListItemDto[] = vendorRows.map((row) => ({
      id: this.toNumber(row.vendor_id),
      vendorId: String(row.vendor_vendor_id || ''),
      brandName: String(row.vendor_brand_name || ''),
      logoUrl: this.toNullableString(row.vendor_logo_url),
      websiteUrl: String(row.vendor_website_url || ''),
      status: String(row.vendor_status || 'Prospect'),
      projectCategories: (categoriesByVendorId.get(this.toNumber(row.vendor_id)) || [])
        .slice()
        .sort((left, right) => left.label.localeCompare(right.label)),
    }));

    return {
      vendors,
      projectCategories: categoryOptions,
      fieldOptions: this.buildVendorAdminFieldOptions(),
    };
  }

  async getVendorAdminVendor(vendorId: string): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    return this.buildVendorAdminVendorDetail(vendor);
  }

  async createVendorAdminVendor(input: UpsertVendorAdminDto): Promise<VendorAdminVendorDetailDto> {
    const normalizedBrandName = this.requireBrandName(input.brandName);
    await this.assertVendorBrandNameAvailable(normalizedBrandName);
    const projectCategoryIds = await this.validateProjectCategoryIds(input.projectCategoryIds);

    const createdVendorId = await this.vendorsRepository.manager.transaction(async (manager) => {
      const vendorRepository = manager.getRepository(Vendor);
      const vendorProjectCategoriesRepository = manager.getRepository(VendorProjectCategory);

      const vendor = vendorRepository.create({
        vendor_id: randomUUID(),
      });

      this.applyVendorAdminInput(vendor, input, normalizedBrandName);
      vendor.data_owner = 'Manual Admin';
      const savedVendor = await vendorRepository.save(vendor);

      await vendorProjectCategoriesRepository.insert(
        projectCategoryIds.map((projectCategoryId) => ({
          vendor_id: savedVendor.id,
          project_category_id: projectCategoryId,
        })),
      );

      return savedVendor.vendor_id;
    });

    return this.getVendorAdminVendor(createdVendorId);
  }

  async updateVendorAdminVendor(
    vendorId: string,
    input: UpsertVendorAdminDto,
  ): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const normalizedBrandName = this.requireBrandName(input.brandName);
    await this.assertVendorBrandNameAvailable(normalizedBrandName, vendor.id);
    const projectCategoryIds = await this.validateProjectCategoryIds(input.projectCategoryIds);

    await this.vendorsRepository.manager.transaction(async (manager) => {
      const vendorRepository = manager.getRepository(Vendor);
      const vendorProjectCategoriesRepository = manager.getRepository(VendorProjectCategory);
      const vendorForUpdate = await vendorRepository.findOne({
        where: { id: vendor.id },
      });

      if (!vendorForUpdate) {
        throw new NotFoundException('Vendor not found.');
      }

      this.applyVendorAdminInput(vendorForUpdate, input, normalizedBrandName);
      await vendorRepository.save(vendorForUpdate);
      await vendorProjectCategoriesRepository.delete({ vendor_id: vendor.id });
      await vendorProjectCategoriesRepository.insert(
        projectCategoryIds.map((projectCategoryId) => ({
          vendor_id: vendor.id,
          project_category_id: projectCategoryId,
        })),
      );
    });

    return this.getVendorAdminVendor(vendorId);
  }

  async deleteVendorAdminVendor(vendorId: string): Promise<void> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const clientLogoRows = await this.vendorClientsRepository
      .createQueryBuilder('client')
      .select(['client.client_logo_url AS client_logo_url'])
      .where('client.vendor_id = :vendorId', { vendorId: vendor.id })
      .andWhere('client.client_logo_url IS NOT NULL')
      .getRawMany<{ client_logo_url: string | null }>();

    const logoUrls = Array.from(
      new Set(
        [
          this.toNullableString(vendor.logo_url),
          ...clientLogoRows.map((row) => this.toNullableString(row.client_logo_url)),
        ].filter((value): value is string => Boolean(value)),
      ),
    );

    await this.vendorsRepository.remove(vendor);

    await Promise.all(
      logoUrls.map((logoUrl) =>
        this.isSupabasePublicUrl(logoUrl)
          ? this.supabaseService.deleteFileByUrl(logoUrl)
          : Promise.resolve(),
      ),
    );
  }

  async createVendorAdminClient(
    vendorId: string,
    input: UpsertVendorAdminClientDto,
  ): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const clientName = this.requireClientName(input.clientName);
    await this.assertVendorClientNameAvailable(vendor.id, clientName);
    const projectCategoryId = await this.validateOptionalProjectCategoryId(input.projectCategoryId);

    const client = this.vendorClientsRepository.create({
      vendor_id: vendor.id,
      project_category_id: projectCategoryId,
      client_name: clientName,
      client_website_url: this.normalizeOptionalUrl(input.clientWebsiteUrl, 'Client website URL'),
      source_name: this.toNullableTrimmedString(input.sourceName),
      source_url: this.normalizeOptionalUrl(input.sourceUrl, 'Client source URL'),
      display_order: await this.getNextVendorClientDisplayOrder(vendor.id),
    });

    await this.vendorClientsRepository.save(client);
    return this.buildVendorAdminVendorDetail(vendor);
  }

  async updateVendorAdminClient(
    vendorId: string,
    clientId: number,
    input: UpsertVendorAdminClientDto,
  ): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const client = await this.getVendorClientForAdmin(vendor.id, clientId);
    const clientName = this.requireClientName(input.clientName);
    await this.assertVendorClientNameAvailable(vendor.id, clientName, client.id);
    const projectCategoryId = await this.validateOptionalProjectCategoryId(input.projectCategoryId);

    client.client_name = clientName;
    client.project_category_id = projectCategoryId;
    client.client_website_url = this.normalizeOptionalUrl(input.clientWebsiteUrl, 'Client website URL');
    client.source_name = this.toNullableTrimmedString(input.sourceName);
    client.source_url = this.normalizeOptionalUrl(input.sourceUrl, 'Client source URL');

    await this.vendorClientsRepository.save(client);
    return this.buildVendorAdminVendorDetail(vendor);
  }

  async deleteVendorAdminClient(
    vendorId: string,
    clientId: number,
  ): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const client = await this.getVendorClientForAdmin(vendor.id, clientId);
    const previousLogoUrl = this.toNullableString(client.client_logo_url);

    await this.vendorClientsRepository.remove(client);
    await this.deleteManagedLogo(previousLogoUrl);

    return this.buildVendorAdminVendorDetail(vendor);
  }

  async uploadVendorLogo(vendorId: string, file: Express.Multer.File): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const previousLogoUrl = this.toNullableString(vendor.logo_url);
    const objectPath = `logos/vendors/${vendor.id}-${this.toSlug(vendor.brand_name)}${this.resolveFileExtension(file)}`;
    const { fileUrl } = await this.supabaseService.uploadLogoFile(file.buffer, objectPath, file.mimetype);

    vendor.logo_url = fileUrl;
    await this.vendorsRepository.save(vendor);
    await this.deleteManagedLogo(previousLogoUrl, fileUrl);

    return this.buildVendorAdminVendorDetail(vendor);
  }

  async deleteVendorLogo(vendorId: string): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const previousLogoUrl = this.toNullableString(vendor.logo_url);

    vendor.logo_url = null;
    await this.vendorsRepository.save(vendor);
    await this.deleteManagedLogo(previousLogoUrl);

    return this.buildVendorAdminVendorDetail(vendor);
  }

  async uploadVendorClientLogo(
    vendorId: string,
    clientId: number,
    file: Express.Multer.File,
  ): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const client = await this.getVendorClientForAdmin(vendor.id, clientId);
    const previousLogoUrl = this.toNullableString(client.client_logo_url);
    const objectPath = `logos/clients/${vendor.id}/${client.id}-${this.toSlug(client.client_name)}${this.resolveFileExtension(file)}`;
    const { fileUrl } = await this.supabaseService.uploadLogoFile(file.buffer, objectPath, file.mimetype);

    client.client_logo_url = fileUrl;
    await this.vendorClientsRepository.save(client);
    await this.deleteManagedLogo(previousLogoUrl, fileUrl);

    return this.buildVendorAdminVendorDetail(vendor);
  }

  async deleteVendorClientLogo(
    vendorId: string,
    clientId: number,
  ): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const client = await this.getVendorClientForAdmin(vendor.id, clientId);
    const previousLogoUrl = this.toNullableString(client.client_logo_url);

    client.client_logo_url = null;
    await this.vendorClientsRepository.save(client);
    await this.deleteManagedLogo(previousLogoUrl);

    return this.buildVendorAdminVendorDetail(vendor);
  }

  async createVendorAdminCaseStudy(
    vendorId: string,
    input: UpsertVendorAdminCaseStudyDto,
  ): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const title = this.requireCaseStudyTitle(input.title);
    await this.assertVendorCaseStudyTitleAvailable(vendor.id, title);
    const projectCategoryId = await this.validateOptionalProjectCategoryId(input.projectCategoryId);

    const caseStudy = this.vendorCaseStudiesRepository.create({
      vendor_id: vendor.id,
      project_category_id: projectCategoryId,
      title,
      summary: this.requireCaseStudySummary(input.summary),
      study_url: this.normalizeOptionalUrl(input.studyUrl, 'Case study URL'),
      source_name: this.toNullableTrimmedString(input.sourceName),
      source_url: this.normalizeOptionalUrl(input.sourceUrl, 'Case study source URL'),
      display_order: await this.getNextVendorCaseStudyDisplayOrder(vendor.id),
    });

    await this.vendorCaseStudiesRepository.save(caseStudy);
    return this.buildVendorAdminVendorDetail(vendor);
  }

  async updateVendorAdminCaseStudy(
    vendorId: string,
    caseStudyId: number,
    input: UpsertVendorAdminCaseStudyDto,
  ): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const caseStudy = await this.getVendorCaseStudyForAdmin(vendor.id, caseStudyId);
    const title = this.requireCaseStudyTitle(input.title);
    await this.assertVendorCaseStudyTitleAvailable(vendor.id, title, caseStudy.id);
    const projectCategoryId = await this.validateOptionalProjectCategoryId(input.projectCategoryId);

    caseStudy.title = title;
    caseStudy.summary = this.requireCaseStudySummary(input.summary);
    caseStudy.project_category_id = projectCategoryId;
    caseStudy.study_url = this.normalizeOptionalUrl(input.studyUrl, 'Case study URL');
    caseStudy.source_name = this.toNullableTrimmedString(input.sourceName);
    caseStudy.source_url = this.normalizeOptionalUrl(input.sourceUrl, 'Case study source URL');

    await this.vendorCaseStudiesRepository.save(caseStudy);
    return this.buildVendorAdminVendorDetail(vendor);
  }

  async deleteVendorAdminCaseStudy(
    vendorId: string,
    caseStudyId: number,
  ): Promise<VendorAdminVendorDetailDto> {
    const vendor = await this.getVendorByExternalId(vendorId);
    const caseStudy = await this.getVendorCaseStudyForAdmin(vendor.id, caseStudyId);

    await this.vendorCaseStudiesRepository.remove(caseStudy);
    return this.buildVendorAdminVendorDetail(vendor);
  }

  private buildVendorAdminFieldOptions(): VendorAdminFieldOptionsDto {
    return {
      statuses: this.VENDOR_ADMIN_STATUS_OPTIONS,
      legalFocusLevels: this.VENDOR_ADMIN_LEGAL_FOCUS_OPTIONS,
      triStateOptions: this.VENDOR_ADMIN_TRI_STATE_OPTIONS,
    };
  }

  private toProjectCategoryOption(category: ProjectCategory): VendorAdminProjectCategoryOptionDto {
    return {
      id: category.id,
      value: category.value,
      label: category.label,
    };
  }

  private requireBrandName(value: string): string {
    const normalizedBrandName = String(value || '').trim();
    if (!normalizedBrandName) {
      throw new BadRequestException('Brand name is required.');
    }

    return normalizedBrandName;
  }

  private async assertVendorBrandNameAvailable(
    brandName: string,
    excludeVendorId?: number,
  ): Promise<void> {
    const queryBuilder = this.vendorsRepository
      .createQueryBuilder('vendor')
      .select('vendor.id', 'id')
      .where('LOWER(TRIM(vendor.brand_name)) = :brandName', {
        brandName: brandName.toLowerCase(),
      });

    if (excludeVendorId) {
      queryBuilder.andWhere('vendor.id != :excludeVendorId', { excludeVendorId });
    }

    const existingVendor = await queryBuilder.getRawOne<{ id: number }>();
    if (existingVendor) {
      throw new BadRequestException('A vendor with this brand name already exists.');
    }
  }

  private async validateProjectCategoryIds(projectCategoryIds: number[]): Promise<number[]> {
    const normalizedCategoryIds = Array.from(
      new Set(
        (Array.isArray(projectCategoryIds) ? projectCategoryIds : [])
          .map((value) => this.toNumber(value))
          .filter((value) => Number.isInteger(value) && value > 0),
      ),
    );

    if (normalizedCategoryIds.length === 0) {
      throw new BadRequestException('At least one project category is required.');
    }

    const categories = await this.projectCategoriesRepository.findBy({
      id: In(normalizedCategoryIds),
    });

    if (categories.length !== normalizedCategoryIds.length) {
      throw new BadRequestException('One or more project categories are invalid.');
    }

    return normalizedCategoryIds;
  }

  private async validateOptionalProjectCategoryId(
    projectCategoryId: number | null | undefined,
  ): Promise<number | null> {
    const normalizedProjectCategoryId = this.toNullableInteger(projectCategoryId);
    if (!normalizedProjectCategoryId) {
      return null;
    }

    const category = await this.projectCategoriesRepository.findOne({
      where: { id: normalizedProjectCategoryId },
      select: { id: true },
    });

    if (!category) {
      throw new BadRequestException('Project category is invalid.');
    }

    return normalizedProjectCategoryId;
  }

  private requireClientName(value: string): string {
    const normalizedValue = String(value || '').trim();
    if (!normalizedValue) {
      throw new BadRequestException('Client name is required.');
    }

    return normalizedValue;
  }

  private requireCaseStudyTitle(value: string): string {
    const normalizedValue = String(value || '').trim();
    if (!normalizedValue) {
      throw new BadRequestException('Case study title is required.');
    }

    return normalizedValue;
  }

  private requireCaseStudySummary(value: string): string {
    const normalizedValue = String(value || '').trim();
    if (!normalizedValue) {
      throw new BadRequestException('Case study summary is required.');
    }

    return normalizedValue;
  }

  private async assertVendorClientNameAvailable(
    vendorId: number,
    clientName: string,
    excludeClientId?: number,
  ): Promise<void> {
    const queryBuilder = this.vendorClientsRepository
      .createQueryBuilder('client')
      .select('client.id', 'id')
      .where('client.vendor_id = :vendorId', { vendorId })
      .andWhere('LOWER(TRIM(client.client_name)) = :clientName', {
        clientName: clientName.toLowerCase(),
      });

    if (excludeClientId) {
      queryBuilder.andWhere('client.id != :excludeClientId', { excludeClientId });
    }

    const existingClient = await queryBuilder.getRawOne<{ id: number }>();
    if (existingClient) {
      throw new BadRequestException('A client with this name already exists for the vendor.');
    }
  }

  private async assertVendorCaseStudyTitleAvailable(
    vendorId: number,
    title: string,
    excludeCaseStudyId?: number,
  ): Promise<void> {
    const queryBuilder = this.vendorCaseStudiesRepository
      .createQueryBuilder('caseStudy')
      .select('caseStudy.id', 'id')
      .where('caseStudy.vendor_id = :vendorId', { vendorId })
      .andWhere('LOWER(TRIM(caseStudy.title)) = :title', {
        title: title.toLowerCase(),
      });

    if (excludeCaseStudyId) {
      queryBuilder.andWhere('caseStudy.id != :excludeCaseStudyId', { excludeCaseStudyId });
    }

    const existingCaseStudy = await queryBuilder.getRawOne<{ id: number }>();
    if (existingCaseStudy) {
      throw new BadRequestException('A case study with this title already exists for the vendor.');
    }
  }

  private applyVendorAdminInput(
    vendor: Vendor,
    input: UpsertVendorAdminDto,
    brandName: string,
  ): void {
    vendor.brand_name = brandName;
    vendor.website_url = this.normalizeWebsiteUrl(input.websiteUrl);
    vendor.last_verified_date = new Date(input.lastVerifiedDate);
    vendor.status = input.status;
    vendor.vendor_type = this.toNullableTrimmedString(input.vendorType);
    vendor.hq_country = this.toNullableTrimmedString(input.hqCountry) || 'USA';
    vendor.hq_state = this.toNullableTrimmedString(input.hqState);
    vendor.listing_tier = this.toNullableTrimmedString(input.listingTier);
    vendor.listing_description = this.toNullableTrimmedString(input.listingDescription);
    vendor.listing_specialty = this.toNullableTrimmedString(input.listingSpecialty);
    vendor.service_domains = this.toNullableTrimmedString(input.serviceDomains);
    vendor.platforms_experience = this.toNullableTrimmedString(input.platformsExperience);
    vendor.legal_tech_stack = this.toNullableTrimmedString(input.legalTechStack);
    vendor.legal_focus_level = input.legalFocusLevel;
    vendor.reference_available = input.referenceAvailable;
    vendor.legal_references_available = input.legalReferencesAvailable;
    vendor.has_soc2 = input.hasSoc2;
    vendor.has_iso27001 = input.hasIso27001;
    vendor.lead_time_weeks = this.toNullableInteger(input.leadTimeWeeks);
    vendor.min_project_size_usd = this.toNullableCurrency(input.minProjectSizeUsd);
    vendor.max_project_size_usd = this.toNullableCurrency(input.maxProjectSizeUsd);
    vendor.is_microsoft_partner = Boolean(input.isMicrosoftPartner);
    vendor.is_servicenow_partner = Boolean(input.isServicenowPartner);
    vendor.is_workday_partner = Boolean(input.isWorkdayPartner);
    this.applyVendorAdminRatings(vendor, input.ratingSources || []);
  }

  private applyVendorAdminRatings(vendor: Vendor, ratingSources: UpsertVendorAdminDto['ratingSources']): void {
    const normalizedSources = Array.isArray(ratingSources)
      ? ratingSources.slice(0, 2).map((ratingSource) => ({
          sourceName: String(ratingSource?.sourceName || '').trim(),
          rating:
            ratingSource?.rating === null || ratingSource?.rating === undefined
              ? null
              : Number(ratingSource.rating),
          reviewCount: this.toNullableInteger(ratingSource?.reviewCount),
          sourceUrl: this.normalizeOptionalUrl(ratingSource?.sourceUrl, 'Rating source URL'),
        }))
      : [];

    const [primaryRatingSource, secondaryRatingSource] = normalizedSources;

    vendor.rating_source_1 = primaryRatingSource?.sourceName || null;
    vendor.rating_1 =
      primaryRatingSource?.rating !== null &&
      primaryRatingSource?.rating !== undefined &&
      Number.isFinite(primaryRatingSource.rating)
        ? primaryRatingSource.rating
        : null;
    vendor.review_count_1 = primaryRatingSource?.reviewCount ?? 0;
    vendor.rating_url_1 = primaryRatingSource?.sourceUrl || null;

    vendor.rating_source_2 = secondaryRatingSource?.sourceName || null;
    vendor.rating_2 =
      secondaryRatingSource?.rating !== null &&
      secondaryRatingSource?.rating !== undefined &&
      Number.isFinite(secondaryRatingSource.rating)
        ? secondaryRatingSource.rating
        : null;
    vendor.review_count_2 = secondaryRatingSource?.reviewCount ?? 0;
    vendor.rating_url_2 = secondaryRatingSource?.sourceUrl || null;
  }

  private buildVendorAdminRatingSources(vendor: Vendor): VendorAdminVendorRatingDto[] {
    const sources = [
      {
        sourceName: this.toNullableString(vendor.rating_source_1),
        rating: this.toNullablePositiveNumber(vendor.rating_1),
        reviewCount: this.toNullableInteger(vendor.review_count_1),
        sourceUrl: this.toNullableString(vendor.rating_url_1),
      },
      {
        sourceName: this.toNullableString(vendor.rating_source_2),
        rating: this.toNullablePositiveNumber(vendor.rating_2),
        reviewCount: this.toNullableInteger(vendor.review_count_2),
        sourceUrl: this.toNullableString(vendor.rating_url_2),
      },
    ];

    return sources
      .filter((source) => source.sourceName || source.rating || source.sourceUrl || source.reviewCount)
      .map((source) => ({
        sourceName: source.sourceName || '',
        rating: source.rating || 0,
        reviewCount: source.reviewCount,
        sourceUrl: source.sourceUrl,
      }));
  }

  private normalizeWebsiteUrl(value: string): string {
    const trimmedValue = String(value || '').trim();
    if (!trimmedValue) {
      throw new BadRequestException('Website URL is required.');
    }

    const normalizedValue = /^https?:\/\//i.test(trimmedValue)
      ? trimmedValue
      : `https://${trimmedValue}`;

    try {
      const url = new URL(normalizedValue);
      return url.toString();
    } catch {
      throw new BadRequestException('Website URL is invalid.');
    }
  }

  private normalizeOptionalUrl(value: unknown, fieldLabel: string): string | null {
    const trimmedValue = String(value || '').trim();
    if (!trimmedValue) {
      return null;
    }

    const normalizedValue = /^https?:\/\//i.test(trimmedValue)
      ? trimmedValue
      : `https://${trimmedValue}`;

    try {
      const url = new URL(normalizedValue);
      return url.toString();
    } catch {
      throw new BadRequestException(`${fieldLabel} is invalid.`);
    }
  }

  private toNullableTrimmedString(value: unknown): string | null {
    const normalizedValue = String(value || '').trim();
    return normalizedValue ? normalizedValue : null;
  }

  private toNullableInteger(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue)) {
      return null;
    }

    return Math.trunc(parsedValue);
  }

  private toNullableCurrency(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  private toDateOnlyString(value: Date | string | null): string {
    if (!value) {
      return '';
    }

    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }

    return String(value).slice(0, 10);
  }

  private async getVendorProjectCategoryIds(vendorId: number): Promise<number[]> {
    const mappings = await this.vendorProjectCategoriesRepository.find({
      where: { vendor_id: vendorId },
      order: { project_category_id: 'ASC' },
    });

    return mappings.map((mapping) => mapping.project_category_id);
  }

  private async getNextVendorClientDisplayOrder(vendorId: number): Promise<number> {
    const row = await this.vendorClientsRepository
      .createQueryBuilder('client')
      .select('COALESCE(MAX(client.display_order), -1)', 'maxDisplayOrder')
      .where('client.vendor_id = :vendorId', { vendorId })
      .getRawOne<{ maxDisplayOrder: string | number | null }>();

    return this.toNumber(row?.maxDisplayOrder) + 1;
  }

  private async getNextVendorCaseStudyDisplayOrder(vendorId: number): Promise<number> {
    const row = await this.vendorCaseStudiesRepository
      .createQueryBuilder('caseStudy')
      .select('COALESCE(MAX(caseStudy.display_order), -1)', 'maxDisplayOrder')
      .where('caseStudy.vendor_id = :vendorId', { vendorId })
      .getRawOne<{ maxDisplayOrder: string | number | null }>();

    return this.toNumber(row?.maxDisplayOrder) + 1;
  }

  private async buildVendorAdminVendorDetail(vendor: Vendor): Promise<VendorAdminVendorDetailDto> {
    const clientRows = await this.vendorClientsRepository
      .createQueryBuilder('client')
      .select([
        'client.id AS client_id',
        'client.client_name AS client_name',
        'client.client_logo_url AS client_logo_url',
        'client.project_category_id AS client_project_category_id',
        'client.client_website_url AS client_website_url',
        'client.source_name AS client_source_name',
        'client.source_url AS client_source_url',
      ])
      .where('client.vendor_id = :vendorId', { vendorId: vendor.id })
      .orderBy('client.display_order', 'ASC')
      .addOrderBy('client.client_name', 'ASC')
      .getRawMany();

    const caseStudyRows = await this.vendorCaseStudiesRepository
      .createQueryBuilder('caseStudy')
      .select([
        'caseStudy.id AS case_study_id',
        'caseStudy.title AS case_study_title',
        'caseStudy.summary AS case_study_summary',
        'caseStudy.project_category_id AS case_study_project_category_id',
        'caseStudy.study_url AS case_study_study_url',
        'caseStudy.source_name AS case_study_source_name',
        'caseStudy.source_url AS case_study_source_url',
      ])
      .where('caseStudy.vendor_id = :vendorId', { vendorId: vendor.id })
      .orderBy('caseStudy.display_order', 'ASC')
      .addOrderBy('caseStudy.title', 'ASC')
      .getRawMany();

    const projectCategoryIds = await this.getVendorProjectCategoryIds(vendor.id);

    const clients: VendorAdminClientDto[] = clientRows.map((row) => ({
      id: this.toNumber(row.client_id),
      clientName: String(row.client_name || ''),
      logoUrl: this.toNullableString(row.client_logo_url),
      projectCategoryId: this.toNullableInteger(row.client_project_category_id),
      clientWebsiteUrl: this.toNullableString(row.client_website_url),
      sourceName: this.toNullableString(row.client_source_name),
      sourceUrl: this.toNullableString(row.client_source_url),
    }));

    const caseStudies: VendorAdminCaseStudyDto[] = caseStudyRows.map((row) => ({
      id: this.toNumber(row.case_study_id),
      title: String(row.case_study_title || ''),
      summary: String(row.case_study_summary || ''),
      projectCategoryId: this.toNullableInteger(row.case_study_project_category_id),
      studyUrl: this.toNullableString(row.case_study_study_url),
      sourceName: this.toNullableString(row.case_study_source_name),
      sourceUrl: this.toNullableString(row.case_study_source_url),
    }));

    return {
      id: vendor.id,
      vendorId: vendor.vendor_id,
      brandName: vendor.brand_name,
      websiteUrl: vendor.website_url,
      status: vendor.status,
      lastVerifiedDate: this.toDateOnlyString(vendor.last_verified_date),
      vendorType: this.toNullableString(vendor.vendor_type),
      hqCountry: this.toNullableString(vendor.hq_country),
      hqState: this.toNullableString(vendor.hq_state),
      listingTier: this.toNullableString(vendor.listing_tier),
      listingDescription: this.toNullableString(vendor.listing_description),
      listingSpecialty: this.toNullableString(vendor.listing_specialty),
      serviceDomains: this.toNullableString(vendor.service_domains),
      platformsExperience: this.toNullableString(vendor.platforms_experience),
      legalTechStack: this.toNullableString(vendor.legal_tech_stack),
      legalFocusLevel: vendor.legal_focus_level,
      referenceAvailable: vendor.reference_available,
      legalReferencesAvailable: vendor.legal_references_available,
      hasSoc2: vendor.has_soc2,
      hasIso27001: vendor.has_iso27001,
      leadTimeWeeks: this.toNullablePositiveNumber(vendor.lead_time_weeks),
      minProjectSizeUsd: this.toNullablePositiveNumber(vendor.min_project_size_usd),
      maxProjectSizeUsd: this.toNullablePositiveNumber(vendor.max_project_size_usd),
      isMicrosoftPartner: Boolean(vendor.is_microsoft_partner),
      isServicenowPartner: Boolean(vendor.is_servicenow_partner),
      isWorkdayPartner: Boolean(vendor.is_workday_partner),
      ratingSources: this.buildVendorAdminRatingSources(vendor),
      logoUrl: this.toNullableString(vendor.logo_url),
      projectCategoryIds,
      clients,
      caseStudies,
    };
  }

  private async getVendorByExternalId(vendorId: string): Promise<Vendor> {
    const normalizedVendorId = String(vendorId || '').trim();
    if (!normalizedVendorId) {
      throw new BadRequestException('Vendor ID is required.');
    }

    const vendor = await this.vendorsRepository.findOne({
      where: { vendor_id: normalizedVendorId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }

    return vendor;
  }

  private async getVendorClientForAdmin(vendorId: number, clientId: number): Promise<VendorClient> {
    if (!Number.isInteger(clientId) || clientId <= 0) {
      throw new BadRequestException('Client ID is invalid.');
    }

    const client = await this.vendorClientsRepository.findOne({
      where: { id: clientId, vendor_id: vendorId },
    });

    if (!client) {
      throw new NotFoundException('Vendor client not found.');
    }

    return client;
  }

  private async getVendorCaseStudyForAdmin(
    vendorId: number,
    caseStudyId: number,
  ): Promise<VendorCaseStudy> {
    if (!Number.isInteger(caseStudyId) || caseStudyId <= 0) {
      throw new BadRequestException('Case study ID is invalid.');
    }

    const caseStudy = await this.vendorCaseStudiesRepository.findOne({
      where: { id: caseStudyId, vendor_id: vendorId },
    });

    if (!caseStudy) {
      throw new NotFoundException('Vendor case study not found.');
    }

    return caseStudy;
  }

  private async deleteManagedLogo(previousUrl: string | null, replacementUrl?: string): Promise<void> {
    if (!previousUrl || previousUrl === replacementUrl) {
      return;
    }

    if (!this.isSupabasePublicUrl(previousUrl)) {
      return;
    }

    await this.supabaseService.deleteFileByUrl(previousUrl);
  }

  private isSupabasePublicUrl(value: string): boolean {
    return String(value || '').includes('/storage/v1/object/public/');
  }

  private resolveFileExtension(file: Express.Multer.File): string {
    const originalExtension = String(file.originalname || '')
      .trim()
      .toLowerCase()
      .match(/\.[a-z0-9]+$/)?.[0];

    if (originalExtension) {
      return originalExtension;
    }

    const mimeExtensionMap: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
      'image/x-icon': '.ico',
      'image/vnd.microsoft.icon': '.ico',
    };

    return mimeExtensionMap[file.mimetype] || '.png';
  }

  private toSlug(value: string): string {
    return this.normalizeForDedup(value)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private normalizeForDedup(value: string): string {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9+\s.-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
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

  private toNullableString(value: unknown): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const normalizedValue = String(value).trim();
    return normalizedValue ? normalizedValue : null;
  }
}
