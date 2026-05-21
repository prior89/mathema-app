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
import { ReactNode, useRef, useState } from 'react';
import { fetchConceptLessons } from '../../lib/queries';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import { UploadProblemModal } from './UploadProblemModal';

const CLASS_SHORT: Record<string, string> = {
  CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
  CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
};

export function StudyScreen() {
  const nav = useNavigate();
  const [chapter, setChapter] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  // AI Solver -- each button owns its own native <input type="file"> so the
  // taps go DIRECTLY to the camera or to the gallery (no intermediate modal
  // picker). The modal opens only AFTER a file is chosen, with that file
  // already loaded via the initialFile prop.
  const [solverFile, setSolverFile] = useState<File | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const onFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setSolverFile(f);
    // Reset so picking the same file twice still fires onChange.
    e.target.value = '';
  };

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

  // Study is stateless one-at-a-time — StudyPracticeScreen owns the fetch
  // loop. Just navigate with the chapter code; the screen mounts and
  // pulls its first problem from POST /mock-exams/chapter/:code/next.
  function startPractice() {
    if (!chapter) return;
    setMsg(null);
    nav(`/app/practice-set/${chapter}`);
  }

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
            <span className="more">Solve at your pace</span>
          </div>

          <div
            className="card"
            style={{ background: 'var(--p-accent-tint)', borderColor: 'transparent' }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--p-ink)', letterSpacing: '-0.005em' }}>
              Practice one at a time
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--p-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              Solve · Next · Solve · Next — keep going as long as you like
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
              disabled={!chapter}
              onClick={startPractice}
              style={{ marginTop: 12, height: 46, fontSize: 14 }}
            >
              Start practice
              <Glyph.ChevronR />
            </button>
          </div>

          {msg && (
            <div className="card" style={{ marginTop: 10, padding: 12, fontSize: 12.5, color: 'var(--p-ink-2)' }}>
              {msg}
            </div>
          )}

          {/* AI Solver -- snap a problem from a textbook or photo and the
              math-helper pipeline (Mathpix OCR -> LangGraph solver) returns a
              step-by-step solution + lifts the problem into the user's pool. */}
          <div className="section-h">
            <span className="label">AI Solver</span>
            <span className="more">Stuck? Snap it.</span>
          </div>
          <div className="card" style={{ padding: 14, background: 'var(--p-primary-tint)', borderColor: 'transparent' }}>
            <div style={{ fontSize: 12.5, color: 'var(--p-ink-2)', marginBottom: 12, lineHeight: 1.5 }}>
              Photograph any problem and we'll solve it step-by-step.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <SolverButton
                label="Take a photo"
                hint="Open the camera"
                onClick={() => cameraInputRef.current?.click()}
                icon={
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 7h3l2-3h8l2 3h3v12H3z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                }
              />
              <SolverButton
                label="Upload"
                hint="Pick a file"
                onClick={() => galleryInputRef.current?.click()}
                icon={
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 4v12" />
                    <path d="M7 9l5-5 5 5" />
                    <path d="M5 20h14" />
                  </svg>
                }
              />
            </div>
            {/* Hidden native inputs -- each button triggers its specific
                intent. `capture="environment"` makes Android/iOS open the
                rear camera instead of the gallery picker; omitting it on
                the second input gives the gallery (with PDFs too). */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFileChosen}
              style={{ display: 'none' }}
              aria-hidden
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={onFileChosen}
              style={{ display: 'none' }}
              aria-hidden
            />
          </div>

          {/* How this works moved below the AI Solver so the heading reads as
              "you've seen the two paths -- here's the contract behind them". */}
          <div className="section-h">
            <span className="label">How this works</span>
          </div>
          <div className="card" style={{ padding: 14, fontSize: 13, lineHeight: 1.55, color: 'var(--p-ink-2)' }}>
            Get one wrong and it joins your <strong style={{ color: 'var(--p-ink)' }}>Notes</strong>{' '}
            for a future weekly review. For problems outside the pool, snap them
            with the AI Solver above and we'll add them to your library.
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <UploadProblemModal
        open={!!solverFile}
        onClose={() => setSolverFile(null)}
        initialFile={solverFile}
      />
      <TabBar />
    </div>
  );
}

function SolverButton({ label, hint, icon, onClick }: {
  label: string; hint: string; icon: ReactNode; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'var(--p-surface)',
        border: '1px solid var(--p-border)',
        borderRadius: 12,
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        cursor: 'pointer',
        textAlign: 'left',
        color: 'var(--p-ink)',
        transition: 'border-color 120ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--p-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--p-border)'; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: 'var(--p-primary)',
        color: 'var(--p-primary-fg, #fff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 11.5, color: 'var(--p-muted)' }}>{hint}</div>
    </button>
  );
}
