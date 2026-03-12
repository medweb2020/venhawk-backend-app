import { MigrationInterface, QueryRunner } from 'typeorm';

type SummaryUpdate = {
  id: number;
  previousSummary: string;
  nextSummary: string;
};

const SUMMARY_UPDATES: SummaryUpdate[] = [
  {
    id: 16,
    previousSummary: 'Case study listing.',
    nextSummary:
      "Accenture highlights Uber's ad platform as a customer-experience case that helps brands reach users at relevant moments. The story focuses on designing a more connected advertising experience that ties engagement more closely to customer context.",
  },
  {
    id: 9,
    previousSummary: 'Case study.',
    nextSummary:
      'Cloudficient presents a large-scale Enterprise Vault migration covering 55 TB of archived content. The case emphasizes complex archive modernization and Cloudficient\'s ability to move legacy data into a more manageable cloud-oriented environment.',
  },
  {
    id: 10,
    previousSummary: 'Case study.',
    nextSummary:
      'Cloudforce is cited in Microsoft\'s education work around AI-led innovation for institutions including UCLA Anderson School of Management. The story centers on using Azure and AI capabilities to support new digital experiences and institutional modernization.',
  },
  {
    id: 8,
    previousSummary: 'Case study.',
    nextSummary:
      'Cornerstone.IT helped a law firm deliver Windows virtual desktops from Azure to reduce downtime and improve user access. The case focuses on modernizing desktop delivery for legal teams with a more flexible, cloud-based working environment.',
  },
  {
    id: 18,
    previousSummary: 'Case study listing.',
    nextSummary:
      'Deloitte\'s case-study index highlights work with BHP to resolve supply network threats and improve visibility into supplier risk. The story centers on detecting disruptions earlier and responding with better data and coordination across the network.',
  },
  {
    id: 7,
    previousSummary: 'Case study.',
    nextSummary:
      'Element Technologies describes a Salesforce lead-management engagement in the banking sector aimed at improving lead handling and operational visibility. The case focuses on aligning CRM workflows to support faster follow-up, better process control, and more consistent sales execution.',
  },
  {
    id: 13,
    previousSummary: 'Case study.',
    nextSummary:
      'Epiq worked with McDonald Hopkins to improve financial management by redesigning the firm\'s new business intake process. The case highlights better workflow visibility, stronger coordination between intake and finance, and more efficient operational decision-making.',
  },
  {
    id: 11,
    previousSummary: 'Case study.',
    nextSummary:
      'Harbor supported Trowers & Hamlins in implementing Elite 3E as part of a broader finance and practice-management modernization effort. The case emphasizes structured delivery, process alignment, and a smoother transition to a more scalable platform.',
  },
  {
    id: 12,
    previousSummary: 'Case study.',
    nextSummary:
      'Helm360 partnered with Seddons GSC LLP on its move to Elite 3E Cloud, supporting the firm\'s finance-systems modernization journey. The case focuses on implementation planning, cloud transition execution, and reducing risk during a significant platform change.',
  },
  {
    id: 6,
    previousSummary: 'Case study.',
    nextSummary:
      'InOutsource describes Baker Botts\' migration of complex business-acceptance workflows to the cloud, including its Intapp OnePlace for Risk implementation. The case focuses on moving critical intake and risk processes with confidence while limiting disruption to ongoing firm operations.',
  },
  {
    id: 4,
    previousSummary: 'Success story.',
    nextSummary:
      'Kraft Kennedy\'s Carver Federal Savings Bank story describes an IT-architecture modernization focused on improving resiliency and performance. The engagement centers on strengthening the desktop and infrastructure environment so the bank can operate more reliably and scale with less friction.',
  },
  {
    id: 14,
    previousSummary: 'Case study.',
    nextSummary:
      'Proventeq helped JSA Advocates & Solicitors migrate and modernize ECM content from a complex iManage environment. The case highlights large-volume content movement, cleaner information access, and more connected user experiences after modernization.',
  },
  {
    id: 15,
    previousSummary: 'Customer case study listing.',
    nextSummary:
      'FeaturedCustomers lists Advantest as a Proventeq customer case study tied to migration and content-modernization work. The entry is brief, but it positions Advantest as a named reference for Proventeq-led transformation activity.',
  },
  {
    id: 5,
    previousSummary: 'Case study.',
    nextSummary:
      'RBRO supported Baker McKenzie in migrating to iManage Cloud to improve performance while reducing cost and infrastructure complexity. The case focuses on cloud transition planning, delivery coordination, and modernizing document management at global-firm scale.',
  },
  {
    id: 17,
    previousSummary: 'Customer story.',
    nextSummary:
      'Slalom worked with United Airlines to build a generative AI platform and stand up practical use cases for customer and employee value. The story emphasizes technical delivery, AI enablement, and faster experimentation on a scalable enterprise foundation.',
  },
  {
    id: 2,
    previousSummary: 'Customer story.',
    nextSummary:
      'Blackadders used HighQ to collaborate and share information with clients more securely and efficiently. Thomson Reuters positions the story around digital client service, secure document exchange, and better matter collaboration.',
  },
  {
    id: 3,
    previousSummary: 'Case study.',
    nextSummary:
      'TitanFile became Littler\'s legal file-sharing solution, giving the firm a more secure and client-friendly way to exchange sensitive documents. The case emphasizes legal-grade security, simpler collaboration, and better support for day-to-day file transfer needs.',
  },
  {
    id: 19,
    previousSummary: 'Customer story listing.',
    nextSummary:
      'Zendesk highlights Best Egg as a customer story in which AI automates 80% of chat inquiries. The case focuses on scaling support operations through automation while improving responsiveness and reducing manual service workload.',
  },
  {
    id: 41,
    previousSummary:
      'Case study describing Stevens & Bolton use of HighQ for secure collaboration.',
    nextSummary:
      'Stevens & Bolton used HighQ to create a more secure and connected collaboration environment for legal work and client interaction. Thomson Reuters frames the case around better information sharing, stronger matter coordination, and a more efficient digital experience for teams and clients.',
  },
];

export class RefreshWeakCaseStudySummaries20260312161000 implements MigrationInterface {
  name = 'RefreshWeakCaseStudySummaries20260312161000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const update of SUMMARY_UPDATES) {
      await queryRunner.query(
        `UPDATE vendor_case_studies SET summary = ? WHERE id = ?`,
        [update.nextSummary, update.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const update of SUMMARY_UPDATES) {
      await queryRunner.query(
        `UPDATE vendor_case_studies SET summary = ? WHERE id = ?`,
        [update.previousSummary, update.id],
      );
    }
  }
}
