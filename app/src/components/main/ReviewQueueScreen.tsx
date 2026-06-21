/* ReviewQueueScreen — FIFO + 3-day-cooldown wrong-note review.
 *
 * Shows exactly one problem at a time. Format (2026-06-15 user spec change):
 * single-step 5-choice multiple-choice (matches the Study tab) on top of a
 * scratch handwriting canvas — was free-text input before. Right answers
 * mark the wrong-note mastered and advance the queue; wrong answers stay
 * on the same problem.
 *
 * After three wrong submits on the same problem the Hint button unlocks so
 * the student isn't stuck forever, but the hint is only a one-line nudge —
 * no full solution reveal. This is the deliberate forced-sequential design
 * the user spec'd.
 */
import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProblem, fetchProblemHint, fetchReviewQueueNext } from '../../lib/queries';
import { checkReviewAnswer, reviewWrongNote, type ReviewQuality } from '../../lib/mutations';
import { Sm2ReviewButtons } from './Sm2ReviewButtons';
import { toast } from '../Toast';
import { useT } from '../../lib/i18n';
import { useShuffledChoices } from '../../lib/shuffle';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';
import { HandwritingCanvas, type HandwritingCanvasHandle } from '../HandwritingCanvas';

const CHOICE_LETTERS = ['A', 'B', 'C', 'D', 'E'];

const HINT_UNLOCK_AFTER = 3; // wrong submits before Hint button activates

export function ReviewQueueScreen() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { t } = useT();

  const queue = useQuery({ queryKey: ['queue-next'], queryFn: fetchReviewQueueNext });

  // Per-problem local state. Cleared whenever the queue advances to a new
  // wrong note (key change in JSX resets the sub-component).
  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button
            onClick={() => nav('/app/test')}
            aria-label={t('review.back')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              {t('review.eyebrow')}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {queue.data?.wrongNote
                ? t('review.ready', { n: queue.data.totalEligible })
                : queue.data
                  ? t('review.caughtUp')
                  : t('review.loading')}
            </div>
          </div>
        </div>
      </div>

      {queue.isLoading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-muted)' }}>
          {t('review.loadingScreen')}
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
  const { t } = useT();
  let countdown: string | null = null;
  if (nextEligibleAt) {
    const ms = new Date(nextEligibleAt).getTime() - Date.now();
    if (ms > 0) {
      const h = Math.floor(ms / 3_600_000);
      const d = Math.floor(h / 24);
      countdown = d > 0 ? t('test.duration.days', { n: d }) : t('test.duration.hours', { n: h });
    }
  }
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-primary)' }}>✓</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--p-ink)' }}>{t('review.empty.icon.title')}</div>
      <p style={{ fontSize: 13.5, color: 'var(--p-ink-2)', lineHeight: 1.5, maxWidth: 320, margin: '0 auto' }}>
        {countdown
          ? t('review.empty.body.countdown', { countdown })
          : t('review.empty.body.none')}
      </p>
      <button
        className="btn"
        onClick={onBack}
        style={{ maxWidth: 240, alignSelf: 'center', marginTop: 8 }}
      >
        {t('review.empty.back')}
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
  const { t } = useT();
  const canvasRef = useRef<HandwritingCanvasHandle>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: 'correct' | 'wrong'; msg: string } | null>(null);
  const [showSm2, setShowSm2] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintRevealed, setHintRevealed] = useState(false);
  // Wall-clock time spent on this problem — passed to the server so
  // DailyActivity.durationMin reflects real engagement rather than a
  // hardcoded constant. Reset whenever the wrong-note key changes.
  const startedAtRef = useRef<number>(Date.now());

  // Pull the full Problem so we can render the ANSWER step's 5-choice MC
  // (Study-tab format, applied to wrong-note review as of 2026-06-15).
  const problemQuery = useQuery({
    queryKey: ['problem', note.problemId],
    queryFn: () => fetchProblem(note.problemId),
  });
  const answerStep = useMemo(
    () => problemQuery.data?.steps?.find((s) => s.stepType === 'ANSWER') ?? null,
    [problemQuery.data],
  );
  const shuffledChoices = useShuffledChoices(answerStep?.choices ?? []);
  const pickedChoice = shuffledChoices.find((c) => c.id === pickedId) ?? null;

  const hintQuery = useQuery({
    queryKey: ['problem-hint', note.problemId],
    queryFn: () => fetchProblemHint(note.problemId),
    enabled: hintRevealed,
  });

  const check = useMutation({
    mutationFn: () => checkReviewAnswer(note.wrongNoteId, {
      // The server still grades on string match against problem.answer;
      // shipping the picked choice's text keeps the existing pipeline
      // intact (no schema or endpoint change required).
      answer: pickedChoice?.text ?? '',
      durationSec: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
    }),
    onSuccess: async (r) => {
      if (r.isCorrect) {
        setFeedback({ kind: 'correct', msg: t('review.correct') });
        setShowSm2(true);
      } else {
        const next = wrongCount + 1;
        setWrongCount(next);
        setFeedback({
          kind: 'wrong',
          msg: next >= HINT_UNLOCK_AFTER
            ? t('review.wrong.unlock')
            : t('review.wrong.retry'),
        });
      }
    },
    onError: () => {
      setFeedback({ kind: 'wrong', msg: t('review.submit.failed') });
    },
  });

  const hintUnlocked = wrongCount >= HINT_UNLOCK_AFTER;
  // Prefer DB hint when present, else fall back to the on-demand /problems/:id/hint endpoint.
  const hintText = note.hint ?? hintQuery.data?.hint ?? null;

  const sm2 = useMutation({
    mutationFn: (q: ReviewQuality) => reviewWrongNote(note.wrongNoteId, q),
    onSuccess: async (r) => {
      const days = r.nextReviewAt
        ? Math.max(1, Math.ceil((new Date(r.nextReviewAt).getTime() - Date.now()) / 86400000))
        : 0;
      const next = days > 0 ? t('wn.due.inDays', { days }) : '—';
      if (r.autoMastered) toast(t('toast.review.autoMastered'), 'success');
      else if (r.lapsed) toast(t('toast.review.tryAgain', { date: next }), 'info');
      else toast(t('toast.review.done', { date: next }), 'success');
      await onMastered();
    },
    onError: () => toast(t('toast.review.failed'), 'error'),
  });

  function onCheck() {
    if (!pickedChoice || check.isPending || showSm2) return;
    check.mutate();
  }
  function onPick(id: string) {
    // Allow re-pick after a wrong attempt without leaving the previous
    // feedback card stuck on the new selection.
    if (check.isPending || showSm2) return;
    if (feedback?.kind === 'wrong') setFeedback(null);
    setPickedId(id);
  }

  function onHintClick() {
    if (!hintUnlocked) return;
    setHintRevealed(true);
  }

  return (
    <>
      {/* Scrollable middle — problem body + canvas + feedback */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
          padding: '14px 22px 132px',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
          {/* Attribution (note.source) intentionally not rendered. */}
          <div className="math-big" style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>
            <MathText text={note.problemBody} />
          </div>
          {note.occurrences > 1 && (
            <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
              {t('review.seen', { n: note.occurrences })}
            </div>
          )}
        </div>

        <div>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>{t('review.workingsEyebrow')}</div>
          <HandwritingCanvas ref={canvasRef} height={240} extendable />
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button
              type="button"
              className="btn outline"
              onClick={() => canvasRef.current?.undo()}
              style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}
            >
              {t('review.undo')}
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => canvasRef.current?.clear()}
              style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}
            >
              {t('review.clear')}
            </button>
          </div>
        </div>

        {/* 5-choice MC (Study-tab format). Kept INSIDE the scroll body with the
         *  canvas so a single swipe scrolls problem + canvas + choices together
         *  — mirrors the Study / Solo screens. (Was previously a sibling of the
         *  scroll area, which squeezed the canvas and split the gesture.) */}
        {!showSm2 && shuffledChoices.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, touchAction: 'pan-y' }}>
            {shuffledChoices.map((c, i) => {
              const isPicked = pickedId === c.id;
              const isCorrectReveal = feedback?.kind === 'correct' && isPicked;
              const isWrongPick = feedback?.kind === 'wrong' && isPicked;
              const cls = isCorrectReveal ? 'choice correct' : isWrongPick ? 'choice wrong' : isPicked ? 'choice selected' : 'choice';
              return (
                <div
                  key={c.id}
                  className={cls}
                  role="button"
                  tabIndex={0}
                  onClick={() => onPick(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onPick(c.id);
                  }}
                >
                  <div className="letter">{CHOICE_LETTERS[i] ?? c.choiceIndex}</div>
                  <span className="text"><MathText text={c.text} /></span>
                </div>
              );
            })}
          </div>
        )}
        {!showSm2 && problemQuery.isLoading && (
          <div style={{ fontSize: 12, color: 'var(--p-muted)' }}>
            {t('review.loading')}
          </div>
        )}

        {hintRevealed && hintText && (
          <div
            className="card"
            style={{ padding: 12, background: 'var(--p-accent-tint)', borderColor: 'transparent' }}
          >
            <div className="eyebrow" style={{ fontSize: 10 }}>{t('review.hintEyebrow')}</div>
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

        {showSm2 && (
          <div>
            <div className="eyebrow" style={{ fontSize: 10, marginBottom: 8 }}>{t('review.sm2.eyebrow')}</div>
            <Sm2ReviewButtons
              compact
              disabled={sm2.isPending}
              onSelect={(q) => sm2.mutate(q)}
            />
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>

      {/* Sticky bottom — hint + check */}
      {!showSm2 && (
        <div className="screen-foot" style={{ paddingTop: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <button
              type="button"
              onClick={onHintClick}
              disabled={!hintUnlocked}
              aria-label={t('review.hintAria')}
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
            <button
              type="button"
              className="btn"
              onClick={onCheck}
              disabled={!pickedChoice || check.isPending}
              style={{ flex: 1, height: 44, padding: '0 18px', fontSize: 14, flexShrink: 0 }}
            >
              {check.isPending ? t('review.checking') : t('review.check')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
