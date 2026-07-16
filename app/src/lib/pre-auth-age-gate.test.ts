import { describe, expect, it } from 'vitest';
import {
  canOfferGoogleSignIn,
  clearPreAuthAgeBand,
  PRE_AUTH_AGE_BAND_STORAGE_KEY,
  readPreAuthAgeBand,
  writePreAuthAgeBand,
} from './pre-auth-age-gate';

function memoryStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial !== undefined) values.set(PRE_AUTH_AGE_BAND_STORAGE_KEY, initial);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

describe('pre-auth age gate', () => {
  it('persists only the coarse age-band decision', () => {
    const storage = memoryStorage();
    writePreAuthAgeBand('under13', storage);
    expect(readPreAuthAgeBand(storage)).toBe('under13');
    expect(storage.getItem(PRE_AUTH_AGE_BAND_STORAGE_KEY)).toBe('under13');

    writePreAuthAgeBand('13plus', storage);
    expect(readPreAuthAgeBand(storage)).toBe('13plus');
  });

  it('treats missing or unexpected persisted values as undecided', () => {
    expect(readPreAuthAgeBand(memoryStorage())).toBeNull();
    expect(readPreAuthAgeBand(memoryStorage('12'))).toBeNull();
    expect(readPreAuthAgeBand(memoryStorage('adult'))).toBeNull();
  });

  it('offers Google only after an explicit 13+ decision', () => {
    expect(canOfferGoogleSignIn(null)).toBe(false);
    expect(canOfferGoogleSignIn('under13')).toBe(false);
    expect(canOfferGoogleSignIn('13plus')).toBe(true);
  });

  it('can reset the decision for a shared device or another user', () => {
    const storage = memoryStorage('13plus');
    clearPreAuthAgeBand(storage);
    expect(readPreAuthAgeBand(storage)).toBeNull();
  });
});
