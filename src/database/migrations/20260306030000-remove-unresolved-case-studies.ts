import { MigrationInterface, QueryRunner } from 'typeorm';

type CaseStudyRemoval = {
  vendorBrandName: string;
  title: string;
  expectedStudyUrl: string | null;
};

const UNRESOLVED_CASE_STUDY_REMOVALS: CaseStudyRemoval[] = [
  {
    vendorBrandName: 'Cornerstone.IT',
    title: 'Bi-Coastal Law Firm iManage Migration',
    expectedStudyUrl: null,
  },
  {
    vendorBrandName: 'Inoutsource',
    title: 'Berger Singerman - A Natural Fit for Inoutsource',
    expectedStudyUrl: null,
  },
  {
    vendorBrandName: 'LexisNexis',
    title: 'UK Local Authority Licensing: LA Data Integration',
    expectedStudyUrl: null,
  },
];

export class RemoveUnresolvedCaseStudies20260306030000
  implements MigrationInterface
{
  name = 'RemoveUnresolvedCaseStudies20260306030000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const removal of UNRESOLVED_CASE_STUDY_REMOVALS) {
      await queryRunner.query(
        `
          DELETE vcs
          FROM vendor_case_studies vcs
          INNER JOIN vendors v ON v.id = vcs.vendor_id
          WHERE v.brand_name = ?
            AND vcs.title = ?
            AND (
              (? IS NULL AND vcs.study_url IS NULL)
              OR vcs.study_url = ?
            )
        `,
        [
          removal.vendorBrandName,
          removal.title,
          removal.expectedStudyUrl,
          removal.expectedStudyUrl,
        ],
      );
    }

    await queryRunner.query(
      `
        UPDATE vendor_clients vc
        INNER JOIN vendors v ON v.id = vc.vendor_id
        SET
          vc.client_logo_url = ?,
          vc.updated_at = CURRENT_TIMESTAMP
        WHERE v.brand_name = ?
          AND vc.client_name = ?
          AND vc.client_website_url = ?
      `,
      [
        'https://www.royallondon.com/apple-touch-icon.png',
        'Cognizant',
        'Royal London Group',
        'https://www.royallondon.com/',
      ],
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Destructive cleanup. Down intentionally left empty.
  }
}
