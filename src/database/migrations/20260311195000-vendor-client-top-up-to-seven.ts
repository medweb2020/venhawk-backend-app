import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  VENDOR_CLIENT_TOP_UP_20260311195000,
} from './data/vendor-client-top-up-20260311195000.data';

export class VendorClientTopUpToSeven20260311195000
  implements MigrationInterface
{
  name = 'VendorClientTopUpToSeven20260311195000';

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

    const vendorState = new Map<
      number,
      {
        names: Set<string>;
        nextOrder: number;
      }
    >();

    for (const entry of VENDOR_CLIENT_TOP_UP_20260311195000) {
      const vendorId = vendorIdByBrand.get(this.normalizeKey(entry.brandName));
      if (!vendorId) {
        continue;
      }

      let state = vendorState.get(vendorId);
      if (!state) {
        const existingRows = (await queryRunner.query(
          `
            SELECT client_name
            FROM vendor_clients
            WHERE vendor_id = ?
              AND client_name IS NOT NULL
              AND TRIM(client_name) <> ''
          `,
          [vendorId],
        )) as Array<{ client_name: string }>;

        const [maxOrderRow] = (await queryRunner.query(
          `
            SELECT COALESCE(MAX(display_order), -1) AS max_order
            FROM vendor_clients
            WHERE vendor_id = ?
          `,
          [vendorId],
        )) as Array<{ max_order: number }>;

        const names = new Set<string>();

        for (const row of existingRows) {
          const normalizedName = this.normalizeKey(row.client_name);
          if (normalizedName) {
            names.add(normalizedName);
          }
        }

        state = {
          names,
          nextOrder: Number(maxOrderRow?.max_order ?? -1) + 1,
        };
        vendorState.set(vendorId, state);
      }

      if (state.names.size >= 7) {
        continue;
      }

      const normalizedClientName = this.normalizeKey(entry.clientName);
      if (!normalizedClientName || state.names.has(normalizedClientName)) {
        continue;
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
          entry.sourceName,
          entry.sourceUrl,
          state.nextOrder,
          vendorId,
          entry.clientName,
        ],
      )) as { affectedRows?: number };

      if ((insertResult?.affectedRows ?? 0) > 0) {
        state.names.add(normalizedClientName);
        state.nextOrder += 1;
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const entry of VENDOR_CLIENT_TOP_UP_20260311195000) {
      await queryRunner.query(
        `
          DELETE vc
          FROM vendor_clients vc
          INNER JOIN vendors v ON v.id = vc.vendor_id
          WHERE v.brand_name = ?
            AND LOWER(TRIM(vc.client_name)) = LOWER(TRIM(?))
            AND vc.source_name = ?
            AND vc.source_url = ?
        `,
        [entry.brandName, entry.clientName, entry.sourceName, entry.sourceUrl],
      );
    }
  }

  private normalizeKey(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
}
