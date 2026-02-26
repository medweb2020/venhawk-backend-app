import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import {
  addColumnIfMissing,
  assertColumnsExist,
  ensureForeignKey,
  ensureIndexByColumns,
  ensureUniqueByColumns,
} from './migration-utils';

async function ensureVendorPartnerColumns(queryRunner: QueryRunner): Promise<void> {
  await addColumnIfMissing(
    queryRunner,
    'vendors',
    new TableColumn({
      name: 'ilta_present',
      type: 'boolean',
      isNullable: false,
      default: '0',
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'vendors',
    new TableColumn({
      name: 'is_microsoft_partner',
      type: 'boolean',
      isNullable: false,
      default: '0',
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'vendors',
    new TableColumn({
      name: 'is_servicenow_partner',
      type: 'boolean',
      isNullable: false,
      default: '0',
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'vendors',
    new TableColumn({
      name: 'is_workday_partner',
      type: 'boolean',
      isNullable: false,
      default: '0',
    }),
  );
}

async function ensureProjectVendorMatchesTable(
  queryRunner: QueryRunner,
): Promise<void> {
  const hasMatchTable = await queryRunner.hasTable('project_vendor_matches');
  if (!hasMatchTable) {
    await queryRunner.createTable(
      new Table({
        name: 'project_vendor_matches',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'project_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'vendor_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'rank_position',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'raw_score',
            type: 'decimal',
            precision: 6,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'display_score',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'score_breakdown_json',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'scoring_version',
            type: 'varchar',
            length: '32',
            default: "'v1'",
            isNullable: false,
          },
          {
            name: 'computed_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'fk_project_vendor_matches_project',
            columnNames: ['project_id'],
            referencedTableName: 'projects',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'fk_project_vendor_matches_vendor',
            columnNames: ['vendor_id'],
            referencedTableName: 'vendors',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'uq_project_vendor_matches_project_vendor',
            columnNames: ['project_id', 'vendor_id'],
          },
        ],
        indices: [
          {
            name: 'idx_project_vendor_matches_project_rank',
            columnNames: ['project_id', 'rank_position'],
          },
          {
            name: 'idx_project_vendor_matches_computed_at',
            columnNames: ['computed_at'],
          },
        ],
      }),
    );
    return;
  }

  await assertColumnsExist(queryRunner, 'project_vendor_matches', [
    'id',
    'project_id',
    'vendor_id',
  ]);

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_matches',
    new TableColumn({
      name: 'rank_position',
      type: 'int',
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_matches',
    new TableColumn({
      name: 'raw_score',
      type: 'decimal',
      precision: 6,
      scale: 2,
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_matches',
    new TableColumn({
      name: 'display_score',
      type: 'int',
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_matches',
    new TableColumn({
      name: 'score_breakdown_json',
      type: 'json',
      isNullable: true,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_matches',
    new TableColumn({
      name: 'scoring_version',
      type: 'varchar',
      length: '32',
      default: "'v1'",
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_matches',
    new TableColumn({
      name: 'computed_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_matches',
    new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_matches',
    new TableColumn({
      name: 'updated_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
      isNullable: false,
    }),
  );

  await ensureUniqueByColumns(
    queryRunner,
    'project_vendor_matches',
    'uq_project_vendor_matches_project_vendor',
    ['project_id', 'vendor_id'],
  );

  await ensureIndexByColumns(
    queryRunner,
    'project_vendor_matches',
    new TableIndex({
      name: 'idx_project_vendor_matches_project_rank',
      columnNames: ['project_id', 'rank_position'],
    }),
  );

  await ensureIndexByColumns(
    queryRunner,
    'project_vendor_matches',
    new TableIndex({
      name: 'idx_project_vendor_matches_computed_at',
      columnNames: ['computed_at'],
    }),
  );

  await ensureForeignKey(
    queryRunner,
    'project_vendor_matches',
    new TableForeignKey({
      name: 'fk_project_vendor_matches_project',
      columnNames: ['project_id'],
      referencedTableName: 'projects',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }),
  );

  await ensureForeignKey(
    queryRunner,
    'project_vendor_matches',
    new TableForeignKey({
      name: 'fk_project_vendor_matches_vendor',
      columnNames: ['vendor_id'],
      referencedTableName: 'vendors',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }),
  );
}

async function ensureProjectVendorReasonsTable(
  queryRunner: QueryRunner,
): Promise<void> {
  const hasReasonTable = await queryRunner.hasTable('project_vendor_reasons');
  if (!hasReasonTable) {
    await queryRunner.createTable(
      new Table({
        name: 'project_vendor_reasons',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'project_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'vendor_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'reason_text',
            type: 'varchar',
            length: '420',
            isNullable: false,
          },
          {
            name: 'reason_source',
            type: 'varchar',
            length: '16',
            default: "'fallback'",
            isNullable: false,
          },
          {
            name: 'context_hash',
            type: 'char',
            length: '40',
            isNullable: false,
          },
          {
            name: 'model',
            type: 'varchar',
            length: '64',
            isNullable: true,
          },
          {
            name: 'computed_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'fk_project_vendor_reasons_project',
            columnNames: ['project_id'],
            referencedTableName: 'projects',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'fk_project_vendor_reasons_vendor',
            columnNames: ['vendor_id'],
            referencedTableName: 'vendors',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'uq_project_vendor_reasons_project_vendor',
            columnNames: ['project_id', 'vendor_id'],
          },
        ],
        indices: [
          {
            name: 'idx_project_vendor_reasons_project_updated',
            columnNames: ['project_id', 'updated_at'],
          },
        ],
      }),
    );
    return;
  }

  await assertColumnsExist(queryRunner, 'project_vendor_reasons', [
    'id',
    'project_id',
    'vendor_id',
  ]);

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_reasons',
    new TableColumn({
      name: 'reason_text',
      type: 'varchar',
      length: '420',
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_reasons',
    new TableColumn({
      name: 'reason_source',
      type: 'varchar',
      length: '16',
      default: "'fallback'",
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_reasons',
    new TableColumn({
      name: 'context_hash',
      type: 'char',
      length: '40',
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_reasons',
    new TableColumn({
      name: 'model',
      type: 'varchar',
      length: '64',
      isNullable: true,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_reasons',
    new TableColumn({
      name: 'computed_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_reasons',
    new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      isNullable: false,
    }),
  );

  await addColumnIfMissing(
    queryRunner,
    'project_vendor_reasons',
    new TableColumn({
      name: 'updated_at',
      type: 'timestamp',
      default: 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
      isNullable: false,
    }),
  );

  await ensureUniqueByColumns(
    queryRunner,
    'project_vendor_reasons',
    'uq_project_vendor_reasons_project_vendor',
    ['project_id', 'vendor_id'],
  );

  await ensureIndexByColumns(
    queryRunner,
    'project_vendor_reasons',
    new TableIndex({
      name: 'idx_project_vendor_reasons_project_updated',
      columnNames: ['project_id', 'updated_at'],
    }),
  );

  await ensureForeignKey(
    queryRunner,
    'project_vendor_reasons',
    new TableForeignKey({
      name: 'fk_project_vendor_reasons_project',
      columnNames: ['project_id'],
      referencedTableName: 'projects',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }),
  );

  await ensureForeignKey(
    queryRunner,
    'project_vendor_reasons',
    new TableForeignKey({
      name: 'fk_project_vendor_reasons_vendor',
      columnNames: ['vendor_id'],
      referencedTableName: 'vendors',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }),
  );
}

export class RecommendationSchemaHardening20260226120000
  implements MigrationInterface
{
  name = 'RecommendationSchemaHardening20260226120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await ensureVendorPartnerColumns(queryRunner);
    await ensureProjectVendorMatchesTable(queryRunner);
    await ensureProjectVendorReasonsTable(queryRunner);
  }

  public async down(): Promise<void> {
    // No-op: hardening migrations are intentionally non-destructive.
  }
}
