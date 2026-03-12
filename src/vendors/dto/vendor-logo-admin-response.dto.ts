export class VendorLogoAdminVendorListItemDto {
  id: number;
  vendorId: string;
  brandName: string;
  logoUrl: string | null;
}

export class VendorLogoAdminClientDto {
  id: number;
  clientName: string;
  logoUrl: string | null;
}

export class VendorLogoAdminVendorDetailDto {
  id: number;
  vendorId: string;
  brandName: string;
  logoUrl: string | null;
  clients: VendorLogoAdminClientDto[];
}

export class VendorLogoAdminOverviewResponseDto {
  vendors: VendorLogoAdminVendorListItemDto[];
}
