import { post } from './api';

export type SocialProvider = 'kakao' | 'naver';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Exchange a Kakao/Naver provider access token for app session tokens.
 * Standalone helper — the caller (AuthContext) persists the tokens, e.g.
 * `tokens.set(t.accessToken, t.refreshToken)`, mirroring loginWithGoogle.
 */
export function socialSignIn(provider: SocialProvider, accessToken: string): Promise<AuthTokens> {
  return post<AuthTokens>(`/auth/${provider}`, { accessToken });
}

/** True when the backend runs SOCIAL_AUTH_MOCK and the client may skip the SDK. */
export function isSocialMock(): boolean {
  return import.meta.env.VITE_SOCIAL_AUTH_MOCK === 'true';
}

/**
 * Obtain a provider access token. In dev/mock mode returns a stable synthetic
 * token (the backend mock derives a deterministic identity from it). In real
 * mode this must be replaced with the Kakao/Naver SDK call:
 *   - Web:    Kakao.Auth.authorize / naver-id-login
 *   - Native: @react-native-seoul/kakao-login or a Capacitor plugin
 */
export async function acquireSocialToken(provider: SocialProvider): Promise<string> {
  if (isSocialMock()) {
    return `mock-${provider}-token-${'x'.repeat(12)}`;
  }
  throw new Error(
    `${provider} SDK not wired. Integrate the Kakao/Naver SDK and return its access token here.`,
  );
}
