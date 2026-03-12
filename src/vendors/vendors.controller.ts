import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VendorListingResponseDto } from './dto/vendor-listing-response.dto';
import { VendorListingFiltersDto } from './dto/vendor-listing-filters.dto';
import { VendorListingFilterOptionsResponseDto } from './dto/vendor-listing-filter-options-response.dto';
import { VendorsService } from './vendors.service';
import { UsersService } from '../users/users.service';
import { VendorDetailResponseDto } from './dto/vendor-detail-response.dto';
import {
  VendorLogoAdminOverviewResponseDto,
  VendorLogoAdminVendorDetailDto,
} from './dto/vendor-logo-admin-response.dto';
import { VendorLogoAdminGuard } from './guards/vendor-logo-admin.guard';

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

  @Get('logo-admin')
  @UseGuards(VendorLogoAdminGuard)
  async getLogoAdminOverview(): Promise<VendorLogoAdminOverviewResponseDto> {
    return this.vendorsService.getLogoAdminOverview();
  }

  @Get('logo-admin/vendors/:vendorId')
  @UseGuards(VendorLogoAdminGuard)
  async getLogoAdminVendor(
    @Param('vendorId') vendorId: string,
  ): Promise<VendorLogoAdminVendorDetailDto> {
    return this.vendorsService.getLogoAdminVendor(vendorId);
  }

  @Post('logo-admin/vendors/:vendorId/logo')
  @UseGuards(VendorLogoAdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadVendorLogo(
    @Param('vendorId') vendorId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<VendorLogoAdminVendorDetailDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.vendorsService.uploadVendorLogo(vendorId, file);
  }

  @Delete('logo-admin/vendors/:vendorId/logo')
  @UseGuards(VendorLogoAdminGuard)
  @HttpCode(HttpStatus.OK)
  async deleteVendorLogo(
    @Param('vendorId') vendorId: string,
  ): Promise<VendorLogoAdminVendorDetailDto> {
    return this.vendorsService.deleteVendorLogo(vendorId);
  }

  @Post('logo-admin/vendors/:vendorId/clients/:clientId/logo')
  @UseGuards(VendorLogoAdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadVendorClientLogo(
    @Param('vendorId') vendorId: string,
    @Param('clientId') clientId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<VendorLogoAdminVendorDetailDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.vendorsService.uploadVendorClientLogo(
      vendorId,
      Number(clientId),
      file,
    );
  }

  @Delete('logo-admin/vendors/:vendorId/clients/:clientId/logo')
  @UseGuards(VendorLogoAdminGuard)
  @HttpCode(HttpStatus.OK)
  async deleteVendorClientLogo(
    @Param('vendorId') vendorId: string,
    @Param('clientId') clientId: string,
  ): Promise<VendorLogoAdminVendorDetailDto> {
    return this.vendorsService.deleteVendorClientLogo(
      vendorId,
      Number(clientId),
    );
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
