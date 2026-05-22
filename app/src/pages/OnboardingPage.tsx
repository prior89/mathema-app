/* OnboardingPage — Matheo 9-screen onboarding flow.
 * Ported from `App onboarding/screens-a.jsx` + `screens-b.jsx`.
 * Phone Auth option hidden (no backend); Goal stored in localStorage; Diagnostic state in-memory.
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post, patch, tokens, get } from '../lib/api';
import { Glyph } from '../components/onboarding/Glyph';
import { BrandLogo } from '../components/Brand';
import type { Me } from '../lib/queries';
import { useAuth } from '../context/AuthContext';
import '../styles/onboarding.css';

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ?? '';

type StepKey = 'welcome' | 'auth' | 'role' | 'profile' | 'goal' | 'diagnostic' | 'results' | 'consents' | 'ready';
type Role = 'STUDENT' | 'PARENT' | 'TEACHER';
type GradeId = 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10' | 'CLASS_11' | 'CLASS_12';
type GoalId = 'BOARD' | 'JEE' | 'SCHOOL' | 'CATCHUP';
type ConsentKey = 'ANALYTICS' | 'AI_TRAINING' | 'MARKETING';
type ConsentMap = Record<ConsentKey, boolean>;

const STEP_FLOW: StepKey[] = ['welcome', 'auth', 'role', 'profile', 'goal', 'diagnostic', 'results', 'consents', 'ready'];

// CLASS_X (UI) → GradeLevel (backend enum)
const GRADE_MAP: Record<GradeId, string> = {
  CLASS_7: 'CLASS_7', CLASS_8: 'CLASS_8', CLASS_9: 'CLASS_9',
  CLASS_10: 'CLASS_10', CLASS_11: 'CLASS_11', CLASS_12: 'CLASS_12',
};

/** Actual NCERT chapter counts per class — used in the Ready screen's stat
 *  trio so the headline numbers are facts the user can verify in the app. */
const CHAPTERS_PER_CLASS: Record<GradeId, number> = {
  CLASS_7: 13, CLASS_8: 13, CLASS_9: 12,
  CLASS_10: 14, CLASS_11: 14, CLASS_12: 13,
};
function chapterCountByClass(grade: GradeId): number {
  return CHAPTERS_PER_CLASS[grade] ?? 0;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  // 인도 PoC — 온보딩 진입 시 EN 강제 (KO 잔존 차단).
  useEffect(() => {
    const saved = localStorage.getItem('mathema.lang');
    if (saved === 'ko') {
      localStorage.setItem('mathema.lang', 'en');
      window.location.reload();
    } else if (!saved) {
      localStorage.setItem('mathema.lang', 'en');
    }
  }, []);
  return (
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <Flow onFinish={() => navigate('/app')} />
        </div>
      </div>
    </div>
  );
}

type DiagnosticMastery = { conceptId: string; conceptName: string; conceptCode: string; score: number };
type DiagnosticResult = { sessionId: string; attempted: number; correct: number; masteries: DiagnosticMastery[] };

function Flow({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState<StepKey>('welcome');
  const [role, setRole] = useState<Role | ''>('STUDENT');
  const [name, setName] = useState('Aarav');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<GradeId | ''>('CLASS_11');
  const [goal, setGoal] = useState<GoalId | ''>('BOARD');
  const [consents, setConsents] = useState<ConsentMap>({ ANALYTICS: true, AI_TRAINING: false, MARKETING: false });
  const [notif, setNotif] = useState(true);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const idx = STEP_FLOW.indexOf(step);
  const stepIndex = Math.max(0, idx - 1); // skip welcome from indicator
  const go = (key: StepKey) => setStep(key);
  const next = () => go(STEP_FLOW[Math.min(STEP_FLOW.length - 1, idx + 1)]);
  const back = () => go(STEP_FLOW[Math.max(0, idx - 1)]);

  switch (step) {
    case 'welcome':
      return <ScreenWelcome onNext={next} onSignIn={onFinish} />;
    case 'auth':
      return (
        <ScreenAuth
          step={stepIndex} onBack={back} onNext={next}
          name={name}
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
        />
      );
    case 'role':
      return <ScreenRole step={stepIndex} onBack={back} onNext={next} role={role} setRole={setRole} />;
    case 'profile':
      return <ScreenProfile step={stepIndex} onBack={back} onNext={next} name={name} setName={setName} grade={grade} setGrade={setGrade} />;
    case 'goal':
      return <ScreenGoal step={stepIndex} onBack={back} onNext={next} goal={goal} setGoal={setGoal} />;
    case 'diagnostic':
      return <ScreenDiagnostic step={stepIndex} onBack={back} onNext={next} onComplete={setDiagnosticResult} />;
    case 'results':
      return <ScreenResults step={stepIndex} onBack={back} onNext={next} name={name} result={diagnosticResult} />;
    case 'consents':
      return (
        <ScreenConsents
          step={stepIndex}
          onBack={back}
          onNext={next}
          consents={consents}
          setConsents={setConsents}
          notif={notif}
          setNotif={setNotif}
        />
      );
    case 'ready':
      return (
        <ScreenReady
          step={stepIndex}
          name={name}
          role={role || 'STUDENT'}
          grade={grade || 'CLASS_11'}
          goal={goal || 'BOARD'}
          consents={consents}
          notif={notif}
          onFinish={onFinish}
        />
      );
  }
}

// ─────────── Shared scaffolding ───────────
function TopScaffold({
  step, total = 7, onBack, showBack = true, right,
}: { step: number; total?: number; onBack?: () => void; showBack?: boolean; right?: React.ReactNode }) {
  return (
    <>
      <div className="steps" style={{ marginTop: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
        ))}
      </div>
      <div className="top-bar">
        {showBack ? (
          <button className="back" onClick={onBack} aria-label="Back">
            <Glyph.ArrowL />
          </button>
        ) : (
          <div style={{ width: 36, height: 36 }} />
        )}
        {right || <div />}
      </div>
    </>
  );
}

// ─────────── 01 Welcome ───────────
function ScreenWelcome({ onNext, onSignIn }: { onNext: () => void; onSignIn: () => void }) {
  return (
    <div className="screen">
      <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BrandLogo size="sm" />
        <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>CLASS 7–12</span>
      </div>
      <div className="screen-body" style={{ paddingTop: 28, gap: 24 }}>
        <div className="hero-glyph">
          <div className="grid-bg" />
          <div style={{ position: 'absolute', inset: 0, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.12em', opacity: 0.8 }}>FIG. 01 — DEFINITE INTEGRAL</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, opacity: 0.6 }}>CLASS 12 · INTEGRALS</span>
            </div>
            <div style={{ flex: 1, marginTop: -8 }}>
              <Glyph.WelcomeHero accent="#fff" />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <span className="eyebrow">Welcome</span>
          <h1 className="display" style={{ marginTop: 10 }}>
            Master math,<br />one <em>concept</em><br />at a time.
          </h1>
          <p className="subtitle" style={{ maxWidth: 320 }}>
            An adaptive maths coach for Class&nbsp;7 to Class&nbsp;12 — every chapter, every concept.
          </p>
        </div>
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext}>
          Get started
          <Glyph.ChevronR />
        </button>
        <button className="btn text" onClick={onSignIn}>
          I already have an account
        </button>
      </div>
    </div>
  );
}

// ─────────── 02 Auth — real email/password (+ optional Google) signup ───────────
function ScreenAuth({
  step, onBack, onNext, name, email, setEmail, password, setPassword,
}: {
  step: number; onBack: () => void; onNext: () => void;
  name: string;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const gsiRef = useRef<HTMLDivElement | null>(null);

  async function continueWithEmail() {
    if (busy) return;
    setErr(null);

    // 이미 토큰 있으면(뒤로갔다 다시 온 경우, /login 거쳐서 온 경우) 그대로 진행.
    if (tokens.get()) { onNext(); return; }

    // DEV 빠른 진입: 입력 비어있으면 dev-login (production 빌드에선 이 분기 dead-code).
    if (import.meta.env.DEV && (!email || !password)) {
      setBusy(true);
      try {
        const t = await post<{ accessToken: string; refreshToken: string }>('/auth/dev-login', {});
        tokens.set(t.accessToken, t.refreshToken);
        onNext();
      } catch (e: any) {
        setErr(e?.response?.data?.error?.message ?? 'Dev sign-in failed');
      } finally { setBusy(false); }
      return;
    }

    // Production / 일반: 진짜 가입.
    if (!email.includes('@')) { setErr('Please enter a valid email.'); return; }
    if (password.length < 8)  { setErr('Password must be at least 8 characters.'); return; }

    setBusy(true);
    try {
      // 최소 페이로드 — role/grade/goal/consents 등은 이후 step 에서 patch.
      const t = await post<{ accessToken: string; refreshToken: string }>('/auth/register', {
        email: email.trim().toLowerCase(),
        password,
        name: name || 'Student',
      });
      tokens.set(t.accessToken, t.refreshToken);
      onNext();
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? 'Sign-up failed');
    } finally { setBusy(false); }
  }

  // Google Identity Services — VITE_GOOGLE_CLIENT_ID 설정된 경우만.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !gsiRef.current) return;
    const navigate = (path: string) => { window.location.assign(path); };
    const init = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) return;
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp: { credential: string }) => {
          setErr(null); setBusy(true);
          try {
            const t = await post<{ accessToken: string; refreshToken: string }>(
              '/auth/google/id-token',
              { idToken: resp.credential },
            );
            tokens.set(t.accessToken, t.refreshToken);
            onNext();
          } catch (e: any) {
            setErr(e?.response?.data?.error?.message ?? 'Google sign-in failed');
          } finally { setBusy(false); }
        },
      });
      g.accounts.id.renderButton(gsiRef.current!, { theme: 'outline', size: 'large', width: 280, text: 'signup_with' });
      // 보너스: 사용자가 의도하면 원탭 — 방해되면 빼도 됨.
      // g.accounts.id.prompt();
      void navigate; // suppress unused
    };
    if ((window as any).google?.accounts?.id) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true; s.defer = true; s.onload = init;
    document.body.appendChild(s);
  }, [onNext]);

  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 20 }}>
        <div>
          <span className="eyebrow">Step 01 · Account</span>
          <h2 className="title" style={{ marginTop: 10 }}>Create your Matheo account</h2>
          <p className="subtitle">Email and password — you can add Google later.</p>
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="field">
          <label>Password (8+ characters)</label>
          <input
            type="password" autoComplete="new-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn" onClick={continueWithEmail} disabled={busy}>
          <Glyph.Mail />
          <span>{busy ? 'Working…' : 'Continue with email'}</span>
          <Glyph.ChevronR />
        </button>

        {GOOGLE_CLIENT_ID && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
              <span className="caption" style={{ fontSize: 11 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
            </div>
            <div ref={gsiRef} style={{ display: 'flex', justifyContent: 'center' }} />
          </>
        )}

        {err && <div style={{ color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
          <span className="caption" style={{ fontSize: 11 }}>SECURE · DPDP 2023</span>
          <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--p-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--p-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
        <p className="caption" style={{ textAlign: 'center', maxWidth: 280, alignSelf: 'center', fontSize: 11 }}>
          By continuing you agree to our <span style={{ color: 'var(--p-primary)', textDecoration: 'underline' }}>Terms</span> and acknowledge the <span style={{ color: 'var(--p-primary)', textDecoration: 'underline' }}>Privacy Notice</span>.
        </p>
      </div>
    </div>
  );
}

// ─────────── 03 Role select ───────────
function ScreenRole({
  step, onBack, onNext, role, setRole,
}: { step: number; onBack: () => void; onNext: () => void; role: Role | ''; setRole: (r: Role) => void }) {
  // PARENT/TEACHER are visible-but-disabled until the per-role dashboards ship.
  // We keep them rendered (vs. removed) so future Student users instantly see
  // the product roadmap and we don't need to redesign the card stack later.
  const roles: Array<{ id: Role; icon: typeof Glyph.Person; label: string; sub: string; comingSoon?: boolean }> = [
    { id: 'STUDENT', icon: Glyph.Person, label: 'Student', sub: 'I’m here to learn and practice math.' },
    { id: 'PARENT', icon: Glyph.Parent, label: 'Parent', sub: 'Track my child’s progress and reports.', comingSoon: true },
    { id: 'TEACHER', icon: Glyph.Teacher, label: 'Teacher / Tutor', sub: 'Run a class or tutor a small group.', comingSoon: true },
  ];
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 24 }}>
        <div>
          <span className="eyebrow">Step 02 · You</span>
          <h2 className="title" style={{ marginTop: 10 }}>Who’s using Matheo?</h2>
          <p className="subtitle">We tailor the home screen and reports to your role.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {roles.map((r) => {
            const Icon = r.icon;
            const selected = role === r.id;
            return (
              <div
                key={r.id}
                className={`option-card ${selected ? 'selected' : ''}`}
                onClick={() => !r.comingSoon && setRole(r.id)}
                style={r.comingSoon ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
                aria-disabled={r.comingSoon || undefined}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: selected ? 'var(--p-surface)' : 'var(--p-surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: selected ? 'var(--p-primary)' : 'var(--p-ink-2)',
                  flexShrink: 0,
                  border: selected ? '1.5px solid var(--p-primary)' : '1px solid var(--p-border)',
                }}>
                  <div style={{ width: 24, height: 24 }}><Icon accent="currentColor" /></div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>{r.label}</span>
                    {r.id === 'STUDENT' && <span className="chip primary" style={{ padding: '2px 8px', fontSize: 10.5 }}>Most popular</span>}
                    {r.comingSoon && <span className="chip" style={{ padding: '2px 8px', fontSize: 10.5 }}>Coming soon</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--p-muted)', marginTop: 2 }}>{r.sub}</div>
                </div>
                <div className="check" style={{ width: 22, height: 22 }}>
                  {selected && <Glyph.Check accent="#fff" size={14} />}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext} disabled={!role} style={{ opacity: role ? 1 : 0.45 }}>
          Continue
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 04 Profile (name + class) ───────────
function ScreenProfile({
  step, onBack, onNext, name, setName, grade, setGrade,
}: { step: number; onBack: () => void; onNext: () => void; name: string; setName: (n: string) => void; grade: GradeId | ''; setGrade: (g: GradeId) => void }) {
  const grades: Array<{ id: GradeId; num: string; lbl: string }> = [
    { id: 'CLASS_7', num: '7', lbl: 'GRADE' },
    { id: 'CLASS_8', num: '8', lbl: 'GRADE' },
    { id: 'CLASS_9', num: '9', lbl: 'GRADE' },
    { id: 'CLASS_10', num: '10', lbl: 'GRADE · BOARD' },
    { id: 'CLASS_11', num: '11', lbl: 'GRADE' },
    { id: 'CLASS_12', num: '12', lbl: 'GRADE · BOARD' },
  ];
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 24 }}>
        <div>
          <span className="eyebrow">Step 03 · Profile</span>
          <h2 className="title" style={{ marginTop: 10 }}>Tell us about yourself.</h2>
        </div>
        <div className="field">
          <label>Your name</label>
          <input placeholder="e.g. Aarav Sharma" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>What class are you in?</label>
          <div className="grade-grid">
            {grades.map((g) => (
              <div key={g.id} className={`grade-pill ${grade === g.id ? 'selected' : ''}`} onClick={() => setGrade(g.id)}>
                <span className="num">{g.num}</span>
                <span className="lbl">{g.lbl}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--p-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--p-primary-fg)' }}>
            <Glyph.Sparkle accent="#fff" size={14} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-ink)' }}>Chapter-aligned content</div>
            <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 2 }}>
              We map every chapter to your class. You can change this later.
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext} disabled={!name || !grade} style={{ opacity: name && grade ? 1 : 0.45 }}>
          Continue
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 05 Goal (localStorage only) ───────────
function ScreenGoal({
  step, onBack, onNext, goal, setGoal,
}: { step: number; onBack: () => void; onNext: () => void; goal: GoalId | ''; setGoal: (g: GoalId) => void }) {
  const goals: Array<{ id: GoalId; title: string; sub: string }> = [
    { id: 'BOARD', title: 'Ace my board exam', sub: 'CBSE Class 10 or 12 board' },
    { id: 'JEE', title: 'Prepare for JEE / NEET', sub: 'Foundation & advanced problem sets' },
    { id: 'SCHOOL', title: 'Keep up with school', sub: 'Weekly practice and concept clarity' },
    { id: 'CATCHUP', title: 'Catch up & build foundation', sub: 'Fill gaps from earlier classes' },
  ];
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 22 }}>
        <div>
          <span className="eyebrow">Step 04 · Goal</span>
          <h2 className="title" style={{ marginTop: 10 }}>What brings you here?</h2>
          <p className="subtitle">Pick one — we’ll prioritise the right topics for you.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {goals.map((g) => {
            const selected = goal === g.id;
            return (
              <div key={g.id} className={`option-card ${selected ? 'selected' : ''}`} onClick={() => setGoal(g.id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--p-ink)' }}>{g.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--p-muted)', marginTop: 2 }}>{g.sub}</div>
                </div>
                <div className="check">
                  {selected && <Glyph.Check accent="#fff" size={13} />}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext} disabled={!goal} style={{ opacity: goal ? 1 : 0.45 }}>
          Continue
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 06 Diagnostic — 실 백엔드 4문항 ───────────
type DiagProblem = {
  id: string; body: string; difficulty: string;
  step: { id: string; stepIndex: number; prompt: string; choices: Array<{ id: string; choiceIndex: number; text: string }> } | null;
  conceptLessonId: string | null;
};
function ScreenDiagnostic({
  step, onBack, onNext, onComplete,
}: { step: number; onBack: () => void; onNext: () => void; onComplete: (r: DiagnosticResult) => void }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [problems, setProblems] = useState<DiagProblem[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(2);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await post<{ sessionId: string; problems: DiagProblem[] }>('/diagnostic/start', {});
        setSessionId(r.sessionId);
        setProblems(r.problems);
      } catch (e: any) {
        setErr(e?.response?.data?.error?.message ?? 'Could not start diagnostic.');
      }
    })();
  }, []);

  const cur = problems[qIdx];
  const total = problems.length || 4;

  async function submitOrAdvance() {
    if (busy) return;
    if (!cur || !choice || !sessionId) return;
    if (!submitted) {
      // 1차 제출 — 답안 전송 + 정/오답 표시 모드.
      setBusy(true);
      try {
        await post('/diagnostic/answer', { sessionId, problemId: cur.id, choiceId: choice, confidence });
        setSubmitted(true);
      } catch (e: any) {
        setErr(e?.response?.data?.error?.message ?? 'Could not submit answer.');
      } finally {
        setBusy(false);
      }
      return;
    }
    // 다음 문항으로 (또는 마지막이면 finish).
    if (qIdx + 1 < problems.length) {
      setQIdx(qIdx + 1);
      setChoice(null);
      setSubmitted(false);
      setConfidence(2);
      return;
    }
    setBusy(true);
    try {
      const r = await post<DiagnosticResult>(`/diagnostic/${sessionId}/finish`, {});
      onComplete(r);
      onNext();
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? 'Could not finalise diagnostic.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} right={
        <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>Q {qIdx + 1} / {total}</span>
      } />
      <div className="screen-body" style={{ gap: 18 }}>
        <div>
          <span className="eyebrow">Step 05 · Quick check</span>
          <h2 className="title" style={{ marginTop: 10 }}>A 4-question warm-up.</h2>
          <p className="subtitle">No grades, no time pressure — just so we know where to start.</p>
        </div>

        {err && (
          <div style={{ padding: 12, borderRadius: 10, background: 'var(--p-danger-tint)', color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>
        )}

        {!cur && !err && (
          <div className="card" style={{ padding: 16, textAlign: 'center', color: 'var(--p-muted)' }}>Loading questions…</div>
        )}

        {cur && (
          <>
            <div className="card" style={{ padding: 18, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="chip" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em' }}>CONCEPT</span>
                <span className="caption" style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>{cur.difficulty}</span>
              </div>
              <div className="math-big" style={{ fontSize: 16, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: 'var(--p-ink)' }}>
                {cur.body}
              </div>
              {cur.step?.prompt && (
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--p-ink-2)' }}>{cur.step.prompt}</div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(cur.step?.choices ?? []).map((c, i) => {
                const sel = choice === c.id;
                const cls = sel ? 'choice selected' : 'choice';
                return (
                  <div key={c.id} className={cls} onClick={() => !submitted && setChoice(c.id)}>
                    <div className="letter">{['A', 'B', 'C', 'D', 'E'][i] ?? c.choiceIndex}</div>
                    <span className="text">{c.text}</span>
                  </div>
                );
              })}
            </div>
            {!submitted && (
              <div className="card" style={{ padding: 12, background: 'transparent', borderStyle: 'dashed' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="caption" style={{ fontSize: 12 }}>How sure are you?</span>
                  <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{confidence}/4</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} onClick={() => setConfidence(n)} style={{
                      flex: 1, height: 8, borderRadius: 4,
                      background: n <= confidence ? 'var(--p-primary)' : 'var(--p-border)',
                      cursor: 'pointer', transition: 'background .12s',
                    }} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button
          className="btn"
          onClick={submitOrAdvance}
          disabled={!cur || !choice || busy}
          style={{ opacity: !cur || !choice ? 0.45 : 1 }}
        >
          {busy ? 'Saving…' : !submitted ? 'Submit answer' : qIdx + 1 < total ? 'Next question' : 'See my results'}
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 07 Mastery map (실 진단 결과 기반) ───────────
function ScreenResults({
  step, onBack, onNext, name, result,
}: { step: number; onBack: () => void; onNext: () => void; name: string; result: DiagnosticResult | null }) {
  // 실 mastery 결과 → UI shape 으로 매핑 (없으면 빈 안내).
  const concepts: Array<{ name: string; value: number; tag: 'Focus' | 'Steady' | 'Strong' }> =
    (result?.masteries ?? []).slice(0, 5).map((m) => ({
      name: m.conceptName,
      value: Math.round(m.score),
      tag: m.score < 50 ? 'Focus' : m.score < 75 ? 'Steady' : 'Strong',
    }));
  const focusConcept = (result?.masteries ?? []).slice().sort((a, b) => a.score - b.score)[0];
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 20 }}>
        <div>
          <span className="eyebrow">Step 06 · Your map</span>
          <h2 className="title" style={{ marginTop: 10 }}>
            Here’s where you <em style={{ fontStyle: 'italic', color: 'var(--p-primary)', fontFamily: 'var(--font-display)' }}>stand</em> today.
          </h2>
          <p className="subtitle">{name ? `${name}, a` : 'A'} first read on your strengths — this evolves as you practice.</p>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Concept mastery</span>
            <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              {result ? `${result.correct} / ${result.attempted} CORRECT` : 'NO DATA'}
            </span>
          </div>
          {concepts.length === 0 ? (
            <div style={{ padding: '14px 0', textAlign: 'center', color: 'var(--p-muted)', fontSize: 13 }}>
              No diagnostic data yet — practice problems will build your mastery map.
            </div>
          ) : concepts.map((c) => (
            <div key={c.name} className="mastery-row">
              <span className="label">{c.name}</span>
              <div className="track">
                <div className="fill" style={{ width: `${c.value}%`, background: c.tag === 'Focus' ? 'var(--p-accent)' : 'var(--p-primary)' }} />
              </div>
              <span className="value">{c.value}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ background: 'var(--p-primary-tint)', borderColor: 'transparent', padding: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--p-primary)', color: 'var(--p-primary-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Glyph.Sparkle accent="#fff" size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--p-ink)' }}>Your AI coach suggests</div>
              <div style={{ fontSize: 13, color: 'var(--p-ink-2)', marginTop: 4, lineHeight: 1.45 }}>
                {focusConcept
                  ? <>Start with <strong>{focusConcept.conceptName}</strong>. Lift this from {Math.round(focusConcept.score)} → ~70 with focused practice.</>
                  : <>Practice your first chapter — your AI coach will surface weak topics from real attempts.</>}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                {focusConcept && <span className="chip" style={{ fontSize: 11 }}>{focusConcept.conceptCode}</span>}
                <span className="chip" style={{ fontSize: 11 }}>Adaptive</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext}>
          Continue
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 08 Consents ───────────
function ScreenConsents({
  step, onBack, onNext, consents, setConsents, notif, setNotif,
}: {
  step: number; onBack: () => void; onNext: () => void;
  consents: ConsentMap; setConsents: (m: ConsentMap) => void;
  notif: boolean; setNotif: (b: boolean) => void;
}) {
  const toggle = (k: ConsentKey) => setConsents({ ...consents, [k]: !consents[k] });
  const items: Array<{ id: 'DATA_PROCESSING' | ConsentKey; req?: boolean; name: string; desc: string }> = [
    { id: 'DATA_PROCESSING', req: true, name: 'Essential data', desc: 'Process your account, attempts, and progress so the app works. Required by DPDP 2023.' },
    { id: 'ANALYTICS', name: 'Learning analytics', desc: 'Let us analyse error patterns so your AI coach gets sharper over time.' },
    { id: 'AI_TRAINING', name: 'Improve AI for everyone', desc: 'Anonymised samples may help train future models. You can revoke anytime.' },
    { id: 'MARKETING', name: 'Updates and offers', desc: 'Occasional emails on new chapters, mock exams, and tutor programs.' },
  ];
  const isChecked = (id: 'DATA_PROCESSING' | ConsentKey) =>
    id === 'DATA_PROCESSING' ? true : consents[id];
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 22 }}>
        <div>
          <span className="eyebrow">Step 07 · Privacy</span>
          <h2 className="title" style={{ marginTop: 10 }}>Your data, your call.</h2>
          <p className="subtitle">We follow India’s DPDP Act 2023. Change any of these later in Settings.</p>
        </div>
        {/* Push reminders are gated on FCM credentials, which aren't wired yet
            (server boot logs "FCM credentials not set — push notifications
            disabled"). We render the row so the IA stays stable for the
            launch build, but the toggle is non-interactive until FCM lands. */}
        <div className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', opacity: 0.6 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--p-accent-tint)', color: 'var(--p-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 22, height: 22 }}><Glyph.Bell accent="currentColor" /></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>Daily study reminders</div>
              <span className="chip" style={{ padding: '2px 8px', fontSize: 10.5 }}>Coming soon</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--p-muted)', marginTop: 2 }}>Keep your streak alive — one nudge per day.</div>
          </div>
          <div className="toggle" style={{ cursor: 'not-allowed', opacity: 0.5 }} aria-disabled />
        </div>
        <div className="card" style={{ padding: '4px 16px' }}>
          {items.map((it) => (
            <div key={it.id} className="consent-row">
              <div
                className={`ck ${isChecked(it.id) ? 'checked' : ''}`}
                onClick={() => !it.req && toggle(it.id as ConsentKey)}
                style={{ opacity: it.req ? 0.85 : 1, cursor: it.req ? 'default' : 'pointer' }}
              >
                {isChecked(it.id) && <Glyph.Check accent="#fff" size={12} />}
              </div>
              <div className="info">
                <div className="name">
                  {it.name}
                  {it.req && <span className="req-pill">Required</span>}
                </div>
                <div className="desc">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext}>
          Agree &amp; continue
          <Glyph.ChevronR />
        </button>
        <p className="caption" style={{ textAlign: 'center', fontSize: 11.5 }}>
          Policy v2026.05.01 · You can withdraw consent in Settings → Privacy.
        </p>
      </div>
    </div>
  );
}

// ─────────── 09 Ready / First lesson ───────────
function ScreenReady({
  step, name, role, grade, goal, consents, notif, onFinish,
}: {
  step: number; name: string; role: Role; grade: GradeId; goal: GoalId;
  consents: ConsentMap; notif: boolean; onFinish: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const { refreshUser } = useAuth();

  async function finalize() {
    if (busy) return;
    setBusy(true);
    try {
      // 토큰은 ScreenAuth(가입/Google/로그인) 단계에서 이미 확보되어 있어야 함.
      // DEV: 토큰 없으면 dev-login 으로 빠르게 진입 — production 빌드에선 이 분기 dead-code.
      if (!tokens.get()) {
        if (import.meta.env.DEV) {
          const t = await post<{ accessToken: string; refreshToken: string }>('/auth/dev-login', {});
          tokens.set(t.accessToken, t.refreshToken);
        } else {
          // 인증 흐름이 끊겼다 — 가입 화면으로 보냄.
          window.location.assign('/register');
          return;
        }
      }
      // 프로필 best-effort 반영 — name, gradeLevel, studyGoal 모두 백엔드 User row 에 저장.
      try {
        await patch<Me>('/users/me', { name, gradeLevel: GRADE_MAP[grade], studyGoal: goal });
      } catch { /* ignore */ }
      // 선택 동의 3종을 백엔드 Consent 테이블에 저장 (DPDP 이력).
      const consentKinds: ConsentKey[] = ['ANALYTICS', 'AI_TRAINING', 'MARKETING'];
      for (const k of consentKinds) {
        try {
          if (consents[k]) await post(`/privacy/consents/${k.toLowerCase()}`, {});
          // 미동의는 default revoked 상태 — 명시적 revoke 불필요 (한 번도 grant 한 적 없음).
        } catch { /* ignore — best effort */ }
      }
      // localStorage 에 onboarding 결과 저장 (백엔드 미저장 항목: goal, notif 토글).
      localStorage.setItem('mathema.onboarding', JSON.stringify({
        role, grade, goal, notif, completedAt: new Date().toISOString(),
      }));
      // Refresh AuthContext.user so ProtectedRoute drops the !gradeLevel
      // guard before we navigate into /app. Without this the freshly-saved
      // gradeLevel sits only on the server and ProtectedRoute bounces the
      // user right back to /onboarding — infinite loop.
      await refreshUser();
      onFinish();
    } catch (e) {
      if (import.meta.env.DEV) console.warn('onboarding finalize failed', e);
      onFinish();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <TopScaffold step={step} showBack={false} />
      <div className="screen-body" style={{ gap: 20, justifyContent: 'space-between' }}>
        <div style={{ marginTop: 12 }}>
          <span className="eyebrow">All set</span>
          <h1 className="display" style={{ marginTop: 10 }}>
            Welcome,<br />
            <em>{name || 'Aarav'}</em>.
          </h1>
          <p className="subtitle" style={{ maxWidth: 320 }}>
            Your plan is ready. Let’s start with a 12-minute concept lesson.
          </p>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderColor: 'var(--p-border-strong)' }}>
          <div style={{ background: 'var(--p-primary)', color: 'var(--p-primary-fg)', padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.12em', opacity: 0.85 }}>LESSON 01 · CLASS 12 INTEGRALS</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginTop: 6, fontStyle: 'italic' }}>Integration as antiderivative</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontStyle: 'italic', opacity: 0.95 }}>∫</div>
            </div>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="caption" style={{ fontSize: 11.5 }}>READY · 9 STEPS</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-ink)' }}>~12 min · Hook → Worked example → Retrieval</span>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--p-primary)', color: 'var(--p-primary-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Glyph.ChevronR accent="#fff" size={18} />
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {/* Onboarding-ready stats. Each is a verifiable fact rather than a
              promise of pace — earlier copy said "5 lessons/week" and "25m
              daily target" which were placeholders the app never enforced. */}
          {[
            { k: grade ? grade.replace('CLASS_', '') : '—', v: 'Your class' },
            { k: grade ? String(chapterCountByClass(grade)) : '—', v: 'Chapters' },
            { k: '∞', v: 'Practice pool' },
          ].map((s) => (
            <div key={s.v} className="card" style={{ padding: 12, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--p-ink)', fontStyle: 'italic' }}>{s.k}</div>
              <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={finalize} disabled={busy}>
          {busy ? 'Setting up…' : 'Start my first lesson'}
          <Glyph.ChevronR />
        </button>
        <button className="btn text" onClick={finalize} disabled={busy}>
          Go to dashboard
        </button>
      </div>
    </div>
  );
}
