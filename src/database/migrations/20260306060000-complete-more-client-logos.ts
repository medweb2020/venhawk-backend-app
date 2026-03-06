import { MigrationInterface, QueryRunner } from 'typeorm';

type ClientWebsiteAndLogoFill = {
  vendorBrandName: string;
  clientName: string;
  clientWebsiteUrl: string;
  clientLogoUrl: string;
};

const FINAL_CLIENT_WEBSITE_AND_LOGO_FILLS: ClientWebsiteAndLogoFill[] = [
  {
    vendorBrandName: 'Accenture',
    clientName: 'Minna Bank',
    clientWebsiteUrl: 'https://corporate.minna-no-ginko.com/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/corporate.minna-no-ginko.com.ico',
  },
  {
    vendorBrandName: 'Accenture',
    clientName: 'Telkom Business',
    clientWebsiteUrl: 'https://www.telkom.co.za/business/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.telkom.co.za.ico',
  },
  {
    vendorBrandName: 'Element Technologies',
    clientName: 'Folio Law Group, PLLC',
    clientWebsiteUrl: 'https://www.foliolawgroup.com/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.foliolawgroup.com.ico',
  },
  {
    vendorBrandName: 'Element Technologies',
    clientName: 'Maser Amundson Boggio PA',
    clientWebsiteUrl: 'https://www.maserlaw.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.maserlaw.com.ico',
  },
  {
    vendorBrandName: 'Harbor',
    clientName: 'Thirsk Winton LLP',
    clientWebsiteUrl: 'https://thirskwinton.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/thirskwinton.com.ico',
  },
  {
    vendorBrandName: 'Helm360',
    clientName: 'Seddons GSC LLP',
    clientWebsiteUrl: 'https://www.seddons-gsc.co.uk/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.seddons-gsc.co.uk.ico',
  },
  {
    vendorBrandName: 'KPMG',
    clientName: 'Big Brothers Big Sisters of Puget Sound',
    clientWebsiteUrl: 'https://inspirebig.org/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/inspirebig.org.ico',
  },
  {
    vendorBrandName: 'LexisNexis',
    clientName: 'Skai Analytics',
    clientWebsiteUrl: 'https://www.skaianalytics.com/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.skaianalytics.com.ico',
  },
];

export class CompleteMoreClientLogos20260306060000
  implements MigrationInterface
{
  name = 'CompleteMoreClientLogos20260306060000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const fill of FINAL_CLIENT_WEBSITE_AND_LOGO_FILLS) {
      await queryRunner.query(
        `
          UPDATE vendor_clients vc
          INNER JOIN vendors v ON v.id = vc.vendor_id
          SET
            vc.client_website_url = ?,
            vc.client_logo_url = ?,
            vc.updated_at = CURRENT_TIMESTAMP
          WHERE v.brand_name = ?
            AND vc.client_name = ?
            AND (vc.client_website_url IS NULL OR TRIM(vc.client_website_url) = '')
        `,
        [
          fill.clientWebsiteUrl,
          fill.clientLogoUrl,
          fill.vendorBrandName,
          fill.clientName,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const fill of FINAL_CLIENT_WEBSITE_AND_LOGO_FILLS) {
      await queryRunner.query(
        `
          UPDATE vendor_clients vc
          INNER JOIN vendors v ON v.id = vc.vendor_id
          SET
            vc.client_website_url = NULL,
            vc.client_logo_url = NULL,
            vc.updated_at = CURRENT_TIMESTAMP
          WHERE v.brand_name = ?
            AND vc.client_name = ?
            AND vc.client_website_url = ?
            AND vc.client_logo_url = ?
        `,
        [
          fill.vendorBrandName,
          fill.clientName,
          fill.clientWebsiteUrl,
          fill.clientLogoUrl,
        ],
      );
    }
  }
}
