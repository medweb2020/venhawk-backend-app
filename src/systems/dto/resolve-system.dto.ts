import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ResolveSystemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  input: string;
}
