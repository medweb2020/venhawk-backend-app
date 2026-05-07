import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class RecommendationReasoningCache20260507000000
  implements MigrationInterface
{
  name = 'RecommendationReasoningCache20260507000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop-if-exists guard: handles partially-created table from a failed run
    await queryRunner.query(
      `DROP TABLE IF EXISTS recommendation_reasoning_cache`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'recommendation_reasoning_cache',
        columns: [
          {
            name: 'id',
            type: 'int',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            // projects.id is BIGINT UNSIGNED — must match exactly
            name: 'project_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
          },
          {
            // vendors.id is INT (signed) — must match exactly
            name: 'vendor_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'reasoning',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'model_used',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'vendor_rank',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'generated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'expires_at',
            type: 'datetime',
            isNullable: false,
          },
        ],
        indices: [
          {
            name: 'uq_project_vendor',
            columnNames: ['project_id', 'vendor_id'],
            isUnique: true,
          },
          {
            name: 'idx_expires_at',
            columnNames: ['expires_at'],
          },
        ],
        foreignKeys: [
          {
            name: 'fk_rrc_project',
            columnNames: ['project_id'],
            referencedTableName: 'projects',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'fk_rrc_vendor',
            columnNames: ['vendor_id'],
            referencedTableName: 'vendors',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recommendation_reasoning_cache', true);
  }
}
