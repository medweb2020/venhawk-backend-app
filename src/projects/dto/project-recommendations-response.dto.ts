import { VendorResponseDto } from '../../vendors/dto/vendor-response.dto';

export class ProjectRecommendationsResponseDto {
  projectId: number;
  scoringVersion: string;
  computedAt: Date;
  totalRecommended: number;
  recommendedVendors: VendorResponseDto[];
}
