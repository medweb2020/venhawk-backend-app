export class VendorResponseDto {
  id: number;
  vendorId: string;
  name: string;
  logo: string;
  logoUrl: string;
  websiteUrl: string | null;
  category: string;
  location: string;
  rating: number;
  tier: string;
  description: string;
  specialty: string;
  specialtyFull?: string;
  startFrom: string;
  matchingScore: number;
  rawScore?: number;
  maxScore?: number;
  scoringVersion?: string;
  scoreBreakdown?: Record<string, unknown>;
  matchingReason?: string;
  matchingReasonSource?: 'claude' | 'fallback';
}
