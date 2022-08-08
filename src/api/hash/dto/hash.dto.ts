import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HashDto {
  @IsNotEmpty()
  @IsString()
  inputHex: string;

  @IsOptional()
  @IsString()
  ipAddress: string;
}
