import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  solveMathHelper,
  ocrSolveMathHelper,
  type MathHelperSolveResponse,
} from '../../lib/mathHelper';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

const CLASS_LEVELS = [7, 8, 9, 10, 11, 12];

export function MathHelperScreen() {
  const nav = useNavigate();
  const [classLevel, setClassLevel] = useState(12);
  const [question, setQuestion] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [solveResult, setSolveResult] = useState<MathHelperSolveResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const solve = useMutation({
    mutationFn: () => solveMathHelper({
      classLevel,
      question,
      studentAnswer: studentAnswer.trim() || undefined,
    }),
    onSuccess: (data) => { setSolveResult(data); setError(null); },
    onError: (e: any) => setError(extractErrorMessage(e) ?? 'Solver is unavailable right now. Please try again in a moment.'),
  });

  const ocrSolve = useMutation({
    mutationFn: (file: File) => ocrSolveMathHelper({
      file,
      classLevel,
      studentAnswer: studentAnswer.trim() || undefined,
    }),
    onSuccess: (data) => {
      setQuestion(data.extractedText);
      setSolveResult(data.result);
      setError(null);
    },
    onError: (e: any) => setError(extractErrorMessage(e) ?? 'OCR solve is unavailable right now. Please try again in a moment.'),
  });

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const pasted = Array.from(e.clipboardData?.files ?? []).find((item) => item.type.startsWith('image/'));
      if (pasted) handleOcrFile(pasted);
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  });

  const handleOcrFile = (file: File | null) => {
    if (!file) return;
    setUploadName(file.name);
    setError(null);
    ocrSolve.mutate(file);
  };

  const busy = solve.isPending || ocrSolve.isPending;

  return (
    <div className="screen">
      {/* Top — back + section title (LoginPage / RegisterPage 와 같은 mathema-app 톱). */}
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => nav('/app')}
          aria-label="Back"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, marginLeft: -6, display: 'flex', alignItems: 'center' }}
        >
          <Glyph.ArrowL accent="var(--p-ink-2)" size={22} />
        </button>
        <div>
          <span className="eyebrow">Solve</span>
          <h1 className="title" style={{ marginTop: 4, fontSize: 22 }}>Problem solver</h1>
        </div>
      </div>

      <div className="screen-body" style={{ gap: 14, paddingTop: 18 }}>
        {/* Compose card */}
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <span className="eyebrow">Compose</span>
            <p className="subtitle" style={{ fontSize: 13, marginTop: 6 }}>
              Uses your weak concepts, frequent units, and recent wrong notes to personalize the explanation.
            </p>
          </div>

          {/* [Class | Your answer] — Mocks FOCUS 와 같은 패턴 */}
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8 }}>
            <div className="field">
              <label>Class</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(Number(e.target.value))}
              >
                {CLASS_LEVELS.map((n) => <option key={n} value={n}>Class {n}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Your answer (optional)</label>
              <input
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="e.g. 42"
              />
            </div>
          </div>

          {/* Question textarea — .field 톤 일치 */}
          <div className="field">
            <label>Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={5}
              placeholder="Paste or type a Class 7–12 maths question…"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '12px 16px', borderRadius: 12,
                border: '1px solid var(--p-border-strong)',
                background: 'var(--p-surface)', color: 'var(--p-ink)',
                fontFamily: 'inherit', fontSize: 15, lineHeight: 1.5,
                outline: 'none', resize: 'vertical', minHeight: 110,
              }}
            />
          </div>

          {/* Upload dropzone — dashed border, mathema-app 토큰 */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleOcrFile(e.dataTransfer.files?.[0] ?? null);
            }}
            style={{
              borderRadius: 14,
              border: '1.5px dashed var(--p-border-strong)',
              background: 'var(--p-surface-2)',
              padding: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-ink)' }}>
                Upload or paste image / PDF
              </div>
              <div className="caption" style={{ marginTop: 2 }}>
                {ocrSolve.isPending
                  ? `Reading ${uploadName ?? 'file'}…`
                  : 'Drop a file, paste a screenshot, or choose a file.'}
              </div>
            </div>
            <button
              type="button"
              className="btn outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              style={{ height: 40, width: 'auto', padding: '0 16px', fontSize: 13, flexShrink: 0 }}
            >
              Choose
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleOcrFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Solve primary action */}
          <button
            className="btn"
            disabled={question.trim().length < 3 || busy}
            onClick={() => solve.mutate()}
          >
            {busy ? 'Solving…' : 'Solve'}
            <Glyph.ChevronR />
          </button>
        </div>

        {error && (
          <div
            className="card"
            style={{ padding: 12, fontSize: 13, color: 'var(--p-danger)', borderColor: 'var(--p-danger)', background: 'oklch(0.97 0.02 25)' }}
          >
            {error}
          </div>
        )}

        {solveResult && <SolveResult data={solveResult} />}
        <div style={{ height: 8 }} />
      </div>
      <TabBar />
    </div>
  );
}

function extractErrorMessage(e: unknown): string | null {
  const data = (e as { response?: { data?: any } })?.response?.data;
  const message = data?.error?.message ?? data?.message ?? (e as Error)?.message;
  if (Array.isArray(message)) return message.join('; ');
  return typeof message === 'string' ? message : null;
}

function SolveResult({ data }: { data: MathHelperSolveResponse }) {
  const checked = data.isStudentCorrect !== undefined && data.isStudentCorrect !== null;
  return (
    <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <span className="eyebrow">{data.detected.chapter} · {data.detected.topic}</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 6 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1.1, color: 'var(--p-ink)', letterSpacing: '-0.01em' }}>
            {data.answer}
          </div>
          {checked && (
            <span
              className="chip"
              style={
                data.isStudentCorrect
                  ? { background: 'oklch(0.95 0.05 155)', color: 'var(--p-success)', border: 'none' }
                  : { background: 'oklch(0.96 0.05 55)', color: 'oklch(0.45 0.12 55)', border: 'none' }
              }
            >
              {data.isStudentCorrect ? 'Correct' : 'Review'}
            </span>
          )}
        </div>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--p-ink)', margin: 0 }}>
        {data.explanation}
      </p>

      {data.personalizedLearning && <Pill text={data.personalizedLearning} />}
      {data.mistakeDiagnosis && <Pill text={data.mistakeDiagnosis} tone="warn" />}

      <MiniList title="Hints" items={data.hints} />
      <MiniList title="Next practice" items={data.nextPractice} />

      <div className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        VERIFIED · {data.verification.method.toUpperCase()} · {Math.round(data.verification.confidence * 100)}%
      </div>
    </div>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <span className="eyebrow">{title}</span>
      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.slice(0, 4).map((item, i) => (
          <div key={i} style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--p-ink-2)' }}>
            <span style={{ color: 'var(--p-primary)', marginRight: 8 }}>•</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Pill({ text, tone }: { text: string; tone?: 'warn' }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        fontSize: 13,
        lineHeight: 1.5,
        color: 'var(--p-ink)',
        background: tone === 'warn' ? 'oklch(0.97 0.04 55)' : 'var(--p-primary-tint)',
        border: `1px solid ${tone === 'warn' ? 'oklch(0.92 0.07 55)' : 'transparent'}`,
      }}
    >
      {text}
    </div>
  );
}
