import { VendorResponseDto } from '../../vendors/dto/vendor-response.dto';

export type ProjectRecommendationsStatus = 'pending' | 'ready';

export class CreateProjectResponseDto {
  project: {
    id: number;
    project_title: string;
    system_name: string;
    status: string;
    created_at: Date;
  };
  matchedVendors: VendorResponseDto[];
  recommendations: {
    status: ProjectRecommendationsStatus;
    projectId: number;
    computedAt: string | null;
  };
}
