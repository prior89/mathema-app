/**
 * Higher-level billing helpers that wrap the raw BillingPlugin bridge.
 *
 * Lifecycle:
 *   1. initBilling()         — startConnection + idempotent listener attach
 *   2. fetchProducts()       — Play SkuDetails (region-aware, no hardcoded prices)
 *   3. buy(prod, offerToken) — launches billing flow; result via listener
 *   4. listener:purchaseUpdate — recoverPurchase() unified pipeline
 *   5. restore() / onResume  — syncPlayPurchases() (see billing-recovery.ts)
 *
 * Web builds: every function is a no-op / returns empty. Only Capacitor
 * Android has Play Billing available.
 */
import { Capacitor } from '@capacitor/core';
import { Billing, BillingProductDetails, BillingPurchase } from '../native/billing-bridge';
import { recoverPurchase, syncPlayPurchases } from './billing-recovery';
import { get, post } from './api';

const PRODUCT_IDS = ['premium_monthly', 'premium_yearly'] as const;
export type MatheoProductId = (typeof PRODUCT_IDS)[number];

let billingReady = false;
let listenersAttached = false;

export const isBillingAvailable = (): boolean =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';

export type BillingPurchaseEvent = { purchaseState: number };
export type BillingErrorEvent = { responseCode: number; message: string };

function emitBillingEvent(
  name: 'matheo:billing-purchase' | 'matheo:billing-error',
  detail: BillingPurchaseEvent | BillingErrorEvent,
): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export async function initBilling(): Promise<void> {
  if (!isBillingAvailable()) return;
  if (!billingReady) {
    await Billing.initialize();
    billingReady = true;
  }
  if (listenersAttached) return;
  await Billing.addListener('purchaseUpdate', async ({ purchases }) => {
    for (const p of purchases) {
      try {
        await recoverPurchase(p);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('billing verify/ack failed', e);
      }
      // Surface the real outcome to any open paywall so it can confirm success
      // (PURCHASED) or explain a deferred payment (PENDING) — the buy() promise
      // only reports that the Play sheet opened, not what the user then did.
      emitBillingEvent('matheo:billing-purchase', { purchaseState: p.purchaseState });
    }
  });
  await Billing.addListener('purchaseError', ({ responseCode, message }) => {
    // eslint-disable-next-line no-console
    console.warn('Billing error', responseCode, message);
    // Feed cancellation / already-owned / failure back to the paywall notice
    // instead of leaving the "complete your purchase" banner up (misleading).
    emitBillingEvent('matheo:billing-error', { responseCode, message });
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

function firstPhasePriceMicros(offer: BillingProductDetails['offers'][number]): number {
  const raw = offer.pricingPhases[0]?.priceAmountMicros ?? '0';
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

export function selectPaidOffer(product: BillingProductDetails) {
  const paid = product.offers.filter((offer) => !isFreeTrialOffer(offer));
  // Prefer a promotional offer (non-empty offerId). Play only returns offers the
  // current user is *eligible* for, so a launch/intro offer present in this list
  // is valid and applies its discounted price; among several, take the cheapest
  // first phase. Fall back to the bare base plan (empty offerId) when no promo is
  // offered — so behaviour is unchanged when no launch offer is configured.
  // NOTE: this deliberately inverts the old "base plan first" order, which meant
  // the launch promo offerToken was never passed and users paid full price.
  const promos = paid.filter((offer) => Boolean(offer.offerId));
  if (promos.length > 0) {
    return promos.reduce((best, offer) =>
      firstPhasePriceMicros(offer) < firstPhasePriceMicros(best) ? offer : best,
    );
  }
  return paid.find((offer) => !offer.offerId) ?? paid[0] ?? product.offers[0];
}

/** The base (post-promo) recurring price to disclose — the infinite recurring phase. */
export function displayRecurringPhase(offer: BillingProductDetails['offers'][number]) {
  return offer.pricingPhases.find((phase) => phase.recurrenceMode === 1)
    ?? offer.pricingPhases.find((phase) => phase.priceAmountMicros !== '0')
    ?? offer.pricingPhases[0];
}

/**
 * The promotional pricing phase to advertise: the first phase that is neither the
 * infinite base recurring phase (recurrenceMode === 1) nor a free-trial (0-price)
 * phase. Returns null for a plain base plan with no promo. Pair with
 * `displayRecurringPhase` to show "{promo} for {duration}, then {base}/{period}".
 */
export function introPhase(offer: BillingProductDetails['offers'][number]) {
  return (
    offer.pricingPhases.find(
      (phase) => phase.recurrenceMode !== 1 && phase.priceAmountMicros !== '0',
    ) ?? null
  );
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
  const { purchases } = await syncPlayPurchases({ force: true });
  return purchases;
}

export interface BillingServerStatus {
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