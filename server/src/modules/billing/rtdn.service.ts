import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RtdnInbox } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { BillingService } from './billing.service';
import { DeveloperNotification, RtdnRequestDto } from './rtdn.dto';
import {
  isRtdnOrphanError,
  isRtdnRetryableError,
  RtdnOrphanError,
  RtdnRetryableError,
} from './rtdn.errors';
import { RtdnInboxService } from './rtdn-inbox.service';

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

@Injectable()
export class RtdnService {
  private readonly logger = new Logger(RtdnService.name);
  private readonly oauthClient = new OAuth2Client();

  constructor(
    private readonly config: ConfigService,
    private readonly inbox: RtdnInboxService,
    private readonly billing: BillingService,
  ) {}

  /** Verifies the OIDC bearer token Pub/Sub attached to the push request. */
  async verifyOidcToken(authHeader: string): Promise<void> {
    const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
    if (!match) {
      throw new UnauthorizedException('Authorization header is not a Bearer token');
    }
    const token = match[1];

    const expectedAudience = this.config.get<string>('rtdn.audience') ?? '';
    const expectedEmail = this.config.get<string>('rtdn.serviceAccountEmail') ?? '';

    if (!expectedAudience) {
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

    const iss = payload.iss ?? '';
    if (iss !== 'accounts.google.com' && iss !== 'https://accounts.google.com') {
      throw new UnauthorizedException(`Unexpected OIDC issuer: ${iss}`);
    }

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

  /** Main entry: durable inbox insert → claim → dispatch → PROCESSED or 5xx. */
  async handle(body: RtdnRequestDto): Promise<void> {
    const messageId = body.message.messageId;
    const rawData = body.message.data;

    let decoded: DeveloperNotification | null = null;
    try {
      decoded = this.parseNotification(body.message);
    } catch (e) {
      const { row } = await this.inbox.ingest({
        messageId,
        rawData,
        decoded: null,
        publishTime: body.message.publishTime,
        pubsubSubscription: body.subscription,
      });
      await this.inbox.markProcessed(row.id);
      throw e;
    }

    const { row, alreadyProcessed } = await this.inbox.ingest({
      messageId,
      rawData,
      decoded,
      publishTime: body.message.publishTime,
      pubsubSubscription: body.subscription,
    });

    if (alreadyProcessed) {
      this.logger.log(`RTDN duplicate messageId ${messageId} — already ${row.status}`);
      return;
    }

    await this.processInboxRow(row, decoded);
  }

  /** Background reconciliation for ORPHAN / stale RETRYABLE rows. */
  async reprocessInboxRowById(id: string): Promise<void> {
    const row = await this.inbox.findById(id);
    if (!row) return;
    const payload = row.payload as { decoded?: DeveloperNotification | null };
    const decoded = payload?.decoded ?? null;
    if (!decoded) return;
    await this.inbox.resetForRetry(id);
    const fresh = await this.inbox.findById(id);
    if (!fresh) return;
    await this.processInboxRow(fresh, decoded);
  }

  private async processInboxRow(row: RtdnInbox, decoded: DeveloperNotification): Promise<void> {
    const claimed = await this.inbox.claim(row.id);
    if (!claimed) {
      this.logger.log(`RTDN messageId ${row.messageId} — could not claim (in flight)`);
      return;
    }

    try {
      await this.dispatchDecoded(decoded);
      await this.inbox.markProcessed(row.id);
    } catch (e) {
      await this.handleProcessingFailure(row.id, e);
    }
  }

  private async handleProcessingFailure(rowId: string, e: unknown): Promise<void> {
    const message = (e as Error).message ?? String(e);

    if (isRtdnOrphanError(e)) {
      await this.inbox.markOrphan(rowId, message);
      this.logger.warn(`RTDN orphan stored for reconciliation: ${message}`);
      return;
    }

    if (isRtdnRetryableError(e)) {
      const { dead } = await this.inbox.markRetryable(rowId, message);
      if (dead) return;
      throw new ServiceUnavailableException(`RTDN transient failure: ${message}`);
    }

    throw e;
  }

  private async dispatchDecoded(notification: DeveloperNotification): Promise<void> {
    if (notification.testNotification) {
      this.logger.log(
        `RTDN test notification received (version=${notification.testNotification.version}, packageName=${notification.packageName})`,
      );
      return;
    }

    const sub = notification.subscriptionNotification;
    if (sub) {
      await this.dispatchSubscriptionNotification(sub, notification);
      return;
    }

    const voided = notification.voidedPurchaseNotification;
    if (voided) {
      await this.dispatchVoidedNotification(voided, notification);
      return;
    }

    this.logger.log(
      `RTDN non-subscription notification ignored (packageName=${notification.packageName})`,
    );
  }

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

    if (STATE_MUTATING_TYPES.has(notificationType)) {
      const result = await this.billing.verifyAndRecordPurchaseByToken(purchaseToken, eventType);
      if (!result.found) {
        throw new RtdnOrphanError(
          `Orphan subscription RTDN — no local row for token ${tokenPreview}`,
        );
      }
      this.logger.log(
        `RTDN ${typeName} applied: status=${result.status} expiry=${result.expiryTime.toISOString()}`,
      );
      return;
    }

    if (INFORMATIONAL_TYPES.has(notificationType)) {
      const ok = await this.billing.appendInformationalEvent(purchaseToken, eventType, {
        notificationType,
        notificationTypeName: typeName,
        subscriptionId,
        packageName: envelope.packageName,
        eventTimeMillis: envelope.eventTimeMillis,
      });
      if (!ok) {
        throw new RtdnOrphanError(
          `Orphan informational RTDN — no local row for token ${tokenPreview}`,
        );
      }
      return;
    }

    this.logger.warn(
      `RTDN unknown notificationType=${notificationType} token=${tokenPreview} — auditing only`,
    );
    const ok = await this.billing.appendInformationalEvent(purchaseToken, eventType, {
      notificationType,
      notificationTypeName: typeName,
      subscriptionId,
      packageName: envelope.packageName,
      eventTimeMillis: envelope.eventTimeMillis,
      unknown: true,
    });
    if (!ok) {
      throw new RtdnOrphanError(`Orphan unknown RTDN — no local row for token ${tokenPreview}`);
    }
  }

  private async dispatchVoidedNotification(
    voided: NonNullable<DeveloperNotification['voidedPurchaseNotification']>,
    envelope: DeveloperNotification,
  ): Promise<void> {
    const { purchaseToken, orderId, productType, refundType } = voided;
    const tokenPreview = purchaseToken.slice(0, 8) + '...';
    const eventType = 'rtdn:voided:VOIDED_PURCHASE';

    if (productType !== 1) {
      this.logger.log(
        `RTDN voided one-time product ignored token=${tokenPreview} productType=${productType}`,
      );
      return;
    }

    this.logger.log(
      `RTDN VOIDED_PURCHASE subscription token=${tokenPreview} orderId=${orderId ?? 'n/a'} pkg=${envelope.packageName}`,
    );

    const result = await this.billing.handleVoidedPurchase(purchaseToken, orderId, eventType, {
      productType,
      refundType,
      packageName: envelope.packageName,
      eventTimeMillis: envelope.eventTimeMillis,
      orderId,
    });

    if (!result.found) {
      throw new RtdnOrphanError(`Orphan voided RTDN — no local row for token ${tokenPreview}`);
    }

    this.logger.log(
      `RTDN VOIDED_PURCHASE applied: revoked=${result.revoked} token=${tokenPreview}`,
    );
  }
}