import { IsString, Matches, Length } from 'class-validator';

// E.164-ish: leading + optional, 8–15 digits. Normalized server-side.
const PHONE = /^\+?[0-9][0-9\s-]{7,17}$/;

export class OtpStartDto {
  @IsString() @Matches(PHONE, { message: 'phone must be a valid mobile number' })
  phone!: string;
}

export class OtpVerifyDto {
  @IsString() @Matches(PHONE, { message: 'phone must be a valid mobile number' })
  phone!: string;

  @IsString() @Length(4, 8) code!: string;
}

export class TruecallerDto {
  @IsString() @Length(8, 4096) token!: string;
}
