/**
 * Higher-level billing helpers that wrap the raw BillingPlugin bridge.
 *
 * Lifecycle:
 *   1. initBilling()         ??startConnection + idempotent listener attach
 *   2. fetchProducts()       ??Play SkuDetails (region-aware, no hardcoded prices)
 *   3. buy(prod, offerToken) ??launches billing flow; result via listener
 *   4. listener:purchaseUpdate ??verifyOnServer ??client ack (fallback if server ack failed)
 *   5. restore()             ??re-verify + client ack fallback for unacked purchases
 *
 * Web builds: every function is a no-op / returns empty. Only Capacitor
 * Android has Play Billing available.
 */
import { Capacitor } from '@capacitor/core';
import { Billing, BillingProductDetails, BillingPurchase } from '../native/billing-bridge';
import { get, post } from './api';

const PRODUCT_IDS = ['premium_monthly', 'premium_yearly'] as const;
export type MatheoProductId = (typeof PRODUCT_IDS)[number];

// Module-scope guards ??initBilling() is called from PaywallPage mount,
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
        const verified = await verifyOnServer(p);
        await acknowledgeIfNeeded(p, verified);
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

export function isFreeTrialOffer(offer: BillingProductDetails['offers'][number]): boolean {
  return offer.pricingPhases.some((phase) => phase.priceAmountMicros === '0');
}

/** Default launch policy: paid base-plan first, Play free-trial offers later.
 *
 * Google Play can return trial offers before base-plan offers. If we blindly
 * use offers[0], a Play Console trial switch can turn the primary CTA into
 * "0 today, auto-renew later" without a frontend review. Prefer the paid
 * base plan (`offerId === null`) and fall back to the first non-free offer.
 */
export function selectPaidOffer(product: BillingProductDetails) {
  return product.offers.find((offer) => !offer.offerId && !isFreeTrialOffer(offer))
    ?? product.offers.find((offer) => !isFreeTrialOffer(offer))
    ?? product.offers[0];
}

export function displayRecurringPhase(offer: BillingProductDetails['offers'][number]) {
  return offer.pricingPhases.find((phase) => phase.recurrenceMode === 1)
    ?? offer.pricingPhases.find((phase) => phase.priceAmountMicros !== '0')
    ?? offer.pricingPhases[0];
}

export async function buy(productId: string, offerToken: string): Promise<{ launched: boolean }> {
  await initBilling();
  let obfuscatedAccountId: string | undefined;
  try {
    const { obfuscatedAccountId: id } = await get<{ obfuscatedAccountId: string }>(
      '/billing/obfuscated-account-id',
    );
    obfuscatedAccountId = id;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('obfuscated account id unavailable — purchase proceeds without binding', e);
  }
  return Billing.launchBillingFlow({ productId, offerToken, obfuscatedAccountId });
}

export async function restore(): Promise<BillingPurchase[]> {
  if (!isBillingAvailable()) return [];
  await initBilling();
  const { purchases } = await Billing.restorePurchases();
  for (const p of purchases) {
    if (p.purchaseState !== 1) continue;
    try {
      const verified = await verifyOnServer(p);
      await acknowledgeIfNeeded(p, verified);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('restore verify failed', e);
    }
  }
  return purchases;
}

interface VerifyPurchaseResponse {
  status: string;
  expiryTime: string;
  isInIntroOfferPeriod: boolean;
  acknowledged: boolean;
  acknowledgedAt: string | null;
}

async function verifyOnServer(p: BillingPurchase): Promise<VerifyPurchaseResponse> {
  return post<VerifyPurchaseResponse>('/billing/verify', {
    productId: p.productId,
    purchaseToken: p.purchaseToken,
  });
}

/** Server ack is primary; client ack is fallback within Play's 3-day window. */
async function acknowledgeIfNeeded(
  p: BillingPurchase,
  verified: VerifyPurchaseResponse,
): Promise<void> {
  if (verified.acknowledged || p.acknowledged) return;
  await Billing.acknowledgePurchase({ purchaseToken: p.purchaseToken });
}

export interface BillingServerStatus {
  /** Runtime switch from GET /billing/status — see billing-flags.ts */
  billingUiEnabled?: boolean;
  premium: boolean;
  entitlement?: {
    premium: boolean;
    tier: 'FREE' | 'PREMIUM';
    source: 'PLAY' | 'PREVIEW' | null;
    preview: {
      active: boolean;
      startedAt: string | null;
      expiresAt: string | null;
      days: number;
    } | null;
    previewEligibility: {
      eligible: boolean;
      reason: string | null;
    };
  };
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
      inGrace?: boolean;
      graceEndsAt?: string | null;
    };
  };
  monetization?: {
    mode: string;
    free: { solverDailyLimit: number };
    premiumPreview: {
      productId: string;
      days: number;
      paymentMethodRequired: boolean;
      eligibility: string;
    };
    playTrialPolicy: {
      defaultSurface: string;
      note: string;
    };
  };
}

export async function getServerStatus(): Promise<BillingServerStatus> {
  return get<BillingServerStatus>('/billing/status');
}

export async function startPremiumPreview(): Promise<{
  premium: true;
  productId: string;
  expiryTime: string;
}> {
  return post('/billing/preview/start', {});
}
