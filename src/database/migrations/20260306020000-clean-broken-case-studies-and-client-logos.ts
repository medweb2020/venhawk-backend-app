import { MigrationInterface, QueryRunner } from 'typeorm';

type BrokenCaseStudyRemoval = {
  vendorBrandName: string;
  title: string;
  brokenStudyUrl: string;
};

type ClientLogoUpdate = {
  vendorBrandName: string;
  clientName: string;
  clientWebsiteUrl: string;
  clientLogoUrl: string;
};

const BROKEN_CASE_STUDY_REMOVALS: BrokenCaseStudyRemoval[] = [
  {
    vendorBrandName: 'Cornerstone.IT',
    title: 'Bi-Coastal Law Firm iManage Migration',
    brokenStudyUrl: 'https://www.cornerstone.it/wp-content/uploads/2024/01/fkks_case-study.pdf',
  },
  {
    vendorBrandName: 'Inoutsource',
    title: 'Berger Singerman - A Natural Fit for Inoutsource',
    brokenStudyUrl:
      'https://www.inoutsource.com/case-studies/berger-singerman-a-natural-fit-for-inoutsource/',
  },
  {
    vendorBrandName: 'LexisNexis',
    title: 'UK Local Authority Licensing: LA Data Integration',
    brokenStudyUrl:
      'https://www.lexisnexis.co.uk/case-study/uk-local-authority-licensing-la-data-integration',
  },
];

const CLIENT_LOGO_UPDATES: ClientLogoUpdate[] = [
  {
    vendorBrandName: 'Accenture',
    clientName: 'IHG Hotels & Resorts',
    clientWebsiteUrl: 'https://www.ihg.com/',
    clientLogoUrl: 'https://www.ihg.com/hotels/images/6c/favicon.ico',
  },
  {
    vendorBrandName: 'Accenture',
    clientName: 'Spotify',
    clientWebsiteUrl: 'https://www.spotify.com/',
    clientLogoUrl: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png',
  },
  {
    vendorBrandName: 'Accenture',
    clientName: 'Best Buy',
    clientWebsiteUrl: 'https://www.bestbuy.com/',
    clientLogoUrl: 'https://www.bestbuy.com/favicon.ico',
  },
  {
    vendorBrandName: 'Adastra',
    clientName: 'Prague Airport',
    clientWebsiteUrl: 'https://www.prg.aero/',
    clientLogoUrl: 'https://d2b5gmzfxp2iy.cloudfront.net/favicon.png',
  },
  {
    vendorBrandName: 'Adastra',
    clientName: 'GZ Media',
    clientWebsiteUrl: 'https://www.gzmedia.com/',
    clientLogoUrl:
      'https://www.gzmedia.com/wp-content/uploads/2025/09/gz-favicon_2.ico',
  },
  {
    vendorBrandName: 'Adastra',
    clientName: 'CBI Health',
    clientWebsiteUrl: 'https://cbihealth.ca/',
    clientLogoUrl: 'https://www.cbihealth.ca/favicon.ico',
  },
  {
    vendorBrandName: 'CDW',
    clientName: 'Coventry University',
    clientWebsiteUrl: 'https://www.coventry.ac.uk/',
    clientLogoUrl: 'https://www.coventry.ac.uk/apple-touch-icon.png',
  },
  {
    vendorBrandName: 'CDW',
    clientName: 'Cranfield University',
    clientWebsiteUrl: 'https://www.cranfield.ac.uk/',
    clientLogoUrl: 'https://www.cranfield.ac.uk/~/media/brand/appleicon180x180.png',
  },
  {
    vendorBrandName: 'CDW',
    clientName: 'University of Nebraska Foundation',
    clientWebsiteUrl: 'https://nufoundation.org/',
    clientLogoUrl: 'https://nufoundation.org/wp-content/uploads/2019/04/favicon.ico',
  },
  {
    vendorBrandName: 'Cloudficient',
    clientName: 'Keller & Heckman',
    clientWebsiteUrl: 'https://www.khlaw.com/',
    clientLogoUrl: 'https://www.khlaw.com/themes/khlaw_bootstrap/favicon.ico',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    clientName: 'Beck Redden',
    clientWebsiteUrl: 'https://www.beckredden.com/',
    clientLogoUrl: 'https://beckredden.com/wp-content/uploads/2021/01/favicon.ico',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    clientName: 'Saul Ewing Arnstein & Lehr LLP',
    clientWebsiteUrl: 'https://www.saul.com/',
    clientLogoUrl:
      'https://www.saul.com/themes/custom/outline_frontend/assets/apple-touch-icon.png',
  },
  {
    vendorBrandName: 'eSentio Technologies',
    clientName: 'Akin Gump Strauss Hauer & Feld',
    clientWebsiteUrl: 'https://www.akingump.com/',
    clientLogoUrl:
      'https://www.akingump.com/cached/40119/images/favicons/favicon.png',
  },
  {
    vendorBrandName: 'Harbor',
    clientName: 'McDermott Will & Emery',
    clientWebsiteUrl: 'https://www.mwe.com/',
    clientLogoUrl:
      'https://d1198w4twoqz7i.cloudfront.net/wp-content/uploads/2025/08/04011107/cropped-mwe-favicon-192x192.png',
  },
  {
    vendorBrandName: 'Inoutsource',
    clientName: 'Fisher Phillips',
    clientWebsiteUrl: 'https://www.fisherphillips.com/',
    clientLogoUrl:
      'https://www.fisherphillips.com/images/build/apple-touch-icon_a503a8d8.png',
  },
  {
    vendorBrandName: 'Inoutsource',
    clientName: 'Shearman & Sterling',
    clientWebsiteUrl: 'https://www.shearman.com/',
    clientLogoUrl: 'https://www.aoshearman.com/favicons/apple-icon-180x180.png',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    clientName: 'Ice Miller',
    clientWebsiteUrl: 'https://www.icemiller.com/',
    clientLogoUrl: 'https://www.icemiller.com/favicon.ico',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    clientName: 'Bryant Miller Olive',
    clientWebsiteUrl: 'https://www.bmolaw.com/',
    clientLogoUrl: 'https://www.bmolaw.com/favicon.ico',
  },
  {
    vendorBrandName: 'LexisNexis',
    clientName: 'Siemens',
    clientWebsiteUrl: 'https://www.siemens.com/',
    clientLogoUrl: 'https://www.siemens.com/img/favicon.svg',
  },
  {
    vendorBrandName: 'LexisNexis',
    clientName: 'NGK Insulators',
    clientWebsiteUrl: 'https://www.ngk-insulators.com/',
    clientLogoUrl: 'https://www.ngk-insulators.com/favicon.ico',
  },
  {
    vendorBrandName: 'Premier Technology Solutions',
    clientName: 'Glenroy RSL',
    clientWebsiteUrl: 'https://www.glenroyrsl.com.au/',
    clientLogoUrl: 'https://www.glenroyrsl.com.au/apple-touch-icon.png',
  },
  {
    vendorBrandName: 'Premier Technology Solutions',
    clientName: 'Styleprint',
    clientWebsiteUrl: 'https://www.styleprint.com.au/',
    clientLogoUrl:
      'https://www.styleprint.com.au/static/themes/theme-1/images/icons/favicon.ico',
  },
  {
    vendorBrandName: 'Premier Technology Solutions',
    clientName: 'Australian Venue Co.',
    clientWebsiteUrl: 'https://www.ausvenueco.com.au/',
    clientLogoUrl:
      'https://www.ausvenueco.com.au/wp-content/themes/ausvenueco-v2/dist/images/favicons/apple-touch-icon.png',
  },
  {
    vendorBrandName: 'Premier Technology Solutions',
    clientName: 'Palace Nova',
    clientWebsiteUrl: 'https://www.palacenova.com.au/',
    clientLogoUrl: 'https://www.palacenova.com.au/favicon.ico',
  },
  {
    vendorBrandName: 'Thomson Reuters',
    clientName: 'Royds Withy King',
    clientWebsiteUrl: 'https://www.rwkgoodman.com/',
    clientLogoUrl:
      'https://www.rwkgoodman.com/wp-content/uploads/2024/02/favicon.png',
  },
  {
    vendorBrandName: 'TitanFile',
    clientName: 'Siskinds LLP',
    clientWebsiteUrl: 'https://www.siskinds.com/',
    clientLogoUrl:
      'https://www.siskinds.com/wp-content/uploads/cropped-favicon-192x192.png',
  },
];

export class CleanBrokenCaseStudiesAndClientLogos20260306020000
  implements MigrationInterface
{
  name = 'CleanBrokenCaseStudiesAndClientLogos20260306020000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const removal of BROKEN_CASE_STUDY_REMOVALS) {
      await queryRunner.query(
        `
          UPDATE vendor_case_studies vcs
          INNER JOIN vendors v ON v.id = vcs.vendor_id
          SET
            vcs.study_url = NULL,
            vcs.updated_at = CURRENT_TIMESTAMP
          WHERE v.brand_name = ?
            AND vcs.title = ?
            AND vcs.study_url = ?
        `,
        [removal.vendorBrandName, removal.title, removal.brokenStudyUrl],
      );
    }

    for (const logoUpdate of CLIENT_LOGO_UPDATES) {
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
          logoUpdate.clientLogoUrl,
          logoUpdate.vendorBrandName,
          logoUpdate.clientName,
          logoUpdate.clientWebsiteUrl,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const removal of BROKEN_CASE_STUDY_REMOVALS) {
      await queryRunner.query(
        `
          UPDATE vendor_case_studies vcs
          INNER JOIN vendors v ON v.id = vcs.vendor_id
          SET
            vcs.study_url = ?,
            vcs.updated_at = CURRENT_TIMESTAMP
          WHERE v.brand_name = ?
            AND vcs.title = ?
            AND vcs.study_url IS NULL
        `,
        [removal.brokenStudyUrl, removal.vendorBrandName, removal.title],
      );
    }

    for (const logoUpdate of CLIENT_LOGO_UPDATES) {
      await queryRunner.query(
        `
          UPDATE vendor_clients vc
          INNER JOIN vendors v ON v.id = vc.vendor_id
          SET
            vc.client_logo_url = NULL,
            vc.updated_at = CURRENT_TIMESTAMP
          WHERE v.brand_name = ?
            AND vc.client_name = ?
            AND vc.client_website_url = ?
            AND vc.client_logo_url = ?
        `,
        [
          logoUpdate.vendorBrandName,
          logoUpdate.clientName,
          logoUpdate.clientWebsiteUrl,
          logoUpdate.clientLogoUrl,
        ],
      );
    }
  }
}
