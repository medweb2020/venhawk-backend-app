export const ELIGIBILITY_POLICY = {
  strictSystemGate: true,
  productFamilyExpansion: false,
  projectSystemMatchMode: 'db-join-system-id-strict',
  vendorSystemField: 'vendor_systems.system_id',
} as const;

export interface SystemCandidateDto {
  id: number;
  canonicalName: string;
  productFamily: string;
  category: string;
  confidence: number;
}

export interface ResolveSystemResponseDto {
  input: string;
  resolved: boolean;
  tier: 1 | 2 | 3 | 4 | 5;
  confidence: number | null;
  system: SystemCandidateDto | null;
  candidates: SystemCandidateDto[];
  cached?: boolean;
  eligibilityPolicy: typeof ELIGIBILITY_POLICY;
}

export interface SystemListItemDto {
  id: number;
  canonicalName: string;
  productFamily: string;
  vendorOwner: string | null;
  category: string;
  aliases: string[];
  isActive: boolean;
}

export interface SystemSearchResultDto {
  id: number;
  canonicalName: string;
  productFamily: string;
  category: string;
  confidence: number;
}
