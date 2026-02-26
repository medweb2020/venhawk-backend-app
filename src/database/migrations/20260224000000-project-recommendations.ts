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
  dropColumnIfExists,
  ensureForeignKey,
  ensureIndexByColumns,
  ensureUniqueByColumns,
} from './migration-utils';

export class ProjectRecommendations20260224000000
  implements MigrationInterface
{
  name = 'ProjectRecommendations20260224000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasMatchTable = await queryRunner.hasTable('project_vendor_matches');
    if (hasMatchTable) {
      await queryRunner.dropTable('project_vendor_matches');
    }

    await dropColumnIfExists(queryRunner, 'vendors', 'is_workday_partner');
    await dropColumnIfExists(queryRunner, 'vendors', 'is_servicenow_partner');
    await dropColumnIfExists(queryRunner, 'vendors', 'is_microsoft_partner');
    await dropColumnIfExists(queryRunner, 'vendors', 'ilta_present');
  }
}
