/* Home screen — features-a.jsx ScreenHome ported with real backend data. */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  fetchDashboardSummary, fetchMe, fetchHeatmap, fetchToday,
  fetchConceptLessonsForUnit,
  type RecommendCard,
} from '../../lib/queries';
import { track } from '../../lib/analytics';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

// CBSE band mapping for predicted grade — 1..9 (수능 잔존) → A1..E
function gradeBand(n: number | null): string {
  if (n == null) return '—';
  if (n <= 1) return 'A1';
  if (n <= 2) return 'A2';
  if (n <= 3) return 'B1';
  if (n <= 4) return 'B2';
  if (n <= 5) return 'C1';
  if (n <= 6) return 'C2';
  if (n <= 7) return 'D';
  return 'E';
}

const PLAN_BADGE: Record<string, { glyph: string; bg: string; fg: string }> = {
  concept: { glyph: '∫', bg: 'var(--p-primary-tint)', fg: 'var(--p-primary)' },
  practice: { glyph: 'f′', bg: 'var(--p-accent-tint)', fg: 'var(--p-ink)' },
  review: { glyph: '↻', bg: 'oklch(0.96 0.04 25)', fg: 'oklch(0.5 0.18 25)' },
  mock: { glyph: '∑', bg: 'oklch(0.95 0.05 155)', fg: 'var(--p-success)' },
};

function planBadge(type: string) {
  return PLAN_BADGE[type] ?? PLAN_BADGE.concept;
}

export function HomeScreen() {
  const nav = useNavigate();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const summary = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboardSummary });
  const heatmap = useQuery({ queryKey: ['heatmap', 12], queryFn: () => fetchHeatmap(12) });
  const today = useQuery({ queryKey: ['today'], queryFn: fetchToday });

  // KPI: today.card.shown 로그 (impression — acceptRate 분모).
  useEffect(() => {
    const cards = today.data;
    if (!cards) return;
    track('today.cards.shown', { count: cards.length, tags: cards.map((c) => c.tag) });
  }, [today.data]);

  const userName = me.data?.name ?? 'Aarav';
  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  // Backend returns Heatmap = Array<{day, intensity}>. Convert to 12×7 grid.
  const heat = (heatmap.data ?? []).map((d) => d.intensity ?? 0);
  while (heat.length < 12 * 7) heat.push(0);

  return (
    <div className="screen">
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="app-head">
          <div className="greet">
            <div className="hello">{dateStr}</div>
            <div className="name">Hello, <em>{userName.split(' ')[0]}</em></div>
          </div>
        </div>

        <div style={{ padding: '0 22px' }}>

          {/* Cold-start hero — only when the user has zero study activity yet.
              Replaces the silent zero-stats wall with two clear first-step CTAs. */}
          {summary.data
            && summary.data.todayMinutes === 0
            && summary.data.streakDays === 0
            && (today.data?.length ?? 0) === 0 && (
            <ColdStartHero
              name={userName.split(' ')[0]}
              onSolve={() => nav('/app/solve')}
              onLearn={() => nav('/app/learn')}
            />
          )}

          {/* 4 stats */}
          <div className="stat-grid" style={{ marginTop: 12 }}>
            <Stat k="Today" v={`${summary.data?.todayMinutes ?? 0}`} u="m"
                  delta={summary.data && summary.data.todayMinutes > 0 ? `↑ logged today` : 'No study yet'} />
            <Stat k="Streak" v={`${summary.data?.streakDays ?? 0}`} u="d"
                  delta={(summary.data?.streakDays ?? 0) >= 7 ? '↑ keep it up' : 'Start your streak'} />
            <Stat k="Accuracy · 7d" v={`${summary.data?.weeklyAccuracy ?? 0}`} u="%"
                  delta={summary.data ? `${summary.data.weeklyAccuracyDelta >= 0 ? '↑' : '↓'} ${Math.abs(summary.data.weeklyAccuracyDelta)}%` : ''}
                  deltaDown={(summary.data?.weeklyAccuracyDelta ?? 0) < 0} />
            <Stat k="Predicted" v={gradeBand(summary.data?.expectedGrade ?? null)} u=""
                  delta={summary.data?.expectedGrade == null ? 'Take a mock' : `from ${gradeBand(summary.data.expectedGradeFrom)}`}
                  deltaDown={false} />
          </div>

          {/* Today's plan */}
          <div className="section-h">
            <span className="label">Today’s plan</span>
            <span className="more">{today.data?.length ?? 0} items</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {today.isLoading && <Empty msg="Loading…" />}
            {today.data && today.data.length === 0 && (
              <EmptyCta
                msg="No tasks yet. Try a concept lesson to start."
                cta="Browse concept lessons"
                onClick={() => nav('/app/learn')}
              />
            )}
            {(today.data ?? []).slice(0, 4).map((c: RecommendCard, i: number) => {
              const b = planBadge(c.type);
              const goLesson = async () => {
                // KPI 추적 — 추천 클릭. 추후 acceptRate 산출에 사용.
                track('today.card.click', {
                  unitId: c.unitId, tag: c.tag, title: c.title, type: c.type,
                });
                if (!c.unitId) return nav('/app/learn');
                try {
                  const lessons = await fetchConceptLessonsForUnit(c.unitId);
                  const target = lessons.find((l) => !l.mastered) ?? lessons[0];
                  if (target) {
                    track('today.card.opened-lesson', { unitId: c.unitId, chapterCode: target.chapterCode });
                    nav(`/app/learn/${target.chapterCode}`);
                  } else nav('/app/learn');
                } catch {
                  nav('/app/learn');
                }
              };
              return (
                <div key={i} className="plan-card" onClick={goLesson}>
                  <div className="badge" style={{ background: b.bg, color: b.fg }}>{c.icon || b.glyph}</div>
                  <div className="info">
                    <div className="ttl">{c.title}</div>
                    <div className="sub">{c.unit} · {c.time}</div>
                  </div>
                  <span className="chip" style={{ fontSize: 10.5 }}>{c.tag}</span>
                </div>
              );
            })}
          </div>

          {/* Heatmap */}
          <div className="section-h">
            <span className="label">12-week calendar</span>
            <span className="more">{summary.data?.streakDays ?? 0} day streak</span>
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div className="heatmap">
              {heat.map((v, i) => (
                <div key={i} className={`cell ${v === 1 ? 'l1' : v === 2 ? 'l2' : v === 3 ? 'l3' : ''}`} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>
              {(() => {
                const m = new Date();
                const labels: string[] = [];
                for (let i = 3; i >= 0; i--) {
                  const d = new Date(m); d.setMonth(d.getMonth() - i);
                  labels.push(d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase());
                }
                return labels.map((l, i) => <span key={i}>{l}</span>);
              })()}
            </div>
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}

function Stat({ k, v, u, delta, deltaDown }: { k: string; v: string; u: string; delta?: string; deltaDown?: boolean }) {
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

function Empty({ msg }: { msg: string }) {
  return (
    <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)', fontSize: 12.5 }}>
      {msg}
    </div>
  );
}

function EmptyCta({ msg, cta, onClick }: { msg: string; cta: string; onClick: () => void }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        padding: 16, textAlign: 'center', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
      }}
    >
      <div style={{ color: 'var(--p-muted)', fontSize: 13 }}>{msg}</div>
      <span
        className="chip primary"
        style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px' }}
      >
        {cta} →
      </span>
    </div>
  );
}

/** First-impression hero shown when the user has not studied at all yet.
 *  Two clear next-step CTAs — Solve (AI helper) and Learn (concept lessons).
 *  Drops out as soon as any study minute / streak day / today-plan item is recorded. */
function ColdStartHero({
  name, onSolve, onLearn,
}: { name: string; onSolve: () => void; onLearn: () => void }) {
  return (
    <div
      style={{
        marginTop: 14,
        borderRadius: 'var(--radius-lg)',
        padding: '20px 18px',
        background: 'linear-gradient(135deg, var(--p-primary-tint), var(--p-accent-tint))',
        border: '1px solid var(--p-border)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      <div>
        <div className="eyebrow">Welcome</div>
        <div
          className="display"
          style={{ marginTop: 6, fontSize: 22, lineHeight: 1.15 }}
        >
          Let's get you started, <em>{name}</em>.
        </div>
        <p
          className="subtitle"
          style={{ fontSize: 13.5, marginTop: 8, maxWidth: 320 }}
        >
          Solve a question your way, or open a concept lesson. Your weak spots
          and progress fill in as you go.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          type="button"
          className="btn"
          onClick={onSolve}
          style={{ height: 44, fontSize: 13.5 }}
        >
          Solve a problem
        </button>
        <button
          type="button"
          className="btn outline"
          onClick={onLearn}
          style={{ height: 44, fontSize: 13.5 }}
        >
          Concept lessons
        </button>
      </div>
    </div>
  );
}
