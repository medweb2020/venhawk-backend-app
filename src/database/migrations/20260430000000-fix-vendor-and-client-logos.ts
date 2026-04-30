import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Fix vendor and client logo URLs.
 *
 * VENDOR LOGOS
 * Targets rows where logo_url IS NULL or still holds a /favicon path
 * from the initial seed migration (20260303023000). The refresh migration
 * (20260303050000) already set proper URLs for most vendors; this is a
 * safety-net for any that were missed or that have NULL values.
 *
 * Each URL was verified to return HTTP 200 with a valid image content-type
 * (image/svg+xml, image/png, image/jpeg) on 2026-04-30.
 *
 * CLIENT LOGOS
 * Many vendor_clients rows have client_logo_url = NULL. For any row that
 * has a client_website_url but no logo URL, we derive a Google Favicons URL
 * (128px) which is reliable and always returns an image. Rows with neither
 * a website URL nor a logo URL are left NULL — the frontend initials
 * fallback handles them.
 *
 * Note: Clearbit Logo API (logo.clearbit.com) was evaluated but is no
 * longer reachable (DNS does not resolve as of 2026-04-30; deprecated
 * post-HubSpot acquisition). Google Favicons API is used instead.
 */

// Each entry: only update if logo_url IS NULL or contains '/favicon'
const VENDOR_LOGO_FIXES: Array<{ brandName: string; logoUrl: string }> = [
  {
    brandName: 'Harbor',
    logoUrl: 'https://harborglobal.com/brand/harbor-logo-primary.svg',
  },
  {
    brandName: 'Legalytics',
    logoUrl:
      'https://legalytics.io/wp-content/uploads/2023/09/cropped-cropped-Legalytics-Color-1-4.png',
  },
  {
    brandName: 'Helm360',
    logoUrl:
      'https://helm360.com/wp-content/uploads/2020/04/Helm360-Logo-222222-1.png',
  },
  {
    brandName: 'Epiq',
    logoUrl:
      'https://www.epiqglobal.com/epiq/media/logos/epiq_logo_techblue-5.png',
  },
  {
    brandName: 'Proventeq',
    logoUrl:
      'https://www.proventeq.com/documents/34352/1552260/proventeqLogo.png',
  },
  {
    brandName: 'Premier Technology Solutions',
    logoUrl:
      'https://www.premiertechnology.com/wp-content/uploads/2017/02/premier-color-logo350-011.png',
  },
  {
    brandName: 'Accenture',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
  },
  {
    brandName: 'Slalom',
    logoUrl:
      'https://s7d9.scene7.com/is/content/slalom/slalom-logo-blue-RGB?fmt=webp-alpha&metadata=none',
  },
  {
    brandName: 'Deloitte',
    logoUrl:
      'https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg',
  },
  {
    brandName: 'KPMG',
    logoUrl: 'https://assets.kpmg.com/is/image/kpmg/kpmg-logo-1',
  },
  {
    brandName: 'Zendesk Pro Services',
    logoUrl:
      'https://d1eipm3vz40hy0.cloudfront.net/images/logos/favicons/zendesk-icon.svg',
  },
  {
    brandName: 'Wise Consulting',
    logoUrl:
      'https://rsmus.com/content/experience-fragments/rsm/us/en/site/header/master/_jcr_content/root/globalheader/mainnav/logo.coreimg.png/1648142668633/logo.png',
  },
  {
    brandName: 'Cornerstone.IT',
    logoUrl:
      'https://cornerstone.it/assets/img/branding/cornerstoneit_logo_registeredtrademark.svg',
  },
];

export class FixVendorAndClientLogos20260430000000 implements MigrationInterface {
  name = 'FixVendorAndClientLogos20260430000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── PART A: Vendor logos ────────────────────────────────────────────────
    const vendorReport: Array<{
      brand: string;
      status: 'fixed' | 'already_ok' | 'not_found';
      old: string | null;
      new: string | null;
    }> = [];

    for (const fix of VENDOR_LOGO_FIXES) {
      const rows = (await queryRunner.query(
        `SELECT id, logo_url FROM vendors WHERE brand_name = ? LIMIT 1`,
        [fix.brandName],
      )) as Array<{ id: number; logo_url: string | null }>;

      if (rows.length === 0) {
        vendorReport.push({ brand: fix.brandName, status: 'not_found', old: null, new: null });
        continue;
      }

      const current = rows[0].logo_url || null;
      const needsFix =
        current === null ||
        current === '' ||
        current.includes('/favicon') ||
        current.endsWith('.ico');

      if (!needsFix) {
        vendorReport.push({ brand: fix.brandName, status: 'already_ok', old: current, new: current });
        continue;
      }

      await queryRunner.query(
        `UPDATE vendors SET logo_url = ? WHERE brand_name = ?`,
        [fix.logoUrl, fix.brandName],
      );
      vendorReport.push({ brand: fix.brandName, status: 'fixed', old: current, new: fix.logoUrl });
    }

    // ─── PART B: Client logos ────────────────────────────────────────────────
    // For client rows that have a website URL but no logo URL, derive a
    // Google Favicons URL (128px). This never overwrites an existing logo.
    const clientResult = (await queryRunner.query(
      `
        UPDATE vendor_clients
        SET client_logo_url = CONCAT(
          'https://www.google.com/s2/favicons?domain=',
          SUBSTRING_INDEX(
            SUBSTRING_INDEX(
              REGEXP_REPLACE(client_website_url, '^https?://', ''),
              '/',
              1
            ),
            '?',
            1
          ),
          '&sz=128'
        )
        WHERE
          (client_logo_url IS NULL OR TRIM(client_logo_url) = '')
          AND client_website_url IS NOT NULL
          AND TRIM(client_website_url) <> ''
      `,
    )) as { affectedRows?: number };

    // ─── Report ──────────────────────────────────────────────────────────────
    console.log('\n=== fix-vendor-and-client-logos migration report ===\n');
    console.log('VENDOR LOGOS:');
    console.log('─────────────────────────────────────────────────────');
    for (const row of vendorReport) {
      if (row.status === 'fixed') {
        console.log(`  ✅ FIXED     ${row.brand}`);
        console.log(`               ${row.old ?? 'NULL'}`);
        console.log(`            → ${row.new}`);
      } else if (row.status === 'already_ok') {
        console.log(`  ✓  OK        ${row.brand}`);
      } else {
        console.log(`  ⚠️  NOT FOUND ${row.brand}`);
      }
    }

    const fixed = vendorReport.filter((r) => r.status === 'fixed').length;
    const ok = vendorReport.filter((r) => r.status === 'already_ok').length;
    const missing = vendorReport.filter((r) => r.status === 'not_found').length;
    console.log(`\n  Summary: ${fixed} fixed, ${ok} already correct, ${missing} not found`);

    console.log('\nCLIENT LOGOS:');
    console.log('─────────────────────────────────────────────────────');
    console.log(
      `  ✅ ${clientResult?.affectedRows ?? 0} client rows updated with Google Favicons URLs`,
    );
    console.log(
      `  ℹ  Clients without website_url remain NULL → frontend shows initials`,
    );
    console.log('\n===================================================\n');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore previous values is not possible without a backup.
    // Deliberately a no-op — re-run the prior migrations if needed.
    console.log(
      'FixVendorAndClientLogos20260430000000.down(): no-op. Re-run prior migrations to restore.',
    );
  }
}
