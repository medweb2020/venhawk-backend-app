import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VendorListingResponseDto } from './dto/vendor-listing-response.dto';
import { VendorsService } from './vendors.service';

@Controller('api/vendors')
@UseGuards(JwtAuthGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get('listing')
  async getListingVendors(): Promise<VendorListingResponseDto[]> {
    return this.vendorsService.getListingVendors();
  }
}
