import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { VendorsController } from './vendors.controller';
import { VendorClient } from './entities/vendor-client.entity';
import { VendorCaseStudy } from './entities/vendor-case-study.entity';
import { VendorReview } from './entities/vendor-review.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectVendorMatch } from '../projects/entities/project-vendor-match.entity';
import { ProjectVendorReason } from '../projects/entities/project-vendor-reason.entity';
import { UsersModule } from '../users/users.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { VendorLogoAdminGuard } from './guards/vendor-logo-admin.guard';

@Module({
  imports: [
    UsersModule,
    SupabaseModule,
    TypeOrmModule.forFeature([
      Vendor,
      VendorClient,
      VendorCaseStudy,
      VendorReview,
      Project,
      ProjectVendorMatch,
      ProjectVendorReason,
    ]),
  ],
  controllers: [VendorsController],
  providers: [VendorsService, VendorLogoAdminGuard],
  exports: [VendorsService],
})
export class VendorsModule {}
