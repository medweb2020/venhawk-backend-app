import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  VENDOR_CASE_STUDY_EXPANSION_20260312213000,
} from './data/vendor-case-study-expansion-20260312213000.data';

type VendorRow = {
  id: number;
  vendor_id: string;
};

type ExistingCaseStudyRow = {
  title: string;
  study_url: string | null;
  display_order: number;
};

export class VendorCaseStudyExpansion20260312213000
  implements MigrationInterface
{
  name = 'VendorCaseStudyExpansion20260312213000';

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

    const vendorState = new Map<
      number,
      {
        titles: Set<string>;
        urls: Set<string>;
        nextOrder: number;
      }
    >();

    for (const vendorSeed of VENDOR_CASE_STUDY_EXPANSION_20260312213000) {
      const vendorId = vendorDbIdByUuid.get(vendorSeed.vendorUuid);
      if (!vendorId) {
        continue;
      }

      let state = vendorState.get(vendorId);
      if (!state) {
        const existingRows = (await queryRunner.query(
          `
            SELECT title, study_url, display_order
            FROM vendor_case_studies
            WHERE vendor_id = ?
          `,
          [vendorId],
        )) as ExistingCaseStudyRow[];

        const titles = new Set<string>();
        const urls = new Set<string>();
        let nextOrder = 0;

        for (const row of existingRows) {
          const normalizedTitle = this.normalizeText(row.title);
          if (normalizedTitle) {
            titles.add(normalizedTitle);
          }

          const normalizedUrl = this.normalizeUrl(row.study_url);
          if (normalizedUrl) {
            urls.add(normalizedUrl);
          }

          nextOrder = Math.max(nextOrder, Number(row.display_order ?? 0) + 1);
        }

        state = { titles, urls, nextOrder };
        vendorState.set(vendorId, state);
      }

      for (const caseStudy of vendorSeed.caseStudies) {
        const title = caseStudy.title.trim();
        const summary = caseStudy.summary.trim();
        const studyUrl = this.normalizeUrl(caseStudy.studyUrl);
        const sourceUrl = this.normalizeUrl(caseStudy.sourceUrl);
        const sourceName = caseStudy.sourceName.trim();
        const normalizedTitle = this.normalizeText(title);

        if (!title || !summary || !sourceName || !sourceUrl || !normalizedTitle) {
          continue;
        }

        if (state.titles.has(normalizedTitle)) {
          continue;
        }

        if (studyUrl && state.urls.has(studyUrl)) {
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
            state.nextOrder,
            vendorId,
            title,
            studyUrl,
            studyUrl,
            studyUrl,
          ],
        )) as { affectedRows?: number };

        if ((insertResult?.affectedRows ?? 0) > 0) {
          state.titles.add(normalizedTitle);
          if (studyUrl) {
            state.urls.add(studyUrl);
          }
          state.nextOrder += 1;
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const vendorSeed of VENDOR_CASE_STUDY_EXPANSION_20260312213000) {
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
