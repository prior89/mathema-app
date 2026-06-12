import { IsBoolean, IsDateString, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { GRADE_LEVELS, GradeLevel } from '../../../common/enums/unit.enum';
import { COUNTRY_CODES, CountryCode } from './register.dto';

export class GuestStartDto {
  @IsOptional() @IsString() @IsIn(COUNTRY_CODES as unknown as string[])
  country?: CountryCode;

  @IsOptional() @IsString() @IsIn(GRADE_LEVELS as unknown as string[])
  gradeLevel?: GradeLevel;
}

export class GuestUpgradeDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsString() name!: string;

  @IsOptional() @IsString() @IsIn(GRADE_LEVELS as unknown as string[])
  gradeLevel?: GradeLevel;

  @IsOptional() @IsDateString() birthDate?: string;

  @IsOptional() @IsString() @IsIn(COUNTRY_CODES as unknown as string[])
  country?: CountryCode;

  @IsOptional() @IsString() @MinLength(2) parentName?: string;
  @IsOptional() @IsEmail() parentEmail?: string;
  @IsOptional() @IsString() parentPhone?: string;

  @IsOptional() @IsBoolean() consentAnalytics?: boolean;
  @IsOptional() @IsBoolean() consentMarketing?: boolean;
  @IsOptional() @IsBoolean() consentAiTraining?: boolean;
}
