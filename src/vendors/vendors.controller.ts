import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VendorListingResponseDto } from './dto/vendor-listing-response.dto';
import { VendorListingFiltersDto } from './dto/vendor-listing-filters.dto';
import { VendorListingFilterOptionsResponseDto } from './dto/vendor-listing-filter-options-response.dto';
import { VendorsService } from './vendors.service';

@Controller('api/vendors')
@UseGuards(JwtAuthGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get('listing')
  async getListingVendors(
    @Query() filters: VendorListingFiltersDto,
  ): Promise<VendorListingResponseDto[]> {
    return this.vendorsService.getListingVendors(filters);
  }

  @Get('listing/filters')
  async getListingFilterOptions(): Promise<VendorListingFilterOptionsResponseDto> {
    return this.vendorsService.getListingFilterOptions();
  }

  @Get('listing/:vendorId')
  async getListingVendorById(
    @Param('vendorId') vendorId: string,
  ): Promise<VendorListingResponseDto> {
    return this.vendorsService.getListingVendorById(vendorId);
  }
}
