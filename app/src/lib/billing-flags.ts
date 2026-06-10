/**
 * Billing UI feature switch.
 *
 * OFF by default (v1.0 free PoC). Turn ON via either:
 *   1. Server: BILLING_UI_ENABLED=true on the backend (runtime, no app rebuild)
 *   2. Build:  VITE_BILLING_ENABLED=true in CI / .env.production
 *
 * Server flag wins when /billing/status returns billingUiEnabled: true.
 */
import { useBillingStatus } from '../hooks/useBillingStatus';

export const BILLING_UI_CACHE_KEY = 'matheo.billingUiEnabled';

export function isBillingUiBuildEnabled(): boolean {
  return (import.meta as ImportMeta & { env?: { VITE_BILLING_ENABLED?: string } }).env
    ?.VITE_BILLING_ENABLED === 'true';
}

export function cacheBillingUiEnabled(enabled: boolean): void {
  try {
    sessionStorage.setItem(BILLING_UI_CACHE_KEY, enabled ? '1' : '0');
  } catch {
    /* ignore */
  }
}

/** Sync read for axios interceptors (no React). Falls back to build flag. */
export function readCachedBillingUiEnabled(): boolean {
  try {
    const v = sessionStorage.getItem(BILLING_UI_CACHE_KEY);
    if (v === '1') return true;
    if (v === '0') return false;
  } catch {
    /* ignore */
  }
  return isBillingUiBuildEnabled();
}

export function useBillingUiEnabled(): boolean {
  const { data } = useBillingStatus();
  if (data?.billingUiEnabled === true) return true;
  if (data?.billingUiEnabled === false) return isBillingUiBuildEnabled();
  return isBillingUiBuildEnabled();
}