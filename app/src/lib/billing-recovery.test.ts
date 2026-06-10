import { afterEach, describe, expect, it, vi } from 'vitest';

const { restorePurchases, acknowledgePurchase, initialize, post } = vi.hoisted(() => ({
  restorePurchases: vi.fn(),
  acknowledgePurchase: vi.fn(),
  initialize: vi.fn().mockResolvedValue({ ready: true }),
  post: vi.fn(),
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => true, getPlatform: () => 'android' },
}));

vi.mock('../native/billing-bridge', () => ({
  Billing: {
    initialize,
    restorePurchases: (...args: unknown[]) => restorePurchases(...args),
    acknowledgePurchase: (...args: unknown[]) => acknowledgePurchase(...args),
  },
}));

vi.mock('./api', () => ({
  post: (...args: unknown[]) => post(...args),
}));

import {
  recoverPurchase,
  resetBillingRecoveryStateForTests,
  SYNC_DEBOUNCE_MS,
  syncPlayPurchases,
} from './billing-recovery';

const purchase = {
  productId: 'premium_monthly',
  productIds: ['premium_monthly'],
  purchaseToken: 'tok-1',
  orderId: 'GPA.1',
  purchaseState: 1,
  acknowledged: false,
  purchaseTimeMs: 1,
};

describe('billing-recovery', () => {
  afterEach(() => {
    vi.clearAllMocks();
    resetBillingRecoveryStateForTests();
  });

  it('dedupes concurrent recoverPurchase for the same token', async () => {
    post.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                status: 'ACTIVE',
                expiryTime: '2026-07-01',
                isInIntroOfferPeriod: false,
                acknowledged: true,
                acknowledgedAt: null,
              }),
            30,
          );
        }),
    );

    const [a, b] = await Promise.all([recoverPurchase(purchase), recoverPurchase(purchase)]);
    expect(a).toBe(true);
    expect(b).toBe(false);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it('debounces syncPlayPurchases unless force=true', async () => {
    restorePurchases.mockResolvedValue({ purchases: [purchase] });
    post.mockResolvedValue({
      status: 'ACTIVE',
      expiryTime: '2026-07-01',
      isInIntroOfferPeriod: false,
      acknowledged: true,
      acknowledgedAt: null,
    });

    const first = await syncPlayPurchases();
    const second = await syncPlayPurchases();

    expect(first.processed).toBe(1);
    expect(second.processed).toBe(0);
    expect(restorePurchases).toHaveBeenCalledTimes(1);

    const forced = await syncPlayPurchases({ force: true });
    expect(forced.processed).toBe(1);
    expect(restorePurchases).toHaveBeenCalledTimes(2);
  });

  it('exposes debounce window constant', () => {
    expect(SYNC_DEBOUNCE_MS).toBeGreaterThan(0);
  });
});