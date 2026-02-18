export class VendorListingResponseDto {
  id: number;
  vendorId: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  headquarter: string;
  category: string;
  location: string;
  rating: number;
  tier: string;
  description: string;
  specialty: string;
  startFrom: string;
}
