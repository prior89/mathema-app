import { BadRequestException, ConflictException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { PREMIUM_PREVIEW_DAYS, PREMIUM_PREVIEW_PRODUCT_ID } from './billing.constants';

function mockPrisma() {
  return {
    subscription: {
      findUnique: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    subscriptionEvent: { create: jest.fn() },
  };
}

function mockPlayApi() {
  return {
    getSubscription: jest.fn(),
    acknowledgeSubscription: jest.fn().mockResolvedValue(undefined),
  };
}

function mockQuota() {
  return {
    getSolverUsed: jest.fn().mockResolvedValue(2),
    getSolverGraceState: jest.fn().mockResolvedValue({
      inGrace: false,
      limit: 8,
      graceEndsAt: new Date('2026-06-20'),
    }),
    resetAt: jest.fn().mockReturnValue(new Date('2026-06-12T00:00:00Z')),
  };
}

function mockObfuscatedAccount() {
  return {
    isConfigured: jest.fn().mockReturnValue(true),
    forUser: jest.fn().mockReturnValue('obf-user-u1'),
  };
}

function build() {
  const prisma = mockPrisma();
  const playApi = mockPlayApi();
  const quota = mockQuota();
  const obfuscatedAccount = mockObfuscatedAccount();
  const svc = new BillingService(
    prisma as any,
    playApi as any,
    quota as any,
    obfuscatedAccount as any,
  );
  return { svc, prisma, playApi, quota, obfuscatedAccount };
}

function activePlayPayload(extra: Record<string, unknown> = {}) {
  const expiry = new Date('2026-07-01T00:00:00Z');
  return {
    subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE',
    startTime: '2026-06-01T00:00:00Z',
    acknowledgementState: 'ACKNOWLEDGEMENT_STATE_PENDING',
    lineItems: [{ productId: 'premium_monthly', expiryTime: expiry.toISOString() }],
    ...extra,
  };
}

describe('BillingService', () => {
  const ORIG_BILLING_UI = process.env.BILLING_UI_ENABLED;
  afterEach(() => {
    process.env.BILLING_UI_ENABLED = ORIG_BILLING_UI;
    jest.clearAllMocks();
  });

  describe('isBillingUiEnabled', () => {
    it('defaults off', () => {
      delete process.env.BILLING_UI_ENABLED;
      const { svc } = build();
      expect(svc.isBillingUiEnabled()).toBe(false);
    });

    it('returns true for "true" or "1"', () => {
      const { svc } = build();
      process.env.BILLING_UI_ENABLED = 'true';
      expect(svc.isBillingUiEnabled()).toBe(true);
      process.env.BILLING_UI_ENABLED = '1';
      expect(svc.isBillingUiEnabled()).toBe(true);
    });
  });

  describe('getObfuscatedAccountIdForUser', () => {
    it('delegates to ObfuscatedAccountService', () => {
      const { svc, obfuscatedAccount } = build();
      expect(svc.getObfuscatedAccountIdForUser('u1')).toBe('obf-user-u1');
      expect(obfuscatedAccount.forUser).toHaveBeenCalledWith('u1');
    });
  });

  describe('isPremium / getEntitlement', () => {
    it('treats ACTIVE with future expiry as premium', async () => {
      const { svc, prisma } = build();
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        expiryTime: new Date(Date.now() + 86_400_000),
        productId: 'premium_monthly',
        startTime: new Date(),
      });
      await expect(svc.isPremium('u1')).resolves.toBe(true);
      const ent = await svc.getEntitlement('u1');
      expect(ent.tier).toBe('PREMIUM');
      expect(ent.source).toBe('PLAY');
    });

    it('treats CANCELED but unexpired as still entitled', async () => {
      const { svc, prisma } = build();
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'CANCELED',
        expiryTime: new Date(Date.now() + 86_400_000),
        productId: 'premium_yearly',
        startTime: new Date(),
      });
      await expect(svc.isPremium('u1')).resolves.toBe(true);
    });

    it('returns preview eligibility when no subscription row', async () => {
      const { svc, prisma } = build();
      prisma.subscription.findUnique.mockResolvedValue(null);
      const ent = await svc.getEntitlement('u1');
      expect(ent.premium).toBe(false);
      expect(ent.previewEligibility.eligible).toBe(true);
    });
  });

  describe('getSolverQuota', () => {
    it('returns unlimited limit for premium users', async () => {
      const { svc, prisma } = build();
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        expiryTime: new Date(Date.now() + 86_400_000),
        productId: 'premium_monthly',
      });
      const q = await svc.getSolverQuota('u1');
      expect(q.limit).toBeNull();
      expect(q.used).toBe(2);
    });

    it('returns grace limit for free users in grace window', async () => {
      const { svc, prisma, quota } = build();
      prisma.subscription.findUnique.mockResolvedValue(null);
      quota.getSolverGraceState.mockResolvedValue({
        inGrace: true,
        limit: 16,
        graceEndsAt: new Date('2026-06-15'),
      });
      const q = await svc.getSolverQuota('u1');
      expect(q.limit).toBe(16);
      expect(q.inGrace).toBe(true);
    });
  });

  describe('startPremiumPreview', () => {
    it('creates a cardless preview subscription', async () => {
      const { svc, prisma } = build();
      prisma.subscription.findUnique.mockResolvedValue(null);
      const expiry = new Date(Date.now() + PREMIUM_PREVIEW_DAYS * 86_400_000);
      prisma.subscription.create.mockResolvedValue({
        id: 'sub-1',
        productId: PREMIUM_PREVIEW_PRODUCT_ID,
        expiryTime: expiry,
      });
      prisma.subscriptionEvent.create.mockResolvedValue({});

      const result = await svc.startPremiumPreview('u1');
      expect(result.premium).toBe(true);
      expect(result.productId).toBe(PREMIUM_PREVIEW_PRODUCT_ID);
      expect(prisma.subscription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'u1',
            productId: PREMIUM_PREVIEW_PRODUCT_ID,
            purchaseToken: 'preview:u1',
            autoRenewing: false,
          }),
        }),
      );
    });

    it('rejects when subscription history exists', async () => {
      const { svc, prisma } = build();
      prisma.subscription.findUnique.mockResolvedValue({
        productId: 'premium_monthly',
      });
      await expect(svc.startPremiumPreview('u1')).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('verifyAndRecordPurchase', () => {
    it('maps Play ACTIVE state and upserts subscription', async () => {
      const { svc, prisma, playApi } = build();
      const expiry = new Date('2026-07-01T00:00:00Z');
      playApi.getSubscription.mockResolvedValue(activePlayPayload());
      prisma.subscription.findUnique.mockResolvedValue(null);
      prisma.subscription.upsert.mockResolvedValue({ id: 'sub-1' });
      prisma.subscription.update.mockResolvedValue({ id: 'sub-1' });
      prisma.subscriptionEvent.create.mockResolvedValue({});

      const result = await svc.verifyAndRecordPurchase('u1', 'premium_monthly', 'token-abc');
      expect(result.status).toBe('ACTIVE');
      expect(result.expiryTime).toEqual(expiry);
      expect(result.acknowledged).toBe(true);
      expect(playApi.acknowledgeSubscription).toHaveBeenCalledWith(
        'premium_monthly',
        'token-abc',
      );
      expect(prisma.subscription.upsert).toHaveBeenCalled();
    });

    it('throws AccountBindingMismatch when Play obfuscated id differs', async () => {
      const { svc, prisma, playApi } = build();
      playApi.getSubscription.mockResolvedValue(
        activePlayPayload({
          externalAccountIdentifiers: { obfuscatedExternalAccountId: 'wrong-id' },
        }),
      );
      prisma.subscription.findUnique.mockResolvedValue(null);

      await expect(
        svc.verifyAndRecordPurchase('u1', 'premium_monthly', 'token-abc'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('returns acknowledged:false when server ack fails', async () => {
      const { svc, prisma, playApi } = build();
      playApi.getSubscription.mockResolvedValue(activePlayPayload());
      playApi.acknowledgeSubscription.mockRejectedValue(new Error('Play down'));
      prisma.subscription.findUnique.mockResolvedValue(null);
      prisma.subscription.upsert.mockResolvedValue({ id: 'sub-1' });
      prisma.subscription.update.mockResolvedValue({ id: 'sub-1' });
      prisma.subscriptionEvent.create.mockResolvedValue({});

      const result = await svc.verifyAndRecordPurchase('u1', 'premium_monthly', 'token-abc');
      expect(result.acknowledged).toBe(false);
      expect(result.acknowledgedAt).toBeNull();
    });

    it('throws when Play API fails', async () => {
      const { svc, playApi } = build();
      playApi.getSubscription.mockRejectedValue(new Error('Play down'));
      await expect(
        svc.verifyAndRecordPurchase('u1', 'premium_monthly', 'bad-token'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('verifyAndRecordPurchaseByToken', () => {
    it('returns found:false for unknown token', async () => {
      const { svc, prisma } = build();
      prisma.subscription.findUnique.mockResolvedValue(null);
      const result = await svc.verifyAndRecordPurchaseByToken('unknown-token', 'rtdn:2');
      expect(result).toEqual({ found: false });
    });
  });
});