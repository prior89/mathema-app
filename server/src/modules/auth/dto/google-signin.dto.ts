import { IsString, IsNotEmpty, IsOptional, Length, MinLength } from 'class-validator';

/**
 * Google ID Token (JWT) — frontend GIS button 또는 Capacitor Google Auth plugin 가
 * 발급한 토큰을 그대로 전달. backend 가 google-auth-library 로 audience 검증 후
 * 사용자 find-or-create.
 */
export class GoogleSignInDto {
  @IsString() @IsNotEmpty() idToken!: string;

  // Current web and Android clients bind the signed ID token to a one-time
  // request. Optional only for already-installed legacy app versions; the
  // server still makes their signed token itself one-time-use.
  @IsOptional() @IsString() @Length(32, 128) nonce?: string;

  // One-time proof for safely linking a pre-existing non-Gmail account. It is
  // never persisted or logged; normal Google sign-in leaves it absent.
  @IsOptional() @IsString() @MinLength(8) linkPassword?: string;
}
