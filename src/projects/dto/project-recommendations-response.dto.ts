import { VendorResponseDto } from '../../vendors/dto/vendor-response.dto';

export class ProjectRecommendationsResponseDto {
  projectId: number;
  computedAt: Date;
  totalRecommended: number;
  recommendedVendors: VendorResponseDto[];
}
