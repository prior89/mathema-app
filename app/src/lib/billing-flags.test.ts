import { describe, expect, it } from 'vitest';
import {
  canRedirectToStudentPaywall,
  isPremiumRequiredError,
  resolveBillingUiEnabled,
} from './billing-flags';

describe('resolveBillingUiEnabled', () => {
  it('returns false when build flag is off', () => {
    expect(resolveBillingUiEnabled(true, false, true)).toBe(false);
    expect(resolveBillingUiEnabled(false, false, true)).toBe(false);
  });

  it('fail-closed until billing status is known', () => {
    expect(resolveBillingUiEnabled(true, true, false)).toBe(false);
    expect(resolveBillingUiEnabled(false, true, false)).toBe(false);
    expect(resolveBillingUiEnabled(undefined, true, false)).toBe(false);
  });

  it('requires explicit server true when build is on', () => {
    expect(resolveBillingUiEnabled(true, true, true)).toBe(true);
    expect(resolveBillingUiEnabled(false, true, true)).toBe(false);
    expect(resolveBillingUiEnabled(undefined, true, true)).toBe(false);
  });
});

describe('canRedirectToStudentPaywall', () => {
  it('allows student app routes', () => {
    expect(canRedirectToStudentPaywall('/app')).toBe(true);
    expect(canRedirectToStudentPaywall('/app/report')).toBe(true);
  });

  it('keeps parent and teacher dashboards out of the student-only paywall', () => {
    expect(canRedirectToStudentPaywall('/parent')).toBe(false);
    expect(canRedirectToStudentPaywall('/teacher')).toBe(false);
  });

  it('does not mistake similarly prefixed public paths for the app shell', () => {
    expect(canRedirectToStudentPaywall('/application')).toBe(false);
  });
});

describe('isPremiumRequiredError', () => {
  it('recognises the wrapped backend PremiumRequired payload', () => {
    expect(isPremiumRequiredError({
      response: { data: { error: { error: 'PremiumRequired', feature: 'weekly_reports' } } },
    })).toBe(true);
  });

  it('does not classify unrelated authorization or network errors as billing', () => {
    expect(isPremiumRequiredError({ response: { data: { error: 'Forbidden' } } })).toBe(false);
    expect(isPremiumRequiredError(new Error('offline'))).toBe(false);
  });
});
