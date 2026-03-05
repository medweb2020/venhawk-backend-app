export type AdditionalImportClient = {
  clientName: string;
  clientLogoUrl: string | null;
  clientWebsiteUrl: string | null;
  sourceName: string;
  sourceUrl: string;
};

export type AdditionalImportCaseStudy = {
  title: string;
  summary: string;
  studyUrl: string | null;
  sourceName: string;
  sourceUrl: string;
};

export type AdditionalImportReview = {
  reviewerName: string;
  reviewerRole: string | null;
  headline: string | null;
  reviewText: string;
  rating: number | null;
  reviewSource: string;
  reviewUrl: string;
  publishedAt: string | null;
};

export type AdditionalVendorImportPayload = {
  vendorCode: string;
  brandName: string;
  clients: AdditionalImportClient[];
  caseStudies: AdditionalImportCaseStudy[];
  reviews: AdditionalImportReview[];
};

export const VENDOR_ADDITIONAL_CONTENT_20260305010000: AdditionalVendorImportPayload[] = [
  {
    vendorCode: 'aac_consulting',
    brandName: 'AAC Consulting',
    clients: [],
    caseStudies: [],
    reviews: [
      {
        reviewerName: 'Executive Director',
        reviewerRole:
          'Tier 1 US News & World Report Best Law Firm, 130+ attorneys',
        headline: null,
        reviewText:
          'AAC is not just a third party vendor; the firm views AAC staff as an extension of its own employees.',
        rating: null,
        reviewSource: 'AAC Consulting Testimonials',
        reviewUrl:
          '[https://aac-us.com/testimonials/category/Implementation](https://aac-us.com/testimonials/category/Implementation)',
        publishedAt: '2024-01-26',
      },
      {
        reviewerName: 'Accounting Manager',
        reviewerRole: '90 attorney firm',
        headline: null,
        reviewText:
          'Reviewer says they have used AAC multiple times in their career and always found AAC exceptional, with a knowledgeable team assigned to help.',
        rating: null,
        reviewSource: 'AAC Consulting Testimonials',
        reviewUrl:
          '[https://aac-us.com/testimonials/category/Technical](https://aac-us.com/testimonials/category/Technical)',
        publishedAt: '2024-01-25',
      },
      {
        reviewerName: 'Controller',
        reviewerRole: 'Tier 1 US News & World Report Best Law Firm, 35 attorneys',
        headline: null,
        reviewText:
          'With limited internal resources, the reviewer says AAC became their right hand during a full accounting system conversion.',
        rating: null,
        reviewSource: 'AAC Consulting Testimonials',
        reviewUrl:
          '[https://aac-us.com/testimonials/category/WhyAAC](https://aac-us.com/testimonials/category/WhyAAC)',
        publishedAt: '2024-01-25',
      },
    ],
  },
  {
    vendorCode: 'accenture',
    brandName: 'Accenture',
    clients: [
      {
        clientName: 'IHG Hotels & Resorts',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.ihg.com](https://www.ihg.com)',
        sourceName: 'Accenture Case Study',
        sourceUrl:
          '[https://www.accenture.com/us-en/case-studies/travel/ihg-upgrades-customer-experience-award-winning-app](https://www.accenture.com/us-en/case-studies/travel/ihg-upgrades-customer-experience-award-winning-app)',
      },
      {
        clientName: 'Spotify',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.spotify.com](https://www.spotify.com)',
        sourceName: 'Accenture Case Study',
        sourceUrl:
          '[https://www.accenture.com/us-en/case-studies/data-ai/spotify-amplify-digital-audio-ads](https://www.accenture.com/us-en/case-studies/data-ai/spotify-amplify-digital-audio-ads)',
      },
      {
        clientName: 'Minna Bank',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Accenture Case Study',
        sourceUrl:
          '[https://www.accenture.com/us-en/case-studies/banking/minna-bank-japan-first-digital-bank](https://www.accenture.com/us-en/case-studies/banking/minna-bank-japan-first-digital-bank)',
      },
      {
        clientName: 'Telkom Business',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Accenture Case Study',
        sourceUrl:
          '[https://www.accenture.com/us-en/case-studies/retail/telkom-business-yep-digital-marketplace](https://www.accenture.com/us-en/case-studies/retail/telkom-business-yep-digital-marketplace)',
      },
      {
        clientName: 'Best Buy',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.bestbuy.com](https://www.bestbuy.com)',
        sourceName: 'Accenture Case Study',
        sourceUrl:
          '[https://www.accenture.com/us-en/case-studies/data-ai/best-buy-gen-ai-virtual-assistant](https://www.accenture.com/us-en/case-studies/data-ai/best-buy-gen-ai-virtual-assistant)',
      },
    ],
    caseStudies: [
      {
        title: "Shell's immersive experience concept to fuel customer engagement",
        summary:
          'Accenture and Shell co-developed a VR concept to show wholesalers how AI and extended reality can transform customer engagement.',
        studyUrl:
          '[https://www.accenture.com/us-en/case-studies/metaverse/shell-immersive-customer-experience](https://www.accenture.com/us-en/case-studies/metaverse/shell-immersive-customer-experience)',
        sourceName: 'Accenture Case Study',
        sourceUrl:
          '[https://www.accenture.com/us-en/case-studies/metaverse/shell-immersive-customer-experience](https://www.accenture.com/us-en/case-studies/metaverse/shell-immersive-customer-experience)',
      },
      {
        title: 'Prada Group keeps customer experience fashionable',
        summary:
          'Accenture worked with Prada Group to enhance customer experience through digital and in-store engagement.',
        studyUrl:
          '[https://www.accenture.com/us-en/case-studies/retail/prada-group-keeps-customer-experience-fashionable](https://www.accenture.com/us-en/case-studies/retail/prada-group-keeps-customer-experience-fashionable)',
        sourceName: 'Accenture Case Study',
        sourceUrl:
          '[https://www.accenture.com/us-en/case-studies/retail/prada-group-keeps-customer-experience-fashionable](https://www.accenture.com/us-en/case-studies/retail/prada-group-keeps-customer-experience-fashionable)',
      },
      {
        title: 'Generali digital experience',
        summary:
          'Accenture supported Generali in creating a digital experience focused on customer interaction and engagement.',
        studyUrl:
          '[https://www.accenture.com/us-en/case-studies/interactive/generali-digital-experience](https://www.accenture.com/us-en/case-studies/interactive/generali-digital-experience)',
        sourceName: 'Accenture Case Study',
        sourceUrl:
          '[https://www.accenture.com/us-en/case-studies/interactive/generali-digital-experience](https://www.accenture.com/us-en/case-studies/interactive/generali-digital-experience)',
      },
      {
        title: 'Fortune: turning data into insights',
        summary:
          'Accenture helped Fortune apply data and AI to transform information into actionable insights.',
        studyUrl:
          '[https://www.accenture.com/us-en/case-studies/data-ai/fortune-turning-data-into-insights](https://www.accenture.com/us-en/case-studies/data-ai/fortune-turning-data-into-insights)',
        sourceName: 'Accenture Case Study',
        sourceUrl:
          '[https://www.accenture.com/us-en/case-studies/data-ai/fortune-turning-data-into-insights](https://www.accenture.com/us-en/case-studies/data-ai/fortune-turning-data-into-insights)',
      },
    ],
    reviews: [
      {
        reviewerName: 'Achille L.',
        reviewerRole: "Chevalier de l'Ordre National du Merite",
        headline: 'Great talents and skills in innovation',
        reviewText:
          "Reviewer highlights Accenture's ability to scale and provide strong talent; notes pricing can be costly for some SMBs.",
        rating: 5,
        reviewSource: 'G2',
        reviewUrl:
          '[https://www.g2.com/products/accenture/reviews](https://www.g2.com/products/accenture/reviews)',
        publishedAt: '2024-09-03',
      },
    ],
  },
  {
    vendorCode: 'adastra',
    brandName: 'Adastra',
    clients: [
      {
        clientName: 'UNIQA',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Adastra Success Story',
        sourceUrl:
          '[https://adastracorp.com/success-stories/uniqa-breaks-down-data-silos-and-builds-a-cloud-data-platform/](https://adastracorp.com/success-stories/uniqa-breaks-down-data-silos-and-builds-a-cloud-data-platform/)',
      },
      {
        clientName: 'Prague Airport',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.prg.aero](https://www.prg.aero)',
        sourceName: 'Adastra Success Story',
        sourceUrl:
          '[https://adastracorp.com/success-stories/prague-airports-campaigns-are-much-faster-with-80-less-manual-work/](https://adastracorp.com/success-stories/prague-airports-campaigns-are-much-faster-with-80-less-manual-work/)',
      },
      {
        clientName: 'Kooperativa',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Adastra Success Story',
        sourceUrl:
          '[https://adastracorp.com/success-stories/kooperativas-journey-from-excel-hell-to-unified-efficient-financial-planning/](https://adastracorp.com/success-stories/kooperativas-journey-from-excel-hell-to-unified-efficient-financial-planning/)',
      },
      {
        clientName: 'GZ Media',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.gzmedia.com](https://www.gzmedia.com)',
        sourceName: 'Adastra Success Story',
        sourceUrl:
          '[https://adastracorp.com/success-stories/gz-media-achieves-6-month-roi-with-ai-optimized-label-printing/](https://adastracorp.com/success-stories/gz-media-achieves-6-month-roi-with-ai-optimized-label-printing/)',
      },
      {
        clientName: 'CBI Health',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://cbihealth.ca](https://cbihealth.ca)',
        sourceName: 'Adastra Client Success',
        sourceUrl:
          '[https://adastracorp.com/client-success/](https://adastracorp.com/client-success/)',
      },
    ],
    caseStudies: [
      {
        title: 'Raiffeisenbank Unified Data Platform Concept',
        summary:
          'Adastra worked with Raiffeisenbank on a unified data platform concept to consolidate data and enable modern analytics.',
        studyUrl:
          '[https://adastracorp.com/success-stories/raiffeisenbank-unified-data-platform-concept/](https://adastracorp.com/success-stories/raiffeisenbank-unified-data-platform-concept/)',
        sourceName: 'Adastra Success Story',
        sourceUrl:
          '[https://adastracorp.com/success-stories/raiffeisenbank-unified-data-platform-concept/](https://adastracorp.com/success-stories/raiffeisenbank-unified-data-platform-concept/)',
      },
      {
        title: 'CETIN: Maximizing the Power of Microsoft Purview',
        summary:
          'Implemented Microsoft Purview capabilities to strengthen data governance and information management for CETIN.',
        studyUrl:
          '[https://adastracorp.com/success-stories/cetin-maximizing-the-power-of-microsoft-purview/](https://adastracorp.com/success-stories/cetin-maximizing-the-power-of-microsoft-purview/)',
        sourceName: 'Adastra Success Story',
        sourceUrl:
          '[https://adastracorp.com/success-stories/cetin-maximizing-the-power-of-microsoft-purview/](https://adastracorp.com/success-stories/cetin-maximizing-the-power-of-microsoft-purview/)',
      },
      {
        title:
          'Automated forward-looking procurement process saves 1,000 hours of manual work per year',
        summary:
          'Built an automated procurement process with forward-looking planning to reduce repetitive manual work.',
        studyUrl:
          '[https://adastracorp.com/success-stories/automated-forward-looking-procurement-process-saves-1000-hours-of-manual-work-per-year/](https://adastracorp.com/success-stories/automated-forward-looking-procurement-process-saves-1000-hours-of-manual-work-per-year/)',
        sourceName: 'Adastra Success Story',
        sourceUrl:
          '[https://adastracorp.com/success-stories/automated-forward-looking-procurement-process-saves-1000-hours-of-manual-work-per-year/](https://adastracorp.com/success-stories/automated-forward-looking-procurement-process-saves-1000-hours-of-manual-work-per-year/)',
      },
      {
        title:
          'Fully automated shipment tracking with RPA saves 250 hours of manual work monthly',
        summary:
          'Implemented RPA-based shipment tracking automation to reduce manual tracking effort.',
        studyUrl:
          '[https://adastracorp.com/success-stories/fully-automated-shipment-tracking-with-rpa-saves-250-hours-of-manual-work-monthly/](https://adastracorp.com/success-stories/fully-automated-shipment-tracking-with-rpa-saves-250-hours-of-manual-work-monthly/)',
        sourceName: 'Adastra Success Story',
        sourceUrl:
          '[https://adastracorp.com/success-stories/fully-automated-shipment-tracking-with-rpa-saves-250-hours-of-manual-work-monthly/](https://adastracorp.com/success-stories/fully-automated-shipment-tracking-with-rpa-saves-250-hours-of-manual-work-monthly/)',
      },
      {
        title: 'AWS cloud migration for a healthcare organization',
        summary:
          'Delivered an AWS cloud migration for a healthcare organization and stabilized operations post-migration.',
        studyUrl:
          '[https://adastracorp.com/success-stories/aws-cloud-migration-for-a-healthcare-organization/](https://adastracorp.com/success-stories/aws-cloud-migration-for-a-healthcare-organization/)',
        sourceName: 'Adastra Success Story',
        sourceUrl:
          '[https://adastracorp.com/success-stories/aws-cloud-migration-for-a-healthcare-organization/](https://adastracorp.com/success-stories/aws-cloud-migration-for-a-healthcare-organization/)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'cornerstone_it',
    brandName: 'Cornerstone.IT',
    clients: [
      {
        clientName: 'Beck Redden',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.beckredden.com](https://www.beckredden.com)',
        sourceName: 'Cornerstone.IT Case Study / News',
        sourceUrl:
          '[https://www.cornerstone.it/beck-redden-selects-imanage-to-enhance-security/](https://www.cornerstone.it/beck-redden-selects-imanage-to-enhance-security/)',
      },
      {
        clientName: 'Saul Ewing Arnstein & Lehr LLP',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.saul.com](https://www.saul.com)',
        sourceName: 'Cornerstone.IT Case Study (PDF)',
        sourceUrl:
          '[https://www.cornerstone.it/wp-content/uploads/2024/03/saul-ewing.pdf](https://www.cornerstone.it/wp-content/uploads/2024/03/saul-ewing.pdf)',
      },
    ],
    caseStudies: [
      {
        title: 'Bi-Coastal Law Firm iManage Migration',
        summary:
          'PDF case study describing an iManage migration for a bi-coastal law firm.',
        studyUrl:
          '[https://www.cornerstone.it/wp-content/uploads/2024/01/fkks_case-study.pdf](https://www.cornerstone.it/wp-content/uploads/2024/01/fkks_case-study.pdf)',
        sourceName: 'Cornerstone.IT Case Study (PDF)',
        sourceUrl:
          '[https://www.cornerstone.it/wp-content/uploads/2024/01/fkks_case-study.pdf](https://www.cornerstone.it/wp-content/uploads/2024/01/fkks_case-study.pdf)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'epiq',
    brandName: 'Epiq',
    clients: [],
    caseStudies: [
      {
        title: 'Epiq helps Ditech with complex restructuring',
        summary:
          'Case study describing Epiq support for Ditech through a restructuring engagement.',
        studyUrl:
          '[https://www.epiqglobal.com/en-us/resource-center/case-study/epiq-helps-ditech-with-complex-restructuring](https://www.epiqglobal.com/en-us/resource-center/case-study/epiq-helps-ditech-with-complex-restructuring)',
        sourceName: 'Epiq Case Study',
        sourceUrl:
          '[https://www.epiqglobal.com/en-us/resource-center/case-study/epiq-helps-ditech-with-complex-restructuring](https://www.epiqglobal.com/en-us/resource-center/case-study/epiq-helps-ditech-with-complex-restructuring)',
      },
      {
        title: 'Epiq Case Insights service helps client',
        summary:
          'Case study on using Epiq Case Insights to help a client analyze case information.',
        studyUrl:
          '[https://www.epiqglobal.com/en-us/resource-center/case-study/epiq-case-insights-service-helps-client](https://www.epiqglobal.com/en-us/resource-center/case-study/epiq-case-insights-service-helps-client)',
        sourceName: 'Epiq Case Study',
        sourceUrl:
          '[https://www.epiqglobal.com/en-us/resource-center/case-study/epiq-case-insights-service-helps-client](https://www.epiqglobal.com/en-us/resource-center/case-study/epiq-case-insights-service-helps-client)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'esentio_technologies',
    brandName: 'eSentio Technologies',
    clients: [
      {
        clientName: 'Akin Gump Strauss Hauer & Feld',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.akingump.com](https://www.akingump.com)',
        sourceName: 'Legal IT Insider (PDF document)',
        sourceUrl:
          '[https://www.legaltechnology.com/wp-content/uploads/2024/08/eSentio-v-NetDocuments_Complaint.pdf](https://www.legaltechnology.com/wp-content/uploads/2024/08/eSentio-v-NetDocuments_Complaint.pdf)',
      },
    ],
    caseStudies: [],
    reviews: [],
  },
  {
    vendorCode: 'harbor',
    brandName: 'Harbor',
    clients: [
      {
        clientName: 'McDermott Will & Emery',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.mwe.com](https://www.mwe.com)',
        sourceName: 'Harbor Case Study',
        sourceUrl:
          '[https://www.harborglobal.com/case-study/mcdermott-will-emery/](https://www.harborglobal.com/case-study/mcdermott-will-emery/)',
      },
      {
        clientName: 'Rubrik',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.rubrik.com](https://www.rubrik.com)',
        sourceName: 'Harbor Case Study',
        sourceUrl:
          '[https://www.harborglobal.com/case-study/rubrik/](https://www.harborglobal.com/case-study/rubrik/)',
      },
    ],
    caseStudies: [
      {
        title: 'Susman Godfrey | Cloud-First Strategy for iManage',
        summary:
          "Case study on Harbor's work supporting Susman Godfrey's cloud-first strategy for iManage.",
        studyUrl:
          '[https://www.harborglobal.com/case-study/susman-godfrey-cloud-first-strategy-for-imanage/](https://www.harborglobal.com/case-study/susman-godfrey-cloud-first-strategy-for-imanage/)',
        sourceName: 'Harbor Case Study',
        sourceUrl:
          '[https://www.harborglobal.com/case-study/susman-godfrey-cloud-first-strategy-for-imanage/](https://www.harborglobal.com/case-study/susman-godfrey-cloud-first-strategy-for-imanage/)',
      },
      {
        title: 'Ice Miller | iManage Cloud Implementation',
        summary:
          "Customer case study describing Harbor's implementation support for Ice Miller's move to iManage Cloud.",
        studyUrl:
          '[https://www.harborglobal.com/case-study/ice-miller-imanage-cloud-implementation/](https://www.harborglobal.com/case-study/ice-miller-imanage-cloud-implementation/)',
        sourceName: 'Harbor Case Study',
        sourceUrl:
          '[https://www.harborglobal.com/case-study/ice-miller-imanage-cloud-implementation/](https://www.harborglobal.com/case-study/ice-miller-imanage-cloud-implementation/)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'helm360',
    brandName: 'Helm360',
    clients: [],
    caseStudies: [
      {
        title:
          'Hogan Lovells Selects Helm360 for Elite 3E Upgrade and Transition to the Cloud',
        summary:
          'PDF case study describing Hogan Lovells selection of Helm360 for an Elite 3E upgrade and cloud transition.',
        studyUrl:
          '[https://helm360.com/wp-content/uploads/2021/07/Hogan_Lovells_Case_Study.pdf](https://helm360.com/wp-content/uploads/2021/07/Hogan_Lovells_Case_Study.pdf)',
        sourceName: 'Helm360 Case Study (PDF)',
        sourceUrl:
          '[https://helm360.com/wp-content/uploads/2021/07/Hogan_Lovells_Case_Study.pdf](https://helm360.com/wp-content/uploads/2021/07/Hogan_Lovells_Case_Study.pdf)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'inoutsource',
    brandName: 'Inoutsource',
    clients: [
      {
        clientName: 'Fisher Phillips',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.fisherphillips.com](https://www.fisherphillips.com)',
        sourceName: 'Inoutsource Case Study',
        sourceUrl:
          '[https://www.inoutsource.com/case-studies/fisher-phillips-communications-upgrade/](https://www.inoutsource.com/case-studies/fisher-phillips-communications-upgrade/)',
      },
      {
        clientName: 'Shearman & Sterling',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.shearman.com](https://www.shearman.com)',
        sourceName: 'Inoutsource Case Study',
        sourceUrl:
          '[https://www.inoutsource.com/case-studies/shearman-sterling-imanage-cloud/](https://www.inoutsource.com/case-studies/shearman-sterling-imanage-cloud/)',
      },
    ],
    caseStudies: [
      {
        title: 'Goulston & Storrs - iManage Cloud Migration',
        summary:
          'Case study on migrating Goulston & Storrs to iManage Cloud for document management modernization.',
        studyUrl:
          '[https://www.inoutsource.com/case-studies/goulston-storrs-imanage-cloud-migration/](https://www.inoutsource.com/case-studies/goulston-storrs-imanage-cloud-migration/)',
        sourceName: 'Inoutsource Case Study',
        sourceUrl:
          '[https://www.inoutsource.com/case-studies/goulston-storrs-imanage-cloud-migration/](https://www.inoutsource.com/case-studies/goulston-storrs-imanage-cloud-migration/)',
      },
      {
        title: 'Berger Singerman - A Natural Fit for Inoutsource',
        summary:
          'Case study describing Inoutsource work with Berger Singerman and partnership outcomes.',
        studyUrl:
          '[https://www.inoutsource.com/case-studies/berger-singerman-a-natural-fit-for-inoutsource/](https://www.inoutsource.com/case-studies/berger-singerman-a-natural-fit-for-inoutsource/)',
        sourceName: 'Inoutsource Case Study',
        sourceUrl:
          '[https://www.inoutsource.com/case-studies/berger-singerman-a-natural-fit-for-inoutsource/](https://www.inoutsource.com/case-studies/berger-singerman-a-natural-fit-for-inoutsource/)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'kraft_kennedy',
    brandName: 'Kraft Kennedy',
    clients: [
      {
        clientName: 'Ice Miller',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.icemiller.com](https://www.icemiller.com)',
        sourceName: 'Kraft Kennedy Stories',
        sourceUrl:
          '[https://www.kraftkennedy.com/stories/category/information-management/](https://www.kraftkennedy.com/stories/category/information-management/)',
      },
      {
        clientName: 'Bryant Miller Olive',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.bmolaw.com](https://www.bmolaw.com)',
        sourceName: 'Kraft Kennedy Stories',
        sourceUrl:
          '[https://www.kraftkennedy.com/stories/category/managed-it-services/](https://www.kraftkennedy.com/stories/category/managed-it-services/)',
      },
    ],
    caseStudies: [
      {
        title:
          'Zetlin & De Chiara turns to Kraft Kennedy for future-ready operations',
        summary:
          'Story on Zetlin & De Chiara partnering with Kraft Kennedy to improve operations with managed IT services.',
        studyUrl:
          '[https://www.kraftkennedy.com/stories/zetlin-de-chiara-turns-to-kraft-kennedy-for-future-ready-operations/](https://www.kraftkennedy.com/stories/zetlin-de-chiara-turns-to-kraft-kennedy-for-future-ready-operations/)',
        sourceName: 'Kraft Kennedy Story',
        sourceUrl:
          '[https://www.kraftkennedy.com/stories/zetlin-de-chiara-turns-to-kraft-kennedy-for-future-ready-operations/](https://www.kraftkennedy.com/stories/zetlin-de-chiara-turns-to-kraft-kennedy-for-future-ready-operations/)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'lexisnexis',
    brandName: 'LexisNexis',
    clients: [],
    caseStudies: [
      {
        title: 'Customer Due Diligence case study for large financial institution',
        summary:
          'LexisNexis Risk Solutions case study describing customer due diligence capabilities for compliance workflows.',
        studyUrl:
          '[https://risk.lexisnexis.com/about-us/case-studies/customer-due-diligence-case-study-for-large-financial-institution](https://risk.lexisnexis.com/about-us/case-studies/customer-due-diligence-case-study-for-large-financial-institution)',
        sourceName: 'LexisNexis Risk Solutions Case Study',
        sourceUrl:
          '[https://risk.lexisnexis.com/about-us/case-studies/customer-due-diligence-case-study-for-large-financial-institution](https://risk.lexisnexis.com/about-us/case-studies/customer-due-diligence-case-study-for-large-financial-institution)',
      },
      {
        title: 'Customer success story: locating a missing person with Accurint TraX',
        summary:
          'LexisNexis Risk Solutions customer story on using Accurint TraX to support investigations.',
        studyUrl:
          '[https://risk.lexisnexis.com/about-us/case-studies/customer-success-story](https://risk.lexisnexis.com/about-us/case-studies/customer-success-story)',
        sourceName: 'LexisNexis Risk Solutions Case Study',
        sourceUrl:
          '[https://risk.lexisnexis.com/about-us/case-studies/customer-success-story](https://risk.lexisnexis.com/about-us/case-studies/customer-success-story)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'thomson_reuters',
    brandName: 'Thomson Reuters',
    clients: [
      {
        clientName: 'Royds Withy King',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.rwkgoodman.com](https://www.rwkgoodman.com)',
        sourceName: 'Thomson Reuters HighQ Case Study',
        sourceUrl:
          '[https://legal.thomsonreuters.com/en/case-studies/royds-withy-king-case-study-highq](https://legal.thomsonreuters.com/en/case-studies/royds-withy-king-case-study-highq)',
      },
    ],
    caseStudies: [
      {
        title:
          "HighQ case study: Parris Law Firm's innovative case management",
        summary:
          'Customer story on how Parris Law Firm used HighQ for case management and collaboration.',
        studyUrl:
          '[https://legal.thomsonreuters.com/en/case-studies/highq-case-study-parris-law-firms-innovative-case-management](https://legal.thomsonreuters.com/en/case-studies/highq-case-study-parris-law-firms-innovative-case-management)',
        sourceName: 'Thomson Reuters HighQ Case Study',
        sourceUrl:
          '[https://legal.thomsonreuters.com/en/case-studies/highq-case-study-parris-law-firms-innovative-case-management](https://legal.thomsonreuters.com/en/case-studies/highq-case-study-parris-law-firms-innovative-case-management)',
      },
      {
        title: 'Stevens & Bolton Case Study - HighQ',
        summary:
          'Case study describing Stevens & Bolton use of HighQ for secure collaboration.',
        studyUrl:
          '[https://legal.thomsonreuters.com/en/case-studies/stevens-bolton-case-study-highq](https://legal.thomsonreuters.com/en/case-studies/stevens-bolton-case-study-highq)',
        sourceName: 'Thomson Reuters HighQ Case Study',
        sourceUrl:
          '[https://legal.thomsonreuters.com/en/case-studies/stevens-bolton-case-study-highq](https://legal.thomsonreuters.com/en/case-studies/stevens-bolton-case-study-highq)',
      },
      {
        title: 'Geldards Case Study - HighQ',
        summary:
          'Customer story on how Geldards implemented HighQ to improve collaboration and document sharing.',
        studyUrl:
          '[https://legal.thomsonreuters.com/en/case-studies/geldards-case-study-highq](https://legal.thomsonreuters.com/en/case-studies/geldards-case-study-highq)',
        sourceName: 'Thomson Reuters HighQ Case Study',
        sourceUrl:
          '[https://legal.thomsonreuters.com/en/case-studies/geldards-case-study-highq](https://legal.thomsonreuters.com/en/case-studies/geldards-case-study-highq)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'titanfile',
    brandName: 'TitanFile',
    clients: [
      {
        clientName: 'Siskinds LLP',
        clientLogoUrl: null,
        clientWebsiteUrl: '[https://www.siskinds.com](https://www.siskinds.com)',
        sourceName: 'TitanFile Blog',
        sourceUrl:
          '[https://www.titanfile.com/blog/how-law-firms-address-data-security-and-compliance-in-2025/](https://www.titanfile.com/blog/how-law-firms-address-data-security-and-compliance-in-2025/)',
      },
    ],
    caseStudies: [
      {
        title: 'Siskinds LLP Case Study',
        summary:
          'Case study describing how Siskinds LLP uses TitanFile secure portal for file sharing and collaboration.',
        studyUrl:
          '[https://www.titanfile.com/resources/case-studies/siskinds/](https://www.titanfile.com/resources/case-studies/siskinds/)',
        sourceName: 'TitanFile Case Study',
        sourceUrl:
          '[https://www.titanfile.com/resources/case-studies/siskinds/](https://www.titanfile.com/resources/case-studies/siskinds/)',
      },
      {
        title: 'Marshall Dennehey Case Study',
        summary:
          'Case study on Marshall Dennehey use of TitanFile secure file sharing portal and firmwide collaboration.',
        studyUrl:
          '[https://www.titanfile.com/resources/case-studies/marshall-dennehey/](https://www.titanfile.com/resources/case-studies/marshall-dennehey/)',
        sourceName: 'TitanFile Case Study',
        sourceUrl:
          '[https://www.titanfile.com/resources/case-studies/marshall-dennehey/](https://www.titanfile.com/resources/case-studies/marshall-dennehey/)',
      },
    ],
    reviews: [],
  },
];
