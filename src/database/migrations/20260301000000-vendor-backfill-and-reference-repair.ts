import { MigrationInterface, QueryRunner } from 'typeorm';

type VendorBackfill = {
  vendorId: string;
  brandName: string;
  legalName: string;
  websiteUrl: string;
  vendorType: string;
  serviceDomains: string;
  legalTechStack: string;
};

type VendorSystemUpdate = {
  brandName: string;
  legalTechStack: string;
};

type VendorCategoryReference = {
  vendorBrandName: string;
  projectCategoryValue: string;
};

const BACKFILL_VENDORS: VendorBackfill[] = [
  {
    vendorId: '71dedf5a-83c1-4687-a5df-a21dc4bcef50',
    brandName: 'Cornerstone.IT',
    legalName: 'Cornerstone.IT',
    websiteUrl: 'https://www.cornerstone.it',
    vendorType: 'Boutique',
    serviceDomains: 'Cloud, Collaboration, Identity, Security',
    legalTechStack:
      'iManage, NetDocuments, Citrix, Azure, Microsoft 365, Exchange Online, Teams, Mimecast, Cisco',
  },
  {
    vendorId: 'e216bff6-709f-48d5-b1ca-74bfe326ce8d',
    brandName: 'Stone Consulting',
    legalName: 'Stone Consulting Team',
    websiteUrl: 'https://stoneconsultingteam.com',
    vendorType: 'Boutique',
    serviceDomains: 'Collaboration, Enterprise Apps',
    legalTechStack: 'iManage',
  },
  {
    vendorId: '5c21b182-36e9-43ee-919f-9d9fa6ca7bd0',
    brandName: 'Cloudficient',
    legalName: 'Cloudficient Solutions Inc.',
    websiteUrl: 'https://www.cloudficient.com',
    vendorType: 'Enterprise Apps',
    serviceDomains: 'Cloud, Compliance, eDiscovery',
    legalTechStack: 'Microsoft 365, Exchange Online, PST',
  },
  {
    vendorId: '7274ab19-b067-4558-a15f-ba24276f8ae9',
    brandName: 'Adastra',
    legalName: 'Adastra Corporation',
    websiteUrl: 'https://adastracorp.com',
    vendorType: 'SI',
    serviceDomains: 'Cloud, Data & Analytics, Enterprise Apps',
    legalTechStack:
      'AWS, Azure, Power BI, Databricks, Snowflake, M365, Dynamics 365',
  },
  {
    vendorId: 'd673152b-706b-49a9-bc9b-b1dcf7374852',
    brandName: 'CloudForce',
    legalName: 'Cloudforce',
    websiteUrl: 'https://gocloudforce.com',
    vendorType: 'Cloud',
    serviceDomains: 'Cloud, Collaboration, Identity, Security',
    legalTechStack:
      'Azure, Power BI, M365, Dynamics 365, NetScaler, Active Directory',
  },
];

const VENDOR_SYSTEM_UPDATES: VendorSystemUpdate[] = [
  {
    brandName: 'Thomson Reuters',
    legalTechStack: 'HighQ',
  },
  {
    brandName: 'TitanFile',
    legalTechStack: 'TitanFile',
  },
  {
    brandName: 'LexisNexis',
    legalTechStack: 'Interaction, CounselLink, Lexis Connect',
  },
  {
    brandName: 'Inoutsource',
    legalTechStack: 'Intapp, NetDocuments, iCompli, Nectar, FileTrail',
  },
  {
    brandName: 'eSentio Technologies',
    legalTechStack: 'Intapp, NetDocuments, iManage, Litera',
  },
  {
    brandName: 'RBRO',
    legalTechStack: 'iManage',
  },
  {
    brandName: 'Cornerstone.IT',
    legalTechStack:
      'iManage, NetDocuments, Citrix, Azure, Microsoft 365, Exchange Online, Teams, Mimecast, Cisco',
  },
  {
    brandName: 'Stone Consulting',
    legalTechStack: 'iManage',
  },
  {
    brandName: 'Kraft Kennedy',
    legalTechStack:
      'iManage, NetDocuments, Doc Auto, OpenText, VerQu, Prosperoware, Worldox, Citrix, Azure, Microsoft 365, Exchange Online, Teams, Mimecast',
  },
  {
    brandName: 'Element Technologies',
    legalTechStack: 'AWS, Azure, Salesforce, SAP, Databricks, Snowflake, M365',
  },
  {
    brandName: 'Helient Systems',
    legalTechStack: 'iManage, Microsoft Cloud',
  },
  {
    brandName: 'Cloudficient',
    legalTechStack: 'Microsoft 365, Exchange Online, PST',
  },
  {
    brandName: 'Adastra',
    legalTechStack:
      'AWS, Azure, Power BI, Databricks, Snowflake, M365, Dynamics 365',
  },
  {
    brandName: 'CloudForce',
    legalTechStack:
      'Azure, Power BI, M365, Dynamics 365, NetScaler, Active Directory',
  },
  {
    brandName: 'CDW',
    legalTechStack:
      'ServiceNow, Salesforce, SAP, Oracle, Microsoft Dynamics',
  },
  {
    brandName: 'Cognizant',
    legalTechStack: 'ServiceNow, Workday',
  },
];

const VENDOR_CATEGORY_REFERENCES: VendorCategoryReference[] = [
  {
    vendorBrandName: 'Thomson Reuters',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'TitanFile',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'LexisNexis',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Inoutsource',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'eSentio Technologies',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'RBRO',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Stone Consulting',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Element Technologies',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Helient Systems',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Cloudficient',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Adastra',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'CloudForce',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'CDW',
    projectCategoryValue: 'enterprise-it',
  },
  {
    vendorBrandName: 'Cognizant',
    projectCategoryValue: 'enterprise-it',
  },
  {
    vendorBrandName: 'AAC Consulting',
    projectCategoryValue: 'app-bug-fixes',
  },
];

export class VendorBackfillAndReferenceRepair20260301000000
  implements MigrationInterface
{
  name = 'VendorBackfillAndReferenceRepair20260301000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasVendorsTable = await queryRunner.hasTable('vendors');
    if (!hasVendorsTable) {
      return;
    }

    for (const vendor of BACKFILL_VENDORS) {
      await queryRunner.query(
        `
          INSERT INTO vendors (
            vendor_id,
            brand_name,
            legal_name,
            website_url,
            vendor_type,
            service_domains,
            legal_tech_stack,
            data_owner,
            data_source_notes,
            last_verified_date,
            status,
            internal_notes,
            created_at,
            updated_at
          )
          SELECT
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            'Migration Backfill',
            'Inserted by VendorBackfillAndReferenceRepair20260301000000',
            CURRENT_DATE,
            'Prospect',
            'Backfilled for vendor-category reference alignment',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          WHERE NOT EXISTS (
            SELECT 1
            FROM vendors
            WHERE brand_name = ?
          )
        `,
        [
          vendor.vendorId,
          vendor.brandName,
          vendor.legalName,
          vendor.websiteUrl,
          vendor.vendorType,
          vendor.serviceDomains,
          vendor.legalTechStack,
          vendor.brandName,
        ],
      );
    }

    for (const update of VENDOR_SYSTEM_UPDATES) {
      await queryRunner.query(
        `
          UPDATE vendors
          SET legal_tech_stack = ?, updated_at = CURRENT_TIMESTAMP
          WHERE brand_name = ?
        `,
        [update.legalTechStack, update.brandName],
      );
    }

    const hasVendorProjectCategoriesTable = await queryRunner.hasTable(
      'vendor_project_categories',
    );
    if (!hasVendorProjectCategoriesTable) {
      return;
    }

    for (const reference of VENDOR_CATEGORY_REFERENCES) {
      await queryRunner.query(
        `
          INSERT IGNORE INTO vendor_project_categories (
            vendor_id,
            project_category_id,
            created_at,
            updated_at
          )
          SELECT
            v.id,
            pc.id,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          FROM vendors v
          INNER JOIN project_categories pc ON pc.value = ?
          WHERE v.brand_name = ?
        `,
        [reference.projectCategoryValue, reference.vendorBrandName],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasVendorsTable = await queryRunner.hasTable('vendors');
    if (!hasVendorsTable) {
      return;
    }

    const placeholders = BACKFILL_VENDORS.map(() => '?').join(', ');
    await queryRunner.query(
      `DELETE FROM vendors WHERE vendor_id IN (${placeholders})`,
      BACKFILL_VENDORS.map((vendor) => vendor.vendorId),
    );
  }
}
