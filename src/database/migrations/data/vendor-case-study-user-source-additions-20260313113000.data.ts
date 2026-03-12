export type VendorCaseStudyUserSourceAdditionSeed = {
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

export const VENDOR_CASE_STUDY_USER_SOURCE_ADDITIONS_20260313113000: VendorCaseStudyUserSourceAdditionSeed[] =
  [
    {
      vendorUuid: '74534dd1-ed5b-44ba-9085-62e0e1a8d50f',
      brandName: 'eSentio Technologies',
      caseStudies: [
        {
          title: 'iManage Records Manager (IRM) Implementation',
          summary:
            'eSentio describes an IRM implementation for a large multi-office East Coast law firm replacing a legacy records management system. The project focused on stronger file-retention processes, better interoperability with iManage WorkSite, and improved records search, with the firm successfully deploying IRM 5.2 into production.',
          studyUrl:
            'https://www.esentio.com/home-2/projects/#1440987138578-0b7fc2a7-50eb',
          sourceName: 'eSentio Technologies',
          sourceUrl:
            'https://www.esentio.com/home-2/projects/#1440987138578-0b7fc2a7-50eb',
        },
        {
          title: 'iManage Universal Search Implementation',
          summary:
            'eSentio documents a Universal Search implementation for a West Coast AmLaw 100 firm that needed a more scalable enterprise search experience. The case centers on integrating iManage, SharePoint, and WestKM data into a stronger search interface, with a successful pilot leading toward firmwide deployment.',
          studyUrl:
            'https://www.esentio.com/home-2/projects/#1440987138578-dfb5ddae-124f',
          sourceName: 'eSentio Technologies',
          sourceUrl:
            'https://www.esentio.com/home-2/projects/#1440987138578-dfb5ddae-124f',
        },
      ],
    },
  ];
