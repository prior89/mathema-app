import { describe, expect, it } from 'vitest';
import { googleSignInErrorKey } from './google-sign-in-error';

describe('googleSignInErrorKey', () => {
  it('keeps an intentional account chooser cancellation silent', () => {
    expect(googleSignInErrorKey(
      { code: 'GOOGLE_SIGN_IN_CANCELLED' },
      'login.google.failed',
    )).toBeNull();
  });

  it('offers an actionable recovery when the device has no Google account', () => {
    expect(googleSignInErrorKey(
      { code: 'GOOGLE_NO_CREDENTIAL' },
      'login.google.failed',
    )).toBe('auth.google.noCredential');
  });

  it('offers a retry path for provider or Play services failures', () => {
    expect(googleSignInErrorKey(
      { code: 'GOOGLE_SIGN_IN_FAILED' },
      'login.google.failed',
    )).toBe('auth.google.tryAgain');
  });

  it('preserves the screen-specific fallback for web and backend errors', () => {
    expect(googleSignInErrorKey(
      new Error('network'),
      'onboarding.auth.google.failed',
    )).toBe('onboarding.auth.google.failed');
  });
});
