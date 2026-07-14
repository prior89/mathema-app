/* Study tab — pool-first practice picker.
 *
 * Flow: pick a mastered chapter (any class) → backend draws up to 20 problems
 * from the shared pool that THIS user has never attempted →
 * MockExamPlayScreen takes over. No user re-sees the same problem; every
 * solver earns a clean problem pool.
 *
 * Mastery — not class match — is the only gate. A Class 11 student who has
 * cleared a Class 9 review chapter sees that chapter here too. Backend
 * /mock-exams/chapter/:code/start checks ConceptProgress.masteredAt and
 * rejects unmastered chapters regardless of grade.
 */
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, BookOpenCheck, Dumbbell, NotebookTabs, Target } from 'lucide-react';
import {
  fetchConceptLessons, fetchKoreanConceptLessons, fetchMe,
} from '../../lib/queries';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import { HeadAvatar } from './HeadAvatar';

const CLASS_SHORT: Record<string, string> = {
  CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
  CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
};

export function StudyScreen() {
  const nav = useNavigate();
  const { t, lang } = useT();
  const [chapter, setChapter] = useState('');

  // Country-aware chapter fetch (2026-05-24 user spec: KR mastered chapters
  // also surface in Study). NCERT side: practice-set route → StudyPracticeScreen
  // (single-MC + handwriting). KR side: navigate back to ConceptLessonScreen
  // → KoreanPracticePhase (multi-step Q1부터, mastered 후 다시 풀기 모드 —
  // detail() nextProblemId=null when mastered so startProblemId=null → Q1).
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const isKR = me.data?.country === 'KR';

  const ncertChapters = useQuery({
    queryKey: ['concept-lessons', 'all'],
    queryFn: () => fetchConceptLessons(),
    enabled: !!me.data && !isKR,
  });
  const krChapters = useQuery({
    queryKey: ['ko-lessons', 'all'],
    queryFn: () => fetchKoreanConceptLessons(),
    enabled: !!me.data && isKR,
  });

  type EligibleChapter = { chapterCode: string; label: string; sortKey: string };
  const eligibleChapters: EligibleChapter[] = (() => {
    if (isKR) {
      return (krChapters.data ?? [])
        .filter((c) => c.mastered)
        .sort((a, b) =>
          a.koreanGrade !== b.koreanGrade
            ? a.koreanGrade.localeCompare(b.koreanGrade)
            : a.chapterNumber - b.chapterNumber,
        )
        .map((c) => ({
          chapterCode: c.chapterCode,
          label: `${c.titleKo} · ${c.chapterNumber}단원`,
          sortKey: `${c.koreanGrade}-${c.chapterNumber}`,
        }));
    }
    return (ncertChapters.data ?? [])
      .filter((c) => c.mastered)
      .sort((a, b) => {
        if (a.ncertClass !== b.ncertClass) return a.ncertClass.localeCompare(b.ncertClass);
        return a.chapterNumber - b.chapterNumber;
      })
      .map((c) => ({
        chapterCode: c.chapterCode,
        label: t('study.pick.chapterOption', {
          n: (CLASS_SHORT[c.ncertClass] ?? c.ncertClass).replace('Class ', ''),
          ch: c.chapterNumber,
          title: c.title,
        }),
        sortKey: `${c.ncertClass}-${c.chapterNumber}`,
      }));
  })();
  const chaptersLoading = me.isLoading || (isKR ? krChapters.isLoading : ncertChapters.isLoading);
  const chaptersError = me.isError || (isKR ? krChapters.isError : ncertChapters.isError);
  const chaptersHasAny = isKR
    ? (krChapters.data ?? []).length > 0
    : (ncertChapters.data ?? []).length > 0;

  // Both countries use the same StudyPracticeScreen. The backend resolves the
  // country-specific LessonProblemSet and weak-area selector.
  function startPractice() {
    if (!chapter) return;
    nav(`/app/practice-set/${chapter}`);
  }

  function retryChapters() {
    if (me.isError || !me.data) {
      void me.refetch();
      return;
    }
    if (isKR) void krChapters.refetch();
    else void ncertChapters.refetch();
  }

  return (
    <div className="screen tabbed-screen study-screen">
      <div className="app-scroll" style={{ flex: 1, overflow: 'auto' }}>
        <div className="app-head" style={{ paddingBottom: 0 }}>
          <div>
            <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>{t('study.tab.label')}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>{t('study.tab.title')}</div>
          </div>
          <HeadAvatar />
        </div>

        <div className="content-rail" style={{ padding: '12px 22px 0' }}>
          <div className="practice-intro">
            <div>
              <span className="story-kicker"><Target size={14} />{t('study.hero.kicker')}</span>
              <h2>{t('study.hero.title')}</h2>
              <p>{t('study.hero.desc')}</p>
            </div>
            <span className="practice-orb" aria-hidden="true"><Dumbbell size={30} /></span>
          </div>
          <div className="section-h">
            <span className="label">{t('study.pick.section')}</span>
            <span className="more">{t('study.pick.more')}</span>
          </div>

          <div
            className="card practice-launch-card"
            style={{ background: 'var(--p-accent-tint)', borderColor: 'transparent' }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--p-ink)', letterSpacing: '-0.005em' }}>
              {t('study.pick.title')}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--p-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              {t('study.pick.sub')}
            </div>

            {chaptersError ? (
              <QueryError lang={lang} onRetry={retryChapters} />
            ) : (
              <>
                <select
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  disabled={chaptersLoading}
                  aria-label={t('study.pick.chapterAria')}
                  style={{
                    width: '100%', boxSizing: 'border-box', marginTop: 10,
                    padding: '10px 12px', borderRadius: 10,
                    border: '1px solid var(--p-border-strong)',
                    background: 'var(--p-surface)', color: 'var(--p-ink)',
                    font: 'inherit', fontSize: 14,
                  }}
                >
                  <option value="">
                    {chaptersLoading
                      ? t('study.pick.loadingChapters')
                      : (eligibleChapters.length > 0
                          ? t('study.pick.placeholder')
                          : t('study.pick.lockedHint'))}
                  </option>
                  {eligibleChapters.map((c) => (
                    <option key={c.chapterCode} value={c.chapterCode}>
                      {c.label}
                    </option>
                  ))}
                </select>

                {/* Empty-state nudge — when the user has no mastered chapters in
                    ANY class, point at the Mastery tab so they know where to
                    unlock practice. */}
                {!chaptersLoading && eligibleChapters.length === 0 && chaptersHasAny && (
                  <div style={{ marginTop: 10, fontSize: 12, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
                    {t('study.pick.emptyMastered.pre')}
                    <strong style={{ color: 'var(--p-ink)' }}>{t('study.pick.emptyMastered.tab')}</strong>
                    {t('study.pick.emptyMastered.post')}
                    {/* Make the nudge actionable instead of a read-only dead-end. */}
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => nav('/app/learn')}
                      style={{ marginTop: 10, width: '100%', height: 40, fontSize: 13 }}
                    >
                      {t('study.pick.emptyMastered.cta')}
                      <Glyph.ChevronR />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="btn"
                  disabled={!chapter || chaptersLoading}
                  onClick={startPractice}
                  style={{ marginTop: 12, height: 46, fontSize: 14 }}
                >
                  {t('study.pick.startBtn')}
                  <ArrowRight size={17} />
                </button>
              </>
            )}
          </div>

          {/* AI Solver lives on the Home hero only — Study stays a pure
              practice picker. */}
          <div className="section-h">
            <span className="label">{t('study.howThis.section')}</span>
          </div>
          <div className="practice-steps">
            <div><BookOpenCheck size={20} /><b>{t('study.steps.one.title')}</b><span>{t('study.steps.one.desc')}</span></div>
            <div><Dumbbell size={20} /><b>{t('study.steps.two.title')}</b><span>{t('study.steps.two.desc')}</span></div>
            <div><NotebookTabs size={20} /><b>{t('study.steps.three.title')}</b><span>{t('study.steps.three.desc')}</span></div>
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}

function QueryError({ lang, onRetry }: { lang: string; onRetry: () => unknown }) {
  const copy = lang === 'ko'
    ? { message: '연습할 단원을 불러오지 못했어요. 연결을 확인하고 다시 시도해 주세요.', retry: '다시 시도' }
    : lang === 'hi'
      ? { message: 'अभ्यास के अध्याय लोड नहीं हो सके। कनेक्शन जाँचें और फिर कोशिश करें।', retry: 'फिर कोशिश करें' }
      : { message: 'We could not load the practice chapters. Check your connection and try again.', retry: 'Try again' };
  return (
    <div role="alert" style={{ marginTop: 12, textAlign: 'center', color: 'var(--p-ink-2)', fontSize: 12.5 }}>
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
