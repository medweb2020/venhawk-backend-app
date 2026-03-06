export const LEGAL_CLIENT_INDUSTRY_VALUE = 'legal';

export const PROJECT_CATEGORY_SYSTEM_OPTIONS: Record<string, string[]> = {
  'legal-apps': ['Intapp', 'iManage', 'NetDocuments', 'Elite', 'Aderant'],
  'cloud-migration': ['Azure', 'AWS', 'GCP', 'Hybrid Cloud'],
  'enterprise-it': ['ServiceNow', 'Workday', 'Microsoft 365', 'AV Systems'],
  'app-bug-fixes': ['Legacy Apps', 'Custom Systems', 'APIs'],
};

export const PROJECT_CATEGORY_ELIGIBILITY_KEYWORDS: Record<string, string[]> = {
  'legal-apps': [
    'legal',
    'intapp',
    'imanage',
    'netdocuments',
    'elite',
    'aderant',
    'document management',
  ],
  'cloud-migration': [
    'cloud',
    'cloud migration',
    'cloud modernization',
    'azure',
    'aws',
    'gcp',
    'hybrid cloud',
  ],
  'enterprise-it': [
    'enterprise',
    'enterprise apps',
    'servicenow',
    'workday',
    'microsoft 365',
    'm365',
    'av systems',
  ],
  'app-bug-fixes': [
    'legacy',
    'legacy modernization',
    'custom systems',
    'custom application',
    'integration',
    'api',
  ],
};

export const SYSTEM_ALIASES: Record<string, string[]> = {
  Intapp: ['intapp'],
  iManage: ['imanage', 'i manage'],
  NetDocuments: ['netdocuments', 'net documents'],
  Elite: ['elite', 'elite 3e', '3e'],
  Aderant: ['aderant'],
  Azure: ['azure', 'microsoft azure'],
  AWS: ['aws', 'amazon web services'],
  GCP: ['gcp', 'google cloud', 'google cloud platform'],
  'Hybrid Cloud': ['hybrid cloud', 'multi cloud'],
  ServiceNow: ['servicenow', 'service now'],
  Workday: ['workday'],
  'Microsoft Dynamics': [
    'microsoft dynamics',
    'microsoft dynamics 365',
    'dynamics 365',
    'dynamics365',
  ],
  'Microsoft 365': [
    'microsoft 365',
    'm365',
    'office 365',
    'o365',
    'microsoft365',
  ],
  'AV Systems': ['av systems', 'audio visual', 'audiovisual'],
  'Legacy Apps': ['legacy app', 'legacy apps', 'legacy application'],
  'Custom Systems': [
    'custom system',
    'custom systems',
    'custom application',
    'custom applications',
  ],
  APIs: ['api', 'apis'],
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeMatchingText = (value: unknown): string => {
  return String(value || '')
    .toLowerCase()
    .replace(/[_/,&]+/g, ' ')
    .replace(/[^a-z0-9+\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const containsAlias = (normalizedText: string, alias: string): boolean => {
  const normalizedAlias = normalizeMatchingText(alias);
  if (!normalizedAlias) {
    return false;
  }

  const pattern = `\\b${escapeRegex(normalizedAlias).replace(/\s+/g, '\\s+')}\\b`;
  return new RegExp(pattern, 'i').test(normalizedText);
};

export const getAllowedSystemsForCategory = (
  projectCategoryValue: string,
): string[] => {
  return PROJECT_CATEGORY_SYSTEM_OPTIONS[projectCategoryValue] || [];
};

export const resolveCanonicalSystemName = (
  rawSystemName: string,
  allowedSystems?: string[],
): string | null => {
  const selectionParts = String(rawSystemName || '')
    .split(/[;,/|]+/g)
    .map((part) => part.trim())
    .filter(Boolean);

  if (selectionParts.length > 1) {
    return null;
  }

  const normalizedSystem = normalizeMatchingText(rawSystemName);
  if (!normalizedSystem) {
    return null;
  }

  const candidateSystems = Array.isArray(allowedSystems)
    ? allowedSystems.filter((systemName) => Boolean(SYSTEM_ALIASES[systemName]))
    : Object.keys(SYSTEM_ALIASES);

  const matchedSystems = new Set<string>();

  for (const canonicalSystem of candidateSystems) {
    const aliases = SYSTEM_ALIASES[canonicalSystem] || [];
    if (aliases.some((alias) => containsAlias(normalizedSystem, alias))) {
      matchedSystems.add(canonicalSystem);
    }
  }

  if (matchedSystems.size !== 1) {
    return null;
  }

  return Array.from(matchedSystems)[0];
};

export const textSupportsCanonicalSystem = (
  text: string,
  canonicalSystem: string,
): boolean => {
  const aliases = SYSTEM_ALIASES[canonicalSystem] || [];
  if (aliases.length === 0) {
    return false;
  }

  const normalizedText = normalizeMatchingText(text);
  return aliases.some((alias) => containsAlias(normalizedText, alias));
};

export const getSystemAliases = (canonicalSystem: string): string[] => {
  return SYSTEM_ALIASES[canonicalSystem] || [];
};

export const extractPrimarySystemKeyword = (
  rawSystemName: string,
): string | null => {
  const normalized = normalizeMatchingText(rawSystemName);
  if (!normalized) {
    return null;
  }

  const firstToken = normalized.split(/\s+/).find(Boolean);
  return firstToken || null;
};

export const textContainsSystemKeyword = (
  text: string,
  keyword: string,
): boolean => {
  const normalizedText = normalizeMatchingText(text);
  const normalizedKeyword = normalizeMatchingText(keyword);
  const keywordTokens = normalizedKeyword.split(/\s+/).filter(Boolean);

  if (!normalizedText || !normalizedKeyword) {
    return false;
  }

  const exactPattern = `\\b${escapeRegex(normalizedKeyword).replace(/\s+/g, '\\s+')}\\b`;
  if (new RegExp(exactPattern, 'i').test(normalizedText)) {
    return true;
  }

  const compactText = String(text || '')
    .toLowerCase()
    .replace(/\s+/g, '');
  const compactKeyword = String(keyword || '')
    .toLowerCase()
    .replace(/\s+/g, '');
  if (!compactText || !compactKeyword) {
    return false;
  }

  if (compactKeyword.length >= 4 && compactText.includes(compactKeyword)) {
    return true;
  }

  if (keywordTokens.length !== 1) {
    return false;
  }

  const singleTokenPattern = `\\b${escapeRegex(keywordTokens[0])}\\b`;
  return new RegExp(singleTokenPattern, 'i').test(normalizedText);
};
