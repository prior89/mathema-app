/**
 * Higher-level billing helpers that wrap the raw BillingPlugin bridge.
 *
 * Lifecycle:
 *   1. initBilling()         — startConnection + idempotent listener attach
 *   2. fetchProducts()       — Play SkuDetails (region-aware, no hardcoded prices)
 *   3. buy(prod, offerToken) — launches billing flow; result via listener
 *   4. listener:purchaseUpdate → verifyOnServer → acknowledge
 *   5. restore()             — re-verify + re-acknowledge any existing purchases
 *
 * Web builds: every function is a no-op / returns empty. Only Capacitor
 * Android has Play Billing available.
 */
import { Capacitor } from '@capacitor/core';
import { Billing, BillingProductDetails, BillingPurchase } from '../native/billing-bridge';
import { get, post } from './api';

const PRODUCT_IDS = ['premium_monthly', 'premium_yearly'] as const;
export type MatheoProductId = (typeof PRODUCT_IDS)[number];

// Module-scope guards — initBilling() is called from PaywallPage mount,
// from the listener path on restore, and may also be hit by future entry
// points. Keep listener attach idempotent (same pattern as
// capacitor-bridge.ts pushListenersAttached).
let billingReady = false;
let listenersAttached = false;

export const isBillingAvailable = (): boolean =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';

export async function initBilling(): Promise<void> {
  if (!isBillingAvailable()) return;
  if (!billingReady) {
    await Billing.initialize();
    billingReady = true;
  }
  if (listenersAttached) return;
  // Attach BEFORE any buy/restore so we never miss the first purchaseUpdate.
  await Billing.addListener('purchaseUpdate', async ({ purchases }) => {
    for (const p of purchases) {
      if (p.purchaseState !== 1) continue; // 1 = PURCHASED; 2 = PENDING (wait)
      try {
        await verifyOnServer(p);
        if (!p.acknowledged) {
          await Billing.acknowledgePurchase({ purchaseToken: p.purchaseToken });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('billing verify/ack failed', e);
      }
    }
  });
  await Billing.addListener('purchaseError', ({ responseCode, message }) => {
    // eslint-disable-next-line no-console
    console.warn('Billing error', responseCode, message);
  });
  listenersAttached = true;
}

export async function fetchProducts(): Promise<BillingProductDetails[]> {
  if (!isBillingAvailable()) return [];
  await initBilling();
  const { products } = await Billing.queryProductDetails({ productIds: [...PRODUCT_IDS] });
  return products;
}

export async function buy(productId: string, offerToken: string): Promise<{ launched: boolean }> {
  await initBilling();
  return Billing.launchBillingFlow({ productId, offerToken });
}

export async function restore(): Promise<BillingPurchase[]> {
  if (!isBillingAvailable()) return [];
  await initBilling();
  const { purchases } = await Billing.restorePurchases();
  for (const p of purchases) {
    if (p.purchaseState !== 1) continue;
    try {
      await verifyOnServer(p);
      if (!p.acknowledged) {
        await Billing.acknowledgePurchase({ purchaseToken: p.purchaseToken });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('restore verify failed', e);
    }
  }
  return purchases;
}

async function verifyOnServer(p: BillingPurchase): Promise<void> {
  await post('/billing/verify', {
    productId: p.productId,
    purchaseToken: p.purchaseToken,
  });
}

export interface BillingServerStatus {
  premium: boolean;
  subscription: {
    productId: string;
    status: string;
    expiryTime: string | null;
    autoRenewing: boolean;
    isInIntroOfferPeriod: boolean;
  } | null;
  // Phase 5 server-side quota: limit === null => unlimited (premium tier).
  // Backend reports the AI Solver daily counter so the client can render a
  // pre-emptive meter next to the Solver button (avoids surprising 403s).
  quota?: {
    solver: {
      used: number;
      limit: number | null;
      resetAt: string;
    };
  };
}

export async function getServerStatus(): Promise<BillingServerStatus> {
  return get<BillingServerStatus>('/billing/status');
}
