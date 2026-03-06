import { MigrationInterface, QueryRunner } from 'typeorm';

type ClientWebsiteAndLogoFill = {
  vendorBrandName: string;
  clientName: string;
  clientWebsiteUrl: string;
  clientLogoUrl: string;
};

const CLIENT_WEBSITE_AND_LOGO_FILLS: ClientWebsiteAndLogoFill[] = [
  {
    vendorBrandName: 'AAC Consulting',
    clientName: 'Gerber Ciano Kelly Brady LLP',
    clientWebsiteUrl: 'https://gerberciano.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/gerberciano.com.ico',
  },
  {
    vendorBrandName: 'Accenture',
    clientName: 'Uber',
    clientWebsiteUrl: 'https://www.uber.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.uber.com.ico',
  },
  {
    vendorBrandName: 'Adastra',
    clientName: 'Kooperativa',
    clientWebsiteUrl: 'https://www.koop.cz/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.koop.cz.ico',
  },
  {
    vendorBrandName: 'Adastra',
    clientName: 'UNIQA',
    clientWebsiteUrl: 'https://www.uniqa.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.uniqa.com.ico',
  },
  {
    vendorBrandName: 'CDW',
    clientName: 'Stockport NHS Foundation Trust',
    clientWebsiteUrl: 'https://www.stockport.nhs.uk/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.stockport.nhs.uk.ico',
  },
  {
    vendorBrandName: 'CDW',
    clientName: 'Stonegate Group',
    clientWebsiteUrl: 'https://www.stonegategroup.co.uk/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.stonegategroup.co.uk.ico',
  },
  {
    vendorBrandName: 'CDW',
    clientName: 'The Ryder Cup 2023',
    clientWebsiteUrl: 'https://www.rydercup.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.rydercup.com.ico',
  },
  {
    vendorBrandName: 'CloudForce',
    clientName: "Prince George's Community College",
    clientWebsiteUrl: 'https://www.pgcc.edu/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.pgcc.edu.ico',
  },
  {
    vendorBrandName: 'CloudForce',
    clientName: 'UCLA Anderson School of Management',
    clientWebsiteUrl: 'https://www.anderson.ucla.edu/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.anderson.ucla.edu.ico',
  },
  {
    vendorBrandName: 'Cornerstone.IT',
    clientName: 'Bond, Schoeneck & King',
    clientWebsiteUrl: 'https://www.bsk.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.bsk.com.ico',
  },
  {
    vendorBrandName: 'Deloitte',
    clientName: 'BHP',
    clientWebsiteUrl: 'https://www.bhp.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.bhp.com.ico',
  },
  {
    vendorBrandName: 'Element Technologies',
    clientName: 'Kimball, Tirey & St. John',
    clientWebsiteUrl: 'https://www.kts-law.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.kts-law.com.ico',
  },
  {
    vendorBrandName: 'Element Technologies',
    clientName: 'Meritage Homes',
    clientWebsiteUrl: 'https://www.meritagehomes.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.meritagehomes.com.ico',
  },
  {
    vendorBrandName: 'Element Technologies',
    clientName: 'WatchGuard',
    clientWebsiteUrl: 'https://www.watchguard.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.watchguard.com.ico',
  },
  {
    vendorBrandName: 'Epiq',
    clientName: 'McDonald Hopkins LLC',
    clientWebsiteUrl: 'https://www.mcdonaldhopkins.com/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.mcdonaldhopkins.com.ico',
  },
  {
    vendorBrandName: 'Harbor',
    clientName: 'Hewlett Packard Enterprise',
    clientWebsiteUrl: 'https://www.hpe.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.hpe.com.ico',
  },
  {
    vendorBrandName: 'Harbor',
    clientName: 'Trowers & Hamlins',
    clientWebsiteUrl: 'https://www.trowers.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.trowers.com.ico',
  },
  {
    vendorBrandName: 'Helient Systems',
    clientName: 'Obermayer Rebmann Maxwell & Hippel LLP',
    clientWebsiteUrl: 'https://www.obermayer.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.obermayer.com.ico',
  },
  {
    vendorBrandName: 'Helm360',
    clientName: 'Leigh Day',
    clientWebsiteUrl: 'https://www.leighday.co.uk/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.leighday.co.uk.ico',
  },
  {
    vendorBrandName: 'Inoutsource',
    clientName: 'Baker Botts',
    clientWebsiteUrl: 'https://www.bakerbotts.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.bakerbotts.com.ico',
  },
  {
    vendorBrandName: 'KPMG',
    clientName: 'HP',
    clientWebsiteUrl: 'https://www.hp.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.hp.com.ico',
  },
  {
    vendorBrandName: 'KPMG',
    clientName: 'International Flavors & Fragrances (IFF)',
    clientWebsiteUrl: 'https://www.iff.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.iff.com.ico',
  },
  {
    vendorBrandName: 'KPMG',
    clientName: 'Morehouse School of Medicine',
    clientWebsiteUrl: 'https://www.msm.edu/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.msm.edu.ico',
  },
  {
    vendorBrandName: 'Kraft Kennedy',
    clientName: 'Carver Federal Savings Bank',
    clientWebsiteUrl: 'https://www.carverbank.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.carverbank.com.ico',
  },
  {
    vendorBrandName: 'Proventeq',
    clientName: 'Advantest',
    clientWebsiteUrl: 'https://www.advantest.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.advantest.com.ico',
  },
  {
    vendorBrandName: 'Proventeq',
    clientName: 'Australian Department of Home Affairs',
    clientWebsiteUrl: 'https://www.homeaffairs.gov.au/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.homeaffairs.gov.au.ico',
  },
  {
    vendorBrandName: 'Proventeq',
    clientName: 'JSA Advocates & Solicitors',
    clientWebsiteUrl: 'https://www.jsalaw.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.jsalaw.com.ico',
  },
  {
    vendorBrandName: 'RBRO',
    clientName: 'Baker McKenzie',
    clientWebsiteUrl: 'https://www.bakermckenzie.com/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.bakermckenzie.com.ico',
  },
  {
    vendorBrandName: 'Slalom',
    clientName: 'United Airlines',
    clientWebsiteUrl: 'https://www.united.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.united.com.ico',
  },
  {
    vendorBrandName: 'Stone Consulting',
    clientName: 'Alexander Holburn Beaudin + Lang LLP',
    clientWebsiteUrl: 'https://www.ahbl.ca/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.ahbl.ca.ico',
  },
  {
    vendorBrandName: 'Stone Consulting',
    clientName: 'Givens Pursley LLP',
    clientWebsiteUrl: 'https://www.givenspursley.com/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.givenspursley.com.ico',
  },
  {
    vendorBrandName: 'Stone Consulting',
    clientName: 'Hogan Lovells',
    clientWebsiteUrl: 'https://www.hoganlovells.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.hoganlovells.com.ico',
  },
  {
    vendorBrandName: 'Thomson Reuters',
    clientName: 'Blackadders',
    clientWebsiteUrl: 'https://www.blackadders.co.uk/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.blackadders.co.uk.ico',
  },
  {
    vendorBrandName: 'TitanFile',
    clientName: 'Littler',
    clientWebsiteUrl: 'https://www.littler.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.littler.com.ico',
  },
  {
    vendorBrandName: 'Wise Consulting',
    clientName: 'Blount Fine Foods',
    clientWebsiteUrl: 'https://www.blountfinefoods.com/',
    clientLogoUrl:
      'https://icons.duckduckgo.com/ip3/www.blountfinefoods.com.ico',
  },
  {
    vendorBrandName: 'Wise Consulting',
    clientName: 'Encore',
    clientWebsiteUrl: 'https://www.encoreglobal.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.encoreglobal.com.ico',
  },
  {
    vendorBrandName: 'Wise Consulting',
    clientName: 'The Y in Central Maryland',
    clientWebsiteUrl: 'https://ymaryland.org/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/ymaryland.org.ico',
  },
  {
    vendorBrandName: 'Zendesk Pro Services',
    clientName: 'Best Egg',
    clientWebsiteUrl: 'https://www.bestegg.com/',
    clientLogoUrl: 'https://icons.duckduckgo.com/ip3/www.bestegg.com.ico',
  },
];

export class AddMoreClientWebsitesAndLogos20260306050000
  implements MigrationInterface
{
  name = 'AddMoreClientWebsitesAndLogos20260306050000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const fill of CLIENT_WEBSITE_AND_LOGO_FILLS) {
      await queryRunner.query(
        `
          UPDATE vendor_clients vc
          INNER JOIN vendors v ON v.id = vc.vendor_id
          SET
            vc.client_website_url = ?,
            vc.client_logo_url = ?,
            vc.updated_at = CURRENT_TIMESTAMP
          WHERE v.brand_name = ?
            AND vc.client_name = ?
            AND (vc.client_website_url IS NULL OR TRIM(vc.client_website_url) = '')
        `,
        [
          fill.clientWebsiteUrl,
          fill.clientLogoUrl,
          fill.vendorBrandName,
          fill.clientName,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const fill of CLIENT_WEBSITE_AND_LOGO_FILLS) {
      await queryRunner.query(
        `
          UPDATE vendor_clients vc
          INNER JOIN vendors v ON v.id = vc.vendor_id
          SET
            vc.client_website_url = NULL,
            vc.client_logo_url = NULL,
            vc.updated_at = CURRENT_TIMESTAMP
          WHERE v.brand_name = ?
            AND vc.client_name = ?
            AND vc.client_website_url = ?
            AND vc.client_logo_url = ?
        `,
        [
          fill.vendorBrandName,
          fill.clientName,
          fill.clientWebsiteUrl,
          fill.clientLogoUrl,
        ],
      );
    }
  }
}
