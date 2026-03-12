import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { ClientIndustry } from '../projects/entities/client-industry.entity';
import { ProjectCategory } from '../projects/entities/project-category.entity';
import { ProjectFile } from '../files/entities/project-file.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorClient } from '../vendors/entities/vendor-client.entity';
import { VendorCaseStudy } from '../vendors/entities/vendor-case-study.entity';
import { VendorReview } from '../vendors/entities/vendor-review.entity';
import { ProjectVendorMatch } from '../projects/entities/project-vendor-match.entity';
import { ProjectVendorReason } from '../projects/entities/project-vendor-reason.entity';
import { VendorProjectCategory } from '../projects/entities/vendor-project-category.entity';
import { SchemaBootstrapGuard20260218000000 } from './migrations/20260218000000-schema-bootstrap-guard';
import { VendorListingColumns20260219000000 } from './migrations/20260219000000-vendor-listing-columns';
import { ProjectRecommendations20260224000000 } from './migrations/20260224000000-project-recommendations';
import { ProjectVendorReasons20260226000000 } from './migrations/20260226000000-project-vendor-reasons';
import { RecommendationSchemaHardening20260226120000 } from './migrations/20260226120000-recommendation-schema-hardening';
import { VendorLegalTechStackSystemSupported20260227190000 } from './migrations/20260227190000-vendor-legal-tech-stack-system-supported';
import { VendorProjectCategoriesReference20260227221000 } from './migrations/20260227221000-vendor-project-categories-reference';
import { VendorSystemsAndProjectCategoriesSync20260303010000 } from './migrations/20260303010000-vendor-systems-and-project-categories-sync';
import { VendorScreenshotSeedAndCategoryLinks20260303023000 } from './migrations/20260303023000-vendor-screenshot-seed-and-category-links';
import { VendorProfileSourceRefresh20260303050000 } from './migrations/20260303050000-vendor-profile-source-refresh';
import { VendorDetailContent20260304000000 } from './migrations/20260304000000-vendor-detail-content';
import { VendorAdditionalContentImport20260305010000 } from './migrations/20260305010000-vendor-additional-content-import';
import { VendorAdditionalContentImport20260305020000 } from './migrations/20260305020000-vendor-additional-content-import-v2';
import { VendorAdditionalContentImport20260305030000 } from './migrations/20260305030000-vendor-additional-content-import-v3';
import { VendorAdditionalContentImport20260305040000 } from './migrations/20260305040000-vendor-additional-content-import-v4';
import { FixBrokenCaseStudyUrls20260306010000 } from './migrations/20260306010000-fix-broken-case-study-urls';
import { CleanBrokenCaseStudiesAndClientLogos20260306020000 } from './migrations/20260306020000-clean-broken-case-studies-and-client-logos';
import { RemoveUnresolvedCaseStudies20260306030000 } from './migrations/20260306030000-remove-unresolved-case-studies';
import { FillRemainingClientLogos20260306040000 } from './migrations/20260306040000-fill-remaining-client-logos';
import { AddMoreClientWebsitesAndLogos20260306050000 } from './migrations/20260306050000-add-more-client-websites-and-logos';
import { CompleteMoreClientLogos20260306060000 } from './migrations/20260306060000-complete-more-client-logos';
import { FillFinalClientLogo20260306070000 } from './migrations/20260306070000-fill-final-client-logo';
import { VendorClientExpansion20260311143000 } from './migrations/20260311143000-vendor-client-expansion';
import { VendorClientTopUpToSeven20260311195000 } from './migrations/20260311195000-vendor-client-top-up-to-seven';

export const TYPEORM_ENTITIES = [
  User,
  Project,
  ClientIndustry,
  ProjectCategory,
  ProjectFile,
  ProjectVendorMatch,
  ProjectVendorReason,
  VendorProjectCategory,
  Vendor,
  VendorClient,
  VendorCaseStudy,
  VendorReview,
];

export const TYPEORM_MIGRATIONS = [
  SchemaBootstrapGuard20260218000000,
  VendorListingColumns20260219000000,
  ProjectRecommendations20260224000000,
  ProjectVendorReasons20260226000000,
  RecommendationSchemaHardening20260226120000,
  VendorLegalTechStackSystemSupported20260227190000,
  VendorProjectCategoriesReference20260227221000,
  VendorSystemsAndProjectCategoriesSync20260303010000,
  VendorScreenshotSeedAndCategoryLinks20260303023000,
  VendorProfileSourceRefresh20260303050000,
  VendorDetailContent20260304000000,
  VendorAdditionalContentImport20260305010000,
  VendorAdditionalContentImport20260305020000,
  VendorAdditionalContentImport20260305030000,
  VendorAdditionalContentImport20260305040000,
  FixBrokenCaseStudyUrls20260306010000,
  CleanBrokenCaseStudiesAndClientLogos20260306020000,
  RemoveUnresolvedCaseStudies20260306030000,
  FillRemainingClientLogos20260306040000,
  AddMoreClientWebsitesAndLogos20260306050000,
  CompleteMoreClientLogos20260306060000,
  FillFinalClientLogo20260306070000,
  VendorClientExpansion20260311143000,
  VendorClientTopUpToSeven20260311195000,
];

export const TYPEORM_MIGRATIONS_TABLE_NAME = 'typeorm_migrations';
