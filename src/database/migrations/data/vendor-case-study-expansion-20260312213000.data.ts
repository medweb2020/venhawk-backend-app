export type VendorCaseStudyExpansionSeed = {
  vendorUuid: string;
  brandName: string;
  caseStudies: Array<{
    title: string;
    summary: string;
    studyUrl: string | null;
    sourceName: string;
    sourceUrl: string;
  }>;
};

export const VENDOR_CASE_STUDY_EXPANSION_20260312213000: VendorCaseStudyExpansionSeed[] = [
  {
    vendorUuid: '731255f6-762d-4e88-a1ca-e9dde3b52b67',
    brandName: 'CDW',
    caseStudies: [
      {
        title: 'Back from Disaster',
        summary:
          'After a data center outage nearly caused permanent payroll-data loss, Beaverton School District engaged CDW to build a full disaster recovery and business continuity plan. CDW helped define backup tiers, add a secondary data center, plan for cloud-based DR, and create runbooks and SLAs so critical systems could be restored predictably.',
        studyUrl:
          '[https://www.cdw.com/content/cdw/en/articles/datacenter/back-from-disaster.html](https://www.cdw.com/content/cdw/en/articles/datacenter/back-from-disaster.html)',
        sourceName: 'CDW',
        sourceUrl:
          '[https://www.cdw.com/content/cdw/en/articles/datacenter/back-from-disaster.html](https://www.cdw.com/content/cdw/en/articles/datacenter/back-from-disaster.html)',
      },
    ],
  },
  {
    vendorUuid: '5c21b182-36e9-43ee-919f-9d9fa6ca7bd0',
    brandName: 'Cloudficient',
    caseStudies: [
      {
        title: '2 PB Enterprise Vault Migration for Financial Services Company',
        summary:
          'Cloudficient migrated 2 PB of Enterprise Vault data for a North American financial services organization with roughly 75,000 employees. Using EVComplete, the project supported data center exits, regulatory compliance, and Microsoft 365 modernization while maintaining archive access and operational continuity at very large scale.',
        studyUrl:
          '[https://www.cloudficient.com/case-study/2-pb-enterprise-vault-migration-for-financial-services-company](https://www.cloudficient.com/case-study/2-pb-enterprise-vault-migration-for-financial-services-company)',
        sourceName: 'Cloudficient',
        sourceUrl:
          '[https://www.cloudficient.com/case-study/2-pb-enterprise-vault-migration-for-financial-services-company](https://www.cloudficient.com/case-study/2-pb-enterprise-vault-migration-for-financial-services-company)',
      },
      {
        title: '130 TB Enterprise Vault Migration for Energy Company',
        summary:
          'Cloudficient helped a North American energy company move 130 TB of Enterprise Vault data to Microsoft 365 in under three months. The case centers on retiring legacy archive infrastructure, avoiding renewal costs, preserving eDiscovery access, and completing a high-volume migration with no business disruption.',
        studyUrl:
          '[https://www.cloudficient.com/case-study/130-tb-enterprise-vault-migration-for-energy-company](https://www.cloudficient.com/case-study/130-tb-enterprise-vault-migration-for-energy-company)',
        sourceName: 'Cloudficient',
        sourceUrl:
          '[https://www.cloudficient.com/case-study/130-tb-enterprise-vault-migration-for-energy-company](https://www.cloudficient.com/case-study/130-tb-enterprise-vault-migration-for-energy-company)',
      },
      {
        title: '2 PB Enterprise Vault Migration for Pharmaceutical Company',
        summary:
          'Cloudficient worked with a global pharmaceutical company to migrate 2.5 PB of Enterprise Vault archive data to Expireon. The project was aimed at retiring legacy infrastructure, consolidating data centers, and improving eDiscovery and compliance capabilities while reducing ongoing archive-management overhead.',
        studyUrl:
          '[https://www.cloudficient.com/case-study/2-pb-enterprise-vault-migration-for-pharma-company](https://www.cloudficient.com/case-study/2-pb-enterprise-vault-migration-for-pharma-company)',
        sourceName: 'Cloudficient',
        sourceUrl:
          '[https://www.cloudficient.com/case-study/2-pb-enterprise-vault-migration-for-pharma-company](https://www.cloudficient.com/case-study/2-pb-enterprise-vault-migration-for-pharma-company)',
      },
      {
        title: '340 TB EMC SourceOne Migration for Financial Services Organization',
        summary:
          'Cloudficient supported a global financial services organization in migrating more than 340 TB from EMC SourceOne to Expireon. The case highlights archive review, retention-driven consolidation, and reduction of redundant data so the client could modernize legacy journaling infrastructure and lower the migration footprint.',
        studyUrl:
          '[https://www.cloudficient.com/case-study/340-tb-emc-sourceone-migration-to-expireon](https://www.cloudficient.com/case-study/340-tb-emc-sourceone-migration-to-expireon)',
        sourceName: 'Cloudficient',
        sourceUrl:
          '[https://www.cloudficient.com/case-study/340-tb-emc-sourceone-migration-to-expireon](https://www.cloudficient.com/case-study/340-tb-emc-sourceone-migration-to-expireon)',
      },
    ],
  },
  {
    vendorUuid: 'd673152b-706b-49a9-bc9b-b1dcf7374852',
    brandName: 'CloudForce',
    caseStudies: [
      {
        title: 'California State University, Fullerton, democratizes access to generative AI for 43,000 students with Cloudforce and nebulaONE',
        summary:
          'Cloudforce partnered with California State University, Fullerton to launch a secure Azure-based generative AI environment for a large campus community. The story describes a six-week pilot and a rapid broader rollout that expanded AI access for students, faculty, and staff while keeping deployment inside university-controlled infrastructure.',
        studyUrl:
          '[https://gocloudforce.com/california-state-university-fullerton-case-study/](https://gocloudforce.com/california-state-university-fullerton-case-study/)',
        sourceName: 'Cloudforce',
        sourceUrl:
          '[https://gocloudforce.com/california-state-university-fullerton-case-study/](https://gocloudforce.com/california-state-university-fullerton-case-study/)',
      },
      {
        title: 'The CNA Corporation strengthens U.S. national security with Cloudforce\'s secure, innovative AI platform',
        summary:
          'Cloudforce built a secure Azure Government landing zone and AI platform for CNA Corporation. The case focuses on enabling rapid development of custom AI agents in a high-security environment so research and national security teams could automate work, scale experimentation, and keep sensitive usage within controlled boundaries.',
        studyUrl:
          '[https://gocloudforce.com/cna_case_study/](https://gocloudforce.com/cna_case_study/)',
        sourceName: 'Cloudforce',
        sourceUrl:
          '[https://gocloudforce.com/cna_case_study/](https://gocloudforce.com/cna_case_study/)',
      },
      {
        title: 'University of Surrey invests in personalised AI for staff and students in partnership with Cloudforce and Microsoft',
        summary:
          'Cloudforce worked with the University of Surrey and Microsoft to roll out a personalised AI environment for staff and students. The case emphasizes secure access to generative AI for study support, research assistance, and day-to-day task automation in a university setting.',
        studyUrl:
          '[https://gocloudforce.com/university-of-surrey-invests-in-personalised-ai-for-staff-and-students-in-partnership-with-cloudforce-and-microsoft/](https://gocloudforce.com/university-of-surrey-invests-in-personalised-ai-for-staff-and-students-in-partnership-with-cloudforce-and-microsoft/)',
        sourceName: 'Cloudforce',
        sourceUrl:
          '[https://gocloudforce.com/university-of-surrey-invests-in-personalised-ai-for-staff-and-students-in-partnership-with-cloudforce-and-microsoft/](https://gocloudforce.com/university-of-surrey-invests-in-personalised-ai-for-staff-and-students-in-partnership-with-cloudforce-and-microsoft/)',
      },
      {
        title: 'University of Lincoln embarks on next phase of AI deployment with Microsoft and Cloudforce partnership',
        summary:
          'Cloudforce partnered with the University of Lincoln on the next phase of its AI deployment, extending secure generative AI access across the institution. The story frames Cloudforce\'s role around scaling responsible AI adoption on Microsoft technology after earlier university-led AI groundwork had already been established.',
        studyUrl:
          '[https://gocloudforce.com/university-of-lincoln-embarks-on-next-phase-of-ai-deployment-with-microsoft-and-cloudforce-partnership/](https://gocloudforce.com/university-of-lincoln-embarks-on-next-phase-of-ai-deployment-with-microsoft-and-cloudforce-partnership/)',
        sourceName: 'Cloudforce',
        sourceUrl:
          '[https://gocloudforce.com/university-of-lincoln-embarks-on-next-phase-of-ai-deployment-with-microsoft-and-cloudforce-partnership/](https://gocloudforce.com/university-of-lincoln-embarks-on-next-phase-of-ai-deployment-with-microsoft-and-cloudforce-partnership/)',
      },
    ],
  },
  {
    vendorUuid: '42c900ec-d388-4884-8ab6-ce5a21855fc7',
    brandName: 'Cognizant',
    caseStudies: [
      {
        title: 'NHS England drives digital transformation with ServiceNow CRM to add business value',
        summary:
          'Cognizant helped NHS England advance digital transformation with ServiceNow CRM. The case describes modernizing service workflows on a common platform so teams could improve operational efficiency, support more responsive services, and generate broader business value from CRM-led process change.',
        studyUrl:
          '[https://www.cognizant.com/us/en/case-studies/nhs-england-drives-digital-transformation-with-servicenow-crm-to-add-business-value](https://www.cognizant.com/us/en/case-studies/nhs-england-drives-digital-transformation-with-servicenow-crm-to-add-business-value)',
        sourceName: 'Cognizant',
        sourceUrl:
          '[https://www.cognizant.com/us/en/case-studies/nhs-england-drives-digital-transformation-with-servicenow-crm-to-add-business-value](https://www.cognizant.com/us/en/case-studies/nhs-england-drives-digital-transformation-with-servicenow-crm-to-add-business-value)',
      },
      {
        title: 'Network Health five-star call center/member experience fueled by QNXT',
        summary:
          'Cognizant worked with Network Health to improve member-service operations using QNXT. The case highlights a five-star call center experience, including faster response times, strong first-call resolution, and lower attrition, showing how platform and process changes supported measurable contact-center performance.',
        studyUrl:
          '[https://www.cognizant.com/us/en/case-studies/network-health-five-star-call-center-member-experience-fueled-by-qnxt](https://www.cognizant.com/us/en/case-studies/network-health-five-star-call-center-member-experience-fueled-by-qnxt)',
        sourceName: 'Cognizant',
        sourceUrl:
          '[https://www.cognizant.com/us/en/case-studies/network-health-five-star-call-center-member-experience-fueled-by-qnxt](https://www.cognizant.com/us/en/case-studies/network-health-five-star-call-center-member-experience-fueled-by-qnxt)',
      },
      {
        title: 'Financial Conduct Authority improves agility and responsiveness with AWS cloud migration',
        summary:
          'Cognizant supported the UK Financial Conduct Authority with an AWS cloud migration covering large file and document estates. The case centers on improving agility and responsiveness by moving core workloads and information assets to a more modern cloud foundation suited to a heavily regulated environment.',
        studyUrl:
          '[https://www.cognizant.com/us/en/case-studies/financial-conduct-authority-improves-agility-and-responsiveness-with-aws-cloud-migration](https://www.cognizant.com/us/en/case-studies/financial-conduct-authority-improves-agility-and-responsiveness-with-aws-cloud-migration)',
        sourceName: 'Cognizant',
        sourceUrl:
          '[https://www.cognizant.com/us/en/case-studies/financial-conduct-authority-improves-agility-and-responsiveness-with-aws-cloud-migration](https://www.cognizant.com/us/en/case-studies/financial-conduct-authority-improves-agility-and-responsiveness-with-aws-cloud-migration)',
      },
    ],
  },
  {
    vendorUuid: '71dedf5a-83c1-4687-a5df-a21dc4bcef50',
    brandName: 'Cornerstone.IT',
    caseStudies: [
      {
        title: 'McCann & MullenLowe - Microsoft Teams Case Study',
        summary:
          'Cornerstone.IT helped McCann and MullenLowe unify collaboration after acquisitions by deploying Microsoft Teams as a shared communications and file-sharing environment. The case focuses on giving multiple organizations a common workspace so staff could work together more smoothly across the combined business.',
        studyUrl:
          '[https://www.cornerstone.it/mccann-mullenlowe-microsoft-teams-case-study/](https://www.cornerstone.it/mccann-mullenlowe-microsoft-teams-case-study/)',
        sourceName: 'Cornerstone.IT',
        sourceUrl:
          '[https://www.cornerstone.it/mccann-mullenlowe-microsoft-teams-case-study/](https://www.cornerstone.it/mccann-mullenlowe-microsoft-teams-case-study/)',
      },
      {
        title: 'Saul Ewing\'s iManage Cloud Database Consolidation a Successful Industry First',
        summary:
          'Cornerstone.IT supported Saul Ewing\'s iManage Cloud database consolidation after merger-related complexity. The story describes bringing together large volumes of documents and legacy data to reduce cost, risk, and administrative complexity while positioning the firm for a cleaner, more scalable cloud document-management environment.',
        studyUrl:
          '[https://www.cornerstone.it/saul-ewings-imanage-cloud-database-consolidation/](https://www.cornerstone.it/saul-ewings-imanage-cloud-database-consolidation/)',
        sourceName: 'Cornerstone.IT',
        sourceUrl:
          '[https://www.cornerstone.it/saul-ewings-imanage-cloud-database-consolidation/](https://www.cornerstone.it/saul-ewings-imanage-cloud-database-consolidation/)',
      },
      {
        title: 'Leading Litigation Firm Beck Redden Selects iManage for Document and Email Management, Advanced Security and Governance',
        summary:
          'Cornerstone.IT was selected to support Beck Redden\'s move to iManage for document and email management, along with advanced security and governance tooling. The case is framed around modernizing core content management while strengthening controls, policy enforcement, and matter-centric information handling.',
        studyUrl:
          '[https://www.cornerstone.it/leading-litigation-firm-beck-redden-selects-imanage-for-document-and-email-management-advanced-security-and-governance/](https://www.cornerstone.it/leading-litigation-firm-beck-redden-selects-imanage-for-document-and-email-management-advanced-security-and-governance/)',
        sourceName: 'Cornerstone.IT',
        sourceUrl:
          '[https://www.cornerstone.it/leading-litigation-firm-beck-redden-selects-imanage-for-document-and-email-management-advanced-security-and-governance/](https://www.cornerstone.it/leading-litigation-firm-beck-redden-selects-imanage-for-document-and-email-management-advanced-security-and-governance/)',
      },
      {
        title: 'Bi-Coastal Law Firm iManage Migration to the Cloud with Zero End-User Issues',
        summary:
          'Cornerstone.IT documents a cloud migration for a bi-coastal law firm in which the iManage environment was moved with zero end-user issues. The case emphasizes pre-migration planning, data readiness, and execution discipline aimed at minimizing disruption during a document-management platform transition.',
        studyUrl:
          '[https://www.cornerstone.it/assets/pdf/fkks_case-study.pdf](https://www.cornerstone.it/assets/pdf/fkks_case-study.pdf)',
        sourceName: 'Cornerstone.IT',
        sourceUrl:
          '[https://www.cornerstone.it/assets/pdf/fkks_case-study.pdf](https://www.cornerstone.it/assets/pdf/fkks_case-study.pdf)',
      },
    ],
  },
  {
    vendorUuid: '2446a2ce-96ad-403f-81c9-4cf28bcbf9ce',
    brandName: 'Deloitte',
    caseStudies: [
      {
        title: 'Investing in a more authentic customer experience',
        summary:
          'Deloitte worked with Rakuten Securities to create an AI avatar and generative AI-powered investment consultation experience. The case focuses on making digital customer interactions feel more natural and trusted, with user testing showing strong interest in the new approach after a rapid delivery timeline.',
        studyUrl:
          '[https://www.deloitte.com/global/en/what-we-do/case-studies-collection/investing-in-a-more-authentic-customer-experience.html](https://www.deloitte.com/global/en/what-we-do/case-studies-collection/investing-in-a-more-authentic-customer-experience.html)',
        sourceName: 'Deloitte',
        sourceUrl:
          '[https://www.deloitte.com/global/en/what-we-do/case-studies-collection/investing-in-a-more-authentic-customer-experience.html](https://www.deloitte.com/global/en/what-we-do/case-studies-collection/investing-in-a-more-authentic-customer-experience.html)',
      },
      {
        title: 'AstraZeneca digitizing patient experience',
        summary:
          'Deloitte supported AstraZeneca in digitizing patient information leaflets through electronic product information and QR-code access. The case centers on improving patient experience and modernizing how drug information is delivered, moving away from static paper processes toward more accessible digital communication.',
        studyUrl:
          '[https://www.deloitte.com/global/en/Industries/life-sciences-health-care/case-studies/astrazeneca-digitizing-patient-experience.html](https://www.deloitte.com/global/en/Industries/life-sciences-health-care/case-studies/astrazeneca-digitizing-patient-experience.html)',
        sourceName: 'Deloitte',
        sourceUrl:
          '[https://www.deloitte.com/global/en/Industries/life-sciences-health-care/case-studies/astrazeneca-digitizing-patient-experience.html](https://www.deloitte.com/global/en/Industries/life-sciences-health-care/case-studies/astrazeneca-digitizing-patient-experience.html)',
      },
      {
        title: 'Sustainable financial improvement at Liverpool University Hospitals NHS Foundation Trust',
        summary:
          'Deloitte\'s case study on Liverpool University Hospitals NHS Foundation Trust describes a finance-improvement engagement aimed at sustainable performance gains. The story is framed around improving visibility, controls, and decision support so the trust could strengthen financial management over the longer term.',
        studyUrl:
          '[https://www.deloitte.com/global/en/Industries/government-public/case-studies/sustainable-financial-improvement-at-liverpool-university-hospitals-nhs-foundation-trust.html](https://www.deloitte.com/global/en/Industries/government-public/case-studies/sustainable-financial-improvement-at-liverpool-university-hospitals-nhs-foundation-trust.html)',
        sourceName: 'Deloitte',
        sourceUrl:
          '[https://www.deloitte.com/global/en/Industries/government-public/case-studies/sustainable-financial-improvement-at-liverpool-university-hospitals-nhs-foundation-trust.html](https://www.deloitte.com/global/en/Industries/government-public/case-studies/sustainable-financial-improvement-at-liverpool-university-hospitals-nhs-foundation-trust.html)',
      },
      {
        title: 'Herc Rentals reimagines equipment rental experience with Deloitte Digital using AWS',
        summary:
          'Deloitte Digital helped Herc Rentals launch ProControl NextGen, a digital experience for renting, tracking, and optimizing equipment from any device. The case reports growth in digital accounts and telematics engagement after combining ecommerce, IoT data, and AWS services into a more customer-centric platform.',
        studyUrl:
          '[https://www.deloitte.com/content/dam/assets-zone3/us/en/docs/about/2024/us-aws-herc-rentals-case-study.pdf](https://www.deloitte.com/content/dam/assets-zone3/us/en/docs/about/2024/us-aws-herc-rentals-case-study.pdf)',
        sourceName: 'Deloitte',
        sourceUrl:
          '[https://www.deloitte.com/content/dam/assets-zone3/us/en/docs/about/2024/us-aws-herc-rentals-case-study.pdf](https://www.deloitte.com/content/dam/assets-zone3/us/en/docs/about/2024/us-aws-herc-rentals-case-study.pdf)',
      },
    ],
  },
  {
    vendorUuid: '5b3872ba-1a8b-4fb7-beb0-3dbc726ce11d',
    brandName: 'Element Technologies',
    caseStudies: [
      {
        title: 'CLM Case Study',
        summary:
          'Element Technologies built a generative AI contract lifecycle management solution for legal, procurement, and finance workflows. The case describes automating clause extraction, risk review, drafting, and Q&A so teams can shorten cycle times, surface compliance issues earlier, and reduce manual contract-review effort.',
        studyUrl:
          '[https://elementtechnologies.com/clm-case-study/](https://elementtechnologies.com/clm-case-study/)',
        sourceName: 'Element Technologies',
        sourceUrl:
          '[https://elementtechnologies.com/clm-case-study/](https://elementtechnologies.com/clm-case-study/)',
      },
      {
        title: 'Customer 720 Case Study',
        summary:
          'Element Technologies developed Customer 720 for financial institutions that struggle with fragmented customer data. The case shows how the platform combines credit, transaction, complaint, product, and behavioral data to improve customer visibility, support retention and cross-sell analysis, and enable more personalized engagement.',
        studyUrl:
          '[https://elementtechnologies.com/customer-720-case-study/](https://elementtechnologies.com/customer-720-case-study/)',
        sourceName: 'Element Technologies',
        sourceUrl:
          '[https://elementtechnologies.com/customer-720-case-study/](https://elementtechnologies.com/customer-720-case-study/)',
      },
      {
        title: '3D CAD CAM Case Study',
        summary:
          'Element Technologies created a generative AI-driven platform for managing and reusing 3D CAD/CAM assets in manufacturing and engineering. The case highlights duplicate detection, semantic retrieval, and generative design support so teams can cut redundant effort, speed design cycles, and reduce time to market.',
        studyUrl:
          '[https://elementtechnologies.com/3d-cad-cam-case-study/](https://elementtechnologies.com/3d-cad-cam-case-study/)',
        sourceName: 'Element Technologies',
        sourceUrl:
          '[https://elementtechnologies.com/3d-cad-cam-case-study/](https://elementtechnologies.com/3d-cad-cam-case-study/)',
      },
      {
        title: 'Growth Scenario Modeling for Joint Products',
        summary:
          'Element Technologies built scenario-based growth and price-elasticity modeling for Johnson & Johnson joint products. The case describes using sales, pricing, and demographic data to identify demand clusters and growth drivers, helping the client align pricing and contracting strategies more closely to market opportunity.',
        studyUrl:
          '[https://elementtechnologies.com/growth-scenario-modeling-for-joint-products/](https://elementtechnologies.com/growth-scenario-modeling-for-joint-products/)',
        sourceName: 'Element Technologies',
        sourceUrl:
          '[https://elementtechnologies.com/growth-scenario-modeling-for-joint-products/](https://elementtechnologies.com/growth-scenario-modeling-for-joint-products/)',
      },
    ],
  },
  {
    vendorUuid: '9705b261-0cc4-48c3-b06a-ebcae8d88313',
    brandName: 'Epiq',
    caseStudies: [
      {
        title: 'McKercher LLP gains IT relief and gold-star eDiscovery services',
        summary:
          'Epiq supported McKercher LLP with managed eDiscovery services and Relativity expertise that reduced internal IT burden. The case says the firm improved review speed by roughly 50% to 60% while gaining more dependable operational support for litigation and information-governance work.',
        studyUrl:
          '[https://www.epiqglobal.com/en-ca/resource-center/case-study/mckercher-llp-gains-it-relief-and-gold-star-ediscovery-services](https://www.epiqglobal.com/en-ca/resource-center/case-study/mckercher-llp-gains-it-relief-and-gold-star-ediscovery-services)',
        sourceName: 'Epiq',
        sourceUrl:
          '[https://www.epiqglobal.com/en-ca/resource-center/case-study/mckercher-llp-gains-it-relief-and-gold-star-ediscovery-services](https://www.epiqglobal.com/en-ca/resource-center/case-study/mckercher-llp-gains-it-relief-and-gold-star-ediscovery-services)',
      },
      {
        title: 'Oil and gas company improves discovery workflows and reduces costs using AI to complete first-level review',
        summary:
          'Epiq helped a multinational oil and gas company use AI for first-level review in discovery workflows. The case reports a reduction of more than 80% in documents needing human review, about US$2 million in savings, and ROI above 650% through its AI Discovery Assistant and analytics tools.',
        studyUrl:
          '[https://www.epiqglobal.com/en-ca/resource-center/case-study/oil-and-gas-company-improves-discovery-workflows-and-reduces-costs-using-ai-to-complete-first-level](https://www.epiqglobal.com/en-ca/resource-center/case-study/oil-and-gas-company-improves-discovery-workflows-and-reduces-costs-using-ai-to-complete-first-level)',
        sourceName: 'Epiq',
        sourceUrl:
          '[https://www.epiqglobal.com/en-ca/resource-center/case-study/oil-and-gas-company-improves-discovery-workflows-and-reduces-costs-using-ai-to-complete-first-level](https://www.epiqglobal.com/en-ca/resource-center/case-study/oil-and-gas-company-improves-discovery-workflows-and-reduces-costs-using-ai-to-complete-first-level)',
      },
    ],
  },
  {
    vendorUuid: '74534dd1-ed5b-44ba-9085-62e0e1a8d50f',
    brandName: 'eSentio Technologies',
    caseStudies: [
      {
        title:
          'Ballard Spahr enhances document management while strengthening security and compliance',
        summary:
          'NetDocuments documents Ballard Spahr\'s document-management modernization and security program, with eSentio referenced as an implementation and advisory partner. The story centers on improving compliance controls, strengthening governance, and giving the firm a more resilient cloud-based information foundation.',
        studyUrl:
          '[https://www.netdocuments.com/customer-stories/ballard-spahr-enhances-document-management-while-strengthening-security-and-compliance/](https://www.netdocuments.com/customer-stories/ballard-spahr-enhances-document-management-while-strengthening-security-and-compliance/)',
        sourceName: 'NetDocuments',
        sourceUrl:
          '[https://www.netdocuments.com/customer-stories/ballard-spahr-enhances-document-management-while-strengthening-security-and-compliance/](https://www.netdocuments.com/customer-stories/ballard-spahr-enhances-document-management-while-strengthening-security-and-compliance/)',
      },
      {
        title:
          'Drinker Biddle & Reath transforms legal service delivery by moving to the cloud',
        summary:
          'iManage describes Drinker Biddle & Reath\'s move to iManage Cloud with support from eSentio as the implementation partner. The case focuses on modernizing document management, improving reliability and user experience, and helping the firm shift legal-service delivery onto a more scalable cloud platform.',
        studyUrl:
          '[https://imanage.com/media/jxcbdmjc/drinkerbiddle_casestudy_feb2021_v1.pdf](https://imanage.com/media/jxcbdmjc/drinkerbiddle_casestudy_feb2021_v1.pdf)',
        sourceName: 'iManage',
        sourceUrl:
          '[https://imanage.com/media/jxcbdmjc/drinkerbiddle_casestudy_feb2021_v1.pdf](https://imanage.com/media/jxcbdmjc/drinkerbiddle_casestudy_feb2021_v1.pdf)',
      },
    ],
  },
  {
    vendorUuid: '5e97024c-46ab-41c1-b591-2d531015b0cb',
    brandName: 'Harbor',
    caseStudies: [
      {
        title: 'Thirsk Winton Migrate From Private Cloud to iManage Cloud',
        summary:
          'Harbor helped Thirsk Winton upgrade and migrate its privately hosted iManage Work environment to iManage Cloud. The case highlights the movement of nearly one million documents to a more scalable platform with better cost predictability, accessibility, and long-term support for the firm\'s growth plans.',
        studyUrl:
          '[https://harborglobal.com/case-studies/thirsk-winton-migrate-from-private-cloud-to-imanage-cloud/](https://harborglobal.com/case-studies/thirsk-winton-migrate-from-private-cloud-to-imanage-cloud/)',
        sourceName: 'Harbor',
        sourceUrl:
          '[https://harborglobal.com/case-studies/thirsk-winton-migrate-from-private-cloud-to-imanage-cloud/](https://harborglobal.com/case-studies/thirsk-winton-migrate-from-private-cloud-to-imanage-cloud/)',
      },
      {
        title: 'White & Case Partners with Harbor for Added Expertise in Procurement',
        summary:
          'Harbor partnered with White & Case to extend procurement and vendor-management capacity as sourcing work became more complex. The case focuses on Harbor\'s support across onboarding, diversity, ESG, contract compliance, and negotiation activities, giving the firm deeper specialist coverage without expanding internal headcount at the same pace.',
        studyUrl:
          '[https://harborglobal.com/case-studies/broader-experience-strengthens-vmo-procurement-processes/](https://harborglobal.com/case-studies/broader-experience-strengthens-vmo-procurement-processes/)',
        sourceName: 'Harbor',
        sourceUrl:
          '[https://harborglobal.com/case-studies/broader-experience-strengthens-vmo-procurement-processes/](https://harborglobal.com/case-studies/broader-experience-strengthens-vmo-procurement-processes/)',
      },
    ],
  },
  {
    vendorUuid: '46b3a70d-7535-4c83-a12f-6d9d86df4454',
    brandName: 'Helm360',
    caseStudies: [
      {
        title: 'Returning time to Raines Feldman\'s Finance Team with Termi',
        summary:
          'Helm360 deployed Termi for Raines Feldman to give attorneys and finance staff easier access to billing and collections information. The case says the solution cut routine finance interruptions to about five calls per day per team member and improved collections by 3% in a challenging year.',
        studyUrl:
          '[https://helm360.com/wp-content/uploads/2023/12/Helm360-Raines-Feldman-Case-Study-V4.pdf](https://helm360.com/wp-content/uploads/2023/12/Helm360-Raines-Feldman-Case-Study-V4.pdf)',
        sourceName: 'Helm360',
        sourceUrl:
          '[https://helm360.com/wp-content/uploads/2023/12/Helm360-Raines-Feldman-Case-Study-V4.pdf](https://helm360.com/wp-content/uploads/2023/12/Helm360-Raines-Feldman-Case-Study-V4.pdf)',
      },
      {
        title: 'Cohen Highley Returns Time to their CFO and Empowers their Attorneys with Termi for ProLaw',
        summary:
          'Helm360 implemented Termi for ProLaw at Cohen Highley to improve reporting and billing visibility. The case says the firm\'s CFO saves around 100 hours per year, attorneys gain faster access to WIP and collections data, and the firm benefits from stronger data accuracy and less manual spreadsheet work.',
        studyUrl:
          '[https://helm360.com/wp-content/uploads/2022/07/Helm360-Case-Study-Cohen-Highley-v3.pdf](https://helm360.com/wp-content/uploads/2022/07/Helm360-Case-Study-Cohen-Highley-v3.pdf)',
        sourceName: 'Helm360',
        sourceUrl:
          '[https://helm360.com/wp-content/uploads/2022/07/Helm360-Case-Study-Cohen-Highley-v3.pdf](https://helm360.com/wp-content/uploads/2022/07/Helm360-Case-Study-Cohen-Highley-v3.pdf)',
      },
      {
        title: 'Helm360 Merges Aderant Data to Elite Enterprise in Record Time',
        summary:
          'Helm360 helped Harneys convert and merge Aderant data into Elite Enterprise in about two months. The case focuses on preserving historical and financial integrity while moving a global firm\'s data onto a unified platform quickly enough to support a tightly timed legal-finance systems transition.',
        studyUrl:
          '[https://helm360.com/wp-content/uploads/2020/12/Harney-Aderant-to-Enterprise-case-study-.pdf](https://helm360.com/wp-content/uploads/2020/12/Harney-Aderant-to-Enterprise-case-study-.pdf)',
        sourceName: 'Helm360',
        sourceUrl:
          '[https://helm360.com/wp-content/uploads/2020/12/Harney-Aderant-to-Enterprise-case-study-.pdf](https://helm360.com/wp-content/uploads/2020/12/Harney-Aderant-to-Enterprise-case-study-.pdf)',
      },
    ],
  },
  {
    vendorUuid: 'e2d7f483-16b7-4220-8f98-bb399edd14cc',
    brandName: 'Inoutsource',
    caseStudies: [
      {
        title: 'New Business Intake: Laying the Foundation for the Data-Driven Firm',
        summary:
          'InOutsource helped Shearman & Sterling centralize new-business intake on Intapp to move the firm toward a more data-driven operating model. The case describes replacing fragmented processes with a more structured intake foundation that supports reporting, governance, and efficiency across a global legal organization.',
        studyUrl:
          '[https://inoutsource.com/case-study-new-business-intake-laying-the-foundation-for-the-data-driven-firm/](https://inoutsource.com/case-study-new-business-intake-laying-the-foundation-for-the-data-driven-firm/)',
        sourceName: 'InOutsource',
        sourceUrl:
          '[https://inoutsource.com/case-study-new-business-intake-laying-the-foundation-for-the-data-driven-firm/](https://inoutsource.com/case-study-new-business-intake-laying-the-foundation-for-the-data-driven-firm/)',
      },
      {
        title: 'Elevating Law Firm Information Governance: Husch Blackwell',
        summary:
          'InOutsource worked with Husch Blackwell to modernize information governance and physical-records management across 23 offices. The case centers on consolidating records data under a more coordinated operating model with Iron Mountain, helping reduce cost and risk while improving visibility and staff productivity.',
        studyUrl:
          '[https://inoutsource.com/case-study-elevating-law-firm-information-governance-husch-blackwell/](https://inoutsource.com/case-study-elevating-law-firm-information-governance-husch-blackwell/)',
        sourceName: 'InOutsource',
        sourceUrl:
          '[https://inoutsource.com/case-study-elevating-law-firm-information-governance-husch-blackwell/](https://inoutsource.com/case-study-elevating-law-firm-information-governance-husch-blackwell/)',
      },
      {
        title: 'Fisher Phillips: New Case Filing Intelligence',
        summary:
          'InOutsource helped Fisher Phillips create intelligence around new case filings so the firm could identify opportunities faster and respond with better business-development insight. The case highlights workflow and data improvements that turned court-filing information into a more actionable revenue and client-monitoring capability.',
        studyUrl:
          '[https://inoutsource.com/case-study-fisher-phillips-new-case-filing-intelligence/](https://inoutsource.com/case-study-fisher-phillips-new-case-filing-intelligence/)',
        sourceName: 'InOutsource',
        sourceUrl:
          '[https://inoutsource.com/case-study-fisher-phillips-new-case-filing-intelligence/](https://inoutsource.com/case-study-fisher-phillips-new-case-filing-intelligence/)',
      },
    ],
  },
  {
    vendorUuid: '6537cb6e-dc06-452b-ae59-abab3dd61a81',
    brandName: 'KPMG',
    caseStudies: [
      {
        title: 'Global human resources transformation',
        summary:
          'KPMG worked with Tyson Foods on a global HR transformation using Workday and ServiceNow. The case describes creating a more unified employee experience for 130,000-plus team members, expanding self-service access, and driving early adoption through digital tools such as tablets for frontline workers.',
        studyUrl:
          '[https://kpmg.com/us/en/how-we-work/client-stories/global-human-resources-transformation.html](https://kpmg.com/us/en/how-we-work/client-stories/global-human-resources-transformation.html)',
        sourceName: 'KPMG',
        sourceUrl:
          '[https://kpmg.com/us/en/how-we-work/client-stories/global-human-resources-transformation.html](https://kpmg.com/us/en/how-we-work/client-stories/global-human-resources-transformation.html)',
      },
    ],
  },
  {
    vendorUuid: 'f96c70b5-f535-44f0-8745-3ebc72255b41',
    brandName: 'Kraft Kennedy',
    caseStudies: [
      {
        title: 'Future-Ready Law Firm Shares Secret to Success',
        summary:
          'Kraft Kennedy worked with Gray Reed to expand IT operations for the modern workplace. The story frames the engagement around managed services and strategic guidance that helped the firm become more remote-ready, strengthen day-to-day support, and plan technology investments with a longer-term operating model in mind.',
        studyUrl:
          '[https://www.kraftkennedy.com/stories/future-ready-law-firm-shares-secret-to-success/](https://www.kraftkennedy.com/stories/future-ready-law-firm-shares-secret-to-success/)',
        sourceName: 'Kraft Kennedy',
        sourceUrl:
          '[https://www.kraftkennedy.com/stories/future-ready-law-firm-shares-secret-to-success/](https://www.kraftkennedy.com/stories/future-ready-law-firm-shares-secret-to-success/)',
      },
      {
        title: 'Bryant Miller Olive Taps Kraft Kennedy for Managed Services Expertise',
        summary:
          'Kraft Kennedy supported Bryant Miller Olive with managed services tailored to a legal IT environment. The case emphasizes access to deeper specialist expertise, stronger problem resolution, and better future planning so the firm could rely on an MSP that understands the complexity of law-firm technology operations.',
        studyUrl:
          '[https://www.kraftkennedy.com/stories/managed-services-case-study-bmo/](https://www.kraftkennedy.com/stories/managed-services-case-study-bmo/)',
        sourceName: 'Kraft Kennedy',
        sourceUrl:
          '[https://www.kraftkennedy.com/stories/managed-services-case-study-bmo/](https://www.kraftkennedy.com/stories/managed-services-case-study-bmo/)',
      },
      {
        title: 'Ice Miller Thrives with Cloud-First Strategy and Document Management',
        summary:
          'Kraft Kennedy helped Ice Miller modernize a long-standing document management environment through a cloud-first strategy. The case describes delivering the project during the pandemic, with the goal of replacing an outdated DMS and giving the firm a more flexible, scalable foundation for information management.',
        studyUrl:
          '[https://www.kraftkennedy.com/stories/ice-miller-document-management-case-study/](https://www.kraftkennedy.com/stories/ice-miller-document-management-case-study/)',
        sourceName: 'Kraft Kennedy',
        sourceUrl:
          '[https://www.kraftkennedy.com/stories/ice-miller-document-management-case-study/](https://www.kraftkennedy.com/stories/ice-miller-document-management-case-study/)',
      },
    ],
  },
  {
    vendorUuid: 'cedfd3b3-481c-4eb6-8520-b2dc15a5bc05',
    brandName: 'LexisNexis',
    caseStudies: [
      {
        title: 'Doximity Better Quantifies Value for Hospital Clients With MarketView Data to Show Referral Networks',
        summary:
          'LexisNexis Risk Solutions helped Doximity use MarketView data to quantify referral-network value for hospital clients. The case shows how de-identified claims data was turned into on-demand insights that supported retention, improved Net Promoter Score, and created a more concrete ROI story for hospital relationships.',
        studyUrl:
          '[https://risk.lexisnexis.com/insights-resources/case-study/marketview-case-study-with-doximity](https://risk.lexisnexis.com/insights-resources/case-study/marketview-case-study-with-doximity)',
        sourceName: 'LexisNexis Risk Solutions',
        sourceUrl:
          '[https://risk.lexisnexis.com/insights-resources/case-study/marketview-case-study-with-doximity](https://risk.lexisnexis.com/insights-resources/case-study/marketview-case-study-with-doximity)',
      },
      {
        title: 'Novuna increases fraud prevention value by 20%+ in two months',
        summary:
          'LexisNexis Risk Solutions worked with Novuna to strengthen fraud prevention using ThreatMetrix digital identity intelligence. The case reports more than 20% improvement in fraud-prevention value within two months, a sharp drop in referral volumes, and better confirmed-fraud detection during digital onboarding and account activity.',
        studyUrl:
          '[https://risk.lexisnexis.com/insights-resources/case-study/how-novuna-transformed-fraud-prevention-with-lexisnexis-threatmetrix-digital-insights](https://risk.lexisnexis.com/insights-resources/case-study/how-novuna-transformed-fraud-prevention-with-lexisnexis-threatmetrix-digital-insights)',
        sourceName: 'LexisNexis Risk Solutions',
        sourceUrl:
          '[https://risk.lexisnexis.com/insights-resources/case-study/how-novuna-transformed-fraud-prevention-with-lexisnexis-threatmetrix-digital-insights](https://risk.lexisnexis.com/insights-resources/case-study/how-novuna-transformed-fraud-prevention-with-lexisnexis-threatmetrix-digital-insights)',
      },
      {
        title: 'Coast Capital Scales Fraud Defense With LexisNexis ThreatMetrix',
        summary:
          'LexisNexis Risk Solutions helped Coast Capital expand fraud defenses with ThreatMetrix. The case focuses on balancing member experience and risk control by enabling faster onboarding and transaction decisions, targeted step-up authentication, and positive ROI within the first year of deployment.',
        studyUrl:
          '[https://risk.lexisnexis.com/insights-resources/case-study/coast-capital-scales-fraud-defense-with-lexisnexis-threatmetrix](https://risk.lexisnexis.com/insights-resources/case-study/coast-capital-scales-fraud-defense-with-lexisnexis-threatmetrix)',
        sourceName: 'LexisNexis Risk Solutions',
        sourceUrl:
          '[https://risk.lexisnexis.com/insights-resources/case-study/coast-capital-scales-fraud-defense-with-lexisnexis-threatmetrix](https://risk.lexisnexis.com/insights-resources/case-study/coast-capital-scales-fraud-defense-with-lexisnexis-threatmetrix)',
      },
    ],
  },
  {
    vendorUuid: '9ccda488-f3d9-4075-a9dd-af02dbee2f74',
    brandName: 'Premier Technology Solutions',
    caseStudies: [
      {
        title: 'Case Study: Accelerating Expansion: Tailored Solutions for TGI Fridays & The Sporting Globe',
        summary:
          'Premier Technology Solutions supported TGI Fridays and The Sporting Globe with technology foundations for venue expansion. The case describes standardizing internet and EFTPOS setup and improving central visibility into sales and marketing data so new locations could be opened more efficiently and managed more consistently.',
        studyUrl:
          '[https://www.premiertech.com.au/case-study-accelerating-expansion-tailored-solutions-for-tgi-fridays-the-sporting-globe/](https://www.premiertech.com.au/case-study-accelerating-expansion-tailored-solutions-for-tgi-fridays-the-sporting-globe/)',
        sourceName: 'Premier Technology Solutions',
        sourceUrl:
          '[https://www.premiertech.com.au/case-study-accelerating-expansion-tailored-solutions-for-tgi-fridays-the-sporting-globe/](https://www.premiertech.com.au/case-study-accelerating-expansion-tailored-solutions-for-tgi-fridays-the-sporting-globe/)',
      },
      {
        title: 'Case Study: Empowering TyreMax with Sophisticated Warehouse Management System',
        summary:
          'Premier Technology Solutions helped TyreMax implement a wireless, scalable warehouse management system across multiple branches. The case highlights standardizing operational processes, improving data integrity and efficiency, and removing constraints that had limited inventory expansion and broader business growth.',
        studyUrl:
          '[https://www.premiertech.com.au/case-study-empowering-tyremax-with-sophisticated-warehouse-management-system/](https://www.premiertech.com.au/case-study-empowering-tyremax-with-sophisticated-warehouse-management-system/)',
        sourceName: 'Premier Technology Solutions',
        sourceUrl:
          '[https://www.premiertech.com.au/case-study-empowering-tyremax-with-sophisticated-warehouse-management-system/](https://www.premiertech.com.au/case-study-empowering-tyremax-with-sophisticated-warehouse-management-system/)',
      },
      {
        title: 'The Digital Transformation Journey with Composite Materials Engineering',
        summary:
          'Premier Technology Solutions guided Composite Materials Engineering through ERP selection and broader digital transformation. The case focuses on replacing fragmented manual processes, strengthening the underlying IT environment to support a new system, and giving the business better data transparency and a more scalable operating base.',
        studyUrl:
          '[https://www.premiertech.com.au/case-study-the-digital-transformation-journey-with-composite-materials-engineering/](https://www.premiertech.com.au/case-study-the-digital-transformation-journey-with-composite-materials-engineering/)',
        sourceName: 'Premier Technology Solutions',
        sourceUrl:
          '[https://www.premiertech.com.au/case-study-the-digital-transformation-journey-with-composite-materials-engineering/](https://www.premiertech.com.au/case-study-the-digital-transformation-journey-with-composite-materials-engineering/)',
      },
      {
        title: 'Case Study: Jarvis Walker\'s Productive & Strategic Switch to Premier Tech',
        summary:
          'Premier Technology Solutions helped Jarvis Walker move from reactive IT support to a more strategic managed-services model. The case says the business regained about 100 hours per month previously lost to delays and recurring issues, while gaining a more stable environment and clearer IT leadership.',
        studyUrl:
          '[https://www.premiertech.com.au/case-study-jarvis-walkers-productive-strategic-switch-to-premier-tech/](https://www.premiertech.com.au/case-study-jarvis-walkers-productive-strategic-switch-to-premier-tech/)',
        sourceName: 'Premier Technology Solutions',
        sourceUrl:
          '[https://www.premiertech.com.au/case-study-jarvis-walkers-productive-strategic-switch-to-premier-tech/](https://www.premiertech.com.au/case-study-jarvis-walkers-productive-strategic-switch-to-premier-tech/)',
      },
    ],
  },
  {
    vendorUuid: '45fccc84-9177-4807-8fb8-44b5cb921b4b',
    brandName: 'Proventeq',
    caseStudies: [
      {
        title: 'Client Case Study: McAllister Olivarius, UK',
        summary:
          'Proventeq helped McAllister Olivarius modernize ECM by moving iManage content to SharePoint Online. The case highlights handling content from multiple divisions, preserving structure and metadata across more than 500,000 files, and completing the final migration window in about 48 hours with auditability built in.',
        studyUrl:
          '[https://www.proventeq.com/client/mcallister-olivarius-uk](https://www.proventeq.com/client/mcallister-olivarius-uk)',
        sourceName: 'Proventeq',
        sourceUrl:
          '[https://www.proventeq.com/client/mcallister-olivarius-uk](https://www.proventeq.com/client/mcallister-olivarius-uk)',
      },
      {
        title: 'Client Case Study: LifeArc UK',
        summary:
          'Proventeq helped LifeArc migrate from Documentum to Microsoft 365, including SharePoint Online, OneDrive, and Teams. The case is framed around cost reduction, stronger collaboration, and secure handling of sensitive intellectual property while moving a research charity off legacy content-management infrastructure.',
        studyUrl:
          '[https://www.proventeq.com/client/lifearc-uk](https://www.proventeq.com/client/lifearc-uk)',
        sourceName: 'Proventeq',
        sourceUrl:
          '[https://www.proventeq.com/client/lifearc-uk](https://www.proventeq.com/client/lifearc-uk)',
      },
      {
        title: 'Client Case Study: Airtel, India',
        summary:
          'Proventeq supported Airtel in modernizing ECM by migrating more than 110 TB from IBM FileNet to SharePoint. The case emphasizes phased delivery, audit trail controls, and a roughly 50% reduction in document search time after the move to a more accessible and efficient content environment.',
        studyUrl:
          '[https://www.proventeq.com/client/airtel-india](https://www.proventeq.com/client/airtel-india)',
        sourceName: 'Proventeq',
        sourceUrl:
          '[https://www.proventeq.com/client/airtel-india](https://www.proventeq.com/client/airtel-india)',
      },
    ],
  },
  {
    vendorUuid: '74bdcdee-0cbe-4467-b3a2-200272993b25',
    brandName: 'RBRO',
    caseStudies: [
      {
        title: 'Sub Rosa',
        summary:
          'RBRO Solutions helped boutique estate-planning firm Sub Rosa launch with iManage Work 10 in the cloud. The case focuses on standing up a modern matter-centric document environment with Office 365 integration, mobility support, and a standardized structure that improved responsiveness to client needs from the start.',
        studyUrl:
          '[https://www.rbrosolutions.com/case-study/sub-rosa](https://www.rbrosolutions.com/case-study/sub-rosa)',
        sourceName: 'RBRO Solutions',
        sourceUrl:
          '[https://www.rbrosolutions.com/case-study/sub-rosa](https://www.rbrosolutions.com/case-study/sub-rosa)',
      },
      {
        title: 'Gowling WLG',
        summary:
          'RBRO Solutions supported Gowling WLG\'s migration from an on-premises DMS to iManage Cloud. The case describes a phased program beginning with Moscow, then moving all Canadian offices and tens of millions of documents over a single weekend to improve performance and simplify infrastructure management.',
        studyUrl:
          '[https://www.rbrosolutions.com/case-study/gowling-wlg](https://www.rbrosolutions.com/case-study/gowling-wlg)',
        sourceName: 'RBRO Solutions',
        sourceUrl:
          '[https://www.rbrosolutions.com/case-study/gowling-wlg](https://www.rbrosolutions.com/case-study/gowling-wlg)',
      },
      {
        title: 'RBRO Provides "Seamless" Transition to the iManage Cloud for Taft, Stettinius & Hollister LLP',
        summary:
          'RBRO Solutions was selected by Taft, Stettinius & Hollister LLP for an iManage Cloud transition covering about 800 users across 10 offices. The public release describes a low-downtime migration designed to modernize document management while keeping the user experience stable during cutover.',
        studyUrl:
          '[https://www.prweb.com/releases/rbro-provides-seamless-transition-to-the-imanage-cloud-for-taft-stettinius-amp-hollister-llp-816709258.html](https://www.prweb.com/releases/rbro-provides-seamless-transition-to-the-imanage-cloud-for-taft-stettinius-amp-hollister-llp-816709258.html)',
        sourceName: 'PRWeb',
        sourceUrl:
          '[https://www.prweb.com/releases/rbro-provides-seamless-transition-to-the-imanage-cloud-for-taft-stettinius-amp-hollister-llp-816709258.html](https://www.prweb.com/releases/rbro-provides-seamless-transition-to-the-imanage-cloud-for-taft-stettinius-amp-hollister-llp-816709258.html)',
      },
    ],
  },
  {
    vendorUuid: '587ded29-ed02-4151-b590-a7ca99632efd',
    brandName: 'Slalom',
    caseStudies: [
      {
        title: 'Genie contact center agent efficiency',
        summary:
          'Slalom helped Genie improve contact center agent efficiency through change management and AI-enhanced capabilities. The customer story says the work reduced average call wait times by 50%, showing how the combination of operational redesign and intelligent tooling improved service performance.',
        studyUrl:
          '[https://www.slalom.com/us/en/customer-stories/genie-contact-center-agent-efficiency](https://www.slalom.com/us/en/customer-stories/genie-contact-center-agent-efficiency)',
        sourceName: 'Slalom',
        sourceUrl:
          '[https://www.slalom.com/us/en/customer-stories/genie-contact-center-agent-efficiency](https://www.slalom.com/us/en/customer-stories/genie-contact-center-agent-efficiency)',
      },
      {
        title: 'DSW',
        summary:
          'Slalom partnered with Google Cloud and DSW Designer Shoe Warehouse to build a scalable loyalty platform. The case highlights near real-time personalization for roughly 26 million VIP loyalty members, giving the retailer a more flexible way to deliver relevant offers and modernize customer engagement.',
        studyUrl:
          '[https://www.slalom.com/us/en/customer-stories/dsw](https://www.slalom.com/us/en/customer-stories/dsw)',
        sourceName: 'Slalom',
        sourceUrl:
          '[https://www.slalom.com/us/en/customer-stories/dsw](https://www.slalom.com/us/en/customer-stories/dsw)',
      },
      {
        title: 'Slalom Partners with Virgin Voyages for Generative AI Solution',
        summary:
          'Slalom worked with Virgin Voyages to build Vivi, a generative AI-powered digital human on Salesforce. The story centers on creating a more empathetic and capable customer-service experience that could answer complex questions and push beyond the limitations of a standard chatbot.',
        studyUrl:
          '[https://www.slalom.com/us/en/customer-stories/virgin-voyages](https://www.slalom.com/us/en/customer-stories/virgin-voyages)',
        sourceName: 'Slalom',
        sourceUrl:
          '[https://www.slalom.com/us/en/customer-stories/virgin-voyages](https://www.slalom.com/us/en/customer-stories/virgin-voyages)',
      },
      {
        title: 'California Water Service customer engagement',
        summary:
          'Slalom helped California Water Service improve customer engagement using Salesforce Marketing Cloud and a customer portal. The case describes more personalized communications, lower manual data entry, and faster campaign execution for a utility that needs to communicate clearly with millions of customers.',
        studyUrl:
          '[https://www.slalom.com/us/en/customer-stories/cal-water-customer-engagement](https://www.slalom.com/us/en/customer-stories/cal-water-customer-engagement)',
        sourceName: 'Slalom',
        sourceUrl:
          '[https://www.slalom.com/us/en/customer-stories/cal-water-customer-engagement](https://www.slalom.com/us/en/customer-stories/cal-water-customer-engagement)',
      },
    ],
  },
  {
    vendorUuid: 'e216bff6-709f-48d5-b1ca-74bfe326ce8d',
    brandName: 'Stone Consulting',
    caseStudies: [
      {
        title: 'Farella Braun + Martel makes the employee and client experience seamless with iManage',
        summary:
          'Stone Consulting Team publicly cites its support for Farella Braun + Martel\'s iManage rollout, including the secure movement of about 20 million documents. The story frames Stone\'s role around hands-on deployment support that gave the firm confidence during rollout and contributed to a smoother employee and client experience.',
        studyUrl:
          '[https://stoneconsultingteam.com/awards-and-recognition/farella-braun-martel-makes-the-employee-and-client-experience-seamless-with-imanag/](https://stoneconsultingteam.com/awards-and-recognition/farella-braun-martel-makes-the-employee-and-client-experience-seamless-with-imanag/)',
        sourceName: 'Stone Consulting Team',
        sourceUrl:
          '[https://stoneconsultingteam.com/awards-and-recognition/farella-braun-martel-makes-the-employee-and-client-experience-seamless-with-imanag/](https://stoneconsultingteam.com/awards-and-recognition/farella-braun-martel-makes-the-employee-and-client-experience-seamless-with-imanag/)',
      },
    ],
  },
  {
    vendorUuid: 'ea5bd7c8-f3bb-4da1-961b-35db401013b5',
    brandName: 'Thomson Reuters',
    caseStudies: [
      {
        title: 'Alliance Pharma transforms legal operations with HighQ',
        summary:
          'Thomson Reuters documents how Alliance Pharma used HighQ to modernize legal operations, especially contract management and IP oversight. The case reports hundreds of lawyer hours saved in the first year, NDA turnaround under four minutes, and a faster trademark-renewal process through workflow automation and better data visibility.',
        studyUrl:
          '[https://legal.thomsonreuters.com/en/insights/case-studies/alliance-pharma-transforms-legal-operations-with-highq](https://legal.thomsonreuters.com/en/insights/case-studies/alliance-pharma-transforms-legal-operations-with-highq)',
        sourceName: 'Thomson Reuters',
        sourceUrl:
          '[https://legal.thomsonreuters.com/en/insights/case-studies/alliance-pharma-transforms-legal-operations-with-highq](https://legal.thomsonreuters.com/en/insights/case-studies/alliance-pharma-transforms-legal-operations-with-highq)',
      },
    ],
  },
  {
    vendorUuid: '834a9f7b-df00-4ba6-b9fa-6feef9805a9c',
    brandName: 'TitanFile',
    caseStudies: [
      {
        title: 'Hay & Watson Case Study',
        summary:
          'TitanFile helped Hay & Watson replace password-protected file exchange with a secure client portal hosted on Canadian servers. The case reports 90% fewer client support calls, stronger security, improved staff efficiency, and better client satisfaction through easier self-serve collaboration.',
        studyUrl:
          '[https://www.titanfile.com/resources/case-studies/hay-watson-case-study/](https://www.titanfile.com/resources/case-studies/hay-watson-case-study/)',
        sourceName: 'TitanFile',
        sourceUrl:
          '[https://www.titanfile.com/resources/case-studies/hay-watson-case-study/](https://www.titanfile.com/resources/case-studies/hay-watson-case-study/)',
      },
      {
        title: 'Crowe Soberman LLP Case Study',
        summary:
          'TitanFile enabled Crowe Soberman to let clients securely upload receipts, tax documents, and other files year-round through a client portal. The case highlights high adoption, quicker turnaround times, less paper handling, and a more convenient way to exchange sensitive accounting documents outside tax season peaks.',
        studyUrl:
          '[https://www.titanfile.com/resources/case-studies/crowe-soberman-llp-case-study/](https://www.titanfile.com/resources/case-studies/crowe-soberman-llp-case-study/)',
        sourceName: 'TitanFile',
        sourceUrl:
          '[https://www.titanfile.com/resources/case-studies/crowe-soberman-llp-case-study/](https://www.titanfile.com/resources/case-studies/crowe-soberman-llp-case-study/)',
      },
    ],
  },
  {
    vendorUuid: '5a25fcec-c56b-4e11-8b56-ab7ac72b6616',
    brandName: 'Wise Consulting',
    caseStudies: [
      {
        title: 'UKG HR/HCM Project by Wise Consulting (RSM)',
        summary:
          'Raven Intelligence documents a Wise Consulting UKG implementation for a finance, banking, and insurance organization in North America. The review describes HCM, talent, recruiting, and payroll work that finished on schedule and on budget, offering public evidence of a successful multi-module HR transformation project.',
        studyUrl:
          '[https://ravenintel.com/lp-reviews/ultimate-software-hr-core-talent-management-recruiting-payroll-implementation-17/](https://ravenintel.com/lp-reviews/ultimate-software-hr-core-talent-management-recruiting-payroll-implementation-17/)',
        sourceName: 'Raven Intelligence',
        sourceUrl:
          '[https://ravenintel.com/lp-reviews/ultimate-software-hr-core-talent-management-recruiting-payroll-implementation-17/](https://ravenintel.com/lp-reviews/ultimate-software-hr-core-talent-management-recruiting-payroll-implementation-17/)',
      },
      {
        title: 'UKG HR/HCM Project by Wise Consulting (RSM) - Legal',
        summary:
          'Raven Intelligence also lists a Wise Consulting UKG project for a legal organization spanning EMEA and North America. The public review covers HR Core and Time & Attendance work across deployment, add-on phases, optimization, training, and globalization, and says the project was delivered on schedule.',
        studyUrl:
          '[https://ravenintel.com/lp-reviews/ultimate-software-hr-core-time-attendance-implementation/](https://ravenintel.com/lp-reviews/ultimate-software-hr-core-time-attendance-implementation/)',
        sourceName: 'Raven Intelligence',
        sourceUrl:
          '[https://ravenintel.com/lp-reviews/ultimate-software-hr-core-time-attendance-implementation/](https://ravenintel.com/lp-reviews/ultimate-software-hr-core-time-attendance-implementation/)',
      },
      {
        title: 'UKG HR/HCM Project by Wise Consulting (RSM) - Transportation / Distribution',
        summary:
          'Raven Intelligence provides a public review of Wise Consulting\'s UKG support for a transportation and distribution company with 5,000 to 10,000 employees. The entry covers ongoing HCM, HRIS, and payroll support and says the work met schedule and budget expectations while earning strong implementation ratings.',
        studyUrl:
          '[https://ravenintel.com/lp-reviews/ukg-project/](https://ravenintel.com/lp-reviews/ukg-project/)',
        sourceName: 'Raven Intelligence',
        sourceUrl:
          '[https://ravenintel.com/lp-reviews/ukg-project/](https://ravenintel.com/lp-reviews/ukg-project/)',
      },
    ],
  },
  {
    vendorUuid: '9675b1dd-8bab-4685-8992-e0f5938df19d',
    brandName: 'Zendesk Pro Services',
    caseStudies: [
      {
        title: 'KRAFTON satisfies 1 million annual inquiries with Zendesk automation',
        summary:
          'Zendesk documents how KRAFTON modernized support across global game brands with an integrated service environment. The case says automation helped the company handle around 1 million annual inquiries while reducing ticket-processing work, lowering agent costs, and cutting inquiry volume through self-service.',
        studyUrl:
          '[https://www.zendesk.com/in/customer/krafton/](https://www.zendesk.com/in/customer/krafton/)',
        sourceName: 'Zendesk',
        sourceUrl:
          '[https://www.zendesk.com/in/customer/krafton/](https://www.zendesk.com/in/customer/krafton/)',
      },
      {
        title: 'Spoonflower ups efficiency and self-service with smart integrations',
        summary:
          'Zendesk highlights Spoonflower\'s use of Zendesk and Forethought integrations to improve ticket handling and self-service. The customer story reports stronger deflection, high one-touch resolution, improved CSAT, and better reporting, showing how workflow integration helped a growing ecommerce brand scale support.',
        studyUrl:
          '[https://www.zendesk.com/in/customer/spoonflower/](https://www.zendesk.com/in/customer/spoonflower/)',
        sourceName: 'Zendesk',
        sourceUrl:
          '[https://www.zendesk.com/in/customer/spoonflower/](https://www.zendesk.com/in/customer/spoonflower/)',
      },
      {
        title: 'The Good Meal Co serves up an AI-powered voice and CCaaS solution',
        summary:
          'Zendesk describes how The Good Meal Co modernized contact center operations with Zendesk for Contact Center and AWS-linked voice capabilities. The story emphasizes a fast migration, improved analytics, higher efficiency, and better agent experience as the company replaced older support infrastructure.',
        studyUrl:
          '[https://www.zendesk.com/in/customer/the-good-meal-co/](https://www.zendesk.com/in/customer/the-good-meal-co/)',
        sourceName: 'Zendesk',
        sourceUrl:
          '[https://www.zendesk.com/in/customer/the-good-meal-co/](https://www.zendesk.com/in/customer/the-good-meal-co/)',
      },
      {
        title: 'Sealy revamps customer care journey with Zendesk',
        summary:
          'Zendesk shows Sealy reworking customer care with a stronger support foundation and AI-ready workflows. The case reports materially faster email response times, shorter training time for agents, better ticket-handling capacity, and higher customer satisfaction as the company modernized its service operation.',
        studyUrl:
          '[https://www.zendesk.com/au/customer/sealy-video/](https://www.zendesk.com/au/customer/sealy-video/)',
        sourceName: 'Zendesk',
        sourceUrl:
          '[https://www.zendesk.com/au/customer/sealy-video/](https://www.zendesk.com/au/customer/sealy-video/)',
      },
    ],
  },
];
