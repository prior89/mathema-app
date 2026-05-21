/**
 * RegisterPage — Matheo 폰-프레임 3단계 회원가입.
 *
 *   명세서 §1 — 역할별 분기 (STUDENT / PARENT / TEACHER).
 *
 *   단계 구성:
 *     0 · 역할 + 기본 정보 (역할 카드 + email/password/name + Google Sign-In)
 *     1 · 프로필
 *          - STUDENT: NCERT 학년 6개 (Class 7~12) + 시험 날짜 + 목표 등급
 *          - PARENT : 자녀 이메일
 *          - TEACHER: 학원 코드 (선택)
 *     2 · 동의 (DPDP 2023 · GDPR — 필수/분석/AI훈련/마케팅)
 *
 *   디자인: .mathema-app phone frame (LoginPage / 온보딩 / 메인 앱과 통일).
 */

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, RegisterRole } from '../context/AuthContext';
import type { GradeLevel, NcertClass } from '../lib/queries';
import { useT } from '../lib/i18n';
import { Glyph } from '../components/onboarding/Glyph';
import { BrandLogo } from '../components/Brand';
import '../styles/onboarding.css';

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ?? '';

const NCERT_TO_GRADE: Record<NcertClass, GradeLevel> = {
  CLASS_7:  'CLASS_7',
  CLASS_8:  'CLASS_8',
  CLASS_9:  'CLASS_9',
  CLASS_10: 'CLASS_10',
  CLASS_11: 'CLASS_11',
  CLASS_12: 'CLASS_12',
};

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const { t, lang, setLang } = useT();
  const navigate = useNavigate();

  // 진행 단계 0 (역할+기본정보) → 1 (프로필) → 2 (동의)
  const [step, setStep] = useState<0 | 1 | 2>(0);

  // 공통 입력
  const [role, setRole] = useState<RegisterRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // STUDENT
  const [ncertClass, setNcertClass] = useState<NcertClass>('CLASS_11');
  const [examDate, setExamDate] = useState('2027-02-14');
  const [targetGrade, setTargetGrade] = useState('3');

  // PARENT
  const [childEmail, setChildEmail] = useState('');

  // TEACHER
  const [tenantCode, setTenantCode] = useState('');

  // 동의
  const [consentAnalytics, setConsentAnalytics] = useState(true);
  const [consentAiTraining, setConsentAiTraining] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 단계별 next 조건
  const canStep1Next = !!email && password.length >= 8 && !!name && !!role;
  const canStep2Next = (
    role === 'STUDENT' ? (!!ncertClass && !!examDate && !!targetGrade)
    : role === 'PARENT' ? !!childEmail
    : true // TEACHER tenantCode 는 선택
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step !== 2) return;
    setErr(null); setBusy(true);
    try {
      await register({
        email, password, name,
        role,
        ...(role === 'STUDENT' ? {
          examDate: new Date(examDate).toISOString(),
          targetGrade: Number(targetGrade),
          gradeLevel: NCERT_TO_GRADE[ncertClass],
        } : {}),
        ...(role === 'PARENT'  ? { childEmail } : {}),
        ...(role === 'TEACHER' ? (tenantCode ? { tenantCode } : {}) : {}),
        consentAnalytics, consentAiTraining, consentMarketing,
      });
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? t('auth.register.failed'));
    } finally { setBusy(false); }
  };

  // Google Identity Services — Step 0 에서만 노출.
  const gsiRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (step !== 0 || !GOOGLE_CLIENT_ID || !gsiRef.current) return;
    const init = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) return;
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp: { credential: string }) => {
          setErr(null);
          setBusy(true);
          try {
            await loginWithGoogle(resp.credential);
            navigate('/');
          } catch (e: any) {
            setErr(e?.response?.data?.error?.message ?? t('auth.register.failed'));
          } finally {
            setBusy(false);
          }
        },
      });
      g.accounts.id.renderButton(gsiRef.current, {
        theme: 'outline',
        size: 'large',
        width: 280,
        text: 'signup_with',
      });
    };
    if ((window as any).google?.accounts?.id) {
      init();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = init;
    document.body.appendChild(s);
  }, [step, loginWithGoogle, navigate, t]);

  return (
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <div className="screen">
            {/* Top: brand + lang toggle */}
            <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <BrandLogo size="sm" />
              <LangToggle lang={lang} setLang={setLang} />
            </div>

            {/* Progress dots */}
            <div className="steps" style={{ padding: '14px 24px 0' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className={`dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
              ))}
            </div>

            <div className="screen-body" style={{ gap: 18, paddingTop: 16 }}>
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {step === 0 && (
                  <StepRoleAndCredentials
                    role={role} setRole={setRole}
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    name={name} setName={setName}
                    gsiRef={gsiRef}
                    t={t}
                  />
                )}
                {step === 1 && role === 'STUDENT' && (
                  <StepStudent
                    ncertClass={ncertClass} setNcertClass={setNcertClass}
                    examDate={examDate} setExamDate={setExamDate}
                    targetGrade={targetGrade} setTargetGrade={setTargetGrade}
                    t={t}
                  />
                )}
                {step === 1 && role === 'PARENT' && (
                  <StepParent childEmail={childEmail} setChildEmail={setChildEmail} t={t} />
                )}
                {step === 1 && role === 'TEACHER' && (
                  <StepTeacher tenantCode={tenantCode} setTenantCode={setTenantCode} t={t} />
                )}
                {step === 2 && (
                  <StepConsent
                    analytics={consentAnalytics} setAnalytics={setConsentAnalytics}
                    aiTraining={consentAiTraining} setAiTraining={setConsentAiTraining}
                    marketing={consentMarketing} setMarketing={setConsentMarketing}
                    t={t}
                  />
                )}

                {err && <div style={{ color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>}

                {/* 액션 버튼 — step 마다 다름 */}
                {step < 2 && (
                  <button
                    type="button"
                    className="btn"
                    disabled={step === 0 ? !canStep1Next : !canStep2Next}
                    onClick={() => setStep(((step + 1) as 0 | 1 | 2))}
                    style={{ marginTop: 4 }}
                  >
                    {t('reg.next')}
                    <Glyph.ChevronR />
                  </button>
                )}
                {step === 2 && (
                  <button type="submit" className="btn" disabled={busy} style={{ marginTop: 4 }}>
                    {busy ? t('auth.login.busy') : t('reg.finish')}
                    <Glyph.ChevronR />
                  </button>
                )}

                {/* 뒤로 / 로그인 링크 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                  {step > 0 ? (
                    <button type="button" className="btn text" style={{ width: 'auto', padding: '6px 4px' }} onClick={() => setStep((step - 1) as 0 | 1 | 2)}>
                      ← {t('reg.back')}
                    </button>
                  ) : <span />}
                  <span style={{ fontSize: 13, color: 'var(--p-muted)' }}>
                    {t('auth.register.haveAccount')}{' '}
                    <Link to="/login" style={{ color: 'var(--p-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      {t('auth.register.goLogin')}
                    </Link>
                  </span>
                </div>

                {step === 2 && (
                  <p className="caption" style={{ textAlign: 'center', fontSize: 11.5, marginTop: 2 }}>
                    {t('reg.policy')}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 0 : 역할 + 기본 정보 + Google ───────────────────────
function StepRoleAndCredentials({ role, setRole, email, setEmail, password, setPassword, name, setName, gsiRef, t }: any) {
  // PARENT/TEACHER 가입은 별도 대시보드 출시 전까지 잠금. 카드는 보이되 선택은 불가
  // — 향후 메뉴 재배치 비용을 줄이고 사용자에게 로드맵을 자연스럽게 노출.
  const roles: { id: RegisterRole; Icon: any; label: string; sub: string; popular?: boolean; comingSoon?: boolean }[] = [
    { id: 'STUDENT', Icon: Glyph.Person,  label: t('reg.role.student'), sub: t('reg.role.student.sub'), popular: true },
    { id: 'PARENT',  Icon: Glyph.Parent,  label: t('reg.role.parent'),  sub: t('reg.role.parent.sub'), comingSoon: true },
    { id: 'TEACHER', Icon: Glyph.Teacher, label: t('reg.role.teacher'), sub: t('reg.role.teacher.sub'), comingSoon: true },
  ];
  return (
    <>
      <div>
        <span className="eyebrow">{t('reg.step1.eyebrow')}</span>
        <h2 className="title" style={{ marginTop: 8 }}>{t('reg.step1.title')}</h2>
        <p className="subtitle">{t('reg.step1.sub')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {roles.map((r) => {
          const selected = role === r.id;
          return (
            <div
              key={r.id}
              className={`option-card ${selected ? 'selected' : ''}`}
              onClick={() => !r.comingSoon && setRole(r.id)}
              role="button" tabIndex={r.comingSoon ? -1 : 0}
              aria-disabled={r.comingSoon || undefined}
              onKeyDown={(e) => {
                if (!r.comingSoon && (e.key === 'Enter' || e.key === ' ')) setRole(r.id);
              }}
              style={r.comingSoon ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, padding: 10,
                background: selected ? 'var(--p-surface)' : 'var(--p-surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: selected ? 'var(--p-primary)' : 'var(--p-ink-2)',
                border: selected ? '1.5px solid var(--p-primary)' : '1px solid var(--p-border)',
                flexShrink: 0,
              }}>
                <r.Icon accent="currentColor" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--p-ink)' }}>{r.label}</span>
                  {r.popular && <span className="chip primary">{t('reg.role.popular')}</span>}
                  {r.comingSoon && <span className="chip" style={{ padding: '2px 8px', fontSize: 10.5 }}>Coming soon</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--p-muted)', marginTop: 2 }}>{r.sub}</div>
              </div>
              <div className="check">{selected && <Glyph.Check size={12} />}</div>
            </div>
          );
        })}
      </div>

      <div className="field">
        <label>{t('auth.email')}</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" />
      </div>
      <div className="field">
        <label>{t('auth.passwordHint')}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
      </div>
      <div className="field">
        <label>{t('auth.name')}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" />
      </div>

      {GOOGLE_CLIENT_ID && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
            <span className="caption" style={{ fontSize: 11 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
          </div>
          <div ref={gsiRef} style={{ display: 'flex', justifyContent: 'center' }} />
        </div>
      )}
    </>
  );
}

// ─── Step 1 (STUDENT) : NCERT class + exam date + target ──
function StepStudent({ ncertClass, setNcertClass, examDate, setExamDate, targetGrade, setTargetGrade, t }: any) {
  const grades: { id: NcertClass; num: string; lbl: string }[] = [
    { id: 'CLASS_7',  num: '7',  lbl: t('reg.student.classCaption') },
    { id: 'CLASS_8',  num: '8',  lbl: t('reg.student.classCaption') },
    { id: 'CLASS_9',  num: '9',  lbl: t('reg.student.classCaption') },
    { id: 'CLASS_10', num: '10', lbl: t('reg.student.classBoard') },
    { id: 'CLASS_11', num: '11', lbl: t('reg.student.classCaption') },
    { id: 'CLASS_12', num: '12', lbl: t('reg.student.classBoard') },
  ];
  return (
    <>
      <div>
        <span className="eyebrow">{t('reg.step2.eyebrow')}</span>
        <h2 className="title" style={{ marginTop: 8 }}>{t('reg.step2.title')}</h2>
      </div>
      <div className="field">
        <label>{t('reg.student.classQ')}</label>
        <div className="grade-grid">
          {grades.map((g) => (
            <div
              key={g.id}
              className={`grade-pill ${ncertClass === g.id ? 'selected' : ''}`}
              onClick={() => setNcertClass(g.id)}
              role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setNcertClass(g.id); }}
            >
              <span className="num">{g.num}</span>
              <span className="lbl">{g.lbl}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="field">
        <label>{t('reg.student.examDate')}</label>
        <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
      </div>
      <div className="field">
        <label>{t('reg.student.targetGrade')}</label>
        <input type="number" min={1} max={9} value={targetGrade} onChange={(e) => setTargetGrade(e.target.value)} />
      </div>
    </>
  );
}

// ─── Step 1 (PARENT) : 자녀 이메일 ──────────────────────────
function StepParent({ childEmail, setChildEmail, t }: any) {
  return (
    <>
      <div>
        <span className="eyebrow">{t('reg.step2.eyebrow')}</span>
        <h2 className="title" style={{ marginTop: 8 }}>{t('reg.step2.title')}</h2>
      </div>
      <div className="field">
        <label>{t('reg.parent.childEmail')}</label>
        <input type="email" value={childEmail} onChange={(e) => setChildEmail(e.target.value)} placeholder="child@example.com" />
        <span className="caption" style={{ marginTop: 6 }}>{t('reg.parent.childEmail.hint')}</span>
      </div>
    </>
  );
}

// ─── Step 1 (TEACHER) : tenantCode 선택 ─────────────────────
function StepTeacher({ tenantCode, setTenantCode, t }: any) {
  return (
    <>
      <div>
        <span className="eyebrow">{t('reg.step2.eyebrow')}</span>
        <h2 className="title" style={{ marginTop: 8 }}>{t('reg.step2.title')}</h2>
      </div>
      <div className="field">
        <label>{t('reg.teacher.tenantCode')}</label>
        <input value={tenantCode} onChange={(e) => setTenantCode(e.target.value)} placeholder="MATHEMA-A1B2" />
        <span className="caption" style={{ marginTop: 6 }}>{t('reg.teacher.tenantCode.hint')}</span>
      </div>
    </>
  );
}

// ─── Step 2 : 동의 ─────────────────────────────────────────
function StepConsent({ analytics, setAnalytics, aiTraining, setAiTraining, marketing, setMarketing, t }: any) {
  const items = [
    { id: 'essential',  required: true,  checked: true,       set: () => {},
      name: t('reg.consent.essential'),  desc: t('reg.consent.essential.desc') },
    { id: 'analytics',  required: false, checked: analytics,  set: () => setAnalytics(!analytics),
      name: t('reg.consent.analytics'),  desc: t('reg.consent.analytics.desc') },
    { id: 'aiTraining', required: false, checked: aiTraining, set: () => setAiTraining(!aiTraining),
      name: t('reg.consent.aiTraining'), desc: t('reg.consent.aiTraining.desc') },
    { id: 'marketing',  required: false, checked: marketing,  set: () => setMarketing(!marketing),
      name: t('reg.consent.marketing'),  desc: t('reg.consent.marketing.desc') },
  ];
  return (
    <>
      <div>
        <span className="eyebrow">{t('reg.step3.eyebrow')}</span>
        <h2 className="title" style={{ marginTop: 8 }}>{t('reg.step3.title')}</h2>
        <p className="subtitle">{t('reg.step3.sub')}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((it) => (
          <div key={it.id} className="consent-row">
            <div
              className={`ck ${it.checked ? 'checked' : ''}`}
              style={{ opacity: it.required ? 0.85 : 1, cursor: it.required ? 'default' : 'pointer' }}
              onClick={it.required ? undefined : it.set}
              role="checkbox"
              aria-checked={it.checked}
              tabIndex={it.required ? -1 : 0}
              onKeyDown={(e) => { if (!it.required && (e.key === 'Enter' || e.key === ' ')) it.set(); }}
            >
              {it.checked && <Glyph.Check size={12} />}
            </div>
            <div className="info">
              <div className="name">
                <span>{it.name}</span>
                {it.required && <span className="req-pill">{t('reg.consent.required')}</span>}
              </div>
              <div className="desc">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function LangToggle({ lang, setLang }: { lang: 'ko' | 'en' | 'hi'; setLang: (l: 'ko' | 'en' | 'hi') => void }) {
  return (
    <div style={{
      display: 'flex', gap: 0, padding: 2,
      background: 'var(--p-surface-2)', borderRadius: 6,
      border: '1px solid var(--p-border)',
    }}>
      {(['hi', 'en', 'ko'] as const).map((l) => (
        <button
          key={l} type="button" onClick={() => setLang(l)}
          style={{
            padding: '4px 8px', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: lang === l ? 'var(--p-primary)' : 'transparent',
            color: lang === l ? 'var(--p-primary-fg)' : 'var(--p-muted)',
            border: 'none', borderRadius: 4, cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
          }}
        >{l.toUpperCase()}</button>
      ))}
    </div>
  );
}
