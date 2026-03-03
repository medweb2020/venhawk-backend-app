import { MigrationInterface, QueryRunner } from 'typeorm';

type ProjectCategorySeed = {
  value: string;
  label: string;
};

type VendorCategorySystemReference = {
  vendorBrandName: string;
  projectCategoryValue: string;
  legalTechStack: string;
};

const REQUIRED_PROJECT_CATEGORIES: ProjectCategorySeed[] = [
  {
    value: 'legal-apps',
    label: 'Legal Application Implementations & Migrations',
  },
  {
    value: 'cloud-migration',
    label: 'Cloud Migrations & Infrastructure Modernization',
  },
  {
    value: 'enterprise-it',
    label: 'Enterprise IT Implementations & Modernization',
  },
  {
    value: 'app-bug-fixes',
    label: 'Application Bug Fixes & Integrations',
  },
];

const VENDOR_CATEGORY_SYSTEM_REFERENCES: VendorCategorySystemReference[] = [
  {
    vendorBrandName: 'Thomson Reuters',
    projectCategoryValue: 'legal-apps',
    legalTechStack: 'HighQ',
  },
  {
    vendorBrandName: 'TitanFile',
    projectCategoryValue: 'legal-apps',
    legalTechStack: 'TitanFile',
  },
  {
    vendorBrandName: 'LexisNexis',
    projectCategoryValue: 'legal-apps',
    legalTechStack: 'Interaction, CounselLink, Lexis Connect',
  },
  {
    vendorBrandName: 'Inoutsource',
    projectCategoryValue: 'legal-apps',
    legalTechStack: 'Intapp Intake, NetDocuments, iCompli, Nectar, FileTrail',
  },
  {
    vendorBrandName: 'eSentio Technologies',
    projectCategoryValue: 'legal-apps',
    legalTechStack:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, NetDocuments, Litera, iManage Work',
  },
  {
    vendorBrandName: 'RBRO',
    projectCategoryValue: 'legal-apps',
    legalTechStack: 'iManage Work',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    projectCategoryValue: 'legal-apps',
    legalTechStack: 'iManage Work, NetDocuments',
  },
  {
    vendorBrandName: 'Stone Consulting',
    projectCategoryValue: 'legal-apps',
    legalTechStack: 'iManage Work',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    projectCategoryValue: 'legal-apps',
    legalTechStack:
      'iManage Work, NetDocuments, Doc Auto, OpenText, VerQu, Prosperoware, Worldox',
  },
  {
    vendorBrandName: 'Element Technologies',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Amazon Web Services (AWS), Microsoft Azure, Salesforce Sales Cloud, SAP S/4HANA, Databricks, Snowflake, Microsoft 365',
  },
  {
    vendorBrandName: 'Helient Systems',
    projectCategoryValue: 'cloud-migration',
    legalTechStack: 'iManage Work, Microsoft 365, Microsoft Azure',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Citrix, Microsoft Azure, Microsoft 365, Exchange Online, Microsoft Teams, Mimecast, Cisco Networking',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Citrix, Microsoft Azure, Microsoft 365, Exchange Online, Microsoft Teams, Mimecast',
  },
  {
    vendorBrandName: 'Cloudficient',
    projectCategoryValue: 'cloud-migration',
    legalTechStack: 'Microsoft 365, Exchange Online, PST Migration',
  },
  {
    vendorBrandName: 'Adastra',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Amazon Web Services (AWS), Microsoft Azure, Microsoft Power BI, Databricks, Snowflake, Microsoft 365, Microsoft Dynamics 365',
  },
  {
    vendorBrandName: 'CloudForce',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Microsoft Azure, Microsoft Power BI, Microsoft 365, Microsoft Dynamics 365, Netscaler, Active Directory',
  },
  {
    vendorBrandName: 'CDW',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Microsoft Azure, Amazon Web Services (AWS), Google Cloud Platform, Cisco Networking, Palo Alto Networks, NetApp, VMware',
  },
  {
    vendorBrandName: 'Cognizant',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Microsoft Azure, Amazon Web Services (AWS), Google Cloud Platform, Oracle Cloud Infrastructure',
  },
  {
    vendorBrandName: 'CDW',
    projectCategoryValue: 'enterprise-it',
    legalTechStack:
      'ServiceNow ITSM, ServiceNow ITOM, ServiceNow CSM, ServiceNow HR Service Delivery, ServiceNow Now Assist AI, ServiceNow App Engine, Microsoft 365, Microsoft Azure, Microsoft Copilot, Cisco Networking, Palo Alto Networks, NetApp',
  },
  {
    vendorBrandName: 'Cognizant',
    projectCategoryValue: 'enterprise-it',
    legalTechStack:
      'ServiceNow ITSM, ServiceNow ITOM, ServiceNow CSM, ServiceNow HR Service Delivery, ServiceNow IRM, ServiceNow Workflow Data Fabric, ServiceNow Now Assist AI, Workday HCM, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud',
  },
  {
    vendorBrandName: 'AAC Consulting',
    projectCategoryValue: 'app-bug-fixes',
    legalTechStack: 'Aderant Expert, Elite 3E',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    projectCategoryValue: 'app-bug-fixes',
    legalTechStack:
      'iManage Work, NetDocuments, Doc Auto, OpenText, VerQu, Prosperoware, Worldox',
  },
  {
    vendorBrandName: 'Cognizant',
    projectCategoryValue: 'app-bug-fixes',
    legalTechStack:
      'SAP S/4HANA, Salesforce Sales Cloud, Salesforce Service Cloud, ServiceNow ITSM',
  },
  {
    vendorBrandName: 'CDW',
    projectCategoryValue: 'app-bug-fixes',
    legalTechStack: 'Microsoft 365, Microsoft Copilot, ServiceNow Now Assist AI',
  },
];

function parseSystems(value: string): string[] {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function buildLegalTechStackByVendor(): Map<string, string> {
  const systemsByVendor = new Map<string, string[]>();

  for (const reference of VENDOR_CATEGORY_SYSTEM_REFERENCES) {
    const current = systemsByVendor.get(reference.vendorBrandName) ?? [];

    for (const system of parseSystems(reference.legalTechStack)) {
      if (!current.includes(system)) {
        current.push(system);
      }
    }

    systemsByVendor.set(reference.vendorBrandName, current);
  }

  return new Map(
    Array.from(systemsByVendor.entries()).map(([brandName, systems]) => [
      brandName,
      systems.join(', '),
    ]),
  );
}

const LEGAL_TECH_STACK_BY_VENDOR = buildLegalTechStackByVendor();

export class VendorSystemsAndProjectCategoriesSync20260303010000
  implements MigrationInterface
{
  name = 'VendorSystemsAndProjectCategoriesSync20260303010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const category of REQUIRED_PROJECT_CATEGORIES) {
      await queryRunner.query(
        `
          INSERT INTO project_categories (value, label, created_at)
          SELECT ?, ?, CURRENT_TIMESTAMP
          WHERE NOT EXISTS (
            SELECT 1 FROM project_categories WHERE value = ?
          )
        `,
        [category.value, category.label, category.value],
      );
    }

    for (const reference of VENDOR_CATEGORY_SYSTEM_REFERENCES) {
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

    for (const [brandName, legalTechStack] of LEGAL_TECH_STACK_BY_VENDOR) {
      await queryRunner.query(
        `
          UPDATE vendors
          SET legal_tech_stack = ?, updated_at = CURRENT_TIMESTAMP
          WHERE brand_name = ?
        `,
        [legalTechStack, brandName],
      );
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Irreversible data migration (snapshot sync).
  }
}
