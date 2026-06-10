import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RtdnService } from './rtdn.service';

function mockConfig(values: Record<string, string> = {}) {
  return {
    get: jest.fn((k: string) => values[k] ?? ''),
  };
}

function mockRedis() {
  return {
    setNx: jest.fn().mockResolvedValue(true),
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
  };
}

function build(config: Record<string, string> = { 'rtdn.audience': 'https://api.example/rtdn' }) {
  const billing = mockBilling();
  const redis = mockRedis();
  const svc = new RtdnService(mockConfig(config) as any, redis as any, billing as any);
  return { svc, billing, redis, config };
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
    it('no-ops duplicate messageId via Redis SET NX', async () => {
      const { svc, billing, redis } = build();
      redis.setNx.mockResolvedValue(false);
      const payload = {
        version: '1.0',
        packageName: 'ai.matheo.app',
        subscriptionNotification: {
          notificationType: 2,
          purchaseToken: 'tok-dup',
          subscriptionId: 'premium_monthly',
        },
      };
      const body = {
        message: {
          messageId: 'msg-dup',
          data: Buffer.from(JSON.stringify(payload), 'utf8').toString('base64'),
        },
      };
      await svc.handle(body);
      expect(billing.verifyAndRecordPurchaseByToken).not.toHaveBeenCalled();
    });

    it('dispatches state-mutating RENEWED notifications', async () => {
      const { svc, billing } = build();
      const payload = {
        version: '1.0',
        packageName: 'ai.matheo.app',
        subscriptionNotification: {
          notificationType: 2,
          purchaseToken: 'tok-renew',
          subscriptionId: 'premium_monthly',
        },
      };
      const body = {
        message: {
          messageId: 'msg-renew',
          data: Buffer.from(JSON.stringify(payload), 'utf8').toString('base64'),
        },
      };
      await svc.handle(body);
      expect(billing.verifyAndRecordPurchaseByToken).toHaveBeenCalledWith(
        'tok-renew',
        'rtdn:2:SUBSCRIPTION_RENEWED',
      );
    });

    it('ignores test notifications', async () => {
      const { svc, billing } = build();
      const payload = {
        version: '1.0',
        packageName: 'ai.matheo.app',
        testNotification: { version: '1.0' },
      };
      const body = {
        message: {
          messageId: 'msg-test',
          data: Buffer.from(JSON.stringify(payload), 'utf8').toString('base64'),
        },
      };
      await svc.handle(body);
      expect(billing.verifyAndRecordPurchaseByToken).not.toHaveBeenCalled();
    });
  });
});