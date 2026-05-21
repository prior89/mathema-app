/* StudyPracticeScreen — single-step, one-at-a-time practice loop.
 *
 * Stateless flow:
 *   1. /mock-exams/chapter/:code/next       → first problem
 *   2. student answers → POST /attempts (context:'STUDY', no stepIndex so
 *      attempts.repository's single-shot branch handles MASTERED / PENDING)
 *   3. student taps "Next" → /next returns the following problem
 *   4. student taps "Stop" (or "Finish" when the pool runs out) → summary
 *
 * Generating one at a time beats a 20-batch up front because:
 *   • the first paint waits on a single LLM round-trip, not twenty;
 *   • a student who quits after three problems doesn't burn cost for the
 *     other seventeen;
 *   • the server can adapt difficulty to live performance later (future).
 */
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { post } from '../../lib/api';
import { nextStudyProblem } from '../../lib/mutations';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';
import { HandwritingCanvas, type HandwritingCanvasHandle } from '../HandwritingCanvas';

type Choice = { id: string; choiceIndex: number; text: string };
type ProblemStep = {
  id: string;
  stepIndex: number;
  stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER';
  prompt: string;
  choices: Choice[];
};
type StudyProblem = {
  id: string;
  source: string;
  body: string;
  difficulty: string;
  hint?: string | null;
  steps: ProblemStep[];
};

type AttemptResponse = {
  isCorrect: boolean;
  selectedChoice: { id: string; text: string; distractorType: string | null; rationale: string | null } | null;
  correctChoice: { id: string; text: string } | null;
};

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function StudyPracticeScreen() {
  const { chapterCode } = useParams<{ chapterCode: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();

  const [current, setCurrent] = useState<StudyProblem | null>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAtRef = useRef(Date.now());
  const canvasRef = useRef<HandwritingCanvasHandle>(null);

  const fetchNext = useMutation({
    mutationFn: () => nextStudyProblem(chapterCode!),
    onSuccess: (problem) => {
      if (!problem) {
        // Pool is dry and LLM top-up failed (or quota hit). Treat as finish.
        setDone(true);
        return;
      }
      setCurrent(problem as StudyProblem);
      setPickedId(null);
      setResult(null);
      startedAtRef.current = Date.now();
      canvasRef.current?.clear();
      setError(null);
      setQuestionNum((n) => n + 1);
    },
    onError: (e: any) => {
      setError(e?.response?.data?.error?.message ?? 'Could not fetch the next problem');
    },
  });

  // First-load — fetch the first problem when the chapter code is in the URL.
  useEffect(() => {
    if (chapterCode) fetchNext.mutate();
    // fetchNext is stable for our mutation pattern; depending on it would
    // cause a refetch loop on every state update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterCode]);

  const step = current?.steps?.[0];

  const submit = useMutation({
    mutationFn: () => {
      if (!current || !pickedId) throw new Error('no choice picked');
      return post<AttemptResponse>('/attempts', {
        problemId: current.id,
        choiceId: pickedId,
        durationSec: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
        context: 'STUDY',
        // Omit stepIndex — Study is single-shot so attempts.repository
        // treats `correct → MASTERED` / `wrong → PENDING` automatically.
      });
    },
    onSuccess: (r) => {
      setResult(r);
      if (r.isCorrect) setCorrectCount((n) => n + 1);
      else setWrongCount((n) => n + 1);
      qc.invalidateQueries({ queryKey: ['wn-list'] });
      qc.invalidateQueries({ queryKey: ['wn-stats'] });
      qc.invalidateQueries({ queryKey: ['wn-recent'] });
      qc.invalidateQueries({ queryKey: ['chapter-progress'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => setResult({ isCorrect: false, selectedChoice: null, correctChoice: null }),
  });

  function onSubmit() {
    if (!pickedId || submit.isPending) return;
    submit.mutate();
  }

  function onNext() {
    fetchNext.mutate();
  }

  function onStop() {
    setDone(true);
  }

  // ─────────── completion view ───────────
  if (done) {
    return (
      <div className="screen">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, padding: 22, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-primary)' }}>✓</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>
            {correctCount + wrongCount === 0 ? 'No problems solved yet.' : 'Practice done.'}
          </div>
          {correctCount + wrongCount > 0 && (
            <div style={{ fontSize: 14, color: 'var(--p-ink-2)', lineHeight: 1.6 }}>
              <strong>{correctCount}</strong> right · <strong>{wrongCount}</strong> filed to Notes.
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--p-muted)', maxWidth: 320, lineHeight: 1.55 }}>
            Wrong answers are now in your wrong-note book. Re-open them from Notes
            whenever you want — a single perfect retry graduates them.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button className="btn outline" onClick={() => nav('/app/study')}>Back to Study</button>
            {wrongCount > 0 && (
              <button className="btn" onClick={() => nav('/app/notes')}>Open Notes</button>
            )}
          </div>
        </div>
        <TabBar />
      </div>
    );
  }

  // ─────────── loading / empty / error ───────────
  if (!current) {
    return (
      <div className="screen">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 22, textAlign: 'center', color: 'var(--p-muted)' }}>
          {error ? (
            <>
              <div style={{ fontSize: 14, color: 'var(--p-danger)' }}>{error}</div>
              <button className="btn outline" style={{ maxWidth: 200 }} onClick={() => nav('/app/study')}>
                Back to Study
              </button>
            </>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Building your first question…</div>
              <div style={{ fontSize: 12, lineHeight: 1.6, maxWidth: 320 }}>
                A new problem is being assembled — usually under 30 seconds. The next ones come
                from your chapter's shared pool and arrive instantly.
              </div>
            </>
          )}
        </div>
        <TabBar />
      </div>
    );
  }

  // ─────────── active problem ───────────
  const locked = submit.isPending || result?.isCorrect === true;
  return (
    <div className="screen" key={current.id}>
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={() => nav('/app/study')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              PRACTICE
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              Q {questionNum} · {correctCount} right / {wrongCount} wrong
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onStop}
          style={{
            background: 'none', border: '1px solid var(--p-border)', borderRadius: 8,
            padding: '6px 10px', fontSize: 11, color: 'var(--p-ink-2)', cursor: 'pointer',
          }}
        >
          Stop
        </button>
      </div>

      {/* Sticky problem statement — frozen so the student can still see the
          question while picking an answer or working on the canvas below. */}
      <div style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
          <div className="eyebrow" style={{ fontSize: 10 }}>PROBLEM</div>
          <div className="math-big" style={{ fontSize: 16, marginTop: 6, whiteSpace: 'pre-wrap' }}>
            <MathText text={current.body} />
          </div>
        </div>
      </div>

      {/* Scrollable middle (canvas + choices + feedback) */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 22px 8px', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
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

        {step && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {step.choices.map((c, i) => {
              const isPicked = pickedId === c.id;
              const isRevealedCorrect = result?.isCorrect && isPicked;
              const isWrongPick = result && !result.isCorrect && isPicked;
              const cls = isRevealedCorrect ? 'choice correct' : isPicked ? 'choice selected' : 'choice';
              return (
                <div
                  key={c.id}
                  className={cls}
                  onClick={() => {
                    if (locked) return;
                    if (result && !result.isCorrect) setResult(null);
                    setPickedId(c.id);
                  }}
                  style={isWrongPick ? { borderColor: 'var(--p-danger)' } : undefined}
                >
                  <div className="letter">{LETTERS[i] ?? c.choiceIndex}</div>
                  <span className="text"><MathText text={c.text} /></span>
                </div>
              );
            })}
          </div>
        )}

        {result && (
          <div
            className="card"
            style={{
              padding: 12, fontSize: 13,
              background: result.isCorrect ? 'var(--p-success-tint)' : 'var(--p-danger-tint)',
              color: result.isCorrect ? 'var(--p-success)' : 'var(--p-danger)',
              borderColor: 'transparent', fontWeight: 600,
            }}
          >
            {result.isCorrect
              ? '✓ Correct — tap Next for a new problem.'
              : '✗ Wrong — filed to your Notes. Tap Next when ready.'}
            {result.correctChoice && !result.isCorrect && (
              <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--p-ink-2)', fontWeight: 400 }}>
                Correct answer: <MathText text={result.correctChoice.text} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky footer — Check / Next */}
      <div className="screen-foot" style={{ paddingTop: 6 }}>
        {!result ? (
          <button
            className="btn"
            disabled={!pickedId || submit.isPending}
            onClick={onSubmit}
          >
            {submit.isPending ? 'Checking…' : 'Check'}
            <Glyph.ChevronR />
          </button>
        ) : (
          <button className="btn" onClick={onNext} disabled={fetchNext.isPending}>
            {fetchNext.isPending ? 'Loading…' : 'Next problem'}
            <Glyph.ChevronR />
          </button>
        )}
      </div>
      <TabBar />
    </div>
  );
}
