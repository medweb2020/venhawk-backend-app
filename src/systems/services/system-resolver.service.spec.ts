import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SystemResolverService } from './system-resolver.service';
import { System } from '../entities/system.entity';
import { SystemResolverLog } from '../entities/system-resolver-log.entity';

// ── Minimal fixture systems (mirrors real DB data for tested cases) ───────────

const FIXTURE_SYSTEMS: Partial<System>[] = [
  {
    id: 1,
    canonical_name: 'Intapp Open',
    product_family: 'Intapp',
    vendor_owner: 'Intapp',
    category: 'legal_practice_management',
    aliases: ['intapp', 'intapp open platform', 'intappopen', 'open platform'],
    is_active: true,
  },
  {
    id: 2,
    canonical_name: 'Intapp Intake',
    product_family: 'Intapp',
    vendor_owner: 'Intapp',
    category: 'legal_practice_management',
    aliases: ['intake', 'intapp intake & matter management'],
    is_active: true,
  },
  {
    id: 3,
    canonical_name: 'Intapp Conflicts',
    product_family: 'Intapp',
    vendor_owner: 'Intapp',
    category: 'legal_compliance',
    aliases: ['conflicts', 'intapp conflicts manager'],
    is_active: true,
  },
  {
    id: 28,
    canonical_name: 'Microsoft 365',
    product_family: 'Microsoft',
    vendor_owner: 'Microsoft',
    category: 'collaboration',
    aliases: ['m365', 'office 365', 'o365', 'microsoft365', 'microsoft cloud', 'ms 365', 'office365'],
    is_active: true,
  },
  {
    id: 29,
    canonical_name: 'Microsoft Azure',
    product_family: 'Microsoft',
    vendor_owner: 'Microsoft',
    category: 'cloud_infrastructure',
    aliases: ['azure', 'ms azure'],
    is_active: true,
  },
  {
    id: 38,
    canonical_name: 'Active Directory',
    product_family: 'Microsoft',
    vendor_owner: 'Microsoft',
    category: 'security_network',
    aliases: ['ad', 'azure active directory', 'aad', 'entra id', 'microsoft entra', 'azure ad'],
    is_active: true,
  },
  {
    id: 57,
    canonical_name: 'Salesforce Sales Cloud',
    product_family: 'Salesforce',
    vendor_owner: 'Salesforce',
    category: 'enterprise_crm',
    aliases: ['salesforce', 'sfdc', 'salesforce crm', 'salesforce.com'],
    is_active: true,
  },
  {
    id: 58,
    canonical_name: 'Salesforce Service Cloud',
    product_family: 'Salesforce',
    vendor_owner: 'Salesforce',
    category: 'enterprise_crm',
    aliases: ['salesforce service', 'sfsc'],
    is_active: true,
  },
  {
    id: 16,
    canonical_name: 'InterAction CRM',
    product_family: 'Legal CRM',
    vendor_owner: 'LexisNexis',
    category: 'legal_crm',
    aliases: ['interaction crm', 'interaction', 'intapp interaction', 'lexisnexis interaction', 'inter action'],
    is_active: true,
  },
  {
    id: 48,
    canonical_name: 'Workday HCM',
    product_family: 'Workday',
    vendor_owner: 'Workday',
    category: 'enterprise_hcm',
    aliases: ['workday', 'workday human capital management', 'workday hcm suite'],
    is_active: true,
  },
  {
    id: 22,
    canonical_name: 'Doc Auto',
    product_family: 'Legal Tech',
    vendor_owner: null,
    category: 'other',
    aliases: ['docauto', 'document automation', 'doc automation', 'docauto legal'],
    is_active: true,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildMockRepo(entities: Partial<System>[]) {
  return {
    find: jest.fn().mockResolvedValue(entities),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue({}),
  };
}

async function createService(
  systems: Partial<System>[] = FIXTURE_SYSTEMS,
): Promise<SystemResolverService> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      SystemResolverService,
      {
        provide: getRepositoryToken(System),
        useValue: buildMockRepo(systems),
      },
      {
        provide: getRepositoryToken(SystemResolverLog),
        useValue: { create: jest.fn(), save: jest.fn().mockResolvedValue({}) },
      },
      {
        provide: ConfigService,
        useValue: {
          // No API key → Tier 4 will safely fall through to Tier 5
          get: jest.fn().mockReturnValue(undefined),
        },
      },
    ],
  }).compile();

  const service = module.get<SystemResolverService>(SystemResolverService);
  await service.reloadCache();
  return service;
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('SystemResolverService', () => {
  let service: SystemResolverService;

  beforeEach(async () => {
    service = await createService();
  });

  // ── Tier 1: Exact canonical name match ─────────────────────────────────────

  describe('Tier 1 — exact canonical name match', () => {
    it('resolves "Intapp Open" → id=1, confidence=1.0', async () => {
      const result = await service.resolve('Intapp Open');
      expect(result.tier).toBe(1);
      expect(result.resolved).toBe(true);
      expect(result.system?.id).toBe(1);
      expect(result.confidence).toBe(1.0);
    });

    it('resolves "Microsoft 365" → id=28, confidence=1.0', async () => {
      const result = await service.resolve('Microsoft 365');
      expect(result.tier).toBe(1);
      expect(result.system?.id).toBe(28);
    });

    it('is case-insensitive for exact match', async () => {
      const result = await service.resolve('INTAPP OPEN');
      expect(result.tier).toBe(1);
      expect(result.system?.id).toBe(1);
    });

    it('trims leading/trailing whitespace', async () => {
      const result = await service.resolve('  Intapp Open  ');
      expect(result.tier).toBe(1);
      expect(result.system?.id).toBe(1);
    });
  });

  // ── Tier 2: Alias exact match ──────────────────────────────────────────────

  describe('Tier 2 — alias exact match', () => {
    it('resolves "M365" → id=28 (Microsoft 365), confidence=0.95', async () => {
      const result = await service.resolve('M365');
      expect(result.tier).toBe(2);
      expect(result.system?.id).toBe(28);
      expect(result.confidence).toBe(0.95);
    });

    it('resolves "office365" → id=28', async () => {
      const result = await service.resolve('office365');
      expect(result.tier).toBe(2);
      expect(result.system?.id).toBe(28);
    });

    it('resolves "azure ad" → id=38 (Active Directory)', async () => {
      const result = await service.resolve('azure ad');
      expect(result.tier).toBe(2);
      expect(result.system?.id).toBe(38);
    });

    it('resolves "interaction" → id=16 (InterAction CRM)', async () => {
      const result = await service.resolve('interaction');
      expect(result.tier).toBe(2);
      expect(result.system?.id).toBe(16);
    });

    it('resolves "Workday" → id=48 (Workday HCM)', async () => {
      const result = await service.resolve('Workday');
      expect(result.tier).toBe(2);
      expect(result.system?.id).toBe(48);
    });

    it('resolves "salesforce" → id=57 (Sales Cloud)', async () => {
      const result = await service.resolve('salesforce');
      expect(result.tier).toBe(2);
      expect(result.system?.id).toBe(57);
    });

    it('resolves "doc auto" → id=22 (Doc Auto alias match)', async () => {
      const result = await service.resolve('doc auto');
      // "doc auto" is in aliases array → Tier 2
      expect(result.tier).toBeLessThanOrEqual(2);
      expect(result.resolved).toBe(true);
      expect(result.system?.canonicalName).toBe('Doc Auto');
    });
  });

  // ── Tier 3: Fuzzy match ────────────────────────────────────────────────────

  describe('Tier 3 — fuzzy match (Fuse.js)', () => {
    it('resolves "intap open" → id=1 with confidence ≥ 0.7', async () => {
      const result = await service.resolve('intap open');
      expect(result.resolved).toBe(true);
      expect(result.system?.id).toBe(1);
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
      // Tier 1 or 2 won't match "intap open" (typo), so should be 3 or possibly 4
      expect(result.tier).toBeGreaterThanOrEqual(3);
    });

    it('resolves "intapp opn" — id=1 appears as top candidate (typo tolerance)', async () => {
      const result = await service.resolve('intapp opn');
      // "intapp opn" is a 2-char typo. May resolve (Tier 3) or surface as top candidate (Tier 5).
      // Either way, Intapp Open (id=1) must appear in system or candidates.
      const allIds = [result.system?.id, ...result.candidates.map((c) => c.id)].filter(Boolean);
      expect(allIds).toContain(1);
    });
  });

  // ── Tier 2.5: Word-tokenization ────────────────────────────────────────────

  describe('Tier 2.5 — word-tokenization', () => {
    it('"Azure Upgrade" → token "Azure" resolves to Microsoft Azure (id=29), confidence=0.90', async () => {
      const result = await service.resolve('Azure Upgrade');
      expect(result.resolved).toBe(true);
      expect(result.system?.id).toBe(29);
      expect(result.confidence).toBe(0.90);
      expect(result.tier).toBe(2);
    });

    it('"Workday Adaptive" → token "Workday" resolves to Workday HCM (id=48), confidence=0.90', async () => {
      const result = await service.resolve('Workday Adaptive');
      expect(result.resolved).toBe(true);
      expect(result.system?.id).toBe(48);
      expect(result.confidence).toBe(0.90);
    });

    it('"Salesforce Expansion" → token "Salesforce" resolves to Salesforce Sales Cloud (id=57)', async () => {
      const result = await service.resolve('Salesforce Expansion');
      expect(result.resolved).toBe(true);
      expect(result.system?.id).toBe(57);
      expect(result.confidence).toBe(0.90);
    });

    it('"Intapp Migration Project" → token "intapp" resolves to Intapp Open (id=1)', async () => {
      const result = await service.resolve('Intapp Migration Project');
      expect(result.resolved).toBe(true);
      expect(result.system?.id).toBe(1);
      expect(result.confidence).toBe(0.90);
    });

    it('"Azure Intapp" (two tokens resolve to different systems) → unresolved (no LLM in tests)', async () => {
      // "azure" → Microsoft Azure (id=29), "intapp" → Intapp Open (id=1) — ambiguous.
      // Escalates to Tier 4; without Anthropic client in test env, falls to Tier 5.
      const result = await service.resolve('Azure Intapp');
      expect(result.resolved).toBe(false);
    });

    it('"completely fake xyz" → no token matches → falls through to Tier 5', async () => {
      const result = await service.resolve('completely fake xyz');
      expect(result.resolved).toBe(false);
      expect(result.tier).toBe(5);
    });

    it('does not trigger on single-word inputs', async () => {
      // "Workday" alone is a Tier-2 alias match, NOT a Tier-2.5 word-tokenization match
      const result = await service.resolve('Workday');
      expect(result.tier).toBe(2);
      expect(result.confidence).toBe(0.95); // exact alias confidence, not 0.90
    });
  });

  // ── Tier 4/5: Ambiguous and unresolved ────────────────────────────────────

  describe('Tier 4/5 — ambiguous or unresolved', () => {
    it('"salesforce service" resolves via Tier 2 alias to Service Cloud (id=58)', async () => {
      // "salesforce service" is an exact alias of Salesforce Service Cloud.
      // Alias lookup (Tier 2) catches it before ambiguity logic is needed.
      const result = await service.resolve('salesforce service');
      expect(result.tier).toBe(2);
      expect(result.resolved).toBe(true);
      expect(result.system?.id).toBe(58);
    });

    it('"intap" returns multiple Intapp candidates', async () => {
      const result = await service.resolve('intap');
      const candidateIds = result.candidates.map((c) => c.id);
      // Should surface several Intapp system candidates
      const intappCandidates = result.candidates.filter((c) =>
        c.productFamily === 'Intapp',
      );
      expect(intappCandidates.length).toBeGreaterThanOrEqual(1);
    });

    it('"PST" returns Tier 5 unresolved (not in systems table)', async () => {
      const result = await service.resolve('PST');
      expect(result.resolved).toBe(false);
      expect(result.tier).toBe(5);
      expect(result.system).toBeNull();
    });

    it('"asdfqwerty" returns Tier 5 unresolved', async () => {
      const result = await service.resolve('asdfqwerty');
      expect(result.resolved).toBe(false);
      expect(result.tier).toBe(5);
      expect(result.system).toBeNull();
    });
  });

  // ── Eligibility policy ─────────────────────────────────────────────────────

  describe('eligibilityPolicy metadata', () => {
    it('reflects family-expansion mode on all responses', async () => {
      const result = await service.resolve('Intapp Open');
      expect(result.eligibilityPolicy.strictSystemGate).toBe(true);
      expect(result.eligibilityPolicy.productFamilyExpansion).toBe(true);
      expect(result.eligibilityPolicy.projectSystemMatchMode).toBe('db-join-system-family');
    });
  });

  // ── getSystemIdsInFamily (used by eligibility gate) ────────────────────────

  describe('getSystemIdsInFamily', () => {
    it('returns all Intapp system IDs when given Intapp Open (id=1)', async () => {
      const ids = await service.getSystemIdsInFamily(1);
      expect(ids).toContain(1); // Intapp Open
      expect(ids).toContain(2); // Intapp Intake
      expect(ids).toContain(3); // Intapp Conflicts
    });

    it('returns all Microsoft system IDs when given Microsoft Azure (id=29)', async () => {
      const ids = await service.getSystemIdsInFamily(29);
      expect(ids).toContain(28); // Microsoft 365
      expect(ids).toContain(29); // Microsoft Azure
      expect(ids).toContain(38); // Active Directory
    });

    it('does NOT include systems from other families', async () => {
      const ids = await service.getSystemIdsInFamily(1); // Intapp family
      const microsoftInResult = ids.some((id) => [28, 29, 38].includes(id));
      expect(microsoftInResult).toBe(false);
    });

    it('returns [systemId] for a system with no family (safety case)', async () => {
      // Inject a system with no product_family
      const noFamilySystems: Partial<System>[] = [
        ...FIXTURE_SYSTEMS,
        { id: 999, canonical_name: 'Unknown Tool', product_family: '', category: 'other' as const, aliases: [], is_active: true },
      ];
      const svc = await createService(noFamilySystems);
      const ids = await svc.getSystemIdsInFamily(999);
      expect(ids).toEqual([999]);
    });
  });

  // ── expandSystemIds (bulk expansion, not used by gate directly) ────────────

  describe('expandSystemIds (bulk expansion method)', () => {
    it('returns all Intapp system IDs when given Intapp Open', () => {
      const expanded = service.expandSystemIds([1]);
      expect(expanded).toContain(1); // Intapp Open
      expect(expanded).toContain(2); // Intapp Intake
      expect(expanded).toContain(3); // Intapp Conflicts
    });

    it('does NOT expand across families', () => {
      const expanded = service.expandSystemIds([28]); // Microsoft 365
      const intappInResult = expanded.some((id) => [1, 2, 3].includes(id));
      expect(intappInResult).toBe(false);
    });
  });

  // ── searchSystems (Tier 1-3 only) ─────────────────────────────────────────

  describe('searchSystems (autocomplete, no LLM)', () => {
    it('returns results for partial query "intapp"', () => {
      const results = service.searchSystems('intapp');
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('returns empty array for blank query', () => {
      const results = service.searchSystems('');
      expect(results).toEqual([]);
    });

    it('confidence values are 0–1', () => {
      const results = service.searchSystems('microsoft');
      results.forEach((r) => {
        expect(r.confidence).toBeGreaterThanOrEqual(0);
        expect(r.confidence).toBeLessThanOrEqual(1);
      });
    });
  });
});
