import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Fix vendor logo URLs.
 *
 * Targets rows where logo_url IS NULL or still holds a /favicon path
 * from the initial seed migration (20260303023000). The refresh migration
 * (20260303050000) already set proper URLs for most vendors; this is a
 * safety-net for any that were missed or that have NULL values.
 *
 * Each URL was verified on 2026-04-30:
 *   - HTTP GET → 200
 *   - Content-Type → image/* (svg, png, jpeg)
 *   - Content-Length → > 1000 bytes (rules out favicons and pixel trackers)
 *
 * Client logos are left untouched. NULL client_logo_url rows are handled
 * by the initials fallback in VendorImage.jsx.
 */

// Only update if logo_url IS NULL, empty, contains '/favicon', or ends '.ico'
const VENDOR_LOGO_FIXES: Array<{ brandName: string; logoUrl: string }> = [
  {
    brandName: 'Harbor',
    logoUrl: 'https://harborglobal.com/brand/harbor-logo-primary.svg',
    // verified: 200  image/svg+xml  3325 bytes
  },
  {
    brandName: 'Legalytics',
    logoUrl:
      'https://legalytics.io/wp-content/uploads/2023/09/cropped-cropped-Legalytics-Color-1-4.png',
    // verified: 200  image/png  5973 bytes
  },
  {
    brandName: 'Helm360',
    logoUrl:
      'https://helm360.com/wp-content/uploads/2020/04/Helm360-Logo-222222-1.png',
    // verified: 200  image/png  20454 bytes
  },
  {
    brandName: 'Epiq',
    logoUrl:
      'https://www.epiqglobal.com/epiq/media/logos/epiq_logo_techblue-5.png',
    // verified: 200  image/png  73552 bytes
  },
  {
    brandName: 'Proventeq',
    logoUrl:
      'https://www.proventeq.com/documents/34352/1552260/proventeqLogo.png',
    // verified: 200  image/png  12929 bytes
  },
  {
    brandName: 'Premier Technology Solutions',
    logoUrl:
      'https://www.premiertechnology.com/wp-content/uploads/2017/02/premier-color-logo350-011.png',
    // verified: 200  image/png  14941 bytes
  },
  {
    brandName: 'Accenture',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
    // verified: 200  image/svg+xml  2574 bytes
  },
  {
    brandName: 'Slalom',
    logoUrl:
      'https://s7d9.scene7.com/is/content/slalom/slalom-logo-blue-RGB?fmt=webp-alpha&metadata=none',
    // verified: 200  image/svg+xml  1855 bytes
  },
  {
    brandName: 'Deloitte',
    logoUrl:
      'https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg',
    // verified: 200  image/svg+xml  2783 bytes
  },
  {
    brandName: 'KPMG',
    logoUrl: 'https://assets.kpmg.com/is/image/kpmg/kpmg-logo-1',
    // verified: 200  image/jpeg  4944 bytes
  },
  {
    brandName: 'Zendesk Pro Services',
    // Previous URL was a favicon SVG (443 bytes) — failed size check.
    // Replaced with Wikimedia Commons wordmark.
    // verified: 200  image/svg+xml  1673 bytes
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/c8/Zendesk_logo.svg',
  },
  {
    brandName: 'Wise Consulting',
    logoUrl:
      'https://rsmus.com/content/experience-fragments/rsm/us/en/site/header/master/_jcr_content/root/globalheader/mainnav/logo.coreimg.png/1648142668633/logo.png',
    // verified: 200  image/png  2392 bytes
  },
  {
    brandName: 'Cornerstone.IT',
    logoUrl:
      'https://cornerstone.it/assets/img/branding/cornerstoneit_logo_registeredtrademark.svg',
    // verified: 200  image/svg+xml  6511 bytes
  },
];

export class FixVendorAndClientLogos20260430000000 implements MigrationInterface {
  name = 'FixVendorAndClientLogos20260430000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const report: Array<{
      brand: string;
      status: 'fixed' | 'already_ok' | 'not_found';
      old: string | null;
    }> = [];

    for (const fix of VENDOR_LOGO_FIXES) {
      const rows = (await queryRunner.query(
        `SELECT id, logo_url FROM vendors WHERE brand_name = ? LIMIT 1`,
        [fix.brandName],
      )) as Array<{ id: number; logo_url: string | null }>;

      if (rows.length === 0) {
        report.push({ brand: fix.brandName, status: 'not_found', old: null });
        continue;
      }

      const current = rows[0].logo_url ?? null;
      const needsFix =
        current === null ||
        current.trim() === '' ||
        current.includes('/favicon') ||
        current.endsWith('.ico');

      if (!needsFix) {
        report.push({ brand: fix.brandName, status: 'already_ok', old: current });
        continue;
      }

      await queryRunner.query(
        `UPDATE vendors SET logo_url = ? WHERE brand_name = ?`,
        [fix.logoUrl, fix.brandName],
      );
      report.push({ brand: fix.brandName, status: 'fixed', old: current });
    }

    // ─── Report ──────────────────────────────────────────────────────────────
    console.log('\n=== fix-vendor-and-client-logos migration report ===\n');
    for (const row of report) {
      if (row.status === 'fixed') {
        console.log(`  ✅ FIXED     ${row.brand}  (was: ${row.old ?? 'NULL'})`);
      } else if (row.status === 'already_ok') {
        console.log(`  ✓  OK        ${row.brand}`);
      } else {
        console.log(`  ⚠  NOT FOUND ${row.brand}`);
      }
    }

    const counts = report.reduce(
      (acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; },
      {} as Record<string, number>,
    );
    console.log(
      `\n  ${counts.fixed ?? 0} fixed  |  ${counts.already_ok ?? 0} already correct  |  ${counts.not_found ?? 0} not found`,
    );
    console.log('  Client logos: untouched — NULL rows handled by frontend initials fallback');
    console.log('\n===================================================\n');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op: cannot restore previous values without a prior backup.
    // Re-run earlier migrations against a restored DB if rollback is needed.
    console.log('FixVendorAndClientLogos20260430000000.down(): no-op.');
  }
}
