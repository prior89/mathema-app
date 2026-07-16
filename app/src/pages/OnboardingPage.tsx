/* OnboardingPage — Matheo 9-screen onboarding flow.
 * Ported from `App onboarding/screens-a.jsx` + `screens-b.jsx`.
 * Phone Auth option hidden (no backend); Goal stored in localStorage; Diagnostic state in-memory.
 */
import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Camera, Lightbulb, Route, Sparkles } from 'lucide-react';
import { post, patch, tokens } from '../lib/api';
import { Glyph } from '../components/onboarding/Glyph';
import MathText from '../components/MathText';
import { BrandLockup } from '../components/Brand';
import { LearningOrbit } from '../components/design/LearningOrbit';
import {
  type AdaptiveDiagnosticAnswer,
  type AdaptiveDiagnosticStart,
  type DiagnosticProblem,
  type DiagnosticResult,
  type Me,
  type UserRole,
  fetchGuardianConsentStatus,
  requestGuardianConsent,
} from '../lib/queries';
import { useAuth } from '../context/AuthContext';
import { useFeatureFlag, useFeatureFlags } from '../hooks/useFeatureFlags';
import { homePathForRole } from '../lib/role-routes';
import { useT } from '../lib/i18n';
import { isLikelyEmail } from '../lib/email';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { PreAuthAgeGate, usePreAuthAgeGate } from '../components/auth/PreAuthAgeGate';
import { AuthDivider } from '../components/auth/AuthDivider';
import { formatAuthError } from '../lib/auth-errors';
import { googleSignInErrorKey } from '../lib/google-sign-in-error';
import { canOfferGoogleSignIn } from '../lib/pre-auth-age-gate';
import {
  ageFromBirthDate,
  birthDateFromAge,
  requiresGuardianConsentFromAge,
} from '../lib/guardian-consent';
import { postAuthPath } from '../lib/post-auth-path';
import { LAUNCH_STUDENT_ONLY } from '../lib/launch-config';
import { detectOnboardingLang, langForCountry } from '../lib/onboarding-locale';
import { AgeGate } from '../components/onboarding/AgeGate';
import '../styles/onboarding.css';

type StepKey = 'welcome' | 'country' | 'auth' | 'profile' | 'guardian' | 'goal' | 'diagnostic' | 'results' | 'consents' | 'ready';
type GradeId = 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10' | 'CLASS_11' | 'CLASS_12';
type GoalId = 'BOARD' | 'JEE' | 'SCHOOL' | 'CATCHUP';
type ConsentKey = 'ANALYTICS' | 'AI_TRAINING' | 'MARKETING';
type ConsentMap = Record<ConsentKey, boolean>;
// Country chip — active markets are IN + KR + AE. Others stay in the type so a
// later launch can flip them on without a code change; inactive entries are
// filtered out of the chip list until then.
type CountryId = 'IN' | 'KR' | 'US' | 'UK' | 'AU' | 'SG' | 'AE' | 'ID';

const STEP_FLOW: StepKey[] = LAUNCH_STUDENT_ONLY
  // KR is the only live launch market. A one-option country screen added a
  // decision-shaped tap without giving the student a real decision.
  ? ['welcome', 'auth', 'profile', 'goal', 'diagnostic', 'results', 'consents', 'ready']
  : ['welcome', 'country', 'auth', 'profile', 'goal', 'diagnostic', 'results', 'consents', 'ready'];

// CLASS_X (UI) → GradeLevel (backend enum)
const GRADE_MAP: Record<GradeId, string> = {
  CLASS_7: 'CLASS_7', CLASS_8: 'CLASS_8', CLASS_9: 'CLASS_9',
  CLASS_10: 'CLASS_10', CLASS_11: 'CLASS_11', CLASS_12: 'CLASS_12',
};

/** Curriculum facts used by the Ready screen. Keep these counts aligned with
 *  seed-korean-curriculum.ts and seed-concepts.ts. */
const NCERT_CHAPTERS_PER_CLASS: Record<GradeId, number> = {
  CLASS_7: 13, CLASS_8: 13, CLASS_9: 12,
  CLASS_10: 14, CLASS_11: 14, CLASS_12: 13,
};
const KR_CHAPTERS_PER_CLASS: Record<GradeId, number> = {
  CLASS_7: 8, CLASS_8: 7, CLASS_9: 6,
  CLASS_10: 7, CLASS_11: 9, CLASS_12: 6,
};
const KR_GRADE_LABEL: Record<GradeId, string> = {
  CLASS_7: '중1', CLASS_8: '중2', CLASS_9: '중3',
  CLASS_10: '고1', CLASS_11: '고2', CLASS_12: '고3',
};
function chapterCountByClass(grade: GradeId, country: CountryId): number {
  return (country === 'KR' ? KR_CHAPTERS_PER_CLASS : NCERT_CHAPTERS_PER_CLASS)[grade] ?? 0;
}
function gradeLabel(grade: GradeId, country: CountryId): string {
  return country === 'KR' ? KR_GRADE_LABEL[grade] : grade.replace('CLASS_', '');
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
    <div className="mathema-app onboarding-shell">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <Flow onFinish={(r, target) => navigate(target ?? homePathForRole(r ?? user?.role), { replace: true })} />
        </div>
      </div>
    </div>
  );
}

function Flow({ onFinish }: { onFinish: (role?: UserRole, target?: string) => void }) {
  const { user, refreshUser, startGuest } = useAuth();
  const { setLang } = useT();
  const [step, setStep] = useState<StepKey>('welcome');
  // Try-first guest session (feature-flagged). Guests skip every PII screen:
  // no name, no AgeGate (zero PII → guardian gate inapplicable), no optional
  // consents. They re-enter the standard funnel at account upgrade.
  const [guest, setGuest] = useState(false);

  // KR-only launch skips the country step, so pre-auth screens must not fall
  // back to the device locale (an EN welcome for a Korean student). Post-login
  // <I18nCountrySync /> still handles the country-aware flip for other markets.
  useEffect(() => {
    setLang(LAUNCH_STUDENT_ONLY ? 'ko' : detectOnboardingLang(), { reload: false });
  }, [setLang]);
  // Empty initial — placeholder/label comes from the input's placeholder
  // attribute. Pre-filling a fake Indian name leaked into KR signups and
  // confused users who didn't immediately overwrite it.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<GradeId | ''>('CLASS_7');
  const [age, setAge] = useState<number | ''>('');
  const [parentEmail, setParentEmail] = useState('');
  const [goal, setGoal] = useState<GoalId | ''>('BOARD');
  // Country defaults to KR — the only live market at the KR-first launch, so
  // 'goal'/'diagnostic' work even if the user skips the country step. Picking a
  // country also calls i18n setLang immediately (KR → 'ko').
  const [country, setCountry] = useState<CountryId>('KR');
  // Optional processing and reminders are opt-in. This also matches the
  // published policy that teen analytics/marketing start OFF.
  const [consents, setConsents] = useState<ConsentMap>({ ANALYTICS: false, AI_TRAINING: false, MARKETING: false });
  const [notif, setNotif] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const needsGuardian = useCallback(
    (a: number | '') => typeof a === 'number' && requiresGuardianConsentFromAge(a, country),
    [country],
  );

  useEffect(() => {
    if (needsGuardian(age)) {
      setConsents({ ANALYTICS: false, AI_TRAINING: false, MARKETING: false });
      setNotif(false);
    }
  }, [age, country, needsGuardian]);

  const idx = STEP_FLOW.indexOf(step);
  const stepIndex = Math.max(0, idx - 1); // skip welcome from indicator
  const go = (key: StepKey) => setStep(key);
  const next = () => go(STEP_FLOW[Math.min(STEP_FLOW.length - 1, idx + 1)]);
  const back = () => go(STEP_FLOW[Math.max(0, idx - 1)]);
  const syncProfileThenDiagnostic = async () => {
    if (!grade || !goal || (!guest && age === '')) throw new Error('missing onboarding profile');
    // birthDate is saved when leaving Profile (before guardian). Re-sending it
    // here hits birth_date_immutable for minors who already passed guardian.
    await patch<Me>('/users/me', {
      ...(guest ? {} : { name }),
      gradeLevel: GRADE_MAP[grade],
      studyGoal: goal,
    });
    await refreshUser().catch(() => {});
    next();
  };

  const saveProfileThenAdvance = async () => {
    if (guest) {
      // Guest profile = class pick only. No name/birthDate (zero-PII), so the
      // guardian gate cannot apply.
      if (!grade) return;
      await patch<Me>('/users/me', { gradeLevel: GRADE_MAP[grade] });
      await refreshUser().catch(() => {});
      next();
      return;
    }
    if (!name || !grade || age === '') return;
    await patch<Me>('/users/me', {
      name,
      gradeLevel: GRADE_MAP[grade],
      // Existing Google users may already have a verified guardian flow. Do
      // not re-submit an immutable birth date when resuming onboarding.
      ...(!user?.birthDate ? { birthDate: birthDateFromAge(age) } : {}),
    });
    await refreshUser().catch(() => {});
    if (needsGuardian(age)) go('guardian');
    else next();
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
          onAuthenticated={(me) => {
            const target = postAuthPath(me);
            if (target !== '/onboarding') {
              onFinish(me.role ?? 'STUDENT', target);
              return;
            }
            if (me.name) setName(me.name);
            if (me.gradeLevel && me.gradeLevel in GRADE_MAP) setGrade(me.gradeLevel as GradeId);
            if (me.birthDate) setAge(ageFromBirthDate(me.birthDate));
            next();
          }}
          onGuest={async () => {
            await startGuest({ country });
            setGuest(true);
            next();
          }}
        />
      );
    case 'profile':
      return (
        <ScreenProfile
          step={stepIndex} onBack={back}
          onNext={saveProfileThenAdvance}
          name={name} setName={setName}
          grade={grade} setGrade={setGrade}
          age={age} setAge={setAge}
          country={country}
          guest={guest}
        />
      );
    case 'guardian':
      return (
        <ScreenGuardian
          step={stepIndex}
          onBack={() => go('profile')}
          onNext={() => go('goal')}
          age={age}
          country={country}
          parentEmail={parentEmail} setParentEmail={setParentEmail}
          refreshUser={refreshUser}
        />
      );
    case 'goal':
      return (
        <ScreenGoal
          step={stepIndex}
          onBack={() => {
            if (needsGuardian(age)) go('guardian');
            else back();
          }}
          onNext={syncProfileThenDiagnostic}
          goal={goal}
          setGoal={setGoal}
        />
      );
    case 'diagnostic':
      return <ScreenDiagnostic step={stepIndex} onBack={back} onNext={next} onComplete={setDiagnosticResult} />;
    case 'results':
      // Guests granted no optional consents and must not self-grant any —
      // skip the consents screen entirely.
      return (
        <ScreenResults
          step={stepIndex} onBack={back}
          onNext={() => (guest || needsGuardian(age) ? go('ready') : next())}
          name={name} result={diagnosticResult}
        />
      );
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
          grade={grade || 'CLASS_11'}
          goal={goal || 'BOARD'}
          country={country}
          consents={consents}
          notif={notif}
          guest={guest}
          minor={needsGuardian(age)}
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
    <div className="screen welcome-screen">
      <header className="welcome-brand-row">
        <BrandLockup />
        <span className="age-pill">{t('onboarding.classLabel')}</span>
      </header>
      <div className="welcome-layout">
        <section className="welcome-copy">
          <span className="story-kicker"><Sparkles size={15} />{t('onboarding.welcome.eyebrow')}</span>
          <h1 className="display">
            {t('onboarding.welcome.title.line1')}<br />{t('onboarding.welcome.title.line2')} <em>{t('onboarding.welcome.title.em')}</em>{t('onboarding.welcome.title.line3')}<br />{t('onboarding.welcome.title.line4')}
          </h1>
          <p className="subtitle">{t('onboarding.welcome.tagline')}</p>
          <div className="welcome-benefits">
            <span><Camera size={18} /><b>{t('onboarding.welcome.benefit.photo.title')}</b><small>{t('onboarding.welcome.benefit.photo.sub')}</small></span>
            <span><Route size={18} /><b>{t('onboarding.welcome.benefit.path.title')}</b><small>{t('onboarding.welcome.benefit.path.sub')}</small></span>
            <span><Lightbulb size={18} /><b>{t('onboarding.welcome.benefit.coach.title')}</b><small>{t('onboarding.welcome.benefit.coach.sub')}</small></span>
          </div>
          <div className="welcome-actions">
            <button className="btn" onClick={onNext}>
              {t('onboarding.welcome.cta.start')}<ArrowRight size={18} />
            </button>
            <button className="btn text" onClick={onSignIn}>{t('onboarding.welcome.cta.signin')}</button>
          </div>
        </section>
        <section className="welcome-visual" aria-hidden="true">
          <div className="welcome-visual-label">{t('onboarding.welcome.visual.label')}</div>
          <LearningOrbit variant="teal" />
          <div className="welcome-loop">
            <span>{t('onboarding.welcome.loop.one')}</span><i />
            <span>{t('onboarding.welcome.loop.two')}</span><i />
            <span>{t('onboarding.welcome.loop.three')}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─────────── 01b Country — picks curriculum + locale, drives every step after ───────────
function ScreenCountry({
  step, onBack, onNext, country, setCountry,
}: { step: number; onBack: () => void; onNext: () => void; country: CountryId; setCountry: (c: CountryId) => void }) {
  const { t, setLang } = useT();
  // Active markets = IN + KR + AE. Inactive entries (US/UK/AU/SG/ID) stay in the
  // list so a later launch is one `active` flip away, but they are filtered out
  // of the render below — users only see live markets, no "Coming soon" chips.
  const COUNTRY_OPTIONS: Array<{ id: CountryId; flag: string; name: string; sub: string; active: boolean }> = [
    // KR-first launch: KR is the only live market. IN + AE are parked (they
    // share the NCERT content bank, which is not seeded yet) — keep them here
    // so a later launch is one `active` flip away. Must stay in sync with the
    // backend COUNTRY_CONFIG.status gate in country.enum.ts.
    { id: 'KR', flag: '🇰🇷', name: '대한민국',       sub: '2022 개정 교육과정 · 수능', active: true  },
    { id: 'IN', flag: '🇮🇳', name: 'India',         sub: 'NCERT / CBSE / JEE',     active: false },
    { id: 'AE', flag: '🇦🇪', name: 'United Arab Emirates', sub: 'CBSE / NCERT',    active: false },
    { id: 'US', flag: '🇺🇸', name: 'United States', sub: 'Common Core / SAT',      active: false },
    { id: 'UK', flag: '🇬🇧', name: 'United Kingdom', sub: 'GCSE / A-Level',         active: false },
    { id: 'AU', flag: '🇦🇺', name: 'Australia',     sub: 'ACARA',                  active: false },
    { id: 'SG', flag: '🇸🇬', name: 'Singapore',     sub: 'MOE',                    active: false },
    { id: 'ID', flag: '🇮🇩', name: 'Indonesia',     sub: 'Merdeka',                active: false },
  ];
  const COUNTRIES = COUNTRY_OPTIONS.filter((c) => c.active);
  const pick = (c: CountryId) => {
    setCountry(c);
    // BUG FIX 2026-05-27: flip i18n WITHOUT triggering a page reload. Earlier
    // this was a plain setLang() which reloads in 50ms — fine for in-app
    // language switching but catastrophic mid-onboarding (useState state
    // resets to initial and the user lands back at welcome). The opts.reload
    // escape hatch keeps the language change visible (so the remaining
    // onboarding screens render in KR / EN) without nuking React state.
    setLang(langForCountry(c), { reload: false });
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
                  <span className="chip" style={{ padding: '2px 8px', fontSize: 10.5 }}>{t('common.comingSoon')}</span>
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
  step, onBack, onNext, name, email, setEmail, password, setPassword, country, onAuthenticated, onGuest,
}: {
  step: number; onBack: () => void; onNext: () => void;
  name: string;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  country: CountryId;
  onAuthenticated: (me: Me) => void;
  onGuest?: () => Promise<void>;
}) {
  const { t } = useT();
  const { refreshUser, loginWithGoogle } = useAuth();
  const guestModeEnabled = useFeatureFlag('guest_mode');
  const { ageBand, selectAgeBand, resetAgeBand } = usePreAuthAgeGate();
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [guestBusy, setGuestBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function continueAsGuest() {
    if (busy || googleBusy || guestBusy || !onGuest) return;
    setErr(null);
    setGuestBusy(true);
    try {
      await onGuest();
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
        setErr(e?.response?.data?.error?.message ?? t('onboarding.auth.guest.failed'));
      }
    } finally { setGuestBusy(false); }
  }

  async function continueWithEmail() {
    if (busy || googleBusy || guestBusy) return;
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

  const handleGoogleSignIn = async (idToken: string) => {
    setErr(null);
    setGoogleBusy(true);
    try {
      const me = await loginWithGoogle(idToken, { skipNavigate: true });
      onAuthenticated(me);
    } catch (e: unknown) {
      setErr(formatAuthError(e, {
        context: 'onboarding',
        locale: country === 'KR' ? 'ko' : 'en',
      }));
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 20 }}>
        <div>
          <span className="eyebrow">{t('onboarding.auth.eyebrow')}</span>
          <h2 className="title" style={{ marginTop: 10 }}>{t('onboarding.auth.title')}</h2>
          <p className="subtitle">{t('onboarding.auth.tagline')}</p>
        </div>

        <PreAuthAgeGate
          ageBand={ageBand}
          onSelect={selectAgeBand}
          onReset={resetAgeBand}
        />

        <div className="field">
          <label>{t('onboarding.auth.email')}</label>
          <input
            type="email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={t('onboarding.auth.emailPlaceholder')}
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

        <button className="btn" onClick={continueWithEmail} disabled={busy || googleBusy || guestBusy}>
          <Glyph.Mail />
          <span>{busy ? t('onboarding.auth.busy') : t('onboarding.auth.emailCta')}</span>
          <Glyph.ChevronR />
        </button>

        {canOfferGoogleSignIn(ageBand) && (
          <>
            <AuthDivider labelKey="onboarding.auth.or" />
            <GoogleSignInButton
              mode="signup"
              onCredential={handleGoogleSignIn}
              onError={(error) => {
                const key = googleSignInErrorKey(error, 'onboarding.auth.google.failed');
                if (key) setErr(t(key));
              }}
              busy={googleBusy}
              disabled={busy || guestBusy}
            />
          </>
        )}

        {guestModeEnabled && onGuest && (
          <button
            className="btn ghost"
            onClick={continueAsGuest}
            disabled={busy || googleBusy || guestBusy}
            style={{ opacity: guestBusy ? 0.6 : 1 }}
          >
            <span>{guestBusy ? t('onboarding.auth.busy') : t('onboarding.auth.guestCta')}</span>
            <Glyph.ChevronR />
          </button>
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

// ─────────── 03 Profile (name + class) ───────────
function ScreenProfile({
  step, onBack, onNext, name, setName, grade, setGrade, age, setAge, country, guest = false,
}: {
  step: number; onBack: () => void; onNext: () => void | Promise<void>;
  name: string; setName: (n: string) => void;
  grade: GradeId | ''; setGrade: (g: GradeId) => void;
  age: number | ''; setAge: (v: number) => void;
  country: CountryId;
  /** Guest sessions collect zero PII — class pick only (no name, no AgeGate). */
  guest?: boolean;
}) {
  const { t } = useT();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const continueProfile = async () => {
    if (busy) return;
    setErr(null);
    setBusy(true);
    try {
      await onNext();
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? t('onboarding.diag.saving'));
    } finally {
      setBusy(false);
    }
  };
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
        {!guest && (
          <div className="field">
            <label>{t('onboarding.profile.nameLabel')}</label>
            <input placeholder={t('onboarding.profile.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="field">
          <label>{t('onboarding.profile.classQ')}</label>
          <div className="grade-grid">
            {grades.map((g) => (
              <div
                key={g.id}
                className={`grade-pill ${grade === g.id ? 'selected' : ''}`}
                role="radio"
                aria-checked={grade === g.id}
                tabIndex={0}
                onClick={() => setGrade(g.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setGrade(g.id); } }}
              >
                <span className="num">{g.num}</span>
                <span className="lbl">{g.lbl}</span>
              </div>
            ))}
          </div>
        </div>
        {!guest && <AgeGate age={age} onChange={setAge} country={country} />}
        <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--p-surface-2)', borderColor: 'transparent' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--p-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--p-primary-fg)' }}>
            <Glyph.Sparkle accent="var(--p-primary-fg)" size={14} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-ink)' }}>{t('onboarding.profile.callout.title')}</div>
            <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 2 }}>
              {t('onboarding.profile.callout.body')}
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        {err && (
          <div role="alert" style={{ color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>
        )}
      </div>
      <div className="screen-foot">
        <button
          className="btn"
          onClick={continueProfile}
          disabled={busy || !grade || (!guest && (!name || age === ''))}
          style={{ opacity: grade && (guest || (name && age !== '')) && !busy ? 1 : 0.45 }}
        >
          {busy ? t('onboarding.diag.saving') : t('onboarding.profile.continue')}
          <Glyph.ChevronR />
        </button>
      </div>
    </div>
  );
}

// ─────────── 04b Guardian (minor students) ───────────
function ScreenGuardian({
  step, onBack, onNext, age, country,
  parentEmail, setParentEmail,
  refreshUser,
}: {
  step: number; onBack: () => void; onNext: () => void;
  age: number | '';
  country: CountryId;
  parentEmail: string; setParentEmail: (v: string) => void;
  refreshUser: () => Promise<void>;
}) {
  const { t } = useT();
  const guardianSubKey = country === 'KR' ? 'reg.step3.guardian.sub.kr' : 'reg.step3.guardian.sub';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [poll, setPoll] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!poll) return;
    const id = window.setInterval(async () => {
      try {
        const st = await fetchGuardianConsentStatus();
        if (st.verified) {
          window.clearInterval(id);
          await refreshUser();
          onNext();
        }
      } catch { /* ignore */ }
    }, 10_000);
    return () => window.clearInterval(id);
  }, [poll, onNext, refreshUser]);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  // Surface a "taking too long?" helper ~45s into waiting so a parent whose
  // email bounced or was spam-filtered doesn't strand the student on an
  // otherwise-infinite poll (research: parents click on mobile, mail can drop).
  useEffect(() => {
    if (!waiting) { setShowHelp(false); return; }
    const id = window.setTimeout(() => setShowHelp(true), 45_000);
    return () => window.clearTimeout(id);
  }, [waiting]);

  const resend = async () => {
    if (cooldown > 0 || busy || !parentEmail.trim()) return;
    setErr(null);
    setBusy(true);
    try {
      await requestGuardianConsent({ parentEmail: parentEmail.trim() });
      setCooldown(30);
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? t('guardianConsent.failed'));
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!parentEmail.trim() || typeof age !== 'number') return;
    setErr(null);
    setBusy(true);
    try {
      // birthDate already saved on Profile continue — only send parent email here.
      await requestGuardianConsent({
        parentEmail: parentEmail.trim(),
      });
      await refreshUser();
      setWaiting(true);
      setPoll(true);
      const st = await fetchGuardianConsentStatus();
      if (st.verified) onNext();
    } catch (e: any) {
      const code = e?.response?.data?.error?.code;
      if (code === 'parent_email_same_as_student') {
        setErr(t('guardianConsent.parentEmailSameAsStudent'));
      } else {
        setErr(e?.response?.data?.error?.message ?? t('guardianConsent.failed'));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <TopScaffold step={step} onBack={onBack} />
      <div className="screen-body" style={{ gap: 22 }}>
        <div>
          <span className="eyebrow">{t('reg.step3.guardian.eyebrow')}</span>
          <h2 className="title" style={{ marginTop: 10 }}>
            {waiting ? t('guardianConsent.waiting.title') : t('reg.step3.guardian.title')}
          </h2>
          <p className="subtitle">{t(guardianSubKey)}</p>
        </div>
        {waiting ? (
          <>
            <div className="alert success">
              {t('guardianConsent.sent', { email: parentEmail })}
            </div>
            {showHelp && (
              <span className="caption" style={{ color: 'var(--p-ink-2)' }}>
                {t('guardianConsent.waiting.help')}
              </span>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <button className="btn ghost" onClick={resend} disabled={busy || cooldown > 0}>
                {cooldown > 0
                  ? t('guardianConsent.resendIn', { n: cooldown })
                  : t('guardianConsent.resend')}
              </button>
              <button
                type="button"
                onClick={() => { setWaiting(false); setPoll(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--p-muted)', fontSize: 13, cursor: 'pointer', padding: '6px' }}
              >
                {t('guardianConsent.changeEmail')}
              </button>
            </div>
          </>
        ) : (
          <div className="field">
            <label>{t('guardianConsent.parentEmail')}</label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder={t('ageGate.parentEmail.placeholder')}
              required
            />
            <span className="caption" style={{ marginTop: 6 }}>{t('ageGate.parentEmail.hint')}</span>
          </div>
        )}
        {err && <div style={{ color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>}
        <div style={{ flex: 1 }} />
      </div>
      <div className="screen-foot">
        {!waiting && (
          <button className="btn" onClick={submit} disabled={busy || !isLikelyEmail(parentEmail)}>
            {busy ? t('guardianConsent.sending') : t('reg.finish.minor')}
            <Glyph.ChevronR />
          </button>
        )}
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
              <div
                key={g.id}
                className={`option-card ${selected ? 'selected' : ''}`}
                role="radio"
                aria-checked={selected}
                tabIndex={0}
                onClick={() => setGoal(g.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setGoal(g.id); } }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--p-ink)' }}>{g.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--p-muted)', marginTop: 2 }}>{g.sub}</div>
                </div>
                <div className="check">
                  {selected && <Glyph.Check accent="var(--p-primary-fg)" size={13} />}
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

function moveDiagnosticRadio(
  event: KeyboardEvent<HTMLButtonElement>,
  count: number,
  currentIndex: number,
  selectIndex: (index: number) => void,
) {
  if (count === 0) return;
  let nextIndex: number | null = null;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % count;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + count) % count;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = count - 1;
  if (nextIndex === null) return;

  event.preventDefault();
  selectIndex(nextIndex);
  const radios = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
  radios?.[nextIndex]?.focus();
}

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
  const answerChoices = activeProblem?.step?.choices ?? [];
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
            <div role="radiogroup" aria-label={t('onboarding.diag.title')} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {answerChoices.map((c, i) => {
                const sel = choice === c.id;
                const cls = sel ? 'choice selected' : 'choice';
                return (
                  <button
                    type="button"
                    key={c.id}
                    className={cls}
                    role="radio"
                    aria-checked={sel}
                    tabIndex={sel || (choice === null && i === 0) ? 0 : -1}
                    onClick={() => setChoice(c.id)}
                    onKeyDown={(event) => moveDiagnosticRadio(event, answerChoices.length, i, (next) => setChoice(answerChoices[next].id))}
                  >
                    <div className="letter">{['A', 'B', 'C', 'D', 'E'][i] ?? c.choiceIndex}</div>
                    <span className="text"><MathText text={c.text} /></span>
                  </button>
                );
              })}
            </div>
            <div className="card" style={{ padding: 12, background: 'transparent', borderStyle: 'dashed' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="caption" style={{ fontSize: 12 }}>{t('onboarding.diag.confidence.q')}</span>
                <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{t('onboarding.diag.confidence.fmt', { n: confidence })}</span>
              </div>
              <div role="radiogroup" aria-label={t('onboarding.diag.confidence.q')} style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4].map((n) => (
                  <button
                    type="button"
                    key={n}
                    role="radio"
                    aria-checked={n === confidence}
                    aria-label={t('onboarding.diag.confidence.fmt', { n })}
                    tabIndex={n === confidence ? 0 : -1}
                    onClick={() => setConfidence(n)}
                    onKeyDown={(event) => moveDiagnosticRadio(event, 4, n - 1, (next) => setConfidence(next + 1))}
                    style={{
                      flex: 1, height: 36, padding: 0, border: 0,
                      background: 'transparent', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <span aria-hidden="true" style={{
                      width: '100%', height: 8, borderRadius: 4,
                      background: n <= confidence ? 'var(--p-primary)' : 'var(--p-border)',
                      transition: 'background .12s',
                    }} />
                  </button>
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
  const { t, lang } = useT();
  const localizedConceptName = (m: { conceptName: string; conceptNameKo?: string | null }) =>
    lang === 'ko' && m.conceptNameKo ? m.conceptNameKo : m.conceptName;
  // 실 mastery 결과 → UI shape 으로 매핑 (없으면 빈 안내).
  const concepts: Array<{ name: string; value: number; tag: 'Focus' | 'Steady' | 'Strong' }> =
    (result?.masteries ?? []).slice(0, 5).map((m) => ({
      name: localizedConceptName(m),
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
              <span className="value">{c.value}%</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ background: 'var(--p-primary-tint)', borderColor: 'transparent', padding: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--p-primary)', color: 'var(--p-primary-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Glyph.Sparkle accent="var(--p-primary-fg)" size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--p-ink)' }}>{t('onboarding.results.coach.title')}</div>
              <div style={{ fontSize: 13, color: 'var(--p-ink-2)', marginTop: 4, lineHeight: 1.45 }}>
                {focusConcept
                  ? <><strong>{localizedConceptName(focusConcept)}</strong>{t('onboarding.results.coach.body', { from: Math.round(focusConcept.score) })}</>
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
        <div
          className="card"
          style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setNotif(!notif)}
          role="switch"
          aria-checked={notif}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setNotif(!notif);
            }
          }}
        >
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--p-accent-tint)', color: 'var(--p-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 22, height: 22 }}><Glyph.Bell accent="currentColor" /></div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{t('onboarding.consents.notif.title')}</div>
            <div style={{ fontSize: 12.5, color: 'var(--p-muted)', marginTop: 2 }}>{t('onboarding.consents.notif.sub')}</div>
          </div>
          <div className={`toggle ${notif ? 'on' : ''}`} aria-hidden="true" />
        </div>
        <div className="card" style={{ padding: '4px 16px' }}>
          {items.map((it) => (
            <div key={it.id} className="consent-row">
              <div
                className={`ck ${isChecked(it.id) ? 'checked' : ''}`}
                onClick={() => !it.req && toggle(it.id as ConsentKey)}
                style={{ opacity: it.req ? 0.85 : 1, cursor: it.req ? 'default' : 'pointer' }}
                role="checkbox"
                aria-checked={isChecked(it.id)}
                aria-disabled={it.req || undefined}
                tabIndex={it.req ? -1 : 0}
                onKeyDown={(e) => {
                  if (!it.req && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    toggle(it.id as ConsentKey);
                  }
                }}
              >
                {isChecked(it.id) && <Glyph.Check accent="var(--p-primary-fg)" size={12} />}
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
  step, name, grade, goal, country, consents, notif, guest = false, minor = false, onFinish,
}: {
  step: number; name: string; grade: GradeId; goal: GoalId;
  country: CountryId; consents: ConsentMap; notif: boolean; guest?: boolean; minor?: boolean;
  onFinish: (role?: UserRole, target?: string) => void;
}) {
  const { t } = useT();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { refreshUser, user } = useAuth();

  // Use the selected market directly; localStorage language can be missing or
  // intentionally overridden and must not choose the wrong recovery copy.
  const isKR = country === 'KR';

  async function finalize(destination: 'learn' | 'home' = 'home') {
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
      const resolvedRole = user?.role ?? 'STUDENT';
      await patch<Me>('/users/me', {
        // Guests keep the server-side 'Guest' placeholder name (zero-PII).
        ...(guest ? {} : { name }),
        pushRemindersEnabled: notif,
        ...(resolvedRole === 'STUDENT'
          ? { gradeLevel: GRADE_MAP[grade], studyGoal: goal }
          : {}),
      });

      // 선택 동의 3종을 백엔드 Consent 테이블에 저장 (DPDP 이력). 이건 여전히
      // best-effort — consent 저장 실패는 사용자가 onboarding 진입을 막을 만큼
      // 치명적 X (재시도는 설정 페이지에서도 가능). Guests skip the consents
      // screen entirely and must not self-grant optional consents.
      if (!guest && !minor) {
        const consentKinds: ConsentKey[] = ['ANALYTICS', 'AI_TRAINING', 'MARKETING'];
        for (const k of consentKinds) {
          try {
            if (consents[k]) await post(`/privacy/consents/${k.toLowerCase()}`, {});
          } catch { /* ignore — best effort */ }
        }
      }
      // localStorage 에 onboarding 결과 저장 (백엔드 미저장 항목: goal, notif 토글).
      localStorage.setItem('mathema.onboarding', JSON.stringify({
        userId: user?.id,
        role: resolvedRole, grade, goal, notif, completedAt: new Date().toISOString(),
      }));
      // Refresh AuthContext.user so ProtectedRoute sees gradeLevel filled.
      await refreshUser();
      onFinish(resolvedRole, destination === 'learn' && resolvedRole === 'STUDENT' ? '/app/learn' : undefined);
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
            { k: grade ? gradeLabel(grade, country) : '—', v: t('onboarding.ready.stats.grade') },
            { k: grade ? String(chapterCountByClass(grade, country)) : '—', v: t('onboarding.ready.stats.chapters') },
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
        <button className="btn" onClick={() => finalize('learn')} disabled={busy}>
          {busy ? t('onboarding.ready.cta.busy') : (err ? (isKR ? '다시 시도' : 'Retry') : t('onboarding.ready.cta.start'))}
          <Glyph.ChevronR />
        </button>
        <button className="btn text" onClick={() => finalize('home')} disabled={busy}>
          {t('onboarding.ready.cta.dashboard')}
        </button>
      </div>
    </div>
  );
}
