import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { VendorDetailResponseDto } from './dto/vendor-detail-response.dto';
import { VendorListingFilterOptionsResponseDto } from './dto/vendor-listing-filter-options-response.dto';
import { VendorListingFiltersDto } from './dto/vendor-listing-filters.dto';
import { VendorListingResponseDto } from './dto/vendor-listing-response.dto';
import { VendorsService } from './vendors.service';

@Controller('api/vendors')
@UseGuards(JwtAuthGuard)
export class VendorsController {
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly usersService: UsersService,
  ) {}

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

  @Get(':vendorId/detail')
  async getVendorDetailById(
    @Param('vendorId') vendorId: string,
    @Query('projectId') projectId: string | undefined,
    @Request() req: { user: { userId: string } },
  ): Promise<VendorDetailResponseDto> {
    const auth0UserId = String(req?.user?.userId || '').trim();
    const user = await this.usersService.findByAuth0Id(auth0UserId);
    if (!user) {
      throw new NotFoundException(
        `User with Auth0 ID '${auth0UserId}' not found. Please sync user first.`,
      );
    }

    return this.vendorsService.getVendorDetailById(vendorId, {
      projectId: projectId ? Number(projectId) : null,
      userId: user.id,
    });
  }
}
