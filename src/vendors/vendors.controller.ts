import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

  @Get('listing/:vendorId')
  async getListingVendorById(
    @Param('vendorId') vendorId: string,
  ): Promise<VendorListingResponseDto> {
    return this.vendorsService.getListingVendorById(vendorId);
  }
}
