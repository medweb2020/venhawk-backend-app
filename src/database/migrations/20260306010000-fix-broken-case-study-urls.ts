import { MigrationInterface, QueryRunner } from 'typeorm';

type CaseStudyUrlFix = {
  vendorBrandName: string;
  title: string;
  previousStudyUrl: string;
  nextStudyUrl: string;
};

const CASE_STUDY_URL_FIXES: CaseStudyUrlFix[] = [
  {
    vendorBrandName: 'Adastra',
    title: 'Raiffeisenbank Unified Data Platform Concept',
    previousStudyUrl:
      'https://adastracorp.com/success-stories/raiffeisenbank-unified-data-platform-concept/',
    nextStudyUrl:
      'https://adastracorp.com/success-stories/raiffeisenbank-a-unified-data-platform-concept-on-databricks-in-aws-cloud/',
  },
  {
    vendorBrandName: 'Adastra',
    title: 'CETIN: Maximizing the Power of Microsoft Purview',
    previousStudyUrl:
      'https://adastracorp.com/success-stories/cetin-maximizing-the-power-of-microsoft-purview/',
    nextStudyUrl:
      'https://adastracorp.com/success-stories/cetin-microsoft-purview-data-governance-deployed-by-adastra/',
  },
  {
    vendorBrandName: 'Adastra',
    title:
      'Automated forward-looking procurement process saves 1,000 hours of manual work per year',
    previousStudyUrl:
      'https://adastracorp.com/success-stories/automated-forward-looking-procurement-process-saves-1000-hours-of-manual-work-per-year/',
    nextStudyUrl:
      'https://adastracorp.com/success-stories/automated-forward-looking-procurement/',
  },
  {
    vendorBrandName: 'Adastra',
    title:
      'Fully automated shipment tracking with RPA saves 250 hours of manual work monthly',
    previousStudyUrl:
      'https://adastracorp.com/success-stories/fully-automated-shipment-tracking-with-rpa-saves-250-hours-of-manual-work-monthly/',
    nextStudyUrl:
      'https://adastracorp.com/success-stories/5600-man-hours-saved-annually-with-fully-automated-shipment-tracking/',
  },
  {
    vendorBrandName: 'Adastra',
    title: 'AWS cloud migration for a healthcare organization',
    previousStudyUrl:
      'https://adastracorp.com/success-stories/aws-cloud-migration-for-a-healthcare-organization/',
    nextStudyUrl:
      'https://adastracorp.com/success-stories/significant-cost-savings-for-a-healthcare-organization-through-aws-cloud-migration/',
  },
  {
    vendorBrandName: 'CloudForce',
    title: 'UCLA Anderson School of Management',
    previousStudyUrl:
      'https://partner.microsoft.com/en-us/case-studies/ucla-anderson-school-of-management',
    nextStudyUrl:
      'https://www.microsoft.com/en-us/education/blog/2025/04/how-microsoft-and-cloudforce-help-institutions-innovate-with-azure-ai/',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    title: 'Law Firm to Deliver Windows Virtual Desktops From Azure',
    previousStudyUrl:
      'https://www.cornerstone.it/law-firm-to-deliver-windows-virtual-desktops-from-azure/',
    nextStudyUrl:
      'https://www.cornerstone.it/law-firm-delivers-windows-virtual-desktops-from-azure/',
  },
  {
    vendorBrandName: 'Element Technologies',
    title: 'Salesforce Lead Management in the Banking Sector',
    previousStudyUrl:
      'https://elementtechnologies.com/case-studies/salesforce-lead-management-in-the-banking-sector/',
    nextStudyUrl: 'https://elementtechnologies.com/salesforce-case-study/',
  },
  {
    vendorBrandName: 'Helm360',
    title:
      'Hogan Lovells Selects Helm360 for Elite 3E Upgrade and Transition to the Cloud',
    previousStudyUrl:
      'https://helm360.com/wp-content/uploads/2021/07/Hogan_Lovells_Case_Study.pdf',
    nextStudyUrl:
      'https://helm360.com/wp-content/uploads/2020/04/Hogan-Lovells-Case-Study.pdf',
  },
  {
    vendorBrandName: 'Inoutsource',
    title: 'Baker Botts - Rapid User Integration with Zero Downtime',
    previousStudyUrl:
      'https://www.inoutsource.com/case-studies/baker-botts-rapid-user-integration-with-zero-downtime/',
    nextStudyUrl:
      'https://inoutsource.com/case-study-new-business-intake-and-beyond-confidently-migrating-complex-workflows-to-the-cloud/',
  },
  {
    vendorBrandName: 'Inoutsource',
    title: 'Goulston & Storrs - iManage Cloud Migration',
    previousStudyUrl:
      'https://www.inoutsource.com/case-studies/goulston-storrs-imanage-cloud-migration/',
    nextStudyUrl:
      'https://inoutsource.com/case-study-goulston-audit-response-letter/',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    title:
      'Carver Federal Savings Bank: Achieving Resiliency and Improved Performance through a Modernized IT Architecture',
    previousStudyUrl:
      'https://www.kraftkennedy.com/success-stories/carver-federal-savings-bank-achieving-resiliency-and-improved-performance-through-a-modernized-it-architecture/',
    nextStudyUrl: 'https://www.kraftkennedy.com/services/managed-desktop/',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    title: 'Zetlin & De Chiara turns to Kraft Kennedy for future-ready operations',
    previousStudyUrl:
      'https://www.kraftkennedy.com/stories/zetlin-de-chiara-turns-to-kraft-kennedy-for-future-ready-operations/',
    nextStudyUrl:
      'https://www.kraftkennedy.com/stories/construction-law-firm-turns-to-kraft-kennedy-to-future-ready-operations/',
  },
  {
    vendorBrandName: 'LexisNexis',
    title: 'Customer Due Diligence case study for large financial institution',
    previousStudyUrl:
      'https://risk.lexisnexis.com/about-us/case-studies/customer-due-diligence-case-study-for-large-financial-institution',
    nextStudyUrl:
      'https://risk.lexisnexis.com/insights-resources/case-study/customer-due-diligence-case-study-for-large-financial-institution',
  },
  {
    vendorBrandName: 'LexisNexis',
    title: 'Customer success story: locating a missing person with Accurint TraX',
    previousStudyUrl:
      'https://risk.lexisnexis.com/about-us/case-studies/customer-success-story',
    nextStudyUrl:
      'https://risk.lexisnexis.com/insights-resources/case-study/customer-success-story',
  },
  {
    vendorBrandName: 'Thomson Reuters',
    title: "HighQ case study: Parris Law Firm's innovative case management",
    previousStudyUrl:
      'https://legal.thomsonreuters.com/en/case-studies/highq-case-study-parris-law-firms-innovative-case-management',
    nextStudyUrl:
      'https://legal.thomsonreuters.com/en/insights/case-studies/highq-case-study-parris-law-firms-innovative-case-management',
  },
  {
    vendorBrandName: 'Thomson Reuters',
    title: 'Stevens & Bolton Case Study - HighQ',
    previousStudyUrl:
      'https://legal.thomsonreuters.com/en/case-studies/stevens-bolton-case-study-highq',
    nextStudyUrl:
      'https://legal.thomsonreuters.com/en/insights/case-studies/stevens-bolton',
  },
  {
    vendorBrandName: 'Thomson Reuters',
    title: 'Geldards Case Study - HighQ',
    previousStudyUrl:
      'https://legal.thomsonreuters.com/en/case-studies/geldards-case-study-highq',
    nextStudyUrl:
      'https://legal.thomsonreuters.com/en/insights/case-studies/geldards',
  },
  {
    vendorBrandName: 'TitanFile',
    title: 'Littler turns to TitanFile as its legal file sharing solution',
    previousStudyUrl:
      'https://www.titanfile.com/blog/littler-turns-to-titanfile-as-its-legal-file-sharing-solution/',
    nextStudyUrl: 'https://www.titanfile.com/resources/case-studies/littler/',
  },
  {
    vendorBrandName: 'TitanFile',
    title: 'Marshall Dennehey Case Study',
    previousStudyUrl:
      'https://www.titanfile.com/resources/case-studies/marshall-dennehey/',
    nextStudyUrl:
      'https://www.titanfile.com/resources/case-studies/marshall-dennehey-case-study/',
  },
  {
    vendorBrandName: 'TitanFile',
    title: 'Siskinds LLP Case Study',
    previousStudyUrl:
      'https://www.titanfile.com/resources/case-studies/siskinds/',
    nextStudyUrl:
      'https://www.titanfile.com/resources/case-studies/siskinds-llp-case-study/',
  },
];

export class FixBrokenCaseStudyUrls20260306010000
  implements MigrationInterface
{
  name = 'FixBrokenCaseStudyUrls20260306010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const fix of CASE_STUDY_URL_FIXES) {
      await queryRunner.query(
        `
          UPDATE vendor_case_studies vcs
          INNER JOIN vendors v ON v.id = vcs.vendor_id
          SET
            vcs.study_url = ?,
            vcs.source_url = CASE
              WHEN vcs.source_url = ? OR vcs.source_url IS NULL THEN ?
              ELSE vcs.source_url
            END,
            vcs.updated_at = CURRENT_TIMESTAMP
          WHERE v.brand_name = ?
            AND vcs.title = ?
            AND vcs.study_url = ?
        `,
        [
          fix.nextStudyUrl,
          fix.previousStudyUrl,
          fix.nextStudyUrl,
          fix.vendorBrandName,
          fix.title,
          fix.previousStudyUrl,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const fix of CASE_STUDY_URL_FIXES) {
      await queryRunner.query(
        `
          UPDATE vendor_case_studies vcs
          INNER JOIN vendors v ON v.id = vcs.vendor_id
          SET
            vcs.study_url = ?,
            vcs.source_url = CASE
              WHEN vcs.source_url = ? OR vcs.source_url IS NULL THEN ?
              ELSE vcs.source_url
            END,
            vcs.updated_at = CURRENT_TIMESTAMP
          WHERE v.brand_name = ?
            AND vcs.title = ?
            AND vcs.study_url = ?
        `,
        [
          fix.previousStudyUrl,
          fix.nextStudyUrl,
          fix.previousStudyUrl,
          fix.vendorBrandName,
          fix.title,
          fix.nextStudyUrl,
        ],
      );
    }
  }
}
