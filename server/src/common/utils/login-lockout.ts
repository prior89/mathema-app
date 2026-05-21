/**
 * SEC-3 -- login lockout on (IP, email) tuple.
 *
 * Why composite key:
 *   - IP-only lockout: an attacker on a shared NAT locks out everyone on
 *     that NAT for one user's wrong-password sprees -- collateral DoS.
 *   - email-only lockout: an attacker hitting one email from many IPs would
 *     still be slowed, but a friend trying to lock out a victim could DoS
 *     them with a single curl loop.
 *   - (IP, email): attacker must rotate BOTH to keep retrying, and a single
 *     IP retrying a wrong password only locks itself out against that one
 *     account. Trade-off: low collateral, high attacker cost.
 *
 * Counter is Redis-backed with a 5-minute TTL. Successful login clears the
 * counter so a legitimate fat-finger user is not penalised. Lockout window
 * is the same 5 minutes -- short enough for the user to come back after
 * coffee, long enough that an automated bruteforcer at 6 tries/min stays
 * locked out indefinitely.
 *
 * SecurityEventService integration lands in a follow-up (DEV-* uses it for
 * device-switch + this for LOGIN_LOCKED). Right now the lockout itself is
 * the security control; logging is additive.
 */
import { UnauthorizedException } from '@nestjs/common';
import type { RedisService } from '../../infrastructure/redis/redis.service';

const LOCKOUT_TTL_SEC = 5 * 60;
const LOCKOUT_THRESHOLD = 5;

function key(ip: string, email: string): string {
  // Lower-case email so 'A@b' and 'a@b' share a counter. IP stays as
  // observed (v4/v6 string).
  return `auth:fail:${ip || 'unknown'}:${email.toLowerCase()}`;
}

/**
 * Throws UnauthorizedException with Retry-After hint when the (ip, email)
 * tuple has already crossed the threshold. Call at the START of login --
 * before any DB / bcrypt work so a locked client cannot use this endpoint
 * as a CPU-burn vector.
 */
export async function assertNotLocked(
  redis: RedisService,
  ip: string,
  email: string,
): Promise<void> {
  const v = await redis.get(key(ip, email));
  const count = v ? Number(v) : 0;
  if (count >= LOCKOUT_THRESHOLD) {
    throw new UnauthorizedException({
      message: 'Too many failed login attempts. Try again in 5 minutes.',
      code: 'LOGIN_LOCKED',
      retryAfterSec: LOCKOUT_TTL_SEC,
    });
  }
}

/**
 * Increment the failure counter (idempotent TTL: first failure sets a
 * 5-minute window, subsequent failures within that window do NOT extend
 * it -- intentional, so the lock-out duration is bounded by the threshold
 * crossing time, not by every fresh attempt).
 */
export async function recordFailedLogin(
  redis: RedisService,
  ip: string,
  email: string,
): Promise<number> {
  return redis.incrWithTtl(key(ip, email), LOCKOUT_TTL_SEC);
}

/** Wipe the counter on successful login so a returning user starts fresh. */
export async function clearLoginFailures(
  redis: RedisService,
  ip: string,
  email: string,
): Promise<void> {
  await redis.del(key(ip, email));
}

export const LOGIN_LOCKOUT_THRESHOLD = LOCKOUT_THRESHOLD;
export const LOGIN_LOCKOUT_TTL_SEC = LOCKOUT_TTL_SEC;
