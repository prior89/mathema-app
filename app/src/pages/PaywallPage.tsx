/* PaywallPage — Matheo Premium purchase flow.
 *
 * Region-aware: prices come from Google Play SkuDetails (BillingProductDetails),
 * never hardcoded. On non-Android builds (web preview, iOS later) renders a
 * "Android only" notice.
 *
 * Flow: mount → initBilling listeners attach → queryProductDetails →
 *   user taps Subscribe → buy() launches Play UI → purchaseUpdate listener
 *   calls /billing/verify → acknowledgePurchase. Server status refetch then
 *   flips this page to "already Premium" on next render.
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  fetchProducts,
  buy,
  restore,
  getServerStatus,
  isBillingAvailable,
  initBilling,
} from '../lib/billing';

export default function PaywallPage() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  // Attach listeners on mount so the first purchaseUpdate after buy() lands.
  useEffect(() => {
    void initBilling();
  }, []);

  const products = useQuery({
    queryKey: ['billing-products'],
    queryFn: fetchProducts,
    enabled: isBillingAvailable(),
    staleTime: 5 * 60 * 1000,
  });

  const status = useQuery({
    queryKey: ['billing-status'],
    queryFn: getServerStatus,
    // Re-fetch when window regains focus — covers the case where the user
    // came back from Play after a successful purchase.
    refetchOnWindowFocus: true,
  });

  if (!isBillingAvailable()) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        Premium subscriptions are available in the Matheo Android app only.
      </div>
    );
  }

  if (status.data?.premium) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>You're already Premium</h2>
        {status.data.subscription?.expiryTime && (
          <p style={{ color: '#6B7280', marginTop: 8 }}>
            Renews on {new Date(status.data.subscription.expiryTime).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  const renderProduct = (productId: string, label: string, periodLabel: string) => {
    const prod = products.data?.find((p) => p.productId === productId);
    const offer = prod?.offers[0];
    const phase = offer?.pricingPhases[0];
    if (!prod || !offer || !phase) return null;
    return (
      <div
        key={productId}
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          padding: 20,
          marginBottom: 14,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{label}</h3>
        <p style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          {phase.priceFormatted}
          <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
            {' '}
            / {periodLabel}
          </span>
        </p>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await buy(productId, offer.offerToken);
              // launchBillingFlow resolves once UI is up — actual purchase
              // completes via listener. Refetch status shortly after to pick
              // up the new entitlement once verify+ack runs.
              setTimeout(() => {
                qc.invalidateQueries({ queryKey: ['billing-status'] });
              }, 3000);
            } finally {
              setBusy(false);
            }
          }}
          style={{
            marginTop: 12,
            background: '#047857',
            color: '#fff',
            border: 0,
            borderRadius: 12,
            padding: '12px 22px',
            fontWeight: 700,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          Subscribe
        </button>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Matheo Premium</h1>
      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
        Unlimited problems · AI explanations · Mistake analysis · Weekly reports
      </p>

      {products.isLoading && <div style={{ padding: 24 }}>Loading prices...</div>}
      {products.isError && (
        <div style={{ padding: 16, color: '#B91C1C' }}>
          Could not load prices. Please try again.
        </div>
      )}

      {renderProduct('premium_monthly', 'Monthly', 'month')}
      {renderProduct('premium_yearly', 'Yearly', 'year')}

      <button
        onClick={async () => {
          setBusy(true);
          try {
            await restore();
            await qc.invalidateQueries({ queryKey: ['billing-status'] });
          } finally {
            setBusy(false);
          }
        }}
        disabled={busy}
        style={{
          marginTop: 14,
          background: 'transparent',
          border: 0,
          color: '#2563EB',
          textDecoration: 'underline',
          fontSize: 13,
          cursor: busy ? 'not-allowed' : 'pointer',
        }}
      >
        Already purchased? Restore
      </button>
    </div>
  );
}
