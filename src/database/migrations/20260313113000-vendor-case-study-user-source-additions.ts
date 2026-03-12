import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  VENDOR_CASE_STUDY_USER_SOURCE_ADDITIONS_20260313113000,
} from './data/vendor-case-study-user-source-additions-20260313113000.data';

type VendorRow = {
  id: number;
  vendor_id: string;
};

type ExistingCaseStudyRow = {
  title: string;
  study_url: string | null;
  display_order: number;
};

export class VendorCaseStudyUserSourceAdditions20260313113000
  implements MigrationInterface
{
  name = 'VendorCaseStudyUserSourceAdditions20260313113000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const vendorRows = (await queryRunner.query(
      `
        SELECT id, vendor_id
        FROM vendors
      `,
    )) as VendorRow[];

    const vendorDbIdByUuid = new Map<string, number>();
    for (const row of vendorRows) {
      vendorDbIdByUuid.set(row.vendor_id, Number(row.id));
    }

    for (const vendorSeed of VENDOR_CASE_STUDY_USER_SOURCE_ADDITIONS_20260313113000) {
      const vendorId = vendorDbIdByUuid.get(vendorSeed.vendorUuid);
      if (!vendorId) {
        continue;
      }

      const existingRows = (await queryRunner.query(
        `
          SELECT title, study_url, display_order
          FROM vendor_case_studies
          WHERE vendor_id = ?
        `,
        [vendorId],
      )) as ExistingCaseStudyRow[];

      const existingTitles = new Set(
        existingRows
          .map((row) => this.normalizeText(row.title))
          .filter((value) => Boolean(value)),
      );
      const existingUrls = new Set(
        existingRows
          .map((row) => this.normalizeUrl(row.study_url))
          .filter((value) => Boolean(value)),
      );
      let nextOrder = existingRows.reduce(
        (max, row) => Math.max(max, Number(row.display_order ?? 0) + 1),
        0,
      );

      for (const caseStudy of vendorSeed.caseStudies) {
        const title = caseStudy.title.trim();
        const summary = caseStudy.summary.trim();
        const studyUrl = this.normalizeUrl(caseStudy.studyUrl);
        const sourceName = caseStudy.sourceName.trim();
        const sourceUrl = this.normalizeUrl(caseStudy.sourceUrl);
        const normalizedTitle = this.normalizeText(title);

        if (!title || !summary || !sourceName || !sourceUrl || !normalizedTitle) {
          continue;
        }

        if (existingTitles.has(normalizedTitle)) {
          continue;
        }

        if (studyUrl && existingUrls.has(studyUrl)) {
          continue;
        }

        const insertResult = (await queryRunner.query(
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
            SELECT ?, NULL, ?, ?, ?, ?, ?, ?
            WHERE NOT EXISTS (
              SELECT 1
              FROM vendor_case_studies vcs
              WHERE vcs.vendor_id = ?
                AND (
                  LOWER(TRIM(vcs.title)) = LOWER(TRIM(?))
                  OR (? IS NOT NULL AND TRIM(?) <> '' AND TRIM(vcs.study_url) = ?)
                )
            )
          `,
          [
            vendorId,
            title,
            summary,
            studyUrl,
            sourceName,
            sourceUrl,
            nextOrder,
            vendorId,
            title,
            studyUrl,
            studyUrl,
            studyUrl,
          ],
        )) as { affectedRows?: number };

        if ((insertResult?.affectedRows ?? 0) > 0) {
          existingTitles.add(normalizedTitle);
          if (studyUrl) {
            existingUrls.add(studyUrl);
          }
          nextOrder += 1;
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const vendorSeed of VENDOR_CASE_STUDY_USER_SOURCE_ADDITIONS_20260313113000) {
      for (const caseStudy of vendorSeed.caseStudies) {
        const studyUrl = this.normalizeUrl(caseStudy.studyUrl);
        const sourceUrl = this.normalizeUrl(caseStudy.sourceUrl);

        await queryRunner.query(
          `
            DELETE vcs
            FROM vendor_case_studies vcs
            INNER JOIN vendors v ON v.id = vcs.vendor_id
            WHERE v.vendor_id = ?
              AND LOWER(TRIM(vcs.title)) = LOWER(TRIM(?))
              AND (
                (? IS NULL AND vcs.study_url IS NULL) OR TRIM(COALESCE(vcs.study_url, '')) = TRIM(COALESCE(?, ''))
              )
              AND vcs.source_name = ?
              AND TRIM(COALESCE(vcs.source_url, '')) = TRIM(?)
          `,
          [
            vendorSeed.vendorUuid,
            caseStudy.title,
            studyUrl,
            studyUrl,
            caseStudy.sourceName.trim(),
            sourceUrl,
          ],
        );
      }
    }
  }

  private normalizeText(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  private normalizeUrl(value: string | null | undefined): string | null {
    const trimmed = (value ?? '').trim();
    if (!trimmed) {
      return null;
    }

    const markdownMatch = trimmed.match(/^\[[^\]]*\]\((.+)\)$/);
    const url = (markdownMatch?.[1] ?? trimmed).trim();
    return url || null;
  }
}
