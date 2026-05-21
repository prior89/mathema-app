/* SoloProblemScreen — focused single-problem practice for "tap a wrong note,
 * solve just that problem" flow from the Notes tab.
 *
 * Loads /problems/:id (returns problem + 3-step MC walk-through) and posts each
 * step to /attempts so AttemptsRepository's built-in wrongNote.upsert refreshes
 * the user's review queue automatically. Done → back to /app/notes.
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProblem, fetchProblemSolution } from '../../lib/queries';
import { masterWrongNoteByProblem } from '../../lib/mutations';
import { post } from '../../lib/api';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';

const STEP_TYPE_LABEL: Record<string, string> = {
  CONCEPT: 'CONCEPT', PROCESS: 'PROCESS', ANSWER: 'ANSWER',
};

const DISTRACTOR_HINT: Record<string, string> = {
  CONCEPT_CONFUSION: 'You may be mixing this concept with a related one — re-read the prompt carefully.',
  CALC_ERROR: 'Numerical / sign / arithmetic slip — redo the calculation step-by-step.',
  PROCESS_SKIP: 'A step in the solution was skipped — walk through every step explicitly.',
  TIME_PRESSURE_GUESS: 'Looks like a guess — slow down, the answer is reachable from the given info.',
};

type StepResult = {
  isCorrect: boolean;
  selectedChoice: { id: string; text: string; distractorType: string | null; rationale: string | null } | null;
  correctChoice: { id: string; text: string } | null;
};

export function SoloProblemScreen() {
  const { problemId } = useParams<{ problemId: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [stepIdx, setStepIdx] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [result, setResult] = useState<StepResult | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  // Cycle-level mistake tracker — any wrong pick anywhere across CONCEPT /
  // PROCESS / ANSWER counts against this cycle. Mastery graduation requires
  // mistakesThisCycle === 0 at done-phase entry. Stays true once a mistake
  // happens; not reset by retry().
  const [mistakesThisCycle, setMistakesThisCycle] = useState(0);

  const problem = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => fetchProblem(problemId!),
    enabled: !!problemId,
  });

  const steps = problem.data?.steps ?? [];
  const step = steps[stepIdx] ?? null;

  const submit = useMutation({
    mutationFn: () => post<{
      isCorrect: boolean;
      selectedChoice: StepResult['selectedChoice'];
      correctChoice: StepResult['correctChoice'];
    }>('/attempts', {
      problemId: problem.data!.id,
      choiceId: pickedId,
      stepIndex: step?.stepIndex,
      durationSec: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
      context: 'PRACTICE',
    }),
    onSuccess: (r) => {
      setResult({ isCorrect: r.isCorrect, selectedChoice: r.selectedChoice, correctChoice: r.correctChoice });
      if (!r.isCorrect) setMistakesThisCycle((n) => n + 1);
      // Refresh wrong notes / dashboard so the Notes tab + Home stats pick up
      // the new attempt + wrongNote occurrence immediately.
      qc.invalidateQueries({ queryKey: ['wn-list'] });
      qc.invalidateQueries({ queryKey: ['wn-stats'] });
      qc.invalidateQueries({ queryKey: ['wn-recent'] });
      qc.invalidateQueries({ queryKey: ['wn-due'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['heatmap'] });
    },
    onError: () => setResult({ isCorrect: false, selectedChoice: null, correctChoice: null }),
  });

  // Mastery graduation — fire-and-forget on a perfect cycle (no mistakes
  // across every step). Backend flips every un-mastered wrong note for this
  // user × problem to MASTERED. Idempotent.
  const graduate = useMutation({
    mutationFn: () => masterWrongNoteByProblem(problemId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wn-list'] });
      qc.invalidateQueries({ queryKey: ['wn-stats'] });
      qc.invalidateQueries({ queryKey: ['queue-next'] });
    },
  });

  function advance() {
    if (stepIdx + 1 < steps.length) {
      setStepIdx(stepIdx + 1);
      setPickedId(null);
      setResult(null);
      setStartedAt(Date.now());
      return;
    }
    setDone(true);
    // Perfect-cycle graduation — every step was right on the first pick.
    // Wrong notes for this problem flip to MASTERED. Any mistake during
    // the cycle blocks graduation; the user can re-enter the note later
    // and try for a clean run.
    if (problemId && mistakesThisCycle === 0) {
      graduate.mutate();
    }
  }

  function retry() {
    setPickedId(null);
    setResult(null);
    setStartedAt(Date.now());
  }

  const letters = ['A', 'B', 'C', 'D', 'E'];
  const locked = submit.isPending || result?.isCorrect === true;

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={() => nav('/app/notes')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              {problem.data?.source ?? 'PROBLEM'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Practice this problem</div>
          </div>
        </div>
        {steps.length > 0 && !done && (
          <span className="step-pill">
            STEP {stepIdx + 1} / {steps.length} · {STEP_TYPE_LABEL[step?.stepType ?? ''] ?? ''}
          </span>
        )}
      </div>

      {problem.isLoading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-muted)' }}>
          Loading the problem…
        </div>
      )}

      {problem.isError && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22, textAlign: 'center', color: 'var(--p-muted)' }}>
          Could not load this problem.
          <button className="btn" style={{ maxWidth: 200, marginTop: 12 }} onClick={() => nav('/app/notes')}>
            Back to Notes
          </button>
        </div>
      )}

      {/* Problem has no practice steps — show body + AI-Solver solution
          (full step-by-step explanation + answer) via /problems/:id/solution.
          This is the Notes / review path for AI-Solver-uploaded problems. */}
      {problem.data && steps.length === 0 && (
        <NoStepsReview problemId={problem.data.id} problemBody={problem.data.body} />
      )}

      {/* 3-step MC walk-through */}
      {problem.data && step && !done && (
        <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
          <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>PROBLEM</div>
            <div className="math-big" style={{ fontSize: 16, marginTop: 6, whiteSpace: 'pre-wrap' }}>
              <MathText text={problem.data.body} />
            </div>
          </div>

          <div style={{ marginTop: 14, fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>
            <MathText text={step.prompt} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {(step.choices ?? []).map((c, i) => {
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
                  <div className="letter">{letters[i] ?? c.choiceIndex}</div>
                  <span className="text"><MathText text={c.text} /></span>
                </div>
              );
            })}
          </div>

          {result && <FeedbackCard result={result} />}
        </div>
      )}

      {/* Completion view — all steps done. */}
      {done && (
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
          {mistakesThisCycle === 0 ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-primary)' }}>✓</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--p-ink)' }}>
                Mastered — clean sweep.
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
                Every step right on the first try. This problem is graduating
                from your wrong-note book.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-danger)' }}>↻</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--p-ink)' }}>
                Not quite this time.
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
                {mistakesThisCycle} step{mistakesThisCycle === 1 ? '' : 's'} missed
                this cycle, so the problem stays in your Notes. Re-open it from
                Notes whenever you want — graduate only on a perfect 3-step
                sweep.
              </div>
            </>
          )}
        </div>
      )}

      <div className="screen-foot" style={{ paddingTop: 6 }}>
        {done ? (
          <button className="btn" onClick={() => nav('/app/notes')}>
            Back to Notes
            <Glyph.ChevronR />
          </button>
        ) : steps.length === 0 ? (
          <button className="btn" onClick={() => nav('/app/notes')}>
            Back to Notes
            <Glyph.ChevronR />
          </button>
        ) : !result ? (
          <button className="btn" disabled={!pickedId || submit.isPending} onClick={() => submit.mutate()}>
            {submit.isPending ? 'Checking…' : 'Check answer'}
            <Glyph.ChevronR />
          </button>
        ) : result.isCorrect ? (
          <button className="btn" onClick={advance}>
            {stepIdx + 1 < steps.length ? `Continue to STEP ${stepIdx + 2}` : 'Finish'}
            <Glyph.ChevronR />
          </button>
        ) : (
          <button className="btn outline" onClick={retry}>
            Try again
          </button>
        )}
      </div>
      <TabBar />
    </div>
  );
}

function NoStepsReview({ problemId, problemBody }: { problemId: string; problemBody: string }) {
  // Pull the solution endpoint which exposes both `answer` and `explanation`
  // (the latter populated by the AI Solver pipeline via expectedSolutionSteps).
  // This screen is the Notes / review surface for AI-Solver-uploaded problems,
  // so we always want the full walkthrough -- not a "work on paper" copy.
  const solution = useQuery({
    queryKey: ['problem-solution', problemId],
    queryFn: () => fetchProblemSolution(problemId),
  });
  const answer = solution.data?.answer ?? null;
  const explanation = solution.data?.explanation ?? null;
  const concept = solution.data?.concept ?? null;

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* PROBLEM card */}
      <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
        <div className="eyebrow" style={{ fontSize: 10 }}>PROBLEM</div>
        <div className="math-big" style={{ fontSize: 16, marginTop: 8, whiteSpace: 'pre-wrap' }}>
          <MathText text={problemBody} />
        </div>
      </div>

      {/* Concept chip */}
      {concept && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>CONCEPT</span>
          <span className="chip" style={{ fontSize: 11.5 }}>
            <MathText text={concept} />
          </span>
        </div>
      )}

      {/* Solution steps -- the AI-Solver explanation, rendered as the
          headline of this review screen. */}
      {solution.isLoading ? (
        <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)', fontSize: 13 }}>
          Loading solution…
        </div>
      ) : explanation ? (
        <div className="card" style={{ padding: 14, background: 'var(--p-surface)', borderColor: 'var(--p-border)' }}>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>SOLUTION STEPS</div>
          <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--p-ink-2)', whiteSpace: 'pre-wrap' }}>
            <MathText text={explanation} />
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 14, fontSize: 13, color: 'var(--p-muted)', lineHeight: 1.55 }}>
          No saved step-by-step solution for this problem yet.
        </div>
      )}

      {/* Answer card -- primary tint to read as the headline result */}
      {answer && (
        <div className="card" style={{
          padding: '14px 16px',
          background: 'var(--p-primary-tint)',
          borderColor: 'var(--p-primary)',
        }}>
          <div className="eyebrow" style={{ fontSize: 10, color: 'var(--p-primary)' }}>ANSWER</div>
          <div style={{ marginTop: 6, fontSize: 20, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
            <MathText text={answer} />
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackCard({ result }: { result: StepResult }) {
  const correct = result.isCorrect;
  const sel = result.selectedChoice;
  const distractorTypeText = sel?.distractorType ? sel.distractorType.replace(/_/g, ' ') : null;
  const whyLine = sel?.rationale
    ?? (sel?.distractorType ? DISTRACTOR_HINT[sel.distractorType] : null)
    ?? (correct ? null : 'That option does not lead to the answer — look at the prompt again and pick a different one.');

  return (
    <div
      className="card"
      style={{
        marginTop: 12,
        padding: 14,
        background: correct ? 'var(--p-success-tint)' : 'var(--p-danger-tint)',
        borderColor: 'transparent',
      }}
    >
      <div style={{ fontWeight: 700, color: correct ? 'var(--p-success)' : 'var(--p-danger)', fontSize: 14 }}>
        {correct ? '✓ Correct' : '✗ Not quite — pick a different option and check again'}
      </div>
      {whyLine && (
        <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--p-ink)' }}>
            {correct ? 'Why this works: ' : 'Why your pick missed: '}
          </strong>
          <MathText text={whyLine} />
        </div>
      )}
      {!correct && distractorTypeText && (
        <div style={{ marginTop: 8 }}>
          <span className="chip" style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)' }}>{distractorTypeText}</span>
        </div>
      )}
    </div>
  );
}
