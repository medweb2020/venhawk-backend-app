import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Phase 2 Step 2 — Seed systems table (76 canonical rows)
 *
 * Coverage:
 *   Intapp (8) · iManage (1) · NetDocuments (1) · Legal Billing (3)
 *   Legal CRM (3) · Legal Tech (11) · Microsoft (11) · Cloud (5)
 *   ServiceNow (4) · Workday (3) · Oracle (4) · SAP (2)
 *   Salesforce (3) · UKG (2) · Dayforce (4) · Data (3)
 *   Zendesk (6) · Security (2)
 *
 * Excluded by design:
 *   • Oracle (generic)    — dropped per Phase 1 addendum (too broad)
 *   • PST Migration       — dropped per Phase 1 addendum (migration project type, not a system)
 *
 * aliases: lowercase strings used by SystemResolverService for alias-tier matching.
 *
 * down() empties vendor_systems (FK dependency) then deletes all seeded rows.
 */
export class SeedSystems20260504000001 implements MigrationInterface {
  name = 'SeedSystems20260504000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Intapp suite ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Intapp Open',        'Intapp', 'Intapp', 'legal_practice_management',
          '["intapp","intapp open platform","intappopen","open platform"]'),
        ('Intapp Intake',      'Intapp', 'Intapp', 'legal_practice_management',
          '["intake","intapp intake & matter management","intapp matter management"]'),
        ('Intapp Conflicts',   'Intapp', 'Intapp', 'legal_compliance',
          '["conflicts","intapp conflicts manager","conflict check"]'),
        ('Intapp Time',        'Intapp', 'Intapp', 'legal_billing',
          '["intapp time & billing","time & billing","intapp time management"]'),
        ('Intapp Walls',       'Intapp', 'Intapp', 'legal_compliance',
          '["walls","intapp walls manager","ethical walls","information barriers"]'),
        ('Intapp Flow',        'Intapp', 'Intapp', 'legal_practice_management',
          '["flow","intapp flow workflow"]'),
        ('Intapp DealCloud',   'Intapp', 'Intapp', 'legal_crm',
          '["dealcloud","deal cloud","intapp dealcloud crm"]'),
        ('Intapp Billstream',  'Intapp', 'Intapp', 'legal_billing',
          '["billstream","intapp billstream","bill stream"]')
    `);

    // ── Document Management ───────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('iManage Work',   'iManage',      'iManage',      'legal_dms',
          '["imanage","imanage work 10","imanage dms"]'),
        ('NetDocuments',   'NetDocuments', 'NetDocuments', 'legal_dms',
          '["net documents","netdocs","nd","netdocuments dms"]'),
        ('Worldox',        'Legal Tech',   'GRM Document Management', 'legal_dms',
          '["world software worldox","worldox dms","world software"]'),
        ('OpenText',       'Legal Tech',   'OpenText',     'legal_dms',
          '["opentext edocs","opentext content suite","opentext documentum","documentum","edocs"]')
    `);

    // ── Legal Billing ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Elite 3E',       'Legal Billing', 'Thomson Reuters', 'legal_billing',
          '["elite","3e","thomson elite 3e","elite 3e on-premise","elite enterprise"]'),
        ('Elite 3E Cloud', 'Legal Billing', 'Thomson Reuters', 'legal_billing',
          '["elite cloud","3e cloud","elite 3e cloud","thomson reuters elite cloud"]'),
        ('Aderant Expert', 'Legal Billing', 'Aderant',         'legal_billing',
          '["aderant","aderant expert sierra","aderant expert practice management"]')
    `);

    // ── Legal CRM ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('InterAction CRM', 'Legal CRM', 'LexisNexis', 'legal_crm',
          '["interaction crm","interaction","intapp interaction","lexisnexis interaction","inter action"]'),
        ('CounselLink',     'Legal CRM', 'LexisNexis', 'legal_crm',
          '["counsel link","lexisnexis counsellink","tr counsellink","counsellink ebilling"]'),
        ('Lexis Connect',   'Legal CRM', 'LexisNexis', 'legal_crm',
          '["lexisconnect","lexisnexis lexis connect","lexis+ connect"]')
    `);

    // ── Legal Tech ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('HighQ',         'Legal Tech', 'Thomson Reuters', 'legal_compliance',
          '["highq collaborate","highq publisher","tr highq"]'),
        ('TitanFile',     'Legal Tech', 'TitanFile',       'legal_compliance',
          '["titan file","titanfile secure sharing"]'),
        ('Litera',        'Legal Tech', 'Litera',          'legal_compliance',
          '["litera microsystems","workshare","litera change-pro","litera desktop","workshare compare"]'),
        ('FileTrail',     'Legal Tech', 'FileTrail',       'legal_compliance',
          '["file trail","filetrail records management","filetrail rm"]'),
        ('Prosperoware',  'Legal Tech', 'Prosperoware',    'legal_compliance',
          '["prosperoware milan","milan","prosperoware cloud"]'),
        ('iCompli',       'Legal Tech', 'Intapp',          'legal_compliance',
          '["icompliance","intapp icompliance","i-compli"]'),
        ('Nectar',        'Legal Tech', NULL,              'other',
          '["nectar recognition","nectar hr","nectar platform"]'),
        ('Doc Auto',      'Legal Tech', NULL,              'other',
          '["docauto","document automation","doc automation","docauto legal"]'),
        ('VerQu',         'Legal Tech', NULL,              'other',
          '["verqu","ver qu"]')
    `);

    // ── Microsoft ecosystem ───────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Microsoft 365',         'Microsoft', 'Microsoft', 'collaboration',
          '["m365","office 365","o365","microsoft365","microsoft cloud","ms 365","office365"]'),
        ('Microsoft Azure',       'Microsoft', 'Microsoft', 'cloud_infrastructure',
          '["azure","ms azure","azure cloud","microsoft azure cloud"]'),
        ('Microsoft SharePoint',  'Microsoft', 'Microsoft', 'collaboration',
          '["sharepoint","ms sharepoint","sharepoint online","sharepoint server"]'),
        ('Microsoft Teams',       'Microsoft', 'Microsoft', 'collaboration',
          '["teams","ms teams","microsoft teams calling"]'),
        ('Microsoft OneDrive',    'Microsoft', 'Microsoft', 'collaboration',
          '["onedrive","ms onedrive","onedrive for business"]'),
        ('Microsoft Power BI',    'Microsoft', 'Microsoft', 'data_analytics',
          '["power bi","powerbi","ms power bi","microsoft bi"]'),
        ('Microsoft Power Automate','Microsoft','Microsoft','enterprise_itsm',
          '["power automate","ms flow","microsoft flow","power automate desktop"]'),
        ('Microsoft Power Platform','Microsoft','Microsoft','enterprise_itsm',
          '["power platform","ms power platform","microsoft power apps"]'),
        ('Microsoft Dynamics 365','Microsoft', 'Microsoft', 'enterprise_crm',
          '["dynamics 365","dynamics365","microsoft dynamics","ms dynamics","d365","crm dynamics"]'),
        ('Exchange Online',       'Microsoft', 'Microsoft', 'collaboration',
          '["exchange","microsoft exchange","exchange server","ms exchange"]'),
        ('Active Directory',      'Microsoft', 'Microsoft', 'security_network',
          '["ad","azure active directory","aad","entra id","microsoft entra","azure ad"]')
    `);

    // ── Cloud Infrastructure ──────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Amazon Web Services',       'Cloud', 'Amazon', 'cloud_infrastructure',
          '["aws","amazon web services (aws)","amazon aws","amazon cloud"]'),
        ('Google Cloud Platform',     'Cloud', 'Google', 'cloud_infrastructure',
          '["gcp","google cloud","google cloud platform (gcp)"]'),
        ('Oracle Cloud Infrastructure','Cloud','Oracle', 'cloud_infrastructure',
          '["oci","oracle cloud","oracle cloud infrastructure (oci)","oracle oci"]'),
        ('Citrix',                    'Cloud', 'Citrix', 'cloud_infrastructure',
          '["citrix virtual apps","citrix daas","citrix workspace","citrix vdi"]'),
        ('NetScaler',                 'Cloud', 'Citrix', 'security_network',
          '["netscaler","citrix netscaler","netscaler adc","netscaler gateway"]')
    `);

    // ── ServiceNow ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('ServiceNow ITSM',                'ServiceNow', 'ServiceNow', 'enterprise_itsm',
          '["servicenow","servicenow it service management","snow itsm","snow","servicenow platform"]'),
        ('ServiceNow ITOM',                'ServiceNow', 'ServiceNow', 'enterprise_itsm',
          '["servicenow it operations","snow itom","servicenow itom"]'),
        ('ServiceNow HR Service Delivery', 'ServiceNow', 'ServiceNow', 'enterprise_hcm',
          '["servicenow hr","snow hrsd","servicenow hrsd","servicenow hr service delivery"]'),
        ('ServiceNow CSM',                 'ServiceNow', 'ServiceNow', 'enterprise_crm',
          '["servicenow customer service","snow csm","servicenow csm"]')
    `);

    // ── Workday ───────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Workday HCM',                'Workday', 'Workday', 'enterprise_hcm',
          '["workday","workday human capital management","workday hcm suite"]'),
        ('Workday Financial Management','Workday', 'Workday', 'enterprise_erp',
          '["workday financials","workday finance","workday financial"]'),
        ('Workday Payroll',            'Workday', 'Workday', 'enterprise_hcm',
          '["workday payroll","workday pay"]')
    `);

    // ── Oracle ERP / HCM ──────────────────────────────────────────────────────
    // NOTE: Oracle (generic) is intentionally excluded — too ambiguous.
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Oracle Cloud ERP',  'Oracle', 'Oracle', 'enterprise_erp',
          '["oracle erp","oracle fusion erp","oracle cloud financials","oracle erp cloud"]'),
        ('Oracle Cloud HCM',  'Oracle', 'Oracle', 'enterprise_hcm',
          '["oracle hcm","oracle fusion hcm","oracle hcm cloud","oracle cloud hcm"]'),
        ('Oracle EPM',        'Oracle', 'Oracle', 'enterprise_erp',
          '["oracle planning","oracle epbcs","oracle epm cloud","oracle hyperion","oracle pbcs"]'),
        ('Oracle NetSuite',   'Oracle', 'Oracle', 'enterprise_erp',
          '["netsuite","oracle netsuite","net suite","netsuite erp"]')
    `);

    // ── SAP ───────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('SAP S/4HANA',       'SAP', 'SAP', 'enterprise_erp',
          '["sap","sap s4hana","s/4hana","s4hana","sap erp","sap s4","sap ecc"]'),
        ('SAP SuccessFactors', 'SAP', 'SAP', 'enterprise_hcm',
          '["successfactors","sap sf","sap hcm","sap successfactors hcm"]')
    `);

    // ── Salesforce ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Salesforce Sales Cloud',    'Salesforce', 'Salesforce', 'enterprise_crm',
          '["salesforce","sfdc","salesforce crm","salesforce.com"]'),
        ('Salesforce Service Cloud',  'Salesforce', 'Salesforce', 'enterprise_crm',
          '["salesforce service","sfsc","salesforce support cloud"]'),
        ('Salesforce Agentforce',     'Salesforce', 'Salesforce', 'enterprise_crm',
          '["agentforce","salesforce agentforce","salesforce ai agents"]')
    `);

    // ── UKG ───────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('UKG Pro',                      'UKG', 'UKG', 'enterprise_hcm',
          '["ukgpro","ultipro","ultimate software","ukg workforce now","ukg pro hcm"]'),
        ('UKG Pro Workforce Management', 'UKG', 'UKG', 'enterprise_hcm',
          '["ukg wfm","ultipro wfm","ukg dimensions","ukg ready","ukg workforce management"]')
    `);

    // ── Dayforce ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Dayforce HCM',                 'Dayforce', 'Ceridian', 'enterprise_hcm',
          '["dayforce","ceridian dayforce","ceridian","dayforce by ceridian"]'),
        ('Dayforce Payroll',             'Dayforce', 'Ceridian', 'enterprise_hcm',
          '["dayforce payroll","ceridian payroll"]'),
        ('Dayforce Talent Management',   'Dayforce', 'Ceridian', 'enterprise_hcm',
          '["dayforce talent","ceridian talent","dayforce talent acquisition"]'),
        ('Dayforce Workforce Management','Dayforce', 'Ceridian', 'enterprise_hcm',
          '["dayforce wfm","dayforce workforce","ceridian wfm","dayforce scheduling"]')
    `);

    // ── Data & Analytics ──────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Snowflake',   'Data', 'Snowflake',  'data_analytics',
          '["snowflake data cloud","snowflake dw","snowflake data warehouse"]'),
        ('Databricks',  'Data', 'Databricks', 'data_analytics',
          '["databricks lakehouse","azure databricks","databricks platform"]'),
        ('Tableau',     'Data', 'Salesforce', 'data_analytics',
          '["tableau desktop","tableau cloud","tableau server","tableau online"]')
    `);

    // ── Zendesk ───────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Zendesk Suite',            'Zendesk', 'Zendesk', 'enterprise_crm',
          '["zendesk","zendesk support suite","zendesk support","zendesk platform"]'),
        ('Zendesk AI Copilot',       'Zendesk', 'Zendesk', 'enterprise_crm',
          '["zendesk copilot","zendesk ai","zendesk ai agent"]'),
        ('Zendesk Explore Analytics','Zendesk', 'Zendesk', 'data_analytics',
          '["zendesk explore","zendesk analytics","zendesk reporting"]'),
        ('Zendesk Sunshine CRM',     'Zendesk', 'Zendesk', 'enterprise_crm',
          '["zendesk sunshine","sunshine crm","zendesk crm"]'),
        ('Zendesk for Service',      'Zendesk', 'Zendesk', 'enterprise_crm',
          '["zendesk service","zendesk for service management"]'),
        ('Zendesk for Sales',        'Zendesk', 'Zendesk', 'enterprise_crm',
          '["zendesk sell","zendesk sales","zendesk for sales crm"]')
    `);

    // ── Security & Network ────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO systems
        (canonical_name, product_family, vendor_owner, category, aliases)
      VALUES
        ('Mimecast',         'Security', 'Mimecast', 'security_network',
          '["mimecast email security","mimecast cloud security","mimecast email"]'),
        ('Cisco Networking', 'Security', 'Cisco',    'security_network',
          '["cisco","cisco systems","cisco network","cisco networking solutions"]')
    `);

    console.log('✅  76 canonical systems seeded');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // vendor_systems references systems via FK (RESTRICT) — clear it first
    await queryRunner.query(`DELETE FROM vendor_systems`);
    await queryRunner.query(`DELETE FROM systems`);
    console.log('↩️  All systems and vendor_systems rows removed');
  }
}
