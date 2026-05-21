/* Me tab — profile, settings, logout. PoC stub. */
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { fetchMe } from '../../lib/queries';
import { tokens } from '../../lib/api';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

const GRADE_LABEL: Record<string, string> = {
  CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
  CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
};

export function MeScreen() {
  const nav = useNavigate();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const userName = me.data?.name ?? 'Aarav';
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
            <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>Profile</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>Me</div>
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
                <span className="chip primary" style={{ fontSize: 10.5 }}>{me.data?.role ?? 'STUDENT'}</span>
                {me.data?.gradeLevel && (
                  <span className="chip" style={{ fontSize: 10.5 }}>
                    {GRADE_LABEL[me.data.gradeLevel] ?? me.data.gradeLevel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="section-h">
            <span className="label">Reports</span>
          </div>
          <div onClick={() => nav('/app/report')} className="plan-card" style={{ cursor: 'pointer' }}>
            <div className="badge" style={{ background: 'var(--p-accent-tint)', color: 'var(--p-ink)' }}>📊</div>
            <div className="info">
              <div className="ttl">Weekly report</div>
              <div className="sub">Mentor message + time × accuracy + next focus</div>
            </div>
            <Glyph.ChevronR accent="var(--p-muted)" size={16} />
          </div>

          {/* Admin section — ADMIN role 만 노출 */}
          {me.data?.role === 'ADMIN' && (
            <>
              <div className="section-h">
                <span className="label">Admin</span>
              </div>
              <div onClick={() => nav('/app/admin/ingest')} className="plan-card" style={{ cursor: 'pointer' }}>
                <div className="badge" style={{ background: 'var(--p-primary-tint)', color: 'var(--p-primary)', fontStyle: 'normal', fontSize: 16 }}>↑</div>
                <div className="info">
                  <div className="ttl">Content ingestion</div>
                  <div className="sub">PDF upload / API source / draft review</div>
                </div>
                <Glyph.ChevronR accent="var(--p-muted)" size={16} />
              </div>
            </>
          )}

          <div className="section-h">
            <span className="label">Account</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Link to="/app/me/settings" style={{ textDecoration: 'none' }}>
              <div className="plan-card">
                <div className="badge" style={{ background: 'var(--p-surface-2)', color: 'var(--p-ink-2)', fontStyle: 'normal', fontSize: 18 }}>⚙</div>
                <div className="info">
                  <div className="ttl">Settings</div>
                  <div className="sub">Privacy, data, account</div>
                </div>
                <Glyph.ChevronR accent="var(--p-muted)" size={16} />
              </div>
            </Link>
            <div className="plan-card" onClick={logout} style={{ cursor: 'pointer' }}>
              <div className="badge" style={{ background: 'var(--p-danger-tint)', color: 'var(--p-danger)', fontStyle: 'normal', fontSize: 18 }}>↩</div>
              <div className="info">
                <div className="ttl">Log out</div>
                <div className="sub">You'll be signed back in next time</div>
              </div>
              <Glyph.ChevronR accent="var(--p-muted)" size={16} />
            </div>
          </div>

          <div style={{ marginTop: 18, padding: 12, textAlign: 'center', fontSize: 11, color: 'var(--p-muted)' }}>
            Matheo · v2026.05.13
          </div>
          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}
