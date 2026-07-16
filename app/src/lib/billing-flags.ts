/**
 * Billing UI feature switch.
 *
 * Two gates (both must pass):
 *   1. Build:  VITE_BILLING_ENABLED=true — this binary includes paywall UI
 *   2. Server: BILLING_UI_ENABLED=true  — runtime kill switch from /billing/status
 *
 * Fail-closed: until /billing/status resolves, billing UI stays hidden.
 */
import { useBillingStatus } from '../hooks/useBillingStatus';

export const BILLING_UI_CACHE_KEY = 'matheo.billingUiEnabled';

export function isBillingUiBuildEnabled(): boolean {
  return (import.meta as ImportMeta & { env?: { VITE_BILLING_ENABLED?: string } }).env
    ?.VITE_BILLING_ENABLED === 'true';
}

/** Pure resolver — unit-tested. */
export function resolveBillingUiEnabled(
  serverFlag: boolean | undefined,
  buildEnabled: boolean,
  statusKnown: boolean,
): boolean {
  if (!buildEnabled) return false;
  if (!statusKnown) return false;
  return serverFlag === true;
}

export function cacheBillingUiEnabled(enabled: boolean): void {
  try {
    sessionStorage.setItem(BILLING_UI_CACHE_KEY, enabled ? '1' : '0');
  } catch {
    /* ignore */
  }
}

/** Sync read for axios interceptors (no React). Fail-closed when cache empty. */
export function readCachedBillingUiEnabled(): boolean {
  try {
    const v = sessionStorage.getItem(BILLING_UI_CACHE_KEY);
    if (v === '1') return true;
    if (v === '0') return false;
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * The purchase screen belongs to the student app shell. Parent and teacher
 * dashboards can receive PremiumRequired for a linked student's account, but
 * sending those roles to /app/paywall is both misleading and blocked by route
 * role guards. Keep them on their dashboard so it can render its query error.
 */
export function canRedirectToStudentPaywall(pathname: string): boolean {
  return pathname === '/app' || pathname.startsWith('/app/');
}

/** Handles both Nest's direct payload and the app's wrapped error envelope. */
export function isPremiumRequiredError(error: unknown): boolean {
  const data = (error as any)?.response?.data;
  const body = data?.error;
  const code =
    (typeof body === 'string' ? body : undefined)
    ?? body?.code
    ?? body?.error
    ?? data?.code;
  return code === 'PremiumRequired';
}

export function useBillingUiEnabled(): boolean {
  const { data, isFetched } = useBillingStatus();
  return resolveBillingUiEnabled(
    data?.billingUiEnabled,
    isBillingUiBuildEnabled(),
    isFetched,
  );
}
