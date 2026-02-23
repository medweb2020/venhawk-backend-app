export type VendorFilterGroupKey =
  | 'coreCapabilities'
  | 'industryExperience'
  | 'startTimeline'
  | 'verifiedCertifications'
  | 'clientValidation';

export interface VendorFilterOption {
  value: string;
  label: string;
}

export interface VendorFilterGroup {
  key: VendorFilterGroupKey;
  label: string;
  options: VendorFilterOption[];
}

export const VENDOR_FILTER_GROUPS: VendorFilterGroup[] = [
  {
    key: 'coreCapabilities',
    label: 'Core Capability',
    options: [
      {
        value: 'document-management-systems',
        label: 'Document Management Systems',
      },
      { value: 'ediscovery-platforms', label: 'eDiscovery Platforms' },
      {
        value: 'practice-management-systems',
        label: 'Practice Management Systems',
      },
      { value: 'erp-financial-systems', label: 'ERP / Financial Systems' },
      { value: 'cloud-migration', label: 'Cloud Migration' },
      { value: 'data-migration', label: 'Data Migration' },
      {
        value: 'cybersecurity-compliance',
        label: 'Cybersecurity & Compliance',
      },
      { value: 'ai-automation', label: 'AI & Automation' },
      {
        value: 'custom-application-development',
        label: 'Custom Application Development',
      },
      { value: 'integration-apis', label: 'Integration & APIs' },
    ],
  },
  {
    key: 'industryExperience',
    label: 'Relevant Industry Experience',
    options: [
      { value: 'legal', label: 'Legal' },
      { value: 'financial-services', label: 'Financial Services' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'government', label: 'Government' },
      { value: 'enterprise-corporate', label: 'Enterprise / Corporate' },
      { value: 'technology-saas', label: 'Technology / SaaS' },
      { value: 'insurance', label: 'Insurance' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'startTimeline',
    label: 'Start Timeline',
    options: [
      { value: 'immediate-0-30-days', label: 'Immediate (0-30 days)' },
      { value: '30-60-days', label: '30-60 days' },
      { value: '60-plus-days', label: '60+ days' },
    ],
  },
  {
    key: 'verifiedCertifications',
    label: 'Verified Certifications',
    options: [
      { value: 'iso-27001', label: 'ISO 27001' },
      { value: 'soc-2', label: 'SOC 2' },
      { value: 'microsoft-partner', label: 'Microsoft Partner' },
      { value: 'aws-partner', label: 'AWS Partner' },
      { value: 'google-cloud-partner', label: 'Google Cloud Partner' },
      {
        value: 'industry-certifications',
        label: 'Industry Certifications (e.g., Relativity, Epic, ServiceNow)',
      },
      { value: 'ilta-member', label: 'ILTA Member' },
    ],
  },
  {
    key: 'clientValidation',
    label: 'Client Validation',
    options: [
      { value: 'case-studies-available', label: 'Case studies available' },
      {
        value: 'reference-clients-available',
        label: 'Reference clients available',
      },
      { value: 'five-plus-projects-completed', label: '5+ projects completed' },
      { value: 'repeat-clients', label: 'Repeat clients' },
      { value: 'fortune-500-clients', label: 'Fortune 500 clients' },
    ],
  },
];

export const VENDOR_FILTER_ALLOWED_VALUES: Record<
  VendorFilterGroupKey,
  Set<string>
> = VENDOR_FILTER_GROUPS.reduce(
  (acc, group) => {
    acc[group.key] = new Set(group.options.map((option) => option.value));
    return acc;
  },
  {
    coreCapabilities: new Set<string>(),
    industryExperience: new Set<string>(),
    startTimeline: new Set<string>(),
    verifiedCertifications: new Set<string>(),
    clientValidation: new Set<string>(),
  },
);
