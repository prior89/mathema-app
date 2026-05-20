/* ReviewQueueScreen — FIFO + 3-day-cooldown wrong-note review.
 *
 * Shows exactly one problem at a time. The student writes their working in
 * the handwriting canvas (scratch only — not graded), types the final answer
 * into the text box, and taps Check. Right answers mark the wrong-note
 * mastered and advance the queue; wrong answers stay on the same problem.
 *
 * After three wrong submits on the same problem the Hint button unlocks so
 * the student isn't stuck forever, but the hint is only a one-line nudge —
 * no full solution reveal. This is the deliberate forced-sequential design
 * the user spec'd.
 */
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProblemHint, fetchReviewQueueNext } from '../../lib/queries';
import { checkReviewAnswer } from '../../lib/mutations';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';
import { HandwritingCanvas, type HandwritingCanvasHandle } from '../HandwritingCanvas';

const HINT_UNLOCK_AFTER = 3; // wrong submits before Hint button activates

export function ReviewQueueScreen() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const queue = useQuery({ queryKey: ['queue-next'], queryFn: fetchReviewQueueNext });

  // Per-problem local state. Cleared whenever the queue advances to a new
  // wrong note (key change in JSX resets the sub-component).
  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button
            onClick={() => nav('/app/test')}
            aria-label="Back"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              REVIEW QUEUE
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {queue.data?.wrongNote
                ? `${queue.data.totalEligible} ready`
                : queue.data
                  ? 'Caught up'
                  : 'Loading…'}
            </div>
          </div>
        </div>
      </div>

      {queue.isLoading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-muted)' }}>
          Loading review…
        </div>
      )}

      {queue.data && !queue.data.wrongNote && (
        <EmptyState nextEligibleAt={queue.data.nextEligibleAt} onBack={() => nav('/app/test')} />
      )}

      {queue.data?.wrongNote && (
        <ActiveProblem
          key={queue.data.wrongNote.wrongNoteId}
          note={queue.data.wrongNote}
          onMastered={async () => {
            // Mirror SoloProblemScreen's invalidate set — a MASTERED wrong
            // note also changes Home dashboard (streak / today minutes /
            // weekly accuracy), heatmap, chapter-progress, and the wn-recent
            // / wn-due lists rendered elsewhere. Earlier only the queue +
            // notes-list + wn-stats refreshed, so Home stayed stale until
            // a route change.
            await Promise.all([
              qc.invalidateQueries({ queryKey: ['queue-next'] }),
              qc.invalidateQueries({ queryKey: ['wn-list'] }),
              qc.invalidateQueries({ queryKey: ['wn-stats'] }),
              qc.invalidateQueries({ queryKey: ['wn-recent'] }),
              qc.invalidateQueries({ queryKey: ['wn-due'] }),
              qc.invalidateQueries({ queryKey: ['dashboard'] }),
              qc.invalidateQueries({ queryKey: ['heatmap'] }),
              qc.invalidateQueries({ queryKey: ['chapter-progress'] }),
            ]);
          }}
        />
      )}

      <TabBar />
    </div>
  );
}

// ───────── Empty state ─────────

function EmptyState({ nextEligibleAt, onBack }: { nextEligibleAt: string | null; onBack: () => void }) {
  let countdown: string | null = null;
  if (nextEligibleAt) {
    const ms = new Date(nextEligibleAt).getTime() - Date.now();
    if (ms > 0) {
      const h = Math.floor(ms / 3_600_000);
      const d = Math.floor(h / 24);
      countdown = d > 0 ? `${d} day${d === 1 ? '' : 's'}` : `${h} hour${h === 1 ? '' : 's'}`;
    }
  }
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-primary)' }}>✓</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--p-ink)' }}>All caught up.</div>
      <p style={{ fontSize: 13.5, color: 'var(--p-ink-2)', lineHeight: 1.5, maxWidth: 320, margin: '0 auto' }}>
        {countdown
          ? `Your next review unlocks in ${countdown}. Wrong notes ripen for three days so you have time to re-read the concept before re-trying.`
          : 'No wrong notes are waiting. Practice a chapter in Study to fill the queue.'}
      </p>
      <button
        className="btn"
        onClick={onBack}
        style={{ maxWidth: 240, alignSelf: 'center', marginTop: 8 }}
      >
        Back to Test
        <Glyph.ChevronR />
      </button>
    </div>
  );
}

// ───────── Active problem (canvas + answer) ─────────

function ActiveProblem({
  note, onMastered,
}: {
  note: {
    wrongNoteId: string;
    problemId: string;
    problemBody: string;
    source: string;
    hint: string | null;
    occurrences: number;
  };
  onMastered: () => Promise<void> | void;
}) {
  const canvasRef = useRef<HandwritingCanvasHandle>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ kind: 'correct' | 'wrong'; msg: string } | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintRevealed, setHintRevealed] = useState(false);
  // Wall-clock time spent on this problem — passed to the server so
  // DailyActivity.durationMin reflects real engagement rather than a
  // hardcoded constant. Reset whenever the wrong-note key changes.
  const startedAtRef = useRef<number>(Date.now());

  const hintQuery = useQuery({
    queryKey: ['problem-hint', note.problemId],
    queryFn: () => fetchProblemHint(note.problemId),
    enabled: hintRevealed,
  });

  const check = useMutation({
    mutationFn: () => checkReviewAnswer(note.wrongNoteId, {
      answer: studentAnswer,
      durationSec: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
    }),
    onSuccess: async (r) => {
      if (r.isCorrect) {
        setFeedback({ kind: 'correct', msg: '✓ Correct — moving to the next.' });
        setTimeout(async () => { await onMastered(); }, 700);
      } else {
        const next = wrongCount + 1;
        setWrongCount(next);
        setFeedback({
          kind: 'wrong',
          msg: next >= HINT_UNLOCK_AFTER
            ? 'Not quite. Hint unlocked — tap the 💡 to see a nudge.'
            : 'Not quite. Try again.',
        });
      }
    },
    onError: () => {
      setFeedback({ kind: 'wrong', msg: 'Could not submit — try again in a moment.' });
    },
  });

  const hintUnlocked = wrongCount >= HINT_UNLOCK_AFTER;
  // Prefer DB hint when present, else fall back to the on-demand /problems/:id/hint endpoint.
  const hintText = note.hint ?? hintQuery.data?.hint ?? null;

  function onCheck() {
    if (!studentAnswer.trim() || check.isPending) return;
    check.mutate();
  }

  function onHintClick() {
    if (!hintUnlocked) return;
    setHintRevealed(true);
  }

  return (
    <>
      {/* Scrollable middle — problem body + canvas + feedback */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
          <div className="eyebrow" style={{ fontSize: 10 }}>PROBLEM · {note.source}</div>
          <div className="math-big" style={{ fontSize: 16, marginTop: 6, whiteSpace: 'pre-wrap' }}>
            <MathText text={note.problemBody} />
          </div>
          {note.occurrences > 1 && (
            <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
              SEEN {note.occurrences}× · 3-day cooldown done
            </div>
          )}
        </div>

        <div>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>WORKINGS</div>
          <HandwritingCanvas ref={canvasRef} height={420} extendable />
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button
              type="button"
              className="btn outline"
              onClick={() => canvasRef.current?.undo()}
              style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}
            >
              Undo
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => canvasRef.current?.clear()}
              style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}
            >
              Clear
            </button>
          </div>
        </div>

        {hintRevealed && hintText && (
          <div
            className="card"
            style={{ padding: 12, background: 'var(--p-accent-tint)', borderColor: 'transparent' }}
          >
            <div className="eyebrow" style={{ fontSize: 10 }}>HINT</div>
            <div style={{ fontSize: 13, color: 'var(--p-ink)', marginTop: 4, lineHeight: 1.5 }}>
              <MathText text={hintText} />
            </div>
          </div>
        )}

        {feedback && (
          <div
            className="card"
            style={{
              padding: 10, fontSize: 13,
              background: feedback.kind === 'correct' ? 'var(--p-success-tint)' : 'var(--p-danger-tint)',
              color: feedback.kind === 'correct' ? 'var(--p-success)' : 'var(--p-danger)',
              borderColor: 'transparent',
              fontWeight: 600,
            }}
          >
            {feedback.msg}
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>

      {/* Sticky bottom — hint + answer input + check */}
      <div className="screen-foot" style={{ paddingTop: 8 }}>
        <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>ANSWER</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            onClick={onHintClick}
            disabled={!hintUnlocked}
            aria-label="Hint"
            style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: hintUnlocked ? 'var(--p-primary-tint)' : 'var(--p-surface-2)',
              color: hintUnlocked ? 'var(--p-primary)' : 'var(--p-muted)',
              border: '1px solid var(--p-border)',
              cursor: hintUnlocked ? 'pointer' : 'not-allowed',
              fontSize: 18,
            }}
          >
            💡
          </button>
          <input
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder="Type the final answer…"
            onKeyDown={(e) => { if (e.key === 'Enter') onCheck(); }}
            style={{
              flex: 1, height: 44, padding: '0 14px', borderRadius: 12,
              border: '1px solid var(--p-border-strong)', background: 'var(--p-surface)',
              color: 'var(--p-ink)', fontFamily: 'inherit', fontSize: 15, outline: 'none',
            }}
          />
          <button
            type="button"
            className="btn"
            onClick={onCheck}
            disabled={!studentAnswer.trim() || check.isPending}
            style={{ width: 'auto', height: 44, padding: '0 18px', fontSize: 14, flexShrink: 0 }}
          >
            {check.isPending ? '…' : 'Check'}
          </button>
        </div>
      </div>
    </>
  );
}
