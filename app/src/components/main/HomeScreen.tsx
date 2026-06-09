/* Home screen — features-a.jsx ScreenHome ported with real backend data. */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  fetchDashboardSummary, fetchMe, fetchToday,
  fetchConceptLessonsForUnit, fetchErrorDna, fetchChapterProgress,
  fetchKoreanConceptLessons,
  type RecommendCard, type ChapterProgressRow,
  type KoreanGrade, type KoreanConceptLessonSummary, type KoreanSubject,
} from '../../lib/queries';
import { track } from '../../lib/analytics';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import { FirstAchievementModal } from './FirstAchievementModal';

const PLAN_BADGE: Record<string, { glyph: string; bg: string; fg: string }> = {
  concept: { glyph: '∫', bg: 'var(--p-primary-tint)', fg: 'var(--p-primary)' },
  practice: { glyph: 'f′', bg: 'var(--p-accent-tint)', fg: 'var(--p-ink)' },
  review: { glyph: '↻', bg: 'var(--p-danger-tint)', fg: 'var(--p-danger)' },
  mock: { glyph: '∑', bg: 'var(--p-success-tint)', fg: 'var(--p-success)' },
};

function planBadge(type: string) {
  return PLAN_BADGE[type] ?? PLAN_BADGE.concept;
}

// User's NCERT-style gradeLevel → closest Korean grade. Matches the same
// mapping LearnScreen uses so chip defaults stay aligned across surfaces.
const NCERT_TO_KR_GRADE: Record<string, KoreanGrade> = {
  CLASS_7: 'MIDDLE_1', CLASS_8: 'MIDDLE_2', CLASS_9: 'MIDDLE_3',
  CLASS_10: 'HIGH_1', CLASS_11: 'HIGH_2', CLASS_12: 'HIGH_3',
};
const KOREAN_GRADE_LABEL: Record<KoreanGrade, string> = {
  MIDDLE_1: '중1', MIDDLE_2: '중2', MIDDLE_3: '중3',
  HIGH_1: '고1', HIGH_2: '고2', HIGH_3: '고3',
};
const KOREAN_SUBJECT_LABEL: Record<KoreanSubject, string> = {
  MIDDLE_MATH_1: '수학 1',
  MIDDLE_MATH_2: '수학 2',
  MIDDLE_MATH_3: '수학 3',
  HIGH_COMMON_1: '공통수학1',
  HIGH_COMMON_2: '공통수학2',
  HIGH_ALGEBRA: '대수',
  HIGH_CALCULUS_1: '미적분Ⅰ',
  HIGH_CALCULUS_2: '미적분Ⅱ',
  HIGH_STATISTICS: '확률과 통계',
  HIGH_GEOMETRY: '기하',
};

export function HomeScreen() {
  const nav = useNavigate();
  const { t, lang } = useT();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const summary = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboardSummary });
  const today = useQuery({ queryKey: ['today'], queryFn: fetchToday });
  const errorDna = useQuery({ queryKey: ['error-dna'], queryFn: fetchErrorDna });
  const isKR = me.data?.country === 'KR';
  // chapter-progress endpoint is country-aware on the backend (I4a 2026-05-24):
  // NCERT users get ConceptLesson aggregation, KR users get KoreanConceptLesson
  // aggregation, both packed into the same ChapterProgressRow shape. Frontend
  // calls it for all logged-in users.
  const chapterProgress = useQuery({
    queryKey: ['chapter-progress'],
    queryFn: fetchChapterProgress,
    enabled: !!me.data,
  });
  // Korean chapters for KR users: pick grade from NCERT mapping (Korean users
  // currently still go through India onboarding so gradeLevel is a CLASS_N).
  const krGrade = NCERT_TO_KR_GRADE[me.data?.gradeLevel ?? 'CLASS_11'] ?? 'HIGH_2';
  const koLessons = useQuery({
    queryKey: ['home-ko-lessons', krGrade],
    queryFn: () => fetchKoreanConceptLessons({ koreanGrade: krGrade }),
    enabled: !!me.data && isKR,
  });

  // KPI: today.card.shown 로그 (impression — acceptRate 분모).
  useEffect(() => {
    const cards = today.data;
    if (!cards) return;
    track('today.cards.shown', { count: cards.length, tags: cards.map((c) => c.tag) });
  }, [today.data]);

  // 2026-05-29: adaptive entry moved off Home onto Study tab (문제풀이
  // 연습시작) per user feedback that the card overlapped with Study's
  // chapter picker. Backend endpoint stays, SoloProblemScreen sequence
  // (Sprint 3 A12) still consumes sessionStorage 'adaptive:queue'.

  const userName = me.data?.name ?? '';
  // Locale follows user lang (set by I18nCountrySync from User.country).
  // 'ko' → 'ko-KR' shows "5월 24일 일요일", everything else → 'en-IN' keeps
  // the India PoC default "Sunday, 24 May".
  const dateLocale = lang === 'ko' ? 'ko-KR' : 'en-IN';
  const dateStr = new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="screen">
      {/* Sticky greeting — frozen so "Hello, Arjun" stays visible while the
          user scrolls through Today's plan / heatmap below. */}
      <div className="app-head" style={{ flexShrink: 0 }}>
        <div className="greet">
          <div className="hello">{dateStr}</div>
          <div className="name">{t('home.greet', { name: userName.split(' ')[0] })}</div>
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
            && summary.data.streakDays === 0 && (
            <ColdStartHero
              name={userName.split(' ')[0]}
              placementChapter={today.data?.[0]?.chapterCode ?? null}
              onPlacement={(code) => nav(`/app/learn/${code}`)}
            />
          )}

          {/* Today / Streak stat grid removed per user request — the "No study
              yet" / "Start your streak" placeholders were dead weight on cold
              starts. Streak still surfaces in the 12-week heatmap header
              below, so the signal isn't lost. */}

          {/* Today's plan */}
          <div className="section-h">
            <span className="label">{t('home.today.section')}</span>
            <span className="more">{t('home.today.itemsCount', { n: today.data?.length ?? 0 })}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {today.isLoading && <Empty msg={t('home.today.loading')} />}
            {today.data && today.data.length === 0 && (
              <EmptyCta
                msg={t('home.today.emptyMsg')}
                cta={t('home.today.emptyCta')}
                onClick={() => nav('/app/learn')}
              />
            )}
            {(today.data ?? []).slice(0, 4).map((c: RecommendCard, i: number) => {
              const b = planBadge(c.type);
              const goLesson = async () => {
                // KPI 추적 — 추천 클릭. 추후 acceptRate 산출에 사용.
                track('today.card.click', {
                  unitId: c.unitId, tag: c.tag, title: c.title, type: c.type,
                  chapterCode: c.chapterCode,
                });
                if (c.chapterCode) {
                  track('today.card.opened-lesson', { chapterCode: c.chapterCode });
                  return nav(`/app/learn/${c.chapterCode}`);
                }
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
                  <span
                    className="chip"
                    style={{
                      fontSize: 10.5,
                      background: b.bg,
                      color: b.fg,
                      borderColor: 'transparent',
                      flexShrink: 0,
                    }}
                  >
                    {c.tag}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Where you slip — top error patterns */}
          {errorDna.data && errorDna.data.distribution.length > 0 && (
            <>
              <div className="section-h">
                <span className="label">{t('home.errorDna.section')}</span>
                <span className="more">{t('home.errorDna.recent30')}</span>
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

          {/* Chapter progress — same card for both NCERT and KR (backend
              I4a packs Korean shapes into the same ChapterProgressRow).
              2026-05-28: per user request, mastered (100%) chapters STAY
              visible here. Click still routes to ConceptLessonScreen so
              the learner can re-attempt; the ✓ badge from L5 carries the
              "mastered" signal in the card. The section label now splits
              "진행 중 N개 · 마스터 M개" so 100% chapters no longer get
              mis-labeled "진행 중". */}
          {(() => {
            const all = (chapterProgress.data ?? []);
            const inProgress = all.filter((row) => row.progress < 1);
            const mastered = all.filter((row) => row.progress >= 1);
            const active = all;
            // Section header always present once user data loaded. Empty
            // state vs card-list both render under the same "Chapter progress"
            // label so KR cold-start users (no attempts yet) get the EmptyCta
            // → /app/learn nudge, identical to what NCERT cold-start saw via
            // ColdStartHero. Eliminates the KR-only "browse 8 chapters" block.
            if (!me.data) return null;
            return (
              <>
                <div className="section-h">
                  <span className="label">{t('home.chapterProgress.section')}</span>
                  {active.length > 0 && (
                    <span className="more">
                      {inProgress.length > 0 && mastered.length > 0
                        ? `진행 중 ${inProgress.length} · 마스터 ${mastered.length}`
                        : inProgress.length > 0
                          ? t('home.chapterProgress.inProgress', { n: inProgress.length })
                          : `마스터 ${mastered.length}`}
                    </span>
                  )}
                </div>
                {active.length === 0 ? (
                  <EmptyCta
                    msg={t('home.chapterProgress.empty.msg')}
                    cta={t('home.chapterProgress.empty.cta')}
                    onClick={() => nav('/app/learn')}
                  />
                ) : (
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
                )}
              </>
            );
          })()}

          {/* Mastery map entry — unit heatmap + review schedule (PR-12). */}
          <div className="section-h" style={{ marginTop: 8 }}>
            <span className="label">{t('home.mastery.section')}</span>
            <button
              type="button"
              className="more"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
              onClick={() => nav('/app/mastery')}
            >
              {t('home.mastery.viewAll')} →
            </button>
          </div>
          <div
            className="card"
            style={{ padding: 14, cursor: 'pointer' }}
            onClick={() => nav('/app/mastery')}
          >
            <div style={{ fontSize: 13, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
              {t('home.mastery.desc')}
            </div>
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <FirstAchievementModal />
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
            {/* KR rows pack a KoreanGrade enum ("MIDDLE_1" / "HIGH_2_ALG") into
                ncertClass — un-localized and confusing in the UI. User decision
                2026-05-27: just drop the grade label on KR cards and keep
                only "CH N". NCERT (IN) still renders the localized class. */}
            {row.chapterCode.startsWith('K-')
              ? `CH ${row.chapterNumber}`
              : `${row.ncertClass.replace('CLASS_', 'Class ')} · CH ${row.chapterNumber}`}
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

/** Korean chapter card — lightweight Home variant of the Mastery / Learn
 *  chapter card. No progress bar (KR side has no per-chapter attempt
 *  aggregation yet — wire up when the Korean mastery rollup lands).
 *  Click → KoreanConceptLessonScreen via ConceptLessonScreen K- routing. */
function KoreanChapterCard({ lesson, onClick }: { lesson: KoreanConceptLessonSummary; onClick: () => void }) {
  return (
    <div className="card" style={{ padding: 12, cursor: 'pointer' }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          className="badge"
          style={{
            background: 'var(--p-primary-tint)', color: 'var(--p-primary)',
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, flexShrink: 0,
          }}
        >
          {lesson.chapterNumber}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            {KOREAN_SUBJECT_LABEL[lesson.koreanSubject]}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--p-ink)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lesson.titleKo}
          </div>
        </div>
        <Glyph.ChevronR accent="var(--p-muted)" size={16} />
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

/** First-impression hero — welcome banner + placement CTA (PR-22). */
function ColdStartHero({
  name,
  placementChapter,
  onPlacement,
}: {
  name: string;
  placementChapter: string | null | undefined;
  onPlacement: (chapterCode: string) => void;
}) {
  const { t } = useT();
  return (
    <div
      style={{
        marginTop: 14,
        borderRadius: 'var(--radius-lg)',
        padding: '20px 18px',
        background: 'linear-gradient(135deg, var(--p-primary-tint), var(--p-accent-tint))',
        border: '1px solid var(--p-border)',
      }}
    >
      <div className="eyebrow">{t('home.coldStart.eyebrow')}</div>
      <div
        className="display"
        style={{ marginTop: 6, fontSize: 22, lineHeight: 1.15 }}
      >
        {t('home.coldStart.title', { name })}
      </div>
      <p
        className="subtitle"
        style={{ fontSize: 13.5, marginTop: 8, maxWidth: 320 }}
      >
        {t('home.coldStart.desc')}
      </p>
      {placementChapter && (
        <button
          className="btn"
          type="button"
          onClick={() => onPlacement(placementChapter)}
          style={{ marginTop: 14, width: '100%' }}
        >
          {t('home.coldStart.cta.placement')}
          <Glyph.ChevronR />
        </button>
      )}
    </div>
  );
}
