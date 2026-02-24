import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { ClientIndustry } from './entities/client-industry.entity';
import { ProjectCategory } from './entities/project-category.entity';
import { ProjectFile } from '../files/entities/project-file.entity';
import { UsersModule } from '../users/users.module';
import { VendorsModule } from '../vendors/vendors.module';
import { Vendor } from '../vendors/entities/vendor.entity';
import { ProjectVendorMatch } from './entities/project-vendor-match.entity';
import { ProjectRecommendationsService } from './services/project-recommendations.service';
import { ProjectRecommendationReasoningService } from './services/project-recommendation-reasoning.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ClientIndustry,
      ProjectCategory,
      ProjectFile,
      Vendor,
      ProjectVendorMatch,
    ]),
    UsersModule,
    VendorsModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectRecommendationsService,
    ProjectRecommendationReasoningService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
