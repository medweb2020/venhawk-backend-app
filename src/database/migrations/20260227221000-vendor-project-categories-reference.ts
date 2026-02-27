import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import {
  ensureForeignKey,
  ensureIndexByColumns,
  ensureUniqueByColumns,
} from './migration-utils';

type VendorCategoryReference = {
  vendorBrandName: string;
  projectCategoryValue: string;
};

const VENDOR_CATEGORY_REFERENCES: VendorCategoryReference[] = [
  {
    vendorBrandName: 'Thomson Reuters',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'TitanFile',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'LexisNexis',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Inoutsource',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'eSentio Technologies',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'RBRO',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Stone Consulting',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    projectCategoryValue: 'legal-apps',
  },
  {
    vendorBrandName: 'Element Technologies',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Helient Systems',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Cloudficient',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'Adastra',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'CloudForce',
    projectCategoryValue: 'cloud-migration',
  },
  {
    vendorBrandName: 'CDW',
    projectCategoryValue: 'enterprise-it',
  },
  {
    vendorBrandName: 'Cognizant',
    projectCategoryValue: 'enterprise-it',
  },
  {
    vendorBrandName: 'AAC Consulting',
    projectCategoryValue: 'app-bug-fixes',
  },
];

export class VendorProjectCategoriesReference20260227221000
  implements MigrationInterface
{
  name = 'VendorProjectCategoriesReference20260227221000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('vendor_project_categories');
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: 'vendor_project_categories',
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
              name: 'vendor_id',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'project_category_id',
              type: 'int',
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
        }),
      );
    }

    await ensureUniqueByColumns(
      queryRunner,
      'vendor_project_categories',
      'uq_vendor_project_categories_vendor_category',
      ['vendor_id', 'project_category_id'],
    );

    await ensureIndexByColumns(
      queryRunner,
      'vendor_project_categories',
      new TableIndex({
        name: 'idx_vendor_project_categories_category_vendor',
        columnNames: ['project_category_id', 'vendor_id'],
      }),
    );

    await ensureIndexByColumns(
      queryRunner,
      'vendor_project_categories',
      new TableIndex({
        name: 'idx_vendor_project_categories_vendor',
        columnNames: ['vendor_id'],
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'vendor_project_categories',
      new TableForeignKey({
        name: 'fk_vendor_project_categories_vendor',
        columnNames: ['vendor_id'],
        referencedTableName: 'vendors',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'vendor_project_categories',
      new TableForeignKey({
        name: 'fk_vendor_project_categories_project_category',
        columnNames: ['project_category_id'],
        referencedTableName: 'project_categories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    for (const reference of VENDOR_CATEGORY_REFERENCES) {
      await queryRunner.query(
        `
          INSERT IGNORE INTO vendor_project_categories (
            vendor_id,
            project_category_id,
            created_at,
            updated_at
          )
          SELECT
            v.id,
            pc.id,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          FROM vendors v
          INNER JOIN project_categories pc ON pc.value = ?
          WHERE v.brand_name = ?
        `,
        [reference.projectCategoryValue, reference.vendorBrandName],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('vendor_project_categories');
    if (hasTable) {
      await queryRunner.dropTable('vendor_project_categories');
    }
  }
}
