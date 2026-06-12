/* MockExamPlayScreen — sage 3-step MC walk-through for a mock exam session.
 * Receives { resultId, problems, name, totalMinutes } via location.state.
 * Submits each step via POST /mock-exams/results/:resultId/answer, then finalize.
 */
import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { post } from '../../lib/api';
import { useShuffledChoices } from '../../lib/shuffle';
import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';

const STORAGE_PREFIX = 'mathema.mock.';

type Choice = { id: string; choiceIndex: number; text: string };
type Step = { id: string; stepIndex: number; stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER'; prompt: string; choices: Choice[] };
type ExamProblem = {
  id: string; source: string; body: string; difficulty: string;
  steps: Step[];
};
type LocState = { resultId: string; name: string; totalMinutes: number; problems: ExamProblem[] } | null;

type FinalizeResult = {
  score: number; grade: number; percentile: number; durationMin: number;
  correctCount: number; totalProblems: number; attemptedProblems?: number;
};

// Localized step labels (2026-06-12 audit): raw CONCEPT/PROCESS/ANSWER enum
// values were leaking into the step pill.
const STEP_LABEL_KEY: Record<string, TranslationKey> = {
  CONCEPT: 'study.step.concept', PROCESS: 'study.step.process', ANSWER: 'study.step.answer',
};
const DISTRACTOR_CHIP_KEY: Record<string, TranslationKey> = {
  CONCEPT_CONFUSION: 'study.feedback.distractor.concept',
  CALC_ERROR: 'study.feedback.distractor.calc',
  PROCESS_SKIP: 'study.feedback.distractor.process',
  TIME_PRESSURE_GUESS: 'study.feedback.distractor.time',
};

function gradeBand(n: number): string {
  if (n <= 1) return 'A1';
  if (n <= 2) return 'A2';
  if (n <= 3) return 'B1';
  if (n <= 4) return 'B2';
  if (n <= 5) return 'C1';
  if (n <= 6) return 'C2';
  return n <= 7 ? 'D' : 'E';
}

type StepFeedback = {
  isCorrect: boolean;
  choice: { isCorrect: boolean; text: string; rationale: string | null; distractorType: string | null } | null;
};

export function MockExamPlayScreen() {
  const { resultId } = useParams<{ resultId: string }>();
  const loc = useLocation();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { t } = useT();

  // Hydrate state from location OR from localStorage (refresh-survives).
  const storageKey = STORAGE_PREFIX + (resultId ?? '');
  const hydrated = useMemo<LocState>(() => {
    if (loc.state) return loc.state as LocState;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw) as LocState;
    } catch { /* ignore */ }
    return null;
  }, [loc.state, storageKey]);

  // Persist initial state once (on first mount with state).
  useEffect(() => {
    if (loc.state && resultId) {
      try { localStorage.setItem(storageKey, JSON.stringify(loc.state)); } catch { /* ignore */ }
    }
  }, [loc.state, resultId, storageKey]);

  const state = hydrated;
  const [problemIdx, setProblemIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<StepFeedback | null>(null);

  // Visibility-aware timer — pauses when tab is hidden.
  const stepActiveMs = useRef(0);
  const visibleSince = useRef<number | null>(Date.now());
  // Reset on step change.
  useEffect(() => {
    stepActiveMs.current = 0;
    visibleSince.current = document.hidden ? null : Date.now();
  }, [problemIdx, stepIdx]);
  // Listen to visibility changes.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        if (visibleSince.current !== null) {
          stepActiveMs.current += Date.now() - visibleSince.current;
          visibleSince.current = null;
        }
      } else {
        visibleSince.current = Date.now();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);
  const stepDurationSec = () => {
    const ongoing = visibleSince.current !== null ? Date.now() - visibleSince.current : 0;
    return Math.max(1, Math.round((stepActiveMs.current + ongoing) / 1000));
  };

  const problems = state?.problems ?? [];
  const total = problems.length;
  const cur = problems[problemIdx] ?? null;
  const curStep = cur?.steps[stepIdx] ?? null;
  // 보기 셔플 — step 이 바뀔 때마다 자동 재셔플.
  const shuffledChoices = useShuffledChoices(curStep?.choices ?? []);

  // 모든 hook 은 early-return 위에 위치 — Rules of Hooks 준수.
  const segments = useMemo(() => total * 3, [total]);
  const active = problemIdx * 3 + stepIdx;

  // 잘못된 진입 (state 없음)
  // location.state.origin tells us where the user came from so the back
  // button returns there instead of the deprecated /app/mocks route.
  const backTarget = ((state as any)?.origin === 'test') ? '/app/test' : '/app/study';

  if (!state || !resultId) {
    return (
      <div className="screen">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22, textAlign: 'center', color: 'var(--p-muted)' }}>
          {t('mockPlay.sessionMissing')}
          <br />
          <button className="btn" style={{ marginTop: 16, maxWidth: 200 }} onClick={() => nav('/app/study')}>
            {t('mockPlay.backStudy')}
          </button>
        </div>
        <TabBar />
      </div>
    );
  }

  async function submitStep() {
    if (busy || !cur || !curStep || !pickedId) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await post<{
        choice: { isCorrect: boolean; text: string; rationale: string | null; distractorType: string | null } | null;
        isCorrect: boolean;
      }>(`/mock-exams/results/${resultId}/answer`, {
        problemId: cur.id,
        choiceId: pickedId,
        stepIndex: curStep.stepIndex,
        durationSec: stepDurationSec(),
      });
      setFeedback({ isCorrect: !!r.choice?.isCorrect, choice: r.choice });
      // Invalidate wrong-notes / mastery / dashboard caches so Notes tab updates immediately.
      if (!r.choice?.isCorrect) {
        qc.invalidateQueries({ queryKey: ['wn-list'] });
        qc.invalidateQueries({ queryKey: ['wn-stats'] });
        qc.invalidateQueries({ queryKey: ['wn-recent'] });
      }
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['heatmap'] });
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? t('mockPlay.submit.failed'));
    } finally {
      setBusy(false);
    }
  }

  async function advanceFromFeedback() {
    if (busy) return;
    setFeedback(null);
    if (!cur) return;
    // Advance: next step → next problem → finalize.
    if (stepIdx + 1 < cur.steps.length) {
      setStepIdx(stepIdx + 1);
      setPickedId(null);
      return;
    }
    if (problemIdx + 1 < total) {
      setProblemIdx(problemIdx + 1);
      setStepIdx(0);
      setPickedId(null);
      return;
    }
    setBusy(true);
    try {
      const r = await post<FinalizeResult>(`/mock-exams/results/${resultId}/finalize`, {});
      // Invalidate caches so Mocks tab + dashboard reflect the new result.
      qc.invalidateQueries({ queryKey: ['mock-summary'] });
      qc.invalidateQueries({ queryKey: ['traj'] });
      qc.invalidateQueries({ queryKey: ['exam-results'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['mock-result', resultId] });
      // 시험 끝났으니 localStorage 진행 상태 정리.
      try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
      // Score + per-question review 페이지로 자동 이동.
      // Preserve origin so the result detail screen's Back also routes home.
      nav(`/app/mocks/result/${resultId}`, {
        replace: true,
        state: { fromFinalize: true, origin: (state as any)?.origin ?? 'study', ...r },
      });
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? t('mockPlay.finalize.failed'));
      setBusy(false);
    }
  }

  // ───── Step view ─────
  // (finalize 직후엔 navigate(replace=true) 로 result detail 페이지로 이동 — in-place score view 제거)
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={() => nav(backTarget)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label={t('mockPlay.back')}>
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{state.name}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{t('mockPlay.qProgress', { n: problemIdx + 1, total })}</div>
          </div>
        </div>
        <span className="step-pill">
          {curStep ? t('mockPlay.stepPill', { label: STEP_LABEL_KEY[curStep.stepType] ? t(STEP_LABEL_KEY[curStep.stepType]) : curStep.stepType, step: stepIdx + 1, total: cur?.steps.length ?? 0 }) : '—'}
        </span>
      </div>
      <div className="steps" style={{ marginTop: 0, paddingTop: 4 }}>
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className={`dot ${i === active ? 'active' : i < active ? 'done' : ''}`} />
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
        {!cur || !curStep ? (
          <div style={{ padding: 22, textAlign: 'center', color: 'var(--p-muted)' }}>{t('mockPlay.noQuestions')}</div>
        ) : (
          <>
            <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
              {/* Attribution (cur.source) intentionally not rendered. */}
              <div className="math-big" style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>
                <MathText text={cur.body} />
              </div>
            </div>

            <div style={{ marginTop: 14, fontSize: 14, fontWeight: 600 }}>
              <MathText text={curStep.prompt} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              {shuffledChoices.map((c, i) => {
                const sel = pickedId === c.id;
                const revealedCorrect = feedback?.isCorrect && sel;
                const wrongPick = feedback && !feedback.isCorrect && sel;
                const cls = revealedCorrect ? 'choice correct' : wrongPick ? 'choice wrong' : sel ? 'choice selected' : 'choice';
                // Exam = one-shot: after submit (feedback set) all choices lock.
                const lockedNow = busy || feedback !== null;
                return (
                  <div
                    key={c.id}
                    className={cls}
                    onClick={() => !lockedNow && setPickedId(c.id)}
                  >
                    <div className="letter">{letters[i] ?? c.choiceIndex}</div>
                    <span className="text"><MathText text={c.text} /></span>
                  </div>
                );
              })}
            </div>

            {feedback && (
              <div className="card" style={{ marginTop: 12, padding: 14, background: feedback.isCorrect ? 'var(--p-success-tint)' : 'var(--p-danger-tint)', borderColor: 'transparent' }}>
                <div style={{ fontWeight: 700, color: feedback.isCorrect ? 'var(--p-success-ink)' : 'var(--p-danger-ink)', fontSize: 14 }}>
                  {feedback.isCorrect ? t('mockPlay.correct') : t('mockPlay.wrong')}
                </div>
                {feedback.choice?.rationale && (
                  <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--p-ink)' }}>
                      {feedback.isCorrect ? t('mockPlay.whyWorks') : t('mockPlay.whyMissed')}
                    </strong>
                    {feedback.choice.rationale}
                  </div>
                )}
                {!feedback.isCorrect && feedback.choice?.distractorType && (
                  <div style={{ marginTop: 8 }}>
                    <span className="chip" style={{ fontSize: 10.5 }}>
                      {t(DISTRACTOR_CHIP_KEY[feedback.choice.distractorType] ?? 'study.feedback.distractor.other')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {err && (
              <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: 'var(--p-danger-tint)', color: 'var(--p-danger)', fontSize: 12 }}>{err}</div>
            )}
          </>
        )}
      </div>
      <div className="screen-foot">
        {!feedback ? (
          <button className="btn" onClick={submitStep} disabled={!pickedId || busy} style={{ opacity: pickedId ? 1 : 0.45 }}>
            {busy ? t('mockPlay.saving') : t('mockPlay.submit')}
            <Glyph.ChevronR />
          </button>
        ) : (
          /* Exam = one-shot per step. Wrong answer still advances — no retry. */
          <button className="btn" onClick={advanceFromFeedback} disabled={busy}>
            {busy ? t('mockPlay.saving') :
              stepIdx + 1 < (cur?.steps.length ?? 0) ? t('mockPlay.continueStep', { n: stepIdx + 2 }) :
              problemIdx + 1 < total ? t('mockPlay.nextQuestion', { next: problemIdx + 2, total }) : t('mockPlay.finishExam')}
            <Glyph.ChevronR />
          </button>
        )}
      </div>
      {/* Fullscreen focus mode (2026-06-12 audit): no TabBar during an exam —
          the header back button is the only exit. The session-missing state
          above keeps it for navigation. */}
    </div>
  );
}

function Cell({ k, v, u }: { k: string; v: string; u?: string }) {
  return (
    <div className="stat">
      <div className="k">{k}</div>
      <div className="v italic">{v}{u && <span style={{ fontSize: 14, color: 'var(--p-muted)' }}>{u}</span>}</div>
    </div>
  );
}
