/* RealExamScreen — full-paper timed mock exam for MockExam.type === 'REAL'.
 *
 * JEE-style sitting (2026-06-11 audit verdict 1): the whole paper is visible
 * up front, a question palette allows free navigation + mark-for-review,
 * marking is +4/-1/0 with no hints and no per-question feedback. Answers are
 * collected client-side and batch-submitted via
 * POST /mock-exams/results/:id/submit-paper at the end (or on timeout).
 * MINI / WRONG_REDO / chapter tests keep the one-at-a-time MockExamPlayScreen.
 *
 * Session payload arrives via location.state and is mirrored to localStorage
 * (same refresh-survival pattern as MockExamPlayScreen); progress (answers /
 * marks / startedAt) is persisted separately so a reload resumes the clock
 * instead of resetting it.
 */
import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import * as M from '../../lib/mutations';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';
import MathText from '../MathText';
import { HandwritingCanvas, type HandwritingCanvasHandle } from '../HandwritingCanvas';
import { REAL_EXAM_PROGRESS_PREFIX, REAL_EXAM_SESSION_PREFIX } from '../../lib/pending-real-exam';
import { useAuth } from '../../context/AuthContext';

type Choice = { id: string; choiceIndex: number; text: string };
type Step = { id: string; stepIndex: number; stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER'; prompt: string; choices: Choice[] };
type ExamProblem = { id: string; source: string; body: string; difficulty: string; steps: Step[] };
type LocState = { resultId: string; userId: string; name: string; totalMinutes: number; problems: ExamProblem[]; origin?: string } | null;

type Progress = {
  answers: Record<string, string>;
  marked: string[];
  startedAt: number | null;
};

/** Final-answer step — full-paper mode asks only the ANSWER question. */
function answerStep(p: ExamProblem): Step | null {
  return p.steps.find((s) => s.stepType === 'ANSWER') ?? p.steps[p.steps.length - 1] ?? null;
}

export function RealExamScreen() {
  const { resultId } = useParams<{ resultId: string }>();
  const loc = useLocation();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { t } = useT();
  const { user } = useAuth();

  const sessionKey = REAL_EXAM_SESSION_PREFIX + (resultId ?? '');
  const progressKey = REAL_EXAM_PROGRESS_PREFIX + (resultId ?? '');

  const state = useMemo<LocState>(() => {
    if (loc.state) {
      const candidate = loc.state as LocState;
      return candidate?.userId === user?.id ? candidate : null;
    }
    try {
      const raw = localStorage.getItem(sessionKey);
      if (raw) {
        const candidate = JSON.parse(raw) as LocState;
        return candidate?.userId === user?.id ? candidate : null;
      }
    } catch { /* ignore */ }
    return null;
  }, [loc.state, sessionKey, user?.id]);

  useEffect(() => {
    if (state && loc.state && resultId) {
      try { localStorage.setItem(sessionKey, JSON.stringify(state)); } catch { /* ignore */ }
    }
  }, [loc.state, resultId, sessionKey, state]);

  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const raw = localStorage.getItem(progressKey);
      if (raw) return JSON.parse(raw) as Progress;
    } catch { /* ignore */ }
    return { answers: {}, marked: [], startedAt: null };
  });
  useEffect(() => {
    if (!resultId) return;
    try { localStorage.setItem(progressKey, JSON.stringify(progress)); } catch { /* ignore */ }
  }, [progress, progressKey, resultId]);

  const [idx, setIdx] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const canvasRef = useRef<HandwritingCanvasHandle>(null);

  // Per-question active time — accumulate ms whenever the question changes.
  const timeSpentMs = useRef<Record<string, number>>({});
  const questionSince = useRef<number>(Date.now());
  const submittedRef = useRef(false);

  // Capacitor's physical Back must follow the same guarded exit path as the
  // visible back button. Preventing the cancelable event tells the native
  // bridge not to pop browser history underneath an active timed paper.
  useEffect(() => {
    const onNativeBack = (event: Event) => {
      event.preventDefault();
      if (progress.startedAt != null && !submittedRef.current) setConfirmExit(true);
      else nav('/app/test', { replace: true });
    };
    window.addEventListener('matheo:native-back', onNativeBack);
    return () => window.removeEventListener('matheo:native-back', onNativeBack);
  }, [nav, progress.startedAt]);

  const problems = state?.problems ?? [];
  const total = problems.length;
  const cur = problems[idx] ?? null;
  const step = cur ? answerStep(cur) : null;

  const flushQuestionTime = (problemId: string | null) => {
    if (!problemId) return;
    timeSpentMs.current[problemId] = (timeSpentMs.current[problemId] ?? 0) + (Date.now() - questionSince.current);
    questionSince.current = Date.now();
  };
  const goTo = (next: number) => {
    flushQuestionTime(cur?.id ?? null);
    setIdx(next);
    setPaletteOpen(false);
  };

  // Countdown anchored to persisted startedAt so reloads don't reset it.
  const deadline = progress.startedAt != null && state
    ? progress.startedAt + state.totalMinutes * 60_000
    : null;
  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(() => {
    if (deadline == null) return;
    const iv = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [deadline]);
  const remainingSec = deadline != null ? Math.max(0, Math.floor((deadline - nowTick) / 1000)) : null;

  const answeredCount = Object.keys(progress.answers).length;
  const markedSet = useMemo(() => new Set(progress.marked), [progress.marked]);

  async function submitPaper(auto = false) {
    if (submittedRef.current || !resultId) return;
    submittedRef.current = true;
    setBusy(true);
    setErr(null);
    flushQuestionTime(cur?.id ?? null);
    try {
      const answers: M.PaperAnswer[] = Object.entries(progress.answers).map(([problemId, choiceId]) => ({
        problemId,
        choiceId,
        durationSec: Math.max(1, Math.round((timeSpentMs.current[problemId] ?? 0) / 1000)),
      }));
      const r = await M.submitExamPaper(resultId, answers);
      qc.invalidateQueries({ queryKey: ['mock-summary'] });
      qc.invalidateQueries({ queryKey: ['traj'] });
      qc.invalidateQueries({ queryKey: ['exam-results'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['heatmap'] });
      qc.invalidateQueries({ queryKey: ['wn-list'] });
      qc.invalidateQueries({ queryKey: ['wn-stats'] });
      qc.invalidateQueries({ queryKey: ['mock-result', resultId] });
      try {
        localStorage.removeItem(sessionKey);
        localStorage.removeItem(progressKey);
      } catch { /* ignore */ }
      nav(`/app/mocks/result/${resultId}`, {
        replace: true,
        state: { fromFinalize: true, origin: 'test', timedOut: auto, ...r },
      });
    } catch (e: any) {
      submittedRef.current = false;
      setErr(e?.response?.data?.error?.message ?? t('realExam.submit.failed'));
      setBusy(false);
    }
  }

  // Auto-submit at 0:00 (also fires when a reload lands past the deadline).
  useEffect(() => {
    if (remainingSec === 0 && !submittedRef.current) {
      setTimedOut(true);
      setConfirmSubmit(false);
      setPaletteOpen(false);
      submitPaper(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSec]);

  if (!state || !resultId || total === 0) {
    return (
      <div className="screen">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 22, textAlign: 'center', color: 'var(--p-muted)' }}>
          {t('mockPlay.sessionMissing')}
          <button className="btn" style={{ marginTop: 16, maxWidth: 200 }} onClick={() => nav('/app/test')}>
            {t('realExam.back')}
          </button>
        </div>
      </div>
    );
  }

  // ───── Intro / rules phase ─────
  if (progress.startedAt == null) {
    return (
      <div className="screen">
        <div className="prob-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button onClick={() => nav('/app/test')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label={t('realExam.back')}>
              <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
            </button>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{state.name}</div>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
          <div className="card" style={{ padding: 18, background: 'var(--p-primary-tint)', borderColor: 'transparent' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{t('realExam.rules.title')}</div>
            <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700 }}>
              {t('realExam.rules.paper', { n: total, m: state.totalMinutes })}
            </div>
            <div className="chip" style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              {t('realExam.rules.marking')}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6, color: 'var(--p-ink-2)' }}>
              {t('realExam.rules.nav')}
            </div>
            <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: 'var(--p-ink-2)' }}>
              {t('realExam.rules.noHints')}
            </div>
          </div>
        </div>
        <div className="screen-foot">
          <button
            className="btn"
            onClick={() => setProgress((p) => ({ ...p, startedAt: Date.now() }))}
          >
            {t('realExam.start')}
            <Glyph.ChevronR />
          </button>
        </div>
      </div>
    );
  }

  const mm = String(Math.floor((remainingSec ?? 0) / 60)).padStart(2, '0');
  const ss = String((remainingSec ?? 0) % 60).padStart(2, '0');
  const lowTime = (remainingSec ?? 0) < 300;
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const pickedId = cur ? progress.answers[cur.id] ?? null : null;
  const isMarked = cur ? markedSet.has(cur.id) : false;

  const setAnswer = (problemId: string, choiceId: string | null) => {
    setProgress((p) => {
      const answers = { ...p.answers };
      if (choiceId == null) delete answers[problemId];
      else answers[problemId] = choiceId;
      return { ...p, answers };
    });
  };
  const toggleMark = (problemId: string) => {
    setProgress((p) => ({
      ...p,
      marked: p.marked.includes(problemId)
        ? p.marked.filter((id) => id !== problemId)
        : [...p.marked, problemId],
    }));
  };

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button onClick={() => setConfirmExit(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label={t('realExam.exit.title')}>
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{state.name}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{t('realExam.q', { n: idx + 1, total })}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className="chip"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, padding: '4px 10px',
              background: lowTime ? 'var(--p-danger-tint)' : undefined,
              color: lowTime ? 'var(--p-danger)' : undefined,
            }}
          >
            {mm}:{ss}
          </span>
          <button
            className="chip"
            onClick={() => setPaletteOpen(true)}
            style={{ border: '1px solid var(--p-border)', background: 'var(--p-surface)', cursor: 'pointer', fontSize: 12, padding: '4px 10px' }}
          >
            {t('realExam.palette')}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0 }}>
        {cur && step && (
          <>
            <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
              <div className="math-big" style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>
                <MathText text={cur.body} />
              </div>
            </div>

            {/* Scratch pad / 연습장 — moved before choices for consistency with other problem-solving screens
                (problem → 연습장 → 5지선다). Keyed per question. */}
            <div key={cur.id} style={{ marginTop: 12 }}>
              <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>{t('practice.workingsEyebrow')}</div>
              <HandwritingCanvas ref={canvasRef} height={240} extendable />
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
              </div>
            </div>

            <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              {step.choices.map((c, i) => {
                const sel = pickedId === c.id;
                return (
                  <div
                    key={c.id}
                    className={sel ? 'choice selected' : 'choice'}
                    role="radio"
                    aria-checked={sel}
                    tabIndex={0}
                    onClick={() => setAnswer(cur.id, sel ? null : c.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setAnswer(cur.id, sel ? null : c.id);
                      }
                    }}
                  >
                    <div className="letter">{letters[i] ?? c.choiceIndex}</div>
                    <span className="text"><MathText text={c.text} /></span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                className="chip"
                onClick={() => toggleMark(cur.id)}
                style={{
                  cursor: 'pointer', fontSize: 12, padding: '6px 12px',
                  border: '1px solid var(--p-border)',
                  background: isMarked ? 'var(--p-accent-tint)' : 'var(--p-surface)',
                  fontWeight: isMarked ? 700 : 500,
                }}
              >
                {isMarked ? t('realExam.marked') : t('realExam.mark')}
              </button>
              {pickedId && (
                <button
                  className="chip"
                  onClick={() => setAnswer(cur.id, null)}
                  style={{ cursor: 'pointer', fontSize: 12, padding: '6px 12px', border: '1px solid var(--p-border)', background: 'var(--p-surface)' }}
                >
                  {t('realExam.clear')}
                </button>
              )}
            </div>

            {err && (
              <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: 'var(--p-danger-tint)', color: 'var(--p-danger)', fontSize: 12 }}>{err}</div>
            )}
          </>
        )}
      </div>

      <div className="screen-foot" style={{ flexDirection: 'row', gap: 8, flexShrink: 0 }}>
        <button
          className="btn outline"
          onClick={() => goTo(Math.max(0, idx - 1))}
          disabled={idx === 0 || busy}
          style={{ flex: 1, opacity: idx === 0 ? 0.45 : 1 }}
        >
          {t('realExam.prev')}
        </button>
        {idx < total - 1 ? (
          <button className="btn" onClick={() => goTo(idx + 1)} disabled={busy} style={{ flex: 1.4 }}>
            {t('realExam.next')}
            <Glyph.ChevronR />
          </button>
        ) : (
          <button className="btn" onClick={() => setConfirmSubmit(true)} disabled={busy} style={{ flex: 1.4 }}>
            {busy ? t('realExam.submit.busy') : t('realExam.submit')}
          </button>
        )}
      </div>

      {/* ───── Question palette overlay ───── */}
      {paletteOpen && (
        <div
          onClick={() => setPaletteOpen(false)}
          style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'flex-end' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', background: 'var(--p-surface)', borderRadius: '20px 20px 0 0', padding: '14px 18px calc(16px + env(safe-area-inset-bottom, 0px))', maxHeight: '70%', overflow: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{t('realExam.palette')}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--p-muted)' }}>
                {answeredCount}/{total}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 10.5, color: 'var(--p-muted)', marginBottom: 10 }}>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 3, background: 'var(--p-success)', marginRight: 4 }} />{t('realExam.legend.answered')}</span>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 3, background: 'var(--p-surface-2)', border: '1px solid var(--p-border)', marginRight: 4 }} />{t('realExam.legend.unanswered')}</span>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 3, background: 'var(--p-accent)', marginRight: 4 }} />{t('realExam.legend.marked')}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
              {problems.map((p, i) => {
                const answered = !!progress.answers[p.id];
                const marked = markedSet.has(p.id);
                const current = i === idx;
                return (
                  <button
                    key={p.id}
                    onClick={() => goTo(i)}
                    style={{
                      height: 40, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      border: current ? '2px solid var(--p-primary)' : '1px solid var(--p-border)',
                      background: marked ? 'var(--p-accent-tint)' : answered ? 'var(--p-success-tint)' : 'var(--p-surface-2)',
                      color: marked ? 'var(--p-ink)' : answered ? 'var(--p-success)' : 'var(--p-ink-2)',
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <button className="btn" style={{ marginTop: 14 }} onClick={() => { setPaletteOpen(false); setConfirmSubmit(true); }}>
              {t('realExam.submit')}
            </button>
          </div>
        </div>
      )}

      {/* ───── Submit confirm ───── */}
      {confirmSubmit && !timedOut && (
        <Confirm
          title={t('realExam.submit.title')}
          desc={t('realExam.submit.desc', { answered: answeredCount, unanswered: total - answeredCount, marked: progress.marked.length })}
          confirmLabel={busy ? t('realExam.submit.busy') : t('realExam.submit.confirm')}
          cancelLabel={t('common.cancel')}
          disabled={busy}
          error={err}
          onConfirm={() => submitPaper(false)}
          onCancel={() => { setConfirmSubmit(false); setErr(null); }}
        />
      )}

      {/* ───── Exit confirm ───── */}
      {confirmExit && (
        <Confirm
          title={t('realExam.exit.title')}
          desc={t('realExam.exit.desc')}
          confirmLabel={t('realExam.exit.confirm')}
          cancelLabel={t('common.cancel')}
          disabled={false}
          danger
          onConfirm={() => {
            try {
              localStorage.removeItem(sessionKey);
              localStorage.removeItem(progressKey);
            } catch { /* ignore */ }
            nav('/app/test');
          }}
          onCancel={() => setConfirmExit(false)}
        />
      )}

      {timedOut && (
        <div role="dialog" aria-modal="true" aria-labelledby="real-exam-time-up" style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <div className="card" style={{ padding: 20, textAlign: 'center' }}>
            <div id="real-exam-time-up" style={{ fontSize: 14, fontWeight: 700 }}>{t('realExam.timeUp')}</div>
            {busy ? (
              <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-muted)' }}>{t('realExam.submit.busy')}</div>
            ) : (
              <>
                <div role="alert" style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-danger)' }}>
                  {err ?? t('realExam.submit.failed')}
                </div>
                <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, color: 'var(--p-muted)' }}>
                  {t('realExam.submit.saved')}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="btn outline" onClick={() => nav('/app/test')} style={{ flex: 1 }}>
                    {t('realExam.back')}
                  </button>
                  <button className="btn" onClick={() => submitPaper(true)} style={{ flex: 1 }}>
                    {t('realExam.submit.retry')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function Confirm({ title, desc, confirmLabel, cancelLabel, disabled, danger, error, onConfirm, onCancel }: {
  title: string; desc: string; confirmLabel: string; cancelLabel: string;
  disabled: boolean; danger?: boolean; error?: string | null;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
      <div className="card" style={{ padding: 20, width: '100%' }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.55, color: 'var(--p-ink-2)' }}>{desc}</div>
        {error && <div role="alert" style={{ marginTop: 8, fontSize: 12.5, color: 'var(--p-danger)' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="btn outline" onClick={onCancel} disabled={disabled} style={{ flex: 1 }}>
            {cancelLabel}
          </button>
          <button
            className="btn"
            onClick={onConfirm}
            disabled={disabled}
            style={{ flex: 1, ...(danger ? { background: 'var(--p-danger)', borderColor: 'var(--p-danger)' } : {}) }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
