/* StudyPracticeScreen — single-step practice for the Study tab.
 *
 * Receives { resultId, name, totalMinutes, problems[] } via location.state
 * (StudyScreen → startChapter response). Each problem has ProblemStep length
 * exactly 1 (Study only ever serves single-step problems, see backend
 * mock-exams.startChapter pool filter). The student:
 *
 *   1. Reads the problem body.
 *   2. Scratches their working on a HandwritingCanvas — never persisted.
 *   3. Picks one of 5 choices and taps Check.
 *   4. Correct → next problem (and the per-problem WrongNote, if any,
 *      auto-MASTERED via attempts.repository's single-shot branch).
 *      Wrong  → still advances; backend's wrongNote.upsert files it as
 *      PENDING so it surfaces in Notes for later review.
 *
 * The screen stops when problems[] is exhausted or the user backs out. There
 * is no "finalize" call on this flow — chapter test scoring isn't surfaced
 * yet (Study is for accumulation, not measurement). The session's
 * MockExamResult row stays at its initial 0/0/0 stub.
 */
import { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '../../lib/api';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';
import MathText from '../MathText';
import { HandwritingCanvas, type HandwritingCanvasHandle } from '../HandwritingCanvas';

type Choice = { id: string; choiceIndex: number; text: string };
type Step = {
  id: string;
  stepIndex: number;
  stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER';
  prompt: string;
  choices: Choice[];
};
type PracticeProblem = {
  id: string;
  source: string;
  body: string;
  difficulty: string;
  hint?: string | null;
  steps: Step[];
};
type LocState = {
  resultId: string;
  name: string;
  totalMinutes: number;
  problems: PracticeProblem[];
} | null;

type AttemptResponse = {
  isCorrect: boolean;
  selectedChoice: { id: string; text: string; distractorType: string | null; rationale: string | null } | null;
  correctChoice: { id: string; text: string } | null;
};

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function StudyPracticeScreen() {
  const { resultId } = useParams<{ resultId: string }>();
  const loc = useLocation();
  const nav = useNavigate();
  const qc = useQueryClient();

  const state = (loc.state as LocState) ?? null;
  const problems = state?.problems ?? [];

  const [idx, setIdx] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [done, setDone] = useState(problems.length === 0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const startedAtRef = useRef<number>(Date.now());
  const canvasRef = useRef<HandwritingCanvasHandle>(null);

  const current = problems[idx];
  // Study is single-step by construction — the first (and only) step holds
  // the 5 choices + prompt the student sees.
  const step = current?.steps?.[0];

  const submit = useMutation({
    mutationFn: () => {
      if (!current || !pickedId) throw new Error('no choice picked');
      return post<AttemptResponse>('/attempts', {
        problemId: current.id,
        choiceId: pickedId,
        durationSec: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
        context: 'STUDY',
        // stepIndex deliberately omitted — Study is single-shot so attempts.
        // repository.create's `typeof stepIndex !== 'number'` branch handles
        // auto-MASTERED on correct and wrongNote.upsert on wrong.
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

  function next() {
    if (idx + 1 < problems.length) {
      setIdx(idx + 1);
      setPickedId(null);
      setResult(null);
      startedAtRef.current = Date.now();
      canvasRef.current?.clear();
      return;
    }
    setDone(true);
  }

  function onSubmit() {
    if (!pickedId || submit.isPending) return;
    submit.mutate();
  }

  // ─────────── empty state ───────────
  if (problems.length === 0) {
    return (
      <div className="screen">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 22, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>No new problems for this chapter.</div>
          <p style={{ fontSize: 13, color: 'var(--p-muted)', maxWidth: 320, lineHeight: 1.55 }}>
            You've solved every problem currently in the shared pool. Pick another chapter, or
            check back later — other students' contributions and AI-generated additions land
            here continuously.
          </p>
          <button className="btn outline" style={{ maxWidth: 200 }} onClick={() => nav('/app/study')}>
            Back to Study
          </button>
        </div>
        <TabBar />
      </div>
    );
  }

  // ─────────── completion view ───────────
  if (done) {
    return (
      <div className="screen">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, padding: 22, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--p-primary)' }}>✓</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>Practice done.</div>
          <div style={{ fontSize: 14, color: 'var(--p-ink-2)', lineHeight: 1.6 }}>
            <strong>{correctCount}</strong> right · <strong>{wrongCount}</strong> filed to Notes.
          </div>
          <div style={{ fontSize: 12, color: 'var(--p-muted)', maxWidth: 320, lineHeight: 1.55 }}>
            Wrong answers are now in your wrong-note book. Re-open them from Notes whenever you
            want — a single perfect retry graduates them.
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
              {state?.name ?? 'PRACTICE'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              Q {idx + 1} / {problems.length}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable middle — problem body + canvas + choices */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card" style={{ padding: 14, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
          <div className="eyebrow" style={{ fontSize: 10 }}>PROBLEM</div>
          <div className="math-big" style={{ fontSize: 16, marginTop: 6, whiteSpace: 'pre-wrap' }}>
            <MathText text={current.body} />
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>WORKINGS</div>
          <HandwritingCanvas ref={canvasRef} height={240} />
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
              ? '✓ Correct — moving on.'
              : '✗ Wrong — filed to your Notes for later review.'}
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
          <button className="btn" onClick={next}>
            {idx + 1 < problems.length ? 'Next problem' : 'Finish'}
            <Glyph.ChevronR />
          </button>
        )}
      </div>
    </div>
  );
}
