/**
 * Unified Play purchase recovery pipeline (Wave 3).
 *
 * Single path for listener, restore, onResume, and cold-start sync:
 *   queryPurchases (or event payload) → POST /billing/verify → client ack fallback
 *
 * In-flight dedupe per purchaseToken + debounced full sync prevent duplicate verify.
 */
import { Capacitor } from '@capacitor/core';
import { Billing, BillingPurchase } from '../native/billing-bridge';
import { post } from './api';

export interface VerifyPurchaseResponse {
  status: string;
  expiryTime: string;
  isInIntroOfferPeriod: boolean;
  acknowledged: boolean;
  acknowledgedAt: string | null;
}

const inFlightTokens = new Set<string>();
let lastFullSyncAt = 0;
let fullSyncPromise: Promise<{ processed: number; purchases: BillingPurchase[] }> | null =
  null;

export const SYNC_DEBOUNCE_MS = 5_000;

export function isBillingPlatform(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

async function ensureBillingConnection(): Promise<boolean> {
  if (!isBillingPlatform()) return false;
  await Billing.initialize();
  return true;
}

async function acknowledgeIfNeeded(
  p: BillingPurchase,
  verified: VerifyPurchaseResponse,
): Promise<void> {
  if (verified.acknowledged || p.acknowledged) return;
  await Billing.acknowledgePurchase({ purchaseToken: p.purchaseToken });
}

/** Process one PURCHASED item through verify + ack fallback. */
export async function recoverPurchase(p: BillingPurchase): Promise<boolean> {
  if (!isBillingPlatform() || p.purchaseState !== 1) return false;
  if (inFlightTokens.has(p.purchaseToken)) return false;

  inFlightTokens.add(p.purchaseToken);
  try {
    const verified = await post<VerifyPurchaseResponse>('/billing/verify', {
      productId: p.productId,
      purchaseToken: p.purchaseToken,
    });
    await acknowledgeIfNeeded(p, verified);
    return true;
  } finally {
    inFlightTokens.delete(p.purchaseToken);
  }
}

/** queryPurchasesAsync + recover each active subscription (debounced unless force). */
export async function syncPlayPurchases(opts?: {
  force?: boolean;
}): Promise<{ processed: number; purchases: BillingPurchase[] }> {
  if (!(await ensureBillingConnection())) {
    return { processed: 0, purchases: [] };
  }

  const force = opts?.force === true;
  const now = Date.now();
  if (!force && now - lastFullSyncAt < SYNC_DEBOUNCE_MS) {
    return { processed: 0, purchases: [] };
  }

  if (fullSyncPromise) {
    return fullSyncPromise;
  }

  lastFullSyncAt = now;
  fullSyncPromise = (async () => {
    const { purchases } = await Billing.restorePurchases();
    let processed = 0;
    for (const p of purchases) {
      try {
        if (await recoverPurchase(p)) processed += 1;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('billing sync failed', e);
      }
    }
    return { processed, purchases };
  })();

  try {
    return await fullSyncPromise;
  } finally {
    fullSyncPromise = null;
  }
}

/** Test helper — reset module-scope sync guards. */
export function resetBillingRecoveryStateForTests(): void {
  inFlightTokens.clear();
  lastFullSyncAt = 0;
  fullSyncPromise = null;
}