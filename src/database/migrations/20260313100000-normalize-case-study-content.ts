import { MigrationInterface, QueryRunner } from 'typeorm';

type CaseStudyContentUpdate = {
  id: number;
  previousTitle?: string;
  nextTitle?: string;
  previousSummary?: string;
  nextSummary?: string;
};

const CASE_STUDY_CONTENT_UPDATES: CaseStudyContentUpdate[] = [
  {
    id: 21,
    previousSummary:
      'Accenture worked with Prada Group to enhance customer experience through digital and in-store engagement.',
    nextSummary:
      'Accenture worked with Prada Group to connect digital and in-store customer experiences across the luxury retailer. The case centers on using design, commerce, and service capabilities to make engagement feel more consistent and personalized across channels.',
  },
  {
    id: 22,
    previousSummary:
      'Accenture supported Generali in creating a digital experience focused on customer interaction and engagement.',
    nextSummary:
      'Accenture supported Generali in designing a more human-centered digital experience for customer interaction and service delivery. The case focuses on combining experience design and digital execution to make engagement easier, more consistent, and better aligned to customer needs.',
  },
  {
    id: 23,
    previousSummary:
      'Accenture helped Fortune apply data and AI to transform information into actionable insights.',
    nextSummary:
      'Accenture helped Fortune turn data into more usable insight products and decision support. The case centers on applying data and AI capabilities to improve how insights are generated, packaged, and delivered to the business.',
  },
  {
    id: 24,
    previousSummary:
      'Adastra worked with Raiffeisenbank on a unified data platform concept to consolidate data and enable modern analytics.',
    nextSummary:
      'Adastra worked with Raiffeisenbank on a unified data platform concept to bring fragmented data onto a shared foundation. The case focuses on improving consistency, enabling modern analytics, and creating a platform better suited to enterprise-wide reporting and governance.',
  },
  {
    id: 25,
    previousSummary:
      'Implemented Microsoft Purview capabilities to strengthen data governance and information management for CETIN.',
    nextSummary:
      'CETIN engaged Adastra to expand its use of Microsoft Purview for stronger governance and data visibility. The case focuses on improving cataloging, control, and information-management practices so teams can work with data more confidently at scale.',
  },
  {
    id: 26,
    previousSummary:
      'Built an automated procurement process with forward-looking planning to reduce repetitive manual work.',
    nextSummary:
      'Adastra built an automated, forward-looking procurement process to reduce repetitive manual planning work. The case highlights earlier visibility into demand, more efficient operational coordination, and savings of roughly 1,000 manual hours per year.',
  },
  {
    id: 27,
    previousSummary:
      'Implemented RPA-based shipment tracking automation to reduce manual tracking effort.',
    nextSummary:
      'Adastra implemented RPA-based shipment tracking to automate a previously manual logistics process. The case focuses on faster status visibility, lower administrative effort, and reported savings of about 250 hours of work each month.',
  },
  {
    id: 28,
    previousSummary:
      'Delivered an AWS cloud migration for a healthcare organization and stabilized operations post-migration.',
    nextSummary:
      'Adastra delivered an AWS cloud migration for a healthcare organization to move workloads off legacy infrastructure. The case centers on stabilizing operations after migration and creating a more scalable cloud environment for ongoing service delivery.',
  },
  {
    id: 30,
    previousSummary:
      'Case study describing Epiq support for Ditech through a restructuring engagement.',
    nextSummary:
      'Epiq supported Ditech through a complex restructuring engagement with case-management and restructuring services. The case focuses on coordinating large volumes of stakeholders, claims, and court-driven process requirements in a high-pressure environment.',
  },
  {
    id: 31,
    previousSummary:
      'Case study on using Epiq Case Insights to help a client analyze case information.',
    nextSummary:
      'Epiq Case Insights helped a client analyze litigation and case information more efficiently. The case centers on organizing matter data into usable insight so legal teams could review trends, assess developments, and make faster case-related decisions.',
  },
  {
    id: 32,
    previousSummary:
      "Case study on Harbor's work supporting Susman Godfrey's cloud-first strategy for iManage.",
    nextSummary:
      "Harbor supported Susman Godfrey's cloud-first iManage strategy as the firm modernized document and email management. The case focuses on moving core knowledge-work systems to a more scalable cloud foundation while reducing operational complexity.",
  },
  {
    id: 33,
    previousSummary:
      "Customer case study describing Harbor's implementation support for Ice Miller's move to iManage Cloud.",
    nextSummary:
      'Harbor helped Ice Miller implement iManage Cloud as part of a broader document-management modernization effort. The case centers on delivery planning, migration execution, and giving the firm a more scalable cloud platform for day-to-day content work.',
  },
  {
    id: 34,
    previousSummary:
      'PDF case study describing Hogan Lovells selection of Helm360 for an Elite 3E upgrade and cloud transition.',
    nextSummary:
      'Helm360 supported Hogan Lovells in upgrading to Elite 3E and planning its transition to the cloud. The case focuses on finance-systems modernization, implementation validation, and reducing delivery risk during a large-scale platform change.',
  },
  {
    id: 35,
    previousSummary:
      'Case study on migrating Goulston & Storrs to iManage Cloud for document management modernization.',
    nextSummary:
      'InOutsource helped Goulston & Storrs migrate to iManage Cloud as part of its document-management modernization program. The case centers on moving the firm\'s content platform to the cloud with less disruption and a cleaner foundation for ongoing information management.',
  },
  {
    id: 37,
    previousSummary:
      'Story on Zetlin & De Chiara partnering with Kraft Kennedy to improve operations with managed IT services.',
    nextSummary:
      'Kraft Kennedy worked with Zetlin & De Chiara to improve operations through managed IT services and technology planning. The story centers on building a more dependable operating model and a stronger foundation for future-ready legal workflows.',
  },
  {
    id: 38,
    previousTitle:
      'Customer Due Diligence case study for large financial institution',
    nextTitle: 'Customer Due Diligence for a Large Financial Institution',
    previousSummary:
      'LexisNexis Risk Solutions case study describing customer due diligence capabilities for compliance workflows.',
    nextSummary:
      'LexisNexis Risk Solutions supported a large financial institution with customer due diligence capabilities for compliance and risk workflows. The case focuses on improving how the institution collects, validates, and acts on customer information during onboarding and ongoing monitoring.',
  },
  {
    id: 39,
    previousTitle:
      'Customer success story: locating a missing person with Accurint TraX',
    nextTitle: 'Locating a Missing Person with Accurint TraX',
    previousSummary:
      'LexisNexis Risk Solutions customer story on using Accurint TraX to support investigations.',
    nextSummary:
      'LexisNexis Risk Solutions highlights how Accurint TraX helped investigators locate a missing person more quickly. The case centers on using linked public-record intelligence to connect leads, narrow search efforts, and support faster investigative action.',
  },
  {
    id: 40,
    previousTitle:
      "HighQ case study: Parris Law Firm's innovative case management",
    nextTitle: "Parris Law Firm's Innovative Case Management with HighQ",
    previousSummary:
      'Customer story on how Parris Law Firm used HighQ for case management and collaboration.',
    nextSummary:
      'Thomson Reuters shows how Parris Law Firm used HighQ to modernize case management and collaboration workflows. The case focuses on giving teams a more connected workspace for matter coordination, document sharing, and client-facing process efficiency.',
  },
  {
    id: 42,
    previousTitle: 'Geldards Case Study - HighQ',
    nextTitle: 'Geldards with HighQ',
    previousSummary:
      'Customer story on how Geldards implemented HighQ to improve collaboration and document sharing.',
    nextSummary:
      'Thomson Reuters highlights Geldards\' use of HighQ to improve collaboration, secure document sharing, and client engagement. The case centers on replacing less structured processes with a more organized digital workspace for legal matters.',
  },
  {
    id: 43,
    previousTitle: 'Siskinds LLP Case Study',
    nextTitle: 'Siskinds LLP',
    previousSummary:
      'Case study describing how Siskinds LLP uses TitanFile secure portal for file sharing and collaboration.',
    nextSummary:
      'TitanFile helped Siskinds LLP use a secure portal for file sharing and client collaboration. The case focuses on giving the firm a safer and more convenient way to exchange sensitive documents without relying on unsecured email workflows.',
  },
  {
    id: 44,
    previousTitle: 'Marshall Dennehey Case Study',
    nextTitle: 'Marshall Dennehey',
    previousSummary:
      'Case study on Marshall Dennehey use of TitanFile secure file sharing portal and firmwide collaboration.',
    nextSummary:
      'TitanFile supported Marshall Dennehey with a secure file-sharing portal used across the firm. The case highlights broader adoption, easier collaboration, and a more reliable process for exchanging sensitive information with clients and outside parties.',
  },
  {
    id: 45,
    previousSummary:
      'CDW Professional Services designed and managed migration to CDW data center and managed services for operations.',
    nextSummary:
      'CDW designed and executed a data-center migration program without disrupting business operations. The case highlights infrastructure separation, FlexPod-based target architecture, and managed services support to keep the new environment stable after cutover.',
  },
  {
    id: 46,
    previousSummary:
      'CDW helped a restaurant chain modernize network infrastructure across locations using Cisco Meraki.',
    nextSummary:
      'CDW helped a nationwide restaurant chain modernize networking across roughly 2,000 locations. The case focuses on consolidating Wi-Fi onto Cisco Meraki, simplifying vendor management, and improving connectivity for guests and staff.',
  },
  {
    id: 47,
    previousSummary:
      'CDW security team supported Coventry University with endpoint protection adoption.',
    nextSummary:
      'CDW supported Coventry University in evaluating and adopting a stronger endpoint protection approach. The case centers on security-team guidance, solution selection, and deployment support to reduce cyber risk across the university estate.',
  },
  {
    id: 48,
    previousSummary:
      'CDW recommended AWS S3 and Glacier lifecycle policies for 3-2-1 storage strategy.',
    nextSummary:
      'CDW helped the University of Nebraska Foundation implement a 3-2-1 storage strategy on AWS using S3 and Glacier. The case focuses on disaster recovery readiness, lower storage costs, and better lifecycle management for long-term data retention.',
  },
  {
    id: 49,
    previousSummary:
      'Cognizant worked with Lufthansa Group Digital Hangar to build a data foundation and digital customer tools.',
    nextSummary:
      'Cognizant worked with Lufthansa Group Digital Hangar to build a data foundation and co-create digital travel tools. The case centers on using shared data capabilities to improve decision-making, customer experience, and product innovation across the airline group.',
  },
  {
    id: 50,
    previousSummary:
      'Cognizant partnered with Royal London Group on a responsible generative AI assistant with governance controls.',
    nextSummary:
      'Cognizant partnered with Royal London Group on a governed generative AI assistant for regulated content review. The case focuses on responsible AI controls, human oversight, and faster approval cycles for marketing and communications assets.',
  },
  {
    id: 56,
    previousSummary:
      'Helient partnered with HNL Lab Medicine on Microsoft Azure architecture for a digital pathology platform.',
    nextSummary:
      'Helient partnered with HNL Lab Medicine on Microsoft Azure services for a digital pathology platform. The case focuses on building a cloud architecture capable of supporting pathology workflows, scalability, and secure access to critical diagnostic data.',
  },
  {
    id: 60,
    previousSummary:
      'KPMG partnered with Big Brothers Big Sisters of Puget Sound and Microsoft to build AIMRE for mentor-mentee matching.',
    nextSummary:
      'KPMG worked with Big Brothers Big Sisters of Puget Sound and Microsoft to build an AI match recommendation engine for mentor pairing. The case focuses on using data and AI to speed matching decisions and improve the fit between mentors and mentees.',
  },
  {
    id: 64,
    previousTitle:
      'National Lutheran Communities & Services - Customer Case Study',
    nextTitle: 'National Lutheran Communities & Services',
    previousSummary:
      'FeaturedCustomers listing references National Lutheran Communities & Services as a Wise Consulting customer case study.',
    nextSummary:
      'FeaturedCustomers lists National Lutheran Communities & Services as a Wise Consulting customer reference tied to HR technology services. The entry is brief, but it positions the organization as a named case-study reference for Wise\'s implementation and advisory work.',
  },
  {
    id: 66,
    previousSummary:
      'Stone Consulting Team is credited with meaningful contribution to Hogan Lovells global DMS program execution.',
    nextSummary:
      'Stone Consulting Team is credited with meaningful support on Hogan Lovells\' global DMS program. The case centers on specialist guidance and delivery support that helped the firm execute a large-scale document-management initiative across a complex environment.',
  },
  {
    id: 67,
    previousTitle: 'Encore - Customer Case Study',
    nextTitle: 'Encore',
    previousSummary:
      'FeaturedCustomers listing references Encore as a Wise Consulting customer case study.',
    nextSummary:
      'FeaturedCustomers lists Encore as a Wise Consulting customer case study reference. The listing is brief, but it identifies Encore as a public customer example tied to Wise\'s HR technology consulting and support work.',
  },
  {
    id: 110,
    previousTitle:
      'Case Study: Accelerating Expansion: Tailored Solutions for TGI Fridays & The Sporting Globe',
    nextTitle:
      'Accelerating Expansion: Tailored Solutions for TGI Fridays & The Sporting Globe',
  },
  {
    id: 111,
    previousTitle:
      'Case Study: Empowering TyreMax with Sophisticated Warehouse Management System',
    nextTitle: 'Empowering TyreMax with Sophisticated Warehouse Management System',
  },
  {
    id: 113,
    previousTitle:
      "Case Study: Jarvis Walker's Productive & Strategic Switch to Premier Tech",
    nextTitle: "Jarvis Walker's Productive & Strategic Switch to Premier Tech",
  },
  {
    id: 114,
    previousTitle: 'Client Case Study: McAllister Olivarius, UK',
    nextTitle: 'McAllister Olivarius, UK',
  },
  {
    id: 115,
    previousTitle: 'Client Case Study: LifeArc UK',
    nextTitle: 'LifeArc UK',
  },
  {
    id: 116,
    previousTitle: 'Client Case Study: Airtel, India',
    nextTitle: 'Airtel, India',
  },
];

export class NormalizeCaseStudyContent20260313100000
  implements MigrationInterface
{
  name = 'NormalizeCaseStudyContent20260313100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const update of CASE_STUDY_CONTENT_UPDATES) {
      if (update.nextTitle !== undefined) {
        await queryRunner.query(
          `UPDATE vendor_case_studies SET title = ? WHERE id = ?`,
          [update.nextTitle, update.id],
        );
      }

      if (update.nextSummary !== undefined) {
        await queryRunner.query(
          `UPDATE vendor_case_studies SET summary = ? WHERE id = ?`,
          [update.nextSummary, update.id],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const update of CASE_STUDY_CONTENT_UPDATES) {
      if (update.previousTitle !== undefined) {
        await queryRunner.query(
          `UPDATE vendor_case_studies SET title = ? WHERE id = ?`,
          [update.previousTitle, update.id],
        );
      }

      if (update.previousSummary !== undefined) {
        await queryRunner.query(
          `UPDATE vendor_case_studies SET summary = ? WHERE id = ?`,
          [update.previousSummary, update.id],
        );
      }
    }
  }
}
