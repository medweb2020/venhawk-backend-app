import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  AdditionalImportCaseStudy,
  AdditionalImportClient,
  AdditionalImportReview,
  VENDOR_ADDITIONAL_CONTENT_20260305010000,
} from './data/vendor-additional-content-20260305010000.data';

export class VendorAdditionalContentImport20260305010000
  implements MigrationInterface
{
  name = 'VendorAdditionalContentImport20260305010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const vendorRows = (await queryRunner.query(
      `
        SELECT id, vendor_id, brand_name
        FROM vendors
      `,
    )) as Array<{ id: number; vendor_id: string; brand_name: string }>;

    const vendorByBrand = new Map<string, number>();
    const vendorByCode = new Map<string, number>();

    for (const vendorRow of vendorRows) {
      const brandKey = this.normalizeKey(vendorRow.brand_name);
      const codeKey = this.cleanText(vendorRow.vendor_id).toLowerCase();

      if (brandKey) {
        vendorByBrand.set(brandKey, Number(vendorRow.id));
      }
      if (codeKey) {
        vendorByCode.set(codeKey, Number(vendorRow.id));
      }
    }

    for (const payload of VENDOR_ADDITIONAL_CONTENT_20260305010000) {
      const vendorId =
        vendorByCode.get(this.cleanText(payload.vendorCode).toLowerCase()) ||
        vendorByBrand.get(this.normalizeKey(payload.brandName));

      if (!vendorId) {
        continue;
      }

      await this.upsertClients(queryRunner, vendorId, payload.clients);
      await this.upsertCaseStudies(queryRunner, vendorId, payload.caseStudies);
      await this.upsertReviews(queryRunner, vendorId, payload.reviews);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Curated additive import. Down intentionally left empty.
  }

  private async upsertClients(
    queryRunner: QueryRunner,
    vendorId: number,
    clients: AdditionalImportClient[],
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
    );

    if (normalizedClients.length === 0) {
      return;
    }

    const [{ max_order: maxOrderRaw }] = (await queryRunner.query(
      `
        SELECT COALESCE(MAX(display_order), -1) AS max_order
        FROM vendor_clients
        WHERE vendor_id = ?
      `,
      [vendorId],
    )) as Array<{ max_order: number }>;

    let nextDisplayOrder = Number(maxOrderRaw) + 1;

    for (const client of normalizedClients) {
      const existingRows = (await queryRunner.query(
        `
          SELECT id, client_logo_url, client_website_url, source_name, source_url
          FROM vendor_clients
          WHERE vendor_id = ?
            AND LOWER(TRIM(client_name)) = LOWER(TRIM(?))
          LIMIT 1
        `,
        [vendorId, client.clientName],
      )) as Array<{
        id: number;
        client_logo_url: string | null;
        client_website_url: string | null;
        source_name: string | null;
        source_url: string | null;
      }>;

      if (existingRows[0]) {
        const existing = existingRows[0];
        await queryRunner.query(
          `
            UPDATE vendor_clients
            SET
              client_logo_url = ?,
              client_website_url = ?,
              source_name = ?,
              source_url = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [
            client.clientLogoUrl || existing.client_logo_url || null,
            client.clientWebsiteUrl || existing.client_website_url || null,
            client.sourceName || existing.source_name || null,
            client.sourceUrl || existing.source_url || null,
            existing.id,
          ],
        );
        continue;
      }

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
          nextDisplayOrder,
        ],
      );

      nextDisplayOrder += 1;
    }
  }

  private async upsertCaseStudies(
    queryRunner: QueryRunner,
    vendorId: number,
    caseStudies: AdditionalImportCaseStudy[],
  ): Promise<void> {
    const normalizedCaseStudies = this.uniqueBy(
      caseStudies
        .map((study) => {
          const title = this.cleanText(study.title);
          const summary = this.cleanText(study.summary);

          return {
            title,
            summary: summary.length >= 12 ? summary : `${title}.`,
            studyUrl: this.cleanUrl(study.studyUrl),
            sourceName: this.cleanText(study.sourceName),
            sourceUrl: this.cleanUrl(study.sourceUrl),
          };
        })
        .filter((study) => Boolean(study.title)),
      (study) => this.normalizeKey(study.title),
    );

    if (normalizedCaseStudies.length === 0) {
      return;
    }

    const [{ max_order: maxOrderRaw }] = (await queryRunner.query(
      `
        SELECT COALESCE(MAX(display_order), -1) AS max_order
        FROM vendor_case_studies
        WHERE vendor_id = ?
      `,
      [vendorId],
    )) as Array<{ max_order: number }>;

    let nextDisplayOrder = Number(maxOrderRaw) + 1;

    for (const caseStudy of normalizedCaseStudies) {
      const existingRows = (await queryRunner.query(
        `
          SELECT id, summary, study_url, source_name, source_url
          FROM vendor_case_studies
          WHERE vendor_id = ?
            AND LOWER(TRIM(title)) = LOWER(TRIM(?))
          LIMIT 1
        `,
        [vendorId, caseStudy.title],
      )) as Array<{
        id: number;
        summary: string;
        study_url: string | null;
        source_name: string | null;
        source_url: string | null;
      }>;

      if (existingRows[0]) {
        const existing = existingRows[0];
        await queryRunner.query(
          `
            UPDATE vendor_case_studies
            SET
              summary = ?,
              study_url = ?,
              source_name = ?,
              source_url = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [
            caseStudy.summary || existing.summary,
            caseStudy.studyUrl || existing.study_url || null,
            caseStudy.sourceName || existing.source_name || null,
            caseStudy.sourceUrl || existing.source_url || null,
            existing.id,
          ],
        );
        continue;
      }

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
          nextDisplayOrder,
        ],
      );

      nextDisplayOrder += 1;
    }
  }

  private async upsertReviews(
    queryRunner: QueryRunner,
    vendorId: number,
    reviews: AdditionalImportReview[],
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
        .filter(
          (review) => Boolean(review.reviewerName) && Boolean(review.reviewText),
        ),
      (review) =>
        `${this.normalizeKey(review.reviewerName)}::${this.normalizeKey(review.reviewText).slice(0, 180)}`,
    );

    if (normalizedReviews.length === 0) {
      return;
    }

    const [{ max_order: maxOrderRaw }] = (await queryRunner.query(
      `
        SELECT COALESCE(MAX(display_order), -1) AS max_order
        FROM vendor_reviews
        WHERE vendor_id = ?
      `,
      [vendorId],
    )) as Array<{ max_order: number }>;

    let nextDisplayOrder = Number(maxOrderRaw) + 1;

    for (const review of normalizedReviews) {
      const existingRows = (await queryRunner.query(
        `
          SELECT id, reviewer_role, headline, rating, review_source, review_url, published_at
          FROM vendor_reviews
          WHERE vendor_id = ?
            AND LOWER(TRIM(reviewer_name)) = LOWER(TRIM(?))
            AND LOWER(TRIM(review_text)) = LOWER(TRIM(?))
          LIMIT 1
        `,
        [vendorId, review.reviewerName, review.reviewText],
      )) as Array<{
        id: number;
        reviewer_role: string | null;
        headline: string | null;
        rating: number | null;
        review_source: string | null;
        review_url: string | null;
        published_at: string | null;
      }>;

      if (existingRows[0]) {
        const existing = existingRows[0];
        await queryRunner.query(
          `
            UPDATE vendor_reviews
            SET
              reviewer_role = ?,
              headline = ?,
              rating = ?,
              review_source = ?,
              review_url = ?,
              published_at = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [
            review.reviewerRole || existing.reviewer_role || null,
            review.headline || existing.headline || null,
            review.rating ?? existing.rating ?? null,
            review.reviewSource || existing.review_source || null,
            review.reviewUrl || existing.review_url || null,
            review.publishedAt || existing.published_at || null,
            existing.id,
          ],
        );
        continue;
      }

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
          nextDisplayOrder,
        ],
      );

      nextDisplayOrder += 1;
    }
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
