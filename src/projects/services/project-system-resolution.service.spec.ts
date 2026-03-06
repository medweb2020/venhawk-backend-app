import { ConfigService } from '@nestjs/config';
import { ProjectSystemResolutionService } from './project-system-resolution.service';

describe('ProjectSystemResolutionService', () => {
  const createService = () =>
    new ProjectSystemResolutionService({
      get: jest.fn().mockReturnValue(''),
    } as unknown as ConfigService);

  it('resolves exact allowed systems deterministically', async () => {
    const service = createService();

    await expect(
      service.resolveProjectSystem('enterprise-it', 'Microsoft 365'),
    ).resolves.toMatchObject({
      resolvedLabel: 'Microsoft 365',
      matchedAllowedSystem: 'Microsoft 365',
      source: 'exact',
    });
  });

  it('extracts a focused fallback phrase when the input is conversational', async () => {
    const service = createService();
    const resolved = await service.resolveProjectSystem(
      'enterprise-it',
      'I want some help with Microsoft Dynamics',
    );

    expect(resolved).toMatchObject({
      resolvedLabel: 'Microsoft Dynamics',
      matchedAllowedSystem: null,
      source: 'fallback',
    });
    expect(resolved?.searchTerms).toEqual(
      expect.arrayContaining(['Microsoft Dynamics']),
    );
  });

  it('uses vendor stack context to seed focused search terms', async () => {
    const service = createService();

    const resolved = await service.resolveProjectSystem(
      'legal-apps',
      'We need implementation support for iManage Work',
      {
        legalTechStackTerms: ['iManage Work', 'NetDocuments', 'Microsoft 365'],
        vendorCategories: ['Cloud', 'Document Management'],
      },
    );

    expect(resolved).toMatchObject({
      resolvedLabel: 'iManage',
      matchedAllowedSystem: 'iManage',
      source: 'fallback',
    });
    expect(resolved?.searchTerms).toEqual(
      expect.arrayContaining(['iManage Work', 'iManage']),
    );
    expect(
      (resolved?.searchTerms || []).every(
        (term) => term.split(/\s+/).length <= 5,
      ),
    ).toBe(true);
  });
});
