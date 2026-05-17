import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  generateChapterTest,
  generateWeeklyAssessment,
  solveMathHelper,
  type MathHelperAssessmentResponse,
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
  const [chapter, setChapter] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [solveResult, setSolveResult] = useState<MathHelperSolveResponse | null>(null);
  const [assessment, setAssessment] = useState<MathHelperAssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const solve = useMutation({
    mutationFn: () => solveMathHelper({
      classLevel,
      question,
      studentAnswer: studentAnswer.trim() || undefined,
    }),
    onSuccess: (data) => { setSolveResult(data); setError(null); },
    onError: (e: any) => setError(e?.response?.data?.error?.message ?? 'Math helper is unavailable.'),
  });

  const weekly = useMutation({
    mutationFn: () => generateWeeklyAssessment({ classLevel, questionCount }),
    onSuccess: (data) => { setAssessment(data); setError(null); },
    onError: (e: any) => setError(e?.response?.data?.error?.message ?? 'Assessment generation failed.'),
  });

  const chapterTest = useMutation({
    mutationFn: () => generateChapterTest({
      classLevel,
      chapter: chapter.trim() || undefined,
      chapterCode: chapter.trim().startsWith('NCERT-') ? chapter.trim() : undefined,
      questionCount,
    }),
    onSuccess: (data) => { setAssessment(data); setError(null); },
    onError: (e: any) => setError(e?.response?.data?.error?.message ?? 'Chapter test generation failed.'),
  });

  const busy = solve.isPending || weekly.isPending || chapterTest.isPending;

  return (
    <div className="screen">
      <div className="prob-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/app')} style={iconButton} aria-label="Back">
            <Glyph.ArrowL accent="var(--p-ink-2)" size={20} />
          </button>
          <div>
            <div style={eyebrow}>LANGGRAPH</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>AI Math Helper</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 22px 8px' }}>
        <div className="card" style={{ padding: 14 }}>
          <div style={sectionTitle}>Solve a problem</div>
          <div style={muted}>The backend sends your DB-based weak concepts, frequent units, and recent wrong notes to the Python LangGraph service.</div>
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
            {solve.isPending ? 'Solving...' : 'Solve with LangGraph'}
          </button>
        </div>

        <div className="card" style={{ padding: 14, marginTop: 10 }}>
          <div style={sectionTitle}>Adaptive assessments</div>
          <div style={muted}>Weekly tests use DB weak concepts and wrong-note history. Chapter tests can use a chapter name or NCERT chapter code.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 8, marginTop: 12 }}>
            <input value={chapter} onChange={(e) => setChapter(e.target.value)} style={inputStyle} placeholder="Chapter name or NCERT code" />
            <input type="number" min={1} max={30} value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button className="btn outline" disabled={busy} onClick={() => weekly.mutate()}>Weekly</button>
            <button className="btn" disabled={busy || !chapter.trim()} onClick={() => chapterTest.mutate()}>Chapter test</button>
          </div>
        </div>

        {error && <div className="card" style={{ padding: 12, marginTop: 10, color: 'var(--p-danger)', fontSize: 12 }}>{error}</div>}
        {solveResult && <SolveResult data={solveResult} />}
        {assessment && <AssessmentResult data={assessment} />}
        <div style={{ height: 16 }} />
      </div>
      <TabBar />
    </div>
  );
}

function SolveResult({ data }: { data: MathHelperSolveResponse }) {
  return (
    <div className="card" style={{ padding: 14, marginTop: 10 }}>
      <div style={eyebrow}>{data.detected.chapter} · {data.detected.topic}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.answer}</div>
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

function AssessmentResult({ data }: { data: MathHelperAssessmentResponse }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div className="section-h">
        <span className="label">{data.title}</span>
        <span className="more">{data.questionCount} Q · {data.durationMinutes}m</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.questions.map((q, i) => (
          <div key={q.questionId ?? i} className="card" style={{ padding: 12 }}>
            <div style={eyebrow}>Q{i + 1} · difficulty {q.difficultyLevel}/5 · {q.source}</div>
            <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 6 }}>{q.body}</div>
            {q.adaptiveReason && <div style={{ ...muted, marginTop: 8 }}>{q.adaptiveReason}</div>}
          </div>
        ))}
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
