import { MigrationInterface, QueryRunner } from 'typeorm';

type ClientLogoFill = {
  vendorBrandName: string;
  clientName: string;
  clientWebsiteUrl: string;
  clientLogoUrl: string;
};

const REMAINING_CLIENT_LOGOS: ClientLogoFill[] = [
  {
    vendorBrandName: 'Cloudficient',
    clientName: 'Rabobank',
    clientWebsiteUrl: 'https://www.rabobank.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.rabobank.com.ico',
  },
  {
    vendorBrandName: 'Cognizant',
    clientName: 'Lufthansa Group',
    clientWebsiteUrl: 'https://www.lufthansagroup.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.lufthansagroup.com.ico',
  },
  {
    vendorBrandName: 'Harbor',
    clientName: 'Rubrik',
    clientWebsiteUrl: 'https://www.rubrik.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.rubrik.com.ico',
  },
  {
    vendorBrandName: 'LexisNexis',
    clientName: 'Merck KGaA, Darmstadt, Germany',
    clientWebsiteUrl: 'https://www.merckgroup.com/',
    clientLogoUrl:
      'https://www.merckgroup.com/etc.clientlibs/mkgaa/clientlibs/clientlib-common/resources/assets/favicon/touch-icon-iphone-retina.png',
  },
  {
    vendorBrandName: 'LexisNexis',
    clientName: 'SAP',
    clientWebsiteUrl: 'https://www.sap.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.sap.com.ico',
  },
];

export class FillRemainingClientLogos20260306040000
  implements MigrationInterface
{
  name = 'FillRemainingClientLogos20260306040000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const logo of REMAINING_CLIENT_LOGOS) {
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
          logo.clientLogoUrl,
          logo.vendorBrandName,
          logo.clientName,
          logo.clientWebsiteUrl,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const logo of REMAINING_CLIENT_LOGOS) {
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
          logo.vendorBrandName,
          logo.clientName,
          logo.clientWebsiteUrl,
          logo.clientLogoUrl,
        ],
      );
    }
  }
}
