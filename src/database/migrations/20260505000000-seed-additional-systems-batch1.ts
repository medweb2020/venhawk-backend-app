import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Phase 2 Step 2 addendum — Seed 7 additional canonical systems (Batch 1)
 *
 * Adds systems that were UNRESOLVED or mis-mapped in the Step 4 dry-run:
 *   • NetApp                          — CDW tech stack (was UNRESOLVED)
 *   • VMware                          — CDW tech stack (was UNRESOLVED)
 *   • ServiceNow App Engine           — CDW tech stack (was UNRESOLVED)
 *   • ServiceNow IRM                  — Cognizant tech stack (was UNRESOLVED)
 *   • ServiceNow Workflow Data Fabric — Cognizant tech stack (was UNRESOLVED)
 *   • OpenAI API                      — Slalom tech stack (was UNRESOLVED)
 *   • Palo Alto Networks              — CDW tech stack (was mis-mapped to Cisco)
 *
 * All 7 canonical_name values exactly match the vendor tech stack tokens
 * so they resolve at Tier 1 (conf=1.0) with zero fuzzy or LLM involvement.
 *
 * PST Migration (Cloudficient) is intentionally NOT added — it is a
 * migration project type, not a product system (Phase 1 addendum decision).
 */
export class SeedAdditionalSystemsBatch120260505000000 implements MigrationInterface {
  name = 'SeedAdditionalSystemsBatch120260505000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Storage & Virtualisation ──────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('NetApp', 'NetApp', 'NetApp', 'cloud_infrastructure',
          '["netapp storage","netapp ontap","netapp cloud volumes","netapp all-flash"]'),
        ('VMware', 'VMware', 'Broadcom', 'cloud_infrastructure',
          '["vmware vsphere","vsphere","vmware cloud","vmware vcenter","vcenter","vmware virtualization"]')
    `);

    // ── ServiceNow — additional products ─────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('ServiceNow App Engine', 'ServiceNow', 'ServiceNow', 'enterprise_itsm',
          '["servicenow app engine studio","app engine studio","snow app engine","servicenow low-code"]'),
        ('ServiceNow IRM', 'ServiceNow', 'ServiceNow', 'enterprise_itsm',
          '["servicenow integrated risk management","servicenow risk management","snow irm","servicenow grc"]'),
        ('ServiceNow Workflow Data Fabric', 'ServiceNow', 'ServiceNow', 'enterprise_itsm',
          '["workflow data fabric","servicenow data fabric","snow workflow data fabric"]')
    `);

    // ── AI Platform ───────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('OpenAI API', 'OpenAI', 'OpenAI', 'other',
          '["openai","gpt api","gpt-4","chatgpt api","openai gpt","chatgpt"]')
    `);

    // ── Security ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Palo Alto Networks', 'Palo Alto Networks', 'Palo Alto Networks', 'security_network',
          '["palo alto","pan","palo alto firewall","palo alto prisma","cortex xdr","panorama"]')
    `);

    console.log('✅  7 additional canonical systems seeded (Batch 1)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM systems
      WHERE canonical_name IN (
        'NetApp',
        'VMware',
        'ServiceNow App Engine',
        'ServiceNow IRM',
        'ServiceNow Workflow Data Fabric',
        'OpenAI API',
        'Palo Alto Networks'
      )
    `);
    console.log('↩️  Batch 1 additional systems removed');
  }
}
