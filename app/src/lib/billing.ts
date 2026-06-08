/**
 * Billing status helpers.
 *
 * v1.0 intentionally ships without the native Play Billing bridge or paywall
 * screen. The server-side /billing/status endpoint still owns Free-tier quota
 * and Premium Preview state, so QuotaMeter keeps using this module. Native
 * purchase helpers remain as no-op exports to keep Phase 2 re-introduction
 * cheap without pulling the deleted BillingPlugin back into the bundle.
 */
import { get, post } from './api';

const PRODUCT_IDS = ['premium_monthly', 'premium_yearly'] as const;
export type MatheoProductId = (typeof PRODUCT_IDS)[number];

export interface BillingPricingPhase {
  priceAmountMicros: string;
  recurrenceMode: number;
  formattedPrice?: string;
  billingPeriod?: string;
}

export interface BillingOffer {
  offerId: string | null;
  offerToken: string;
  pricingPhases: BillingPricingPhase[];
}

export interface BillingProductDetails {
  productId: string;
  title?: string;
  description?: string;
  offers: BillingOffer[];
}

export interface BillingPurchase {
  productId: string;
  purchaseToken: string;
  purchaseState: number;
  acknowledged: boolean;
}

export const isBillingAvailable = (): boolean => false;

export async function initBilling(): Promise<void> {
  // Native Play Billing is Phase 2. Keep this no-op for compatibility with
  // older call sites while v1.0 has no paywall surface.
}

export async function fetchProducts(): Promise<BillingProductDetails[]> {
  return [];
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
  void productId;
  void offerToken;
  return { launched: false };
}

export async function restore(): Promise<BillingPurchase[]> {
  return [];
}

export interface BillingServerStatus {
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
