import {
  ArrayNotEmpty,
  ArrayMaxSize,
  ArrayUnique,
  IsDateString,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VendorAdminOptionDto {
  value: string;
  label: string;
}

export class VendorAdminProjectCategoryOptionDto {
  id: number;
  value: string;
  label: string;
}

export class VendorAdminFieldOptionsDto {
  statuses: VendorAdminOptionDto[];
  legalFocusLevels: VendorAdminOptionDto[];
  triStateOptions: VendorAdminOptionDto[];
}

export class VendorAdminVendorListItemDto {
  id: number;
  vendorId: string;
  brandName: string;
  logoUrl: string | null;
  websiteUrl: string;
  status: string;
  projectCategories: VendorAdminProjectCategoryOptionDto[];
}

export class VendorAdminClientDto {
  id: number;
  clientName: string;
  logoUrl: string | null;
  projectCategoryId: number | null;
  clientWebsiteUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
}

export class VendorAdminCaseStudyDto {
  id: number;
  title: string;
  summary: string;
  projectCategoryId: number | null;
  studyUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
}

export class VendorAdminVendorRatingDto {
  sourceName: string;
  rating: number;
  reviewCount: number | null;
  sourceUrl: string | null;
}

export class VendorAdminVendorDetailDto {
  id: number;
  vendorId: string;
  brandName: string;
  websiteUrl: string;
  status: string;
  lastVerifiedDate: string;
  vendorType: string | null;
  hqCountry: string | null;
  hqState: string | null;
  listingTier: string | null;
  listingDescription: string | null;
  listingSpecialty: string | null;
  serviceDomains: string | null;
  platformsExperience: string | null;
  legalTechStack: string | null;
  legalFocusLevel: string;
  referenceAvailable: string;
  legalReferencesAvailable: string;
  hasSoc2: string;
  hasIso27001: string;
  leadTimeWeeks: number | null;
  minProjectSizeUsd: number | null;
  maxProjectSizeUsd: number | null;
  isMicrosoftPartner: boolean;
  isServicenowPartner: boolean;
  isWorkdayPartner: boolean;
  ratingSources: VendorAdminVendorRatingDto[];
  logoUrl: string | null;
  projectCategoryIds: number[];
  clients: VendorAdminClientDto[];
  caseStudies: VendorAdminCaseStudyDto[];
}

export class VendorAdminOverviewResponseDto {
  vendors: VendorAdminVendorListItemDto[];
  projectCategories: VendorAdminProjectCategoryOptionDto[];
  fieldOptions: VendorAdminFieldOptionsDto;
}

export class UpsertVendorAdminDto {
  @IsString()
  @MaxLength(255)
  brandName: string;

  @IsString()
  @MaxLength(500)
  websiteUrl: string;

  @IsDateString()
  lastVerifiedDate: string;

  @IsIn(['Prospect', 'Validated', 'Active', 'Inactive', 'Do-not-use'])
  status: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  projectCategoryIds: number[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  vendorType?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  hqCountry?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  hqState?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  listingTier?: string | null;

  @IsOptional()
  @IsString()
  listingDescription?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  listingSpecialty?: string | null;

  @IsOptional()
  @IsString()
  serviceDomains?: string | null;

  @IsOptional()
  @IsString()
  platformsExperience?: string | null;

  @IsOptional()
  @IsString()
  legalTechStack?: string | null;

  @IsIn(['None', 'Some', 'Strong', 'Legal-only'])
  legalFocusLevel: string;

  @IsIn(['Y', 'N', 'Unk'])
  referenceAvailable: string;

  @IsIn(['Y', 'N', 'Unk'])
  legalReferencesAvailable: string;

  @IsIn(['Y', 'N', 'Unk'])
  hasSoc2: string;

  @IsIn(['Y', 'N', 'Unk'])
  hasIso27001: string;

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @Type(() => Number)
  @IsInt()
  leadTimeWeeks?: number | null;

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @Type(() => Number)
  @IsInt()
  minProjectSizeUsd?: number | null;

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @Type(() => Number)
  @IsInt()
  maxProjectSizeUsd?: number | null;

  @IsBoolean()
  isMicrosoftPartner: boolean;

  @IsBoolean()
  isServicenowPartner: boolean;

  @IsBoolean()
  isWorkdayPartner: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => UpsertVendorAdminRatingDto)
  ratingSources?: UpsertVendorAdminRatingDto[];
}

export class UpsertVendorAdminRatingDto {
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  sourceName: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.1)
  @Max(5)
  rating: number;

  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined && value !== '')
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reviewCount?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  sourceUrl?: string | null;
}

export class UpsertVendorAdminClientDto {
  @IsString()
  @MaxLength(160)
  @MinLength(1)
  clientName: string;

  @ValidateIf((_, value) => value !== null && value !== undefined && value !== '')
  @Type(() => Number)
  @IsInt()
  projectCategoryId?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(700)
  clientWebsiteUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sourceName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(700)
  sourceUrl?: string | null;
}

export class UpsertVendorAdminCaseStudyDto {
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  summary: string;

  @ValidateIf((_, value) => value !== null && value !== undefined && value !== '')
  @Type(() => Number)
  @IsInt()
  projectCategoryId?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(700)
  studyUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sourceName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(700)
  sourceUrl?: string | null;
}
