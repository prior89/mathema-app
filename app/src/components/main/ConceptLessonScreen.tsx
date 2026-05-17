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
  MISCONCEPTION: { eyebrow: 'COMMON MISTAKE', tint: 'oklch(0.96 0.04 25)' },
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

  const completeStep = useMutation({
    mutationFn: (stepIndex: number) => post<{ ok: boolean }>(`/concept-lessons/${code}/step`, { stepIndex }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lesson', code] }),
  });

  if (lesson.isLoading) return <Shell back={() => nav('/app/learn')}><Centered msg="Loading lesson…" /></Shell>;
  if (lesson.isError || !lesson.data) return <Shell back={() => nav('/app/learn')}><Centered msg="Could not load this lesson." /></Shell>;

  const subtitle = `NCERT ${lesson.data.ncertClass.replace('CLASS_', 'Grade ')} · CH ${lesson.data.chapterNumber}`;

  // Indicator: 1 (concept) + N problems
  const segments = 1 + Math.max(1, totalProblems);
  const activeSeg = phase === 'concept' ? 0 : phase === 'practice' ? 1 + practiceProblemIdx : segments - 1;
  const stepLabel = ['CONCEPT', 'PROCESS', 'ANSWER'];
  const pillLabel = phase === 'concept'
    ? `CONCEPT · ${conceptSteps.length} steps`
    : phase === 'practice'
      ? `Q ${practiceProblemIdx + 1}/${totalProblems} · STEP ${practiceStepIdx} ${stepLabel[practiceStepIdx - 1] ?? ''}`
      : 'COMPLETE';

  const goFromConcept = () => {
    conceptSteps.forEach((s) => completeStep.mutate(s.stepIndex));
    track('chapter.concept.complete', { chapterCode: code, steps: conceptSteps.length });
    if (hasProblems) {
      setPracticeProblemIdx(0);
      setPracticeStepIdx(1);
      setPhase('practice');
    } else {
      track('chapter.done', { chapterCode: code, hadPractice: false });
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
    // all problems done
    track('chapter.practice.complete', { chapterCode: code, totalProblems });
    track('chapter.done', { chapterCode: code, hadPractice: true });
    setPhase('done');
  };

  return (
    <Shell back={() => nav('/app/learn')} title={lesson.data.title} subtitle={subtitle} pill={pillLabel}>
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

function Shell({ children, back, title, subtitle, pill }: {
  children: React.ReactNode; back: () => void; title?: string; subtitle?: string; pill?: string;
}) {
  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={back} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            {subtitle && <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{subtitle}</div>}
            {title && <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>}
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
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
        {bigIdea && (
          <div style={{ marginBottom: 16 }}>
            <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>BIG IDEA</span>
            <h3 className="title" style={{ fontSize: 22, marginTop: 6, lineHeight: 1.2 }}>{bigIdea}</h3>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s) => <ConceptStepBlock key={s.id} step={s} />)}
        </div>
      </div>
      <div className="screen-foot" style={{ paddingTop: 6 }}>
        <button className="btn" onClick={onContinue}>
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
  const hasMisconception = !!(mc && (mc.wrongEn || mc.whyEn || mc.correctEn || mc.wrongKo || mc.whyKo || mc.correctKo));
  const hasWorked = !!(step.workedSteps && step.workedSteps.length > 0);
  const reflectList = step.reflectPrompts?.promptsEn ?? step.reflectPrompts?.promptsKo ?? [];
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
  const wrong = data.wrongEn || data.wrongKo;
  const why = data.whyEn || data.whyKo;
  const correct = data.correctEn || data.correctKo;
  if (!wrong && !why && !correct) return null;
  return (
    <div className="card" style={{ marginTop: 10, padding: 14, borderColor: 'var(--p-danger)' }}>
      <div className="eyebrow" style={{ color: 'var(--p-danger)' }}>COMMON MISTAKE</div>
      {wrong && <div style={{ marginTop: 6, fontSize: 14, color: 'var(--p-ink)' }}><MathText text={wrong} /></div>}
      {why && <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-muted)' }}>Why it’s wrong: <MathText text={why} /></div>}
      {correct && (
        <div style={{ marginTop: 8, padding: 10, background: 'oklch(0.95 0.05 155)', borderRadius: 8, fontSize: 13, color: 'var(--p-success)' }}>
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
          <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--p-ink-2)' }}><MathText text={s.narrationEn || s.narrationKo} /></div>
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
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
        <div style={{ marginBottom: 12 }}>
          <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>
            QUESTION {problemIdx} OF {problemTotal} · STEP {stepIdx} OF {stepTotal} · {STEP_TYPE_LABEL[step.stepType] ?? step.stepType}
          </span>
          <h3 className="title" style={{ fontSize: 20, marginTop: 6, lineHeight: 1.25 }}>
            <MathText text={step.prompt} />
          </h3>
        </div>

        {stepIdx === 1 && problem.body && (
          <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent', marginBottom: 12 }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>PROBLEM · {problem.source.replace(/Class\s+(\d+)/g, 'Grade $1')}</div>
            <div className="math-big" style={{ fontSize: 16, marginTop: 6, whiteSpace: 'pre-wrap' }}><MathText text={problem.body} /></div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
      </div>
      <div className="screen-foot" style={{ paddingTop: 6 }}>
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
        background: correct ? 'oklch(0.95 0.05 155)' : 'oklch(0.96 0.04 25)',
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
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px 8px', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 24, background: 'var(--p-primary-tint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
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
      </div>
      <div className="screen-foot" style={{ paddingTop: 6 }}>
        <button className="btn" onClick={onBack}>
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
