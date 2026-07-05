import { post } from './api';
import type { AuthTokens } from './socialSignIn';

export interface OtpStartResult {
  sent: boolean;
  channel: 'sms' | 'whatsapp' | 'voice' | 'mock';
  expiresInSec: number;
  /** Mock builds only — the code, so dev can auto-fill. */
  devCode?: string;
}

/** India phone-OTP rail — request a code, then verify (phone, code) for a session. */
export function startPhoneOtp(phone: string): Promise<OtpStartResult> {
  return post<OtpStartResult>('/auth/otp/start', { phone });
}

export function verifyPhoneOtp(phone: string, code: string): Promise<AuthTokens> {
  return post<AuthTokens>('/auth/otp/verify', { phone, code });
}

/** Truecaller one-tap — exchange the SDK token for a session. */
export function truecallerSignIn(token: string): Promise<AuthTokens> {
  return post<AuthTokens>('/auth/truecaller', { token });
}
