import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { createHmac, timingSafeEqual } from 'node:crypto';

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
 * user we verify the HS256 access token signature and time claims here, then
 * extract its `sub`. If anything goes wrong we fall back to the IP bucket;
 * an untrusted token must never be allowed to choose its own rate-limit key.
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
          // This guard runs before JwtAuthGuard. Verify the access token here
          // before trusting its subject; otherwise a forged payload can pick
          // a new throttle bucket for every request and evade the IP limit.
          const secret = process.env.JWT_ACCESS_SECRET;
          if (!secret) return `ip:${req?.ip ?? 'unknown'}`;
          const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
          if (header?.alg !== 'HS256') return `ip:${req?.ip ?? 'unknown'}`;
          const expected = createHmac('sha256', secret)
            .update(`${parts[0]}.${parts[1]}`)
            .digest();
          const supplied = Buffer.from(parts[2], 'base64url');
          if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
            return `ip:${req?.ip ?? 'unknown'}`;
          }
          const payload = JSON.parse(
            Buffer.from(parts[1], 'base64url').toString('utf8'),
          );
          const now = Math.floor(Date.now() / 1000);
          if (
            (typeof payload?.exp === 'number' && payload.exp <= now)
            || (typeof payload?.nbf === 'number' && payload.nbf > now)
          ) {
            return `ip:${req?.ip ?? 'unknown'}`;
          }
          const uid = payload?.sub;
          if (typeof uid === 'string' && uid.length > 0 && uid.length <= 128) {
            return `u:${uid}`;
          }
        } catch {
          /* malformed JWT — fall through to IP */
        }
      }
    }
    return `ip:${req?.ip ?? 'unknown'}`;
  }
}
