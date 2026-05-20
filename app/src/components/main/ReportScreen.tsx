/* Weekly report — features-b.jsx ScreenReport ported with real backend data. */
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  fetchReportCurrent, fetchTimeVsAccuracy, fetchNextFocus,
  fetchAchievements, fetchMentorMessage, fetchMe,
} from '../../lib/queries';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

export function ReportScreen() {
  const nav = useNavigate();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const cur = useQuery({ queryKey: ['report-current'], queryFn: fetchReportCurrent });
  const tva = useQuery({ queryKey: ['tva'], queryFn: () => fetchTimeVsAccuracy() });
  const nfx = useQuery({ queryKey: ['next-focus'], queryFn: fetchNextFocus });
  const ach = useQuery({ queryKey: ['achievements'], queryFn: fetchAchievements });
  const mentor = useQuery({ queryKey: ['mentor'], queryFn: fetchMentorMessage });

  const userName = (me.data?.name ?? 'Aarav').split(' ')[0];
  const today = new Date();
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  const weekLabel = `${weekStart.getDate()} – ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('en-US', { month: 'short' })}`;

  // Time vs Accuracy chart geometry
  const W = 320, H = 110, P = 20;
  const data = tva.data ?? [];
  const aMin = 40, aMax = 100;
  const tMax = Math.max(8, ...data.map((d) => d.time));
  const ptsA = data.map((d, i) => {
    const x = P + ((W - 2 * P) * i) / Math.max(1, data.length - 1);
    const y = H - P - ((Math.max(aMin, Math.min(aMax, d.accuracy)) - aMin) / (aMax - aMin)) * (H - 2 * P);
    return [x, y];
  });
  const pathA = ptsA.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/app/me')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{weekLabel}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Weekly report</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '12px 22px 0' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--p-muted)' }}>Your week at a glance</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.01em' }}>Hello, <em style={{ color: 'var(--p-primary)' }}>{userName}</em></div>
          </div>
          {/* 4 stats */}
          <div className="stat-grid">
            <Stat k="Study time" v={`${(cur.data?.totalHours ?? 0).toFixed(1)}`} u="h"
                  delta={cur.data ? `${cur.data.hoursDelta >= 0 ? '↑' : '↓'} ${Math.abs(cur.data.hoursDelta).toFixed(1)}h` : ''}
                  deltaDown={(cur.data?.hoursDelta ?? 0) < 0} />
            <Stat k="Problems" v={`${cur.data?.problemsSolved ?? 0}`}
                  delta={cur.data ? `≈ ${cur.data.problemsPerDay}/day` : ''} />
            <Stat k="Accuracy" v={`${cur.data?.accuracyPct ?? 0}`} u="%"
                  delta={cur.data ? `${cur.data.accuracyDelta >= 0 ? '↑' : '↓'} ${Math.abs(cur.data.accuracyDelta)}%` : ''}
                  deltaDown={(cur.data?.accuracyDelta ?? 0) < 0} />
            <Stat
              k="AI Score"
              v={cur.data && cur.data.aiScore > 0 ? `${cur.data.aiScore.toFixed(1)}` : '—'}
              u={cur.data && cur.data.aiScore > 0 ? '/10' : ''}
              delta={!cur.data || cur.data.aiScore === 0 ? 'No data yet' : ''}
            />
          </div>

          {/* Mentor message */}
          <div className="card" style={{ marginTop: 12, padding: 16, background: 'var(--p-ink)', color: 'var(--p-bg)', borderColor: 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--p-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-ink)' }}>
                <Glyph.Sparkle accent="currentColor" size={13} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>From your AI mentor</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              {mentor.data?.message
                ? <>“{mentor.data.message.replace(/^"|"$/g, '')}”</>
                : <>“Welcome, {userName}. Start practicing to unlock your first weekly mentor brief.”</>
              }
            </div>
            {mentor.data?.strength && (
              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85, lineHeight: 1.5 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, opacity: 0.65, letterSpacing: '0.06em' }}>STRENGTH</span>{' '}
                {mentor.data.strength}
              </div>
            )}
            {mentor.data?.nextGoal && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 11, opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
                <span>NEXT: {String(mentor.data.nextGoal).toUpperCase()}</span>
                {mentor.data.week && <span>WEEK {String(mentor.data.week).toUpperCase()}</span>}
              </div>
            )}
          </div>

          {/* Time vs Accuracy */}
          <div className="card" style={{ marginTop: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Time vs Accuracy</span>
              <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{data.length} WEEKS</span>
            </div>
            {data.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--p-muted)', fontSize: 12.5 }}>
                Not enough weeks tracked yet.
              </div>
            ) : (
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 130, marginTop: 6 }}>
                {[40, 60, 80, 100].map((y) => {
                  const yy = H - P - ((y - aMin) / (aMax - aMin)) * (H - 2 * P);
                  return <line key={y} x1={P} y1={yy} x2={W - P} y2={yy} stroke="var(--p-border)" strokeDasharray="2 3" />;
                })}
                {data.map((d, i) => {
                  const x = P + ((W - 2 * P) * i) / Math.max(1, data.length - 1);
                  const bh = (d.time / tMax) * (H - 2 * P);
                  return <rect key={i} x={x - 10} y={H - P - bh} width="20" height={bh} fill="var(--p-accent)" fillOpacity="0.35" rx="2" />;
                })}
                <path d={pathA} fill="none" stroke="var(--p-primary)" strokeWidth="2" strokeLinecap="round" />
                {ptsA.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--p-surface)" stroke="var(--p-primary)" strokeWidth="1.8" />
                ))}
                {data.map((d, i) => {
                  const x = P + ((W - 2 * P) * i) / Math.max(1, data.length - 1);
                  return <text key={i} x={x} y={H - 4} fontFamily="var(--font-mono)" fontSize="9" fill="var(--p-muted)" textAnchor="middle">{d.week}</text>;
                })}
              </svg>
            )}
            <div style={{ display: 'flex', gap: 14, marginTop: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--p-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, background: 'var(--p-accent)', opacity: 0.5, borderRadius: 2 }} />
                TIME (h)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 2, background: 'var(--p-primary)' }} />
                ACCURACY (%)
              </span>
            </div>
          </div>

          {/* Next focus */}
          {nfx.data && nfx.data.length > 0 && (
            <div className="card" style={{ padding: 14, marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Next focus</span>
                <span className="caption" style={{ fontSize: 11 }}>{nfx.data.length} items</span>
              </div>
              {nfx.data.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < nfx.data!.length - 1 ? '1px dashed var(--p-border)' : 'none' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: f.color || 'var(--p-primary)', marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{f.unit}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--p-muted)' }}>{f.area} · {f.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {ach.data && ach.data.length > 0 && (
            <div className="card" style={{ padding: 14, marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Achievements</span>
                <span className="caption" style={{ fontSize: 11 }}>{ach.data.length} unlocked</span>
              </div>
              {ach.data.map((a, i) => (
                <div key={i} className="achiev">
                  <div className="medal">{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--p-muted)' }}>{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}

function Stat({ k, v, u, delta, deltaDown }: { k: string; v: string; u?: string; delta?: string; deltaDown?: boolean }) {
  return (
    <div className="stat">
      <div className="k">{k}</div>
      <div className="v italic">
        {v}
        {u && <span style={{ fontSize: 14, color: 'var(--p-muted)' }}>{u}</span>}
      </div>
      {delta && <div className={`delta ${deltaDown ? 'down' : ''}`}>{delta}</div>}
    </div>
  );
}
