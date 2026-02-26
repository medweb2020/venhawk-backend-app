import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import {
  addColumnIfMissing,
  dropColumnIfExists,
} from './migration-utils';

export class VendorListingColumns20260219000000
  implements MigrationInterface
{
  name = 'VendorListingColumns20260219000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await addColumnIfMissing(
      queryRunner,
      'vendors',
      new TableColumn({
        name: 'logo_url',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );

    await addColumnIfMissing(
      queryRunner,
      'vendors',
      new TableColumn({
        name: 'listing_order',
        type: 'int',
        isNullable: true,
      }),
    );

    await addColumnIfMissing(
      queryRunner,
      'vendors',
      new TableColumn({
        name: 'listing_description',
        type: 'text',
        isNullable: true,
      }),
    );

    await addColumnIfMissing(
      queryRunner,
      'vendors',
      new TableColumn({
        name: 'listing_specialty',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );

    await addColumnIfMissing(
      queryRunner,
      'vendors',
      new TableColumn({
        name: 'listing_tier',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropColumnIfExists(queryRunner, 'vendors', 'listing_tier');
    await dropColumnIfExists(queryRunner, 'vendors', 'listing_specialty');
    await dropColumnIfExists(queryRunner, 'vendors', 'listing_description');
    await dropColumnIfExists(queryRunner, 'vendors', 'listing_order');
    await dropColumnIfExists(queryRunner, 'vendors', 'logo_url');
  }
}
