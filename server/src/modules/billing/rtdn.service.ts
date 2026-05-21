import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { BillingService } from './billing.service';
import { DeveloperNotification, RtdnRequestDto } from './rtdn.dto';

/** Google Play notificationType -> human-readable name, used in event-type
 *  strings and log lines. Numeric values per Play Billing docs:
 *  https://developer.android.com/google/play/billing/rtdn-reference
 */
const NOTIFICATION_TYPE_NAMES: Record<number, string> = {
  1: 'SUBSCRIPTION_RECOVERED',
  2: 'SUBSCRIPTION_RENEWED',
  3: 'SUBSCRIPTION_CANCELED',
  4: 'SUBSCRIPTION_PURCHASED',
  5: 'SUBSCRIPTION_ON_HOLD',
  6: 'SUBSCRIPTION_IN_GRACE_PERIOD',
  7: 'SUBSCRIPTION_RESTARTED',
  8: 'SUBSCRIPTION_PRICE_CHANGE_CONFIRMED',
  9: 'SUBSCRIPTION_DEFERRED',
  10: 'SUBSCRIPTION_PAUSED',
  11: 'SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED',
  12: 'SUBSCRIPTION_REVOKED',
  13: 'SUBSCRIPTION_EXPIRED',
  20: 'SUBSCRIPTION_PENDING_PURCHASE_CANCELED',
};

/** Notifications that mutate Subscription row state — for these we re-query
 *  Play Developer API for the authoritative state instead of trusting the
 *  notificationType. The notification is a hint; the API is the source of
 *  truth. */
const STATE_MUTATING_TYPES = new Set<number>([
  1,  // RECOVERED
  2,  // RENEWED
  3,  // CANCELED
  4,  // PURCHASED
  5,  // ON_HOLD
  6,  // GRACE
  7,  // RESTARTED
  10, // PAUSED
  12, // REVOKED
  13, // EXPIRED
]);

/** Informational notifications: we record the event but don't touch the
 *  Subscription row state. PRICE_CHANGE_CONFIRMED in particular only signals
 *  that the user accepted a future price change; row state remains current. */
const INFORMATIONAL_TYPES = new Set<number>([
  8,  // PRICE_CHANGE_CONFIRMED
  9,  // DEFERRED
  11, // PAUSE_SCHEDULE_CHANGED
  20, // PENDING_PURCHASE_CANCELED
]);

/** Redis idempotency key TTL — 7 days is well above Pub/Sub's 7-day max
 *  retry window, so any duplicate redelivery within the retry budget is
 *  guaranteed to collide on the SET NX. */
const IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class RtdnService {
  private readonly logger = new Logger(RtdnService.name);
  private readonly oauthClient = new OAuth2Client();

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly billing: BillingService,
  ) {}

  /** Verifies the OIDC bearer token Pub/Sub attached to the push request.
   *
   *  - Issuer must be Google (`accounts.google.com` or its https variant).
   *  - `aud` must match RTDN_AUDIENCE if set. If RTDN_AUDIENCE is empty, we
   *    log a warning but accept (operator hasn't finished wiring Pub/Sub yet
   *    — better to fail loudly than silently 401).
   *  - `email` must match RTDN_SERVICE_ACCOUNT_EMAIL if set. Same fallback.
   *
   *  Throws UnauthorizedException on any verification failure.
   */
  async verifyOidcToken(authHeader: string): Promise<void> {
    const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
    if (!match) {
      throw new UnauthorizedException('Authorization header is not a Bearer token');
    }
    const token = match[1];

    const expectedAudience = this.config.get<string>('rtdn.audience') ?? '';
    const expectedEmail = this.config.get<string>('rtdn.serviceAccountEmail') ?? '';

    if (!expectedAudience) {
      // Refuse rather than accept on empty config — Phase 4 contract is that
      // the endpoint stays closed until operator sets RTDN_AUDIENCE.
      this.logger.error(
        'RTDN received but RTDN_AUDIENCE is not configured — refusing. Operator must set RTDN_AUDIENCE before Pub/Sub can deliver.',
      );
      throw new UnauthorizedException('RTDN endpoint not configured');
    }

    let payload;
    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: expectedAudience,
      });
      payload = ticket.getPayload();
    } catch (e) {
      this.logger.warn(`RTDN OIDC verify failed: ${(e as Error).message}`);
      throw new UnauthorizedException('Invalid OIDC token');
    }

    if (!payload) {
      throw new UnauthorizedException('OIDC token had no payload');
    }

    // Issuer must be Google. verifyIdToken already enforces this against the
    // Google JWKS, but checking the claim explicitly catches the case where
    // an attacker fooled us into pointing at a different JWKS at boot.
    const iss = payload.iss ?? '';
    if (iss !== 'accounts.google.com' && iss !== 'https://accounts.google.com') {
      throw new UnauthorizedException(`Unexpected OIDC issuer: ${iss}`);
    }

    // Email pinning. If operator set RTDN_SERVICE_ACCOUNT_EMAIL we enforce
    // strict equality; otherwise warn but continue.
    if (expectedEmail) {
      if (payload.email !== expectedEmail) {
        throw new UnauthorizedException(
          `OIDC email ${payload.email ?? '<missing>'} does not match expected RTDN service account`,
        );
      }
      if (payload.email_verified === false) {
        throw new UnauthorizedException('OIDC email is not verified');
      }
    } else {
      this.logger.warn(
        `RTDN_SERVICE_ACCOUNT_EMAIL not set — accepting any Google-signed OIDC token (caller email=${payload.email ?? '<none>'}). Operator should pin this in production.`,
      );
    }
  }

  /** Decodes the Pub/Sub message envelope's base64 data field into a
   *  DeveloperNotification. Throws BadRequestException on malformed input —
   *  the controller lets that propagate to a 400, which is the correct
   *  response (Pub/Sub will NOT retry 400s, which is what we want for
   *  permanently-broken messages). */
  parseNotification(message: { data: string }): DeveloperNotification {
    let decoded: string;
    try {
      decoded = Buffer.from(message.data, 'base64').toString('utf8');
    } catch (e) {
      throw new BadRequestException(`RTDN data is not valid base64: ${(e as Error).message}`);
    }
    let parsed: DeveloperNotification;
    try {
      parsed = JSON.parse(decoded) as DeveloperNotification;
    } catch (e) {
      throw new BadRequestException(`RTDN data is not valid JSON: ${(e as Error).message}`);
    }
    if (!parsed || typeof parsed !== 'object') {
      throw new BadRequestException('RTDN data did not parse to an object');
    }
    return parsed;
  }

  /** Main entry point called by RtdnController. Performs (in order):
   *    1. messageId idempotency check via Redis SET NX
   *    2. parse + dispatch the inner DeveloperNotification
   *    3. always resolve to no-throw so the controller returns 200
   *
   *  Returns void; any errors during dispatch are logged but swallowed so
   *  Pub/Sub does not retry. (Re-delivery of a poison message just keeps
   *  hammering us — the operator gets a SubscriptionEvent + Logger.error
   *  trail to debug from instead.) */
  async handle(body: RtdnRequestDto): Promise<void> {
    const messageId = body.message.messageId;

    // Idempotency: SET NX with 7d TTL. Duplicate delivery → no-op.
    const idempotencyKey = `rtdn:msg:${messageId}`;
    const fresh = await this.redis.setNx(idempotencyKey, '1', IDEMPOTENCY_TTL_SECONDS);
    if (!fresh) {
      this.logger.log(`RTDN duplicate messageId ${messageId} — no-op`);
      return;
    }

    let notification: DeveloperNotification;
    try {
      notification = this.parseNotification(body.message);
    } catch (e) {
      // Don't even know what kind of message this was — surface as 400. The
      // idempotency key is already set; that's intentional, we don't want
      // Pub/Sub to retry a malformed body either.
      throw e;
    }

    // Test notifications are sent by Google when the operator clicks "Send a
    // test notification" in Play Console. Log + audit-skip.
    if (notification.testNotification) {
      this.logger.log(
        `RTDN test notification received (version=${notification.testNotification.version}, packageName=${notification.packageName})`,
      );
      return;
    }

    const sub = notification.subscriptionNotification;
    if (!sub) {
      // oneTimeProduct or voidedPurchase — we don't sell those.
      this.logger.log(
        `RTDN non-subscription notification ignored (packageName=${notification.packageName})`,
      );
      return;
    }

    await this.dispatchSubscriptionNotification(sub, notification);
  }

  /** Routes a single subscriptionNotification block to the right handler.
   *  Always resolves; never throws. */
  private async dispatchSubscriptionNotification(
    sub: NonNullable<DeveloperNotification['subscriptionNotification']>,
    envelope: DeveloperNotification,
  ): Promise<void> {
    const { notificationType, purchaseToken, subscriptionId } = sub;
    const typeName = NOTIFICATION_TYPE_NAMES[notificationType] ?? `UNKNOWN_${notificationType}`;
    const tokenPreview = purchaseToken.slice(0, 8) + '...';
    const eventType = `rtdn:${notificationType}:${typeName}`;

    this.logger.log(
      `RTDN ${typeName} subscriptionId=${subscriptionId} token=${tokenPreview} pkg=${envelope.packageName}`,
    );

    try {
      if (STATE_MUTATING_TYPES.has(notificationType)) {
        const result = await this.billing.verifyAndRecordPurchaseByToken(
          purchaseToken,
          eventType,
        );
        if (!result.found) {
          // Orphan event — Subscription row doesn't exist locally, so we
          // can't write a SubscriptionEvent (FK), and we can't link to a
          // user. Just log; the BillingService already emitted a warn line.
          // Operator can audit by grepping logs for the token preview.
          return;
        }
        this.logger.log(
          `RTDN ${typeName} applied: status=${result.status} expiry=${result.expiryTime.toISOString()}`,
        );
        return;
      }

      if (INFORMATIONAL_TYPES.has(notificationType)) {
        await this.billing.appendInformationalEvent(purchaseToken, eventType, {
          notificationType,
          notificationTypeName: typeName,
          subscriptionId,
          packageName: envelope.packageName,
          eventTimeMillis: envelope.eventTimeMillis,
        });
        return;
      }

      // Unknown notificationType — Google added a new one we don't know
      // about yet. Audit it as informational so the operator notices.
      this.logger.warn(
        `RTDN unknown notificationType=${notificationType} token=${tokenPreview} — auditing only`,
      );
      await this.billing.appendInformationalEvent(purchaseToken, eventType, {
        notificationType,
        notificationTypeName: typeName,
        subscriptionId,
        packageName: envelope.packageName,
        eventTimeMillis: envelope.eventTimeMillis,
        unknown: true,
      });
    } catch (e) {
      // Swallow — Pub/Sub must get a 200 or it retries. Log for the operator
      // and move on; the idempotency key is already set so a retry would
      // no-op anyway.
      this.logger.error(
        `RTDN dispatch failed for ${typeName} token=${tokenPreview}: ${(e as Error).message}`,
      );
    }
  }
}
