/* Me tab — profile, settings, logout. PoC stub. */
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { fetchMe } from '../../lib/queries';
import { tokens } from '../../lib/api';
import { getServerStatus } from '../../lib/billing';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

const GRADE_LABEL: Record<string, string> = {
  CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
  CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
};

export function MeScreen() {
  const nav = useNavigate();
  const { t } = useT();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const billing = useQuery({
    queryKey: ['billing-status'],
    queryFn: getServerStatus,
    staleTime: 60 * 1000,
  });
  const userName = me.data?.name ?? '';
  const initial = userName.charAt(0).toUpperCase();

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

  function logout() {
    tokens.clear();
    nav('/login');
  }

  return (
    <div className="screen">
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="app-head" style={{ paddingBottom: 0 }}>
          <div>
            <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>{t('me.tab.label')}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>{t('me.tab.title')}</div>
          </div>
        </div>

        <div style={{ padding: '12px 22px 0' }}>
          {/* Profile card */}
          <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="avatar" style={{ width: 56, height: 56, fontSize: 24 }}>{initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{userName}</div>
              <div style={{ fontSize: 12, color: 'var(--p-muted)' }}>{me.data?.email ?? '—'}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <span className="chip primary" style={{ fontSize: 10.5 }}>{me.data?.role ?? t('me.role.default')}</span>
                {me.data?.gradeLevel && (
                  <span className="chip" style={{ fontSize: 10.5 }}>
                    {GRADE_LABEL[me.data.gradeLevel] ?? me.data.gradeLevel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Billing / plan status — hero card matching Paywall design language.
              Free: white card + quota progress bar + primary CTA button.
              Preview: sage tint card matching Paywall preview block.
              Premium: forest gradient with subtle shadow for the "active" feel. */}
          <div className="section-h">
            <span className="label">{t('me.billing.section')}</span>
          </div>
          {(() => {
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

            return (
              <div
                onClick={() => nav('/app/paywall')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    nav('/app/paywall');
                  }
                }}
                style={{
                  background: cardBg,
                  border: cardBorder,
                  borderRadius: 18,
                  padding: 18,
                  cursor: 'pointer',
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
                  <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255, 255, 255, 0.72)', fontWeight: 600 }}>
                    {t('me.billing.manage')}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Quick links */}
          <div className="section-h">
            <span className="label">{t('me.reports.section')}</span>
          </div>
          <div onClick={() => nav('/app/report')} className="plan-card" style={{ cursor: 'pointer' }}>
            <div className="badge" style={{ background: 'var(--p-accent-tint)', color: 'var(--p-ink)' }}>📊</div>
            <div className="info">
              <div className="ttl">{t('me.reports.weekly.title')}</div>
              <div className="sub">{t('me.reports.weekly.sub')}</div>
            </div>
            <Glyph.ChevronR accent="var(--p-muted)" size={16} />
          </div>

          {/* Admin section — ADMIN role 만 노출 */}
          {me.data?.role === 'ADMIN' && (
            <>
              <div className="section-h">
                <span className="label">{t('me.admin.section')}</span>
              </div>
              <div onClick={() => nav('/app/admin/ingest')} className="plan-card" style={{ cursor: 'pointer' }}>
                <div className="badge" style={{ background: 'var(--p-primary-tint)', color: 'var(--p-primary)', fontStyle: 'normal', fontSize: 16 }}>↑</div>
                <div className="info">
                  <div className="ttl">{t('me.admin.ingest.title')}</div>
                  <div className="sub">{t('me.admin.ingest.sub')}</div>
                </div>
                <Glyph.ChevronR accent="var(--p-muted)" size={16} />
              </div>
              <div onClick={() => nav('/app/admin/ko-study-problems/new')} className="plan-card" style={{ cursor: 'pointer' }}>
                <div className="badge" style={{ background: 'var(--p-primary-tint)', color: 'var(--p-primary)', fontStyle: 'normal', fontSize: 16 }}>＋</div>
                <div className="info">
                  <div className="ttl">한국 연습 문제 추가</div>
                  <div className="sub">KR 챕터별 단일 5지선다 문제 직접 작성</div>
                </div>
                <Glyph.ChevronR accent="var(--p-muted)" size={16} />
              </div>
            </>
          )}

          <div className="section-h">
            <span className="label">{t('me.account.section')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Link to="/app/me/settings" style={{ textDecoration: 'none' }}>
              <div className="plan-card">
                <div className="badge" style={{ background: 'var(--p-surface-2)', color: 'var(--p-ink-2)', fontStyle: 'normal', fontSize: 18 }}>⚙</div>
                <div className="info">
                  <div className="ttl">{t('me.account.settings.title')}</div>
                  <div className="sub">{t('me.account.settings.sub')}</div>
                </div>
                <Glyph.ChevronR accent="var(--p-muted)" size={16} />
              </div>
            </Link>
            <div className="plan-card" onClick={logout} style={{ cursor: 'pointer' }}>
              <div className="badge" style={{ background: 'var(--p-danger-tint)', color: 'var(--p-danger)', fontStyle: 'normal', fontSize: 18 }}>↩</div>
              <div className="info">
                <div className="ttl">{t('me.account.logout.title')}</div>
                <div className="sub">{t('me.account.logout.sub')}</div>
              </div>
              <Glyph.ChevronR accent="var(--p-muted)" size={16} />
            </div>
          </div>

          <div style={{ marginTop: 18, padding: 12, textAlign: 'center', fontSize: 11, color: 'var(--p-muted)' }}>
            {t('me.version')}
          </div>
          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}
