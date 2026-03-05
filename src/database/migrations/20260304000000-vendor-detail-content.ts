import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { ensureForeignKey, ensureIndexByColumns } from './migration-utils';
import {
  ImportCaseStudy,
  ImportClient,
  ImportReview,
  VENDOR_CURATED_CONTENT_PAYLOAD,
} from './data/vendor-curated-content.data';

export class VendorDetailContent20260304000000 implements MigrationInterface {
  name = 'VendorDetailContent20260304000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.ensureVendorClientsTable(queryRunner);
    await this.ensureVendorCaseStudiesTable(queryRunner);
    await this.ensureVendorReviewsTable(queryRunner);

    await this.syncCuratedVendorDetailContent(queryRunner);
    await this.removeResidualDuplicates(queryRunner);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Data sync migration. Down intentionally left empty.
  }

  private async ensureVendorClientsTable(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('vendor_clients');

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: 'vendor_clients',
          columns: [
            {
              name: 'id',
              type: 'bigint',
              unsigned: true,
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'vendor_id', type: 'int', isNullable: false },
            { name: 'project_category_id', type: 'int', isNullable: true },
            { name: 'client_name', type: 'varchar', length: '160', isNullable: false },
            {
              name: 'client_logo_url',
              type: 'varchar',
              length: '700',
              isNullable: true,
            },
            {
              name: 'client_website_url',
              type: 'varchar',
              length: '700',
              isNullable: true,
            },
            {
              name: 'source_name',
              type: 'varchar',
              length: '80',
              isNullable: true,
            },
            {
              name: 'source_url',
              type: 'varchar',
              length: '700',
              isNullable: true,
            },
            {
              name: 'display_order',
              type: 'int',
              default: '0',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );
    }

    await ensureIndexByColumns(
      queryRunner,
      'vendor_clients',
      new TableIndex({
        name: 'idx_vendor_clients_vendor_project_order',
        columnNames: ['vendor_id', 'project_category_id', 'display_order'],
      }),
    );

    await ensureIndexByColumns(
      queryRunner,
      'vendor_clients',
      new TableIndex({
        name: 'idx_vendor_clients_vendor_project_name',
        columnNames: ['vendor_id', 'project_category_id', 'client_name'],
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'vendor_clients',
      new TableForeignKey({
        name: 'fk_vendor_clients_vendor',
        columnNames: ['vendor_id'],
        referencedTableName: 'vendors',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'vendor_clients',
      new TableForeignKey({
        name: 'fk_vendor_clients_project_category',
        columnNames: ['project_category_id'],
        referencedTableName: 'project_categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  private async ensureVendorCaseStudiesTable(
    queryRunner: QueryRunner,
  ): Promise<void> {
    const hasTable = await queryRunner.hasTable('vendor_case_studies');

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: 'vendor_case_studies',
          columns: [
            {
              name: 'id',
              type: 'bigint',
              unsigned: true,
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'vendor_id', type: 'int', isNullable: false },
            { name: 'project_category_id', type: 'int', isNullable: true },
            { name: 'title', type: 'varchar', length: '255', isNullable: false },
            { name: 'summary', type: 'text', isNullable: false },
            {
              name: 'study_url',
              type: 'varchar',
              length: '700',
              isNullable: true,
            },
            {
              name: 'source_name',
              type: 'varchar',
              length: '80',
              isNullable: true,
            },
            {
              name: 'source_url',
              type: 'varchar',
              length: '700',
              isNullable: true,
            },
            {
              name: 'display_order',
              type: 'int',
              default: '0',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );
    }

    await ensureIndexByColumns(
      queryRunner,
      'vendor_case_studies',
      new TableIndex({
        name: 'idx_vendor_case_studies_vendor_project_order',
        columnNames: ['vendor_id', 'project_category_id', 'display_order'],
      }),
    );

    await ensureIndexByColumns(
      queryRunner,
      'vendor_case_studies',
      new TableIndex({
        name: 'idx_vendor_case_studies_vendor_project_title',
        columnNames: ['vendor_id', 'project_category_id', 'title'],
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'vendor_case_studies',
      new TableForeignKey({
        name: 'fk_vendor_case_studies_vendor',
        columnNames: ['vendor_id'],
        referencedTableName: 'vendors',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'vendor_case_studies',
      new TableForeignKey({
        name: 'fk_vendor_case_studies_project_category',
        columnNames: ['project_category_id'],
        referencedTableName: 'project_categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  private async ensureVendorReviewsTable(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('vendor_reviews');

    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: 'vendor_reviews',
          columns: [
            {
              name: 'id',
              type: 'bigint',
              unsigned: true,
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'vendor_id', type: 'int', isNullable: false },
            { name: 'project_category_id', type: 'int', isNullable: true },
            { name: 'reviewer_name', type: 'varchar', length: '120', isNullable: false },
            {
              name: 'reviewer_role',
              type: 'varchar',
              length: '160',
              isNullable: true,
            },
            {
              name: 'headline',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            { name: 'review_text', type: 'text', isNullable: false },
            {
              name: 'rating',
              type: 'decimal',
              precision: 3,
              scale: 2,
              isNullable: true,
            },
            {
              name: 'review_source',
              type: 'varchar',
              length: '80',
              isNullable: true,
            },
            {
              name: 'review_url',
              type: 'varchar',
              length: '700',
              isNullable: true,
            },
            {
              name: 'published_at',
              type: 'date',
              isNullable: true,
            },
            {
              name: 'display_order',
              type: 'int',
              default: '0',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );
    }

    await ensureIndexByColumns(
      queryRunner,
      'vendor_reviews',
      new TableIndex({
        name: 'idx_vendor_reviews_vendor_project_order',
        columnNames: ['vendor_id', 'project_category_id', 'display_order'],
      }),
    );

    await ensureIndexByColumns(
      queryRunner,
      'vendor_reviews',
      new TableIndex({
        name: 'idx_vendor_reviews_vendor_source',
        columnNames: ['vendor_id', 'review_source'],
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'vendor_reviews',
      new TableForeignKey({
        name: 'fk_vendor_reviews_vendor',
        columnNames: ['vendor_id'],
        referencedTableName: 'vendors',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'vendor_reviews',
      new TableForeignKey({
        name: 'fk_vendor_reviews_project_category',
        columnNames: ['project_category_id'],
        referencedTableName: 'project_categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  private async syncCuratedVendorDetailContent(
    queryRunner: QueryRunner,
  ): Promise<void> {
    const vendors = (await queryRunner.query(
      `
        SELECT id, vendor_id, brand_name
        FROM vendors
      `,
    )) as Array<{ id: number; vendor_id: string; brand_name: string }>;

    const vendorByCode = new Map<string, number>();
    const vendorByBrand = new Map<string, number>();

    for (const vendor of vendors) {
      const code = this.cleanText(vendor.vendor_id).toLowerCase();
      const brand = this.normalizeKey(vendor.brand_name);

      if (code) {
        vendorByCode.set(code, Number(vendor.id));
      }
      if (brand) {
        vendorByBrand.set(brand, Number(vendor.id));
      }
    }

    for (const payload of VENDOR_CURATED_CONTENT_PAYLOAD) {
      const vendorId =
        vendorByCode.get(this.cleanText(payload.vendorCode).toLowerCase()) ||
        vendorByBrand.get(this.normalizeKey(payload.brandName));

      if (!vendorId) {
        continue;
      }

      await this.replaceVendorClients(queryRunner, vendorId, payload.clients);
      await this.replaceVendorCaseStudies(queryRunner, vendorId, payload.caseStudies);
      await this.replaceVendorReviews(queryRunner, vendorId, payload.reviews);
    }
  }

  private async replaceVendorClients(
    queryRunner: QueryRunner,
    vendorId: number,
    clients: ImportClient[],
  ): Promise<void> {
    const normalizedClients = this.uniqueBy(
      clients
        .map((client) => ({
          clientName: this.cleanText(client.clientName),
          clientLogoUrl: this.cleanUrl(client.clientLogoUrl),
          clientWebsiteUrl: this.cleanUrl(client.clientWebsiteUrl),
          sourceName: this.cleanText(client.sourceName),
          sourceUrl: this.cleanUrl(client.sourceUrl),
        }))
        .filter((client) => Boolean(client.clientName)),
      (client) => this.normalizeKey(client.clientName),
    ).slice(0, 5);

    await queryRunner.query(
      `
        DELETE FROM vendor_clients
        WHERE vendor_id = ?
      `,
      [vendorId],
    );

    for (let index = 0; index < normalizedClients.length; index += 1) {
      const client = normalizedClients[index];
      await queryRunner.query(
        `
          INSERT INTO vendor_clients (
            vendor_id,
            project_category_id,
            client_name,
            client_logo_url,
            client_website_url,
            source_name,
            source_url,
            display_order
          )
          VALUES (?, NULL, ?, ?, ?, ?, ?, ?)
        `,
        [
          vendorId,
          client.clientName,
          client.clientLogoUrl,
          client.clientWebsiteUrl,
          client.sourceName || null,
          client.sourceUrl || null,
          index,
        ],
      );
    }
  }

  private async replaceVendorCaseStudies(
    queryRunner: QueryRunner,
    vendorId: number,
    caseStudies: ImportCaseStudy[],
  ): Promise<void> {
    const normalizedCaseStudies = this.uniqueBy(
      caseStudies
        .map((caseStudy) => {
          const title = this.cleanText(caseStudy.title);
          const summary = this.cleanText(caseStudy.summary);

          return {
            title,
            summary: summary.length >= 10 ? summary : `${title}.`,
            studyUrl: this.cleanUrl(caseStudy.studyUrl),
            sourceName: this.cleanText(caseStudy.sourceName),
            sourceUrl: this.cleanUrl(caseStudy.sourceUrl),
          };
        })
        .filter((caseStudy) => Boolean(caseStudy.title)),
      (caseStudy) => this.normalizeKey(caseStudy.title),
    );

    await queryRunner.query(
      `
        DELETE FROM vendor_case_studies
        WHERE vendor_id = ?
      `,
      [vendorId],
    );

    for (let index = 0; index < normalizedCaseStudies.length; index += 1) {
      const caseStudy = normalizedCaseStudies[index];
      await queryRunner.query(
        `
          INSERT INTO vendor_case_studies (
            vendor_id,
            project_category_id,
            title,
            summary,
            study_url,
            source_name,
            source_url,
            display_order
          )
          VALUES (?, NULL, ?, ?, ?, ?, ?, ?)
        `,
        [
          vendorId,
          caseStudy.title,
          caseStudy.summary,
          caseStudy.studyUrl,
          caseStudy.sourceName || null,
          caseStudy.sourceUrl || null,
          index,
        ],
      );
    }
  }

  private async replaceVendorReviews(
    queryRunner: QueryRunner,
    vendorId: number,
    reviews: ImportReview[],
  ): Promise<void> {
    const normalizedReviews = this.uniqueBy(
      reviews
        .map((review) => ({
          reviewerName: this.cleanText(review.reviewerName),
          reviewerRole: this.cleanText(review.reviewerRole),
          headline: this.cleanText(review.headline),
          reviewText: this.cleanText(review.reviewText),
          rating: this.toNullableRating(review.rating),
          reviewSource: this.cleanText(review.reviewSource),
          reviewUrl: this.cleanUrl(review.reviewUrl),
          publishedAt: this.cleanDate(review.publishedAt),
        }))
        .filter((review) => Boolean(review.reviewerName) && Boolean(review.reviewText)),
      (review) =>
        `${this.normalizeKey(review.reviewerName)}::${this.normalizeKey(review.reviewText).slice(0, 180)}`,
    );

    await queryRunner.query(
      `
        DELETE FROM vendor_reviews
        WHERE vendor_id = ?
      `,
      [vendorId],
    );

    for (let index = 0; index < normalizedReviews.length; index += 1) {
      const review = normalizedReviews[index];
      await queryRunner.query(
        `
          INSERT INTO vendor_reviews (
            vendor_id,
            project_category_id,
            reviewer_name,
            reviewer_role,
            headline,
            review_text,
            rating,
            review_source,
            review_url,
            published_at,
            display_order
          )
          VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          vendorId,
          review.reviewerName,
          review.reviewerRole || null,
          review.headline || null,
          review.reviewText,
          review.rating,
          review.reviewSource || null,
          review.reviewUrl || null,
          review.publishedAt || null,
          index,
        ],
      );
    }
  }

  private async removeResidualDuplicates(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE vc
      FROM vendor_clients vc
      INNER JOIN (
        SELECT id
        FROM (
          SELECT
            id,
            ROW_NUMBER() OVER (
              PARTITION BY vendor_id, LOWER(TRIM(client_name))
              ORDER BY display_order ASC, id ASC
            ) AS row_num
          FROM vendor_clients
        ) ranked
        WHERE ranked.row_num > 1
      ) duplicate_rows ON duplicate_rows.id = vc.id
    `);

    await queryRunner.query(`
      DELETE vcs
      FROM vendor_case_studies vcs
      INNER JOIN (
        SELECT id
        FROM (
          SELECT
            id,
            ROW_NUMBER() OVER (
              PARTITION BY vendor_id, LOWER(TRIM(title))
              ORDER BY display_order ASC, id ASC
            ) AS row_num
          FROM vendor_case_studies
        ) ranked
        WHERE ranked.row_num > 1
      ) duplicate_rows ON duplicate_rows.id = vcs.id
    `);

    await queryRunner.query(`
      DELETE vr
      FROM vendor_reviews vr
      INNER JOIN (
        SELECT id
        FROM (
          SELECT
            id,
            ROW_NUMBER() OVER (
              PARTITION BY vendor_id, LOWER(TRIM(reviewer_name)), LEFT(LOWER(TRIM(review_text)), 180)
              ORDER BY display_order ASC, id ASC
            ) AS row_num
          FROM vendor_reviews
        ) ranked
        WHERE ranked.row_num > 1
      ) duplicate_rows ON duplicate_rows.id = vr.id
    `);
  }

  private cleanText(value: string | null | undefined): string {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private cleanUrl(value: string | null | undefined): string | null {
    const raw = this.cleanText(value);

    if (!raw) {
      return null;
    }

    const markdownMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(raw);
    const candidate = markdownMatch ? markdownMatch[2].trim() : raw;

    try {
      return new URL(candidate).toString();
    } catch {
      return null;
    }
  }

  private cleanDate(value: string | null | undefined): string | null {
    const raw = this.cleanText(value);
    if (!raw) {
      return null;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return null;
    }

    return raw;
  }

  private toNullableRating(value: number | null | undefined): number | null {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 5) {
      return null;
    }

    return Math.round(parsed * 100) / 100;
  }

  private normalizeKey(value: string): string {
    return this.cleanText(value)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private uniqueBy<T>(items: T[], keyGetter: (item: T) => string): T[] {
    const seen = new Set<string>();
    const output: T[] = [];

    for (const item of items) {
      const key = this.cleanText(keyGetter(item));
      if (!key || seen.has(key)) {
        continue;
      }

      seen.add(key);
      output.push(item);
    }

    return output;
  }
}
