import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  solveMathHelper,
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

  const solve = useMutation({
    mutationFn: () => solveMathHelper({
      classLevel,
      question,
      studentAnswer: studentAnswer.trim() || undefined,
    }),
    onSuccess: (data) => { setSolveResult(data); setError(null); },
    onError: (e: any) => setError(e?.response?.data?.error?.message ?? 'Solver is unavailable right now. Please try again in a moment.'),
  });

  const busy = solve.isPending;

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/app')} style={iconButton} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div>
            <div style={eyebrow}>SOLVE</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Problem solver</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px' }}>
        <div className="card" style={{ padding: 14 }}>
          <div style={sectionTitle}>Solve a problem</div>
          <div style={muted}>Uses your weak concepts, frequent units, and recent wrong notes to personalize the explanation.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
            <label style={fieldLabel}>Class
              <select value={classLevel} onChange={(e) => setClassLevel(Number(e.target.value))} style={inputStyle}>
                {CLASS_LEVELS.map((n) => <option key={n} value={n}>Class {n}</option>)}
              </select>
            </label>
            <label style={fieldLabel}>Your answer optional
              <input value={studentAnswer} onChange={(e) => setStudentAnswer(e.target.value)} style={inputStyle} placeholder="e.g. 42" />
            </label>
          </div>
          <label style={{ ...fieldLabel, marginTop: 10 }}>Question
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={5} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Paste a Class 7-12 math question..." />
          </label>
          <button className="btn" disabled={question.trim().length < 3 || busy} onClick={() => solve.mutate()} style={{ marginTop: 10 }}>
            {solve.isPending ? 'Solving...' : 'Solve'}
          </button>
        </div>

        {error && <div className="card" style={{ padding: 12, marginTop: 10, color: 'var(--p-danger)', fontSize: 12 }}>{error}</div>}
        {solveResult && <SolveResult data={solveResult} />}
        <div style={{ height: 16 }} />
      </div>
      <TabBar />
    </div>
  );
}

function SolveResult({ data }: { data: MathHelperSolveResponse }) {
  const checked = data.isStudentCorrect !== undefined && data.isStudentCorrect !== null;
  return (
    <div className="card" style={{ padding: 14, marginTop: 10 }}>
      <div style={eyebrow}>{data.detected.chapter} · {data.detected.topic}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{data.answer}</div>
        {checked && <span className="chip" style={{ background: data.isStudentCorrect ? 'oklch(0.92 0.07 145)' : 'oklch(0.95 0.05 55)' }}>{data.isStudentCorrect ? 'Correct' : 'Review'}</span>}
      </div>
      <p style={{ ...muted, color: 'var(--p-ink)', lineHeight: 1.6 }}>{data.explanation}</p>
      {data.personalizedLearning && <Pill text={data.personalizedLearning} />}
      {data.mistakeDiagnosis && <Pill text={data.mistakeDiagnosis} tone="warn" />}
      <MiniList title="Hints" items={data.hints} />
      <MiniList title="Next practice" items={data.nextPractice} />
      <div style={{ fontSize: 11, color: 'var(--p-muted)', marginTop: 10 }}>
        Verified by {data.verification.method} · confidence {Math.round(data.verification.confidence * 100)}%
      </div>
    </div>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={eyebrow}>{title}</div>
      {items.slice(0, 4).map((item, i) => <div key={i} style={{ fontSize: 12.5, lineHeight: 1.55 }}>• {item}</div>)}
    </div>
  );
}

function Pill({ text, tone }: { text: string; tone?: 'warn' }) {
  return <div style={{ ...pill, background: tone === 'warn' ? 'oklch(0.95 0.05 55)' : 'var(--p-primary-tint)' }}>{text}</div>;
}

const iconButton: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: 0 };
const eyebrow: React.CSSProperties = { fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' };
const sectionTitle: React.CSSProperties = { fontSize: 13, fontWeight: 700, marginBottom: 6 };
const muted: React.CSSProperties = { fontSize: 11.5, color: 'var(--p-muted)' };
const fieldLabel: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 10.5, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 11px', borderRadius: 8, border: '1px solid var(--p-line)', background: 'var(--p-surface)', color: 'var(--p-ink)', font: 'inherit', fontSize: 12.5 };
const pill: React.CSSProperties = { marginTop: 10, padding: 10, borderRadius: 8, fontSize: 12, lineHeight: 1.45, color: 'var(--p-ink)' };
