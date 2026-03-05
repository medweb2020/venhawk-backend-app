
export type ImportClient = {
  clientName: string;
  clientLogoUrl: string | null;
  clientWebsiteUrl: string | null;
  sourceName: string;
  sourceUrl: string;
};

export type ImportCaseStudy = {
  title: string;
  summary: string;
  studyUrl: string | null;
  sourceName: string;
  sourceUrl: string;
};

export type ImportReview = {
  reviewerName: string;
  reviewerRole: string | null;
  headline: string | null;
  reviewText: string;
  rating: number | null;
  reviewSource: string;
  reviewUrl: string;
  publishedAt: string | null;
};

export type VendorImportPayload = {
  vendorCode: string;
  brandName: string;
  clients: ImportClient[];
  caseStudies: ImportCaseStudy[];
  reviews: ImportReview[];
};

export const VENDOR_CURATED_CONTENT_PAYLOAD: VendorImportPayload[] = [
  {
    vendorCode: 'lexisnexis',
    brandName: 'LexisNexis',
    clients: [],
    caseStudies: [
      {
        title: 'UK Local Authority Licensing: LA Data Integration',
        summary: 'Case study.',
        studyUrl:
          '[https://www.lexisnexis.co.uk/case-study/uk-local-authority-licensing-la-data-integration](https://www.lexisnexis.co.uk/case-study/uk-local-authority-licensing-la-data-integration)',
        sourceName: 'LexisNexis (Case Study)',
        sourceUrl:
          '[https://www.lexisnexis.co.uk/case-study/uk-local-authority-licensing-la-data-integration](https://www.lexisnexis.co.uk/case-study/uk-local-authority-licensing-la-data-integration)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'thomson_reuters',
    brandName: 'Thomson Reuters',
    clients: [
      {
        clientName: 'Blackadders',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Thomson Reuters HighQ Customer Stories',
        sourceUrl:
          '[https://legal.thomsonreuters.com/en/products/highq/customer-stories](https://legal.thomsonreuters.com/en/products/highq/customer-stories)',
      },
    ],
    caseStudies: [
      {
        title:
          'Blackadders is securely collaborating and sharing information with clients',
        summary: 'Customer story.',
        studyUrl:
          '[https://legal.thomsonreuters.com/en/products/highq/customer-stories](https://legal.thomsonreuters.com/en/products/highq/customer-stories)',
        sourceName: 'Thomson Reuters HighQ Customer Stories',
        sourceUrl:
          '[https://legal.thomsonreuters.com/en/products/highq/customer-stories](https://legal.thomsonreuters.com/en/products/highq/customer-stories)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'titanfile',
    brandName: 'TitanFile',
    clients: [
      {
        clientName: 'Littler',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'TitanFile Blog (Case Study)',
        sourceUrl:
          '[https://www.titanfile.com/blog/littler-turns-to-titanfile-as-its-legal-file-sharing-solution/](https://www.titanfile.com/blog/littler-turns-to-titanfile-as-its-legal-file-sharing-solution/)',
      },
    ],
    caseStudies: [
      {
        title: 'Littler turns to TitanFile as its legal file sharing solution',
        summary: 'Case study.',
        studyUrl:
          '[https://www.titanfile.com/blog/littler-turns-to-titanfile-as-its-legal-file-sharing-solution/](https://www.titanfile.com/blog/littler-turns-to-titanfile-as-its-legal-file-sharing-solution/)',
        sourceName: 'TitanFile Blog (Case Study)',
        sourceUrl:
          '[https://www.titanfile.com/blog/littler-turns-to-titanfile-as-its-legal-file-sharing-solution/](https://www.titanfile.com/blog/littler-turns-to-titanfile-as-its-legal-file-sharing-solution/)',
      },
    ],
    reviews: [
      {
        reviewerName: 'Kevin Larsen',
        reviewerRole: 'Lawyer, Partner',
        headline: null,
        reviewText: 'When I send a file with TitanFile, I feel more secure...',
        rating: null,
        reviewSource: 'TitanFile Client Testimonials',
        reviewUrl:
          '[https://www.titanfile.com/blog/client-testimonials-about-titanfile-secure-file-sharing/](https://www.titanfile.com/blog/client-testimonials-about-titanfile-secure-file-sharing/)',
        publishedAt: null,
      },
    ],
  },
  {
    vendorCode: 'kraft_kennedy',
    brandName: 'Kraft Kennedy',
    clients: [
      {
        clientName: 'Carver Federal Savings Bank',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Kraft Kennedy Success Story',
        sourceUrl:
          '[https://www.kraftkennedy.com/success-stories/carver-federal-savings-bank-achieving-resiliency-and-improved-performance-through-a-modernized-it-architecture/](https://www.kraftkennedy.com/success-stories/carver-federal-savings-bank-achieving-resiliency-and-improved-performance-through-a-modernized-it-architecture/)',
      },
    ],
    caseStudies: [
      {
        title:
          'Carver Federal Savings Bank: Achieving Resiliency and Improved Performance through a Modernized IT Architecture',
        summary: 'Success story.',
        studyUrl:
          '[https://www.kraftkennedy.com/success-stories/carver-federal-savings-bank-achieving-resiliency-and-improved-performance-through-a-modernized-it-architecture/](https://www.kraftkennedy.com/success-stories/carver-federal-savings-bank-achieving-resiliency-and-improved-performance-through-a-modernized-it-architecture/)',
        sourceName: 'Kraft Kennedy Success Story',
        sourceUrl:
          '[https://www.kraftkennedy.com/success-stories/carver-federal-savings-bank-achieving-resiliency-and-improved-performance-through-a-modernized-it-architecture/](https://www.kraftkennedy.com/success-stories/carver-federal-savings-bank-achieving-resiliency-and-improved-performance-through-a-modernized-it-architecture/)',
      },
    ],
    reviews: [
      {
        reviewerName: 'Patrick Brennan',
        reviewerRole:
          'SVP Information Technology, Carver Federal Savings Bank',
        headline: null,
        reviewText: 'Kraft Kennedy is like family to us',
        rating: null,
        reviewSource: 'Kraft Kennedy Success Story',
        reviewUrl:
          '[https://www.kraftkennedy.com/success-stories/carver-federal-savings-bank-achieving-resiliency-and-improved-performance-through-a-modernized-it-architecture/](https://www.kraftkennedy.com/success-stories/carver-federal-savings-bank-achieving-resiliency-and-improved-performance-through-a-modernized-it-architecture/)',
        publishedAt: null,
      },
    ],
  },
  {
    vendorCode: 'rbro',
    brandName: 'RBRO',
    clients: [
      {
        clientName: 'Baker McKenzie',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'RBRO Solutions Case Study',
        sourceUrl:
          '[https://rbro-solutions.com/case-studies/baker-mckenzie-improve-performance-and-reduce-costs-by-migrating-to-imanage-cloud/](https://rbro-solutions.com/case-studies/baker-mckenzie-improve-performance-and-reduce-costs-by-migrating-to-imanage-cloud/)',
      },
    ],
    caseStudies: [
      {
        title: 'RBRO Solutions Case Study - Baker McKenzie Migration to iManage Cloud',
        summary: 'Case study.',
        studyUrl:
          '[https://rbro-solutions.com/case-studies/baker-mckenzie-improve-performance-and-reduce-costs-by-migrating-to-imanage-cloud/](https://rbro-solutions.com/case-studies/baker-mckenzie-improve-performance-and-reduce-costs-by-migrating-to-imanage-cloud/)',
        sourceName: 'RBRO Solutions Case Study',
        sourceUrl:
          '[https://rbro-solutions.com/case-studies/baker-mckenzie-improve-performance-and-reduce-costs-by-migrating-to-imanage-cloud/](https://rbro-solutions.com/case-studies/baker-mckenzie-improve-performance-and-reduce-costs-by-migrating-to-imanage-cloud/)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'inoutsource',
    brandName: 'Inoutsource',
    clients: [
      {
        clientName: 'Baker Botts',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'InOutsource Case Study',
        sourceUrl:
          '[https://www.inoutsource.com/case-studies/baker-botts-rapid-user-integration-with-zero-downtime/](https://www.inoutsource.com/case-studies/baker-botts-rapid-user-integration-with-zero-downtime/)',
      },
    ],
    caseStudies: [
      {
        title: 'Baker Botts - Rapid User Integration with Zero Downtime',
        summary: 'Case study.',
        studyUrl:
          '[https://www.inoutsource.com/case-studies/baker-botts-rapid-user-integration-with-zero-downtime/](https://www.inoutsource.com/case-studies/baker-botts-rapid-user-integration-with-zero-downtime/)',
        sourceName: 'InOutsource Case Study',
        sourceUrl:
          '[https://www.inoutsource.com/case-studies/baker-botts-rapid-user-integration-with-zero-downtime/](https://www.inoutsource.com/case-studies/baker-botts-rapid-user-integration-with-zero-downtime/)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'esentio_technologies',
    brandName: 'eSentio Technologies',
    clients: [
      {
        clientName: 'Drinker Biddle & Reath',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'iManage Case Study PDF',
        sourceUrl:
          '[https://imanage.com/media/jxcbdmjc/drinkerbiddle_casestudy_feb2021_v1.pdf](https://imanage.com/media/jxcbdmjc/drinkerbiddle_casestudy_feb2021_v1.pdf)',
      },
    ],
    caseStudies: [],
    reviews: [],
  },
  {
    vendorCode: 'aac_consulting',
    brandName: 'AAC Consulting',
    clients: [],
    caseStudies: [],
    reviews: [
      {
        reviewerName: 'Chief Financial Officer',
        reviewerRole: 'AmLaw 75 firm - 600+ attorneys',
        headline: null,
        reviewText:
          'We consider AAC a trusted advisor and invaluable partner.',
        rating: null,
        reviewSource: 'AAC Consulting Testimonial',
        reviewUrl:
          '[https://aac-us.com/we-consider-aac-a-trusted-advisor/](https://aac-us.com/we-consider-aac-a-trusted-advisor/)',
        publishedAt: null,
      },
    ],
  },
  {
    vendorCode: 'element_technologies',
    brandName: 'Element Technologies',
    clients: [],
    caseStudies: [
      {
        title: 'Salesforce Lead Management in the Banking Sector',
        summary: 'Case study.',
        studyUrl:
          '[https://elementtechnologies.com/case-studies/salesforce-lead-management-in-the-banking-sector/](https://elementtechnologies.com/case-studies/salesforce-lead-management-in-the-banking-sector/)',
        sourceName: 'Element Technologies Case Study',
        sourceUrl:
          '[https://elementtechnologies.com/case-studies/salesforce-lead-management-in-the-banking-sector/](https://elementtechnologies.com/case-studies/salesforce-lead-management-in-the-banking-sector/)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'helient_systems',
    brandName: 'Helient Systems',
    clients: [
      {
        clientName: 'Obermayer Rebmann Maxwell & Hippel LLP',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Helient Systems Testimonials',
        sourceUrl:
          '[https://www.helient.com/company/testimonials/](https://www.helient.com/company/testimonials/)',
      },
    ],
    caseStudies: [],
    reviews: [
      {
        reviewerName: 'Jeffrey McShane',
        reviewerRole: 'CIO, Obermayer Rebmann Maxwell & Hippel LLP',
        headline: null,
        reviewText: 'Helient is an exceptional resource for our firm',
        rating: null,
        reviewSource: 'Helient Systems Testimonials',
        reviewUrl:
          '[https://www.helient.com/company/testimonials/](https://www.helient.com/company/testimonials/)',
        publishedAt: null,
      },
    ],
  },
  {
    vendorCode: 'cornerstone_it',
    brandName: 'Cornerstone.IT',
    clients: [
      {
        clientName: 'Bond, Schoeneck & King',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Cornerstone.IT Case Study',
        sourceUrl:
          '[https://www.cornerstone.it/law-firm-to-deliver-windows-virtual-desktops-from-azure/](https://www.cornerstone.it/law-firm-to-deliver-windows-virtual-desktops-from-azure/)',
      },
    ],
    caseStudies: [
      {
        title: 'Law Firm to Deliver Windows Virtual Desktops From Azure',
        summary: 'Case study.',
        studyUrl:
          '[https://www.cornerstone.it/law-firm-to-deliver-windows-virtual-desktops-from-azure/](https://www.cornerstone.it/law-firm-to-deliver-windows-virtual-desktops-from-azure/)',
        sourceName: 'Cornerstone.IT Case Study',
        sourceUrl:
          '[https://www.cornerstone.it/law-firm-to-deliver-windows-virtual-desktops-from-azure/](https://www.cornerstone.it/law-firm-to-deliver-windows-virtual-desktops-from-azure/)',
      },
    ],
    reviews: [
      {
        reviewerName: 'Joe Fousek',
        reviewerRole: 'Bond, Schoeneck & King',
        headline: null,
        reviewText:
          'Our experience with Cornerstone.IT has been overwhelmingly positive.',
        rating: null,
        reviewSource: 'Cornerstone.IT Case Study',
        reviewUrl:
          '[https://www.cornerstone.it/law-firm-to-deliver-windows-virtual-desktops-from-azure/](https://www.cornerstone.it/law-firm-to-deliver-windows-virtual-desktops-from-azure/)',
        publishedAt: null,
      },
    ],
  },
  {
    vendorCode: 'cloudficient',
    brandName: 'Cloudficient',
    clients: [],
    caseStudies: [
      {
        title: '55 TB Enterprise Vault Migration',
        summary: 'Case study.',
        studyUrl: null,
        sourceName: 'Cloudficient Case Studies',
        sourceUrl:
          '[https://cloudficient.com/case-studies/](https://cloudficient.com/case-studies/)',
      },
    ],
    reviews: [
      {
        reviewerName: 'Project Manager',
        reviewerRole: null,
        headline: 'Source One Migration using Cloudficient',
        reviewText: 'Cloudficient was amazing to work with.',
        rating: 5,
        reviewSource: 'Gartner Peer Insights',
        reviewUrl:
          '[https://www.gartner.com/reviews/market/content-services-platforms/vendor/cloudficient/product/cloudficient-migration-services/reviews?market=content-services-platforms](https://www.gartner.com/reviews/market/content-services-platforms/vendor/cloudficient/product/cloudficient-migration-services/reviews?market=content-services-platforms)',
        publishedAt: '2023-08-31',
      },
    ],
  },
  {
    vendorCode: 'cloudforce',
    brandName: 'CloudForce',
    clients: [
      {
        clientName: "Prince George's Community College",
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Cloudforce Case Studies Archive',
        sourceUrl:
          '[https://cloudforce.com/case-studies/](https://cloudforce.com/case-studies/)',
      },
      {
        clientName: 'UCLA Anderson School of Management',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Microsoft Partner Case Study',
        sourceUrl:
          '[https://partner.microsoft.com/en-us/case-studies/ucla-anderson-school-of-management](https://partner.microsoft.com/en-us/case-studies/ucla-anderson-school-of-management)',
      },
    ],
    caseStudies: [
      {
        title: 'UCLA Anderson School of Management',
        summary: 'Case study.',
        studyUrl:
          '[https://partner.microsoft.com/en-us/case-studies/ucla-anderson-school-of-management](https://partner.microsoft.com/en-us/case-studies/ucla-anderson-school-of-management)',
        sourceName: 'Microsoft Partner Case Study',
        sourceUrl:
          '[https://partner.microsoft.com/en-us/case-studies/ucla-anderson-school-of-management](https://partner.microsoft.com/en-us/case-studies/ucla-anderson-school-of-management)',
      },
    ],
    reviews: [
      {
        reviewerName: 'Manuel Arrington',
        reviewerRole:
          'Director of Network Infrastructure and Administration, PGCC',
        headline: null,
        reviewText:
          'Cloudforce helped us take full advantage of Microsoft Defender and its capabilities.',
        rating: null,
        reviewSource: 'Cloudforce Case Studies Archive',
        reviewUrl:
          '[https://cloudforce.com/case-studies/](https://cloudforce.com/case-studies/)',
        publishedAt: null,
      },
    ],
  },
  {
    vendorCode: 'harbor',
    brandName: 'Harbor',
    clients: [
      {
        clientName: 'Trowers & Hamlins',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Harbor Case Study',
        sourceUrl:
          '[https://www.harborglobal.com/case-study/trowers-hamlins-elite-3e/](https://www.harborglobal.com/case-study/trowers-hamlins-elite-3e/)',
      },
      {
        clientName: 'Thirsk Winton LLP',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Harbor Case Study PDF',
        sourceUrl:
          '[https://www.harborglobal.com/wp-content/uploads/2021/12/Thirsk-Winton_CASE-STUDY.pdf](https://www.harborglobal.com/wp-content/uploads/2021/12/Thirsk-Winton_CASE-STUDY.pdf)',
      },
      {
        clientName: 'Hewlett Packard Enterprise',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Harbor Case Study PDF',
        sourceUrl:
          '[https://www.harborglobal.com/wp-content/uploads/2021/11/HEWLETT-PACKARD-ENTERPRISE.pdf](https://www.harborglobal.com/wp-content/uploads/2021/11/HEWLETT-PACKARD-ENTERPRISE.pdf)',
      },
    ],
    caseStudies: [
      {
        title: 'Trowers & Hamlins | Elite 3E Implementation',
        summary: 'Case study.',
        studyUrl:
          '[https://www.harborglobal.com/case-study/trowers-hamlins-elite-3e/](https://www.harborglobal.com/case-study/trowers-hamlins-elite-3e/)',
        sourceName: 'Harbor Case Study',
        sourceUrl:
          '[https://www.harborglobal.com/case-study/trowers-hamlins-elite-3e/](https://www.harborglobal.com/case-study/trowers-hamlins-elite-3e/)',
      },
    ],
    reviews: [
      {
        reviewerName: 'Andrew Foster',
        reviewerRole: 'Finance Systems Manager, Trowers & Hamlins',
        headline: null,
        reviewText:
          "it has been encouraging to see how Harbor's managed services teams have been supporting the firm",
        rating: null,
        reviewSource: 'Harbor News Release',
        reviewUrl:
          '[https://www.harborglobal.com/news/harbor-expands-managed-services-teams-across-the-uk-and-us/](https://www.harborglobal.com/news/harbor-expands-managed-services-teams-across-the-uk-and-us/)',
        publishedAt: null,
      },
    ],
  },
  {
    vendorCode: 'helm360',
    brandName: 'Helm360',
    clients: [
      {
        clientName: 'Seddons GSC LLP',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Legal Support Network Case Study',
        sourceUrl:
          '[https://www.legalsupportnetwork.co.uk/case-study/seddons-gsc-llp-partners-with-helm360-on-their-elite-3e-cloud-journey/](https://www.legalsupportnetwork.co.uk/case-study/seddons-gsc-llp-partners-with-helm360-on-their-elite-3e-cloud-journey/)',
      },
      {
        clientName: 'Leigh Day',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Elite News Release',
        sourceUrl:
          '[https://www.elite.com/insights/news/leigh-day-chooses-3e-in-the-cloud/](https://www.elite.com/insights/news/leigh-day-chooses-3e-in-the-cloud/)',
      },
    ],
    caseStudies: [
      {
        title:
          'Seddons GSC LLP partners with Helm360 on their Elite 3E cloud journey',
        summary: 'Case study.',
        studyUrl:
          '[https://www.legalsupportnetwork.co.uk/case-study/seddons-gsc-llp-partners-with-helm360-on-their-elite-3e-cloud-journey/](https://www.legalsupportnetwork.co.uk/case-study/seddons-gsc-llp-partners-with-helm360-on-their-elite-3e-cloud-journey/)',
        sourceName: 'Legal Support Network Case Study',
        sourceUrl:
          '[https://www.legalsupportnetwork.co.uk/case-study/seddons-gsc-llp-partners-with-helm360-on-their-elite-3e-cloud-journey/](https://www.legalsupportnetwork.co.uk/case-study/seddons-gsc-llp-partners-with-helm360-on-their-elite-3e-cloud-journey/)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'epiq',
    brandName: 'Epiq',
    clients: [
      {
        clientName: 'McDonald Hopkins LLC',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Epiq Case Study',
        sourceUrl:
          '[https://www.epiqglobal.com/en-us/resource-center/case-study/mcdonald-hopkins-llc-transforms-financial-management-with-improved-new-business-intake-process](https://www.epiqglobal.com/en-us/resource-center/case-study/mcdonald-hopkins-llc-transforms-financial-management-with-improved-new-business-intake-process)',
      },
    ],
    caseStudies: [
      {
        title:
          'McDonald Hopkins LLC Transforms Financial Management With Improved New Business Intake Process',
        summary: 'Case study.',
        studyUrl:
          '[https://www.epiqglobal.com/en-us/resource-center/case-study/mcdonald-hopkins-llc-transforms-financial-management-with-improved-new-business-intake-process](https://www.epiqglobal.com/en-us/resource-center/case-study/mcdonald-hopkins-llc-transforms-financial-management-with-improved-new-business-intake-process)',
        sourceName: 'Epiq Case Study',
        sourceUrl:
          '[https://www.epiqglobal.com/en-us/resource-center/case-study/mcdonald-hopkins-llc-transforms-financial-management-with-improved-new-business-intake-process](https://www.epiqglobal.com/en-us/resource-center/case-study/mcdonald-hopkins-llc-transforms-financial-management-with-improved-new-business-intake-process)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'proventeq',
    brandName: 'Proventeq',
    clients: [
      {
        clientName: 'JSA Advocates & Solicitors',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Legal Support Network Case Study',
        sourceUrl:
          '[https://www.legalsupportnetwork.co.uk/case-study/proventeq-helps-jsa-advocates-and-solicitors-to-migrate-and-modernise-their-ecm-leading-to-interconnected-user-experiences/](https://www.legalsupportnetwork.co.uk/case-study/proventeq-helps-jsa-advocates-and-solicitors-to-migrate-and-modernise-their-ecm-leading-to-interconnected-user-experiences/)',
      },
      {
        clientName: 'Advantest',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'FeaturedCustomers (Proventeq Case Studies)',
        sourceUrl:
          '[https://www.featuredcustomers.com/vendor/proventeq/case-studies](https://www.featuredcustomers.com/vendor/proventeq/case-studies)',
      },
      {
        clientName: 'Australian Department of Home Affairs',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'FeaturedCustomers (Proventeq Case Studies)',
        sourceUrl:
          '[https://www.featuredcustomers.com/vendor/proventeq/case-studies](https://www.featuredcustomers.com/vendor/proventeq/case-studies)',
      },
    ],
    caseStudies: [
      {
        title:
          'Proventeq helps JSA advocates and solicitors to migrate and modernise their ECM leading to interconnected user experiences',
        summary: 'Case study.',
        studyUrl:
          '[https://www.legalsupportnetwork.co.uk/case-study/proventeq-helps-jsa-advocates-and-solicitors-to-migrate-and-modernise-their-ecm-leading-to-interconnected-user-experiences/](https://www.legalsupportnetwork.co.uk/case-study/proventeq-helps-jsa-advocates-and-solicitors-to-migrate-and-modernise-their-ecm-leading-to-interconnected-user-experiences/)',
        sourceName: 'Legal Support Network Case Study',
        sourceUrl:
          '[https://www.legalsupportnetwork.co.uk/case-study/proventeq-helps-jsa-advocates-and-solicitors-to-migrate-and-modernise-their-ecm-leading-to-interconnected-user-experiences/](https://www.legalsupportnetwork.co.uk/case-study/proventeq-helps-jsa-advocates-and-solicitors-to-migrate-and-modernise-their-ecm-leading-to-interconnected-user-experiences/)',
      },
      {
        title: 'Advantest - Customer Case Study',
        summary: 'Customer case study listing.',
        studyUrl:
          '[https://www.featuredcustomers.com/vendor/proventeq/case-studies](https://www.featuredcustomers.com/vendor/proventeq/case-studies)',
        sourceName: 'FeaturedCustomers (Proventeq Case Studies)',
        sourceUrl:
          '[https://www.featuredcustomers.com/vendor/proventeq/case-studies](https://www.featuredcustomers.com/vendor/proventeq/case-studies)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'accenture',
    brandName: 'Accenture',
    clients: [
      {
        clientName: 'Uber',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Accenture Customer Experience Case Studies (Index)',
        sourceUrl:
          '[https://www.accenture.com/us-en/about/song-client-stories-index](https://www.accenture.com/us-en/about/song-client-stories-index)',
      },
    ],
    caseStudies: [
      {
        title:
          "Uber's new ad platform seamlessly connects brands with customers at the right moments",
        summary: 'Case study listing.',
        studyUrl:
          '[https://www.accenture.com/us-en/about/song-client-stories-index](https://www.accenture.com/us-en/about/song-client-stories-index)',
        sourceName: 'Accenture Customer Experience Case Studies (Index)',
        sourceUrl:
          '[https://www.accenture.com/us-en/about/song-client-stories-index](https://www.accenture.com/us-en/about/song-client-stories-index)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'slalom',
    brandName: 'Slalom',
    clients: [
      {
        clientName: 'United Airlines',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Slalom Customer Story',
        sourceUrl:
          '[https://www.slalom.com/us/en/customer-stories/united-airlines-gen-ai](https://www.slalom.com/us/en/customer-stories/united-airlines-gen-ai)',
      },
    ],
    caseStudies: [
      {
        title: 'United Airlines',
        summary: 'Customer story.',
        studyUrl:
          '[https://www.slalom.com/us/en/customer-stories/united-airlines-gen-ai](https://www.slalom.com/us/en/customer-stories/united-airlines-gen-ai)',
        sourceName: 'Slalom Customer Story',
        sourceUrl:
          '[https://www.slalom.com/us/en/customer-stories/united-airlines-gen-ai](https://www.slalom.com/us/en/customer-stories/united-airlines-gen-ai)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'deloitte',
    brandName: 'Deloitte',
    clients: [
      {
        clientName: 'BHP',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Deloitte Case Studies',
        sourceUrl:
          '[https://www.deloitte.com/an/en/what-we-do/case-studies.html](https://www.deloitte.com/an/en/what-we-do/case-studies.html)',
      },
    ],
    caseStudies: [
      {
        title: 'Resolving supply network threats',
        summary: 'Case study listing.',
        studyUrl:
          '[https://www.deloitte.com/an/en/what-we-do/case-studies.html](https://www.deloitte.com/an/en/what-we-do/case-studies.html)',
        sourceName: 'Deloitte Case Studies',
        sourceUrl:
          '[https://www.deloitte.com/an/en/what-we-do/case-studies.html](https://www.deloitte.com/an/en/what-we-do/case-studies.html)',
      },
    ],
    reviews: [],
  },
  {
    vendorCode: 'zendesk_pro_services',
    brandName: 'Zendesk Pro Services',
    clients: [
      {
        clientName: 'Best Egg',
        clientLogoUrl: null,
        clientWebsiteUrl: null,
        sourceName: 'Zendesk Customer Stories',
        sourceUrl:
          '[https://www.zendesk.com/why-zendesk/customers/](https://www.zendesk.com/why-zendesk/customers/)',
      },
    ],
    caseStudies: [
      {
        title: 'Best Egg uses Zendesk AI to automate 80% of chat inquiries',
        summary: 'Customer story listing.',
        studyUrl:
          '[https://www.zendesk.com/why-zendesk/customers/](https://www.zendesk.com/why-zendesk/customers/)',
        sourceName: 'Zendesk Customer Stories',
        sourceUrl:
          '[https://www.zendesk.com/why-zendesk/customers/](https://www.zendesk.com/why-zendesk/customers/)',
      },
    ],
    reviews: [],
  },
];
