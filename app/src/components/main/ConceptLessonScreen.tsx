/* ConceptLessonScreen — sage-themed lesson view.
 * 2-phase flow:
 *   Phase 0 (concept) — all non-RETRIEVAL steps stacked on one scrollable screen.
 *   Phase 1+ (problem) — each RETRIEVAL step on its own screen as multiple-choice.
 */
import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  fetchConceptLesson, fetchPracticeProblems, fetchProblem,
  type ConceptStep, type Problem, type ProblemStep as ProblemStepData,
} from '../../lib/queries';
import { post } from '../../lib/api';
import { track } from '../../lib/analytics';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';

const STEP_TONE: Record<string, { eyebrow: string; tint: string }> = {
  HOOK: { eyebrow: 'HOOK', tint: 'var(--p-primary-tint)' },
  CONCRETE: { eyebrow: 'CONCRETE', tint: 'var(--p-accent-tint)' },
  PICTORIAL: { eyebrow: 'PICTORIAL', tint: 'var(--p-primary-tint)' },
  ABSTRACT: { eyebrow: 'ABSTRACT', tint: 'var(--p-surface-2)' },
  WORKED_EXAMPLE: { eyebrow: 'WORKED EXAMPLE', tint: 'var(--p-accent-tint)' },
  GUIDED_PRACTICE: { eyebrow: 'GUIDED PRACTICE', tint: 'var(--p-primary-tint)' },
  RETRIEVAL: { eyebrow: 'RETRIEVAL', tint: 'var(--p-accent-tint)' },
  MISCONCEPTION: { eyebrow: 'COMMON MISTAKE', tint: 'var(--p-danger-tint)' },
  REFLECT: { eyebrow: 'REFLECT', tint: 'var(--p-surface-2)' },
};

export function ConceptLessonScreen() {
  const { code } = useParams<{ code: string }>();
  const [sp] = useSearchParams();
  // Deep-link target: when arriving from /app/notes (wrong-note card) or any
  // "retry this exact problem" link, the URL carries ?problemId=<id>.
  // We jump straight to that problem's first MC step instead of starting the
  // concept-review phase.
  const targetProblemId = sp.get('problemId');
  const nav = useNavigate();
  const qc = useQueryClient();
  const lesson = useQuery({ queryKey: ['lesson', code], queryFn: () => fetchConceptLesson(code!), enabled: !!code });

  // phase 'concept' = all concept steps on one screen
  //       'practice' = Problem 3-step MC; iterates through ALL linked practice problems
  //       'done'     = chapter complete
  const [phase, setPhase] = useState<'concept' | 'practice' | 'done'>('concept');
  const [practiceProblemIdx, setPracticeProblemIdx] = useState(0); // index into problemList
  const [practiceStepIdx, setPracticeStepIdx] = useState(1);       // 1..3 within current problem

  const conceptSteps = useMemo(
    () => (lesson.data?.steps ?? []).filter((s) => s.kind !== 'RETRIEVAL'),
    [lesson.data],
  );

  const problemList = useQuery({
    queryKey: ['practice-problems', code],
    queryFn: () => fetchPracticeProblems(code!),
    enabled: !!code,
  });
  const totalProblems = problemList.data?.length ?? 0;
  const currentProblemId = problemList.data?.[practiceProblemIdx]?.id ?? null;

  // When ?problemId=<id> is in the URL and the list has loaded, jump straight
  // to that problem in practice phase. Runs once per (data, target) pair.
  useEffect(() => {
    if (!targetProblemId || !problemList.data) return;
    const idx = problemList.data.findIndex((p) => p.id === targetProblemId);
    if (idx < 0) return;
    setPhase('practice');
    setPracticeProblemIdx(idx);
    setPracticeStepIdx(1);
  }, [problemList.data, targetProblemId]);
  const problem = useQuery({
    queryKey: ['problem', currentProblemId],
    queryFn: () => fetchProblem(currentProblemId!),
    enabled: !!currentProblemId,
  });
  const hasProblems = totalProblems > 0;
  const currentSteps = problem.data?.steps ?? [];

  // Single atomic call that marks every non-RETRIEVAL step done and stamps
  // masteredAt. Replaces the previous pattern of firing N concurrent /step
  // calls (which raced on completedSteps and could leave masteredAt unset
  // — see P19.2). Also invalidates lessons / dashboard / chapter-progress
  // so LearnScreen, StudyScreen (mastered filter) and HomeScreen pick up
  // the new state immediately.
  const finalizeConcept = useMutation({
    mutationFn: () =>
      post<{ masteredAt: string | null }>(`/concept-lessons/${code}/finalize-concept`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lesson', code] });
      qc.invalidateQueries({ queryKey: ['lessons'] });
      qc.invalidateQueries({ queryKey: ['concept-lessons'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['chapter-progress'] });
    },
  });

  if (lesson.isLoading) return <Shell back={() => nav('/app/learn')}><Centered msg="Loading lesson…" /></Shell>;
  if (lesson.isError || !lesson.data) return <Shell back={() => nav('/app/learn')}><Centered msg="Could not load this lesson." /></Shell>;

  // Indicator: 1 (concept) + N problems
  const segments = 1 + Math.max(1, totalProblems);
  const activeSeg = phase === 'concept' ? 0 : phase === 'practice' ? 1 + practiceProblemIdx : segments - 1;

  const goFromConcept = async () => {
    track('chapter.concept.complete', { chapterCode: code, steps: conceptSteps.length });
    // Finalize (= masteredAt stamp = unlocks Study tab) is intentionally NOT
    // called here anymore. Concept walkthrough alone is not enough — the user
    // must finish all 20 practice problems first. The stamp lives only on
    // goAfterStep's last-problem branch (or, for chapters with zero practice
    // problems, the else branch below).
    if (hasProblems) {
      setPracticeProblemIdx(0);
      setPracticeStepIdx(1);
      setPhase('practice');
    } else {
      // Chapter has no practice problems at all — nothing to gate on, stamp.
      track('chapter.done', { chapterCode: code, hadPractice: false });
      finalizeConcept.mutate();
      setPhase('done');
    }
  };

  // Step within problem cleared → advance step. Last step → next problem. Last problem → done.
  const goAfterStep = () => {
    const totalSteps = currentSteps.length;
    if (practiceStepIdx < totalSteps) {
      setPracticeStepIdx(practiceStepIdx + 1);
      return;
    }
    // finished this problem
    track('chapter.practice.problem-complete', {
      chapterCode: code, problemId: problem.data?.id, problemIdx: practiceProblemIdx + 1, totalProblems,
    });
    if (practiceProblemIdx + 1 < totalProblems) {
      setPracticeProblemIdx(practiceProblemIdx + 1);
      setPracticeStepIdx(1);
      return;
    }
    // all problems done — deep-link entry (Notes ?problemId=) skips
    // goFromConcept, so retry the finalize here to guarantee mastered=true.
    track('chapter.practice.complete', { chapterCode: code, totalProblems });
    track('chapter.done', { chapterCode: code, hadPractice: true });
    finalizeConcept.mutate();
    setPhase('done');
  };

  return (
    <Shell back={() => nav('/app/learn')} title={lesson.data.title}>
      <SegmentIndicator total={segments} active={activeSeg} />
      {phase === 'concept' && (
        <ConceptPhase
          steps={conceptSteps}
          bigIdea={lesson.data.bigIdea}
          onContinue={goFromConcept}
          ctaLabel={hasProblems ? `Continue to ${totalProblems} practice problem${totalProblems > 1 ? 's' : ''}` : 'Finish chapter'}
        />
      )}
      {phase === 'practice' && problem.data && currentSteps[practiceStepIdx - 1] && (
        <PracticePhase
          key={`p${practiceProblemIdx}-s${practiceStepIdx}`}
          problem={problem.data}
          step={currentSteps[practiceStepIdx - 1]}
          stepIdx={practiceStepIdx}
          stepTotal={currentSteps.length}
          problemIdx={practiceProblemIdx + 1}
          problemTotal={totalProblems}
          onNext={goAfterStep}
        />
      )}
      {phase === 'practice' && (!problem.data || problem.isLoading) && (
        <Centered msg="Loading next problem…" />
      )}
      {phase === 'done' && (
        <DonePhase chapterTitle={lesson.data.title} onBack={() => nav('/app/learn')} />
      )}
    </Shell>
  );
}

function Shell({ children, back, title, pill }: {
  children: React.ReactNode; back: () => void; title?: string; pill?: string;
}) {
  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={back} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            {title && <div style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>}
          </div>
        </div>
        {pill && <span className="step-pill" style={{ whiteSpace: 'nowrap' }}>{pill}</span>}
      </div>
      {children}
      <TabBar />
    </div>
  );
}

function SegmentIndicator({ total, active }: { total: number; active: number }) {
  return (
    <div className="steps" style={{ marginTop: 0, paddingTop: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`dot ${i === active ? 'active' : i < active ? 'done' : ''}`} />
      ))}
    </div>
  );
}

// ───────── Phase 0: all concept steps stacked ─────────
function ConceptPhase({ steps, bigIdea, onContinue, ctaLabel }: {
  steps: ConceptStep[]; bigIdea: string; onContinue: () => void; ctaLabel: string;
}) {
  return (
    <>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 22px 16px', minHeight: 0 }}>
        {/* Big Idea now scrolls along with the rest of the lesson — no
            longer sticky-pinned at the top. */}
        {bigIdea && (
          <div style={{ paddingBottom: 12 }}>
            <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>BIG IDEA</span>
            {/* Strip trailing period — Big Idea reads as a headline, not a
                sentence. LLM-generated bigIdea strings often end in `.` */}
            <h3 className="title" style={{ fontSize: 22, marginTop: 6, lineHeight: 1.2 }}>{bigIdea.replace(/\.$/, '')}</h3>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s) => <ConceptStepBlock key={s.id} step={s} />)}
        </div>
        <button className="btn" onClick={onContinue} style={{ marginTop: 20 }}>
          {ctaLabel}
          <Glyph.ChevronR />
        </button>
      </div>
    </>
  );
}

function ConceptStepBlock({ step }: { step: ConceptStep }) {
  const tone = STEP_TONE[step.kind] ?? STEP_TONE.ABSTRACT;
  const mc = step.misconception;
  const hasMisconception = !!(mc && (mc.wrong || mc.why || mc.correct));
  const hasWorked = !!(step.workedSteps && step.workedSteps.length > 0);
  // reflectPrompts is `unknown` from the API (legacy json column). The only
  // shape we currently honour is a string array; everything else renders empty.
  const reflectList = Array.isArray(step.reflectPrompts) ? step.reflectPrompts as string[] : [];
  const hasReflect = reflectList.length > 0;

  // 의미 있는 콘텐츠가 하나도 없으면 통째로 숨김 (빈 껍데기 카드 방지).
  if (!step.body && !hasMisconception && !hasWorked && !hasReflect) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span className="chip" style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>{tone.eyebrow}</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{step.title}</span>
      </div>
      {step.body && (
        <div className="card" style={{ padding: 14, background: tone.tint, borderColor: 'transparent', whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.55, color: 'var(--p-ink-2)' }}>
          <BulletizedMathText text={step.body} />
        </div>
      )}
      {step.kind === 'MISCONCEPTION' && hasMisconception && <Misconception data={step.misconception} />}
      {step.kind === 'WORKED_EXAMPLE' && hasWorked && <WorkedExample steps={step.workedSteps!} />}
      {step.kind === 'REFLECT' && hasReflect && <ReflectPrompts prompts={reflectList} />}
    </div>
  );
}

/**
 * Body 텍스트의 줄 시작 이모지(❌/💡/✅)를 빨강·노랑·초록 작은 동그라미로 치환.
 * LLM이 생성한 ConceptStep body 가 이 세 이모지를 "wrong / hint / correct" 토큰으로
 * 일관되게 쓰고 있어서 UI 측에서 dot 으로 표시. 그 외 줄은 MathText 로 그대로 렌더.
 */
function BulletizedMathText({ text }: { text: string }) {
  const TOKENS: { ch: string; color: string }[] = [
    { ch: '❌', color: 'var(--p-danger)' },
    { ch: '💡', color: '#E0A800' },
    { ch: '✅', color: 'var(--p-success)' },
  ];
  return (
    <>
      {text.split('\n').map((line, i) => {
        const trimmed = line.trimStart();
        const hit = TOKENS.find((t) => trimmed.startsWith(t.ch));
        const rest = hit ? line.replace(hit.ch, '').replace(/^\s+/, '') : line;
        const empty = rest.trim() === '';
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minHeight: empty ? 6 : undefined }}>
            {hit && (
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: hit.color,
                  flexShrink: 0,
                  marginTop: 7,
                }}
              />
            )}
            <span style={{ flex: 1, minWidth: 0 }}>
              {empty ? ' ' : <MathText text={rest} />}
            </span>
          </div>
        );
      })}
    </>
  );
}

function Misconception({ data }: { data: ConceptStep['misconception'] }) {
  if (!data) return null;
  const wrong = data.wrong;
  const why = data.why;
  const correct = data.correct;
  if (!wrong && !why && !correct) return null;
  return (
    <div className="card" style={{ marginTop: 10, padding: 14, borderColor: 'var(--p-danger)' }}>
      <div className="eyebrow" style={{ color: 'var(--p-danger)' }}>COMMON MISTAKE</div>
      {wrong && <div style={{ marginTop: 6, fontSize: 14, color: 'var(--p-ink)' }}><MathText text={wrong} /></div>}
      {why && <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-muted)' }}>Why it’s wrong: <MathText text={why} /></div>}
      {correct && (
        <div style={{ marginTop: 8, padding: 10, background: 'var(--p-success-tint)', borderRadius: 8, fontSize: 13, color: 'var(--p-success)' }}>
          Correct: <MathText text={correct} />
        </div>
      )}
    </div>
  );
}

function WorkedExample({ steps }: { steps: NonNullable<ConceptStep['workedSteps']> }) {
  return (
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {steps.map((s, i) => (
        <div key={i} className="card" style={{ padding: 12, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="chip primary" style={{ fontSize: 10.5, padding: '2px 8px' }}>STEP {i + 1}</span>
          </div>
          <div className="math-big" style={{ fontSize: 16 }}><MathText text={s.math} /></div>
          <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--p-ink-2)' }}><MathText text={s.narration} /></div>
        </div>
      ))}
    </div>
  );
}

function ReflectPrompts({ prompts }: { prompts: string[] }) {
  return (
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {prompts.map((p, i) => (
        <div key={i} className="card" style={{ padding: 12, borderStyle: 'dashed', background: 'transparent' }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>REFLECT</span>
          <div style={{ marginTop: 6, fontSize: 14 }}><MathText text={p} /></div>
        </div>
      ))}
    </div>
  );
}

// ───────── Phase 1: Problem 3-step MC (CONCEPT → PROCESS → ANSWER) ─────────
const STEP_TYPE_LABEL: Record<string, string> = {
  CONCEPT: 'CONCEPT', PROCESS: 'PROCESS', ANSWER: 'ANSWER',
};

type StepResult = {
  isCorrect: boolean;
  selectedChoice: { id: string; text: string; distractorType: string | null; rationale: string | null } | null;
  correctChoice: { id: string; text: string } | null;
};

function PracticePhase({ problem, step, stepIdx, stepTotal, problemIdx, problemTotal, onNext }: {
  problem: Problem; step: ProblemStepData; stepIdx: number; stepTotal: number;
  problemIdx: number; problemTotal: number; onNext: () => void;
}) {
  const qc = useQueryClient();
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const [result, setResult] = useState<StepResult | null>(null);

  const submit = useMutation({
    mutationFn: () => post<{
      isCorrect: boolean;
      selectedChoice: StepResult['selectedChoice'];
      correctChoice: StepResult['correctChoice'];
    }>(`/attempts`, {
      problemId: problem.id,
      choiceId: pickedId,
      stepIndex: step.stepIndex,
      durationSec: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
      context: 'PRACTICE',
    }),
    onSuccess: (r) => {
      setResult({
        isCorrect: r.isCorrect,
        selectedChoice: r.selectedChoice,
        correctChoice: r.correctChoice,
      });
      // Invalidate wrong-notes / dashboard / mastery caches so Notes tab shows the fresh entry.
      if (!r.isCorrect) {
        qc.invalidateQueries({ queryKey: ['wn-list'] });
        qc.invalidateQueries({ queryKey: ['wn-stats'] });
        qc.invalidateQueries({ queryKey: ['wn-recent'] });
      }
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['heatmap'] });
      qc.invalidateQueries({ queryKey: ['chapter-progress'] });
    },
    onError: () => setResult({ isCorrect: false, selectedChoice: null, correctChoice: null }),
  });

  const letters = ['A', 'B', 'C', 'D', 'E'];
  // 정답 맞추기 전까지 lock 안 함 — 오답이면 retry 허용. 정답이면 lock.
  const locked = submit.isPending || result?.isCorrect === true;
  const choices = step.choices ?? [];

  // 새로운 답을 선택하면 직전 result 클리어 (retry 모드).
  const pickChoice = (id: string) => {
    if (locked) return;
    if (result && !result.isCorrect) setResult(null);
    setPickedId(id);
  };

  return (
    <>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 22px 16px', minHeight: 0 }}>
        {/* Question header, prompt, and PROBLEM card now scroll with the rest
            of the practice screen — no longer sticky-pinned at the top. */}
        <div style={{ paddingBottom: 4 }}>
          <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>
            QUESTION {problemIdx} OF {problemTotal} · STEP {stepIdx} OF {stepTotal} · {STEP_TYPE_LABEL[step.stepType] ?? step.stepType}
          </span>
          <h3 className="title" style={{ fontSize: 20, marginTop: 6, lineHeight: 1.25 }}>
            <MathText text={step.prompt} />
          </h3>
          {problem.body && (
            // PROBLEM body stays visible across all three steps (CONCEPT /
            // PROCESS / ANSWER) — the question text is what the student is
            // solving, so it has to be in view when the prompt changes from
            // "which formula?" → "what's the next step?" → "what's the answer?".
            // Attribution (Problem.source) intentionally not rendered.
            <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent', marginTop: 12 }}>
              <div className="math-big" style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}><MathText text={problem.body} /></div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {choices.map((c, i) => {
            const isPicked = pickedId === c.id;
            // 정답일 때만 내가 고른 보기를 초록으로. 오답일 때는 정답 보기 노출 X.
            const isRevealedCorrect = result?.isCorrect && isPicked;
            const isWrongPick = result && !result.isCorrect && isPicked;
            const cls = isRevealedCorrect ? 'choice correct' : isPicked ? 'choice selected' : 'choice';
            return (
              <div
                key={c.id}
                className={cls}
                onClick={() => pickChoice(c.id)}
                style={isWrongPick ? { borderColor: 'var(--p-danger)' } : undefined}
              >
                <div className="letter">{letters[i] ?? c.choiceIndex}</div>
                <span className="text"><MathText text={c.text} /></span>
              </div>
            );
          })}
        </div>

        {result && <FeedbackCard result={result} />}

        {/* Action button lives inside the scroll area — no sticky footer. */}
        <div style={{ marginTop: 16 }}>
          {!result ? (
            <button className="btn" disabled={!pickedId || submit.isPending} onClick={() => submit.mutate()}>
              {submit.isPending ? 'Checking…' : 'Check answer'}
              <Glyph.ChevronR />
            </button>
          ) : result.isCorrect ? (
            <button className="btn" onClick={onNext}>
              {stepIdx < stepTotal
                ? `Continue to STEP ${stepIdx + 1}`
                : problemIdx < problemTotal
                  ? `Next question (${problemIdx + 1}/${problemTotal})`
                  : 'Finish chapter'}
              <Glyph.ChevronR />
            </button>
          ) : (
            <button className="btn outline" onClick={() => { setResult(null); setPickedId(null); }}>
              Try again
            </button>
          )}
        </div>
      </div>
    </>
  );
}

const DISTRACTOR_HINT: Record<string, string> = {
  CONCEPT_CONFUSION: 'You may be mixing this concept with a related one — re-read the abstract step above.',
  CALC_ERROR: 'Numerical / sign / arithmetic slip — redo the calculation step-by-step.',
  PROCESS_SKIP: 'A step in the solution was skipped — walk through every step explicitly.',
  TIME_PRESSURE_GUESS: 'Looks like a guess — slow down, the answer is reachable from the given info.',
};

function FeedbackCard({ result }: { result: StepResult }) {
  const correct = result.isCorrect;
  const sel = result.selectedChoice;
  // 정답은 절대 노출하지 않음 — retry 학습.
  const distractorTypeText = sel?.distractorType ? sel.distractorType.replace(/_/g, ' ') : null;
  // Why-line: prefer DB rationale; else map by distractor type; else generic.
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

// ───────── Phase 2: Done / chapter complete ─────────
function DonePhase({ chapterTitle, onBack }: { chapterTitle: string; onBack: () => void }) {
  return (
    <>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px 16px', minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 24, background: 'var(--p-primary-tint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 32,
        }}>
          <Glyph.Check accent="var(--p-primary)" size={36} />
        </div>
        <div>
          <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>CHAPTER COMPLETE</span>
          <h2 className="title" style={{ fontSize: 26, marginTop: 6 }}>{chapterTitle}</h2>
          <p className="subtitle" style={{ maxWidth: 320 }}>
            Your attempts are saved. Your AI coach will use this data to surface weak patterns and target the next chapter.
          </p>
        </div>
        <button className="btn" onClick={onBack} style={{ marginTop: 16, maxWidth: 280 }}>
          Back to chapters
          <Glyph.ChevronR />
        </button>
      </div>
    </>
  );
}

function Centered({ msg }: { msg: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-muted)' }}>{msg}</div>
  );
}
