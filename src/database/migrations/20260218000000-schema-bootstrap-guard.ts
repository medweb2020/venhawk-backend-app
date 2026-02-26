import { MigrationInterface, QueryRunner } from 'typeorm';

const REQUIRED_BASE_TABLES = [
  'users',
  'client_industries',
  'project_categories',
  'projects',
  'project_files',
  'vendors',
];

export class SchemaBootstrapGuard20260218000000 implements MigrationInterface {
  name = 'SchemaBootstrapGuard20260218000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const missing: string[] = [];

    for (const tableName of REQUIRED_BASE_TABLES) {
      const exists = await queryRunner.hasTable(tableName);
      if (!exists) {
        missing.push(tableName);
      }
    }

    if (missing.length === 0) {
      return;
    }

    const missingList = missing.join(', ');
    if (missing.length === REQUIRED_BASE_TABLES.length) {
      throw new Error(
        `Database is not bootstrapped. Missing base tables: ${missingList}. ` +
          `Initialize base schema once (for example via database/schema.sql), then rerun migrations.`,
      );
    }

    throw new Error(
      `Database schema is partially initialized. Missing base tables: ${missingList}. ` +
        `Repair the base schema before running incremental migrations.`,
    );
  }

  public async down(): Promise<void> {
    // No-op: this migration is a schema safety guard.
  }
}
