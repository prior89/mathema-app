/**
 * SEC-2 -- pwnedpasswords.com breach check using the k-anonymity protocol.
 *
 * Flow:
 *   1. SHA-1 the candidate password
 *   2. Send only the first 5 hex chars to api.pwnedpasswords.com (no full hash
 *      ever leaves the server -- they cannot identify which exact password)
 *   3. Server returns every full-hash suffix that begins with that prefix +
 *      breach occurrence count
 *   4. If our remaining 35-char suffix is in the list, the password has been
 *      seen in a public breach corpus -- refuse it
 *
 * Graceful degradation: if the external API is unreachable / slow we log and
 * ALLOW the password rather than block the auth flow on a third-party outage.
 * A breach hit blocks; a network failure does not.
 *
 * Skipped paths:
 *   - dev-login admin/admin seed (intentionally weak credential, dev-only)
 *   - the synthetic placeholder hashes assigned to Google sign-in users
 *     (`google:<sub>:<ts>`) -- never sent to bcrypt as a user password
 *
 * Reference: https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
import { createHash } from 'crypto';
import { BadRequestException, Logger } from '@nestjs/common';

const PWNED_API = 'https://api.pwnedpasswords.com/range';
const REQUEST_TIMEOUT_MS = 4_000;
const logger = new Logger('PasswordBreachCheck');

/**
 * Throws BadRequestException if the candidate password is found in the
 * pwnedpasswords corpus. Returns silently on miss or on network failure.
 *
 * Set PWNED_PASSWORDS_DISABLED=true to skip the check entirely (useful in
 * CI / offline dev). Set PWNED_PASSWORDS_MIN_COUNT to require N+ occurrences
 * before rejecting (default 1 -- any sighting blocks).
 */
export async function assertPasswordNotBreached(password: string): Promise<void> {
  if (process.env.PWNED_PASSWORDS_DISABLED === 'true') return;
  if (!password || password.length === 0) return;

  const minCount = Number(process.env.PWNED_PASSWORDS_MIN_COUNT ?? '1');

  const sha1 = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  let body: string;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(`${PWNED_API}/${prefix}`, {
        headers: { 'Add-Padding': 'true' }, // pad response so length doesn't leak prefix popularity
        signal: ctrl.signal,
      });
      if (!res.ok) {
        logger.warn(`pwnedpasswords returned HTTP ${res.status} -- allowing`);
        return;
      }
      body = await res.text();
    } finally {
      clearTimeout(timer);
    }
  } catch (e) {
    logger.warn(`pwnedpasswords check skipped (${(e as Error).message}) -- allowing`);
    return;
  }

  for (const line of body.split(/\r?\n/)) {
    if (!line) continue;
    const [hashSuffix, countStr] = line.split(':');
    if (hashSuffix?.toUpperCase() === suffix) {
      const count = Number(countStr ?? '0');
      if (count >= minCount) {
        throw new BadRequestException({
          message: 'This password has appeared in a public data breach. Please choose a different one.',
          code: 'PASSWORD_BREACHED',
          breachCount: count,
        });
      }
      return;
    }
  }
}
