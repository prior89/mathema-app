import { describe, expect, it } from 'vitest';
import { canOfferGoogleSignIn, derivePreAuthAgeBand } from './pre-auth-age-gate';

describe('pre-auth age gate', () => {
  const today = new Date(2026, 6, 16);

  it('uses the South Korea Google Account minimum age without storing a date', () => {
    expect(derivePreAuthAgeBand('2012-07-16', 'KR', today)).toBe('eligible');
    expect(derivePreAuthAgeBand('2012-07-17', 'KR', today)).toBe('child');
  });

  it('uses the Indian child-protection boundary of 18', () => {
    expect(derivePreAuthAgeBand('2008-07-16', 'IN', today)).toBe('eligible');
    expect(derivePreAuthAgeBand('2008-07-17', 'IN', today)).toBe('child');
  });

  it('fails conservatively for future or unmapped markets', () => {
    expect(derivePreAuthAgeBand('2008-07-16', 'OTHER', today)).toBe('eligible');
    expect(derivePreAuthAgeBand('2008-07-17', 'OTHER', today)).toBe('child');
  });

  it('rejects malformed, impossible, and future dates', () => {
    expect(derivePreAuthAgeBand('', 'KR', today)).toBeNull();
    expect(derivePreAuthAgeBand('2010-02-30', 'KR', today)).toBeNull();
    expect(derivePreAuthAgeBand('2027-01-01', 'KR', today)).toBeNull();
  });

  it('always offers Google; account age is delegated to Google', () => {
    expect(canOfferGoogleSignIn(null)).toBe(true);
    expect(canOfferGoogleSignIn('child')).toBe(true);
    expect(canOfferGoogleSignIn('eligible')).toBe(true);
  });
});
