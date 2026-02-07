import { VendorResponseDto } from '../../vendors/dto/vendor-response.dto';

export class CreateProjectResponseDto {
  project: {
    id: number;
    project_title: string;
    system_name: string;
    status: string;
    created_at: Date;
  };
  matchedVendors: VendorResponseDto[];
}
