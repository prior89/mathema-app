/* Home screen — features-a.jsx ScreenHome ported with real backend data. */
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, ImagePlus, Sparkles } from 'lucide-react';
import {
  fetchDashboardSummary, fetchMe, fetchToday,
  fetchConceptLessonsForUnit, fetchErrorDna, fetchChapterProgress,
  type RecommendCard, type ChapterProgressRow,
} from '../../lib/queries';
import { track } from '../../lib/analytics';
import { resolveBarColor } from '../../lib/palette';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import { HeadAvatar } from './HeadAvatar';
import { FirstAchievementModal } from './FirstAchievementModal';
import { CoreLoopTutorialModal } from './CoreLoopTutorialModal';
import { UploadProblemModal } from './UploadProblemModal';
import { QuotaMeter } from '../QuotaMeter';

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
  const { t, lang } = useT();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const summary = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboardSummary });
  const today = useQuery({ queryKey: ['today'], queryFn: fetchToday });
  const errorDna = useQuery({ queryKey: ['error-dna'], queryFn: fetchErrorDna });
  // chapter-progress endpoint is country-aware on the backend (I4a 2026-05-24):
  // NCERT users get ConceptLesson aggregation, KR users get KoreanConceptLesson
  // aggregation, both packed into the same ChapterProgressRow shape. Frontend
  // calls it for all logged-in users.
  const chapterProgress = useQuery({
    queryKey: ['chapter-progress'],
    queryFn: fetchChapterProgress,
    enabled: !!me.data,
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
  const isColdStart = !!(
    summary.data
    && !today.isLoading
    && summary.data.todayMinutes === 0
    && summary.data.streakDays === 0
  );

  return (
    <div className="screen tabbed-screen home-screen">
      {/* Sticky greeting — frozen so "Hello, Arjun" stays visible while the
          user scrolls through Today's plan / heatmap below. */}
      <div className="app-head" style={{ flexShrink: 0 }}>
        <div className="greet">
          <div className="hello">{dateStr}</div>
          <div className="name">{t('home.greet', { name: userName.split(' ')[0] })}</div>
          <div className="home-ready"><Sparkles size={13} />{t('home.readyBadge')}</div>
        </div>
        <HeadAvatar />
      </div>
      <div className="app-scroll" style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <div className="content-rail" style={{ padding: '0 22px' }}>

          {/* Guest upsell — progress lives on a device-bound throwaway
              account; converting keeps the same userId so nothing is lost. */}
          {me.data?.isGuest && (
            <div
              className="card"
              role="button"
              tabIndex={0}
              onClick={() => { track('guest.upgrade_banner.click'); nav('/register?upgrade=1'); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') nav('/register?upgrade=1'); }}
              style={{
                marginTop: 10, padding: '12px 14px', display: 'flex', gap: 12,
                alignItems: 'center', cursor: 'pointer',
                background: 'var(--p-primary-tint)', borderColor: 'var(--p-primary)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-ink)' }}>{t('guest.banner.title')}</div>
                <div style={{ fontSize: 12.5, color: 'var(--p-muted)', marginTop: 2 }}>{t('guest.banner.sub')}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--p-primary)', whiteSpace: 'nowrap' }}>
                {t('guest.banner.cta')}
              </span>
            </div>
          )}

          {(me.isError || summary.isError) && (
            <QueryError
              lang={lang}
              onRetry={() => {
                if (me.isError) void me.refetch();
                if (summary.isError) void summary.refetch();
              }}
            />
          )}

          {/* Cold-start hero — only when the user has zero study activity yet.
              The !today.isLoading guard prevents a flicker: when `summary`
              resolves before `today`, today.data is still undefined and the
              `?? 0 === 0` check passed, briefly showing the hero before the
              recommend cards arrived and hid it again. */}
          {isColdStart && (
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

          {/* On a true cold start the placement hero is the single learning
              CTA. Hiding the duplicate empty-plan card avoids competing first
              actions that all led to the same lesson library. */}
          {!isColdStart && (
          <>
          {/* Today's plan */}
          <div className="section-h">
            <span className="label">{t('home.today.section')}</span>
            <span className="more">{t('home.today.itemsCount', { n: today.data?.length ?? 0 })}</span>
          </div>
          <div className="mission-list" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {today.isError && <QueryError lang={lang} onRetry={() => void today.refetch()} />}
            {today.isLoading && <Empty msg={t('home.today.loading')} />}
            {!today.isError && today.data && today.data.length === 0 && (
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
                <button
                  key={i}
                  type="button"
                  className="plan-card mission-card"
                  onClick={goLesson}
                  style={{ alignItems: 'flex-start', width: '100%', textAlign: 'left', font: 'inherit' }}
                >
                  <span className="mission-glyph" style={{ background: b.bg, color: b.fg }}>{b.glyph}</span>
                  <div className="info">
                    <div className="ttl">{c.title}</div>
                    <div className="sub">{c.unit} · {c.time}</div>
                    {/* Rationale — why this card is recommended right now.
                        Urgent reasons ("immediate review needed") must not
                        render in green: green reads as success. */}
                    {c.reason && (
                      <div
                        style={{
                          fontSize: 11.5,
                          color: c.tone === 'urgent' ? 'var(--p-danger-ink)' : 'var(--p-ink-2)',
                          marginTop: 4,
                          lineHeight: 1.4,
                        }}
                      >
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
                </button>
              );
            })}
          </div>
          </>
          )}

          {/* Keep photo solving one tap away, but let the personalized mission
              own the first visual position so Home answers “what next?” before
              presenting a utility. */}
          <PhotoSolveHero />

          {/* Where you slip — top error patterns.
              Requires ≥2 categories (2026-06-12 audit): a single category
              always renders as a 100% red bar, which reads as catastrophe
              when it may be one mistake. */}
          {errorDna.data && errorDna.data.distribution.length >= 2 && (
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
          {errorDna.isError && (
            <>
              <div className="section-h">
                <span className="label">{t('home.errorDna.section')}</span>
              </div>
              <QueryError lang={lang} onRetry={() => void errorDna.refetch()} />
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
            // In-progress chapters claim the 5 visible slots first; mastered
            // ones only fill whatever is left, so a wall of 100% rows can't
            // crowd out active work (mastered chapters still stay reachable
            // per the 2026-05-28 decision).
            const active = [...inProgress, ...mastered];
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
                        ? t('home.chapterProgress.mixed', { n: inProgress.length, m: mastered.length })
                        : inProgress.length > 0
                          ? t('home.chapterProgress.inProgress', { n: inProgress.length })
                          : t('home.chapterProgress.mastered', { m: mastered.length })}
                    </span>
                  )}
                </div>
                {chapterProgress.isLoading ? (
                  <Empty msg={loadMessage(lang)} />
                ) : chapterProgress.isError ? (
                  <QueryError lang={lang} onRetry={() => void chapterProgress.refetch()} />
                ) : active.length === 0 ? (
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
          <button
            type="button"
            className="card"
            style={{ padding: 14, cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit', color: 'inherit' }}
            onClick={() => nav('/app/mastery')}
          >
            <div style={{ fontSize: 13, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
              {t('home.mastery.desc')}
            </div>
          </button>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <CoreLoopTutorialModal />
      <FirstAchievementModal />
      <TabBar />
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

function loadMessage(lang: string) {
  if (lang === 'ko') return '학습 정보를 불러오는 중이에요.';
  if (lang === 'hi') return 'सीखने की जानकारी लोड हो रही है।';
  return 'Loading your learning data…';
}

function QueryError({ lang, onRetry }: { lang: string; onRetry: () => unknown }) {
  const copy = lang === 'ko'
    ? { message: '정보를 불러오지 못했어요. 연결을 확인하고 다시 시도해 주세요.', retry: '다시 시도' }
    : lang === 'hi'
      ? { message: 'जानकारी लोड नहीं हो सकी। कनेक्शन जाँचें और फिर कोशिश करें।', retry: 'फिर कोशिश करें' }
      : { message: 'We could not load this information. Check your connection and try again.', retry: 'Try again' };
  return (
    <div className="card" role="alert" style={{ padding: 14, textAlign: 'center', color: 'var(--p-ink-2)', fontSize: 12.5 }}>
      <div>{copy.message}</div>
      <button
        type="button"
        className="btn ghost"
        onClick={() => { void onRetry(); }}
        style={{ marginTop: 10, minHeight: 38, fontSize: 12.5 }}
      >
        {copy.retry}
      </button>
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
        <div style={{ width: `${widthPct}%`, height: '100%', background: resolveBarColor(color), borderRadius: 4 }} />
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
  const { t } = useT();
  const progressPct = Math.round(row.progress * 100);
  const accuracyPct = Math.round(row.accuracy * 100);
  // Small-n suppression (2026-06-12 audit): 1 attempt out of 20 problems was
  // rendering a red "50% acc" badge — a meaningless % that reads as failure.
  // Show the accuracy pill only once there's a minimally stable sample.
  const showAccuracy = row.problemsAttempted >= 5;
  // Colour the accuracy pill by band. Red is reserved for genuinely low
  // accuracy (<50) — mid-band chapters get the neutral accent instead, so
  // the list isn't dominated by red badges.
  const accColor =
    accuracyPct >= 80 ? 'var(--p-success)' :
    accuracyPct >= 50 ? 'var(--p-accent-ink)' :
    'var(--p-danger)';
  const accBg =
    accuracyPct >= 80 ? 'var(--p-success-tint)' :
    accuracyPct >= 50 ? 'var(--p-accent-tint)' :
    'var(--p-danger-tint)';

  return (
    <button
      type="button"
      className="card"
      style={{ padding: 12, cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit', color: 'inherit' }}
      onClick={onClick}
    >
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
        {showAccuracy && (
          <span
            className="status-chip"
            style={{ background: accBg, color: accColor, flexShrink: 0 }}
          >
            {t('home.chapter.accuracy', { pct: accuracyPct })}
          </span>
        )}
      </div>
      <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: 'var(--p-surface-2)', overflow: 'hidden' }}>
        <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--p-primary)', borderRadius: 3 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>
        <span>{t('home.chapter.progress', { done: row.problemsAttempted, total: row.problemsTotal })}</span>
        <span>{progressPct}%</span>
      </div>
    </button>
  );
}

function EmptyCta({ msg, cta, onClick }: { msg: string; cta: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="card"
      onClick={onClick}
      style={{
        padding: 16, textAlign: 'center', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
        width: '100%', color: 'inherit', font: 'inherit',
      }}
    >
      <div style={{ color: 'var(--p-muted)', fontSize: 13 }}>{msg}</div>
      <span
        className="chip primary"
        style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px' }}
      >
        {cta} →
      </span>
    </button>
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
      className="cold-start-hero"
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

/** Camera-first AI Solver entry on Home. Same direct-to-camera hidden-input
 *  pattern as StudyScreen: the tap goes straight to the OS camera/gallery and
 *  UploadProblemModal opens only after a file is chosen (initialFile prop). */
function PhotoSolveHero() {
  const { t } = useT();
  const [file, setFile] = useState<File | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const onFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
    // Reset so picking the same file twice still fires onChange.
    e.target.value = '';
  };

  return (
    <div className="solver-hero">
      <div className="solver-copy">
        <div className="solver-kicker"><Sparkles size={14} />{t('home.solver.kicker')}<QuotaMeter /></div>
        <h2>{t('home.solver.title')}</h2>
        <p>{t('home.solver.desc')}</p>
      <div className="solver-actions">
        <button
          className="btn"
          type="button"
          onClick={() => {
            track('home.solver.open', { source: 'camera' });
            cameraRef.current?.click();
          }}
        >
          <Camera size={18} />
          {t('home.solver.scan')}
          <ArrowRight size={17} />
        </button>
        <button
          className="btn outline"
          type="button"
          onClick={() => {
            track('home.solver.open', { source: 'gallery' });
            galleryRef.current?.click();
          }}
        >
          <ImagePlus size={17} />{t('home.solver.upload')}
        </button>
      </div>
      </div>
      <div className="solver-visual" aria-hidden="true">
        <span className="formula-chip formula-a">x² + 3x</span>
        <span className="formula-chip formula-b">√25 = 5</span>
        <span className="camera-orb"><Camera size={35} /></span>
        <span className="scan-line" />
      </div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileChosen}
        style={{ display: 'none' }}
        aria-hidden
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={onFileChosen}
        style={{ display: 'none' }}
        aria-hidden
      />
      <UploadProblemModal
        open={!!file}
        onClose={() => setFile(null)}
        initialFile={file}
      />
    </div>
  );
}
