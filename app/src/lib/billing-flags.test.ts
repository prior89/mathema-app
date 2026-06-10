import { describe, expect, it } from 'vitest';
import { resolveBillingUiEnabled } from './billing-flags';

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