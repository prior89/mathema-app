/* Mock exams — features-b.jsx ScreenMocks ported with real backend data. */
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchMockSummary, fetchTrajectory, fetchExamResults } from '../../lib/queries';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import { post } from '../../lib/api';
import { useState } from 'react';

const EXAM_TYPES: Array<{ ttl: string; sub: string; tag: string; color: string; tint: string; kind: string }> = [
  { ttl: 'AI Diagnostic', sub: '30 · ~100 min', tag: 'PERSONALISED', color: 'var(--p-primary)', tint: 'var(--p-primary-tint)', kind: 'recommended' },
  { ttl: 'Mini · per unit', sub: '10 · 25 min', tag: 'QUICK', color: 'var(--p-accent)', tint: 'var(--p-accent-tint)', kind: 'mini' },
  { ttl: 'Wrong-note redo', sub: '15 · 40 min', tag: 'REVIEW', color: 'oklch(0.55 0.15 25)', tint: 'oklch(0.96 0.04 25)', kind: 'wrong-redo' },
  { ttl: 'Real · Board sim', sub: '30 · 100 min', tag: 'EXAM-DAY', color: 'var(--p-ink)', tint: 'var(--p-surface-2)', kind: 'real' },
];

// CBSE grade band mapping (1-8 from backend → A1, A2, B1, B2, C1, C2, D, E).
const BAND = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D', 'E'];
function gradeBand(n: number | null): string {
  if (n == null) return '—';
  const idx = Math.max(1, Math.min(8, n));
  return BAND[idx] ?? '—';
}

export function MocksScreen() {
  const nav = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const summary = useQuery({ queryKey: ['mock-summary'], queryFn: fetchMockSummary });
  const traj = useQuery({ queryKey: ['traj'], queryFn: fetchTrajectory });
  const results = useQuery({ queryKey: ['exam-results'], queryFn: fetchExamResults });

  // chart geometry
  const W = 320, H = 110, P = 20;
  const traje = traj.data ?? [];
  const safe = traje.length > 0 ? traje : [];
  const max = 100, min = 40;
  const pts = safe.map((t, i) => {
    const x = P + ((W - 2 * P) * i) / Math.max(1, safe.length - 1);
    const y = H - P - ((Math.max(min, Math.min(max, t.score)) - min) / (max - min)) * (H - 2 * P);
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const area = pts.length ? `${path} L ${pts[pts.length - 1][0]} ${H - P} L ${P} ${H - P} Z` : '';
  const targetY = H - P - ((85 - min) / (max - min)) * (H - 2 * P);

  async function startExam(kind: string) {
    if (busy) return;
    setBusy(kind); setMsg(null);
    try {
      const path = kind === 'recommended' ? '/mock-exams/recommended/start' : `/mock-exams/types/${kind}/start`;
      const r = await post<{ resultId: string | null; name: string; totalMinutes: number; problems: any[] }>(path, {});
      if (!r.resultId || r.problems.length === 0) {
        setMsg('No questions available for this exam yet. Try another type.');
        return;
      }
      // Pass session state through router navigate — MockExamPlayScreen reads from location.state.
      nav(`/app/mocks/play/${r.resultId}`, { state: r });
    } catch (e: any) {
      setMsg(`Could not start: ${e?.response?.data?.message ?? 'backend error'}`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="screen">
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="app-head" style={{ paddingBottom: 0 }}>
          <div>
            <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>Library</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>Mock exams</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--p-surface)', border: '1px solid var(--p-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <circle cx="12" cy="12" r="9" fill="none" stroke="var(--p-ink-2)" strokeWidth="1.6" />
              <path d="M 12 8 V 12 L 14.5 14" stroke="var(--p-ink-2)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div style={{ padding: '12px 22px 0' }}>
          {/* 4 stats — label·value·delta 정합성 검증 완료 */}
          <div className="stat-grid">
            <Stat
              k="Best"
              v={summary.data?.bestScore != null ? `${summary.data.bestScore}` : '—'}
              delta={
                summary.data?.improvementSinceFirst != null && summary.data.improvementSinceFirst !== 0
                  ? `${summary.data.improvementSinceFirst > 0 ? '↑' : '↓'} ${Math.abs(summary.data.improvementSinceFirst)} since first`
                  : (summary.data?.bestScore != null ? 'Personal best' : 'No exams yet')
              }
            />
            <Stat
              k="Latest grade"
              v={gradeBand(summary.data?.expectedGrade ?? null)}
              delta={
                summary.data?.lastScore != null
                  ? `Score ${summary.data.lastScore}${
                      summary.data?.pointsToNextGrade != null && summary.data.pointsToNextGrade > 0
                        ? ` · +${summary.data.pointsToNextGrade} to next`
                        : ''}`
                  : 'Take a mock'
              }
            />
            <Stat
              k="Avg · last 10"
              v={summary.data?.avgScore != null ? `${summary.data.avgScore}` : '—'}
              delta={
                summary.data?.scoreDelta != null && summary.data.scoreDelta !== 0
                  ? `${summary.data.scoreDelta > 0 ? '↑' : '↓'} ${Math.abs(summary.data.scoreDelta)} vs prev`
                  : ''
              }
            />
            <Stat
              k="Taken"
              v={`${summary.data?.attemptCount ?? 0}`}
              delta={summary.data && summary.data.attemptCount > 0 ? 'Total attempts' : ''}
            />
          </div>

          {/* Trajectory chart */}
          <div className="card" style={{ marginTop: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Score trajectory</span>
              <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>LAST {safe.length} · OUT OF 100</span>
            </div>
            {safe.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--p-muted)', fontSize: 12.5 }}>
                No mock exams taken yet.
              </div>
            ) : (
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 130, marginTop: 6 }}>
                {[40, 60, 80, 100].map((y) => {
                  const yy = H - P - ((y - min) / (max - min)) * (H - 2 * P);
                  return (
                    <g key={y}>
                      <line x1={P} y1={yy} x2={W - P} y2={yy} stroke="var(--p-border)" strokeDasharray="2 3" strokeWidth="1" />
                      <text x={P - 4} y={yy + 3} fontFamily="var(--font-mono)" fontSize="9" fill="var(--p-muted)" textAnchor="end">{y}</text>
                    </g>
                  );
                })}
                {area && <path d={area} fill="var(--p-primary)" fillOpacity="0.12" />}
                <path d={path} fill="none" stroke="var(--p-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? 'var(--p-primary)' : 'var(--p-surface)'} stroke="var(--p-primary)" strokeWidth="2" />
                    <text x={p[0]} y={H - 4} fontFamily="var(--font-mono)" fontSize="9" fill="var(--p-muted)" textAnchor="middle">{safe[i].name}</text>
                  </g>
                ))}
                <line x1={P} y1={targetY} x2={W - P} y2={targetY} stroke="var(--p-accent)" strokeDasharray="3 3" strokeWidth="1.2" />
                <text x={W - P} y={targetY - 3} fontFamily="var(--font-mono)" fontSize="9" fill="var(--p-accent)" textAnchor="end">TARGET 85</text>
              </svg>
            )}
          </div>

          {/* Exam types */}
          <div className="section-h">
            <span className="label">Take a mock</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {EXAM_TYPES.map((e) => (
              <div key={e.kind} className="card" style={{ padding: 12, background: e.tint, borderColor: 'transparent', cursor: busy === e.kind ? 'wait' : 'pointer', opacity: busy === e.kind ? 0.5 : 1 }}
                   onClick={() => startExam(e.kind)}>
                <div style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', color: e.color, fontWeight: 700 }}>{e.tag}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginTop: 4, color: 'var(--p-ink)', letterSpacing: '-0.005em' }}>{e.ttl}</div>
                <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{e.sub}</div>
              </div>
            ))}
          </div>
          {msg && (
            <div className="card" style={{ marginTop: 8, padding: 12, fontSize: 12, color: 'var(--p-ink-2)' }}>{msg}</div>
          )}

          {/* Recent results */}
          {results.data && results.data.length > 0 && (
            <>
              <div className="section-h">
                <span className="label">Recent results</span>
                <span className="more">{results.data.length} total</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {results.data.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="card"
                    style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                    onClick={() => nav(`/app/mocks/result/${r.id}`)}
                  >
                    <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--p-ink)', minWidth: 38 }}>{r.score}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>
                        {r.date} · {gradeBand(r.grade)} · P{r.percentile} · {r.time}
                      </div>
                    </div>
                    <Glyph.ChevronR accent="var(--p-muted)" size={16} />
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}

function Stat({ k, v, u, delta }: { k: string; v: string; u?: string; delta?: string }) {
  // 화살표로 자동 down 판정 — '↓' 이 들어가면 빨간색.
  const isDown = !!delta && delta.includes('↓');
  return (
    <div className="stat">
      <div className="k">{k}</div>
      <div className="v italic">
        {v}
        {u && <span style={{ fontSize: 14, color: 'var(--p-muted)' }}>{u}</span>}
      </div>
      {delta && <div className={`delta ${isDown ? 'down' : ''}`}>{delta}</div>}
    </div>
  );
}
