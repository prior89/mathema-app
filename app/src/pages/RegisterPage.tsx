/**
 * RegisterPage — Matheo 폰-프레임 3단계 회원가입.
 *
 *   STUDENT 미성년: Step 2 = 보호자 정보 (이메일 확인 링크 발송)
 *   STUDENT 성인·기타 역할: Step 2 = 개인정보 동의
 */

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, RegisterRole } from '../context/AuthContext';
import { post, get } from '../lib/api';
import { postAuthPath } from '../lib/post-auth-path';
import type { GradeLevel, Me, NcertClass } from '../lib/queries';
import { useT } from '../lib/i18n';
import { isLikelyEmail } from '../lib/email';
import {
  birthDateFromAge,
  requiresGuardianConsentFromAge,
} from '../lib/guardian-consent';
import { AgeGate } from '../components/onboarding/AgeGate';
import { Glyph } from '../components/onboarding/Glyph';
import { BrandLogo } from '../components/Brand';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { AuthDivider } from '../components/auth/AuthDivider';
import { formatAuthError } from '../lib/auth-errors';
import { isGoogleSignInConfigured } from '../lib/google-client-id';
import { LAUNCH_STUDENT_ONLY } from '../lib/launch-config';
import { detectOnboardingLang, langForCountry } from '../lib/onboarding-locale';
import '../styles/onboarding.css';

const NCERT_TO_GRADE: Record<NcertClass, GradeLevel> = {
  CLASS_7:  'CLASS_7',
  CLASS_8:  'CLASS_8',
  CLASS_9:  'CLASS_9',
  CLASS_10: 'CLASS_10',
  CLASS_11: 'CLASS_11',
  CLASS_12: 'CLASS_12',
};

export default function RegisterPage() {
  const { register, loginWithGoogle, user, refreshUser } = useAuth();
  const { t, lang, setLang } = useT();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Guest → real account upgrade (?upgrade=1). Same form, but submits to
  // /auth/guest/upgrade so the existing userId (and all progress) is kept.
  const upgradeMode = searchParams.get('upgrade') === '1' && user?.isGuest === true;

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [role, setRole] = useState<RegisterRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [ncertClass, setNcertClass] = useState<NcertClass>('CLASS_7');
  const [age, setAge] = useState<number | ''>('');
  const [examDate, setExamDate] = useState('2027-02-14');
  const [targetGrade, setTargetGrade] = useState('3');

  const [childEmail, setChildEmail] = useState('');
  const [tenantCode, setTenantCode] = useState('');
  const [country, setCountry] = useState<'IN' | 'KR'>('IN');

  const [parentEmail, setParentEmail] = useState('');

  const [consentAnalytics, setConsentAnalytics] = useState(true);
  const [consentAiTraining, setConsentAiTraining] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    setLang(detectOnboardingLang(), { reload: false });
  }, [setLang]);

  const isMinorStudent = useMemo(
    () => role === 'STUDENT' && typeof age === 'number' && requiresGuardianConsentFromAge(age, country),
    [role, age, country],
  );

  const canStep1Next = isLikelyEmail(email) && password.length >= 8 && !!name.trim() && !!role;
  const canStep2Next = (
    role === 'STUDENT'
      ? (
        !!ncertClass && age !== ''
        && (country === 'KR' || (!!examDate && !!targetGrade))
      )
      : role === 'PARENT'
        ? !!childEmail
        : true
  );
  const canFinishMinor = isLikelyEmail(parentEmail);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step !== 2) return;
    setErr(null);
    setBusy(true);
    try {
      if (upgradeMode) {
        await post('/auth/guest/upgrade', {
          email: email.trim().toLowerCase(),
          password,
          name,
          country,
          gradeLevel: NCERT_TO_GRADE[ncertClass],
          ...(age !== '' ? { birthDate: birthDateFromAge(age as number) } : {}),
          ...(isMinorStudent ? {
            parentEmail: parentEmail.trim(),
            consentAnalytics: false,
            consentAiTraining: false,
            consentMarketing: false,
          } : {
            consentAnalytics, consentAiTraining, consentMarketing,
          }),
        });
        await refreshUser().catch(() => {});
        const me = await get<Me>('/users/me');
        navigate(postAuthPath(me));
        return;
      }
      await register({
        email, password, name,
        role,
        country,
        ...(role === 'STUDENT' ? {
          birthDate: birthDateFromAge(age as number),
          gradeLevel: NCERT_TO_GRADE[ncertClass],
          ...(country !== 'KR' ? {
            examDate: new Date(examDate).toISOString(),
            targetGrade: Number(targetGrade),
          } : {}),
        } : {}),
        ...(role === 'PARENT' ? { childEmail } : {}),
        ...(role === 'TEACHER' ? (tenantCode ? { tenantCode } : {}) : {}),
        ...(isMinorStudent ? {
          parentEmail: parentEmail.trim(),
          consentAnalytics: false,
          consentAiTraining: false,
          consentMarketing: false,
        } : {
          consentAnalytics, consentAiTraining, consentMarketing,
        }),
      });
    } catch (e: any) {
      const code = e?.response?.data?.error?.code;
      if (code === 'parent_email_same_as_student') {
        setErr(t('guardianConsent.parentEmailSameAsStudent'));
      } else {
        setErr(e?.response?.data?.error?.message ?? t('auth.register.failed'));
      }
    } finally { setBusy(false); }
  };

  const handleGoogleSignIn = async (idToken: string) => {
    setErr(null);
    setGoogleBusy(true);
    try {
      await loginWithGoogle(idToken);
    } catch (e: unknown) {
      setErr(formatAuthError(e, { context: 'register' }));
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <div className="screen">
            <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <BrandLogo size="sm" />
              <LangToggle lang={lang} setLang={setLang} />
            </div>

            <div className="steps" style={{ padding: '14px 24px 0' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className={`dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
              ))}
            </div>

            <div className="screen-body" style={{ gap: 18, paddingTop: 16 }}>
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {step === 0 && upgradeMode && (
                  <div
                    className="card"
                    style={{ padding: '10px 14px', background: 'var(--p-primary-tint)', borderColor: 'var(--p-primary)', fontSize: 13, lineHeight: 1.45 }}
                  >
                    {t('reg.upgrade.note')}
                  </div>
                )}
                {step === 0 && (
                  <StepRoleAndCredentials
                    role={role} setRole={setRole}
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    name={name} setName={setName}
                    country={country} setCountry={setCountry}
                    setLang={setLang}
                    googleBusy={googleBusy}
                    onGoogleSignIn={handleGoogleSignIn}
                    formBusy={busy}
                    hideGoogle={upgradeMode}
                    t={t}
                  />
                )}
                {step === 1 && role === 'STUDENT' && (
                  <StepStudent
                    ncertClass={ncertClass} setNcertClass={setNcertClass}
                    age={age} setAge={setAge}
                    country={country}
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
                {step === 2 && isMinorStudent && (
                  <StepGuardianMinor
                    parentEmail={parentEmail} setParentEmail={setParentEmail}
                    country={country}
                    t={t}
                  />
                )}
                {step === 2 && !isMinorStudent && (
                  <StepConsent
                    analytics={consentAnalytics} setAnalytics={setConsentAnalytics}
                    aiTraining={consentAiTraining} setAiTraining={setConsentAiTraining}
                    marketing={consentMarketing} setMarketing={setConsentMarketing}
                    t={t}
                  />
                )}

                {err && <div style={{ color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>}

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
                  <button
                    type="submit"
                    className="btn"
                    disabled={busy || (isMinorStudent && !canFinishMinor)}
                    style={{ marginTop: 4 }}
                  >
                    {busy ? t('auth.login.busy') : (isMinorStudent ? t('reg.finish.minor') : t('reg.finish'))}
                    <Glyph.ChevronR />
                  </button>
                )}

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

function StepRoleAndCredentials({
  role, setRole, email, setEmail, password, setPassword, name, setName,
  country, setCountry, setLang, googleBusy, onGoogleSignIn, formBusy, hideGoogle, t,
}: any) {
  const COUNTRIES: Array<{ id: 'IN' | 'KR' | 'US' | 'UK' | 'AU' | 'SG'; flag: string; name: string; active: boolean }> = [
    { id: 'IN', flag: '🇮🇳', name: 'India', active: true },
    { id: 'KR', flag: '🇰🇷', name: '대한민국', active: true },
    { id: 'US', flag: '🇺🇸', name: 'United States', active: false },
    { id: 'UK', flag: '🇬🇧', name: 'United Kingdom', active: false },
    { id: 'AU', flag: '🇦🇺', name: 'Australia', active: false },
    { id: 'SG', flag: '🇸🇬', name: 'Singapore', active: false },
  ];
  const pickCountry = (c: typeof COUNTRIES[number]['id']) => {
    setCountry(c);
    setLang(langForCountry(c), { reload: false });
  };
  const roles: { id: RegisterRole; Icon: any; label: string; sub: string; popular?: boolean; comingSoon?: boolean }[] = [
    { id: 'STUDENT', Icon: Glyph.Person, label: t('reg.role.student'), sub: t('reg.role.student.sub'), popular: true },
    ...(LAUNCH_STUDENT_ONLY ? [] : [
      { id: 'PARENT' as RegisterRole, Icon: Glyph.Parent, label: t('reg.role.parent'), sub: t('reg.role.parent.sub') },
      { id: 'TEACHER' as RegisterRole, Icon: Glyph.Teacher, label: t('reg.role.teacher'), sub: t('reg.role.teacher.sub') },
    ]),
  ];
  return (
    <>
      <div>
        <span className="eyebrow">{t('reg.step1.eyebrow')}</span>
        <h2 className="title" style={{ marginTop: 8 }}>{t('reg.step1.title')}</h2>
        <p className="subtitle">{t('reg.step1.sub')}</p>
      </div>
      {!LAUNCH_STUDENT_ONLY && (
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
                onKeyDown={(e) => { if (!r.comingSoon && (e.key === 'Enter' || e.key === ' ')) setRole(r.id); }}
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
                    {r.comingSoon && <span className="chip" style={{ padding: '2px 8px', fontSize: 10.5 }}>{t('reg.role.comingSoon')}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--p-muted)', marginTop: 2 }}>{r.sub}</div>
                </div>
                <div className="check">{selected && <Glyph.Check size={12} />}</div>
              </div>
            );
          })}
        </div>
      )}
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
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('reg.name.placeholder')} />
      </div>
      <div className="field">
        <label>{country === 'KR' ? '국가' : 'Country'}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {COUNTRIES.map((c) => {
            const selected = country === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => c.active && pickCountry(c.id)}
                disabled={!c.active}
                style={{
                  padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8,
                  cursor: c.active ? 'pointer' : 'not-allowed', opacity: c.active ? 1 : 0.45,
                  border: selected ? '2px solid var(--p-primary)' : '1px solid var(--p-border)',
                  background: selected ? 'var(--p-primary-tint)' : 'var(--p-surface)',
                  borderRadius: 10, fontSize: 13, textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{c.flag}</span>
                <span style={{ fontWeight: selected ? 600 : 500, color: 'var(--p-ink)' }}>{c.name}</span>
                {!c.active && <span className="chip" style={{ marginLeft: 'auto', padding: '1px 6px', fontSize: 10 }}>Soon</span>}
              </button>
            );
          })}
        </div>
      </div>
      {!hideGoogle && isGoogleSignInConfigured() && (
        <>
          <AuthDivider labelKey="reg.or" />
          <GoogleSignInButton mode="signup" onCredential={onGoogleSignIn} busy={googleBusy} disabled={formBusy} />
        </>
      )}
    </>
  );
}

function StepStudent({ ncertClass, setNcertClass, age, setAge, examDate, setExamDate, targetGrade, setTargetGrade, country, t }: any) {
  const grades: { id: NcertClass; num: string; lbl: string }[] = country === 'KR'
    ? [
        { id: 'CLASS_7', num: '중1', lbl: '중학교 1학년' },
        { id: 'CLASS_8', num: '중2', lbl: '중학교 2학년' },
        { id: 'CLASS_9', num: '중3', lbl: '중학교 3학년' },
        { id: 'CLASS_10', num: '고1', lbl: '공통수학' },
        { id: 'CLASS_11', num: '고2', lbl: '선택과목' },
        { id: 'CLASS_12', num: '고3', lbl: '수능 준비' },
      ]
    : [
        { id: 'CLASS_7', num: '7', lbl: t('reg.student.classCaption') },
        { id: 'CLASS_8', num: '8', lbl: t('reg.student.classCaption') },
        { id: 'CLASS_9', num: '9', lbl: t('reg.student.classCaption') },
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
      <AgeGate age={age} onChange={setAge} country={country} />
      {country !== 'KR' && (
        <>
          <div className="field">
            <label>{t('reg.student.examDate')}</label>
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
          </div>
          <div className="field">
            <label>{t('reg.student.targetGrade')}</label>
            <input type="number" min={1} max={9} value={targetGrade} onChange={(e) => setTargetGrade(e.target.value)} />
          </div>
        </>
      )}
    </>
  );
}

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

function StepGuardianMinor({
  parentEmail, setParentEmail, country, t,
}: any) {
  const subKey = country === 'KR' ? 'reg.step3.guardian.sub.kr' : 'reg.step3.guardian.sub';
  return (
    <>
      <div>
        <span className="eyebrow">{t('reg.step3.guardian.eyebrow')}</span>
        <h2 className="title" style={{ marginTop: 8 }}>{t('reg.step3.guardian.title')}</h2>
        <p className="subtitle">{t(subKey)}</p>
      </div>
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
      <div className="consent-row">
        <div className="ck checked" style={{ opacity: 0.85, cursor: 'default' }}>
          <Glyph.Check size={12} />
        </div>
        <div className="info">
          <div className="name">
            <span>{t('reg.step3.guardian.essential')}</span>
            <span className="req-pill">{t('reg.consent.required')}</span>
          </div>
          <div className="desc">{t('reg.step3.guardian.essential.desc')}</div>
        </div>
      </div>
    </>
  );
}

function StepConsent({ analytics, setAnalytics, aiTraining, setAiTraining, marketing, setMarketing, t }: any) {
  const items = [
    { id: 'essential', required: true, checked: true, set: () => {},
      name: t('reg.consent.essential'), desc: t('reg.consent.essential.desc') },
    { id: 'analytics', required: false, checked: analytics, set: () => setAnalytics(!analytics),
      name: t('reg.consent.analytics'), desc: t('reg.consent.analytics.desc') },
    { id: 'aiTraining', required: false, checked: aiTraining, set: () => setAiTraining(!aiTraining),
      name: t('reg.consent.aiTraining'), desc: t('reg.consent.aiTraining.desc') },
    { id: 'marketing', required: false, checked: marketing, set: () => setMarketing(!marketing),
      name: t('reg.consent.marketing'), desc: t('reg.consent.marketing.desc') },
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