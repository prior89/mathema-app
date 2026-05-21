/**
 * DEV-2 -- stable client-side device identifier for the 1-account-1-device
 * (concurrent) enforcement.
 *
 * Why we don't use @capacitor/device:
 *   - Adds ~30KB to the AAB
 *   - Android ID (Settings.Secure.ANDROID_ID) can change on factory reset and
 *     varies by user profile -- not strictly more stable than localStorage
 *   - This approach also works in the web preview build and the Vite dev
 *     server, so the same code path runs everywhere
 *
 * Stability properties:
 *   - Persisted in localStorage as `matheo.deviceId` -- survives app restart,
 *     reset only when the user manually clears storage / reinstalls.
 *   - Combined with navigator.userAgent so two different browsers on the same
 *     machine count as different devices (which is what we want -- "device"
 *     here really means "browser/app installation").
 *   - SHA-256'd so the raw UUID never leaves the client; the server stores
 *     only the hash.
 *
 * The result is sent as the X-Device-Hash header on every auth request and
 * the JWT-protected requests that the backend needs to validate against the
 * user's currently-bound AuthDevice row.
 */
const STORAGE_KEY = 'matheo.deviceId';

function getOrCreateRawId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length >= 32) return existing;
    // crypto.randomUUID is available in all evergreen browsers + Capacitor
    // WebView; fallback to Math.random for very old runtimes (won't ship).
    const generated =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_KEY, generated);
    return generated;
  } catch {
    // localStorage blocked (private mode / sandboxed iframe). Fall back to a
    // per-page-load id -- displacement will still work, the user just gets
    // logged out every refresh in that environment.
    return `volatile-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

async function sha256Hex(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

let cached: Promise<string> | null = null;

/**
 * Returns a 64-char hex SHA-256 fingerprint stable across app launches on the
 * same install + same browser. Cached for the lifetime of the page so we hash
 * once per session.
 */
export function getDeviceHash(): Promise<string> {
  if (!cached) {
    const raw = getOrCreateRawId();
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    cached = sha256Hex(`${raw}|${ua}`);
  }
  return cached;
}
