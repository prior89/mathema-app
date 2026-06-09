/* OnboardingPage — Matheo 9-screen onboarding flow.
 * Ported from `App onboarding/screens-a.jsx` + `screens-b.jsx`.
 * Phone Auth option hidden (no backend); Goal stored in localStorage; Diagnostic state in-memory.
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post, patch, tokens, get } from '../lib/api';
import { Glyph } from '../components/onboarding/Glyph';
import MathText from '../components/MathText';
import { BrandLogo } from '../components/Brand';
import type {
  AdaptiveDiagnosticAnswer,
  AdaptiveDiagnosticStart,
  DiagnosticProblem,
  DiagnosticResult,
  Me,
} from '../lib/queries';
import { useAuth } from '../context/AuthContext';
import { useFeatureFlag, useFeatureFlags } from '../hooks/useFeatureFlags';
import { homePathForRole } from '../lib/role-routes';
import { useT } from '../lib/i18n';
import { isLikelyEmail } from '../lib/email';
import '../styles/onboarding.css';

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ?? '';

type StepKey = 'welcome' | 'country' | 'auth' | 'role' | 'profile' | 'goal' | 'diagnostic' | 'results' | 'consents' | 'ready';
type Role = 'STUDENT' | 'PARENT' | 'TEACHER';
type GradeId = 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10' | 'CLASS_11' | 'CLASS_12';
type GoalId = 'BOARD' | 'JEE' | 'SCHOOL' | 'CATCHUP';
type ConsentKey = 'ANALYTICS' | 'AI_TRAINING' | 'MARKETING';
type ConsentMap = Record<ConsentKey, boolean>;
// Country chip — v1 ships with IN + KR active. Others kept in the type so a
// later launch can flip them on without a code change; their chips render
// "Coming soon" until then.
type CountryId = 'IN' | 'KR' | 'US' | 'UK' | 'AU' | 'SG';

const STEP_FLOW: StepKey[] = ['welcome', 'country', 'auth', 'role', 'profile', 'goal', 'diagnostic', 'results', 'consents', 'ready'];

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
  const { user } = useAuth();
  // Onboarding runs pre-auth, so we can't read User.country yet to pick a
  // language. We respect whatever the user already has saved (or i18n.tsx's
  // browser-default of 'en'). The country-aware flip happens after login
  // via <I18nCountrySync /> in App.tsx — when a KR account is detected and
  // no explicit lang preference is set, lang switches to 'ko' there.
  return (
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <Flow onFinish={() => navigate(homePathForRole(user?.role))} />
        </div>
      </div>
    </div>
  );
}

function Flow({ onFinish }: { onFinish: () => void }) {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<StepKey>('welcome');
  const [role, setRole] = useState<Role | ''>('STUDENT');
  // Empty initial — placeholder/label comes from the input's placeholder
  // attribute. Pre-filling a fake Indian name leaked into KR signups and
  // confused users who didn't immediately overwrite it.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<GradeId | ''>('CLASS_11');
  const [goal, setGoal] = useState<GoalId | ''>('BOARD');
  // Country defaults to IN. The country step (after welcome) lets the user
  // flip to KR — picking KR also calls i18n setLang('ko') immediately so the
  // remaining onboarding screens render in Korean.
  const [country, setCountry] = useState<CountryId>('IN');
  const [consents, setConsents] = useState<ConsentMap>({ ANALYTICS: true, AI_TRAINING: false, MARKETING: false });
  const [notif, setNotif] = useState(true);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const idx = STEP_FLOW.indexOf(step);
  const stepIndex = Math.max(0, idx - 1); // skip welcome from indicator
  const go = (key: StepKey) => setStep(key);
  const next = () => go(STEP_FLOW[Math.min(STEP_FLOW.length - 1, idx + 1)]);
  const back = () => go(STEP_FLOW[Math.max(0, idx - 1)]);
  const syncProfileThenDiagnostic = async () => {
    if (!grade || !goal) throw new Error('missing onboarding profile');
    await patch<Me>('/users/me', {
      name,
      gradeLevel: GRADE_MAP[grade],
      studyGoal: goal,
    });
    await refreshUser().catch(() => {});
    next();
  };

  switch (step) {
    case 'welcome':
      return <ScreenWelcome onNext={next} onSignIn={onFinish} />;
    case 'country':
      return <ScreenCountry step={stepIndex} onBack={back} onNext={next} country={country} setCountry={setCountry} />;
    case 'auth':
      return (
        <ScreenAuth
          step={stepIndex} onBack={back} onNext={next}
          name={name}
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          country={country}
        />
      );
    case 'role':
      return <ScreenRole step={stepIndex} onBack={back} onNext={next} role={role} setRole={setRole} />;
    case 'profile':
      return <ScreenProfile step={stepIndex} onBack={back} onNext={next} name={name} setName={setName} grade={grade} setGrade={setGrade} country={country} />;
    case 'goal':
      return <ScreenGoal step={stepIndex} onBack={back} onNext={syncProfileThenDiagnostic} goal={goal} setGoal={setGoal} />;
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
  step, total = STEP_FLOW.length - 1, onBack, showBack = true, right,
}: { step: number; total?: number; onBack?: () => void; showBack?: boolean; right?: React.ReactNode }) {
  const { t } = useT();
  return (
    <>
      <div className="steps" style={{ marginTop: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
        ))}
      </div>
      <div className="top-bar">
        {showBack ? (
          <button className="back" onClick={onBack} aria-label={t('onboarding.back')}>
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
  const { t } = useT();
  return (
    <div className="screen">
      <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BrandLogo size="sm" />
        <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>{t('onboarding.classLabel')}</span>
      </div>
      <div className="screen-body" style={{ paddingTop: 28, gap: 24 }}>
        <div className="hero-glyph">
          <div className="grid-bg" />
          <div style={{ position: 'absolute', inset: 0, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.12em', opacity: 0.8 }}>{t('onboarding.welcome.figureLabel')}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, opacity: 0.6 }}>{t('onboarding.welcome.figureSub')}</span>
            </div>
            <div style={{ flex: 1, marginTop: -8 }}>
              <Glyph.WelcomeHero accent="#fff" />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <span className="eyebrow">{t('onboarding.welcome.eyebrow')}</span>
          <h1 className="display" style={{ marginTop: 10 }}>
            {t('onboarding.welcome.title.line1')}<br />{t('onboarding.welcome.title.line2')} <em>{t('onboarding.welcome.title.em')}</em>{t('onboarding.welcome.title.line3')}<br />{t('onboarding.welcome.title.line4')}
          </h1>
          <p className="subtitle" style={{ maxWidth: 320 }}>
            {t('onboarding.welcome.tagline')}
          </p>
        </div>
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext}>
          {t('onboarding.welcome.cta.start')}
          <Glyph.ChevronR />
        </button>
        <button className="btn text" onClick={onSignIn}>
          {t('onboarding.welcome.cta.signin')}
        </button>
      </div>
    </div>
  );
}

// ─────────── 01b Country — picks curriculum + locale, drives every step after ───────────
function ScreenCountry({
  step, onBack, onNext, country, setCountry,
}: { step: number; onBack: () => void; onNext: () => void; country: CountryId; setCountry: (c: CountryId) => void }) {
  const { t, setLang } = useT();
  // v1 active = IN + KR. Others compile but show as disabled "Coming soon"
  // chips so a later launch (US/UK/AU/SG) is one flag flip away.
  const COUNTRIES: Array<{ id: CountryId; flag: string; name: string; sub: string; active: boolean }> = [
    { id: 'IN', flag: '🇮🇳', name: 'India',         sub: 'NCERT / CBSE / JEE',     active: true  },
    { id: 'KR', flag: '🇰🇷', name: '대한민국',       sub: '2022 개정 교육과정 · 수능', active: true  },
    { id: 'US', flag: '🇺🇸', name: 'United States', sub: 'Common Core / SAT',      active: false },
    { id: 'UK', flag: '🇬🇧', name: 'United Kingdom', sub: 'GCSE / A-Level',         active: false },
    { id: 'AU', flag: '🇦🇺', name: 'Australia',     sub: 'ACARA',                  active: false },
    { id: 'SG', flag: '🇸🇬', name: 'Singapore',     sub: 'MOE',                    active: false },
  ];
  const pick = (c: CountryId) => {
    setCountry(c);
    // BUG FIX 2026-05-27: flip i18n WITHOUT triggering a page reload. Earlier
    // this was a plain setLang() which reloads in 50ms — fine for in-app
    // language switching but catastrophic mid-onboarding (useState state
    // resets to initial and the user lands back at welcome). The opts.reload
    // escape hatch keeps the language change visible (so the remaining
    // onboarding screens render in KR / EN) without nuking React state.
    if (c === 'KR') setLang('ko', { reload: false });
    else setLang('en', { reload: false });
  };
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 20 }}>
        <div>
          <span className="eyebrow">Region</span>
          <h2 className="title" style={{ marginTop: 10 }}>
            {country === 'KR' ? '어느 나라에서 공부하나요?' : 'Where are you studying?'}
          </h2>
          <p className="subtitle" style={{ marginTop: 8, fontSize: 13.5 }}>
            {country === 'KR'
              ? '커리큘럼·언어·결제 통화가 선택한 국가에 맞춰 설정돼요.'
              : 'Curriculum, language, and currency follow your selection.'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {COUNTRIES.map((c) => {
            const selected = country === c.id;
            return (
              <button
                key={c.id}
                type="button"
                className={`card ${selected ? 'selected' : ''}`}
                onClick={() => c.active && pick(c.id)}
                disabled={!c.active}
                style={{
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: c.active ? 'pointer' : 'not-allowed',
                  opacity: c.active ? 1 : 0.45,
                  border: selected ? '2px solid var(--p-primary)' : '1px solid var(--p-border)',
                  background: selected ? 'var(--p-primary-tint)' : 'var(--p-surface)',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--p-ink)' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 2 }}>{c.sub}</div>
                </div>
                {!c.active && (
                  <span className="chip" style={{ padding: '2px 8px', fontSize: 10.5 }}>Coming soon</span>
                )}
                {selected && (
                  <Glyph.ChevronR accent="var(--p-primary)" size={16} />
                )}
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext} disabled={!country} style={{ opacity: country ? 1 : 0.45 }}>
          {country === 'KR' ? '계속하기' : 'Continue'}
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 02 Auth — real email/password (+ optional Google) signup ───────────
function ScreenAuth({
  step, onBack, onNext, name, email, setEmail, password, setPassword, country,
}: {
  step: number; onBack: () => void; onNext: () => void;
  name: string;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  country: CountryId;
}) {
  const { t } = useT();
  const { refreshUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const gsiRef = useRef<HTMLDivElement | null>(null);

  async function continueWithEmail() {
    if (busy) return;
    setErr(null);

    // 이미 토큰 있으면(뒤로갔다 다시 온 경우, /login 거쳐서 온 경우) 그대로 진행.
    // Sync AuthContext.user with whatever the existing token represents so a
    // ProtectedRoute mount anywhere in the rest of onboarding doesn't think
    // the user is unauthed and bounce them to /login.
    if (tokens.get()) { await refreshUser().catch(() => {}); onNext(); return; }

    // DEV 빠른 진입: 입력 비어있으면 dev-login (production 빌드에선 이 분기 dead-code).
    if (import.meta.env.DEV && (!email || !password)) {
      setBusy(true);
      try {
        const t = await post<{ accessToken: string; refreshToken: string }>('/auth/dev-login', {});
        tokens.set(t.accessToken, t.refreshToken);
        // Hydrate AuthContext.user from the freshly-issued token so the rest
        // of /onboarding (and any reactive component reading useAuth())
        // sees the logged-in identity instead of `user: null`.
        await refreshUser().catch(() => {});
        onNext();
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 429) {
          setErr(country === 'KR'
            ? '잠시 후 다시 시도해주세요. (요청이 너무 많아 1분간 제한됐어요.)'
            : 'Please retry in a minute — too many requests.');
        } else if (!status) {
          setErr(country === 'KR'
            ? '서버에 연결할 수 없어요. 인터넷 연결을 확인해주세요.'
            : 'Cannot reach the server. Check your connection.');
        } else {
          setErr(e?.response?.data?.error?.message ?? t('onboarding.auth.devLogin.failed'));
        }
      } finally { setBusy(false); }
      return;
    }

    // Production / 일반: 진짜 가입.
    if (!isLikelyEmail(email)) { setErr(t('onboarding.auth.invalidEmail')); return; }
    if (password.length < 8)  { setErr(t('onboarding.auth.shortPw')); return; }

    setBusy(true);
    try {
      // 최소 페이로드 — role/grade/goal/consents 등은 이후 step 에서 patch.
      // country는 register 시점에 확정 — 이후 PATCH /me로 변경하지 않음.
      const tk = await post<{ accessToken: string; refreshToken: string }>('/auth/register', {
        email: email.trim().toLowerCase(),
        password,
        name: name || 'Student',
        country,
      });
      tokens.set(tk.accessToken, tk.refreshToken);
      // P2 fix 2026-05-27: hydrate AuthContext.user immediately so the rest
      // of onboarding has a non-null user. Before this, the user stayed
      // `null` until ScreenReady.finalize() ran refreshUser at the very end,
      // which meant any stray ProtectedRoute mount mid-onboarding (e.g. a
      // wrong link click) would bounce to /login despite valid tokens.
      // Best-effort: if /users/me fails (rare — same token just succeeded),
      // we proceed anyway; ScreenReady will retry.
      await refreshUser().catch(() => {});
      // P5 fix 2026-06-03: hand off to the next onboarding step instead of
      // doing a full-page navigation to /verify-required. The previous
      // location.assign() wiped this component's React state, so after the
      // user verified their email in their inbox they returned to a blank
      // /onboarding (Welcome again) — Role/Profile/Goal/Diagnostic/Results/
      // Ready were never reachable. We stay in this SPA mount, advance the
      // step state, and let the verify-email guard kick in only when a
      // verified-only endpoint is hit later (the Diagnostic step's problem
      // fetch is the first such call). The user's inbox link continues to
      // work in parallel and updates emailVerifiedAt via /auth/verify-email.
      onNext();
    } catch (e: any) {
      // Map backend error codes → Korean-friendly messages. User-report
      // 2026-05-27: PASSWORD_BREACHED came through as the raw English string
      // at 13px under the button, so users perceived the click as "no
      // response". Surface the actionable guidance instead.
      const status = e?.response?.status;
      const code = e?.response?.data?.error?.code;
      const rawMsg = e?.response?.data?.error?.message;
      let friendly: string;
      if (status === 429) {
        // P4 fix 2026-05-27: register endpoint throttles at 5/min. After
        // hitting it the user used to see a raw generic error and assumed
        // the app was broken. Explicit "try again in a minute" copy.
        friendly = country === 'KR'
          ? '잠시 후 다시 시도해주세요. (요청이 너무 많아 1분간 제한됐어요.)'
          : 'Please retry in a minute — too many sign-up attempts.';
      } else if (code === 'PASSWORD_BREACHED') {
        friendly = country === 'KR'
          ? '이 비밀번호는 보안 사고로 노출된 적이 있어요. 다른 비밀번호를 골라주세요 (8자 이상, 너무 흔하지 않은 것).'
          : 'This password has been seen in a public data breach. Please pick a different one (8+ chars, not common).';
      } else if (rawMsg === 'email already used') {
        friendly = country === 'KR'
          ? '이미 가입된 이메일이에요. 로그인 페이지로 이동해주세요.'
          : 'This email is already registered. Please sign in instead.';
      } else if (!status) {
        friendly = country === 'KR'
          ? '서버에 연결할 수 없어요. 인터넷 연결을 확인하고 다시 시도해주세요.'
          : 'Cannot reach the server. Check your connection and try again.';
      } else {
        friendly = rawMsg ?? t('onboarding.auth.register.failed');
      }
      // Console-log the full error so dev tools surfaces the underlying
      // detail (status code, axios payload) — easier triage than the
      // user-facing message alone.
      // eslint-disable-next-line no-console
      console.error('[onboarding] register failed', { code, rawMsg, error: e });
      setErr(friendly);
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
            const tk = await post<{ accessToken: string; refreshToken: string }>(
              '/auth/google/id-token',
              { idToken: resp.credential },
            );
            tokens.set(tk.accessToken, tk.refreshToken);
            // Same P2 fix path — sync AuthContext.user post-Google-signup so
            // the rest of onboarding has a non-null user.
            await refreshUser().catch(() => {});
            onNext();
          } catch (e: any) {
            const status = e?.response?.status;
            if (status === 429) {
              setErr(country === 'KR'
                ? '잠시 후 다시 시도해주세요. (요청이 너무 많아 1분간 제한됐어요.)'
                : 'Please retry in a minute — too many requests.');
            } else if (!status) {
              setErr(country === 'KR'
                ? '서버에 연결할 수 없어요. 인터넷 연결을 확인해주세요.'
                : 'Cannot reach the server. Check your connection.');
            } else {
              setErr(e?.response?.data?.error?.message ?? t('onboarding.auth.google.failed'));
            }
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
          <span className="eyebrow">{t('onboarding.auth.eyebrow')}</span>
          <h2 className="title" style={{ marginTop: 10 }}>{t('onboarding.auth.title')}</h2>
          <p className="subtitle">{t('onboarding.auth.tagline')}</p>
        </div>

        <div className="field">
          <label>{t('onboarding.auth.email')}</label>
          <input
            type="email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="field">
          <label>{t('onboarding.auth.password')}</label>
          <input
            type="password" autoComplete="new-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error banner — moved above the CTA at 14.5px in a tinted card so
            users actually see backend rejection (PASSWORD_BREACHED, email
            already used, etc.) instead of perceiving the click as "no
            response". Was 13px under the button. */}
        {err && (
          <div
            role="alert"
            style={{
              background: 'var(--p-danger-tint)',
              color: 'var(--p-danger)',
              border: '1px solid var(--p-danger)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 14.5,
              lineHeight: 1.45,
            }}
          >
            {err}
          </div>
        )}

        <button className="btn" onClick={continueWithEmail} disabled={busy}>
          <Glyph.Mail />
          <span>{busy ? t('onboarding.auth.busy') : t('onboarding.auth.emailCta')}</span>
          <Glyph.ChevronR />
        </button>

        {GOOGLE_CLIENT_ID && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
              <span className="caption" style={{ fontSize: 11 }}>{t('onboarding.auth.or')}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
            </div>
            <div ref={gsiRef} style={{ display: 'flex', justifyContent: 'center' }} />
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
          <span className="caption" style={{ fontSize: 11 }}>{t('onboarding.auth.secure')}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--p-muted)' }}>
          {t('onboarding.auth.haveAccount')}{' '}
          <Link to="/login" style={{ color: 'var(--p-primary)', fontWeight: 600, textDecoration: 'none' }}>
            {t('onboarding.auth.signin')}
          </Link>
        </div>
        <p className="caption" style={{ textAlign: 'center', maxWidth: 280, alignSelf: 'center', fontSize: 11 }}>
          {t('onboarding.auth.policyNote.pre')}
          <Link to="/terms" style={{ color: 'var(--p-primary)', textDecoration: 'underline' }}>{t('onboarding.auth.policyNote.tos')}</Link>
          {t('onboarding.auth.policyNote.mid')}
          <Link to="/privacy" style={{ color: 'var(--p-primary)', textDecoration: 'underline' }}>{t('onboarding.auth.policyNote.privacy')}</Link>
          {t('onboarding.auth.policyNote.post')}
        </p>
      </div>
    </div>
  );
}

// ─────────── 03 Role select ───────────
function ScreenRole({
  step, onBack, onNext, role, setRole,
}: { step: number; onBack: () => void; onNext: () => void; role: Role | ''; setRole: (r: Role) => void }) {
  const { t } = useT();
  // PARENT/TEACHER are visible-but-disabled until the per-role dashboards ship.
  // We keep them rendered (vs. removed) so future Student users instantly see
  // the product roadmap and we don't need to redesign the card stack later.
  const roles: Array<{ id: Role; icon: typeof Glyph.Person; label: string; sub: string; comingSoon?: boolean }> = [
    { id: 'STUDENT', icon: Glyph.Person, label: t('onboarding.role.student.label'), sub: t('onboarding.role.student.sub') },
    { id: 'PARENT', icon: Glyph.Parent, label: t('onboarding.role.parent.label'), sub: t('onboarding.role.parent.sub'), comingSoon: true },
    { id: 'TEACHER', icon: Glyph.Teacher, label: t('onboarding.role.teacher.label'), sub: t('onboarding.role.teacher.sub'), comingSoon: true },
  ];
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 24 }}>
        <div>
          <span className="eyebrow">{t('onboarding.role.eyebrow')}</span>
          <h2 className="title" style={{ marginTop: 10 }}>{t('onboarding.role.title')}</h2>
          <p className="subtitle">{t('onboarding.role.tagline')}</p>
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
                    {r.id === 'STUDENT' && <span className="chip primary" style={{ padding: '2px 8px', fontSize: 10.5 }}>{t('onboarding.role.popular')}</span>}
                    {r.comingSoon && <span className="chip" style={{ padding: '2px 8px', fontSize: 10.5 }}>{t('onboarding.role.comingSoon')}</span>}
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
          {t('onboarding.role.continue')}
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 04 Profile (name + class) ───────────
function ScreenProfile({
  step, onBack, onNext, name, setName, grade, setGrade, country,
}: { step: number; onBack: () => void; onNext: () => void; name: string; setName: (n: string) => void; grade: GradeId | ''; setGrade: (g: GradeId) => void; country: CountryId }) {
  const { t } = useT();
  // Grade chips re-label by country. Backend stores GradeLevel (CLASS_N), so
  // KR labels (중1~고3) map onto the same CLASS_7..CLASS_12 IDs the IN
  // pickers use. Mapping mirrors NCERT_TO_KR_GRADE in HomeScreen/LearnScreen:
  //   CLASS_7→중1, CLASS_8→중2, CLASS_9→중3, CLASS_10→고1, CLASS_11→고2, CLASS_12→고3
  const grades: Array<{ id: GradeId; num: string; lbl: string }> = country === 'KR'
    ? [
        { id: 'CLASS_7',  num: '중1', lbl: '중학교 1학년' },
        { id: 'CLASS_8',  num: '중2', lbl: '중학교 2학년' },
        { id: 'CLASS_9',  num: '중3', lbl: '중학교 3학년' },
        { id: 'CLASS_10', num: '고1', lbl: '공통수학' },
        { id: 'CLASS_11', num: '고2', lbl: '선택과목' },
        { id: 'CLASS_12', num: '고3', lbl: '수능 준비' },
      ]
    : [
        { id: 'CLASS_7',  num: '7',  lbl: t('onboarding.profile.gradeLabel') },
        { id: 'CLASS_8',  num: '8',  lbl: t('onboarding.profile.gradeLabel') },
        { id: 'CLASS_9',  num: '9',  lbl: t('onboarding.profile.gradeLabel') },
        { id: 'CLASS_10', num: '10', lbl: t('onboarding.profile.gradeBoard') },
        { id: 'CLASS_11', num: '11', lbl: t('onboarding.profile.gradeLabel') },
        { id: 'CLASS_12', num: '12', lbl: t('onboarding.profile.gradeBoard') },
      ];
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 24 }}>
        <div>
          <span className="eyebrow">{t('onboarding.profile.eyebrow')}</span>
          <h2 className="title" style={{ marginTop: 10 }}>{t('onboarding.profile.title')}</h2>
        </div>
        <div className="field">
          <label>{t('onboarding.profile.nameLabel')}</label>
          <input placeholder={t('onboarding.profile.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>{t('onboarding.profile.classQ')}</label>
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
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-ink)' }}>{t('onboarding.profile.callout.title')}</div>
            <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 2 }}>
              {t('onboarding.profile.callout.body')}
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext} disabled={!name || !grade} style={{ opacity: name && grade ? 1 : 0.45 }}>
          {t('onboarding.profile.continue')}
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 05 Goal (localStorage only) ───────────
function ScreenGoal({
  step, onBack, onNext, goal, setGoal,
}: { step: number; onBack: () => void; onNext: () => void | Promise<void>; goal: GoalId | ''; setGoal: (g: GoalId) => void }) {
  const { t } = useT();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const goals: Array<{ id: GoalId; title: string; sub: string }> = [
    { id: 'BOARD', title: t('onboarding.goal.board.title'), sub: t('onboarding.goal.board.sub') },
    { id: 'JEE', title: t('onboarding.goal.jee.title'), sub: t('onboarding.goal.jee.sub') },
    { id: 'SCHOOL', title: t('onboarding.goal.school.title'), sub: t('onboarding.goal.school.sub') },
    { id: 'CATCHUP', title: t('onboarding.goal.catchup.title'), sub: t('onboarding.goal.catchup.sub') },
  ];
  const continueToDiagnostic = async () => {
    if (!goal || busy) return;
    setErr(null);
    setBusy(true);
    try {
      await onNext();
    } catch (e: any) {
      const rawMsg = e?.response?.data?.error?.message;
      const isKR = (() => { try { return localStorage.getItem('mathema.lang') === 'ko'; } catch { return false; } })();
      setErr(rawMsg ?? (isKR
        ? '학년 정보를 저장하지 못했어요. 다시 시도해 주세요.'
        : 'Could not save your class. Please try again.'));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 22 }}>
        <div>
          <span className="eyebrow">{t('onboarding.goal.eyebrow')}</span>
          <h2 className="title" style={{ marginTop: 10 }}>{t('onboarding.goal.title')}</h2>
          <p className="subtitle">{t('onboarding.goal.tagline')}</p>
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
        {err && (
          <div
            role="alert"
            style={{
              background: 'var(--p-danger-tint)',
              color: 'var(--p-danger)',
              border: '1px solid var(--p-danger)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 14,
              lineHeight: 1.45,
            }}
          >
            {err}
          </div>
        )}
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={continueToDiagnostic} disabled={!goal || busy} style={{ opacity: goal && !busy ? 1 : 0.45 }}>
          {busy ? t('onboarding.diag.saving') : t('onboarding.goal.continue')}
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 06 Diagnostic — fixed 4문항 or adaptive CAT-lite (PR-06) ───────────
type DiagnosticMode = 'fixed' | 'adaptive';

function ScreenDiagnostic({
  step, onBack, onNext, onComplete,
}: { step: number; onBack: () => void; onNext: () => void; onComplete: (r: DiagnosticResult) => void }) {
  const { t } = useT();
  const flagsQuery = useFeatureFlags();
  const adaptiveFlag = useFeatureFlag('adaptive_diagnostic');
  const [mode, setMode] = useState<DiagnosticMode>('fixed');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [problems, setProblems] = useState<DiagnosticProblem[]>([]);
  const [cur, setCur] = useState<DiagnosticProblem | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [maxItems, setMaxItems] = useState(4);
  const [itemsAnswered, setItemsAnswered] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(2);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const questionStartedAt = useRef<number>(Date.now());

  const resetQuestionUi = (problem: DiagnosticProblem | null) => {
    setCur(problem);
    setChoice(null);
    setConfidence(2);
    questionStartedAt.current = Date.now();
  };

  const startFixed = async () => {
    const r = await post<{ sessionId: string; problems: DiagnosticProblem[] }>('/diagnostic/start', {});
    setMode('fixed');
    setSessionId(r.sessionId);
    setProblems(r.problems);
    setMaxItems(r.problems.length || 4);
    setQIdx(0);
    setItemsAnswered(0);
    resetQuestionUi(r.problems[0] ?? null);
  };

  const startAdaptive = async () => {
    const r = await post<AdaptiveDiagnosticStart>('/diagnostic/adaptive/start', {});
    setMode('adaptive');
    setSessionId(r.sessionId);
    setProblems([]);
    setMaxItems(r.maxItems);
    setQIdx(0);
    setItemsAnswered(0);
    resetQuestionUi(r.problem);
  };

  useEffect(() => {
    if (flagsQuery.isLoading) return;
    let cancelled = false;
    (async () => {
      try {
        if (adaptiveFlag) {
          try {
            await startAdaptive();
            return;
          } catch {
            // Pool/flag edge case — fall back to legacy 4-question flow.
          }
        }
        if (!cancelled) await startFixed();
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.response?.data?.error?.message ?? e?.response?.data?.message ?? t('onboarding.diag.startFailed'));
        }
      }
    })();
    return () => { cancelled = true; };
  }, [flagsQuery.isLoading, adaptiveFlag, t]);

  const activeProblem = mode === 'fixed' ? (problems[qIdx] ?? cur) : cur;
  const progressN = mode === 'adaptive' ? itemsAnswered + 1 : qIdx + 1;
  const progressTotal = mode === 'adaptive' ? maxItems : (problems.length || 4);
  const isLastFixedQuestion = mode === 'fixed' && qIdx + 1 >= problems.length;

  async function finishSession(id: string) {
    const path = mode === 'adaptive'
      ? `/diagnostic/adaptive/${id}/finish`
      : `/diagnostic/${id}/finish`;
    const r = await post<DiagnosticResult>(path, {});
    onComplete(r);
    onNext();
  }

  async function submitOrAdvance() {
    if (busy) return;
    if (!activeProblem || !choice || !sessionId) return;
    setBusy(true);
    try {
      const durationSec = Math.max(1, Math.min(600, Math.round((Date.now() - questionStartedAt.current) / 1000)));

      if (mode === 'adaptive') {
        const answer = await post<AdaptiveDiagnosticAnswer>('/diagnostic/adaptive/answer', {
          sessionId,
          problemId: activeProblem.id,
          choiceId: choice,
          confidence,
          durationSec,
        });
        setItemsAnswered(answer.itemsAnswered);
        if (answer.shouldFinish || !answer.nextProblem) {
          await finishSession(sessionId);
          return;
        }
        resetQuestionUi(answer.nextProblem);
        return;
      }

      await post('/diagnostic/answer', { sessionId, problemId: activeProblem.id, choiceId: choice, confidence });
      if (qIdx + 1 < problems.length) {
        const nextIdx = qIdx + 1;
        setQIdx(nextIdx);
        resetQuestionUi(problems[nextIdx] ?? null);
        return;
      }
      await finishSession(sessionId);
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? e?.response?.data?.message ?? t('onboarding.diag.answerFailed'));
    } finally {
      setBusy(false);
    }
  }

  const progressKey = mode === 'adaptive' ? 'onboarding.diag.adaptive.qProgress' : 'onboarding.diag.qProgress';
  const titleKey = mode === 'adaptive' ? 'onboarding.diag.adaptive.title' : 'onboarding.diag.title';
  const taglineKey = mode === 'adaptive' ? 'onboarding.diag.adaptive.tagline' : 'onboarding.diag.tagline';

  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} right={
        <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{t(progressKey, { n: progressN, total: progressTotal })}</span>
      } />
      <div className="screen-body" style={{ gap: 18 }}>
        <div>
          <span className="eyebrow">{t('onboarding.diag.eyebrow')}</span>
          <h2 className="title" style={{ marginTop: 10 }}>{t(titleKey)}</h2>
          <p className="subtitle">{t(taglineKey)}</p>
        </div>

        {err && (
          <div style={{ padding: 12, borderRadius: 10, background: 'var(--p-danger-tint)', color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>
        )}

        {!activeProblem && !err && (
          <div className="card" style={{ padding: 16, textAlign: 'center', color: 'var(--p-muted)' }}>{t('onboarding.diag.loadingQ')}</div>
        )}

        {activeProblem && (
          <>
            <div className="card" style={{ padding: 18, background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="chip" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em' }}>{t('onboarding.diag.concept')}</span>
                <span className="caption" style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>{activeProblem.difficulty}</span>
              </div>
              <div className="math-big" style={{ fontSize: 16, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: 'var(--p-ink)' }}>
                <MathText text={activeProblem.body} />
              </div>
              {activeProblem.step?.prompt && (
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--p-ink-2)' }}>
                  <MathText text={activeProblem.step.prompt} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(activeProblem.step?.choices ?? []).map((c, i) => {
                const sel = choice === c.id;
                const cls = sel ? 'choice selected' : 'choice';
                return (
                  <div key={c.id} className={cls} onClick={() => setChoice(c.id)}>
                    <div className="letter">{['A', 'B', 'C', 'D', 'E'][i] ?? c.choiceIndex}</div>
                    <span className="text"><MathText text={c.text} /></span>
                  </div>
                );
              })}
            </div>
            <div className="card" style={{ padding: 12, background: 'transparent', borderStyle: 'dashed' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="caption" style={{ fontSize: 12 }}>{t('onboarding.diag.confidence.q')}</span>
                <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{t('onboarding.diag.confidence.fmt', { n: confidence })}</span>
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
          </>
        )}
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button
          className="btn"
          onClick={submitOrAdvance}
          disabled={!activeProblem || !choice || busy}
          style={{ opacity: !activeProblem || !choice ? 0.45 : 1 }}
        >
          {busy ? t('onboarding.diag.saving') : isLastFixedQuestion ? t('onboarding.diag.viewResult') : t('onboarding.diag.submit')}
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
  const { t } = useT();
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
          <span className="eyebrow">{t('onboarding.results.eyebrow')}</span>
          <h2 className="title" style={{ marginTop: 10 }}>
            {t('onboarding.results.title.pre')}<em style={{ fontStyle: 'italic', color: 'var(--p-primary)', fontFamily: 'var(--font-display)' }}>{t('onboarding.results.title.em')}</em>{t('onboarding.results.title.post')}
          </h2>
          <p className="subtitle">{name ? t('onboarding.results.tagline', { name }) : t('onboarding.results.taglineNoName')}</p>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{t('onboarding.results.mastery')}</span>
            <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              {result ? t('onboarding.results.scoreFmt', { correct: result.correct, attempted: result.attempted }) : t('onboarding.results.noData')}
            </span>
          </div>
          {concepts.length === 0 ? (
            <div style={{ padding: '14px 0', textAlign: 'center', color: 'var(--p-muted)', fontSize: 13 }}>
              {t('onboarding.results.empty')}
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
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--p-ink)' }}>{t('onboarding.results.coach.title')}</div>
              <div style={{ fontSize: 13, color: 'var(--p-ink-2)', marginTop: 4, lineHeight: 1.45 }}>
                {focusConcept
                  ? <><strong>{focusConcept.conceptName}</strong>{t('onboarding.results.coach.body', { from: Math.round(focusConcept.score) })}</>
                  : <>{t('onboarding.results.coach.empty')}</>}
              </div>
              {/* Diagnostic result chips removed 2026-05-24 per user spec —
                  the conceptCode chip ("C7-CH01-INTEGERS") leaked internal
                  identifiers; the "맞춤형" tailored chip was decorative noise
                  the coach paragraph above already implies. */}
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        <button className="btn" onClick={onNext}>
          {t('onboarding.results.continue')}
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
  const { t } = useT();
  const toggle = (k: ConsentKey) => setConsents({ ...consents, [k]: !consents[k] });
  const items: Array<{ id: 'DATA_PROCESSING' | ConsentKey; req?: boolean; name: string; desc: string }> = [
    { id: 'DATA_PROCESSING', req: true, name: t('onboarding.consents.essential.name'), desc: t('onboarding.consents.essential.desc') },
    { id: 'ANALYTICS', name: t('onboarding.consents.analytics.name'), desc: t('onboarding.consents.analytics.desc') },
    { id: 'AI_TRAINING', name: t('onboarding.consents.aiTraining.name'), desc: t('onboarding.consents.aiTraining.desc') },
    { id: 'MARKETING', name: t('onboarding.consents.marketing.name'), desc: t('onboarding.consents.marketing.desc') },
  ];
  const isChecked = (id: 'DATA_PROCESSING' | ConsentKey) =>
    id === 'DATA_PROCESSING' ? true : consents[id];
  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 22 }}>
        <div>
          <span className="eyebrow">{t('onboarding.consents.eyebrow')}</span>
          <h2 className="title" style={{ marginTop: 10 }}>{t('onboarding.consents.title')}</h2>
          <p className="subtitle">{t('onboarding.consents.tagline')}</p>
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
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{t('onboarding.consents.notif.title')}</div>
              <span className="chip" style={{ padding: '2px 8px', fontSize: 10.5 }}>{t('onboarding.consents.notif.comingSoon')}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--p-muted)', marginTop: 2 }}>{t('onboarding.consents.notif.sub')}</div>
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
                  {it.req && <span className="req-pill">{t('onboarding.consents.required')}</span>}
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
          {t('onboarding.consents.cta')}
          <Glyph.ChevronR />
        </button>
        <p className="caption" style={{ textAlign: 'center', fontSize: 11.5 }}>
          {t('onboarding.consents.policy')}
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
  const { t } = useT();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  // Detect KR language client-side so the alert/error copy localizes even if
  // the country prop isn't threaded into this screen.
  const isKR = (typeof window !== 'undefined' && localStorage.getItem('mathema.lang') === 'ko');

  async function finalize() {
    if (busy) return;
    setErr(null);
    setBusy(true);
    try {
      // 토큰은 ScreenAuth(가입/Google/로그인) 단계에서 이미 확보되어 있어야 함.
      // DEV: 토큰 없으면 dev-login 으로 빠르게 진입 — production 빌드에선 이 분기 dead-code.
      if (!tokens.get()) {
        if (import.meta.env.DEV) {
          const tk = await post<{ accessToken: string; refreshToken: string }>('/auth/dev-login', {});
          tokens.set(tk.accessToken, tk.refreshToken);
        } else {
          // 인증 흐름이 끊겼다 — 가입 화면으로 보냄.
          window.location.assign('/register');
          return;
        }
      }
      // 프로필 반영 — name, gradeLevel, studyGoal 모두 백엔드 User row 에 저장.
      // P3 fix 2026-05-27: this PATCH used to be silent-catch. If it failed
      // (network blip, 429, 5xx), the user lined up at /app with
      // user.gradeLevel still null on the server, which made ProtectedRoute
      // bounce them right back to /onboarding — and finalize would re-run,
      // re-fail, re-bounce, forever. Now: surface the error visibly, abort
      // finalize so the user can hit the CTA again to retry. The
      // onboardingCompleted localStorage flag (set further down) is the
      // safety net that lets ProtectedRoute let them through if they later
      // hit the bouncing case anyway.
      await patch<Me>('/users/me', {
        name,
        gradeLevel: GRADE_MAP[grade],
        studyGoal: goal,
        role: role || 'STUDENT',
        pushRemindersEnabled: notif,
      });

      // 선택 동의 3종을 백엔드 Consent 테이블에 저장 (DPDP 이력). 이건 여전히
      // best-effort — consent 저장 실패는 사용자가 onboarding 진입을 막을 만큼
      // 치명적 X (재시도는 설정 페이지에서도 가능).
      const consentKinds: ConsentKey[] = ['ANALYTICS', 'AI_TRAINING', 'MARKETING'];
      for (const k of consentKinds) {
        try {
          if (consents[k]) await post(`/privacy/consents/${k.toLowerCase()}`, {});
        } catch { /* ignore — best effort */ }
      }
      // localStorage 에 onboarding 결과 저장 (백엔드 미저장 항목: goal, notif 토글).
      localStorage.setItem('mathema.onboarding', JSON.stringify({
        role, grade, goal, notif, completedAt: new Date().toISOString(),
      }));
      // Refresh AuthContext.user so ProtectedRoute sees gradeLevel filled.
      await refreshUser();
      onFinish();
    } catch (e: any) {
      const status = e?.response?.status;
      const rawMsg = e?.response?.data?.error?.message;
      // eslint-disable-next-line no-console
      console.error('[onboarding] finalize failed', { status, rawMsg, error: e });
      let friendly: string;
      if (status === 429) {
        friendly = isKR
          ? '잠시 후 다시 시도해주세요. (요청이 너무 많아 일시적으로 제한됐어요.)'
          : 'Please retry in a moment — too many requests just now.';
      } else if (!status) {
        friendly = isKR
          ? '서버에 연결할 수 없어요. 인터넷 연결을 확인하고 다시 시도해주세요.'
          : 'Cannot reach the server. Check your connection and try again.';
      } else {
        friendly = isKR
          ? '저장에 실패했어요. 다시 시도해주세요.'
          : 'Save failed. Please try again.';
      }
      setErr(friendly);
      // Do NOT call onFinish() on failure. User stays on this screen, sees
      // the red error banner, and the CTA flips back to enabled — one tap
      // retries the whole finalize() sequence (the PATCH is idempotent).
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <TopScaffold step={step} showBack={false} />
      <div className="screen-body" style={{ gap: 20, justifyContent: 'space-between' }}>
        <div style={{ marginTop: 12 }}>
          <span className="eyebrow">{t('onboarding.ready.eyebrow')}</span>
          <h1 className="display" style={{ marginTop: 10 }}>
            {t('onboarding.ready.title.line1')}<br />
            <em>{name || t('onboarding.ready.title.fallback')}</em>.
          </h1>
          <p className="subtitle" style={{ maxWidth: 320 }}>
            {t('onboarding.ready.tagline')}
          </p>
        </div>
        {/* Lesson preview card removed 2026-05-24 per user spec — the
            previous block hard-coded "LESSON 01 · 12학년 적분 / 역도함수로서의
            적분 / 약 12분 · 도입 → 풀이 예시 → 회상 연습" regardless of the
            student's actual grade or curriculum, so a Class 7 KR student
            saw Class 12 NCERT calculus on signup completion. Stats grid
            below still shows real grade + chapter count, so the screen
            doesn't feel empty. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {/* Onboarding-ready stats. Each is a verifiable fact rather than a
              promise of pace — earlier copy said "5 lessons/week" and "25m
              daily target" which were placeholders the app never enforced. */}
          {[
            { k: grade ? grade.replace('CLASS_', '') : '—', v: t('onboarding.ready.stats.grade') },
            { k: grade ? String(chapterCountByClass(grade)) : '—', v: t('onboarding.ready.stats.chapters') },
            { k: '∞', v: t('onboarding.ready.stats.problems') },
          ].map((s) => (
            <div key={s.v} className="card" style={{ padding: 12, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--p-ink)', fontStyle: 'italic' }}>{s.k}</div>
              <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="screen-foot">
        {/* Error banner above CTA — P3 fix 2026-05-27. Previously a failed
            PATCH /users/me was silently swallowed and the user got bounced
            to /app → /onboarding forever. Now they see what went wrong and
            the same CTA retries. */}
        {err && (
          <div
            role="alert"
            style={{
              background: 'var(--p-danger-tint)',
              color: 'var(--p-danger)',
              border: '1px solid var(--p-danger)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 14.5,
              lineHeight: 1.45,
              marginBottom: 8,
            }}
          >
            {err}
          </div>
        )}
        <button className="btn" onClick={finalize} disabled={busy}>
          {busy ? t('onboarding.ready.cta.busy') : (err ? (isKR ? '다시 시도' : 'Retry') : t('onboarding.ready.cta.start'))}
          <Glyph.ChevronR />
        </button>
        <button className="btn text" onClick={finalize} disabled={busy}>
          {t('onboarding.ready.cta.dashboard')}
        </button>
      </div>
    </div>
  );
}
