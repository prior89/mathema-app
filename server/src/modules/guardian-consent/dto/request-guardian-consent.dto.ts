import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RequestGuardianConsentDto {
  /** Optional — Duolingo-style flow collects parent email only. */
  @IsOptional() @IsString() @MinLength(2) parentName?: string;
  @IsEmail() parentEmail!: string;
  @IsOptional() @IsString() parentPhone?: string;
}