import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  UpsertVendorAdminCaseStudyDto,
  UpsertVendorAdminClientDto,
  UpsertVendorAdminDto,
  VendorAdminOverviewResponseDto,
  VendorAdminVendorDetailDto,
} from './dto/vendor-admin.dto';
import { VendorLogoAdminGuard } from './guards/vendor-logo-admin.guard';
import { VendorAdminService } from './vendor-admin.service';

@Controller('api/vendors/admin')
@UseGuards(JwtAuthGuard, VendorLogoAdminGuard)
export class VendorAdminController {
  constructor(private readonly vendorAdminService: VendorAdminService) {}

  @Get()
  async getVendorAdminOverview(): Promise<VendorAdminOverviewResponseDto> {
    return this.vendorAdminService.getVendorAdminOverview();
  }

  @Get('vendors/:vendorId')
  async getVendorAdminVendor(
    @Param('vendorId') vendorId: string,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.getVendorAdminVendor(vendorId);
  }

  @Post('vendors')
  async createVendor(
    @Body() input: UpsertVendorAdminDto,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.createVendorAdminVendor(input);
  }

  @Patch('vendors/:vendorId')
  async updateVendor(
    @Param('vendorId') vendorId: string,
    @Body() input: UpsertVendorAdminDto,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.updateVendorAdminVendor(vendorId, input);
  }

  @Delete('vendors/:vendorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVendor(@Param('vendorId') vendorId: string): Promise<void> {
    await this.vendorAdminService.deleteVendorAdminVendor(vendorId);
  }

  @Post('vendors/:vendorId/clients')
  async createVendorClient(
    @Param('vendorId') vendorId: string,
    @Body() input: UpsertVendorAdminClientDto,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.createVendorAdminClient(vendorId, input);
  }

  @Patch('vendors/:vendorId/clients/:clientId')
  async updateVendorClient(
    @Param('vendorId') vendorId: string,
    @Param('clientId') clientId: string,
    @Body() input: UpsertVendorAdminClientDto,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.updateVendorAdminClient(vendorId, Number(clientId), input);
  }

  @Delete('vendors/:vendorId/clients/:clientId')
  @HttpCode(HttpStatus.OK)
  async deleteVendorClient(
    @Param('vendorId') vendorId: string,
    @Param('clientId') clientId: string,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.deleteVendorAdminClient(vendorId, Number(clientId));
  }

  @Post('vendors/:vendorId/logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVendorLogo(
    @Param('vendorId') vendorId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<VendorAdminVendorDetailDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.vendorAdminService.uploadVendorLogo(vendorId, file);
  }

  @Delete('vendors/:vendorId/logo')
  @HttpCode(HttpStatus.OK)
  async deleteVendorLogo(
    @Param('vendorId') vendorId: string,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.deleteVendorLogo(vendorId);
  }

  @Post('vendors/:vendorId/clients/:clientId/logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVendorClientLogo(
    @Param('vendorId') vendorId: string,
    @Param('clientId') clientId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<VendorAdminVendorDetailDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.vendorAdminService.uploadVendorClientLogo(vendorId, Number(clientId), file);
  }

  @Delete('vendors/:vendorId/clients/:clientId/logo')
  @HttpCode(HttpStatus.OK)
  async deleteVendorClientLogo(
    @Param('vendorId') vendorId: string,
    @Param('clientId') clientId: string,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.deleteVendorClientLogo(vendorId, Number(clientId));
  }

  @Post('vendors/:vendorId/case-studies')
  async createVendorCaseStudy(
    @Param('vendorId') vendorId: string,
    @Body() input: UpsertVendorAdminCaseStudyDto,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.createVendorAdminCaseStudy(vendorId, input);
  }

  @Patch('vendors/:vendorId/case-studies/:caseStudyId')
  async updateVendorCaseStudy(
    @Param('vendorId') vendorId: string,
    @Param('caseStudyId') caseStudyId: string,
    @Body() input: UpsertVendorAdminCaseStudyDto,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.updateVendorAdminCaseStudy(
      vendorId,
      Number(caseStudyId),
      input,
    );
  }

  @Delete('vendors/:vendorId/case-studies/:caseStudyId')
  @HttpCode(HttpStatus.OK)
  async deleteVendorCaseStudy(
    @Param('vendorId') vendorId: string,
    @Param('caseStudyId') caseStudyId: string,
  ): Promise<VendorAdminVendorDetailDto> {
    return this.vendorAdminService.deleteVendorAdminCaseStudy(vendorId, Number(caseStudyId));
  }
}
