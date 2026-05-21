/* Home screen — features-a.jsx ScreenHome ported with real backend data. */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  fetchDashboardSummary, fetchMe, fetchToday,
  fetchConceptLessonsForUnit, fetchErrorDna, fetchChapterProgress,
  type RecommendCard, type ChapterProgressRow,
} from '../../lib/queries';
import { track } from '../../lib/analytics';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

const PLAN_BADGE: Record<string, { glyph: string; bg: string; fg: string }> = {
  concept: { glyph: '∫', bg: 'var(--p-primary-tint)', fg: 'var(--p-primary)' },
  practice: { glyph: 'f′', bg: 'var(--p-accent-tint)', fg: 'var(--p-ink)' },
  review: { glyph: '↻', bg: 'var(--p-danger-tint)', fg: 'var(--p-danger)' },
  mock: { glyph: '∑', bg: 'var(--p-success-tint)', fg: 'var(--p-success)' },
};

function planBadge(type: string) {
  return PLAN_BADGE[type] ?? PLAN_BADGE.concept;
}

export function HomeScreen() {
  const nav = useNavigate();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const summary = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboardSummary });
  const today = useQuery({ queryKey: ['today'], queryFn: fetchToday });
  const errorDna = useQuery({ queryKey: ['error-dna'], queryFn: fetchErrorDna });
  const chapterProgress = useQuery({ queryKey: ['chapter-progress'], queryFn: fetchChapterProgress });

  // KPI: today.card.shown 로그 (impression — acceptRate 분모).
  useEffect(() => {
    const cards = today.data;
    if (!cards) return;
    track('today.cards.shown', { count: cards.length, tags: cards.map((c) => c.tag) });
  }, [today.data]);

  const userName = me.data?.name ?? 'Aarav';
  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="screen">
      {/* Sticky greeting — frozen so "Hello, Arjun" stays visible while the
          user scrolls through Today's plan / heatmap below. */}
      <div className="app-head" style={{ flexShrink: 0 }}>
        <div className="greet">
          <div className="hello">{dateStr}</div>
          <div className="name">Hello, <em>{userName.split(' ')[0]}</em></div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <div style={{ padding: '0 22px' }}>

          {/* Cold-start hero — only when the user has zero study activity yet.
              The !today.isLoading guard prevents a flicker: when `summary`
              resolves before `today`, today.data is still undefined and the
              `?? 0 === 0` check passed, briefly showing the hero before the
              recommend cards arrived and hid it again. */}
          {summary.data
            && !today.isLoading
            && summary.data.todayMinutes === 0
            && summary.data.streakDays === 0
            && (today.data?.length ?? 0) === 0 && (
            <ColdStartHero
              name={userName.split(' ')[0]}
              onStudy={() => nav('/app/study')}
              onLearn={() => nav('/app/learn')}
            />
          )}

          {/* Today / Streak stat grid removed per user request — the "No study
              yet" / "Start your streak" placeholders were dead weight on cold
              starts. Streak still surfaces in the 12-week heatmap header
              below, so the signal isn't lost. */}

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
                <div key={i} className="plan-card" onClick={goLesson} style={{ alignItems: 'flex-start' }}>
                  <div className="badge" style={{ background: b.bg, color: b.fg }}>{c.icon || b.glyph}</div>
                  <div className="info">
                    <div className="ttl">{c.title}</div>
                    <div className="sub">{c.unit} · {c.time}</div>
                    {/* Rationale — why this card is recommended right now. */}
                    {c.reason && (
                      <div style={{ fontSize: 11.5, color: 'var(--p-primary)', marginTop: 4, lineHeight: 1.4 }}>
                        {c.reason}
                      </div>
                    )}
                  </div>
                  <span className="chip" style={{ fontSize: 10.5 }}>{c.tag}</span>
                </div>
              );
            })}
          </div>

          {/* Where you slip — top error patterns */}
          {errorDna.data && errorDna.data.distribution.length > 0 && (
            <>
              <div className="section-h">
                <span className="label">Where you slip</span>
                <span className="more">last 30 days</span>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {errorDna.data.distribution.slice(0, 4).map((d) => (
                    <ErrorBar key={d.key} name={d.name} value={d.value} color={d.color} />
                  ))}
                </div>
                {errorDna.data.insight && (
                  <div style={{ fontSize: 12, color: 'var(--p-ink-2)', marginTop: 10, lineHeight: 1.5 }}>
                    {errorDna.data.insight}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Chapter progress — every in-progress chapter the user has
              touched, regardless of NCERT class. The previous filter pinned
              the dashboard to the user's onboarded class, so a Class 11
              student who reviewed a Class 8 chapter never saw it surfaced
              here even though Mastery + Study both treat any mastered
              chapter as fair game. 100%-done chapters still drop off so
              the card stays "what's left to do" rather than a victory lap. */}
          {(() => {
            const active = (chapterProgress.data ?? []).filter(
              (row) => row.progress < 1,
            );
            if (active.length === 0) return null;
            return (
              <>
                <div className="section-h">
                  <span className="label">Chapter progress</span>
                  <span className="more">{active.length} in progress</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {active.slice(0, 5).map((row) => (
                    <ChapterProgressCard
                      key={row.chapterCode}
                      row={row}
                      onClick={() => {
                        // Deep-link into the next unattempted problem when the
                        // backend knows which one it is — otherwise fall back
                        // to the chapter root so ConceptLessonScreen can decide
                        // (typically lands on the concept phase).
                        const url = row.nextProblemId
                          ? `/app/learn/${row.chapterCode}?problemId=${row.nextProblemId}`
                          : `/app/learn/${row.chapterCode}`;
                        nav(url);
                      }}
                    />
                  ))}
                </div>
              </>
            );
          })()}

          {/* 12-week heatmap removed per user request — was always-zero on
              cold starts and the month labels read as dead chrome. Streak +
              activity surface in the per-chapter progress cards instead. */}

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

/**
 * Horizontal bar showing a single error-type's share of recent mistakes.
 *
 * Two-row layout (label + count above, bar below). With everything stacked,
 * every bar's start and end pixels are identical regardless of how long the
 * label text is — the previous side-by-side layout shifted bars right when
 * the label exceeded its minWidth, which broke visual comparison.
 *
 * Colour comes from /ai-coach/error-dna so the same key keeps the same accent
 * across screens (Notes patterns, weekly report, etc.).
 */
function ErrorBar({ name, value, color }: { name: string; value: number; color: string }) {
  // Bar widths assume value is already a 0–100 percent share from /ai-coach/error-dna.
  const widthPct = Math.max(6, Math.min(100, value));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 12.5, marginBottom: 4 }}>
        <span style={{ color: 'var(--p-ink)' }}>{name}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--p-muted)' }}>{value}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: 'var(--p-surface-2)', overflow: 'hidden' }}>
        <div style={{ width: `${widthPct}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}

/**
 * Per-chapter card: progress bar (% problems attempted) + accuracy pill.
 * Tapping jumps to that chapter's concept lesson so the user can review the
 * weak parts directly.
 */
function ChapterProgressCard({ row, onClick }: { row: ChapterProgressRow; onClick: () => void }) {
  const progressPct = Math.round(row.progress * 100);
  const accuracyPct = Math.round(row.accuracy * 100);
  // Colour the accuracy pill by band so eyes catch the weak chapters first.
  const accColor =
    accuracyPct >= 80 ? 'var(--p-success)' :
    accuracyPct >= 60 ? 'var(--p-accent)' :
    'var(--p-danger)';
  const accBg =
    accuracyPct >= 80 ? 'var(--p-success-tint)' :
    accuracyPct >= 60 ? 'var(--p-accent-tint)' :
    'var(--p-danger-tint)';

  return (
    <div className="card" style={{ padding: 12, cursor: 'pointer' }} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            {row.ncertClass.replace('CLASS_', 'Class ')} · CH {row.chapterNumber}
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--p-ink)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.titleEn}
          </div>
        </div>
        <span
          className="status-chip"
          style={{ background: accBg, color: accColor, flexShrink: 0 }}
        >
          {accuracyPct}% acc
        </span>
      </div>
      <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: 'var(--p-surface-2)', overflow: 'hidden' }}>
        <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--p-primary)', borderRadius: 3 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>
        <span>{row.problemsAttempted} / {row.problemsTotal} problems</span>
        <span>{progressPct}%</span>
      </div>
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
  name, onStudy, onLearn,
}: { name: string; onStudy: () => void; onLearn: () => void }) {
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
          Pick a chapter to practice, or open a concept lesson. Your weak spots
          and progress fill in as you go.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          type="button"
          className="btn"
          onClick={onStudy}
          style={{ height: 44, fontSize: 13.5 }}
        >
          Start practice
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
