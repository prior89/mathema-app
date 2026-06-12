import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Gauge,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBillingStatus } from '../hooks/useBillingStatus';
import { useBillingUiEnabled } from '../lib/billing-flags';
import { useT } from '../lib/i18n';
import { openPlaySubscriptionManage } from '../lib/play-subscription';
import '../styles/billing.css';

export function BillingPlanCard() {
  const navigate = useNavigate();
  const { t } = useT();
  const billingUi = useBillingUiEnabled();
  const billing = useBillingStatus();

  if (!billingUi) return null;

  const planSource = billing.data?.entitlement?.source;
  const subStatus = billing.data?.subscription?.status;
  // Play dunning states (India: failed UPI AutoPay lands here for ~5 days
  // before ON_HOLD). GRACE keeps entitlement, ON_HOLD suspends it — both
  // are fixed in Play's payment settings, not by re-purchasing.
  const inGrace = subStatus === 'GRACE';
  const onHold = subStatus === 'ON_HOLD';
  const expiryTime = billing.data?.subscription?.expiryTime;
  const expiryDate = expiryTime ? new Date(expiryTime).toLocaleDateString() : '';
  const solverQuota = billing.data?.quota?.solver;
  const premium = billing.data?.premium === true;
  const isPreview = premium && planSource === 'PREVIEW';
  const isPaid = premium && !isPreview;
  const isFree = !premium && !billing.isLoading && !billing.isError;

  const planTitle = billing.isLoading
    ? t('me.billing.loading.title')
    : billing.isError
      ? t('me.billing.error.title')
      : isPreview
        ? t('me.billing.preview.title')
        : isPaid
          ? t('me.billing.premium.title')
          : t('me.billing.free.title');

  const planSub = billing.isLoading
    ? t('me.billing.loading.sub')
    : billing.isError
      ? t('me.billing.error.sub')
      : isPreview
        ? expiryDate
          ? t('me.billing.preview.sub', { date: expiryDate })
          : t('me.billing.preview.subNoDate')
        : isPaid
          ? expiryDate
            ? t('me.billing.premium.sub', { date: expiryDate })
            : t('me.billing.premium.subNoDate')
          : solverQuota?.limit != null
            ? t('me.billing.free.sub', {
                used: solverQuota.used,
                limit: solverQuota.limit,
              })
            : t('me.billing.free.subUnknown');

  const usedRatio =
    isFree && solverQuota?.limit
      ? Math.min(1, (solverQuota.used || 0) / solverQuota.limit)
      : 0;

  const StatusIcon = billing.isError
    ? AlertCircle
    : isPaid
      ? CheckCircle2
      : isPreview
        ? Sparkles
        : Gauge;

  return (
    <>
      <div className="section-h">
        <span className="label">{t('me.billing.section')}</span>
      </div>
      <section className="billing-plan-panel" aria-label={planTitle}>
        <div className="billing-plan-panel-header">
          <span className="billing-plan-status">
            <StatusIcon size={15} />
            {isPaid
              ? t('me.billing.status.active')
              : isPreview
                ? t('me.billing.status.preview')
                : t('me.billing.status.free')}
          </span>
        </div>

        <h3>{planTitle}</h3>
        <p>{planSub}</p>

        {(inGrace || onHold) && (
          <div className="billing-payment-issue" role="alert">
            <AlertCircle size={15} />
            <span>
              {inGrace ? t('me.billing.grace.banner') : t('me.billing.hold.banner')}
            </span>
          </div>
        )}

        {isFree && solverQuota?.limit != null && solverQuota.limit > 0 && (
          <div
            className="billing-plan-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={solverQuota.limit}
            aria-valuenow={solverQuota.used}
          >
            <span style={{ width: `${usedRatio * 100}%` }} />
          </div>
        )}

        <div className="billing-plan-actions">
          {billing.isError ? (
            <button
              type="button"
              className="billing-plan-action secondary"
              onClick={() => void billing.refetch()}
            >
              <RotateCw size={16} />
              {t('me.billing.retry')}
            </button>
          ) : isPaid || onHold ? (
            <button
              type="button"
              className="billing-plan-action secondary"
              onClick={() =>
                openPlaySubscriptionManage(billing.data?.subscription?.productId)
              }
            >
              <ExternalLink size={16} />
              {inGrace || onHold ? t('me.billing.fixPayment') : t('me.billing.manage')}
            </button>
          ) : (
            <button
              type="button"
              className="billing-plan-action"
              onClick={() => navigate('/app/paywall')}
            >
              {isPreview ? t('me.billing.preview.upgrade') : t('me.billing.upgrade')}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </section>
    </>
  );
}
