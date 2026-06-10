import { IsString, MinLength } from 'class-validator';

export class GuardianConsentTokenDto {
  @IsString() @MinLength(16) token!: string;
}