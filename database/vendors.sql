-- ============================================================================
-- VENHAWK VENDOR DATA - INSERT STATEMENTS
-- ============================================================================
-- Purpose: Insert all 12 vendors from CSV into the vendors table
-- Date: 2026-02-05
-- ============================================================================

-- Make sure we're using the right database
USE venhawk;

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE vendor_tech_stack;
-- TRUNCATE TABLE vendor_ratings;
-- TRUNCATE TABLE vendors;

-- ============================================================================
-- INSERT VENDOR DATA
-- ============================================================================

-- 1. LexisNexis
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    'cedfd3b3-481c-4eb6-8520-b2dc15a5bc05',
    'LexisNexis', 'LexisNexis', 'https://www.lexisnexis.com',
    'USA', 'NY', '10000+', 1970,
    'Enterprise Apps', 'Implementation; Project Delivery', 'Enterprise Apps; Service Mgmt',
    'Interaction, CounsellLink, Lexis Connect', 'Interaction, CounsellLink, Lexis Connect',
    6, 'Large',
    100000.00, 2000000.00,
    8, 52,
    'Time & Materials; Fixed Bid; Retainer options available',
    5, 'Y',
    'https://www.lexisnexis.com/legal-services', 'https://www.lexisnexis.com/case-studies', 'https://www.lexisnexis.com/partners',
    'G2', 4.3, 486, 'https://www.g2.com/products/lexisnexis-lexis/reviews',
    NULL, NULL, 0, NULL,
    'Some', 'Mid-market, Regional', 5,
    'Y', 2,
    'Y', 'Y', 'https://www.lexisnexis.com/security', 'SOC 2 Type II, ISO 27001 certified, enterprise-grade security',
    'Automated Research', 'Automated research. G2: 4.3/5', '2026-02-04', 'Prospect', 
    'Category: Application bug fixes & Integrations, Legal Application Implementations & Migrations; Tech Stack: Interaction, CounsellLink, Lexis Connect'
);

-- 2. Thomson Reuters
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    'ea5bd7c8-f3bb-4da1-961b-35db401013b5',
    'Thomson Reuters', 'Thomson Reuters', 'https://www.thomsonreuters.com',
    'Canada', 'ON', '25000+', 2008,
    'Enterprise Apps', 'Implementation', 'Collaboration; Enterprise Apps',
    'HighQ', 'HighQ',
    6, 'Large',
    100000.00, 2000000.00,
    8, 52,
    'Time & Materials; Fixed Bid; Retainer options available',
    5, 'Y',
    'https://www.thomsonreuters.com/legal-services', 'https://www.thomsonreuters.com/case-studies', 'https://www.thomsonreuters.com/partners',
    'G2', 4.4, 349, 'https://www.g2.com/products/thomson-reuters-westlaw/reviews',
    NULL, NULL, 0, NULL,
    'Some', 'Mid-market, Regional', 5,
    'Y', 2,
    'Y', 'Y', 'https://www.thomsonreuters.com/security', 'SOC 2 Type II, ISO 27001 certified, enterprise-grade security',
    'Automated Research', 'Automated research. G2: 4.4/5', '2026-02-04', 'Prospect',
    'Category: Legal Application Implementations & Migrations; Tech Stack: HighQ'
);

-- 3. TitanFile
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    '834a9f7b-df00-4ba6-b9fa-6feef9805a9c',
    'TitanFile', 'TitanFile Inc.', 'https://www.titanfile.com',
    'Canada', 'ON', '50-250', 2012,
    'SI', 'Implementation', 'Collaboration; Enterprise Apps',
    'TitanFile', 'TitanFile',
    2, 'Small',
    25000.00, 500000.00,
    4, 26,
    'Time & Materials; Fixed Bid; Retainer options available',
    5, 'Y',
    'https://www.titanfile.com/legal-services', 'https://www.titanfile.com/case-studies', 'https://www.titanfile.com/customers',
    NULL, NULL, 0, NULL,
    NULL, NULL, 0, NULL,
    'Some', 'Mid-market, Regional', 5,
    'Y', 2,
    'Unk', 'Unk', NULL, 'Security information not publicly available',
    'Automated Research', 'Automated research.', '2026-02-04', 'Prospect',
    'Category: Legal Application Implementations & Migrations; Tech Stack: TitanFile'
);

-- 4. Kraft Kennedy
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    'f96c70b5-f535-44f0-8745-3ebc72255b41',
    'Kraft Kennedy', 'Kraft Kennedy Inc.', 'https://www.kraftkennedy.com',
    'USA', 'NJ', '100-500', 2004,
    'Cloud', 'Implementation; Project Delivery; Advisory', 'Cloud',
    'N/A (Cloud focus)', NULL,
    4, 'Med',
    50000.00, 1000000.00,
    6, 39,
    'Time & Materials; Fixed Bid; Retainer options available',
    5, 'Y',
    'https://www.kraftkennedy.com/legal-services', 'https://www.kraftkennedy.com/case-studies', 'https://www.kraftkennedy.com/partners',
    NULL, NULL, 0, NULL,
    'Clutch', 4.8, 12, 'https://clutch.co/profile/kraft-kennedy',
    'Strong', 'AmLaw100, AmLaw200, Mid-market', 10,
    'Y', 5,
    'Y', 'Unk', 'https://www.kraftkennedy.com/security', 'SOC 2 Type II certified',
    'Automated Research', 'Automated research. Clutch: 4.8/5', '2026-02-04', 'Prospect',
    'Category: Application bug fixes & Integrations; Cloud Migrations & Modernization; Tech Stack: N/A (Cloud focus)'
);

-- 5. RBRO
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    '74bdcdee-0cbe-4467-b3a2-200272993b25',
    'RBRO', 'RBRO Inc.', 'https://www.rbro.com',
    'USA', 'CA', '50-250', 2005,
    'Boutique', 'Implementation', 'Collaboration; Enterprise Apps',
    'iManage', 'iManage',
    2, 'Small',
    25000.00, 500000.00,
    4, 26,
    'Time & Materials; Fixed Bid; Retainer options available',
    5, 'Y',
    'https://www.rbro.com/legal-services', 'https://www.rbro.com/case-studies', 'https://www.rbro.com/partners',
    NULL, NULL, 0, NULL,
    NULL, NULL, 0, NULL,
    'Legal-only', 'AmLaw100, AmLaw200, Mid-market', 10,
    'Y', 10,
    'Unk', 'Unk', NULL, 'Security information not publicly available',
    'Automated Research', 'Automated research.', '2026-02-04', 'Prospect',
    'Category: Legal Application Implementations & Migrations; Tech Stack: iManage'
);

-- 6. Inoutsource
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    'e2d7f483-16b7-4220-8f98-bb399edd14cc',
    'Inoutsource', 'Inoutsource Inc.', 'https://www.inoutsource.com',
    'USA', 'TX', '100-500', 2008,
    'Boutique', 'Implementation; Project Delivery', 'Collaboration; Enterprise Apps; Identity',
    'Intapp, NetDocuments, iCompli, Nectar, FileTrail', 'Intapp, NetDocuments, iCompli, Nectar, FileTrail',
    4, 'Med',
    50000.00, 1000000.00,
    6, 39,
    'Time & Materials; Fixed Bid; Retainer options available',
    5, 'Y',
    'https://www.inoutsource.com/legal-services', 'https://www.inoutsource.com/case-studies', 'https://www.inoutsource.com/partners',
    NULL, NULL, 0, NULL,
    'Clutch', 4.7, 15, 'https://clutch.co/profile/inoutsource',
    'Strong', 'AmLaw100, AmLaw200, Mid-market', 10,
    'Y', 5,
    'Y', 'Unk', 'https://www.inoutsource.com/security', 'SOC 2 Type II certified',
    'Automated Research', 'Automated research. Clutch: 4.7/5', '2026-02-04', 'Prospect',
    'Category: Application bug fixes & Integrations, Legal Application Implementations & Migrations; Tech Stack: Intapp, NetDocuments, iCompli, Nectar, FileTrail'
);

-- 7. eSentio Technologies
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    '74534dd1-ed5b-44ba-9085-62e0e1a8d50f',
    'eSentio Technologies', 'eSentio Technologies Inc.', 'https://www.esentio.com',
    'USA', 'Multi-state', '50-250', 2004,
    'Boutique', 'Implementation; Project Delivery', 'Collaboration; Enterprise Apps; Identity',
    'Intapp, NetDocuments, iManage, Litera', 'Intapp, NetDocuments, iManage, Litera',
    4, 'Med',
    50000.00, 1000000.00,
    6, 39,
    'Time & Materials; Fixed Bid; Retainer options available',
    10, 'Y',
    'https://www.esentio.com/legal-services', 'https://www.esentio.com/case-studies', 'https://www.esentio.com/partners',
    NULL, NULL, 0, NULL,
    'Clutch', 4.9, 8, 'https://clutch.co/profile/esentio-technologies',
    'Legal-only', 'AmLaw50, AmLaw100, AmLaw200', 10,
    'Y', 10,
    'Y', 'Unk', 'https://www.esentiotechnologies.com/security', 'SOC 2 Type II certified',
    'Automated Research', 'Automated research. Clutch: 4.9/5', '2026-02-04', 'Prospect',
    'Category: Application bug fixes & Integrations, Legal Application Implementations & Migrations; Tech Stack: Intapp, NetDocuments, iManage, Litera'
);

-- 8. AAC Consulting
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    'e70845b5-1f74-4f27-b695-494ed7ebe924',
    'AAC Consulting', 'AAC Consulting Inc.', 'https://www.aacconsulting.com',
    'USA', 'NY', '50-250', 1998,
    'Boutique', 'Project Delivery', 'Enterprise Apps; Service Mgmt',
    'Aderant, Elite', 'Aderant, Elite',
    2, 'Small',
    25000.00, 500000.00,
    4, 26,
    'Time & Materials; Fixed Bid; Retainer options available',
    5, 'Y',
    'https://www.aacconsulting.com/legal-services', 'https://www.aacconsulting.com/case-studies', 'https://www.aacconsulting.com/partners',
    NULL, NULL, 0, NULL,
    NULL, NULL, 0, NULL,
    'Legal-only', 'AmLaw100, AmLaw200, Mid-market', 10,
    'Y', 10,
    'Unk', 'Unk', NULL, 'Security information not publicly available',
    'Automated Research', 'Automated research.', '2026-02-04', 'Prospect',
    'Category: Application bug fixes & Integrations; Tech Stack: Aderant, Elite'
);

-- 9. Element Technologies
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    '5b3872ba-1a8b-4fb7-beb0-3dbc726ce11d',
    'Element Technologies', 'Element Technologies Inc.', 'https://www.elementtechnologies.com',
    'USA', 'CA', '50-250', 2000,
    'Cloud', 'Implementation; Advisory', 'Cloud',
    'N/A', NULL,
    2, 'Small',
    25000.00, 500000.00,
    4, 26,
    'Time & Materials; Fixed Bid; Retainer options available',
    5, 'Y',
    'https://www.elementtechnologies.com/legal-services', 'https://www.elementtechnologies.com/case-studies', 'https://www.elementtechnologies.com/partners',
    NULL, NULL, 0, NULL,
    NULL, NULL, 0, NULL,
    'Strong', 'Mid-market, Regional', 10,
    'Y', 5,
    'Unk', 'Unk', NULL, 'Security information not publicly available',
    'Automated Research', 'Automated research.', '2026-02-04', 'Prospect',
    'Category: Cloud Migrations & Modernization; Tech Stack: N/A'
);

-- 10. Helient Systems
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    '09740a13-eebe-4e63-9903-628c7e984a43',
    'Helient Systems', 'Helient Systems Inc.', 'https://www.helient.com',
    'USA', 'CA', '50-250', 1995,
    'Cloud', 'Implementation; Advisory', 'Cloud; Collaboration; Enterprise Apps',
    'iManage, Microsoft Cloud', 'iManage, Microsoft Cloud',
    2, 'Small',
    25000.00, 500000.00,
    4, 26,
    'Time & Materials; Fixed Bid; Retainer options available',
    5, 'Y',
    'https://www.helient.com/legal-services', 'https://www.helient.com/case-studies', 'https://www.helient.com/partners',
    NULL, NULL, 0, NULL,
    NULL, NULL, 0, NULL,
    'Strong', 'AmLaw100, AmLaw200, Mid-market', 10,
    'Y', 5,
    'Unk', 'Unk', NULL, 'Security information not publicly available',
    'Automated Research', 'Automated research.', '2026-02-04', 'Prospect',
    'Category: Cloud Migrations & Modernization; Tech Stack: iManage, Microsoft Cloud'
);

-- 11. CDW
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    '731255f6-762d-4e88-a1ca-e9dde3b52b67',
    'CDW', 'CDW Inc.', 'https://www.cdw.com',
    'USA', 'IL', '10000+', 1984,
    'SI', 'Implementation; Advisory', 'Enterprise Apps; Service Mgmt',
    'ServiceNow, Salesforce, SAP, Oracle, Microsoft Dynamics', 'ServiceNow, Salesforce, SAP, Oracle, Microsoft Dynamics',
    8, 'Large',
    250000.00, 10000000.00,
    12, 104,
    'Time & Materials; Fixed Bid; Retainer options available',
    10, 'Y',
    'https://www.cdw.com/industries/legal', 'https://www.cdw.com/case-studies', 'https://www.cdw.com/partners',
    'G2', 4.3, 156, 'https://www.g2.com/products/cdw/reviews',
    'Clutch', 4.7, 45, 'https://clutch.co/profile/cdw',
    'None', 'AmLaw50, AmLaw100, AmLaw200', 5,
    'Unk', 2,
    'Y', 'Y', 'https://www.cdw.com/security', 'SOC 2 Type II, ISO 27001 certified, enterprise-grade security',
    'Automated Research', 'Automated research. G2: 4.3/5; Clutch: 4.7/5', '2026-02-04', 'Prospect',
    'Category: Enterprise IT Implementations & Modernization; Tech Stack: ServiceNow, Salesforce, SAP, Oracle, Microsoft Dynamics'
);

-- 12. Cognizant
INSERT INTO vendors (
    vendor_id, brand_name, legal_name, website_url,
    hq_country, hq_state, company_size_band, founded_year,
    vendor_type, engagement_models, service_domains,
    platforms_experience, legal_tech_stack,
    lead_time_weeks, capacity_band,
    min_project_size_usd, max_project_size_usd,
    typical_duration_weeks_min, typical_duration_weeks_max,
    pricing_signal_notes,
    case_study_count_public, reference_available,
    proof_link_1, proof_link_2, proof_link_3,
    rating_source_1, rating_1, review_count_1, rating_url_1,
    rating_source_2, rating_2, review_count_2, rating_url_2,
    legal_focus_level, law_firm_size_fit, legal_delivery_years,
    legal_references_available, legal_case_studies_count,
    has_soc2, has_iso27001, security_overview_link, security_notes,
    data_owner, data_source_notes, last_verified_date, status, internal_notes
) VALUES (
    '42c900ec-d388-4884-8ab6-ce5a21855fc7',
    'Cognizant', 'Cognizant Inc.', 'https://www.cognizant.com',
    'USA', 'NJ', '300000+', 1994,
    'SI', 'Implementation; Advisory', 'Enterprise Apps; Service Mgmt',
    'ServiceNow, Workday', 'ServiceNow, Workday',
    8, 'Large',
    250000.00, 10000000.00,
    12, 104,
    'Time & Materials; Fixed Bid; Retainer options available',
    10, 'Y',
    'https://www.cognizant.com/industries/legal', 'https://www.cognizant.com/case-studies', 'https://www.cognizant.com/partners',
    'G2', 4.2, 1245, 'https://www.g2.com/products/cognizant/reviews',
    'Clutch', 4.8, 67, 'https://clutch.co/profile/cognizant',
    'None', 'AmLaw50, AmLaw100, AmLaw200', 5,
    'Unk', 2,
    'Y', 'Y', 'https://www.cognizant.com/security', 'SOC 2 Type II, ISO 27001 certified, enterprise-grade security',
    'Automated Research', 'Automated research. G2: 4.2/5; Clutch: 4.8/5', '2026-02-04', 'Prospect',
    'Category: Enterprise IT Implementations & Modernization; Tech Stack: ServiceNow, Workday'
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check how many vendors were inserted
SELECT COUNT(*) AS total_vendors FROM vendors;

-- Show all vendors with key info
SELECT 
    brand_name, 
    vendor_type,
    legal_focus_level,
    rating_1,
    rating_2,
    legal_tech_stack
FROM vendors
ORDER BY brand_name;

-- Show legal-only vendors
SELECT brand_name, legal_tech_stack, legal_delivery_years 
FROM vendors 
WHERE legal_focus_level = 'Legal-only'
ORDER BY legal_delivery_years DESC;

-- Show vendors with ratings
SELECT brand_name, rating_source_1, rating_1, rating_source_2, rating_2
FROM vendors
WHERE rating_1 IS NOT NULL OR rating_2 IS NOT NULL
ORDER BY rating_1 DESC, rating_2 DESC;

-- ============================================================================
-- END OF DATA INSERT
-- ============================================================================

-- Display success message
SELECT '✓ Successfully inserted 12 vendors into the database!' AS Status;
