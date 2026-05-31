import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Throttle by authenticated user id (JWT) when available, else fall back to
 * client IP. The default ThrottlerGuard keys on IP only — fine for the open
 * web, broken in two real environments:
 *   1. Local dev: every browser tab / hot-reload page / curl probe shares
 *      127.0.0.1, so a single developer dogfooding a 20-problem mastery set
 *      can hit "Too Many Requests" within a minute.
 *   2. Mobile carriers / school networks: hundreds of legitimate students
 *      share a NAT egress IP, and the first dozen to take a chapter exam
 *      lock out the rest.
 *
 * JwtAuthGuard runs as a method/controller guard *after* this application
 * guard fires, so req.user is normally undefined here. To still bucket by
 * user we crack the Authorization header ourselves (just enough to extract
 * `sub`/`id` — we don't validate the signature; ThrottlerGuard's job isn't
 * authentication). If anything goes wrong we fall back to IP rather than
 * blow up — failing open on a rate limiter is the right call (worst case
 * the request is still subject to the IP bucket).
 */
@Injectable()
export class UserAwareThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const hdr: string | undefined = req?.headers?.authorization;
    if (hdr && hdr.startsWith('Bearer ')) {
      const token = hdr.slice(7).trim();
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(
            Buffer.from(parts[1], 'base64url').toString('utf8'),
          );
          const uid = payload?.sub ?? payload?.id ?? payload?.userId;
          if (uid) return `u:${uid}`;
        } catch {
          /* malformed JWT — fall through to IP */
        }
      }
    }
    return `ip:${req?.ip ?? 'unknown'}`;
  }
}
