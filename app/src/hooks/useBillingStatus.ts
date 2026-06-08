/**
 * useBillingStatus — React Query wrapper around GET /billing/status.
 *
 * Returns both the premium flag and the Phase 5 server-side AI Solver quota
 * (Free: 8/day, Premium: unlimited). Used by QuotaMeter and any
 * UI surface that needs to render a meter or a "Premium" CTA inline.
 *
 * Cache policy:
 *   - staleTime 30s: quota changes only when the user calls /math-helper/solve
 *     or /ocr-solve, and Phase 5 server-side already invalidates the
 *     ['billing-status'] cache after a 403; 30s strikes a balance between
 *     showing fresh counts and avoiding a request flood on every render.
 *   - refetchOnWindowFocus: needed for the "user came back from Play after a
 *     Premium Preview or future purchase flow changes entitlement.
 *   - refetchInterval 60s: while the user is staring at the Study tab without
 *     interacting, refresh the counter so a friend on a shared device or a
 *     concurrent web tab eventually agrees.
 *
 * Keep this key stable so any future entitlement screen can cross-share cache
 * hits with the inline quota meter.
 */
import { useQuery } from '@tanstack/react-query';
import { getServerStatus, BillingServerStatus } from '../lib/billing';

export type BillingStatusData = BillingServerStatus;

export function useBillingStatus() {
  return useQuery<BillingStatusData>({
    queryKey: ['billing-status'],
    queryFn: getServerStatus,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });
}
