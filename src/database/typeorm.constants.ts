import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { ClientIndustry } from '../projects/entities/client-industry.entity';
import { ProjectCategory } from '../projects/entities/project-category.entity';
import { ProjectFile } from '../files/entities/project-file.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { ProjectVendorMatch } from '../projects/entities/project-vendor-match.entity';
import { ProjectVendorReason } from '../projects/entities/project-vendor-reason.entity';
import { SchemaBootstrapGuard20260218000000 } from './migrations/20260218000000-schema-bootstrap-guard';
import { VendorListingColumns20260219000000 } from './migrations/20260219000000-vendor-listing-columns';
import { ProjectRecommendations20260224000000 } from './migrations/20260224000000-project-recommendations';
import { ProjectVendorReasons20260226000000 } from './migrations/20260226000000-project-vendor-reasons';
import { RecommendationSchemaHardening20260226120000 } from './migrations/20260226120000-recommendation-schema-hardening';

export const TYPEORM_ENTITIES = [
  User,
  Project,
  ClientIndustry,
  ProjectCategory,
  ProjectFile,
  ProjectVendorMatch,
  ProjectVendorReason,
  Vendor,
];

export const TYPEORM_MIGRATIONS = [
  SchemaBootstrapGuard20260218000000,
  VendorListingColumns20260219000000,
  ProjectRecommendations20260224000000,
  ProjectVendorReasons20260226000000,
  RecommendationSchemaHardening20260226120000,
];

export const TYPEORM_MIGRATIONS_TABLE_NAME = 'typeorm_migrations';
