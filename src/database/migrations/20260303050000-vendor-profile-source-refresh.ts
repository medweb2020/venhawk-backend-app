import { MigrationInterface, QueryRunner } from 'typeorm';

type VendorUpdate = {
  brandName: string;
  fields: Record<string, string | number | null>;
};

const VERIFIED_DATE = '2026-03-03';

const VENDOR_UPDATES: VendorUpdate[] = [
  {
    brandName: 'Kraft Kennedy',
    fields: {
      min_project_size_usd: 5000,
      pricing_signal_notes:
        'Clutch lists minimum project size $5,000+ and average hourly rate $200 - $300; profile currently shows not yet reviewed.',
    },
  },
  {
    brandName: 'AAC Consulting',
    fields: {
      min_project_size_usd: 5000,
      rating_source_1: 'Clutch',
      rating_1: null,
      review_count_1: 0,
      rating_url_1: 'https://clutch.co/profile/aac-consulting',
      pricing_signal_notes:
        'Clutch lists minimum project size $5,000+ and average hourly rate $100 - $149; profile currently shows not yet reviewed.',
    },
  },
  {
    brandName: 'Element Technologies',
    fields: {
      min_project_size_usd: 10000,
      rating_source_1: 'Clutch',
      rating_1: null,
      review_count_1: 0,
      rating_url_1: 'https://clutch.co/profile/element-technologies-0',
      pricing_signal_notes:
        'Clutch lists minimum project size $10,000+ and average hourly rate $100 - $149; profile currently shows not yet reviewed.',
    },
  },
  {
    brandName: 'Helient Systems',
    fields: {
      min_project_size_usd: 5000,
      rating_source_1: 'Clutch',
      rating_1: null,
      review_count_1: 0,
      rating_url_1: 'https://clutch.co/profile/helient-systems',
      pricing_signal_notes:
        'Clutch lists minimum project size $5,000+ and average hourly rate $150 - $199; profile currently shows not yet reviewed.',
    },
  },
  {
    brandName: 'Cornerstone.IT',
    fields: {
      logo_url:
        'https://cornerstone.it/assets/img/branding/cornerstoneit_logo_registeredtrademark.svg',
      pricing_signal_notes:
        'Clutch lists minimum project size as undisclosed and profile currently shows not yet reviewed.',
    },
  },
  {
    brandName: 'Harbor',
    fields: {
      logo_url: 'https://harborglobal.com/brand/harbor-logo-primary.svg',
    },
  },
  {
    brandName: 'Legalytics',
    fields: {
      logo_url:
        'https://legalytics.io/wp-content/uploads/2023/09/cropped-cropped-Legalytics-Color-1-4.png',
      rating_source_1: 'Clutch',
      rating_1: null,
      review_count_1: 0,
      rating_url_1: 'https://clutch.co/profile/legalytics',
      pricing_signal_notes:
        'Clutch lists minimum project size as undisclosed and average hourly rate $100 - $149; profile currently shows not yet reviewed.',
    },
  },
  {
    brandName: 'Helm360',
    fields: {
      logo_url:
        'https://helm360.com/wp-content/uploads/2020/04/Helm360-Logo-222222-1.png',
      min_project_size_usd: 10000,
      typical_duration_weeks_min: 4,
      typical_duration_weeks_max: 12,
      rating_source_1: 'Clutch',
      rating_1: 4.8,
      review_count_1: 2,
      rating_url_1: 'https://clutch.co/profile/helm360',
      pricing_signal_notes:
        'Clutch lists minimum project size $10,000+, average hourly rate $100 - $149, and average project length 1 - 3 months.',
    },
  },
  {
    brandName: 'Epiq',
    fields: {
      logo_url: 'https://www.epiqglobal.com/epiq/media/logos/epiq_logo_techblue-5.png',
      min_project_size_usd: 5000,
      typical_duration_weeks_min: 12,
      typical_duration_weeks_max: 20,
      rating_source_2: 'Clutch',
      rating_2: 4.9,
      review_count_2: 6,
      rating_url_2: 'https://clutch.co/profile/epiq-systems',
      pricing_signal_notes:
        'Clutch lists minimum project size $5,000+, average hourly rate $150 - $199, and average project length 3 - 5 months.',
    },
  },
  {
    brandName: 'Proventeq',
    fields: {
      logo_url: 'https://www.proventeq.com/documents/34352/1552260/proventeqLogo.png',
      rating_source_1: 'Clutch',
      rating_1: null,
      review_count_1: 0,
      rating_url_1: 'https://clutch.co/profile/proventeq',
      pricing_signal_notes:
        'Clutch lists minimum project size and average hourly rate as undisclosed; profile currently shows not yet reviewed.',
    },
  },
  {
    brandName: 'Premier Technology Solutions',
    fields: {
      logo_url:
        'https://www.premiertechnology.com/wp-content/uploads/2017/02/premier-color-logo350-011.png',
    },
  },
  {
    brandName: 'Accenture',
    fields: {
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
      min_project_size_usd: 250000,
      typical_duration_weeks_min: 40,
      typical_duration_weeks_max: null,
      rating_source_2: 'Clutch',
      rating_2: 4.8,
      review_count_2: 47,
      rating_url_2: 'https://clutch.co/profile/accenture',
      pricing_signal_notes:
        'Clutch lists minimum project size $250,000+, average hourly rate $200 - $300, and average project length 10+ months.',
    },
  },
  {
    brandName: 'Slalom',
    fields: {
      logo_url:
        'https://s7d9.scene7.com/is/content/slalom/slalom-logo-blue-RGB?fmt=webp-alpha&metadata=none',
      min_project_size_usd: 100000,
      typical_duration_weeks_min: 24,
      typical_duration_weeks_max: 36,
      rating_source_2: 'Clutch',
      rating_2: 4.9,
      review_count_2: 40,
      rating_url_2: 'https://clutch.co/profile/slalom',
      pricing_signal_notes:
        'Clutch lists minimum project size $100,000+, average hourly rate $200 - $300, and average project length 6 - 9 months.',
    },
  },
  {
    brandName: 'Deloitte',
    fields: {
      logo_url:
        'https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg',
      rating_url_1:
        'https://www.g2.com/sellers/deloitte-1892d7ca-a0ef-44d1-8ef5-cf9f02fb77b4',
      pricing_signal_notes:
        'Clutch lists minimum project size as undisclosed and profile currently shows not yet reviewed.',
    },
  },
  {
    brandName: 'KPMG',
    fields: {
      logo_url: 'https://assets.kpmg.com/is/image/kpmg/kpmg-logo-1',
      min_project_size_usd: 50000,
      rating_source_1: 'G2',
      rating_1: 4.2,
      review_count_1: 22,
      rating_url_1: 'https://www.g2.com/sellers/kpmg',
      rating_source_2: 'Clutch',
      rating_2: 4.8,
      review_count_2: 2,
      rating_url_2: 'https://clutch.co/profile/kpmg',
      proof_link_2: 'https://www.g2.com/sellers/kpmg',
      pricing_signal_notes:
        'Clutch lists minimum project size $50,000+ and average hourly rate $300+.',
    },
  },
  {
    brandName: 'Zendesk Pro Services',
    fields: {
      logo_url:
        'https://d1eipm3vz40hy0.cloudfront.net/images/logos/favicons/zendesk-icon.svg',
      rating_source_1: 'G2',
      rating_1: 4.2,
      review_count_1: 7056,
      rating_url_1: 'https://www.g2.com/sellers/zendesk',
    },
  },
  {
    brandName: 'Wise Consulting',
    fields: {
      logo_url:
        'https://rsmus.com/content/experience-fragments/rsm/us/en/site/header/master/_jcr_content/root/globalheader/mainnav/logo.coreimg.png/1648142668633/logo.png',
      rating_source_1: 'G2',
      rating_1: 4.3,
      review_count_1: 37,
      rating_url_1: 'https://www.g2.com/sellers/rsm-us-llp',
      proof_link_3: 'https://www.g2.com/sellers/rsm-us-llp',
    },
  },
];

export class VendorProfileSourceRefresh20260303050000
  implements MigrationInterface
{
  name = 'VendorProfileSourceRefresh20260303050000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const update of VENDOR_UPDATES) {
      const entries = Object.entries(update.fields);
      if (entries.length === 0) {
        continue;
      }

      const setClause = entries
        .map(([column]) => `\`${column}\` = ?`)
        .join(', ');
      const values = entries.map(([, value]) => value);

      await queryRunner.query(
        `
          UPDATE vendors
          SET ${setClause},
              last_verified_date = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE brand_name = ?
        `,
        [...values, VERIFIED_DATE, update.brandName],
      );
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Snapshot correction migration. Down intentionally left empty.
  }
}
