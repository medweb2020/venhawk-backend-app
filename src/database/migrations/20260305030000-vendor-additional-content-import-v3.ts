import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  AdditionalImportCaseStudy,
  AdditionalImportClient,
  AdditionalImportReview,
} from './data/vendor-additional-content-20260305010000.data';
import { VENDOR_ADDITIONAL_CONTENT_20260305030000 } from './data/vendor-additional-content-20260305030000.data';

type NormalizedClient = {
  clientName: string;
  clientLogoUrl: string | null;
  clientWebsiteUrl: string | null;
  sourceName: string;
  sourceUrl: string | null;
};

type NormalizedCaseStudy = {
  title: string;
  summary: string;
  studyUrl: string | null;
  sourceName: string;
  sourceUrl: string | null;
};

type NormalizedReview = {
  reviewerName: string;
  reviewerRole: string;
  headline: string;
  reviewText: string;
  rating: number | null;
  reviewSource: string;
  reviewUrl: string | null;
  publishedAt: string | null;
};

type ExistingClientRow = {
  id: number;
  client_name: string;
  client_logo_url: string | null;
  client_website_url: string | null;
  source_name: string | null;
  source_url: string | null;
};

type ExistingCaseStudyRow = {
  id: number;
  title: string;
  summary: string;
  study_url: string | null;
  source_name: string | null;
  source_url: string | null;
};

type ExistingReviewRow = {
  id: number;
  reviewer_name: string;
  reviewer_role: string | null;
  headline: string | null;
  review_text: string;
  rating: number | null;
  review_source: string | null;
  review_url: string | null;
  published_at: string | null;
};

export class VendorAdditionalContentImport20260305030000
  implements MigrationInterface
{
  name = 'VendorAdditionalContentImport20260305030000';

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

    for (const payload of VENDOR_ADDITIONAL_CONTENT_20260305030000) {
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
    const normalizedClients = this.normalizeIncomingClients(clients);
    if (normalizedClients.length === 0) {
      return;
    }

    const existingRows = (await queryRunner.query(
      `
        SELECT id, client_name, client_logo_url, client_website_url, source_name, source_url
        FROM vendor_clients
        WHERE vendor_id = ?
      `,
      [vendorId],
    )) as ExistingClientRow[];

    const existingByName = new Map<string, ExistingClientRow>();
    const existingByWebsite = new Map<string, ExistingClientRow>();

    for (const row of existingRows) {
      const nameKey = this.normalizeKey(row.client_name);
      if (nameKey && !existingByName.has(nameKey)) {
        existingByName.set(nameKey, row);
      }

      const websiteKey = this.normalizeUrlKey(row.client_website_url);
      if (websiteKey && !existingByWebsite.has(websiteKey)) {
        existingByWebsite.set(websiteKey, row);
      }
    }

    let nextDisplayOrder = await this.getNextDisplayOrder(
      queryRunner,
      'vendor_clients',
      vendorId,
    );

    for (const client of normalizedClients) {
      const nameKey = this.normalizeKey(client.clientName);
      const websiteKey = this.normalizeUrlKey(client.clientWebsiteUrl);

      const existing =
        existingByName.get(nameKey) ||
        (websiteKey ? existingByWebsite.get(websiteKey) : undefined);

      if (existing) {
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

        // Keep in-memory keys current for subsequent items in the same run.
        const mergedWebsite =
          client.clientWebsiteUrl || existing.client_website_url || null;
        if (nameKey) {
          existingByName.set(nameKey, {
            ...existing,
            client_name: client.clientName,
            client_website_url: mergedWebsite,
          });
        }
        const mergedWebsiteKey = this.normalizeUrlKey(mergedWebsite);
        if (mergedWebsiteKey) {
          existingByWebsite.set(mergedWebsiteKey, {
            ...existing,
            client_name: client.clientName,
            client_website_url: mergedWebsite,
          });
        }

        continue;
      }

      const insertResult = await queryRunner.query(
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

      const insertedId = Number(insertResult?.insertId || 0);
      const insertedRow: ExistingClientRow = {
        id: insertedId,
        client_name: client.clientName,
        client_logo_url: client.clientLogoUrl,
        client_website_url: client.clientWebsiteUrl,
        source_name: client.sourceName || null,
        source_url: client.sourceUrl || null,
      };

      if (nameKey) {
        existingByName.set(nameKey, insertedRow);
      }
      if (websiteKey) {
        existingByWebsite.set(websiteKey, insertedRow);
      }

      nextDisplayOrder += 1;
    }
  }

  private async upsertCaseStudies(
    queryRunner: QueryRunner,
    vendorId: number,
    caseStudies: AdditionalImportCaseStudy[],
  ): Promise<void> {
    const normalizedCaseStudies = this.normalizeIncomingCaseStudies(caseStudies);
    if (normalizedCaseStudies.length === 0) {
      return;
    }

    const existingRows = (await queryRunner.query(
      `
        SELECT id, title, summary, study_url, source_name, source_url
        FROM vendor_case_studies
        WHERE vendor_id = ?
      `,
      [vendorId],
    )) as ExistingCaseStudyRow[];

    const existingByTitle = new Map<string, ExistingCaseStudyRow>();

    for (const row of existingRows) {
      const titleKey = this.normalizeKey(row.title);
      if (titleKey && !existingByTitle.has(titleKey)) {
        existingByTitle.set(titleKey, row);
      }
    }

    let nextDisplayOrder = await this.getNextDisplayOrder(
      queryRunner,
      'vendor_case_studies',
      vendorId,
    );

    for (const caseStudy of normalizedCaseStudies) {
      const titleKey = this.normalizeKey(caseStudy.title);

      const existing = existingByTitle.get(titleKey);

      if (existing) {
        await queryRunner.query(
          `
            UPDATE vendor_case_studies
            SET
              title = ?,
              summary = ?,
              study_url = ?,
              source_name = ?,
              source_url = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [
            caseStudy.title || existing.title,
            caseStudy.summary || existing.summary,
            caseStudy.studyUrl || existing.study_url || null,
            caseStudy.sourceName || existing.source_name || null,
            caseStudy.sourceUrl || existing.source_url || null,
            existing.id,
          ],
        );

        const mergedRow: ExistingCaseStudyRow = {
          ...existing,
          title: caseStudy.title || existing.title,
          summary: caseStudy.summary || existing.summary,
          study_url: caseStudy.studyUrl || existing.study_url || null,
          source_name: caseStudy.sourceName || existing.source_name || null,
          source_url: caseStudy.sourceUrl || existing.source_url || null,
        };

        const mergedTitleKey = this.normalizeKey(mergedRow.title);

        if (mergedTitleKey) {
          existingByTitle.set(mergedTitleKey, mergedRow);
        }

        continue;
      }

      const insertResult = await queryRunner.query(
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

      const insertedId = Number(insertResult?.insertId || 0);
      const insertedRow: ExistingCaseStudyRow = {
        id: insertedId,
        title: caseStudy.title,
        summary: caseStudy.summary,
        study_url: caseStudy.studyUrl,
        source_name: caseStudy.sourceName || null,
        source_url: caseStudy.sourceUrl || null,
      };

      if (titleKey) {
        existingByTitle.set(titleKey, insertedRow);
      }

      nextDisplayOrder += 1;
    }
  }

  private async upsertReviews(
    queryRunner: QueryRunner,
    vendorId: number,
    reviews: AdditionalImportReview[],
  ): Promise<void> {
    const normalizedReviews = this.normalizeIncomingReviews(reviews);
    if (normalizedReviews.length === 0) {
      return;
    }

    const existingRows = (await queryRunner.query(
      `
        SELECT id, reviewer_name, reviewer_role, headline, review_text, rating, review_source, review_url, published_at
        FROM vendor_reviews
        WHERE vendor_id = ?
      `,
      [vendorId],
    )) as ExistingReviewRow[];

    const existingByKey = new Map<string, ExistingReviewRow>();
    for (const row of existingRows) {
      for (const key of this.reviewMatchKeys({
        reviewerName: row.reviewer_name,
        headline: row.headline || '',
        reviewText: row.review_text,
        reviewUrl: row.review_url,
      })) {
        if (!existingByKey.has(key)) {
          existingByKey.set(key, row);
        }
      }
    }

    let nextDisplayOrder = await this.getNextDisplayOrder(
      queryRunner,
      'vendor_reviews',
      vendorId,
    );

    for (const review of normalizedReviews) {
      const keys = this.reviewMatchKeys(review);
      const existing = keys
        .map((key) => existingByKey.get(key))
        .find((row): row is ExistingReviewRow => Boolean(row));

      if (existing) {
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

        const mergedRow: ExistingReviewRow = {
          ...existing,
          reviewer_role: review.reviewerRole || existing.reviewer_role || null,
          headline: review.headline || existing.headline || null,
          rating: review.rating ?? existing.rating ?? null,
          review_source: review.reviewSource || existing.review_source || null,
          review_url: review.reviewUrl || existing.review_url || null,
          published_at: review.publishedAt || existing.published_at || null,
        };

        for (const key of this.reviewMatchKeys({
          reviewerName: mergedRow.reviewer_name,
          headline: mergedRow.headline || '',
          reviewText: mergedRow.review_text,
          reviewUrl: mergedRow.review_url,
        })) {
          existingByKey.set(key, mergedRow);
        }

        continue;
      }

      const insertResult = await queryRunner.query(
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

      const insertedId = Number(insertResult?.insertId || 0);
      const insertedRow: ExistingReviewRow = {
        id: insertedId,
        reviewer_name: review.reviewerName,
        reviewer_role: review.reviewerRole || null,
        headline: review.headline || null,
        review_text: review.reviewText,
        rating: review.rating,
        review_source: review.reviewSource || null,
        review_url: review.reviewUrl || null,
        published_at: review.publishedAt || null,
      };

      for (const key of keys) {
        existingByKey.set(key, insertedRow);
      }

      nextDisplayOrder += 1;
    }
  }

  private normalizeIncomingClients(
    clients: AdditionalImportClient[],
  ): NormalizedClient[] {
    const byKey = new Map<string, NormalizedClient>();

    for (const client of clients) {
      const normalized: NormalizedClient = {
        clientName: this.cleanText(client.clientName),
        clientLogoUrl: this.cleanUrl(client.clientLogoUrl),
        clientWebsiteUrl: this.cleanUrl(client.clientWebsiteUrl),
        sourceName: this.cleanText(client.sourceName),
        sourceUrl: this.cleanUrl(client.sourceUrl),
      };

      if (!normalized.clientName) {
        continue;
      }

      const key = this.normalizeKey(normalized.clientName);
      const existing = byKey.get(key);

      if (existing) {
        byKey.set(key, {
          clientName: existing.clientName.length >= normalized.clientName.length
            ? existing.clientName
            : normalized.clientName,
          clientLogoUrl: existing.clientLogoUrl || normalized.clientLogoUrl,
          clientWebsiteUrl:
            existing.clientWebsiteUrl || normalized.clientWebsiteUrl,
          sourceName: existing.sourceName || normalized.sourceName,
          sourceUrl: existing.sourceUrl || normalized.sourceUrl,
        });
        continue;
      }

      byKey.set(key, normalized);
    }

    return Array.from(byKey.values());
  }

  private normalizeIncomingCaseStudies(
    caseStudies: AdditionalImportCaseStudy[],
  ): NormalizedCaseStudy[] {
    const byKey = new Map<string, NormalizedCaseStudy>();

    for (const caseStudy of caseStudies) {
      const title = this.cleanText(caseStudy.title);
      const summary = this.cleanText(caseStudy.summary);
      const studyUrl = this.cleanUrl(caseStudy.studyUrl);
      const sourceUrl = this.cleanUrl(caseStudy.sourceUrl);

      if (!title) {
        continue;
      }

      const normalized: NormalizedCaseStudy = {
        title,
        summary: summary.length >= 12 ? summary : `${title}.`,
        studyUrl,
        sourceName: this.cleanText(caseStudy.sourceName),
        sourceUrl,
      };

      const key = this.normalizeCaseStudyKey(normalized);
      const existing = byKey.get(key);

      if (existing) {
        byKey.set(key, {
          title: existing.title.length >= normalized.title.length
            ? existing.title
            : normalized.title,
          summary:
            existing.summary.length >= normalized.summary.length
              ? existing.summary
              : normalized.summary,
          studyUrl: existing.studyUrl || normalized.studyUrl,
          sourceName: existing.sourceName || normalized.sourceName,
          sourceUrl: existing.sourceUrl || normalized.sourceUrl,
        });
        continue;
      }

      byKey.set(key, normalized);
    }

    return Array.from(byKey.values());
  }

  private normalizeIncomingReviews(
    reviews: AdditionalImportReview[],
  ): NormalizedReview[] {
    const byKey = new Map<string, number>();
    const output: NormalizedReview[] = [];

    for (const review of reviews) {
      const normalized: NormalizedReview = {
        reviewerName: this.cleanText(review.reviewerName),
        reviewerRole: this.cleanText(review.reviewerRole),
        headline: this.cleanText(review.headline),
        reviewText: this.cleanText(review.reviewText),
        rating: this.toNullableRating(review.rating),
        reviewSource: this.cleanText(review.reviewSource),
        reviewUrl: this.cleanUrl(review.reviewUrl),
        publishedAt: this.cleanDate(review.publishedAt),
      };

      if (!normalized.reviewerName || !normalized.reviewText) {
        continue;
      }

      const keys = this.reviewMatchKeys(normalized);
      const existingIndex = keys
        .map((key) => byKey.get(key))
        .find((index): index is number => index !== undefined);

      if (existingIndex !== undefined) {
        output[existingIndex] = this.mergeReviews(output[existingIndex], normalized);
        for (const key of this.reviewMatchKeys(output[existingIndex])) {
          byKey.set(key, existingIndex);
        }
        continue;
      }

      const index = output.length;
      output.push(normalized);
      for (const key of keys) {
        byKey.set(key, index);
      }
    }

    return output;
  }

  private mergeReviews(
    left: NormalizedReview,
    right: NormalizedReview,
  ): NormalizedReview {
    return {
      reviewerName:
        left.reviewerName.length >= right.reviewerName.length
          ? left.reviewerName
          : right.reviewerName,
      reviewerRole: left.reviewerRole || right.reviewerRole,
      headline: left.headline || right.headline,
      reviewText:
        left.reviewText.length >= right.reviewText.length
          ? left.reviewText
          : right.reviewText,
      rating: left.rating ?? right.rating ?? null,
      reviewSource: left.reviewSource || right.reviewSource,
      reviewUrl: left.reviewUrl || right.reviewUrl,
      publishedAt: left.publishedAt || right.publishedAt,
    };
  }

  private reviewMatchKeys(review: {
    reviewerName: string;
    headline: string;
    reviewText: string;
    reviewUrl: string | null;
  }): string[] {
    const reviewerKey = this.normalizeKey(review.reviewerName);
    const headlineKey = this.normalizeKey(review.headline || '');
    const textKey = this.normalizeKey(review.reviewText).slice(0, 220);
    const urlKey = this.normalizeUrlKey(review.reviewUrl);

    const keys = [`name-text::${reviewerKey}::${textKey}`];

    if (urlKey) {
      keys.push(`url-name::${urlKey}::${reviewerKey}`);
      if (headlineKey) {
        keys.push(`url-headline::${urlKey}::${headlineKey}`);
      }
    }

    return keys;
  }

  private normalizeCaseStudyKey(caseStudy: { title: string }): string {
    return `title::${this.normalizeKey(caseStudy.title)}`;
  }

  private async getNextDisplayOrder(
    queryRunner: QueryRunner,
    tableName: 'vendor_clients' | 'vendor_case_studies' | 'vendor_reviews',
    vendorId: number,
  ): Promise<number> {
    const [{ max_order: maxOrderRaw }] = (await queryRunner.query(
      `
        SELECT COALESCE(MAX(display_order), -1) AS max_order
        FROM ${tableName}
        WHERE vendor_id = ?
      `,
      [vendorId],
    )) as Array<{ max_order: number }>;

    return Number(maxOrderRaw) + 1;
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

  private normalizeUrlKey(value: string | null | undefined): string {
    const cleaned = this.cleanUrl(value);

    if (!cleaned) {
      return '';
    }

    return cleaned.replace(/\/+$/, '').toLowerCase();
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
}
