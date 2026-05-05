import { VendorResponseDto } from '../../vendors/dto/vendor-response.dto';

export interface ResolverCandidateDto {
  id: number;
  canonicalName: string;
  confidence: number;
}

export class ProjectRecommendationsResponseDto {
  projectId: number;
  scoringVersion: string;
  computedAt: Date;
  totalRecommended: number;
  /** True when vendors[] is empty because no eligible vendor supports the resolved system. */
  noEligibleVendors: boolean;
  /**
   * 'resolved'      — system name matched a canonical system; vendor list comes from vendor_systems JOIN.
   * 'unresolved'    — system name provided but resolver returned Tier 5; vendor list is empty.
   * 'not_attempted' — no system name submitted; vendor list comes from category fallback.
   */
  resolverStatus: 'resolved' | 'unresolved' | 'not_attempted';
  /** Top-3 resolver candidates when resolverStatus = 'unresolved'. Absent otherwise. */
  resolverCandidates?: ResolverCandidateDto[];
  /** Echo of the system name the user submitted. Absent when no system was submitted. */
  submittedSystemName?: string;
  /** @deprecated Use resolverStatus instead. */
  noExactMatch?: boolean;
  recommendedVendors: VendorResponseDto[];
}
