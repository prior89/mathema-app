import { IsString, MinLength } from 'class-validator';

export class SocialSignInDto {
  /** Provider access token from the Kakao / Naver SDK on the client. */
  @IsString() @MinLength(8) accessToken!: string;
}
