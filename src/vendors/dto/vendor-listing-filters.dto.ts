import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

const parseMultiValueQuery = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const segments = (Array.isArray(value) ? value : [value]).flatMap((item) =>
    String(item)
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  );

  return segments.length > 0 ? segments : undefined;
};

export class VendorListingFiltersDto {
  @IsOptional()
  @Transform(parseMultiValueQuery)
  @IsArray()
  @IsString({ each: true })
  coreCapabilities?: string[];

  @IsOptional()
  @Transform(parseMultiValueQuery)
  @IsArray()
  @IsString({ each: true })
  industryExperience?: string[];

  @IsOptional()
  @Transform(parseMultiValueQuery)
  @IsArray()
  @IsString({ each: true })
  startTimeline?: string[];

  @IsOptional()
  @Transform(parseMultiValueQuery)
  @IsArray()
  @IsString({ each: true })
  verifiedCertifications?: string[];

  @IsOptional()
  @Transform(parseMultiValueQuery)
  @IsArray()
  @IsString({ each: true })
  clientValidation?: string[];
}
