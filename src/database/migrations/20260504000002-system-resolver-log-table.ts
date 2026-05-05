import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Phase 2 Step 3 — system_resolver_log table
 *
 * Records every Tier-4 (LLM) invocation from SystemResolverService.
 * Tiers 1-3 and 5 are not logged to DB (in-memory only).
 */
export class SystemResolverLogTable20260504000002 implements MigrationInterface {
  name = 'SystemResolverLogTable20260504000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE system_resolver_log (
        id              INT             NOT NULL AUTO_INCREMENT,
        input           VARCHAR(500)    NOT NULL
          COMMENT 'Raw user input string sent to the resolver',
        tier            TINYINT         NOT NULL
          COMMENT '1=exact 2=alias 3=fuzzy 4=llm 5=unresolved',
        resolved_system_id INT              NULL
          COMMENT 'FK to systems.id — NULL when unresolved',
        confidence      DECIMAL(4,3)        NULL
          COMMENT 'Resolution confidence 0.000–1.000',
        candidates_json JSON                NULL
          COMMENT 'Top candidates considered before LLM call',
        llm_reasoning   TEXT                NULL
          COMMENT 'Reasoning returned by LLM (Tier 4 only)',
        cached          TINYINT(1)      NOT NULL DEFAULT 0
          COMMENT '1 if result was served from in-memory cache',
        created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        KEY idx_srl_input       (input(100)),
        KEY idx_srl_tier        (tier),
        KEY idx_srl_resolved    (resolved_system_id),
        KEY idx_srl_created_at  (created_at),

        CONSTRAINT fk_srl_system
          FOREIGN KEY (resolved_system_id) REFERENCES systems(id)
          ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        COMMENT='Audit log for Tier-4 LLM invocations in SystemResolverService'
    `);

    console.log('✅  system_resolver_log table created');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS system_resolver_log`);
    console.log('↩️  system_resolver_log dropped');
  }
}
