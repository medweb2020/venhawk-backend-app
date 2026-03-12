import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  VENDOR_CLIENT_EXPANSION_20260311143000,
} from './data/vendor-client-expansion-20260311143000.data';

const SOURCE_NAME = "Client expansion pull (2026-03-11)";

export class VendorClientExpansion20260311143000 implements MigrationInterface {
  name = 'VendorClientExpansion20260311143000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const vendorRows = (await queryRunner.query(
      `
        SELECT id, brand_name
        FROM vendors
      `,
    )) as Array<{ id: number; brand_name: string }>;

    const vendorIdByBrand = new Map<string, number>();
    for (const row of vendorRows) {
      const key = this.normalizeKey(row.brand_name);
      if (key) {
        vendorIdByBrand.set(key, Number(row.id));
      }
    }

    const maxOrderByVendor = new Map<number, number>();

    for (const entry of VENDOR_CLIENT_EXPANSION_20260311143000) {
      const vendorId = vendorIdByBrand.get(this.normalizeKey(entry.brandName));
      if (!vendorId) {
        continue;
      }

      let nextOrder = maxOrderByVendor.get(vendorId);
      if (nextOrder === undefined) {
        const [maxOrderRow] = (await queryRunner.query(
          `
            SELECT COALESCE(MAX(display_order), -1) AS max_order
            FROM vendor_clients
            WHERE vendor_id = ?
          `,
          [vendorId],
        )) as Array<{ max_order: number }>;
        nextOrder = Number(maxOrderRow?.max_order ?? -1) + 1;
      }

      const insertResult = (await queryRunner.query(
        `
          INSERT INTO vendor_clients (
            vendor_id,
            project_category_id,
            client_name,
            client_logo_url,
            client_website_url,
            source_name,
            source_url,
            display_order
          )
          SELECT ?, NULL, ?, NULL, ?, ?, ?, ?
          WHERE NOT EXISTS (
            SELECT 1
            FROM vendor_clients vc
            WHERE vc.vendor_id = ?
              AND LOWER(TRIM(vc.client_name)) = LOWER(TRIM(?))
          )
        `,
        [
          vendorId,
          entry.clientName,
          entry.clientWebsiteUrl,
          SOURCE_NAME,
          entry.sourceUrl,
          nextOrder,
          vendorId,
          entry.clientName,
        ],
      )) as { affectedRows?: number };

      if ((insertResult?.affectedRows ?? 0) > 0) {
        nextOrder += 1;
      }

      maxOrderByVendor.set(vendorId, nextOrder);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const entry of VENDOR_CLIENT_EXPANSION_20260311143000) {
      await queryRunner.query(
        `
          DELETE vc
          FROM vendor_clients vc
          INNER JOIN vendors v ON v.id = vc.vendor_id
          WHERE v.brand_name = ?
            AND LOWER(TRIM(vc.client_name)) = LOWER(TRIM(?))
            AND vc.source_name = ?
        `,
        [entry.brandName, entry.clientName, SOURCE_NAME],
      );
    }
  }

  private normalizeKey(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
}
