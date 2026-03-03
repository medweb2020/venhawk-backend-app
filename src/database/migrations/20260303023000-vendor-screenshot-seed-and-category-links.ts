import { MigrationInterface, QueryRunner } from 'typeorm';

type ProjectCategorySeed = {
  value: string;
  label: string;
};

type VendorSeed = {
  vendor_id: string;
  brand_name: string;
  legal_name: string | null;
  website_url: string;
  logo_url: string | null;
  listing_order: number | null;
  listing_description: string | null;
  listing_specialty: string | null;
  listing_tier: string | null;
  hq_country: string;
  hq_state: string | null;
  company_size_band: string | null;
  founded_year: number | null;
  vendor_type: string | null;
  engagement_models: string | null;
  service_domains: string | null;
  platforms_experience: string | null;
  legal_tech_stack: string | null;
  lead_time_weeks: number | null;
  capacity_band: string | null;
  min_project_size_usd: number | null;
  max_project_size_usd: number | null;
  typical_duration_weeks_min: number | null;
  typical_duration_weeks_max: number | null;
  pricing_signal_notes: string | null;
  case_study_count_public: number;
  reference_available: 'Y' | 'N' | 'Unk';
  proof_link_1: string | null;
  proof_link_2: string | null;
  proof_link_3: string | null;
  rating_source_1: string | null;
  rating_1: number | null;
  review_count_1: number;
  rating_url_1: string | null;
  rating_source_2: string | null;
  rating_2: number | null;
  review_count_2: number;
  rating_url_2: string | null;
  legal_focus_level: 'None' | 'Some' | 'Strong' | 'Legal-only';
  law_firm_size_fit: string | null;
  legal_delivery_years: number | null;
  legal_references_available: 'Y' | 'N' | 'Unk';
  legal_case_studies_count: number;
  has_soc2: 'Y' | 'N' | 'Unk';
  has_iso27001: 'Y' | 'N' | 'Unk';
  ilta_present: number;
  is_microsoft_partner: number;
  is_servicenow_partner: number;
  is_workday_partner: number;
  security_overview_link: string | null;
  security_notes: string | null;
  data_owner: string;
  data_source_notes: string | null;
  last_verified_date: string;
  status: 'Prospect' | 'Validated' | 'Active' | 'Inactive' | 'Do-not-use';
  internal_notes: string | null;
};

type VendorCategorySystemReference = {
  vendorBrandName: string;
  projectCategoryValue: string;
  legalTechStack: string;
};

const REQUIRED_PROJECT_CATEGORIES: ProjectCategorySeed[] = [
  {
    value: 'legal-apps',
    label: 'Legal Application Implementations & Migrations',
  },
  {
    value: 'cloud-migration',
    label: 'Cloud Migrations & Infrastructure Modernization',
  },
  {
    value: 'enterprise-it',
    label: 'Enterprise IT Implementations & Modernization',
  },
  {
    value: 'app-bug-fixes',
    label: 'Application Bug Fixes & Integrations',
  },
];

const NEW_VENDORS: VendorSeed[] = [
  {
    vendor_id: '5e97024c-46ab-41c1-b591-2d531015b0cb',
    brand_name: 'Harbor',
    legal_name: 'Harbor (Global) Inc. (Legaltech services brand)',
    website_url: 'https://harborglobal.com',
    logo_url: 'https://harborglobal.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Global legal technology & consulting services (legal operations, technology, intelligence).',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'USA',
    hq_state: 'Multi-state',
    company_size_band: '500-1000',
    founded_year: 2023,
    vendor_type: 'Boutique',
    engagement_models: 'Implementation; Project Delivery; Advisory',
    service_domains: 'Collaboration; Enterprise Apps; Identity',
    platforms_experience:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Intapp Flow, Intapp DealCloud, Elite 3E, Aderant Expert, iManage Work, Interaction CRM, Microsoft Dynamics 365',
    legal_tech_stack:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Intapp Flow, Intapp DealCloud, Elite 3E, Aderant Expert, iManage Work, Interaction CRM, Microsoft Dynamics 365',
    lead_time_weeks: null,
    capacity_band: 'Large',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Unk',
    proof_link_1: 'https://harborglobal.com/',
    proof_link_2: 'https://harborglobal.com/resources',
    proof_link_3: 'https://www.elite.com/partner-program/partner-directory/',
    rating_source_1: null,
    rating_1: null,
    review_count_1: 0,
    rating_url_1: null,
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'Legal-only',
    law_firm_size_fit: 'AmLaw50, AmLaw100, AmLaw200',
    legal_delivery_years: null,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Unk',
    has_iso27001: 'Unk',
    ilta_present: 1,
    is_microsoft_partner: 0,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes: null,
    data_owner: 'Automated Research',
    data_source_notes:
      'Sources: Harbor website; Legal Technology Hub company profile; Elite Partner Directory (Harbor). ILTACON launch coverage.',
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Legal Application Implementations & Migrations; Tech Stack: Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Intapp Flow, Intapp DealCloud, Elite 3E, Aderant Expert, iManage Work, Interaction CRM, Microsoft Dynamics 365',
  },
  {
    vendor_id: '46cde8c2-6dd1-4e86-9944-a5c7c846a7e8',
    brand_name: 'Legalytics',
    legal_name: 'Legalytics Ltd.',
    website_url: 'https://legalytics.io',
    logo_url: 'https://legalytics.io/favicon.ico',
    listing_order: null,
    listing_description:
      'Legal analytics & dashboards (Power BI) for law firms and legal departments.',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'UK',
    hq_state: 'London',
    company_size_band: null,
    founded_year: 2017,
    vendor_type: 'Boutique',
    engagement_models: 'Implementation; Project Delivery',
    service_domains: 'Collaboration; Enterprise Apps; Analytics',
    platforms_experience:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Intapp Flow, Intapp DealCloud, Intapp Billstream, Elite 3E, Aderant Expert, iManage Work, NetDocuments, Interaction CRM, Microsoft Dynamics 365',
    legal_tech_stack:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Intapp Flow, Intapp DealCloud, Intapp Billstream, Elite 3E, Aderant Expert, iManage Work, NetDocuments, Interaction CRM, Microsoft Dynamics 365',
    lead_time_weeks: null,
    capacity_band: 'Small',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Unk',
    proof_link_1: 'https://legalytics.io',
    proof_link_2: null,
    proof_link_3: null,
    rating_source_1: null,
    rating_1: null,
    review_count_1: 0,
    rating_url_1: null,
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'Legal-only',
    law_firm_size_fit: 'Mid-market, Regional',
    legal_delivery_years: 5,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Unk',
    has_iso27001: 'Unk',
    ilta_present: 0,
    is_microsoft_partner: 0,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes: 'Security information not publicly available',
    data_owner: 'Automated Research',
    data_source_notes:
      'Sources: Legalytics website; UK Companies House (incorporated 23 Nov 2017).',
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Legal Application Implementations & Migrations; Tech Stack: Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Intapp Flow, Intapp DealCloud, Intapp Billstream, Elite 3E, Aderant Expert, iManage Work, NetDocuments, Interaction CRM, Microsoft Dynamics 365',
  },
  {
    vendor_id: '46b3a70d-7535-4c83-a12f-6d9d86df4454',
    brand_name: 'Helm360',
    legal_name: 'Helm360 LLC',
    website_url: 'https://helm360.com',
    logo_url: 'https://helm360.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Technology solutions and consulting for legal, financial, and accounting firms.',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'USA',
    hq_state: 'CA',
    company_size_band: '500-1000',
    founded_year: 2010,
    vendor_type: 'Boutique',
    engagement_models: 'Implementation; Project Delivery; Advisory',
    service_domains: 'Enterprise Apps; Cloud; Analytics',
    platforms_experience:
      'Elite 3E, Elite 3E Cloud, Aderant Expert, Microsoft Power BI, Microsoft Azure, Microsoft Power Automate',
    legal_tech_stack:
      'Elite 3E, Elite 3E Cloud, Aderant Expert, Microsoft Power BI, Microsoft Azure, Microsoft Power Automate',
    lead_time_weeks: null,
    capacity_band: 'Large',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Unk',
    proof_link_1: 'https://helm360.com',
    proof_link_2:
      'https://helm360.com/blog/the-importance-of-soc-2-ccpa-gdpr-compliance/',
    proof_link_3: null,
    rating_source_1: null,
    rating_1: null,
    review_count_1: 0,
    rating_url_1: null,
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'Strong',
    law_firm_size_fit: 'AmLaw100, AmLaw200, Mid-market',
    legal_delivery_years: 10,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Y',
    has_iso27001: 'Y',
    ilta_present: 0,
    is_microsoft_partner: 1,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link:
      'https://helm360.com/blog/the-importance-of-soc-2-ccpa-gdpr-compliance/',
    security_notes:
      'SOC 2 Type 2 and ISO 27001 mentioned in Helm360 compliance/security content.',
    data_owner: 'Automated Research',
    data_source_notes:
      'Sources: Helm360 website; CCS Global Tech company description; Helm360 compliance/security blog.',
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Legal Application Implementations & Migrations; Tech Stack: Elite 3E, Elite 3E Cloud, Aderant Expert, Microsoft Power BI, Microsoft Azure, Microsoft Power Automate',
  },
  {
    vendor_id: '9705b261-0cc4-48c3-b06a-ebcae8d88313',
    brand_name: 'Epiq',
    legal_name: 'Epiq Global, LLC',
    website_url: 'https://www.epiqglobal.com',
    logo_url: 'https://www.epiqglobal.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Legal solutions and business solutions provider (eDiscovery, managed services, etc.).',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'USA',
    hq_state: 'Multi-state',
    company_size_band: null,
    founded_year: 1988,
    vendor_type: 'SI',
    engagement_models: 'Implementation; Project Delivery',
    service_domains: 'Enterprise Apps; Collaboration',
    platforms_experience:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Elite 3E, Aderant Expert, iManage Work, NetDocuments',
    legal_tech_stack:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Elite 3E, Aderant Expert, iManage Work, NetDocuments',
    lead_time_weeks: null,
    capacity_band: 'Large',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Unk',
    proof_link_1: 'https://www.epiqglobal.com',
    proof_link_2: 'https://www.g2.com/sellers/epiq',
    proof_link_3: null,
    rating_source_1: 'G2',
    rating_1: 4.3,
    review_count_1: 47,
    rating_url_1: 'https://www.g2.com/sellers/epiq',
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'Some',
    law_firm_size_fit: 'AmLaw100, AmLaw200, Corporate Legal',
    legal_delivery_years: 10,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Unk',
    has_iso27001: 'Unk',
    ilta_present: 0,
    is_microsoft_partner: 0,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes:
      'Security information not captured in this pass (needs follow-up).',
    data_owner: 'Automated Research',
    data_source_notes:
      "Sources: Epiq website; G2 seller page (rating and 'Serving customers since 1988').",
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Legal Application Implementations & Migrations; Tech Stack: Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Elite 3E, Aderant Expert, iManage Work, NetDocuments',
  },
  {
    vendor_id: '45fccc84-9177-4807-8fb8-44b5cb921b4b',
    brand_name: 'Proventeq',
    legal_name: 'Proventeq Ltd.',
    website_url: 'https://www.proventeq.com',
    logo_url: 'https://www.proventeq.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Digital workplace and content productivity services; iManage & Microsoft 365 integration expertise.',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'UK',
    hq_state: 'Berkshire',
    company_size_band: '50-249',
    founded_year: 2007,
    vendor_type: 'Cloud',
    engagement_models: 'Implementation; Project Delivery',
    service_domains: 'Collaboration; Cloud',
    platforms_experience:
      'iManage Work, Microsoft SharePoint, Microsoft Teams, Microsoft OneDrive',
    legal_tech_stack:
      'iManage Work, Microsoft SharePoint, Microsoft Teams, Microsoft OneDrive',
    lead_time_weeks: null,
    capacity_band: 'Med',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes:
      "Clutch lists min. project size and hourly rate as undisclosed; one verified project in review listed as 'Confidential'.",
    case_study_count_public: 0,
    reference_available: 'Y',
    proof_link_1: 'https://www.proventeq.com',
    proof_link_2: 'https://clutch.co/profile/proventeq',
    proof_link_3: null,
    rating_source_1: 'Clutch',
    rating_1: 5,
    review_count_1: 1,
    rating_url_1: 'https://clutch.co/profile/proventeq',
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'Strong',
    law_firm_size_fit: 'Mid-market, Regional',
    legal_delivery_years: 10,
    legal_references_available: 'Y',
    legal_case_studies_count: 0,
    has_soc2: 'Unk',
    has_iso27001: 'Unk',
    ilta_present: 0,
    is_microsoft_partner: 1,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes: 'Security information not publicly captured in this pass.',
    data_owner: 'Automated Research',
    data_source_notes:
      'Sources: Clutch profile (employees band, year founded, rating/reviews, locations, Microsoft Solutions Partner mention).',
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Legal Application Implementations & Migrations; Tech Stack: iManage Work, Microsoft SharePoint, Microsoft Teams, Microsoft OneDrive',
  },
  {
    vendor_id: '9ccda488-f3d9-4075-a9dd-af02dbee2f74',
    brand_name: 'Premier Technology Solutions',
    legal_name: 'Premier Technology Solutions, Inc.',
    website_url: 'https://www.premiertechnology.com',
    logo_url: 'https://www.premiertechnology.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Legal-focused technology consulting and implementations (Intapp, iManage, Microsoft).',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'USA',
    hq_state: 'NY',
    company_size_band: null,
    founded_year: null,
    vendor_type: 'Boutique',
    engagement_models: 'Implementation; Project Delivery; Advisory',
    service_domains: 'Collaboration; Enterprise Apps; Cloud',
    platforms_experience:
      'Intapp Intake, Intapp Conflicts, iManage Work, Microsoft 365, Microsoft SharePoint, Microsoft Azure',
    legal_tech_stack:
      'Intapp Intake, Intapp Conflicts, iManage Work, Microsoft 365, Microsoft SharePoint, Microsoft Azure',
    lead_time_weeks: null,
    capacity_band: 'Med',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Unk',
    proof_link_1: 'https://www.premiertechnology.com',
    proof_link_2: null,
    proof_link_3: null,
    rating_source_1: null,
    rating_1: null,
    review_count_1: 0,
    rating_url_1: null,
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'Legal-only',
    law_firm_size_fit: 'AmLaw100, AmLaw200, Mid-market',
    legal_delivery_years: 10,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Unk',
    has_iso27001: 'Unk',
    ilta_present: 0,
    is_microsoft_partner: 1,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes: 'Security information not publicly captured in this pass.',
    data_owner: 'Automated Research',
    data_source_notes:
      'Sources: Premier Technology website; Intapp partner listing (headquartered in Manhattan; partnerships include Microsoft and iManage).',
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Legal Application Implementations & Migrations; Tech Stack: Intapp Intake, Intapp Conflicts, iManage Work, Microsoft 365, Microsoft SharePoint, Microsoft Azure',
  },
  {
    vendor_id: 'fedd73ee-64ab-4844-be8a-f70d9619a42c',
    brand_name: 'Accenture',
    legal_name: 'Accenture plc',
    website_url: 'https://www.accenture.com',
    logo_url: 'https://www.accenture.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Global systems integrator for cloud, enterprise applications, and technology transformation.',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'Ireland',
    hq_state: 'Dublin',
    company_size_band: '300000+',
    founded_year: 1989,
    vendor_type: 'SI',
    engagement_models: 'Implementation; Project Delivery; Advisory',
    service_domains: 'Cloud; Enterprise Apps; Service Mgmt',
    platforms_experience:
      'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Snowflake, Oracle Cloud Infrastructure, ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, ServiceNow CSM, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Salesforce Agentforce, Microsoft 365, Oracle Cloud ERP, Oracle Cloud HCM',
    legal_tech_stack:
      'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Snowflake, Oracle Cloud Infrastructure, ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, ServiceNow CSM, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Salesforce Agentforce, Microsoft 365, Oracle Cloud ERP, Oracle Cloud HCM',
    lead_time_weeks: null,
    capacity_band: 'Large',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Y',
    proof_link_1: 'https://www.accenture.com',
    proof_link_2: 'https://www.g2.com/sellers/accenture',
    proof_link_3: null,
    rating_source_1: 'G2',
    rating_1: 4.3,
    review_count_1: 195,
    rating_url_1: 'https://www.g2.com/sellers/accenture',
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'None',
    law_firm_size_fit: 'AmLaw50, AmLaw100, AmLaw200',
    legal_delivery_years: 5,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Y',
    has_iso27001: 'Y',
    ilta_present: 0,
    is_microsoft_partner: 0,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes:
      'Enterprise-grade security controls; specific certifications not captured in this pass.',
    data_owner: 'Automated Research',
    data_source_notes:
      'Sources: G2 seller page (rating, review count, \'Serving customers since 1989\'); Accenture website.',
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Cloud Migrations & Infrastructure Modernization; Enterprise IT Implementations & Modernization; Application Bug Fixes & Integrations; Tech Stack: Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Snowflake, Oracle Cloud Infrastructure, ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, ServiceNow CSM, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Salesforce Agentforce, Microsoft 365, Oracle Cloud ERP, Oracle Cloud HCM',
  },
  {
    vendor_id: '587ded29-ed02-4151-b590-a7ca99632efd',
    brand_name: 'Slalom',
    legal_name: 'Slalom, LLC',
    website_url: 'https://www.slalom.com',
    logo_url: 'https://www.slalom.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Business and technology consulting services; cloud and enterprise app implementations.',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'USA',
    hq_state: 'WA',
    company_size_band: '10000+',
    founded_year: 2001,
    vendor_type: 'SI',
    engagement_models: 'Implementation; Project Delivery; Advisory',
    service_domains: 'Cloud; Enterprise Apps; Analytics',
    platforms_experience:
      'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Snowflake, Databricks, Workday HCM, Workday Financial Management, Workday Payroll, Tableau, Zendesk Suite, Salesforce Sales Cloud, Salesforce Service Cloud, Salesforce Agentforce, Microsoft 365, Microsoft Power Platform, OpenAI API',
    legal_tech_stack:
      'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Snowflake, Databricks, Workday HCM, Workday Financial Management, Workday Payroll, Tableau, Zendesk Suite, Salesforce Sales Cloud, Salesforce Service Cloud, Salesforce Agentforce, Microsoft 365, Microsoft Power Platform, OpenAI API',
    lead_time_weeks: null,
    capacity_band: 'Large',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Y',
    proof_link_1: 'https://www.slalom.com',
    proof_link_2: 'https://www.g2.com/products/slalom/reviews',
    proof_link_3: null,
    rating_source_1: 'G2',
    rating_1: 4.2,
    review_count_1: 12,
    rating_url_1: 'https://www.g2.com/products/slalom/reviews',
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'None',
    law_firm_size_fit: 'AmLaw50, AmLaw100, AmLaw200',
    legal_delivery_years: 5,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Unk',
    has_iso27001: 'Unk',
    ilta_present: 0,
    is_microsoft_partner: 0,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes: 'Security certifications not captured in this pass.',
    data_owner: 'Automated Research',
    data_source_notes:
      'Sources: G2 product review page (rating/review count); Slalom website. Founded year and HQ state need confirmation.',
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Cloud Migrations & Infrastructure Modernization; Enterprise IT Implementations & Modernization; Application Bug Fixes & Integrations; Tech Stack: Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Snowflake, Databricks, Workday HCM, Workday Financial Management, Workday Payroll, Tableau, Zendesk Suite, Salesforce Sales Cloud, Salesforce Service Cloud, Salesforce Agentforce, Microsoft 365, Microsoft Power Platform, OpenAI API',
  },
  {
    vendor_id: '2446a2ce-96ad-403f-81c9-4cf28bcbf9ce',
    brand_name: 'Deloitte',
    legal_name: 'Deloitte Touche Tohmatsu Limited',
    website_url: 'https://www.deloitte.com',
    logo_url: 'https://www.deloitte.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Professional services network providing consulting, technology, and enterprise transformation.',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'UK',
    hq_state: 'London',
    company_size_band: '300000+',
    founded_year: 1845,
    vendor_type: 'SI',
    engagement_models: 'Implementation; Project Delivery; Advisory',
    service_domains: 'Cloud; Enterprise Apps; Service Mgmt',
    platforms_experience:
      'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Oracle Cloud Infrastructure, ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, ServiceNow CSM, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Microsoft 365, Oracle Cloud ERP',
    legal_tech_stack:
      'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Oracle Cloud Infrastructure, ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, ServiceNow CSM, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Microsoft 365, Oracle Cloud ERP',
    lead_time_weeks: null,
    capacity_band: 'Large',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Y',
    proof_link_1: 'https://www.deloitte.com',
    proof_link_2: 'https://www.g2.com/sellers/deloitte',
    proof_link_3: null,
    rating_source_1: 'G2',
    rating_1: 4.1,
    review_count_1: 79,
    rating_url_1: 'https://www.g2.com/sellers/deloitte',
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'None',
    law_firm_size_fit: 'AmLaw50, AmLaw100, AmLaw200',
    legal_delivery_years: 5,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Y',
    has_iso27001: 'Y',
    ilta_present: 0,
    is_microsoft_partner: 0,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes:
      'Enterprise-grade security controls; specific certifications not captured in this pass.',
    data_owner: 'Automated Research',
    data_source_notes:
      "Sources: G2 seller page (rating, review count, 'Serving customers since 1845'); Deloitte website.",
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Cloud Migrations & Infrastructure Modernization; Enterprise IT Implementations & Modernization; Application Bug Fixes & Integrations; Tech Stack: Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Oracle Cloud Infrastructure, ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, ServiceNow CSM, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Microsoft 365, Oracle Cloud ERP',
  },
  {
    vendor_id: '6537cb6e-dc06-452b-ae59-abab3dd61a81',
    brand_name: 'KPMG',
    legal_name: 'KPMG International Limited',
    website_url: 'https://kpmg.com',
    logo_url: 'https://kpmg.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Professional services network providing consulting and technology transformation services.',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'Netherlands',
    hq_state: 'Amstelveen',
    company_size_band: '300000+',
    founded_year: 1987,
    vendor_type: 'SI',
    engagement_models: 'Implementation; Project Delivery; Advisory',
    service_domains: 'Cloud; Enterprise Apps; Service Mgmt',
    platforms_experience:
      'Microsoft Azure, Amazon Web Services (AWS), Google Cloud Platform, Oracle Cloud Infrastructure, ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Microsoft Dynamics 365, Oracle Cloud ERP, Oracle Cloud HCM, Oracle EPM, Oracle NetSuite, UKG Pro, UKG Pro Workforce Management',
    legal_tech_stack:
      'Microsoft Azure, Amazon Web Services (AWS), Google Cloud Platform, Oracle Cloud Infrastructure, ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Microsoft Dynamics 365, Oracle Cloud ERP, Oracle Cloud HCM, Oracle EPM, Oracle NetSuite, UKG Pro, UKG Pro Workforce Management',
    lead_time_weeks: null,
    capacity_band: 'Large',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Unk',
    proof_link_1: 'https://kpmg.com',
    proof_link_2: null,
    proof_link_3: null,
    rating_source_1: null,
    rating_1: null,
    review_count_1: 0,
    rating_url_1: null,
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'None',
    law_firm_size_fit: 'AmLaw50, AmLaw100, AmLaw200',
    legal_delivery_years: 5,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Y',
    has_iso27001: 'Y',
    ilta_present: 0,
    is_microsoft_partner: 0,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes: 'Security certifications not captured in this pass.',
    data_owner: 'Automated Research',
    data_source_notes:
      'KPMG site opened; G2 seller URL for KPMG returned 410 Gone during this pass, so ratings not captured. Founded year and HQ need confirmation.',
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Cloud Migrations & Infrastructure Modernization; Enterprise IT Implementations & Modernization; Application Bug Fixes & Integrations; Tech Stack: Microsoft Azure, Amazon Web Services (AWS), Google Cloud Platform, Oracle Cloud Infrastructure, ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Microsoft Dynamics 365, Oracle Cloud ERP, Oracle Cloud HCM, Oracle EPM, Oracle NetSuite, UKG Pro, UKG Pro Workforce Management',
  },
  {
    vendor_id: '9675b1dd-8bab-4685-8992-e0f5938df19d',
    brand_name: 'Zendesk Pro Services',
    legal_name: 'Zendesk, Inc.',
    website_url: 'https://www.zendesk.com',
    logo_url: 'https://www.zendesk.com/favicon.ico',
    listing_order: null,
    listing_description:
      'Zendesk Professional Services for implementation, onboarding, and optimization.',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'USA',
    hq_state: 'CA',
    company_size_band: '5000-10000',
    founded_year: 2007,
    vendor_type: 'Enterprise Apps',
    engagement_models: 'Implementation; Advisory',
    service_domains: 'Service Mgmt; Enterprise Apps',
    platforms_experience:
      'Zendesk Suite, Zendesk AI Copilot, Zendesk Explore Analytics, Zendesk Sunshine CRM, Zendesk for Service, Zendesk for Sales',
    legal_tech_stack:
      'Zendesk Suite, Zendesk AI Copilot, Zendesk Explore Analytics, Zendesk Sunshine CRM, Zendesk for Service, Zendesk for Sales',
    lead_time_weeks: null,
    capacity_band: 'Large',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Unk',
    proof_link_1: 'https://www.zendesk.com',
    proof_link_2: 'https://www.zendesk.com/services/',
    proof_link_3: 'https://www.zendesk.com/company/trust-center/',
    rating_source_1: null,
    rating_1: null,
    review_count_1: 0,
    rating_url_1: null,
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'None',
    law_firm_size_fit: 'Mid-market, Regional, Enterprise',
    legal_delivery_years: 5,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Y',
    has_iso27001: 'Y',
    ilta_present: 0,
    is_microsoft_partner: 0,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: 'https://www.zendesk.com/company/trust-center/',
    security_notes: 'Zendesk provides a Trust Center (security & compliance).',
    data_owner: 'Automated Research',
    data_source_notes:
      'Sources: Zendesk website (professional services link visible on homepage); Trust Center page.',
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Enterprise IT Implementations & Modernization; Tech Stack: Zendesk Suite, Zendesk AI Copilot, Zendesk Explore Analytics, Zendesk Sunshine CRM, Zendesk for Service, Zendesk for Sales',
  },
  {
    vendor_id: '5a25fcec-c56b-4e11-8b56-ab7ac72b6616',
    brand_name: 'Wise Consulting',
    legal_name: 'RSM US LLP (Wise Consulting is now RSM)',
    website_url: 'https://rsmus.com',
    logo_url: 'https://rsmus.com/favicon.ico',
    listing_order: null,
    listing_description:
      'UKG & Dayforce consulting/implementation practice (now part of RSM).',
    listing_specialty: null,
    listing_tier: null,
    hq_country: 'USA',
    hq_state: 'IL',
    company_size_band: '10000+',
    founded_year: null,
    vendor_type: 'SI',
    engagement_models: 'Implementation; Advisory',
    service_domains: 'Enterprise Apps',
    platforms_experience:
      'UKG Pro, UKG Pro Workforce Management, Dayforce HCM, Dayforce Payroll, Dayforce Talent Management, Dayforce Workforce Management',
    legal_tech_stack:
      'UKG Pro, UKG Pro Workforce Management, Dayforce HCM, Dayforce Payroll, Dayforce Talent Management, Dayforce Workforce Management',
    lead_time_weeks: null,
    capacity_band: 'Large',
    min_project_size_usd: null,
    max_project_size_usd: null,
    typical_duration_weeks_min: null,
    typical_duration_weeks_max: null,
    pricing_signal_notes: null,
    case_study_count_public: 0,
    reference_available: 'Unk',
    proof_link_1: 'https://rsmus.com',
    proof_link_2:
      'https://rsmus.com/technologies/wise-consulting-is-now-rsm.html',
    proof_link_3: null,
    rating_source_1: null,
    rating_1: null,
    review_count_1: 0,
    rating_url_1: null,
    rating_source_2: null,
    rating_2: null,
    review_count_2: 0,
    rating_url_2: null,
    legal_focus_level: 'None',
    law_firm_size_fit: 'Mid-market, Regional, Enterprise',
    legal_delivery_years: 5,
    legal_references_available: 'Unk',
    legal_case_studies_count: 0,
    has_soc2: 'Unk',
    has_iso27001: 'Unk',
    ilta_present: 0,
    is_microsoft_partner: 0,
    is_servicenow_partner: 0,
    is_workday_partner: 0,
    security_overview_link: null,
    security_notes: 'Security certifications not captured in this pass.',
    data_owner: 'Automated Research',
    data_source_notes:
      "Sources: RSM page stating 'Wise Consulting is now RSM'.",
    last_verified_date: '2026-03-02',
    status: 'Prospect',
    internal_notes:
      'Category: Enterprise IT Implementations & Modernization; Tech Stack: UKG Pro, UKG Pro Workforce Management, Dayforce HCM, Dayforce Payroll, Dayforce Talent Management, Dayforce Workforce Management',
  },
];

const VENDOR_CATEGORY_SYSTEM_REFERENCES: VendorCategorySystemReference[] = [
  {
    vendorBrandName: 'Harbor',
    projectCategoryValue: 'legal-apps',
    legalTechStack:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Intapp Flow, Intapp DealCloud, Elite 3E, Aderant Expert, iManage Work, Interaction CRM, Microsoft Dynamics 365',
  },
  {
    vendorBrandName: 'Legalytics',
    projectCategoryValue: 'legal-apps',
    legalTechStack:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Intapp Flow, Intapp DealCloud, Intapp Billstream, Elite 3E, Aderant Expert, iManage Work, NetDocuments, Interaction CRM, Microsoft Dynamics 365',
  },
  {
    vendorBrandName: 'Helm360',
    projectCategoryValue: 'legal-apps',
    legalTechStack:
      'Elite 3E, Elite 3E Cloud, Aderant Expert, Microsoft Power BI, Microsoft Azure, Microsoft Power Automate',
  },
  {
    vendorBrandName: 'Epiq',
    projectCategoryValue: 'legal-apps',
    legalTechStack:
      'Intapp Intake, Intapp Conflicts, Intapp Time, Intapp Walls, Elite 3E, Aderant Expert, iManage Work, NetDocuments',
  },
  {
    vendorBrandName: 'Proventeq',
    projectCategoryValue: 'legal-apps',
    legalTechStack:
      'iManage Work, Microsoft SharePoint, Microsoft Teams, Microsoft OneDrive',
  },
  {
    vendorBrandName: 'Premier Technology Solutions',
    projectCategoryValue: 'legal-apps',
    legalTechStack:
      'Intapp Intake, Intapp Conflicts, iManage Work, Microsoft 365, Microsoft SharePoint, Microsoft Azure',
  },
  {
    vendorBrandName: 'Accenture',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Snowflake, Oracle Cloud Infrastructure',
  },
  {
    vendorBrandName: 'Slalom',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Snowflake, Databricks',
  },
  {
    vendorBrandName: 'Deloitte',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform, Oracle Cloud Infrastructure',
  },
  {
    vendorBrandName: 'KPMG',
    projectCategoryValue: 'cloud-migration',
    legalTechStack:
      'Microsoft Azure, Amazon Web Services (AWS), Google Cloud Platform, Oracle Cloud Infrastructure',
  },
  {
    vendorBrandName: 'Slalom',
    projectCategoryValue: 'enterprise-it',
    legalTechStack:
      'Workday HCM, Workday Financial Management, Workday Payroll, Amazon Web Services (AWS), Google Cloud Platform, Tableau, Zendesk Suite, Salesforce Sales Cloud, Salesforce Service Cloud, Salesforce Agentforce, Microsoft Azure, Microsoft 365',
  },
  {
    vendorBrandName: 'Accenture',
    projectCategoryValue: 'enterprise-it',
    legalTechStack:
      'ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, ServiceNow CSM, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Salesforce Agentforce, Microsoft Azure, Microsoft 365, Amazon Web Services (AWS), Google Cloud Platform, Snowflake',
  },
  {
    vendorBrandName: 'KPMG',
    projectCategoryValue: 'enterprise-it',
    legalTechStack:
      'ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Microsoft Azure, Microsoft Dynamics 365, Oracle Cloud ERP, Oracle Cloud HCM, Oracle EPM, Oracle NetSuite, UKG Pro, UKG Pro Workforce Management',
  },
  {
    vendorBrandName: 'Deloitte',
    projectCategoryValue: 'enterprise-it',
    legalTechStack:
      'ServiceNow ITSM, ServiceNow ITOM, ServiceNow HR Service Delivery, ServiceNow CSM, Workday HCM, Workday Financial Management, Workday Payroll, SAP S/4HANA, SAP SuccessFactors, Salesforce Sales Cloud, Salesforce Service Cloud, Microsoft Azure, Microsoft 365',
  },
  {
    vendorBrandName: 'Zendesk Pro Services',
    projectCategoryValue: 'enterprise-it',
    legalTechStack:
      'Zendesk Suite, Zendesk AI Copilot, Zendesk Explore Analytics, Zendesk Sunshine CRM, Zendesk for Service, Zendesk for Sales',
  },
  {
    vendorBrandName: 'Wise Consulting',
    projectCategoryValue: 'enterprise-it',
    legalTechStack:
      'UKG Pro, UKG Pro Workforce Management, Dayforce HCM, Dayforce Payroll, Dayforce Talent Management, Dayforce Workforce Management',
  },
  {
    vendorBrandName: 'Slalom',
    projectCategoryValue: 'app-bug-fixes',
    legalTechStack:
      'Salesforce Agentforce, Microsoft Power Platform, Tableau, OpenAI API',
  },
  {
    vendorBrandName: 'Accenture',
    projectCategoryValue: 'app-bug-fixes',
    legalTechStack:
      'SAP S/4HANA, SAP SuccessFactors, Oracle Cloud ERP, Oracle Cloud HCM, Salesforce Sales Cloud, Salesforce Service Cloud',
  },
  {
    vendorBrandName: 'Deloitte',
    projectCategoryValue: 'app-bug-fixes',
    legalTechStack:
      'SAP S/4HANA, SAP SuccessFactors, Oracle Cloud ERP, Salesforce Sales Cloud, Salesforce Service Cloud',
  },
  {
    vendorBrandName: 'KPMG',
    projectCategoryValue: 'app-bug-fixes',
    legalTechStack:
      'SAP S/4HANA, SAP SuccessFactors, Oracle Cloud ERP, Oracle NetSuite, Salesforce Sales Cloud',
  },
];

function parseSystems(value: string): string[] {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function buildLegalTechStackByVendor(): Map<string, string> {
  const systemsByVendor = new Map<string, string[]>();

  for (const reference of VENDOR_CATEGORY_SYSTEM_REFERENCES) {
    const current = systemsByVendor.get(reference.vendorBrandName) ?? [];

    for (const system of parseSystems(reference.legalTechStack)) {
      if (!current.includes(system)) {
        current.push(system);
      }
    }

    systemsByVendor.set(reference.vendorBrandName, current);
  }

  return new Map(
    Array.from(systemsByVendor.entries()).map(([brandName, systems]) => [
      brandName,
      systems.join(', '),
    ]),
  );
}

const LEGAL_TECH_STACK_BY_VENDOR = buildLegalTechStackByVendor();

const VENDOR_INSERT_COLUMNS = [
  'vendor_id',
  'brand_name',
  'legal_name',
  'website_url',
  'logo_url',
  'listing_order',
  'listing_description',
  'listing_specialty',
  'listing_tier',
  'hq_country',
  'hq_state',
  'company_size_band',
  'founded_year',
  'vendor_type',
  'engagement_models',
  'service_domains',
  'platforms_experience',
  'legal_tech_stack',
  'lead_time_weeks',
  'capacity_band',
  'min_project_size_usd',
  'max_project_size_usd',
  'typical_duration_weeks_min',
  'typical_duration_weeks_max',
  'pricing_signal_notes',
  'case_study_count_public',
  'reference_available',
  'proof_link_1',
  'proof_link_2',
  'proof_link_3',
  'rating_source_1',
  'rating_1',
  'review_count_1',
  'rating_url_1',
  'rating_source_2',
  'rating_2',
  'review_count_2',
  'rating_url_2',
  'legal_focus_level',
  'law_firm_size_fit',
  'legal_delivery_years',
  'legal_references_available',
  'legal_case_studies_count',
  'has_soc2',
  'has_iso27001',
  'ilta_present',
  'is_microsoft_partner',
  'is_servicenow_partner',
  'is_workday_partner',
  'security_overview_link',
  'security_notes',
  'data_owner',
  'data_source_notes',
  'last_verified_date',
  'status',
  'internal_notes',
] as const;

const VENDOR_UPDATE_COLUMNS = VENDOR_INSERT_COLUMNS.filter(
  (column) => column !== 'vendor_id',
);

function buildVendorInsertValues(vendor: VendorSeed): unknown[] {
  return VENDOR_INSERT_COLUMNS.map((column) => vendor[column]);
}

function buildVendorUpdateValues(vendor: VendorSeed): unknown[] {
  return VENDOR_UPDATE_COLUMNS.map((column) => vendor[column]);
}

export class VendorScreenshotSeedAndCategoryLinks20260303023000
  implements MigrationInterface
{
  name = 'VendorScreenshotSeedAndCategoryLinks20260303023000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const category of REQUIRED_PROJECT_CATEGORIES) {
      await queryRunner.query(
        `
          INSERT INTO project_categories (value, label, created_at)
          SELECT ?, ?, CURRENT_TIMESTAMP
          WHERE NOT EXISTS (
            SELECT 1 FROM project_categories WHERE value = ?
          )
        `,
        [category.value, category.label, category.value],
      );
    }

    for (const vendor of NEW_VENDORS) {
      const insertValues = buildVendorInsertValues(vendor);
      const updateValues = buildVendorUpdateValues(vendor);

      await queryRunner.query(
        `
          INSERT INTO vendors (${VENDOR_INSERT_COLUMNS.join(', ')})
          SELECT ${VENDOR_INSERT_COLUMNS.map(() => '?').join(', ')}
          WHERE NOT EXISTS (
            SELECT 1 FROM vendors WHERE vendor_id = ?
          )
        `,
        [...insertValues, vendor.vendor_id],
      );

      await queryRunner.query(
        `
          UPDATE vendors
          SET
            ${VENDOR_UPDATE_COLUMNS.map((column) => `${column} = ?`).join(',\n            ')},
            updated_at = CURRENT_TIMESTAMP
          WHERE vendor_id = ?
        `,
        [...updateValues, vendor.vendor_id],
      );
    }

    for (const reference of VENDOR_CATEGORY_SYSTEM_REFERENCES) {
      await queryRunner.query(
        `
          INSERT IGNORE INTO vendor_project_categories (
            vendor_id,
            project_category_id,
            created_at,
            updated_at
          )
          SELECT
            v.id,
            pc.id,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          FROM vendors v
          INNER JOIN project_categories pc ON pc.value = ?
          WHERE v.brand_name = ?
        `,
        [reference.projectCategoryValue, reference.vendorBrandName],
      );
    }

    for (const [brandName, legalTechStack] of LEGAL_TECH_STACK_BY_VENDOR) {
      await queryRunner.query(
        `
          UPDATE vendors
          SET legal_tech_stack = ?, updated_at = CURRENT_TIMESTAMP
          WHERE brand_name = ?
        `,
        [legalTechStack, brandName],
      );
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Irreversible data migration (seed + category mapping sync).
  }
}
