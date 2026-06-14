/* SoloProblemScreen — focused single-problem practice for "tap a wrong note,
 * solve just that problem" flow from the Notes tab.
 *
 * Loads /problems/:id (returns problem + 3-step MC walk-through) and posts each
 * step to /attempts so AttemptsRepository's built-in wrongNote.upsert refreshes
 * the user's review queue automatically. Done → back to /app/notes.
 */
import { useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProblem, fetchProblemSolution, reportProblem } from '../../lib/queries';
import { masterWrongNoteByProblem } from '../../lib/mutations';
import { post } from '../../lib/api';
import { useShuffledChoices } from '../../lib/shuffle';
import { reteachStepFor, reteachCtaKey } from '../../lib/distractor-reteach';
import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';
import { Glyph } from '../onboarding/Glyph';
import MathText from '../MathText';
import { MathInput } from '../MathInput';
import { HandwritingCanvas, type HandwritingCanvasHandle } from '../HandwritingCanvas';

// Localized step labels (2026-06-12 audit): raw CONCEPT/PROCESS/ANSWER enum
// values were leaking into the step pill.
const STEP_TYPE_LABEL_KEY: Record<string, TranslationKey> = {
  CONCEPT: 'study.step.concept', PROCESS: 'study.step.process', ANSWER: 'study.step.answer',
};
const DISTRACTOR_CHIP_KEY: Record<string, TranslationKey> = {
  CONCEPT_CONFUSION: 'study.feedback.distractor.concept',
  CALC_ERROR: 'study.feedback.distractor.calc',
  PROCESS_SKIP: 'study.feedback.distractor.process',
  TIME_PRESSURE_GUESS: 'study.feedback.distractor.time',
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
  const { t } = useT();
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

  // Sprint 3 A12: detect adaptive-session context. HomeScreen's "오늘의
  // 맞춤 20문제" card stashes the picked problems in sessionStorage; if the
  // current /app/practice/:problemId matches a queue entry, we're inside
  // that session and the "finish" button advances to the next picked problem
  // instead of jumping back to /app/notes.
  const adaptiveQueue = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('adaptive:queue');
      if (!raw) return null;
      const q = JSON.parse(raw) as {
        sessionId: string;
        problems: Array<{ id: string; reason: string }>;
        cursor: number;
      };
      if (!q.problems || typeof q.cursor !== 'number') return null;
      const currentIdx = q.problems.findIndex((p) => p.id === problemId);
      if (currentIdx < 0) return null;
      return { ...q, currentIdx };
    } catch {
      return null;
    }
  }, [problemId]);
  const isAdaptive = !!adaptiveQueue;
  const adaptiveNext = adaptiveQueue
    ? adaptiveQueue.problems[adaptiveQueue.currentIdx + 1] ?? null
    : null;
  const adaptiveTotal = adaptiveQueue?.problems.length ?? 0;
  const adaptiveCursorLabel = adaptiveQueue
    ? `${adaptiveQueue.currentIdx + 1} / ${adaptiveTotal}`
    : null;

  // Advance to the next adaptive problem, or clear the queue and return home
  // when the last one is solved.
  // Sprint 3 A13: student "이 문제 신고" — fires reportProblem then advances
  // (if inside an adaptive session) or returns to /app. EXCLUDED rows never
  // reach students again via Study / Practice / Adaptive (Sprint 1 B1 +
  // Sprint 2 A7 quality filter).
  const reportMutation = useMutation({
    mutationFn: (payload: { reason?: string }) => reportProblem(problemId!, payload.reason),
    onSuccess: () => {
      // Invalidate any cached single-problem view + adaptive/practice pools
      // so the reported problem disappears from the user's surfaces.
      qc.invalidateQueries({ queryKey: ['problem', problemId] });
      qc.invalidateQueries({ queryKey: ['chapter-progress'] });
      qc.invalidateQueries({ queryKey: ['ko-practice'] });
      if (isAdaptive) goAdaptiveNext();
      else nav('/app/notes');
    },
    onError: (e: any) => {
      // eslint-disable-next-line no-console
      console.error('[problem-report] failed', e?.response?.data ?? e);
      window.alert('신고 처리 중 오류가 발생했어요.');
    },
  });

  function handleReport() {
    if (!problemId || reportMutation.isPending) return;
    const ok = window.confirm('이 문제를 신고하시겠어요?\n정답이 옵션에 없거나 풀이가 이상한 경우 사용해 주세요. 신고된 문제는 더 이상 추천되지 않습니다.');
    if (!ok) return;
    reportMutation.mutate({ reason: undefined });
  }

  function goAdaptiveNext() {
    if (!adaptiveQueue) return;
    if (adaptiveNext) {
      try {
        sessionStorage.setItem('adaptive:queue', JSON.stringify({
          sessionId: adaptiveQueue.sessionId,
          problems: adaptiveQueue.problems,
          cursor: adaptiveQueue.currentIdx + 1,
        }));
      } catch { /* non-critical */ }
      nav(`/app/practice/${adaptiveNext.id}`);
    } else {
      try { sessionStorage.removeItem('adaptive:queue'); } catch { /* noop */ }
      nav('/app');
    }
  }

  // L3 (2026-05-24 user spec): Notes single-step UI 통일.
  // 3-step problem (Mastery)의 오답도 ANSWER step만 풀이 (body + 연습장 + 5지선다).
  // CONCEPT/PROCESS step은 노출 X — DB엔 보존되어 분석/통계로만 사용.
  // legacy single-step problem은 ANSWER 못 찾으면 마지막 step fallback.
  const allSteps = problem.data?.steps ?? [];
  const steps = (() => {
    const ans = allSteps.find((s) => s.stepType === 'ANSWER');
    if (ans) return [ans];
    return allSteps.length > 0 ? [allSteps[allSteps.length - 1]] : [];
  })();
  const step = steps[stepIdx] ?? null;
  // 보기 셔플 — 같은 step 보는 동안 순서 고정, 새 step / 재진입 시 새 셔플.
  const shuffledChoices = useShuffledChoices(step?.choices ?? []);
  // Always single-step UI (body + canvas + choices) — 3-step 분기 제거.
  const isSingleStep = true;
  const canvasRef = useRef<HandwritingCanvasHandle>(null);

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
          <button onClick={() => nav('/app/notes')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label={t('solo.back')}>
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            {/* Attribution (problem.source) intentionally not rendered. */}
            <div style={{ fontSize: 14, fontWeight: 600 }}>{t('solo.title')}</div>
          </div>
        </div>
        {steps.length > 1 && !done && (
          <span className="step-pill">
            {t('solo.stepPill', { n: stepIdx + 1, total: steps.length, label: STEP_TYPE_LABEL_KEY[step?.stepType ?? ''] ? t(STEP_TYPE_LABEL_KEY[step!.stepType]) : '' })}
          </span>
        )}
        {/* Sprint 3 A13: small text-link "신고" — kept low-prominence so it
            doesn't tempt false reports. Visible only when a problem is loaded. */}
        {problemId && problem.data && (
          <button
            type="button"
            onClick={handleReport}
            disabled={reportMutation.isPending}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontSize: 11.5, color: 'var(--p-ink-2)', textDecoration: 'underline',
              marginLeft: 8,
            }}
            aria-label="이 문제 신고"
          >
            {reportMutation.isPending ? '신고 중…' : '신고'}
          </button>
        )}
      </div>

      {problem.isLoading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-muted)' }}>
          {t('solo.loading')}
        </div>
      )}

      {problem.isError && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22, textAlign: 'center', color: 'var(--p-muted)' }}>
          {t('solo.errorLoad')}
          <button className="btn" style={{ maxWidth: 200, marginTop: 12 }} onClick={() => nav('/app/notes')}>
            {t('solo.backNotes')}
          </button>
        </div>
      )}

      {/* Problem has no practice steps — show body + AI-Solver solution
          (full step-by-step explanation + answer) via /problems/:id/solution.
          This is the Notes / review path for AI-Solver-uploaded problems. */}
      {problem.data && steps.length === 0 && (
        <NoStepsReview problemId={problem.data.id} problemBody={problem.data.body} />
      )}

      {/* MC walk-through — branches on step count per user-spec 2026-05-23. */}
      {problem.data && step && !done && (
        <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
          <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>{t('solo.problemEyebrow')}</div>
            <div className="math-big" style={{ fontSize: 16, marginTop: 6, whiteSpace: 'pre-wrap' }}>
              <MathText text={problem.data.body} />
            </div>
          </div>

          {/* Single-step problems get a working canvas (Study-tab UI). The
              step.prompt for single-step is a generic "Solve and pick" line
              that adds nothing on top of the body, so it's suppressed. */}
          {isSingleStep ? (
            <div style={{ marginTop: 12 }}>
              <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>{t('solo.workingsEyebrow')}</div>
              <HandwritingCanvas ref={canvasRef} height={260} extendable />
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => canvasRef.current?.undo()}
                  style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}
                >
                  {t('solo.undo')}
                </button>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => canvasRef.current?.clear()}
                  style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}
                >
                  {t('solo.clear')}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 14, fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>
              <MathText text={step.prompt} />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {shuffledChoices.map((c, i) => {
              const isPicked = pickedId === c.id;
              const isRevealedCorrect = result?.isCorrect && isPicked;
              const isWrongPick = result && !result.isCorrect && isPicked;
              const cls = isRevealedCorrect ? 'choice correct' : isWrongPick ? 'choice wrong' : isPicked ? 'choice selected' : 'choice';
              return (
                <div
                  key={c.id}
                  className={cls}
                  onClick={() => {
                    if (locked) return;
                    if (result && !result.isCorrect) setResult(null);
                    setPickedId(c.id);
                  }}
                >
                  <div className="letter">{letters[i] ?? c.choiceIndex}</div>
                  <span className="text"><MathText text={c.text} /></span>
                </div>
              );
            })}
          </div>

          {result && <FeedbackCard result={result} chapterCode={problem.data?.chapterCode ?? null} />}
        </div>
      )}

      {/* Completion view — all steps done. */}
      {done && (
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
          {mistakesThisCycle === 0 ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-primary)' }}>✓</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--p-ink)' }}>
                {t('solo.done.cleanSweep.title')}
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
                {t('solo.done.cleanSweep.body')}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-danger)' }}>↻</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--p-ink)' }}>
                {t('solo.done.again.title')}
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
                {t('solo.done.again.body', { n: mistakesThisCycle })}
              </div>
            </>
          )}
        </div>
      )}

      <div className="screen-foot" style={{ paddingTop: 6 }}>
        {done && isAdaptive ? (
          <button className="btn" onClick={goAdaptiveNext}>
            {adaptiveNext ? `다음 문제 (${adaptiveCursorLabel})` : '오늘의 학습 완료'}
            <Glyph.ChevronR />
          </button>
        ) : done ? (
          <button className="btn" onClick={() => nav('/app/notes')}>
            {t('solo.backNotes')}
            <Glyph.ChevronR />
          </button>
        ) : steps.length === 0 ? (
          <button className="btn" onClick={() => nav('/app/notes')}>
            {t('solo.backNotes')}
            <Glyph.ChevronR />
          </button>
        ) : !result ? (
          <button className="btn" disabled={!pickedId || submit.isPending} onClick={() => submit.mutate()}>
            {submit.isPending ? t('solo.checking') : t('solo.checkAnswer')}
            <Glyph.ChevronR />
          </button>
        ) : result.isCorrect ? (
          <button className="btn" onClick={advance}>
            {stepIdx + 1 < steps.length ? t('solo.continueStep', { n: stepIdx + 2 }) : t('solo.finish')}
            <Glyph.ChevronR />
          </button>
        ) : (
          <button className="btn outline" onClick={retry}>
            {t('solo.tryAgain')}
          </button>
        )}
      </div>
      {/* Fullscreen focus mode (2026-06-12 audit): no TabBar during a solving
          session — the header back button is the only exit. */}
    </div>
  );
}

function NoStepsReview({ problemId, problemBody }: { problemId: string; problemBody: string }) {
  const { t } = useT();
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ kind: 'correct' | 'wrong' } | null>(null);
  const startedAtRef = useRef(Date.now());

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

  const check = useMutation({
    mutationFn: () => post<{ isCorrect: boolean }>('/attempts', {
      problemId,
      answer: studentAnswer,
      durationSec: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
      context: 'PRACTICE',
    }),
    onSuccess: (r) => {
      setFeedback({ kind: r.isCorrect ? 'correct' : 'wrong' });
    },
    onError: () => {
      setFeedback({ kind: 'wrong' });
    },
  });

  function onCheck() {
    if (!studentAnswer.trim() || check.isPending) return;
    check.mutate();
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* PROBLEM card */}
      <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
        <div className="eyebrow" style={{ fontSize: 10 }}>{t('solo.problemEyebrow')}</div>
        <div className="math-big" style={{ fontSize: 16, marginTop: 8, whiteSpace: 'pre-wrap' }}>
          <MathText text={problemBody} />
        </div>
      </div>

      <div>
        <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>{t('solo.noSteps.tryEyebrow')}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <MathInput
            value={studentAnswer}
            onChange={(v) => {
              setStudentAnswer(v);
              if (feedback) setFeedback(null);
            }}
            placeholder={t('solo.noSteps.tryPlaceholder')}
            onKeyDown={(e) => { if (e.key === 'Enter') onCheck(); }}
            disabled={check.isPending}
            style={{ flex: 1, minWidth: 0 }}
          />
          <button
            type="button"
            className="btn"
            onClick={onCheck}
            disabled={!studentAnswer.trim() || check.isPending}
            style={{ width: 'auto', height: 44, padding: '0 18px', fontSize: 14, flexShrink: 0 }}
          >
            {check.isPending ? t('solo.checking') : t('solo.checkAnswer')}
          </button>
        </div>
        {feedback && (
          <div
            style={{
              marginTop: 8, padding: 10, fontSize: 13, fontWeight: 600, borderRadius: 10,
              background: feedback.kind === 'correct' ? 'var(--p-success-tint)' : 'var(--p-danger-tint)',
              color: feedback.kind === 'correct' ? 'var(--p-success)' : 'var(--p-danger)',
            }}
          >
            {feedback.kind === 'correct' ? t('solo.feedback.correct') : t('solo.feedback.wrong')}
          </div>
        )}
      </div>

      {/* Concept chip */}
      {concept && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>{t('solo.noSteps.conceptEyebrow')}</span>
          <span className="chip" style={{ fontSize: 11.5 }}>
            <MathText text={concept} />
          </span>
        </div>
      )}

      {/* Solution steps -- the AI-Solver explanation, rendered as the
          headline of this review screen. */}
      {solution.isLoading ? (
        <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)', fontSize: 13 }}>
          {t('solo.noSteps.solution.loading')}
        </div>
      ) : explanation ? (
        <div className="card" style={{ padding: 14, background: 'var(--p-surface)', borderColor: 'var(--p-border)' }}>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>{t('solo.noSteps.solution.eyebrow')}</div>
          <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--p-ink-2)', whiteSpace: 'pre-wrap' }}>
            <MathText text={explanation} />
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 14, fontSize: 13, color: 'var(--p-muted)', lineHeight: 1.55 }}>
          {t('solo.noSteps.solution.none')}
        </div>
      )}

      {/* Answer card -- primary tint to read as the headline result */}
      {answer && (
        <div className="card" style={{
          padding: '14px 16px',
          background: 'var(--p-primary-tint)',
          borderColor: 'var(--p-primary)',
        }}>
          <div className="eyebrow" style={{ fontSize: 10, color: 'var(--p-primary)' }}>{t('solo.noSteps.answer.eyebrow')}</div>
          <div style={{ marginTop: 6, fontSize: 20, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
            <MathText text={answer} />
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackCard({
  result,
  chapterCode,
}: {
  result: StepResult;
  chapterCode: string | null;
}) {
  const { t } = useT();
  const nav = useNavigate();
  const correct = result.isCorrect;
  const sel = result.selectedChoice;
  const distractorTypeText = sel?.distractorType
    ? t(DISTRACTOR_CHIP_KEY[sel.distractorType] ?? 'study.feedback.distractor.other')
    : null;
  const distractorHint: Record<string, string> = {
    CONCEPT_CONFUSION: t('solo.feedback.distractor.concept'),
    CALC_ERROR: t('solo.feedback.distractor.calc'),
    PROCESS_SKIP: t('solo.feedback.distractor.process'),
    TIME_PRESSURE_GUESS: t('solo.feedback.distractor.time'),
  };
  const whyLine = sel?.rationale
    ?? (sel?.distractorType ? distractorHint[sel.distractorType] : null)
    ?? (correct ? null : t('solo.feedback.distractor.other'));

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
        {correct ? t('solo.feedback.correct') : t('solo.feedback.wrong')}
      </div>
      {whyLine && (
        <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--p-ink)' }}>
            {correct ? t('solo.feedback.whyWorks') : t('solo.feedback.whyMissed')}
          </strong>
          <MathText text={whyLine} />
        </div>
      )}
      {!correct && distractorTypeText && (
        <div style={{ marginTop: 8 }}>
          <span className="chip" style={{ fontSize: 10.5 }}>{distractorTypeText}</span>
        </div>
      )}
      {!correct && chapterCode && (() => {
        const step = reteachStepFor(sel?.distractorType ?? null);
        const ctaKey = reteachCtaKey(sel?.distractorType ?? null);
        if (!step || !ctaKey) return null;
        return (
          <button
            type="button"
            className="btn text"
            style={{ marginTop: 8, padding: '4px 8px', fontSize: 12 }}
            onClick={() => nav(`/app/learn/${chapterCode}?focus=${step}`)}
          >
            {t(ctaKey as any)}
          </button>
        );
      })()}
    </div>
  );
}
