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
  const { t } = useT();
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
  const chaptersLoading = isKR ? krChapters.isLoading : ncertChapters.isLoading;
  const chaptersHasAny = isKR
    ? (krChapters.data ?? []).length > 0
    : (ncertChapters.data ?? []).length > 0;

  // Both countries use the same StudyPracticeScreen. The backend resolves the
  // country-specific LessonProblemSet and weak-area selector.
  function startPractice() {
    if (!chapter) return;
    nav(`/app/practice-set/${chapter}`);
  }

  return (
    <div className="screen">
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="app-head" style={{ paddingBottom: 0 }}>
          <div>
            <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>{t('study.tab.label')}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>{t('study.tab.title')}</div>
          </div>
          <HeadAvatar />
        </div>

        <div style={{ padding: '12px 22px 0' }}>
          <div className="section-h">
            <span className="label">{t('study.pick.section')}</span>
            <span className="more">{t('study.pick.more')}</span>
          </div>

          <div
            className="card"
            style={{ background: 'var(--p-accent-tint)', borderColor: 'transparent' }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--p-ink)', letterSpacing: '-0.005em' }}>
              {t('study.pick.title')}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--p-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              {t('study.pick.sub')}
            </div>

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
              </div>
            )}

            <button
              className="btn"
              disabled={!chapter}
              onClick={startPractice}
              style={{ marginTop: 12, height: 46, fontSize: 14 }}
            >
              {t('study.pick.startBtn')}
              <Glyph.ChevronR />
            </button>
          </div>

          {/* AI Solver lives on the Home hero only — Study stays a pure
              practice picker. */}
          <div className="section-h">
            <span className="label">{t('study.howThis.section')}</span>
          </div>
          <div className="card" style={{ padding: 14, fontSize: 13, lineHeight: 1.55, color: 'var(--p-ink-2)' }}>
            <strong style={{ color: 'var(--p-ink)' }}>{t('study.howThis.bStart')}</strong>
            {t('study.howThis.body.mid')}
            <strong style={{ color: 'var(--p-ink)' }}>{t('study.howThis.bMastery')}</strong>
            {t('study.howThis.body.post')}
            <strong style={{ color: 'var(--p-ink)' }}>{t('study.howThis.bNotes')}</strong>
            {t('study.howThis.body.tail')}
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}
