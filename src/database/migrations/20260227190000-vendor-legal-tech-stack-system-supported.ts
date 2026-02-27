import { MigrationInterface, QueryRunner } from 'typeorm';

type VendorSystemUpdate = {
  brandName: string;
  legalTechStack: string;
};

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

export class VendorLegalTechStackSystemSupported20260227190000
  implements MigrationInterface
{
  name = 'VendorLegalTechStackSystemSupported20260227190000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Irreversible data migration (source values are intentionally overwritten).
  }
}
