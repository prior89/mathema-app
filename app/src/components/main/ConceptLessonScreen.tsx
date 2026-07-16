/* ConceptLessonScreen — sage-themed lesson view.
 * 2-phase flow:
 *   Phase 0 (concept) — all non-RETRIEVAL steps stacked on one scrollable screen.
 *   Phase 1+ (practice) — linked Problems as multi-step multiple-choice.
 * RETRIEVAL steps are excluded everywhere (user verdict 2026-06-13): solving
 * math mentally without writing space doesn't work — retrieval happens in the
 * practice problems instead.
 */
import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  fetchConceptLesson, fetchPracticeProblems, fetchProblem,
  fetchKoreanConceptLesson, fetchKoreanPracticeProblems,
  type ConceptStep, type Problem, type ProblemStep as ProblemStepData,
  type KoreanConceptStep, type KoreanPracticeProblem,
} from '../../lib/queries';
import { post } from '../../lib/api';
import { track } from '../../lib/analytics';
import { useShuffledChoices } from '../../lib/shuffle';
import { useT } from '../../lib/i18n';
import type { TranslationKey } from '../../lib/translations';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';
import { GraphRenderer } from '../GraphRenderer';
import { DEFAULT_STEP_TONE, STEP_TONE } from '../../lib/step-tone';
import { useBillingStatus } from '../../hooks/useBillingStatus';
import { startPremiumPreview } from '../../lib/billing';

/** Keep in sync with server FREE_TIER_MASTERY_PROBLEMS (billing.constants.ts). */
const FREE_MASTERY_PROBLEMS = 10;
const FULL_MASTERY_PROBLEMS = 20;

function goMasteryPaywall(nav: ReturnType<typeof useNavigate>) {
  track('paywall.gate_hit', { feature: 'full_mastery_sets', freeCap: FREE_MASTERY_PROBLEMS });
  nav('/app/paywall?reason=premium&feature=full_mastery_sets');
}

/* Scaffold policy (2026-06-12 audit, expertise-reversal effect): every
 * practice problem serves the ANSWER step directly. The CONCEPT→PROCESS
 * scaffold is entered only on demand — a wrong answer offers "Break it
 * into steps", and an opt-in button is available before answering.
 * (Previously the first 3 problems were force-scaffolded; that punished
 * students who could already solve them.) */

export function ConceptLessonScreen() {
  const { code } = useParams<{ code: string }>();
  // Korean curriculum chapters use the K- prefix (e.g. K-G10-CS1-CH01-...)
  // and live in a separate KoreanConceptLesson table served by a different
  // endpoint. Route those into the dedicated KO renderer (concept-only,
  // no practice problems yet — Phase 4 adds the KO problem pool).
  if (code?.startsWith('K-')) return <KoreanConceptLessonScreen code={code} />;
  return <NcertConceptLessonScreen code={code} />;
}

function NcertConceptLessonScreen({ code }: { code: string | undefined }) {
  const { t } = useT();
  const [sp] = useSearchParams();
  // Deep-link target: when arriving from /app/notes (wrong-note card) or any
  // "retry this exact problem" link, the URL carries ?problemId=<id>.
  // We jump straight to that problem's first MC step instead of starting the
  // concept-review phase.
  const targetProblemId = sp.get('problemId');
  const nav = useNavigate();
  const qc = useQueryClient();
  const billing = useBillingStatus();
  const lesson = useQuery({ queryKey: ['lesson', code], queryFn: () => fetchConceptLesson(code!), enabled: !!code });

  // phase 'concept' = all concept steps on one screen
  //       'practice' = Problem 3-step MC; iterates through ALL linked practice problems
  //       'done'     = chapter complete
  // Default is null until the lesson detail loads; the useEffect below resolves
  // it to 'concept' (first time) or 'practice' (returning user with
  // conceptWalkthroughAt set) so a re-entry via Home's progress card resumes
  // at the next problem instead of replaying the concept phase.
  const [phase, setPhase] = useState<'concept' | 'practice' | 'done' | null>(null);
  const [practiceProblemIdx, setPracticeProblemIdx] = useState(0); // index into problemList
  const [practiceStepIdx, setPracticeStepIdx] = useState(1);       // 1..N within effective steps
  // True once the student enters the CONCEPT→PROCESS→ANSWER scaffold for the
  // current problem (wrong answer or opt-in). Resets on problem advance.
  const [decomposed, setDecomposed] = useState(false);

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
  const freeMasteryLimitReached =
    billing.data?.billingUiEnabled === true
    && billing.data.premium === false
    && totalProblems === FREE_MASTERY_PROBLEMS;

  const preview = useMutation({
    mutationFn: startPremiumPreview,
    onSuccess: async () => {
      const solvedCount = totalProblems;
      await qc.invalidateQueries({ queryKey: ['billing-status'] });
      const refreshed = await problemList.refetch();
      if ((refreshed.data?.length ?? 0) > solvedCount) {
        setPracticeProblemIdx(solvedCount);
        setPracticeStepIdx(1);
        setDecomposed(false);
        setPhase('practice');
        return;
      }
      goMasteryPaywall(nav);
    },
  });

  // Resolve initial phase once lesson + problemList have loaded.
  // Priority order (user-report 2026-05-23 — Korean dogfood):
  //   1. practiceAttempts === 0 → force concept walkthrough first, even if
  //      Home / Mastery sent a ?problemId=<id> deep-link. Reading the concept
  //      page without solving a problem doesn't count as "progressed".
  //   2. ?problemId=<id> in URL → jump straight to that problem (Notes
  //      "retry this problem" deep-link, valid only after first solve).
  //   3. practiceAttempts > 0 → resume practice from the first problem.
  useEffect(() => {
    if (phase !== null) return; // already resolved
    if (!lesson.data || !problemList.data) return;
    const attempts = lesson.data.progress?.practiceAttempts ?? 0;
    if (attempts === 0) {
      setPhase('concept');
      return;
    }
    if (targetProblemId) {
      const idx = problemList.data.findIndex((p) => p.id === targetProblemId);
      setPhase('practice');
      setPracticeProblemIdx(idx >= 0 ? idx : 0);
      setPracticeStepIdx(1);
      return;
    }
    setPhase('practice');
    setPracticeProblemIdx(0);
    setPracticeStepIdx(1);
  }, [phase, lesson.data, problemList.data, targetProblemId]);
  const problem = useQuery({
    queryKey: ['problem', currentProblemId],
    queryFn: () => fetchProblem(currentProblemId!),
    enabled: !!currentProblemId,
  });
  const hasProblems = totalProblems > 0;
  const allSteps = problem.data?.steps ?? [];
  const answerSteps = allSteps.filter((s) => s.stepType === 'ANSWER');
  const faded =
    !decomposed
    && allSteps.length > 1
    && answerSteps.length > 0;
  const currentSteps = faded ? answerSteps : allSteps;

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

  if (lesson.isLoading) return <Shell back={() => nav('/app/learn')}><Centered msg={t('lesson.loading')} /></Shell>;
  if (lesson.isError || !lesson.data) return <Shell back={() => nav('/app/learn')}><Centered msg={t('lesson.error')} /></Shell>;
  // phase resolves in the useEffect once both lesson + problemList are ready.
  // Until then keep showing the spinner so we never flash the concept walkthrough
  // for returning users.
  if (phase === null) return <Shell back={() => nav('/app/learn')}><Centered msg={t('lesson.loading')} /></Shell>;

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
      setDecomposed(false);
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
      setDecomposed(false);
      return;
    }
    // All currently available problems are done. For Free this is the
    // five-problem sample, not full 20-problem mastery; finalizeConcept only
    // records that the concept walkthrough was completed.
    track('chapter.practice.complete', { chapterCode: code, totalProblems });
    track(
      freeMasteryLimitReached ? 'chapter.practice.free-limit-reached' : 'chapter.done',
      { chapterCode: code, hadPractice: true, totalProblems },
    );
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
          ctaLabel={hasProblems ? t('lesson.cta.continue', { n: totalProblems }) : t('lesson.cta.finishChapter')}
        />
      )}
      {phase === 'practice' && problem.data && currentSteps[practiceStepIdx - 1] && (
        <PracticePhase
          key={`p${practiceProblemIdx}-s${practiceStepIdx}-${faded ? 'f' : 'x'}`}
          problem={problem.data}
          step={currentSteps[practiceStepIdx - 1]}
          stepIdx={practiceStepIdx}
          stepTotal={currentSteps.length}
          problemIdx={practiceProblemIdx + 1}
          problemTotal={totalProblems}
          onNext={goAfterStep}
          onDecompose={
            faded
              ? () => {
                  setDecomposed(true);
                  setPracticeStepIdx(1);
                }
              : undefined
          }
        />
      )}
      {phase === 'practice' && (!problem.data || problem.isLoading) && (
        <Centered msg={t('lesson.loadingNext')} />
      )}
      {phase === 'done' && (
        <DonePhase
          chapterTitle={lesson.data.title}
          onBack={() => nav('/app/learn')}
          freeLimit={freeMasteryLimitReached ? {
            solved: totalProblems,
            total: FULL_MASTERY_PROBLEMS,
            previewDays: billing.data?.monetization?.premiumPreview?.days ?? 3,
            previewEligible: billing.data?.entitlement?.previewEligibility.eligible === true,
            previewLoading: billing.isLoading || preview.isPending,
            previewError: preview.isError,
            onStartPreview: () => preview.mutate(),
            onViewPremium: () => goMasteryPaywall(nav),
          } : undefined}
        />
      )}
    </Shell>
  );
}

function Shell({ children, back, title, pill }: {
  children: React.ReactNode; back: () => void; title?: string; pill?: string;
}) {
  const { t } = useT();
  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={back} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label={t('lesson.back')}>
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
  const { t } = useT();
  return (
    <>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 22px 16px', minHeight: 0 }}>
        {/* Big Idea now scrolls along with the rest of the lesson — no
            longer sticky-pinned at the top. */}
        {bigIdea && (
          <div style={{ paddingBottom: 12 }}>
            <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>{t('lesson.bigIdea')}</span>
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
  const { t } = useT();
  const [sp] = useSearchParams();
  // Re-teach deep-link target: AnswerFeedbackSheet sends the learner here
  // with ?focus=<ConceptStepKind> to address the failure mode behind their
  // last wrong answer. Scroll the matched step into view and highlight it.
  const focus = sp.get('focus');
  const isFocused = focus === step.kind;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFocused) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isFocused]);
  const tone = STEP_TONE[step.kind] ?? DEFAULT_STEP_TONE;
  const mc = step.misconception;
  const hasMisconception = !!(mc && (mc.wrong || mc.why || mc.correct));
  const hasWorked = !!(step.workedSteps && step.workedSteps.length > 0);
  // reflectPrompts is `unknown` from the API (legacy json column). The only
  // shape we currently honour is a string array; everything else renders empty.
  const reflectList = Array.isArray(step.reflectPrompts) ? step.reflectPrompts as string[] : [];
  const hasReflect = reflectList.length > 0;

  const hasVisual = !!step.visualData;
  // 의미 있는 콘텐츠가 하나도 없으면 통째로 숨김 (빈 껍데기 카드 방지).
  if (!step.body && !hasMisconception && !hasWorked && !hasReflect && !hasVisual) return null;

  return (
    <div
      className="concept-step"
      ref={ref}
      style={isFocused ? { outline: '2px solid var(--p-primary)', outlineOffset: 4, borderRadius: 8 } : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span
          className="chip concept-step-chip"
          style={{
            fontSize: 10.5,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
            background: tone.chipBg,
            color: tone.chipColor,
            borderColor: 'transparent',
          }}
        >
          {t(`step.eyebrow.${step.kind}` as any) || tone.eyebrow}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--p-ink)' }}>{step.title}</span>
      </div>
      {step.body && (
        <div
          className="card concept-step-body"
          style={{ padding: 14, borderLeft: `3px solid ${tone.accent}`, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.6, color: 'var(--p-ink)' }}
        >
          <BulletizedMathText text={step.body} />
        </div>
      )}
      {hasVisual && (
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <GraphRenderer data={step.visualData} />
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
    { ch: '💡', color: 'var(--p-hint)' },
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
  const { t } = useT();
  if (!data) return null;
  const wrong = data.wrong;
  const why = data.why;
  const correct = data.correct;
  if (!wrong && !why && !correct) return null;
  return (
    <div className="card" style={{ marginTop: 10, padding: 14, borderColor: 'var(--p-danger)' }}>
      <div className="eyebrow" style={{ color: 'var(--p-danger)' }}>{t('lesson.common.mistake')}</div>
      {wrong && <div style={{ marginTop: 6, fontSize: 14, color: 'var(--p-ink)' }}><MathText text={wrong} /></div>}
      {why && <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-muted)' }}>{t('lesson.misconception.whyWrong')} <MathText text={why} /></div>}
      {correct && (
        <div style={{ marginTop: 8, padding: 10, background: 'var(--p-success-tint)', borderRadius: 8, fontSize: 13, color: 'var(--p-success-ink)' }}>
          {t('lesson.misconception.correct')} <MathText text={correct} />
        </div>
      )}
    </div>
  );
}

function WorkedExample({ steps }: { steps: NonNullable<ConceptStep['workedSteps']> }) {
  const { t } = useT();
  const [revealed, setRevealed] = useState<Record<number, true>>({});
  return (
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {steps.map((s, i) => {
        const faded = s.fade === true && !revealed[i];
        return (
          <div key={i} className="card" style={{ padding: 12, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="chip primary" style={{ fontSize: 10.5, padding: '2px 8px' }}>{t('lesson.workedExample.step', { n: i + 1 })}</span>
            </div>
            <div className="math-big" style={{ fontSize: 16 }}><MathText text={s.math} /></div>
            {faded ? (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 12.5, color: 'var(--p-muted)', margin: '0 0 6px' }}>{t('lesson.workedExample.fade.hint')}</p>
                <button type="button" className="btn text" style={{ padding: '4px 8px', fontSize: 12.5 }} onClick={() => setRevealed((r) => ({ ...r, [i]: true }))}>
                  {t('lesson.workedExample.fade.cta')}
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--p-ink-2)' }}><MathText text={s.narration} /></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReflectPrompts({ prompts }: { prompts: string[] }) {
  const { t } = useT();
  return (
    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {prompts.map((p, i) => (
        <div key={i} className="card" style={{ padding: 12, borderStyle: 'dashed', background: 'transparent' }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>{t('lesson.reflect')}</span>
          <div style={{ marginTop: 6, fontSize: 14 }}><MathText text={p} /></div>
        </div>
      ))}
    </div>
  );
}

// ───────── Phase 1: Problem 3-step MC (CONCEPT → PROCESS → ANSWER) ─────────
// Localized step labels (2026-06-12 audit): raw CONCEPT/PROCESS/ANSWER enum
// values were leaking into the question header.
const STEP_TYPE_LABEL_KEY: Record<string, TranslationKey> = {
  CONCEPT: 'study.step.concept', PROCESS: 'study.step.process', ANSWER: 'study.step.answer',
};
const DISTRACTOR_CHIP_KEY: Record<string, TranslationKey> = {
  CONCEPT_CONFUSION: 'study.feedback.distractor.concept',
  CALC_ERROR: 'study.feedback.distractor.calc',
  PROCESS_SKIP: 'study.feedback.distractor.process',
  TIME_PRESSURE_GUESS: 'study.feedback.distractor.time',
};
// KoreanPracticePhase renders hardcoded ko copy, so its step label maps here
// instead of going through t().
const KO_STEP_LABEL: Record<string, string> = {
  CONCEPT: '개념', PROCESS: '풀이 과정', ANSWER: '정답',
};

type StepResult = {
  isCorrect: boolean;
  selectedChoice: { id: string; text: string; distractorType: string | null; rationale: string | null } | null;
  correctChoice: { id: string; text: string } | null;
  // Set true on submit network/5xx/BadRequest failure (vs. legitimate "wrong
  // answer"). Lets the UI tell the student "the server couldn't grade your
  // answer" instead of pretending their pick was wrong.
  error?: boolean;
};

function PracticePhase({ problem, step, stepIdx, stepTotal, problemIdx, problemTotal, onNext, onDecompose }: {
  problem: Problem; step: ProblemStepData; stepIdx: number; stepTotal: number;
  problemIdx: number; problemTotal: number; onNext: () => void;
  /** Present only in faded (ANSWER-only) mode — enters the full
   *  CONCEPT→PROCESS→ANSWER scaffold (opt-in or after a wrong answer). */
  onDecompose?: () => void;
}) {
  const qc = useQueryClient();
  const { t } = useT();
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
    // A submit failure is NOT a wrong answer — flag it so the UI shows a distinct
    // retry state instead of gaslighting the learner into thinking they missed
    // (mirrors the KO branch fix; Nielsen #9 error recovery).
    onError: () => setResult({ isCorrect: false, selectedChoice: null, correctChoice: null, error: true }),
  });

  const letters = ['A', 'B', 'C', 'D', 'E'];
  // 정답 맞추기 전까지 lock 안 함 — 오답이면 retry 허용. 정답이면 lock.
  const locked = submit.isPending || result?.isCorrect === true;
  const choices = useShuffledChoices(step.choices ?? []);

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
            {t('lesson.practice.questionHeader', { idx: problemIdx, total: problemTotal, step: stepIdx, steps: stepTotal, label: STEP_TYPE_LABEL_KEY[step.stepType] ? t(STEP_TYPE_LABEL_KEY[step.stepType]) : step.stepType })}
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
            const cls = isRevealedCorrect ? 'choice correct' : isWrongPick ? 'choice wrong' : isPicked ? 'choice selected' : 'choice';
            return (
              <button
                type="button"
                key={c.id}
                className={cls}
                aria-pressed={isPicked}
                onClick={() => pickChoice(c.id)}
              >
                <div className="letter">{letters[i] ?? c.choiceIndex}</div>
                <span className="text"><MathText text={c.text} /></span>
              </button>
            );
          })}
        </div>

        {result && result.error ? (
          <div role="alert" style={{
            background: 'var(--p-danger-tint)', color: 'var(--p-danger-ink)',
            border: '1px solid var(--p-danger)', borderRadius: 8,
            padding: '10px 12px', fontSize: 14, lineHeight: 1.45, marginTop: 12,
          }}>
            {t('lesson.feedback.submitError')}
            <br />
            <span style={{ fontSize: 12.5, color: 'var(--p-ink-2)' }}>{t('lesson.feedback.submitErrorHint')}</span>
          </div>
        ) : result ? <FeedbackCard result={result} /> : null}
      </div>

      {/* Pinned footer (2026-06-12 audit): the Check CTA was scrolling out of
          view with no affordance that it existed below the fold. */}
      <div className="screen-foot" style={{ paddingTop: 6 }}>
        {!result ? (
          <>
            <button className="btn" disabled={!pickedId || submit.isPending} onClick={() => submit.mutate()}>
              {submit.isPending ? t('solo.checking') : t('solo.checkAnswer')}
              <Glyph.ChevronR />
            </button>
            {onDecompose && (
              <button className="btn outline" onClick={onDecompose}>
                {t('lesson.practice.breakDown')}
              </button>
            )}
          </>
        ) : result.error ? (
          <button className="btn" disabled={submit.isPending} onClick={() => submit.mutate()}>
            {submit.isPending ? t('solo.checking') : t('solo.checkAnswer')}
            <Glyph.ChevronR />
          </button>
        ) : result.isCorrect ? (
          <button className="btn" onClick={onNext}>
            {stepIdx < stepTotal
              ? t('lesson.practice.continueStep', { n: stepIdx + 1 })
              : problemIdx < problemTotal
                ? t('lesson.practice.nextQuestion', { next: problemIdx + 1, total: problemTotal })
                : t('lesson.practice.finishChapter')}
            <Glyph.ChevronR />
          </button>
        ) : (
          <>
            {onDecompose && (
              <button className="btn" onClick={onDecompose}>
                {t('lesson.practice.breakDown')}
                <Glyph.ChevronR />
              </button>
            )}
            <button className="btn outline" onClick={() => { setResult(null); setPickedId(null); }}>
              {t('solo.tryAgain')}
            </button>
          </>
        )}
      </div>
    </>
  );
}

function FeedbackCard({ result }: { result: StepResult }) {
  const { t } = useT();
  const correct = result.isCorrect;
  const sel = result.selectedChoice;
  // 정답은 절대 노출하지 않음 — retry 학습.
  const distractorTypeText = sel?.distractorType
    ? t(DISTRACTOR_CHIP_KEY[sel.distractorType] ?? 'study.feedback.distractor.other')
    : null;
  const distractorHint: Record<string, string> = {
    CONCEPT_CONFUSION: t('lesson.feedback.distractor.concept'),
    CALC_ERROR: t('lesson.feedback.distractor.calc'),
    PROCESS_SKIP: t('lesson.feedback.distractor.process'),
    TIME_PRESSURE_GUESS: t('lesson.feedback.distractor.time'),
  };
  // Why-line: prefer DB rationale; else map by distractor type; else generic.
  const whyLine = sel?.rationale
    ?? (sel?.distractorType ? distractorHint[sel.distractorType] : null)
    ?? (correct ? null : t('lesson.feedback.distractor.other'));

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
        {correct ? t('lesson.feedback.correct') : t('lesson.feedback.wrong')}
      </div>
      {whyLine && (
        <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-ink-2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--p-ink)' }}>
            {correct ? t('lesson.feedback.whyWorks') : t('lesson.feedback.whyMissed')}
          </strong>
          <MathText text={whyLine} />
        </div>
      )}
      {!correct && distractorTypeText && (
        <div style={{ marginTop: 8 }}>
          <span className="chip" style={{ fontSize: 10.5 }}>{distractorTypeText}</span>
        </div>
      )}
    </div>
  );
}

type FreeLimitState = {
  solved: number;
  total: number;
  previewDays: number;
  previewEligible: boolean;
  previewLoading: boolean;
  previewError: boolean;
  onStartPreview: () => void;
  onViewPremium: () => void;
};

// ───────── Phase 2: Done / chapter complete ─────────
function DonePhase({
  chapterTitle,
  onBack,
  freeLimit,
}: {
  chapterTitle: string;
  onBack: () => void;
  freeLimit?: FreeLimitState;
}) {
  const { t } = useT();
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
          <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>
            {t(freeLimit ? 'lesson.freeDone.eyebrow' : 'lesson.done.eyebrow')}
          </span>
          <h2 className="title" style={{ fontSize: 26, marginTop: 6 }}>{chapterTitle}</h2>
          {freeLimit ? (
            <>
              <div
                className="chip"
                style={{ margin: '12px auto 0', width: 'fit-content', color: 'var(--p-primary)' }}
              >
                {t('lesson.freeDone.progress', {
                  solved: freeLimit.solved,
                  total: freeLimit.total,
                })}
              </div>
              <p className="subtitle" style={{ maxWidth: 330 }}>
                {t('lesson.freeDone.body', {
                  solved: freeLimit.solved,
                  remaining: freeLimit.total - freeLimit.solved,
                })}
              </p>
            </>
          ) : (
            <p className="subtitle" style={{ maxWidth: 320 }}>
              {t('lesson.done.body')}
            </p>
          )}
        </div>
        {freeLimit ? (
          <div style={{ width: '100%', maxWidth: 320, display: 'grid', gap: 10 }}>
            {freeLimit.previewEligible && (
              <button
                className="btn"
                onClick={freeLimit.onStartPreview}
                disabled={freeLimit.previewLoading}
              >
                {freeLimit.previewLoading
                  ? t('lesson.freeDone.previewStarting')
                  : t('lesson.freeDone.preview', { days: freeLimit.previewDays })}
                <Glyph.ChevronR />
              </button>
            )}
            {freeLimit.previewError && (
              <div className="alert error" role="alert">
                {t('lesson.freeDone.previewError')}
              </div>
            )}
            <button className="btn outline" onClick={freeLimit.onViewPremium}>
              {t('lesson.freeDone.premium')}
              <Glyph.ChevronR />
            </button>
            <button className="btn text" onClick={onBack}>
              {t('lesson.done.backChapters')}
            </button>
          </div>
        ) : (
          <button className="btn" onClick={onBack} style={{ marginTop: 16, maxWidth: 280 }}>
            {t('lesson.done.backChapters')}
            <Glyph.ChevronR />
          </button>
        )}
      </div>
    </>
  );
}

function Centered({ msg }: { msg: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-muted)' }}>{msg}</div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Korean curriculum lesson renderer (concept phase only).
//  Practice / mastery 게이팅은 Korean Problem pool (Phase 4) 들어온 뒤
//  ConceptLessonsService 의 country=KR 분기와 함께 추가됨.
// ─────────────────────────────────────────────────────────────────────────
function KoreanConceptLessonScreen({ code }: { code: string }) {
  const nav = useNavigate();
  const { t } = useT();
  const qc = useQueryClient();
  const billing = useBillingStatus();
  const location = useLocation();
  // Deep-link target: when Home chapter-progress card sends ?problemId=X
  // the screen skips the concept walkthrough and lands the student straight
  // in the practice phase at that problem. (User spec 2026-05-24: Home 카드
  // 클릭 → 진행 중 문제로 바로.)
  const deepProblemId = new URLSearchParams(location.search).get('problemId');
  const [phase, setPhase] = useState<'concept' | 'practice' | 'done'>(
    deepProblemId ? 'practice' : 'concept',
  );
  const [resumeProblemId, setResumeProblemId] = useState<string | null>(null);
  const lesson = useQuery({ queryKey: ['ko-lesson', code], queryFn: () => fetchKoreanConceptLesson(code) });
  const practice = useQuery({
    queryKey: ['ko-practice', code],
    queryFn: () => fetchKoreanPracticeProblems(code),
    enabled: !!code,
  });
  const problemCount = practice.data?.length ?? 0;
  const freeMasteryLimitReached =
    billing.data?.billingUiEnabled === true
    && billing.data.premium === false
    && problemCount === FREE_MASTERY_PROBLEMS;
  const preview = useMutation({
    mutationFn: startPremiumPreview,
    onSuccess: async () => {
      const solvedCount = problemCount;
      await qc.invalidateQueries({ queryKey: ['billing-status'] });
      const refreshed = await practice.refetch();
      const nextProblem = refreshed.data?.[solvedCount];
      if (nextProblem) {
        setResumeProblemId(nextProblem.id);
        setPhase('practice');
        return;
      }
      goMasteryPaywall(nav);
    },
  });

  if (lesson.isLoading) {
    return <Shell back={() => nav('/app/learn')}><Centered msg={t('lesson.loading')} /></Shell>;
  }
  if (lesson.isError || !lesson.data) {
    return <Shell back={() => nav('/app/learn')}><Centered msg={t('lesson.error')} /></Shell>;
  }

  // Phase 'practice' — multi-step practice.
  //   startProblemId priority:
  //     1) ?problemId=X from URL  (Home chapter-progress card deep-link)
  //     2) lesson.nextProblemId   (Learn-chapter-click → "연습 문제 풀기"
  //                                lands on user's in-progress problem)
  //     3) null                   (cold entry / mastered re-attempt → Q1)
  //
  //   Bug fix 2026-05-27: gate mounting KoreanPracticePhase on practice.data
  //   actually being loaded. The phase computes its initial problemIdx via
  //   useState(() => problems.findIndex(...)) — if we mount with an empty
  //   problems array (practice still loading), the findIndex returns -1 →
  //   fallback to 0 → useState locks problemIdx=0 forever. Result was the
  //   Home → chapter-progress card deep-link silently landing on Q1 instead
  //   of the user's actual in-progress problem ("어떤 챕터는 연결 안 됨"
  //   report). Showing the lesson-level loading shell here keeps the practice
  //   phase from initializing with a stale empty array.
  if (phase === 'practice') {
    if (practice.isLoading || !practice.data) {
      return <Shell back={() => setPhase('concept')}><Centered msg={t('lesson.loading')} /></Shell>;
    }
    const startId = resumeProblemId ?? deepProblemId ?? lesson.data.nextProblemId ?? null;
    return (
      <KoreanPracticePhase
        chapterCode={code}
        titleKo={lesson.data.titleKo}
        problems={practice.data}
        isLoading={false}
        startProblemId={startId}
        onBack={() => setPhase('concept')}
        onDone={() => setPhase('done')}
      />
    );
  }

  if (phase === 'done') {
    return (
      <Shell back={() => nav('/app/learn')}>
        <DonePhase
          chapterTitle={lesson.data.titleKo}
          onBack={() => nav('/app/learn')}
          freeLimit={freeMasteryLimitReached ? {
            solved: problemCount,
            total: FULL_MASTERY_PROBLEMS,
            previewDays: billing.data?.monetization?.premiumPreview?.days ?? 3,
            previewEligible: billing.data?.entitlement?.previewEligibility.eligible === true,
            previewLoading: billing.isLoading || preview.isPending,
            previewError: preview.isError,
            onStartPreview: () => preview.mutate(),
            onViewPremium: () => goMasteryPaywall(nav),
          } : undefined}
        />
      </Shell>
    );
  }

  const { titleKo, bigIdeaKo, steps } = lesson.data;
  // RETRIEVAL cards excluded (user verdict 2026-06-13): a recall question with
  // no working space is unanswerable, and revealing the answer defeats it.
  const visibleSteps = steps.filter((s) => s.kind !== 'RETRIEVAL');

  return (
    <Shell back={() => nav('/app/learn')}>
      {/* Scroll container — Shell itself doesn't scroll; the children take
          flex:1 + overflow:auto so the full 7-card concept cycle is reachable
          on phones where the stack exceeds viewport height. */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '12px 20px 24px' }}>
          {/* Student-facing title. Internal chapter codes stay in analytics
              and routes; they are not useful lesson content. */}
          <div>
            <h1 className="display" style={{ fontSize: 24, lineHeight: 1.25 }}>{titleKo}</h1>
          </div>

          {/* BIG IDEA — NCERT 포맷과 동일하게 eyebrow + 큰 헤드라인.
              trailing period 제거: 큰 글씨 헤드라인은 문장이 아니라 슬로건. */}
          {bigIdeaKo && (
            <div>
              <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>{t('lesson.bigIdea')}</span>
              <h3 className="title" style={{ fontSize: 22, marginTop: 6, lineHeight: 1.2 }}>
                <MathText text={bigIdeaKo.replace(/\.$/, '')} />
              </h3>
            </div>
          )}

          {visibleSteps.length === 0 && (
            <div className="card" style={{ padding: 16, color: 'var(--p-muted)', fontSize: 13 }}>
              이 단원의 학습 콘텐츠가 아직 준비되지 않았어요.
            </div>
          )}

          {visibleSteps.map((s) => (
            <KoreanStepCard key={s.id} step={s} />
          ))}

          {/* CTA — concept 끝나면 practice phase 로 진입. 문제 풀이 없으면
              그냥 챕터 목록으로. */}
          {/* CTA: distinguish three states so we never tell the user
              "준비 중" while practice is still loading.
                practice.isLoading  → "..." skeleton button (no decision yet)
                problemCount > 0    → 연습 문제 풀기
                else                → 진짜로 준비 중 메시지 */}
          {practice.isLoading ? (
            <button className="btn" disabled style={{ marginTop: 8, maxWidth: 320, alignSelf: 'center', opacity: 0.6 }}>
              불러오는 중…
            </button>
          ) : problemCount > 0 ? (
            <button
              className="btn"
              onClick={() => setPhase('practice')}
              style={{ marginTop: 8, maxWidth: 320, alignSelf: 'center' }}
            >
              연습 문제 풀기 ({problemCount}문제)<Glyph.ChevronR />
            </button>
          ) : (
            <>
              <div style={{ fontSize: 12.5, color: 'var(--p-muted)', textAlign: 'center', marginTop: 8 }}>
                이 단원의 연습 문제는 아직 준비 중입니다.
              </div>
              <button className="btn" onClick={() => nav('/app/learn')} style={{ marginTop: 4, maxWidth: 280, alignSelf: 'center' }}>
                {t('lesson.done.backChapters')}
                <Glyph.ChevronR />
              </button>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}


// ─────────────────────────────────────────────────────────────────────────
//  Korean practice phase — multi-step (CONCEPT → PROCESS → ANSWER)
//  per user spec 2026-05-24. Mirrors NCERT PracticePhase patterns:
//   - POST /attempts per step submission (server-side grading + Attempt row)
//   - retry on wrong (lock only on correct, matches Study Try Again policy)
//   - advance step → advance problem → onDone()
//   - reuses NCERT FeedbackCard for distractor rationale display
// ─────────────────────────────────────────────────────────────────────────
function KoreanPracticePhase({
  chapterCode, titleKo, problems, isLoading, startProblemId, onBack, onDone,
}: {
  chapterCode: string;
  titleKo: string;
  problems: KoreanPracticeProblem[];
  isLoading: boolean;
  /** Deep-link target: when set, the phase opens at this problem's index
   *  (Home chapter-progress card → ?problemId=X). null/undefined = start
   *  at problem 1 (Learn chapter-click cold entry). */
  startProblemId?: string | null;
  onBack: () => void;
  onDone: () => void;
}) {
  // Initial problem index: deep-link target if present and found, else 0.
  const initialIdx = (() => {
    if (!startProblemId) return 0;
    const i = problems.findIndex((p) => p.id === startProblemId);
    return i >= 0 ? i : 0;
  })();
  const [problemIdx, setProblemIdx] = useState(initialIdx);
  const [stepIdx, setStepIdx] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [result, setResult] = useState<StepResult | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  // Scaffold entered (wrong answer or opt-in) — same policy as NCERT above.
  const [decomposed, setDecomposed] = useState(false);
  const qc = useQueryClient();

  // Derived values must stay above the hook calls below — but crucially,
  // ALL hooks (useShuffledChoices, useMutation) now run on every render,
  // even when isLoading or problems is empty. The early returns moved
  // below the hook block fix the previous React-rules-of-hooks violation
  // (hook count changed between renders → "Rendered more hooks…" crash).
  // Derived values are nullable-safe; the mutationFn closure only runs
  // when the user taps submit, which is unreachable until problems load
  // and the early returns let the render through.
  const problem = problems[problemIdx];
  const allSteps = problem?.steps ?? [];
  const answerSteps = allSteps.filter((s) => s.stepType === 'ANSWER');
  const faded =
    !decomposed
    && allSteps.length > 1
    && answerSteps.length > 0;
  const effectiveSteps = faded ? answerSteps : allSteps;
  const step = effectiveSteps[stepIdx];
  // 보기 셔플: step 이 바뀔 때 자동 재셔플 (choice id 집합 변경 감지).
  const shuffledChoices = useShuffledChoices(step?.choices ?? []);
  const stepTotal = effectiveSteps.length;
  const problemTotal = problems.length;
  // Reference chapterCode so the prop isn't flagged as unused — future
  // analytics will key per-chapter attempt logs on it.
  void chapterCode;

  const submit = useMutation({
    mutationFn: () => post<{
      isCorrect: boolean;
      selectedChoice: StepResult['selectedChoice'];
      correctChoice: StepResult['correctChoice'];
    }>(`/attempts`, {
      problemId: problem!.id,
      choiceId: pickedId,
      stepIndex: step!.stepIndex,
      durationSec: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
      context: 'PRACTICE',
    }),
    onSuccess: (r) => {
      setResult({
        isCorrect: r.isCorrect,
        selectedChoice: r.selectedChoice,
        correctChoice: r.correctChoice,
      });
      if (!r.isCorrect) {
        qc.invalidateQueries({ queryKey: ['wn-list'] });
        qc.invalidateQueries({ queryKey: ['wn-stats'] });
      }
      qc.invalidateQueries({ queryKey: ['ko-practice', chapterCode] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      // Sprint 1 smoke fix: HomeScreen uses ['chapter-progress'] (country-aware
      // backend dispatch). NCERT branch (line ~463) already invalidates this
      // — the KR branch was missing it, so Home stayed stale until manual
      // refresh after every KR practice attempt.
      qc.invalidateQueries({ queryKey: ['chapter-progress'] });
    },
    // 2026-05-27 KR audit follow-up: previously a network failure / 5xx /
    // BadRequest from the new stepIndex cross-check would silently surface as
    // a normal "wrong answer" feedback card — making the student believe
    // their (possibly correct) pick was wrong. Surface the real error and
    // log to console for triage so we never gaslight the learner again.
    onError: (e: any) => {
      // eslint-disable-next-line no-console
      console.error('[ko-practice] /attempts failed', {
        problemId: problem!.id,
        choiceId: pickedId,
        stepIndex: step!.stepIndex,
        status: e?.response?.status,
        body: e?.response?.data,
      });
      setResult({ isCorrect: false, selectedChoice: null, correctChoice: null, error: true });
    },
  });

  // Early returns LAST — see rules-of-hooks rationale at the derived-values
  // block above. Anything below this point can safely dereference problem.
  if (isLoading) {
    return <Shell back={onBack}><Centered msg="문제를 불러오는 중…" /></Shell>;
  }
  if (problems.length === 0) {
    return (
      <Shell back={onBack}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
          <div style={{ fontSize: 14, color: 'var(--p-muted)' }}>이 단원의 연습 문제는 아직 준비 중입니다.</div>
        </div>
      </Shell>
    );
  }

  const locked = submit.isPending || result?.isCorrect === true;
  const pickChoice = (id: string) => {
    if (locked) return;
    if (result && !result.isCorrect) setResult(null);
    setPickedId(id);
  };

  const advance = () => {
    setResult(null);
    setPickedId(null);
    setStartedAt(Date.now());
    if (stepIdx + 1 < stepTotal) {
      setStepIdx(stepIdx + 1);
    } else if (problemIdx + 1 < problemTotal) {
      setProblemIdx(problemIdx + 1);
      setStepIdx(0);
      setDecomposed(false);
    } else {
      onDone();
    }
  };

  const decompose = () => {
    setDecomposed(true);
    setStepIdx(0);
    setResult(null);
    setPickedId(null);
    setStartedAt(Date.now());
  };

  // KR-only phase, hardcoded ko copy — map the raw stepType enum to a label
  // the student understands (2026-06-12 audit).
  const stepLabel = KO_STEP_LABEL[step.stepType] ?? step.stepType;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <Shell back={onBack} title={titleKo} pill={`${problemIdx + 1} / ${problemTotal}`}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ padding: '12px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* The Shell pill already shows "문제 X / Y" — repeating it here read
              as two competing counters. Keep only the step-level context. */}
          <span className="eyebrow" style={{ color: 'var(--p-primary)' }}>
            {stepTotal > 1
              ? `단계 ${stepIdx + 1} / ${stepTotal} · ${stepLabel}`
              : `문제 풀이 · ${stepLabel}`}
          </span>
          <h3 className="title" style={{ fontSize: 18, lineHeight: 1.3, marginTop: 4 }}>
            <MathText text={step.prompt} />
          </h3>
          {problem.stem && (
            <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
              <div className="math-big" style={{ fontSize: 15, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                <MathText text={problem.stem} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {shuffledChoices.map((c, i) => {
              const isPicked = pickedId === c.id;
              const isRevealedCorrect = result?.isCorrect && isPicked;
              const isWrongPick = result && !result.isCorrect && isPicked;
              const cls = isRevealedCorrect ? 'choice correct' : isWrongPick ? 'choice wrong' : isPicked ? 'choice selected' : 'choice';
              return (
                <button
                  type="button"
                  key={c.id}
                  className={cls}
                  aria-pressed={isPicked}
                  onClick={() => pickChoice(c.id)}
                >
                  <div className="letter">{letters[i] ?? c.choiceIndex}</div>
                  <span className="text"><MathText text={c.text} /></span>
                </button>
              );
            })}
          </div>

          {result && result.error ? (
            <div role="alert" style={{
              background: 'var(--p-danger-tint)',
              color: 'var(--p-danger-ink)',
              border: '1px solid var(--p-danger)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 14.5,
              lineHeight: 1.45,
              marginTop: 8,
            }}>
              서버가 답을 채점하지 못했어요. 잠시 후 다시 시도해주세요.
              <br />
              (네트워크 또는 일시적인 서버 오류입니다 — 정답/오답 판정이 아닙니다.)
            </div>
          ) : result ? <FeedbackCard result={result} /> : null}
        </div>
      </div>

      {/* Pinned footer (2026-06-12 audit): keeps the Check CTA on screen
          instead of letting it scroll below the fold. */}
      <div className="screen-foot" style={{ paddingTop: 6 }}>
        {!result ? (
          <>
            <button className="btn" disabled={!pickedId || submit.isPending} onClick={() => submit.mutate()}>
              {submit.isPending ? '확인 중…' : '답 확인'}
              <Glyph.ChevronR />
            </button>
            {faded && (
              <button className="btn outline" onClick={decompose}>
                단계별로 풀어보기
              </button>
            )}
          </>
        ) : result.error ? (
          <button className="btn outline" onClick={() => setResult(null)}>
            다시 시도
          </button>
        ) : result.isCorrect ? (
          <button className="btn" onClick={advance}>
            {stepIdx + 1 < stepTotal
              ? `다음 단계 (${stepIdx + 2} / ${stepTotal})`
              : problemIdx + 1 < problemTotal
                ? `다음 문제 (${problemIdx + 2} / ${problemTotal})`
                : '학습 완료'}
            <Glyph.ChevronR />
          </button>
        ) : (
          <>
            {faded && (
              <button className="btn" onClick={decompose}>
                단계별로 풀어보기
                <Glyph.ChevronR />
              </button>
            )}
            <button className="btn outline" onClick={() => { setResult(null); setPickedId(null); }}>
              다시 시도
            </button>
          </>
        )}
      </div>
    </Shell>
  );
}


function KoreanWorkedSteps({
  steps, chipBg, chipColor,
}: {
  steps: NonNullable<KoreanConceptStep['workedSteps']>;
  chipBg: string;
  chipColor: string;
}) {
  const { t } = useT();
  const [revealed, setRevealed] = useState<Record<number, true>>({});
  return (
    <ol style={{ marginTop: 12, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
      {steps.map((ws, i) => {
        const faded = ws.fade === true && !revealed[i];
        return (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
              background: chipBg, color: chipColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
            }}>{ws.step}</span>
            <div style={{ fontSize: 13, lineHeight: 1.55, flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
                <MathText text={ws.math} />
              </div>
              {faded ? (
                <div style={{ marginTop: 4 }}>
                  <p style={{ fontSize: 12, color: 'var(--p-muted)', margin: '0 0 4px' }}>{t('lesson.workedExample.fade.hint')}</p>
                  <button type="button" className="btn text" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setRevealed((r) => ({ ...r, [i]: true }))}>
                    {t('lesson.workedExample.fade.cta')}
                  </button>
                </div>
              ) : (
                <div style={{ color: 'var(--p-ink-2)' }}>
                  <MathText text={ws.narrationKo} />
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function KoreanStepCard({ step }: { step: KoreanConceptStep }) {
  const { t } = useT();
  const [sp] = useSearchParams();
  const focus = sp.get('focus');
  const isFocused = focus === step.kind;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFocused) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isFocused]);
  const tone = STEP_TONE[step.kind] ?? DEFAULT_STEP_TONE;
  const eyebrow = t(`step.eyebrow.${step.kind}` as any) || tone.eyebrow;
  // Some seeded steps title themselves identically to the kind chip ("훅" under
  // a 훅 chip) — rendering both reads as a stutter.
  const showTitle = step.title.trim().toLocaleLowerCase() !== eyebrow.trim().toLocaleLowerCase();
  return (
    <div
      ref={ref}
      className="card concept-step-body"
      style={{
        padding: '16px 18px',
        borderLeft: `3px solid ${tone.accent}`,
        outline: isFocused ? '2px solid var(--p-primary)' : undefined,
        outlineOffset: isFocused ? 4 : undefined,
      }}
    >
      <span
        className="chip concept-step-chip"
        style={{
          fontSize: 10.5,
          marginBottom: 8,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
          background: tone.chipBg,
          color: tone.chipColor,
          borderColor: 'transparent',
        }}
      >
        {eyebrow}
      </span>
      {showTitle && (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, marginBottom: 10, lineHeight: 1.35, color: 'var(--p-ink)' }}>{step.title}</div>
      )}
      <div style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--p-ink)', whiteSpace: 'pre-wrap', wordBreak: 'keep-all' }}>
        <MathText text={step.body} />
      </div>

      {step.visualData && (
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <GraphRenderer data={step.visualData} />
        </div>
      )}

      {step.kind === 'WORKED_EXAMPLE' && step.workedSteps && step.workedSteps.length > 0 && (
        <KoreanWorkedSteps steps={step.workedSteps} chipBg={tone.chipBg} chipColor={tone.chipColor} />
      )}

      {step.kind === 'MISCONCEPTION' && step.misconception && (
        <div style={{ marginTop: 12, display: 'grid', gap: 8, fontSize: 13, lineHeight: 1.65 }}>
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--p-danger-tint)', color: 'var(--p-danger)' }}>
            <strong>잘못된 추론: </strong><MathText text={step.misconception.wrongKo} />
          </div>
          <div style={{ color: 'var(--p-ink-2)' }}>
            <strong>왜 그럴까: </strong><MathText text={step.misconception.whyKo} />
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--p-success-tint)', color: 'var(--p-success)' }}>
            <strong>올바른 사고: </strong><MathText text={step.misconception.correctKo} />
          </div>
        </div>
      )}

      {step.kind === 'REFLECT' && step.reflectPrompts && Array.isArray(step.reflectPrompts.prompts) && (
        <ul style={{ marginTop: 10, paddingLeft: 18, fontSize: 13, color: 'var(--p-ink-2)' }}>
          {step.reflectPrompts.prompts.map((p, i) => <li key={i} style={{ marginBottom: 4 }}>{p}</li>)}
        </ul>
      )}
    </div>
  );
}
