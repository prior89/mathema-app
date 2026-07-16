import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

/**
 * Google ID Token (JWT) — frontend GIS button 또는 Capacitor Google Auth plugin 가
 * 발급한 토큰을 그대로 전달. backend 가 google-auth-library 로 audience 검증 후
 * 사용자 find-or-create.
 */
export class GoogleSignInDto {
  @IsString() @IsNotEmpty() idToken!: string;

  // New Android clients bind the signed ID token to a one-time request.
  // Optional for browser GIS and already-installed legacy app versions.
  @IsOptional() @IsString() @Length(32, 128) nonce?: string;
}
