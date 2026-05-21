/**
 * SEC-4 -- SecurityEventService.
 *
 * Thin wrapper over prisma.securityEvent.create that:
 *   - Fire-and-forgets writes so an audit-log outage does NOT block login
 *     (we still log the failure to Logger.warn so ops can notice)
 *   - Standardises the payload shape so callers don't have to remember the
 *     userId / metadata field semantics every time
 *
 * Consumers:
 *   - AuthService.login          -> LOGIN_SUCCESS / LOGIN_FAIL / LOGIN_LOCKED
 *                                   / NEW_DEVICE_LOGIN
 *   - AuthService.resetPassword  -> PASSWORD_RESET_SUCCESS
 *   - AuthService.forgotPassword -> PASSWORD_RESET_REQUEST
 *   - UsersService.changePassword -> PASSWORD_CHANGE
 *   - UsersService.deleteAccount  -> ACCOUNT_DELETED
 *   - password-breach.ts          -> BREACH_PASSWORD_BLOCKED (via a callback;
 *                                     util cannot DI directly)
 *   - AuthService device-revoke   -> DEVICE_REVOKE_OTHERS
 */
import { Injectable, Logger } from '@nestjs/common';
import { SecurityEventType } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

export interface SecurityEventContext {
  userId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  /** Free-form structured metadata. Keep PII out unless strictly necessary. */
  metadata?: Record<string, unknown>;
}

@Injectable()
export class SecurityEventService {
  private readonly logger = new Logger(SecurityEventService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Record a security event. Fire-and-forget: on DB error we log and swallow
   * so the caller's primary flow (login etc.) does not fail.
   */
  record(eventType: SecurityEventType, ctx: SecurityEventContext = {}): void {
    this.prisma.securityEvent.create({
      data: {
        userId: ctx.userId ?? null,
        eventType,
        ip: ctx.ip ?? null,
        userAgent: ctx.userAgent ?? null,
        metadata: (ctx.metadata as any) ?? undefined,
      },
    }).catch((e) => {
      this.logger.warn(`SecurityEvent write failed (${eventType}): ${e?.message ?? e}`);
    });
  }
}
