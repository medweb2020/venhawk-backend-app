import { VendorListingResponseDto } from './vendor-listing-response.dto';

export class VendorDetailClientDto {
  id: number;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
}

export class VendorDetailCaseStudyDto {
  id: number;
  title: string;
  summary: string;
  studyUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
}

export class VendorDetailReviewDto {
  id: number;
  reviewerName: string;
  reviewerRole: string | null;
  headline: string | null;
  quote: string;
  rating: number | null;
  source: string | null;
  sourceUrl: string | null;
  publishedAt: string | null;
}

export class VendorDetailResponseDto extends VendorListingResponseDto {
  matchingReason?: string;
  matchingReasonSource?: 'openai' | 'fallback';
  keyClients: VendorDetailClientDto[];
  caseStudies: VendorDetailCaseStudyDto[];
  reviews: VendorDetailReviewDto[];
}
