import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Phase 2 Step 1 — Systems taxonomy tables
 *
 * Creates:
 *   systems        — canonical system/product registry (76 rows seeded in Step 2)
 *   vendor_systems — join table replacing legal_tech_stack comma-string matching
 *
 * Does NOT touch the vendors.legal_tech_stack column.
 * That column is deprecated (not dropped) in Step 8.
 */
export class SystemsAndVendorSystemsTables20260504000000
  implements MigrationInterface
{
  name = 'SystemsAndVendorSystemsTables20260504000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── systems ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE systems (
        id              INT             NOT NULL AUTO_INCREMENT,
        canonical_name  VARCHAR(120)    NOT NULL,
        product_family  VARCHAR(80)     NOT NULL,
        vendor_owner    VARCHAR(80)         NULL
          COMMENT 'Software vendor that owns this product (e.g. Intapp, Microsoft)',
        category        ENUM(
                          'legal_practice_management',
                          'legal_dms',
                          'legal_billing',
                          'legal_crm',
                          'legal_compliance',
                          'cloud_infrastructure',
                          'enterprise_erp',
                          'enterprise_hcm',
                          'enterprise_crm',
                          'enterprise_itsm',
                          'data_analytics',
                          'collaboration',
                          'security_network',
                          'other'
                        ) NOT NULL DEFAULT 'other',
        aliases         JSON                NULL
          COMMENT 'Array of lowercase alias strings used for fuzzy/alias matching',
        is_active       TINYINT(1)      NOT NULL DEFAULT 1,
        created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                 ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        UNIQUE KEY uq_systems_canonical_name (canonical_name),
        KEY idx_systems_product_family (product_family),
        KEY idx_systems_category (category),
        KEY idx_systems_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        COMMENT='Canonical system/product taxonomy. Authoritative source for eligibility matching.'
    `);

    // ── vendor_systems ───────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE vendor_systems (
        vendor_id       INT             NOT NULL,
        system_id       INT             NOT NULL,
        proficiency     ENUM('supported','expert','certified','partner')
                                        NOT NULL DEFAULT 'supported',
        evidence_url    VARCHAR(500)        NULL
          COMMENT 'Partner page, case study, or other public evidence URL',
        created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (vendor_id, system_id),
        KEY idx_vendor_systems_system_id (system_id),

        CONSTRAINT fk_vs_vendor
          FOREIGN KEY (vendor_id) REFERENCES vendors(id)
          ON DELETE CASCADE,

        -- system_id: RESTRICT (not CASCADE) — systems are soft-deleted via is_active=0
        CONSTRAINT fk_vs_system
          FOREIGN KEY (system_id) REFERENCES systems(id)
          ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        COMMENT='Vendor to system support mapping. Replaces legal_tech_stack string matching.'
    `);

    console.log('✅  systems table created');
    console.log('✅  vendor_systems table created');
    console.log('    FK: vendor_systems.vendor_id → vendors.id  (CASCADE DELETE)');
    console.log('    FK: vendor_systems.system_id → systems.id  (RESTRICT DELETE)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop join table first (FK dependency)
    await queryRunner.query(`DROP TABLE IF EXISTS vendor_systems`);
    await queryRunner.query(`DROP TABLE IF EXISTS systems`);

    console.log('↩️  vendor_systems dropped');
    console.log('↩️  systems dropped');
    console.log('    legal_tech_stack column is untouched and remains authoritative');
  }
}
