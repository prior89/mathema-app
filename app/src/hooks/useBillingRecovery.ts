/**
 * Android billing recovery on app resume and post-login startup.
 *
 * Play docs: re-query purchases when the app returns to foreground so we
 * never miss a verify/ack after process kill or Play UI handoff.
 */
import { App } from '@capacitor/app';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { initBilling, isBillingAvailable } from '../lib/billing';
import { syncPlayPurchases } from '../lib/billing-recovery';
import { useBillingUiEnabled } from '../lib/billing-flags';

export function useBillingRecovery(): void {
  const { user, ready } = useAuth();
  const billingUi = useBillingUiEnabled();
  const qc = useQueryClient();

  useEffect(() => {
    if (!ready || !user || !billingUi || !isBillingAvailable()) return;

    let cancelled = false;

    const runSync = async (force: boolean) => {
      await initBilling();
      const { processed } = await syncPlayPurchases({ force });
      if (!cancelled && processed > 0) {
        void qc.invalidateQueries({ queryKey: ['billing-status'] });
      }
    };

    void runSync(false);

    const listenerPromise = App.addListener('resume', () => {
      void runSync(true);
    });

    return () => {
      cancelled = true;
      void listenerPromise.then((handle) => handle.remove());
    };
  }, [ready, user?.id, billingUi, qc]);
}