export const PRE_AUTH_AGE_BAND_STORAGE_KEY = 'matheo.preAuthAgeBand';

/**
 * Coarse, self-reported band used only to decide whether Google sign-in may
 * be offered. Never store a birth date or exact age at the pre-auth boundary.
 */
export type PreAuthAgeBand = 'under13' | '13plus';

type AgeBandStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function browserStorage(storage?: AgeBandStorage): AgeBandStorage | null {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readPreAuthAgeBand(storage?: AgeBandStorage): PreAuthAgeBand | null {
  try {
    const value = browserStorage(storage)?.getItem(PRE_AUTH_AGE_BAND_STORAGE_KEY);
    return value === 'under13' || value === '13plus' ? value : null;
  } catch {
    return null;
  }
}

export function writePreAuthAgeBand(
  ageBand: PreAuthAgeBand,
  storage?: AgeBandStorage,
): void {
  try {
    browserStorage(storage)?.setItem(PRE_AUTH_AGE_BAND_STORAGE_KEY, ageBand);
  } catch {
    // Private/embedded browser storage can be unavailable. The in-memory UI
    // state still enforces the gate for the current page.
  }
}

export function clearPreAuthAgeBand(storage?: AgeBandStorage): void {
  try {
    browserStorage(storage)?.removeItem(PRE_AUTH_AGE_BAND_STORAGE_KEY);
  } catch {
    // Best-effort cleanup only.
  }
}

/** Unknown and under-13 users must never mount/initialise Google Identity. */
export function canOfferGoogleSignIn(ageBand: PreAuthAgeBand | null): boolean {
  return ageBand === '13plus';
}
