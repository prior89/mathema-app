import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  BookOpenCheck,
  Brain,
  Check,
  ChevronLeft,
  CircleAlert,
  ExternalLink,
  FileSearch,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  annualSavingsPercent,
  monthlyEquivalent,
  perDayPrice,
} from '../lib/billing-pricing';
import { useBillingUiEnabled } from '../lib/billing-flags';
import {
  buy,
  displayRecurringPhase,
  fetchProducts,
  getServerStatus,
  initBilling,
  isBillingAvailable,
  restore,
  selectPaidOffer,
  startPremiumPreview,
} from '../lib/billing';
import { useT } from '../lib/i18n';
import { openPlaySubscriptionManage } from '../lib/play-subscription';
import type { BillingProductDetails } from '../native/billing-bridge';
import type { TranslationKey } from '../lib/translations';
import '../styles/billing.css';

const PREMIUM_FEATURE_KEYS: Record<string, TranslationKey> = {
  weekly_reports: 'paywall.premiumBanner.feature.weekly_reports',
  adaptive_practice: 'paywall.premiumBanner.feature.adaptive_practice',
  wrong_note_analysis: 'paywall.premiumBanner.feature.wrong_note_analysis',
  full_mastery_sets: 'paywall.premiumBanner.feature.full_mastery_sets',
};

const BENEFITS: Array<{
  key: TranslationKey;
  Icon: typeof Brain;
  tone: string;
}> = [
  { key: 'paywall.benefit.adaptive', Icon: Brain, tone: 'var(--p-primary)' },
  { key: 'paywall.benefit.mastery', Icon: BookOpenCheck, tone: 'var(--p-accent-ink)' },
  { key: 'paywall.benefit.wrongNote', Icon: FileSearch, tone: 'var(--p-step-pictorial-accent)' },
  { key: 'paywall.benefit.report', Icon: BarChart3, tone: 'var(--p-success)' },
];

type ProductId = 'premium_monthly' | 'premium_yearly';
type BusyAction = ProductId | 'preview' | 'restore' | null;
type Notice = { tone: 'success' | 'error' | 'info'; text: string } | null;

type PlanView = {
  productId: ProductId;
  product: BillingProductDetails;
  offer: ReturnType<typeof selectPaidOffer>;
  phase: NonNullable<ReturnType<typeof displayRecurringPhase>>;
};

function getPlan(
  products: BillingProductDetails[] | undefined,
  productId: ProductId,
): PlanView | null {
  const product = products?.find((item) => item.productId === productId);
  const offer = product ? selectPaidOffer(product) : undefined;
  const phase = offer ? displayRecurringPhase(offer) : undefined;
  if (!product || !offer || !phase) return null;
  return { productId, product, offer, phase };
}

export default function PaywallPage() {
  const billingUi = useBillingUiEnabled();
  const queryClient = useQueryClient();
  const { t, lang } = useT();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedProductId, setSelectedProductId] = useState<ProductId>('premium_yearly');
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const reason = searchParams.get('reason');
  const premiumFeature = searchParams.get('feature');
  const isAndroidBilling = isBillingAvailable();

  useEffect(() => {
    void initBilling();
  }, []);

  const products = useQuery({
    queryKey: ['billing-products'],
    queryFn: fetchProducts,
    enabled: isAndroidBilling,
    staleTime: 5 * 60 * 1000,
  });

  const status = useQuery({
    queryKey: ['billing-status'],
    queryFn: getServerStatus,
    refetchOnWindowFocus: true,
  });

  const monthlyPlan = useMemo(
    () => getPlan(products.data, 'premium_monthly'),
    [products.data],
  );
  const yearlyPlan = useMemo(
    () => getPlan(products.data, 'premium_yearly'),
    [products.data],
  );
  const selectedPlan = selectedProductId === 'premium_yearly' ? yearlyPlan : monthlyPlan;

  useEffect(() => {
    if (selectedProductId === 'premium_yearly' && !yearlyPlan && monthlyPlan) {
      setSelectedProductId('premium_monthly');
    }
  }, [monthlyPlan, selectedProductId, yearlyPlan]);

  if (!billingUi) return <Navigate to="/app" replace />;

  const locale = lang === 'ko' ? 'ko-KR' : lang === 'hi' ? 'hi-IN' : 'en-US';
  const quotaLimit = status.data?.quota?.solver?.limit ?? 8;
  const previewEligibility = status.data?.entitlement?.previewEligibility;
  const previewEligible = previewEligibility?.eligible === true;
  const previewLoading = status.isLoading && !status.data;
  const previewDays = status.data?.monetization?.premiumPreview?.days ?? 3;
  const isPreviewActive =
    status.data?.premium === true && status.data.entitlement?.source === 'PREVIEW';
  const isPaidPremium =
    status.data?.premium === true && status.data.entitlement?.source === 'PLAY';

  const yearlyEquivalent = yearlyPlan
    ? monthlyEquivalent(
        yearlyPlan.phase.priceAmountMicros,
        yearlyPlan.phase.currencyCode,
        locale,
      )
    : null;
  const yearlySaving =
    monthlyPlan && yearlyPlan
      ? annualSavingsPercent(
          monthlyPlan.phase.priceAmountMicros,
          yearlyPlan.phase.priceAmountMicros,
        )
      : null;
  const yearlyPerDay = yearlyPlan
    ? perDayPrice(
        yearlyPlan.phase.priceAmountMicros,
        yearlyPlan.phase.currencyCode,
        locale,
      )
    : null;

  const closePaywall = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/app');
  };

  const runPurchase = async () => {
    if (!selectedPlan || busyAction) return;
    setNotice(null);
    setBusyAction(selectedPlan.productId);
    try {
      await buy(selectedPlan.productId, selectedPlan.offer.offerToken);
      setNotice({ tone: 'info', text: t('paywall.purchase.opened') });
      window.setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: ['billing-status'] });
      }, 3000);
    } catch {
      setNotice({ tone: 'error', text: t('paywall.purchase.failed') });
    } finally {
      setBusyAction(null);
    }
  };

  const runPreview = async () => {
    if (busyAction) return;
    setNotice(null);
    setBusyAction('preview');
    try {
      await startPremiumPreview();
      await queryClient.invalidateQueries({ queryKey: ['billing-status'] });
      setNotice({ tone: 'success', text: t('paywall.preview.started') });
    } catch {
      setNotice({ tone: 'error', text: t('paywall.preview.failed') });
    } finally {
      setBusyAction(null);
    }
  };

  const runRestore = async () => {
    if (busyAction) return;
    setNotice(null);
    setBusyAction('restore');
    try {
      const restored = await restore();
      await queryClient.invalidateQueries({ queryKey: ['billing-status'] });
      setNotice({
        tone: restored.length > 0 ? 'success' : 'info',
        text: restored.length > 0 ? t('paywall.restore.success') : t('paywall.restore.empty'),
      });
    } catch {
      setNotice({ tone: 'error', text: t('paywall.restore.failed') });
    } finally {
      setBusyAction(null);
    }
  };

  if (isPaidPremium) {
    const expiryTime = status.data?.subscription?.expiryTime;
    const productId = status.data?.subscription?.productId;
    const autoRenewing = status.data?.subscription?.autoRenewing === true;
    const inGrace = status.data?.subscription?.status === 'GRACE';
    const planLabel =
      productId === 'premium_yearly' ? t('paywall.yearly') : t('paywall.monthly');

    return (
      <div className="screen paywall-screen">
        <header className="paywall-topbar">
          <button type="button" className="paywall-icon-button" onClick={closePaywall} aria-label={t('paywall.back')}>
            <X size={21} />
          </button>
          <span>{t('paywall.title')}</span>
          <span className="paywall-topbar-spacer" />
        </header>

        <main className="paywall-member">
          <div className="paywall-member-mark" aria-hidden="true">
            <Check size={28} strokeWidth={2.5} />
          </div>
          <div className="paywall-status-chip">{t('paywall.member.active')}</div>
          <h1>{t('paywall.already')}</h1>
          <p>{t('paywall.member.plan', { plan: planLabel })}</p>

          {inGrace && (
            <div className="paywall-context-notice" role="alert">
              <CircleAlert size={18} />
              <div>
                <strong>{t('me.billing.grace.banner')}</strong>
              </div>
            </div>
          )}

          <dl className="paywall-subscription-summary">
            <div>
              <dt>{t('paywall.member.status')}</dt>
              <dd>
                {autoRenewing
                  ? t('paywall.member.renewing')
                  : t('paywall.member.endsAfterPeriod')}
              </dd>
            </div>
            {expiryTime && (
              <div>
                <dt>
                  {autoRenewing
                    ? t('paywall.member.nextBilling')
                    : t('paywall.member.accessUntil')}
                </dt>
                <dd>{new Date(expiryTime).toLocaleDateString(locale)}</dd>
              </div>
            )}
          </dl>

          <button
            type="button"
            className="paywall-primary-button"
            onClick={() => navigate('/app')}
          >
            <ChevronLeft size={18} />
            {t('paywall.member.continue')}
          </button>
          <button
            type="button"
            className="paywall-secondary-button"
            onClick={() => openPlaySubscriptionManage(productId)}
          >
            <ExternalLink size={17} />
            {t('paywall.manageSubscription')}
          </button>
          <p className="paywall-member-help">{t('paywall.member.manageHint')}</p>
        </main>
      </div>
    );
  }

  const selectedPrice = selectedPlan?.phase.priceFormatted;
  const selectedPeriod =
    selectedProductId === 'premium_yearly'
      ? t('paywall.yearly.per')
      : t('paywall.monthly.per');
  const purchaseLabel =
    selectedProductId === 'premium_yearly'
      ? t('paywall.cta.yearly')
      : t('paywall.cta.monthly');

  return (
    <div className="screen paywall-screen">
      <header className="paywall-topbar">
        <button type="button" className="paywall-icon-button" onClick={closePaywall} aria-label={t('paywall.back')}>
          <X size={21} />
        </button>
        <span>{t('paywall.title')}</span>
        <span className="paywall-topbar-spacer" />
      </header>

      <div className="paywall-scroll">
        <main className="paywall-content">
          {status.data?.subscription?.status === 'ON_HOLD' && (
            <div className="paywall-context-notice" role="alert">
              <CircleAlert size={18} />
              <div>
                <strong>{t('me.billing.hold.banner')}</strong>
                <button
                  type="button"
                  className="paywall-text-button"
                  style={{ padding: 0, marginTop: 4 }}
                  onClick={() =>
                    openPlaySubscriptionManage(status.data?.subscription?.productId ?? null)
                  }
                >
                  <ExternalLink size={14} />
                  {t('me.billing.fixPayment')}
                </button>
              </div>
            </div>
          )}

          {reason === 'quota' && (
            <div className="paywall-context-notice" role="status">
              <CircleAlert size={18} />
              <div>
                <strong>{t('paywall.quotaBanner.title')}</strong>
                <span>{t('paywall.quotaBanner.desc', { limit: quotaLimit })}</span>
              </div>
            </div>
          )}

          {reason === 'premium' && (
            <div className="paywall-context-notice" role="status">
              <Sparkles size={18} />
              <div>
                <strong>{t('paywall.premiumBanner.title')}</strong>
                <span>
                  {premiumFeature && PREMIUM_FEATURE_KEYS[premiumFeature]
                    ? t(PREMIUM_FEATURE_KEYS[premiumFeature])
                    : t('paywall.premiumBanner.desc')}
                </span>
              </div>
            </div>
          )}

          <section className="paywall-intro">
            <span className="paywall-eyebrow">{t('paywall.eyebrow')}</span>
            <h1>{t('paywall.headline')}</h1>
            <p>{t('paywall.tagline')}</p>
          </section>

          <section className="paywall-benefits" aria-labelledby="paywall-benefits-title">
            <h2 id="paywall-benefits-title">{t('paywall.benefits.title')}</h2>
            <div className="paywall-benefit-list">
              {BENEFITS.map(({ key, Icon, tone }) => (
                <div className="paywall-benefit" key={key}>
                  <span className="paywall-benefit-icon" style={{ color: tone }}>
                    <Icon size={18} />
                  </span>
                  <span>{t(key)}</span>
                  <Check size={17} className="paywall-benefit-check" />
                </div>
              ))}
            </div>
          </section>

          {isPreviewActive ? (
            <section className="paywall-preview-band paywall-preview-active">
              <div className="paywall-preview-icon">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="paywall-preview-label">{t('paywall.preview.activeLabel')}</span>
                <h2>{t('paywall.preview.activeTitle')}</h2>
                <p>
                  {status.data?.subscription?.expiryTime
                    ? t('paywall.previewEndsAt', {
                        date: new Date(status.data.subscription.expiryTime).toLocaleDateString(locale),
                      })
                    : t('paywall.preview.activeNoDate')}
                </p>
              </div>
            </section>
          ) : (
            <section className="paywall-preview-band">
              <div className="paywall-preview-icon">
                <Sparkles size={20} />
              </div>
              <div className="paywall-preview-copy">
                <span className="paywall-preview-label">{t('paywall.preview.eyebrow')}</span>
                <h2>{t('paywall.preview.choiceTitle', { days: previewDays })}</h2>
                <p>{t('paywall.preview.choiceDesc')}</p>
                {previewLoading ? (
                  <span className="paywall-inline-status">{t('paywall.preview.loading')}</span>
                ) : previewEligible ? (
                  <button
                    type="button"
                    className="paywall-preview-button"
                    onClick={runPreview}
                    disabled={busyAction !== null}
                  >
                    <Sparkles size={16} />
                    {busyAction === 'preview'
                      ? t('paywall.preview.starting')
                      : t('paywall.preview.cta', { days: previewDays })}
                  </button>
                ) : (
                  <span className="paywall-inline-status">
                    {previewEligibility?.reason === 'subscription_history_exists'
                      ? t('paywall.preview.notAvailable')
                      : t('paywall.preview.used')}
                  </span>
                )}
              </div>
            </section>
          )}

          <section className="paywall-plans" aria-labelledby="paywall-plan-title">
            <div className="paywall-section-heading">
              <span>{t('paywall.step.plan')}</span>
              <h2 id="paywall-plan-title">{t('paywall.plan.title')}</h2>
              <p>{t('paywall.plan.subtitle')}</p>
            </div>

            {!isAndroidBilling && (
              <div className="paywall-platform-notice">
                <ShieldCheck size={19} />
                <span>{t('paywall.androidOnly')}</span>
              </div>
            )}

            {isAndroidBilling && products.isLoading && (
              <div className="paywall-loading">{t('paywall.loading')}</div>
            )}

            {isAndroidBilling && products.isError && (
              <div className="paywall-load-error">
                <CircleAlert size={18} />
                <span>{t('paywall.loadFailed')}</span>
                <button type="button" onClick={() => void products.refetch()}>
                  {t('paywall.retry')}
                </button>
              </div>
            )}

            {isAndroidBilling && (yearlyPlan || monthlyPlan) && (
              <div className="paywall-plan-grid">
                {yearlyPlan && (
                  <button
                    type="button"
                    className={`paywall-plan-card ${
                      selectedProductId === 'premium_yearly' ? 'selected' : ''
                    }`}
                    aria-pressed={selectedProductId === 'premium_yearly'}
                    onClick={() => setSelectedProductId('premium_yearly')}
                  >
                    <span className="paywall-plan-card-badge">
                      {t('paywall.plan.recommended')}
                    </span>
                    <span className="paywall-plan-card-check" aria-hidden="true">
                      {selectedProductId === 'premium_yearly' && <Check size={12} />}
                    </span>
                    <span className="paywall-plan-card-name">{t('paywall.yearly')}</span>
                    <span className="paywall-plan-card-price">
                      <strong>{yearlyEquivalent}</strong>
                      <span>/ {t('paywall.monthly.per')}</span>
                    </span>
                    {yearlyPerDay && (
                      <span className="paywall-plan-card-anchor">
                        {t('paywall.plan.perDay', { price: yearlyPerDay })}
                      </span>
                    )}
                    <span className="paywall-plan-card-detail">
                      {t('paywall.plan.billedYearly', { price: yearlyPlan.phase.priceFormatted })}
                    </span>
                    {yearlySaving !== null && yearlySaving > 0 && (
                      <span className="paywall-plan-card-saving">
                        {t('paywall.plan.save', { percent: yearlySaving })}
                      </span>
                    )}
                  </button>
                )}

                {monthlyPlan && (
                  <button
                    type="button"
                    className={`paywall-plan-card ${
                      selectedProductId === 'premium_monthly' ? 'selected' : ''
                    }`}
                    aria-pressed={selectedProductId === 'premium_monthly'}
                    onClick={() => setSelectedProductId('premium_monthly')}
                  >
                    <span className="paywall-plan-card-check" aria-hidden="true">
                      {selectedProductId === 'premium_monthly' && <Check size={12} />}
                    </span>
                    <span className="paywall-plan-card-name">{t('paywall.monthly')}</span>
                    <span className="paywall-plan-card-price">
                      <strong>{monthlyPlan.phase.priceFormatted}</strong>
                      <span>/ {t('paywall.monthly.per')}</span>
                    </span>
                    <span className="paywall-plan-card-detail">
                      {t('paywall.plan.monthlyFlex')}
                    </span>
                  </button>
                )}
              </div>
            )}
          </section>

          {notice && (
            <div className={`paywall-action-notice ${notice.tone}`} role="status">
              {notice.tone === 'success' ? (
                <Check size={17} />
              ) : notice.tone === 'error' ? (
                <CircleAlert size={17} />
              ) : (
                <ShieldCheck size={17} />
              )}
              <span>{notice.text}</span>
            </div>
          )}

          <section className="paywall-trust">
            <div>
              <ShieldCheck size={18} />
              <span>
                <strong>{t('paywall.trust.playTitle')}</strong>
                {t('paywall.trust.playDesc')}
              </span>
            </div>
            <div>
              <RotateCcw size={18} />
              <span>
                <strong>{t('paywall.trust.cancelTitle')}</strong>
                {t('paywall.trust.cancelDesc')}
              </span>
            </div>
          </section>

          <p className="paywall-free-note">{t('paywall.freeStillAvailable')}</p>

          <div className="paywall-footer-actions">
            {isAndroidBilling && (
              <button
                type="button"
                className="paywall-text-button"
                onClick={runRestore}
                disabled={busyAction !== null}
              >
                <RotateCcw size={15} />
                {busyAction === 'restore' ? t('paywall.restore.working') : t('paywall.restore')}
              </button>
            )}
            <button
              type="button"
              className="paywall-text-button"
              onClick={() => openPlaySubscriptionManage(null)}
            >
              <ExternalLink size={15} />
              {t('paywall.manageSubscription')}
            </button>
          </div>

          <p className="paywall-legal">
            {t('paywall.autoRenew.disclosure')}{' '}
            <Link to="/terms">{t('paywall.legal.terms')}</Link>
            {' · '}
            <Link to="/privacy">{t('paywall.legal.privacy')}</Link>
          </p>
        </main>

        {isAndroidBilling && selectedPlan && (
          <div className="paywall-purchase-dock">
            <div className="paywall-purchase-summary">
              <span>{purchaseLabel}</span>
              <strong>
                {selectedPrice} / {selectedPeriod}
              </strong>
            </div>
            <button
              type="button"
              className="paywall-primary-button"
              onClick={runPurchase}
              disabled={busyAction !== null}
            >
              {busyAction === selectedProductId ? t('paywall.purchase.opening') : purchaseLabel}
            </button>
            <p>{t('paywall.purchase.confirmHint')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
