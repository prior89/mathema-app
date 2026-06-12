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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { post } from '../../lib/api';
import { hapticResult, hapticSelect } from '../../lib/haptics';
import { nextStudyProblem } from '../../lib/mutations';
import { fetchProblemHint, fetchProblemHintWalkthrough, fetchStreak } from '../../lib/queries';
import { useShuffledChoices } from '../../lib/shuffle';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';
import { AnswerFeedbackSheet } from './AnswerFeedbackSheet';
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
  const { t } = useT();

  const [current, setCurrent] = useState<StudyProblem | null>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [done, setDone] = useState(false);
  /** Wrong checks on the current problem. The correct answer stays hidden
      until the 3rd wrong attempt (retrieval practice — revealing it on the
      first miss turns Try Again into "click the shown answer"). */
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  /** 0 = not shown, 1 = formula (cached, instant), 2 = AI walkthrough (LLM call). */
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
  const startedAtRef = useRef(Date.now());
  const canvasRef = useRef<HandwritingCanvasHandle>(null);

  // Hint Lv1 — formula + concept + hint cached on the Problem row.
  const hintQuery = useQuery({
    queryKey: ['problem-hint', current?.id],
    queryFn: () => fetchProblemHint(current!.id),
    enabled: hintLevel >= 1 && !!current?.id,
  });
  // Hint Lv2 — LLM-generated step-by-step walkthrough. Only fired when
  // the student taps Hint a second time. Cached per problem id so re-opening
  // the hint doesn't re-bill another LLM call.
  const walkQuery = useQuery({
    queryKey: ['problem-walkthrough', current?.id],
    queryFn: () => fetchProblemHintWalkthrough(current!.id),
    enabled: hintLevel >= 2 && !!current?.id,
    staleTime: Infinity,
  });
  // Streak chip on correct answers — only fetched after the first correct
  // result, so the value already reflects today's activity. Streak changes
  // at most once per day; no per-problem refetch needed.
  const streakQuery = useQuery({
    queryKey: ['streak'],
    queryFn: fetchStreak,
    enabled: result?.isCorrect === true,
    staleTime: Infinity,
  });

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
      setSheetOpen(false);
      setHintLevel(0);
      setWrongAttempts(0);
      startedAtRef.current = Date.now();
      canvasRef.current?.clear();
      setError(null);
      setQuestionNum((n) => n + 1);
    },
    onError: (e: any) => {
      setError(e?.response?.data?.error?.message ?? t('practice.fetch.failed'));
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
  // 보기 셔플 — 새 문제 fetch 마다 자동 재셔플.
  const shuffledChoices = useShuffledChoices(step?.choices ?? []);

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
      setSheetOpen(true);
      hapticResult(r.isCorrect);
      if (r.isCorrect) {
        setCorrectCount((n) => n + 1);
      } else {
        setWrongCount((n) => n + 1);
        setWrongAttempts((n) => n + 1);
      }
      qc.invalidateQueries({ queryKey: ['wn-list'] });
      qc.invalidateQueries({ queryKey: ['wn-stats'] });
      qc.invalidateQueries({ queryKey: ['wn-recent'] });
      qc.invalidateQueries({ queryKey: ['chapter-progress'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      setResult({ isCorrect: false, selectedChoice: null, correctChoice: null });
      setSheetOpen(true);
      hapticResult(false);
    },
  });

  function onSubmit() {
    if (!pickedId || submit.isPending) return;
    submit.mutate();
  }

  function onNext() {
    fetchNext.mutate();
  }

  function onTryAgain() {
    setResult(null);
    setPickedId(null);
    setSheetOpen(false);
    startedAtRef.current = Date.now();
  }

  function onStop() {
    setDone(true);
  }

  // ─────────── completion view ───────────
  if (done) {
    return (
      <div className="screen">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, padding: 22, textAlign: 'center' }}>
          {/* Two completion shapes:
              • truly done — student practised and stopped → success tick + summary.
              • dry pool — backend returned null for the very first /next call
                because the chapter has no single-step problems yet → friendly
                "coming soon" message, not the misleading "no problems solved yet". */}
          {correctCount + wrongCount === 0 ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-muted)' }}>📒</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.25 }}>
                {t('practice.done.notRegistered.icon')}
              </div>
              <div style={{ fontSize: 13, color: 'var(--p-ink-2)', maxWidth: 320, lineHeight: 1.55 }}>
                {t('practice.done.notRegistered.desc')}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-primary)' }}>✓</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>{t('practice.done.summary.title')}</div>
              <div style={{ fontSize: 14, color: 'var(--p-ink-2)', lineHeight: 1.6 }}>
                {t('practice.done.summary.body', { right: correctCount, wrong: wrongCount })}
              </div>
              <div style={{ fontSize: 12, color: 'var(--p-muted)', maxWidth: 320, lineHeight: 1.55 }}>
                {t('practice.done.summary.note')}
              </div>
            </>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button className="btn outline" onClick={() => nav('/app/study')}>{t('practice.done.backStudy')}</button>
            {wrongCount > 0 && (
              <button className="btn" onClick={() => nav('/app/notes')}>{t('practice.done.openNotes')}</button>
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
                {t('practice.done.backStudy')}
              </button>
            </>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{t('practice.firstLoad.title')}</div>
              <div style={{ fontSize: 12, lineHeight: 1.6, maxWidth: 320 }}>
                {t('practice.firstLoad.desc')}
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
          <button onClick={() => nav('/app/study')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label={t('practice.back')}>
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              {t('practice.eyebrow')}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {t('practice.status', { n: questionNum, right: correctCount, wrong: wrongCount })}
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
          {t('practice.stop')}
        </button>
      </div>

      {/* Sticky problem statement — frozen so the student can still see the
          question while picking an answer or working on the canvas below. */}
      <div style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
          <div className="eyebrow" style={{ fontSize: 10 }}>{t('practice.problemEyebrow')}</div>
          <div className="math-big" style={{ fontSize: 16, marginTop: 6, whiteSpace: 'pre-wrap' }}>
            <MathText text={current.body} />
          </div>
        </div>
      </div>

      {/* Scrollable middle (canvas + choices + feedback) */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 22px 8px', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>{t('practice.workingsEyebrow')}</div>
          <HandwritingCanvas ref={canvasRef} height={300} extendable />
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button
              type="button"
              className="btn outline"
              onClick={() => canvasRef.current?.undo()}
              style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}
            >
              {t('practice.undo')}
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => canvasRef.current?.clear()}
              style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}
            >
              {t('practice.clear')}
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => setHintLevel((lv) => (lv >= 2 ? 2 : ((lv + 1) as 0 | 1 | 2)))}
              disabled={hintLevel >= 2}
              style={{ height: 32, padding: '0 12px', fontSize: 12, width: 'auto' }}
            >
              💡 {hintLevel === 0 ? t('practice.hint.btn0') : hintLevel === 1 ? t('practice.hint.btn1') : t('practice.hint.btn2')}
            </button>
          </div>
          {/* Hint Lv1 — DB-cached formula / concept / hint. Instant; no LLM. */}
          {hintLevel >= 1 && (
            <div
              className="card"
              style={{
                padding: 12, marginTop: 8, fontSize: 13, lineHeight: 1.5,
                background: 'var(--p-accent-tint)', borderColor: 'transparent',
              }}
            >
              <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>{t('practice.hint.formulaEyebrow')}</div>
              {hintQuery.isLoading ? (
                <div style={{ color: 'var(--p-ink-2)' }}>{t('practice.hint.loading')}</div>
              ) : hintQuery.data?.formula ? (
                <MathText text={hintQuery.data.formula} />
              ) : hintQuery.data?.concept ? (
                <MathText text={hintQuery.data.concept} />
              ) : hintQuery.data?.hint ? (
                <MathText text={hintQuery.data.hint} />
              ) : (
                <span style={{ color: 'var(--p-muted)' }}>{t('practice.hint.empty')}</span>
              )}
            </div>
          )}
          {/* Hint Lv2 — AI walkthrough (step-by-step). Styled like a notebook
              annotation so it visually overlays "on the canvas" per user-spec
              2026-05-23 ("AI가 노트에 써준다"). */}
          {hintLevel >= 2 && (
            <div
              className="card"
              style={{
                padding: 12, marginTop: 8, fontSize: 13, lineHeight: 1.55,
                background: 'var(--p-surface-2)',
                borderLeft: '3px solid var(--p-primary)',
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                borderRadius: 4,
              }}
            >
              <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>{t('practice.hint.walkthroughEyebrow')}</div>
              {walkQuery.isLoading ? (
                <div style={{ color: 'var(--p-ink-2)' }}>{t('practice.hint.writing')}</div>
              ) : walkQuery.isError ? (
                <div style={{ color: 'var(--p-danger)' }}>{t('practice.hint.error')}</div>
              ) : walkQuery.data?.steps?.length ? (
                <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {walkQuery.data.steps.map((s, i) => (
                    <li key={i}><MathText text={s} /></li>
                  ))}
                </ol>
              ) : (
                <span style={{ color: 'var(--p-muted)' }}>{t('practice.hint.noWalkthrough')}</span>
              )}
            </div>
          )}
        </div>

        {step && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
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
                    hapticSelect();
                    setPickedId(c.id);
                  }}
                >
                  <div className="letter">{LETTERS[i] ?? c.choiceIndex}</div>
                  <span className="text"><MathText text={c.text} /></span>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Sticky footer — Check / Try Again / Next.
          User-spec 2026-05-23: Next is locked until the student answers
          correctly. Wrong answers route to Try Again, which clears the pick
          + result (canvas stays, so working isn't lost). After a check the
          verdict arrives in the feedback sheet; the footer doubles as the
          fallback action row when the sheet is dismissed to review work. */}
      <div className="screen-foot" style={{ paddingTop: 6 }}>
        {!result ? (
          <button
            className="btn"
            disabled={!pickedId || submit.isPending}
            onClick={onSubmit}
          >
            {submit.isPending ? t('practice.checking') : t('practice.check')}
            <Glyph.ChevronR />
          </button>
        ) : result.isCorrect ? (
          <button className="btn" onClick={onNext} disabled={fetchNext.isPending}>
            {fetchNext.isPending ? t('practice.loading') : t('practice.nextProblem')}
            <Glyph.ChevronR />
          </button>
        ) : (
          <button className="btn" onClick={onTryAgain}>
            {t('practice.tryAgain')}
          </button>
        )}
      </div>
      <TabBar />
      {result && sheetOpen && (
        <AnswerFeedbackSheet
          correct={result.isCorrect}
          subText={
            result.isCorrect
              ? t('practice.feedback.correctSub')
              : wrongAttempts >= 3
                ? t('practice.feedback.wrongSub3')
                : wrongAttempts === 2
                  ? t('practice.feedback.wrongSub2')
                  : t('practice.feedback.wrongSub1')
          }
          rationale={!result.isCorrect ? (result.selectedChoice?.rationale ?? null) : null}
          correctAnswerText={
            !result.isCorrect && wrongAttempts >= 3 ? (result.correctChoice?.text ?? null) : null
          }
          streakDays={streakQuery.data?.days ?? null}
          actionLabel={
            result.isCorrect
              ? fetchNext.isPending
                ? t('practice.loading')
                : t('practice.nextProblem')
              : t('practice.tryAgain')
          }
          actionPending={fetchNext.isPending}
          onAction={result.isCorrect ? onNext : onTryAgain}
          onDismiss={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
