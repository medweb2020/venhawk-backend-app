import { MigrationInterface, QueryRunner } from 'typeorm';

const FINAL_CLIENT_LOGO_FILL = {
  vendorBrandName: 'eSentio Technologies',
  clientName: 'Drinker Biddle & Reath',
  clientWebsiteUrl: 'https://www.drinkerbiddle.com/',
  clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.drinkerbiddle.com.ico',
};

export class FillFinalClientLogo20260306070000 implements MigrationInterface {
  name = 'FillFinalClientLogo20260306070000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
          AND (
            vc.client_website_url IS NULL
            OR TRIM(vc.client_website_url) = ''
            OR vc.client_logo_url IS NULL
            OR TRIM(vc.client_logo_url) = ''
          )
      `,
      [
        FINAL_CLIENT_LOGO_FILL.clientWebsiteUrl,
        FINAL_CLIENT_LOGO_FILL.clientLogoUrl,
        FINAL_CLIENT_LOGO_FILL.vendorBrandName,
        FINAL_CLIENT_LOGO_FILL.clientName,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
        FINAL_CLIENT_LOGO_FILL.vendorBrandName,
        FINAL_CLIENT_LOGO_FILL.clientName,
        FINAL_CLIENT_LOGO_FILL.clientWebsiteUrl,
        FINAL_CLIENT_LOGO_FILL.clientLogoUrl,
      ],
    );
  }
}
