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
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { fetchConceptLessons } from '../../lib/queries';
import { startChapterTest } from '../../lib/mutations';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

const CLASS_SHORT: Record<string, string> = {
  CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
  CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
};

export function StudyScreen() {
  const nav = useNavigate();
  const [chapter, setChapter] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  // Fetch every chapter the user has access to (all classes). The mastered
  // flag in the response decides eligibility — no client-side class filter.
  const chapters = useQuery({
    queryKey: ['concept-lessons', 'all'],
    queryFn: () => fetchConceptLessons(),
  });
  const eligibleChapters = (chapters.data ?? [])
    .filter((c) => c.mastered)
    // Sort by class then chapter number so Class 7 → Class 12 reads naturally.
    .sort((a, b) => {
      if (a.ncertClass !== b.ncertClass) return a.ncertClass.localeCompare(b.ncertClass);
      return a.chapterNumber - b.chapterNumber;
    });

  const start = useMutation({
    mutationFn: () => startChapterTest(chapter),
    onSuccess: (r) => {
      if (!r.resultId || r.problems.length === 0) {
        setMsg("You've already solved every problem in this chapter — pick another to keep going.");
        return;
      }
      // `origin: study` so the play / result screens know where Back goes.
      nav(`/app/mocks/play/${r.resultId}`, { state: { ...r, origin: 'study' } });
    },
    onError: (e: any) => setMsg(`Could not start: ${e?.response?.data?.error?.message ?? 'backend error'}`),
  });

  return (
    <div className="screen">
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="app-head" style={{ paddingBottom: 0 }}>
          <div>
            <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>Practice</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>Study</div>
          </div>
        </div>

        <div style={{ padding: '12px 22px 0' }}>
          <div className="section-h">
            <span className="label">Pick a chapter</span>
            <span className="more">20 questions · ~25 min</span>
          </div>

          <div
            className="card"
            style={{ background: 'var(--p-accent-tint)', borderColor: 'transparent', opacity: start.isPending ? 0.5 : 1 }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--p-ink)', letterSpacing: '-0.005em' }}>
              {start.isPending ? 'Building your set…' : 'New 20 questions'}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--p-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              From problems you've never seen
            </div>

            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              disabled={chapters.isLoading}
              aria-label="Chapter"
              style={{
                width: '100%', boxSizing: 'border-box', marginTop: 10,
                padding: '10px 12px', borderRadius: 10,
                border: '1px solid var(--p-border-strong)',
                background: 'var(--p-surface)', color: 'var(--p-ink)',
                font: 'inherit', fontSize: 14,
              }}
            >
              <option value="">
                {chapters.isLoading
                  ? 'Loading chapters…'
                  : (eligibleChapters.length > 0
                      ? 'Pick a chapter'
                      : 'Master a chapter in Mastery to unlock')}
              </option>
              {eligibleChapters.map((c) => (
                <option key={c.chapterCode} value={c.chapterCode}>
                  {CLASS_SHORT[c.ncertClass] ?? c.ncertClass} · CH {c.chapterNumber}. {c.title}
                </option>
              ))}
            </select>

            {/* Empty-state nudge — when the user has no mastered chapters in
                ANY class, point at the Mastery tab so they know where to
                unlock practice. */}
            {!chapters.isLoading && eligibleChapters.length === 0 && (chapters.data ?? []).length > 0 && (
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
                Finish the concept lesson for any chapter in{' '}
                <strong style={{ color: 'var(--p-ink)' }}>Mastery</strong>{' '}
                first — that unlocks it here, regardless of class.
              </div>
            )}

            <button
              className="btn"
              disabled={!chapter || start.isPending}
              onClick={() => start.mutate()}
              style={{ marginTop: 12, height: 46, fontSize: 14 }}
            >
              {start.isPending ? 'Generating…' : 'Start practice'}
              <Glyph.ChevronR />
            </button>
          </div>

          {msg && (
            <div className="card" style={{ marginTop: 10, padding: 12, fontSize: 12.5, color: 'var(--p-ink-2)' }}>
              {msg}
            </div>
          )}

          <div className="section-h">
            <span className="label">How this works</span>
          </div>
          <div className="card" style={{ padding: 14, fontSize: 13, lineHeight: 1.55, color: 'var(--p-ink-2)' }}>
            Every set is drawn from a shared pool of problems other students have
            solved. You'll never see the same problem twice. Get one wrong and
            it joins your <strong style={{ color: 'var(--p-ink)' }}>Notes</strong>{' '}
            for a future weekly review.
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}
