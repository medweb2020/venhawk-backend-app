import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { ProjectCategory } from '../projects/entities/project-category.entity';
import { ProjectVendorMatch } from '../projects/entities/project-vendor-match.entity';
import { ProjectVendorReason } from '../projects/entities/project-vendor-reason.entity';
import { VendorProjectCategory } from '../projects/entities/vendor-project-category.entity';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module';
import { VendorAdminController } from './vendor-admin.controller';
import { VendorAdminService } from './vendor-admin.service';
import { VendorLogoAdminGuard } from './guards/vendor-logo-admin.guard';
import { VendorCaseStudy } from './entities/vendor-case-study.entity';
import { VendorClient } from './entities/vendor-client.entity';
import { VendorReview } from './entities/vendor-review.entity';
import { Vendor } from './entities/vendor.entity';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

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
      ProjectCategory,
      VendorProjectCategory,
    ]),
  ],
  controllers: [VendorsController, VendorAdminController],
  providers: [VendorsService, VendorAdminService, VendorLogoAdminGuard],
  exports: [VendorsService],
})
export class VendorsModule {}
