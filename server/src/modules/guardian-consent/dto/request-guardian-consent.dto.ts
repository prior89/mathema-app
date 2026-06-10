import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RequestGuardianConsentDto {
  @IsString() @MinLength(2) parentName!: string;
  @IsEmail() parentEmail!: string;
  @IsOptional() @IsString() parentPhone?: string;
}