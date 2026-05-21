/**
 * Capacitor bridge for the native BillingPlugin (Play Billing Library 7.x).
 *
 * Mirrors the Java surface in
 *   app/android/app/src/main/java/ai/matheo/app/BillingPlugin.java
 *
 * Subscriptions only — no one-time / consumable products. Acknowledge is
 * client-side AFTER our server /billing/verify returns 200; without that
 * Play auto-refunds within 3 days. The higher-level helpers in lib/billing.ts
 * wire all of this up; this file just types the raw plugin surface.
 */
import { registerPlugin, PluginListenerHandle } from '@capacitor/core';

export interface BillingProductOffer {
  offerToken: string;
  basePlanId: string;
  offerId: string | null;
  pricingPhases: Array<{
    /** Localised price string from Play (e.g. "₹499", "₩6,500"). */
    priceFormatted: string;
    /** Raw price * 1_000_000 as string (long won't fit JS number reliably). */
    priceAmountMicros: string;
    /** ISO 4217 currency code (e.g. INR, KRW). */
    currencyCode: string;
    /** ISO 8601 period — "P1M" monthly, "P1Y" yearly, "P1W" weekly, etc. */
    billingPeriod: string;
    /** 1 = INFINITE_RECURRING, 2 = FINITE_RECURRING, 3 = NON_RECURRING. */
    recurrenceMode: number;
    /** Number of billing cycles for FINITE_RECURRING; 0 otherwise. */
    billingCycleCount: number;
  }>;
}

export interface BillingProductDetails {
  productId: string;
  title: string;
  description: string;
  offers: BillingProductOffer[];
}

export interface BillingPurchase {
  /** First product in the purchase (always the one we care about for SUBS). */
  productId: string;
  productIds: string[];
  purchaseToken: string;
  orderId: string | null;
  /** 0 = UNSPECIFIED, 1 = PURCHASED, 2 = PENDING. */
  purchaseState: number;
  acknowledged: boolean;
  purchaseTimeMs: number;
}

export interface BillingPlugin {
  initialize(): Promise<{ ready: boolean }>;
  queryProductDetails(opts: { productIds: string[] }): Promise<{ products: BillingProductDetails[] }>;
  /** Resolves once the billing UI launches — actual result via 'purchaseUpdate'. */
  launchBillingFlow(opts: { productId: string; offerToken: string }): Promise<{ launched: boolean }>;
  /** Call AFTER server /billing/verify returns 200. */
  acknowledgePurchase(opts: { purchaseToken: string }): Promise<{ acknowledged: boolean }>;
  /** Active SUBS purchases for the current Google account. */
  restorePurchases(): Promise<{ purchases: BillingPurchase[] }>;
  addListener(
    event: 'purchaseUpdate',
    cb: (data: { purchases: BillingPurchase[] }) => void,
  ): Promise<PluginListenerHandle>;
  addListener(
    event: 'purchaseError',
    cb: (data: { responseCode: number; message: string }) => void,
  ): Promise<PluginListenerHandle>;
}

export const Billing = registerPlugin<BillingPlugin>('Billing');
