import {
  BadRequestException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { RtdnInbox } from '@prisma/client';
import { RtdnService } from './rtdn.service';

function mockConfig(values: Record<string, string> = {}) {
  return {
    get: jest.fn((k: string) => values[k] ?? ''),
  };
}

function inboxRow(overrides: Partial<RtdnInbox> = {}): RtdnInbox {
  return {
    id: 'inbox-1',
    messageId: 'msg-1',
    status: 'RECEIVED',
    attempts: 0,
    payloadHash: 'hash',
    payload: {},
    notificationKind: 'subscription',
    purchaseToken: 'tok-abc',
    lastError: null,
    leaseUntil: null,
    receivedAt: new Date(),
    processedAt: null,
    updatedAt: new Date(),
    ...overrides,
  };
}

function mockInbox() {
  return {
    ingest: jest.fn().mockResolvedValue({ row: inboxRow(), alreadyProcessed: false }),
    claim: jest.fn().mockResolvedValue(true),
    markProcessed: jest.fn().mockResolvedValue(undefined),
    markOrphan: jest.fn().mockResolvedValue(undefined),
    markRetryable: jest.fn().mockResolvedValue({ dead: false }),
    findById: jest.fn(),
    resetForRetry: jest.fn(),
    listForReconcile: jest.fn(),
  };
}

function mockBilling() {
  return {
    verifyAndRecordPurchaseByToken: jest.fn().mockResolvedValue({
      found: true,
      status: 'ACTIVE',
      expiryTime: new Date('2026-07-01'),
      isInIntroOfferPeriod: false,
    }),
    appendInformationalEvent: jest.fn().mockResolvedValue(true),
    handleVoidedPurchase: jest.fn().mockResolvedValue({ found: true, revoked: true }),
  };
}

function build(config: Record<string, string> = { 'rtdn.audience': 'https://api.example/rtdn' }) {
  const billing = mockBilling();
  const inbox = mockInbox();
  const svc = new RtdnService(mockConfig(config) as any, inbox as any, billing as any);
  return { svc, billing, inbox, config };
}

function rtdnBody(payload: object, messageId = 'msg-1') {
  return {
    message: {
      messageId,
      data: Buffer.from(JSON.stringify(payload), 'utf8').toString('base64'),
    },
  };
}

describe('RtdnService', () => {
  describe('verifyOidcToken', () => {
    it('rejects missing Bearer prefix', async () => {
      const { svc } = build();
      await expect(svc.verifyOidcToken('Basic abc')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects when RTDN_AUDIENCE is not configured', async () => {
      const { svc } = build({ 'rtdn.audience': '' });
      await expect(svc.verifyOidcToken('Bearer fake.jwt.token')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('parseNotification', () => {
    it('decodes base64 Pub/Sub payload', () => {
      const { svc } = build();
      const payload = {
        version: '1.0',
        packageName: 'ai.matheo.app',
        eventTimeMillis: '123',
        subscriptionNotification: {
          notificationType: 2,
          purchaseToken: 'tok-abc',
          subscriptionId: 'premium_monthly',
        },
      };
      const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
      const parsed = svc.parseNotification({ data });
      expect(parsed.packageName).toBe('ai.matheo.app');
      expect(parsed.subscriptionNotification?.notificationType).toBe(2);
    });

    it('throws on invalid JSON', () => {
      const { svc } = build();
      const data = Buffer.from('not-json', 'utf8').toString('base64');
      expect(() => svc.parseNotification({ data })).toThrow(BadRequestException);
    });
  });

  describe('handle', () => {
    it('no-ops duplicate messageId when inbox already PROCESSED', async () => {
      const { svc, billing, inbox } = build();
      inbox.ingest.mockResolvedValue({
        row: inboxRow({ status: 'PROCESSED' }),
        alreadyProcessed: true,
      });
      await svc.handle(
        rtdnBody({
          version: '1.0',
          packageName: 'ai.matheo.app',
          subscriptionNotification: {
            notificationType: 2,
            purchaseToken: 'tok-dup',
            subscriptionId: 'premium_monthly',
          },
        }, 'msg-dup'),
      );
      expect(inbox.claim).not.toHaveBeenCalled();
      expect(billing.verifyAndRecordPurchaseByToken).not.toHaveBeenCalled();
    });

    it('dispatches state-mutating RENEWED notifications', async () => {
      const { svc, billing, inbox } = build();
      await svc.handle(
        rtdnBody({
          version: '1.0',
          packageName: 'ai.matheo.app',
          subscriptionNotification: {
            notificationType: 2,
            purchaseToken: 'tok-renew',
            subscriptionId: 'premium_monthly',
          },
        }, 'msg-renew'),
      );
      expect(inbox.claim).toHaveBeenCalled();
      expect(inbox.markProcessed).toHaveBeenCalled();
      expect(billing.verifyAndRecordPurchaseByToken).toHaveBeenCalledWith(
        'tok-renew',
        'rtdn:2:SUBSCRIPTION_RENEWED',
      );
    });

    it('marks ORPHAN when no local subscription row exists', async () => {
      const { svc, billing, inbox } = build();
      billing.verifyAndRecordPurchaseByToken.mockResolvedValue({ found: false });
      await svc.handle(
        rtdnBody({
          version: '1.0',
          packageName: 'ai.matheo.app',
          subscriptionNotification: {
            notificationType: 4,
            purchaseToken: 'tok-orphan',
            subscriptionId: 'premium_monthly',
          },
        }),
      );
      expect(inbox.markOrphan).toHaveBeenCalled();
      expect(inbox.markProcessed).not.toHaveBeenCalled();
    });

    it('returns 503 path on transient Play API failure', async () => {
      const { svc, billing, inbox } = build();
      const { RtdnRetryableError } = await import('./rtdn.errors');
      billing.verifyAndRecordPurchaseByToken.mockRejectedValue(
        new RtdnRetryableError('Play API down'),
      );
      await expect(
        svc.handle(
          rtdnBody({
            version: '1.0',
            packageName: 'ai.matheo.app',
            subscriptionNotification: {
              notificationType: 2,
              purchaseToken: 'tok-fail',
              subscriptionId: 'premium_monthly',
            },
          }),
        ),
      ).rejects.toBeInstanceOf(ServiceUnavailableException);
      expect(inbox.markRetryable).toHaveBeenCalled();
    });

    it('dispatches voided subscription notifications', async () => {
      const { svc, billing, inbox } = build();
      await svc.handle(
        rtdnBody({
          version: '1.0',
          packageName: 'ai.matheo.app',
          eventTimeMillis: '1',
          voidedPurchaseNotification: {
            purchaseToken: 'tok-void',
            orderId: 'GPA.123',
            productType: 1,
            refundType: 1,
          },
        }),
      );
      expect(billing.handleVoidedPurchase).toHaveBeenCalledWith(
        'tok-void',
        'GPA.123',
        'rtdn:voided:VOIDED_PURCHASE',
        expect.objectContaining({ productType: 1 }),
      );
      expect(inbox.markProcessed).toHaveBeenCalled();
    });

    it('ignores test notifications', async () => {
      const { svc, billing } = build();
      await svc.handle(
        rtdnBody({
          version: '1.0',
          packageName: 'ai.matheo.app',
          testNotification: { version: '1.0' },
        }, 'msg-test'),
      );
      expect(billing.verifyAndRecordPurchaseByToken).not.toHaveBeenCalled();
    });
  });
});