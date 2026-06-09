/* Me tab — profile, settings, logout. PoC stub. */
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { fetchMe } from '../../lib/queries';
import { tokens } from '../../lib/api';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import { EfficacyCard } from './EfficacyCard';

const GRADE_LABEL: Record<string, string> = {
  CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
  CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
};

export function MeScreen() {
  const nav = useNavigate();
  const { t } = useT();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const userName = me.data?.name ?? '';
  const initial = userName.charAt(0).toUpperCase();

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

          <EfficacyCard />

          {/* Billing / paywall card removed in v1.0 — paywall is Phase 2 work.
              Profile card above + Quick links below give identity + reports;
              StudyScreen's QuotaMeter still surfaces the Free-tier counter. */}

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
