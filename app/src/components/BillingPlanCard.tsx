/**
 * Me tab — plan / billing hero card. Gated by useBillingUiEnabled().
 */
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBillingStatus } from '../hooks/useBillingStatus';
import { useBillingUiEnabled } from '../lib/billing-flags';
import { useT } from '../lib/i18n';
import { openPlaySubscriptionManage } from '../lib/play-subscription';
import { Glyph } from './onboarding/Glyph';

export function BillingPlanCard() {
  const nav = useNavigate();
  const { t } = useT();
  const billingUi = useBillingUiEnabled();
  const billing = useBillingStatus();

  if (!billingUi) return null;

  const planSource = billing.data?.entitlement?.source;
  const expiryTime = billing.data?.subscription?.expiryTime;
  const expiryDate = expiryTime ? new Date(expiryTime).toLocaleDateString() : '';
  const solverQuota = billing.data?.quota?.solver;

  const planTitle = (() => {
    if (billing.isLoading) return t('me.billing.loading.title');
    if (billing.isError) return t('me.billing.error.title');
    if (billing.data?.premium && planSource === 'PREVIEW') return t('me.billing.preview.title');
    if (billing.data?.premium) return t('me.billing.premium.title');
    return t('me.billing.free.title');
  })();

  const planSub = (() => {
    if (billing.isLoading) return t('me.billing.loading.sub');
    if (billing.isError) return t('me.billing.error.sub');
    if (billing.data?.premium && planSource === 'PREVIEW') {
      return expiryDate
        ? t('me.billing.preview.sub', { date: expiryDate })
        : t('me.billing.preview.subNoDate');
    }
    if (billing.data?.premium) {
      return expiryDate
        ? t('me.billing.premium.sub', { date: expiryDate })
        : t('me.billing.premium.subNoDate');
    }
    if (solverQuota?.limit != null) {
      return t('me.billing.free.sub', {
        used: solverQuota.used,
        limit: solverQuota.limit,
      });
    }
    return t('me.billing.free.subUnknown');
  })();

  const premium = billing.data?.premium === true;
  const isPreview = premium && planSource === 'PREVIEW';
  const isPaid = premium && !isPreview;
  const isFree = !premium && !billing.isLoading && !billing.isError;

  const cardBg = isPaid
    ? 'linear-gradient(135deg, #065F46 0%, #047857 100%)'
    : isPreview
      ? '#ECFDF5'
      : 'var(--p-surface, #FFFFFF)';
  const cardBorder = isPaid
    ? 'none'
    : isPreview
      ? '1px solid #D1FAE5'
      : '1px solid var(--p-line, #E5E7EB)';
  const cardShadow = isPaid
    ? '0 8px 22px rgba(4, 120, 87, 0.22)'
    : '0 1px 2px rgba(0, 0, 0, 0.04)';
  const inkPrimary = isPaid ? '#FFFFFF' : isPreview ? '#064E3B' : 'var(--p-ink)';
  const inkMuted = isPaid
    ? 'rgba(255, 255, 255, 0.78)'
    : isPreview
      ? '#047857'
      : 'var(--p-muted)';
  const chipBg = isPaid
    ? 'rgba(255, 255, 255, 0.18)'
    : isPreview
      ? '#D1FAE5'
      : 'var(--p-primary-tint)';
  const chipInk = isPaid ? '#FFFFFF' : isPreview ? '#065F46' : 'var(--p-primary)';
  const chipLabel = isPaid
    ? 'PREMIUM'
    : isPreview
      ? 'PREVIEW'
      : isFree
        ? 'FREE'
        : billing.isLoading
          ? '···'
          : 'PLAN';

  const showProgress = isFree && solverQuota?.limit != null && solverQuota.limit > 0;
  const usedRatio = showProgress
    ? Math.min(1, (solverQuota!.used || 0) / (solverQuota!.limit || 1))
    : 0;
  const progressDanger = usedRatio >= 0.875;

  const goPaywall = () => nav('/app/paywall');
  const productId = billing.data?.subscription?.productId;
  const openManage = (e: MouseEvent) => {
    e.stopPropagation();
    openPlaySubscriptionManage(productId);
  };

  return (
    <>
      <div className="section-h">
        <span className="label">{t('me.billing.section')}</span>
      </div>
      <div
        onClick={isPaid ? undefined : goPaywall}
        role={isPaid ? undefined : 'button'}
        tabIndex={isPaid ? undefined : 0}
        onKeyDown={
          isPaid
            ? undefined
            : (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  goPaywall();
                }
              }
        }
        style={{
          background: cardBg,
          border: cardBorder,
          borderRadius: 18,
          padding: 18,
          cursor: isPaid ? 'default' : 'pointer',
          boxShadow: cardShadow,
          transition: 'transform 0.12s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 999,
              background: chipBg,
              color: chipInk,
            }}
          >
            {chipLabel}
          </span>
          <Glyph.ChevronR accent={isPaid ? 'rgba(255,255,255,0.7)' : 'var(--p-muted)'} size={16} />
        </div>

        <div style={{ fontSize: 19, fontWeight: 800, color: inkPrimary, lineHeight: 1.2 }}>
          {planTitle}
        </div>
        <div style={{ fontSize: 12.5, color: inkMuted, marginTop: 4, lineHeight: 1.45 }}>
          {planSub}
        </div>

        {showProgress && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                position: 'relative',
                height: 6,
                borderRadius: 999,
                background: 'var(--p-surface-2, #F3F4F6)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: `${usedRatio * 100}%`,
                  background: progressDanger
                    ? 'var(--p-danger, #DC2626)'
                    : 'var(--p-primary, #047857)',
                  transition: 'width 0.3s ease-out',
                }}
              />
            </div>
          </div>
        )}

        {isFree && (
          <div
            style={{
              marginTop: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--p-primary, #047857)',
              color: '#FFFFFF',
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            {t('me.billing.upgrade')}
            <Glyph.ChevronR accent="#FFFFFF" size={14} />
          </div>
        )}
        {isPreview && (
          <div style={{ marginTop: 12, fontSize: 12.5, color: '#047857', fontWeight: 700 }}>
            {t('me.billing.preview.upgradeHint')}
          </div>
        )}
        {isPaid && (
          <button
            type="button"
            onClick={openManage}
            style={{
              marginTop: 12,
              padding: 0,
              border: 0,
              background: 'transparent',
              fontSize: 12,
              color: 'rgba(255, 255, 255, 0.92)',
              fontWeight: 700,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {t('me.billing.manage')}
          </button>
        )}
      </div>
    </>
  );
}