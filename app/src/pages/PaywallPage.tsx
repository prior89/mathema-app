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
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchProducts,
  buy,
  restore,
  getServerStatus,
  isBillingAvailable,
  initBilling,
  selectPaidOffer,
  displayRecurringPhase,
  startPremiumPreview,
} from '../lib/billing';
import { useT } from '../lib/i18n';
import { TabBar } from '../components/main/TabBar';

export default function PaywallPage() {
  const qc = useQueryClient();
  const { t } = useT();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [searchParams] = useSearchParams();
  // `?reason=quota` is set by the api.ts 403/QuotaExceeded interceptor.
  // It only changes the headline banner — the rest of the page (products,
  // restore link, premium gate) stays identical. We deliberately read the
  // status quota object so we can show the actual numeric limit instead of
  // hardcoding "8" — keeps the UI honest if backend defaults change.
  const reason = searchParams.get('reason');

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

  const quotaLimit = status.data?.quota?.solver?.limit ?? 8;
  const previewEligibility = status.data?.entitlement?.previewEligibility;
  const previewEligible = !!previewEligibility?.eligible;
  const previewLoading = status.isLoading && !status.data;
  const previewDays = status.data?.monetization?.premiumPreview?.days ?? 3;
  const isAndroidBilling = isBillingAvailable();

  // Header strip: a back button so paywall always has an explicit exit.
  // Without it the "already Premium / Preview active" branch is a dead-end —
  // the user has no way back to the rest of the app from inside Capacitor.
  const header = (
    <div style={{ padding: '14px 18px 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        type="button"
        onClick={() => nav(-1)}
        aria-label={t('paywall.back')}
        style={{
          background: 'transparent',
          border: 0,
          padding: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M 15 6 L 9 12 L 15 18"
            fill="none"
            stroke="var(--p-ink)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );

  if (status.data?.premium) {
    const isPreview = status.data.entitlement?.source === 'PREVIEW';
    const expiryTime = status.data.subscription?.expiryTime;
    return (
      <div className="screen">
        <div style={{ flex: 1, overflow: 'auto' }}>
          {header}
          <div style={{ padding: 32, textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>
              {isPreview ? t('paywall.preview.activeTitle') : t('paywall.already')}
            </h2>
            {expiryTime && (
              <p style={{ color: '#6B7280', marginTop: 8 }}>
                {isPreview
                  ? t('paywall.previewEndsAt', { date: new Date(expiryTime).toLocaleDateString() })
                  : t('paywall.renewAt', { date: new Date(expiryTime).toLocaleDateString() })}
              </p>
            )}
          </div>
        </div>
        <TabBar />
      </div>
    );
  }

  const renderProduct = (productId: string, label: string, periodLabel: string) => {
    const prod = products.data?.find((p) => p.productId === productId);
    const offer = prod ? selectPaidOffer(prod) : undefined;
    const phase = offer ? displayRecurringPhase(offer) : undefined;
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
          {t('paywall.subscribe')}
        </button>
      </div>
    );
  };

  return (
    <div className="screen">
      <div style={{ flex: 1, overflow: 'auto' }}>
        {header}
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 24px 24px' }}>
          {reason === 'quota' && (
        <div
          style={{
            background: 'var(--p-danger-tint, #FEF2F2)',
            border: '1px solid var(--p-danger, #DC2626)',
            color: 'var(--p-danger, #B91C1C)',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            {t('paywall.quotaBanner.title')}
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
            {t('paywall.quotaBanner.desc', { limit: quotaLimit })}
          </div>
        </div>
      )}
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{t('paywall.title')}</h1>
      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
        {t('paywall.tagline')}
      </p>

      <div
        style={{
          border: '1px solid #D1FAE5',
          background: '#ECFDF5',
          borderRadius: 16,
          padding: 18,
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 6px' }}>
          {t('paywall.preview.title')}
        </h2>
        <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.5, margin: '0 0 12px' }}>
          {t('paywall.preview.desc', { days: previewDays })}
        </p>
        {previewLoading ? (
          <div style={{ fontSize: 12.5, color: '#047857', fontWeight: 700 }}>
            {t('paywall.preview.loading')}
          </div>
        ) : previewEligible ? (
          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await startPremiumPreview();
                await qc.invalidateQueries({ queryKey: ['billing-status'] });
              } finally {
                setBusy(false);
              }
            }}
            style={{
              background: '#065F46',
              color: '#fff',
              border: 0,
              borderRadius: 12,
              padding: '11px 16px',
              fontWeight: 800,
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.6 : 1,
            }}
          >
            {t('paywall.preview.cta')}
          </button>
        ) : (
          <div style={{ fontSize: 12.5, color: '#047857', fontWeight: 700 }}>
            {previewEligibility?.reason === 'subscription_history_exists'
              ? t('paywall.preview.notAvailable')
              : t('paywall.preview.used')}
          </div>
        )}
      </div>

      {!isAndroidBilling && (
        <div
          style={{
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            color: '#4B5563',
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {t('paywall.androidOnly')}
        </div>
      )}

      {isAndroidBilling && products.isLoading && <div style={{ padding: 24 }}>{t('paywall.loading')}</div>}
      {isAndroidBilling && products.isError && (
        <div style={{ padding: 16, color: '#B91C1C' }}>
          {t('paywall.loadFailed')}
        </div>
      )}

      {isAndroidBilling && renderProduct('premium_monthly', t('paywall.monthly'), t('paywall.monthly.per'))}
      {isAndroidBilling && renderProduct('premium_yearly', t('paywall.yearly'), t('paywall.yearly.per'))}

      {isAndroidBilling && (
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
          {t('paywall.restore')}
        </button>
      )}
        </div>
      </div>
      <TabBar />
    </div>
  );
}
