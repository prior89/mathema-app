/**
 * RegisterPage — Sage 톤 3 단계 회원가입.
 *
 *   명세서 §1 — 역할별 분기 (STUDENT / PARENT / TEACHER).
 *   참조 디자인: Downloads/App onboarding/screens-a.jsx (sage palette).
 *
 *   단계 구성:
 *     01 · 역할 + 기본 정보 (email/password/name + 역할 카드)
 *     02 · 프로필
 *          - STUDENT: NCERT 학년 6개 (Class 7~12) + 시험 날짜 + 목표 등급
 *          - PARENT : 자녀 이메일
 *          - TEACHER: 학원 코드 (선택)
 *     03 · 동의 (DPDP 2023 · GDPR — 필수/분석/AI훈련/마케팅)
 *
 *   sage palette CSS 변수와 클래스(.sage-scope ...)는 index.html 의 <style> 에 등록.
 */

import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, GradeLevel, RegisterRole } from '../context/AuthContext';
import { useT } from '../lib/i18n';

type NcertClass = 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10' | 'CLASS_11' | 'CLASS_12';

/** NCERT class ↔ 기존 GradeLevel 매핑 (인도 학년 → 한국 학년 enum). */
const NCERT_TO_GRADE: Record<NcertClass, GradeLevel> = {
  CLASS_7:  'G_MIDDLE_1',
  CLASS_8:  'G_MIDDLE_2',
  CLASS_9:  'G_MIDDLE_3',
  CLASS_10: 'G_HIGH_1',
  CLASS_11: 'G_HIGH_2',
  CLASS_12: 'G_HIGH_3',
};

export default function RegisterPage() {
  const { register } = useAuth();
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

  return (
    <div className="sage-scope" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--sage-surface)',
        border: '1px solid var(--sage-border)',
        borderRadius: 'var(--sage-radius-lg)',
        padding: '28px 28px 24px',
        boxShadow: '0 1px 0 oklch(0 0 0 / 0.02)',
      }}>
        {/* 헤더 — 브랜드 + 언어 토글 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <img src="/matheo-logo.png" alt="Mathēma" style={{ height: 40, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply', display: 'block' }} />
            <div className="caption" style={{ marginTop: 4 }}>{t('reg.welcome.tagline')}</div>
          </div>
          <LangToggle lang={lang} setLang={setLang} />
        </div>

        {/* 진행 dot */}
        <div className="steps">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {step === 0 && (
            <StepRoleAndCredentials
              role={role} setRole={setRole}
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              name={name} setName={setName}
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

          {err && <div style={{ color: 'var(--sage-danger)', fontSize: 13 }}>{err}</div>}

          {/* 액션 버튼 — step 마다 다름 */}
          {step < 2 && (
            <button
              type="button"
              className="btn"
              disabled={step === 0 ? !canStep1Next : !canStep2Next}
              onClick={() => setStep(((step + 1) as 0 | 1 | 2))}
            >
              {t('reg.next')}
            </button>
          )}
          {step === 2 && (
            <button type="submit" className="btn" disabled={busy}>
              {busy ? t('auth.login.busy') : t('reg.finish')}
            </button>
          )}

          {/* 뒤로 / 로그인 링크 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            {step > 0 ? (
              <button type="button" className="btn text" style={{ width: 'auto', padding: '6px 4px' }} onClick={() => setStep((step - 1) as 0 | 1 | 2)}>
                ← {t('reg.back')}
              </button>
            ) : <span />}
            <span style={{ fontSize: 13, color: 'var(--sage-muted)' }}>
              {t('auth.register.haveAccount')}{' '}
              <Link to="/login" style={{ color: 'var(--sage-primary)', fontWeight: 600, textDecoration: 'none' }}>
                {t('auth.register.goLogin')}
              </Link>
            </span>
          </div>

          {step === 2 && (
            <p className="caption" style={{ textAlign: 'center', fontSize: 11.5, marginTop: 4 }}>
              {t('reg.policy')}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// ─── Step 0 : 역할 + 기본 정보 ────────────────────────────────
function StepRoleAndCredentials({ role, setRole, email, setEmail, password, setPassword, name, setName, t }: any) {
  const roles: { id: RegisterRole; icon: string; label: string; sub: string; popular?: boolean }[] = [
    { id: 'STUDENT', icon: '✦', label: t('reg.role.student'), sub: t('reg.role.student.sub'), popular: true },
    { id: 'PARENT',  icon: '◇', label: t('reg.role.parent'),  sub: t('reg.role.parent.sub') },
    { id: 'TEACHER', icon: '◈', label: t('reg.role.teacher'), sub: t('reg.role.teacher.sub') },
  ];
  return (
    <>
      <div>
        <span className="eyebrow">{t('reg.step1.eyebrow')}</span>
        <h2 className="title">{t('reg.step1.title')}</h2>
        <p className="subtitle">{t('reg.step1.sub')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {roles.map((r) => (
          <div
            key={r.id}
            className={`option-card ${role === r.id ? 'selected' : ''}`}
            onClick={() => setRole(r.id)}
            role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setRole(r.id); }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: role === r.id ? 'var(--sage-surface)' : 'var(--sage-surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: role === r.id ? 'var(--sage-primary)' : 'var(--sage-ink-2)',
              border: role === r.id ? '1.5px solid var(--sage-primary)' : '1px solid var(--sage-border)',
              fontFamily: 'var(--sage-font-display)', fontSize: 20, flexShrink: 0,
            }}>{r.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--sage-ink)' }}>{r.label}</span>
                {r.popular && <span className="chip">{t('reg.role.popular')}</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--sage-muted)', marginTop: 2 }}>{r.sub}</div>
            </div>
            <div className="check">{role === r.id && <Tick />}</div>
          </div>
        ))}
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
        <h2 className="title">{t('reg.step2.title')}</h2>
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
        <h2 className="title">{t('reg.step2.title')}</h2>
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
        <h2 className="title">{t('reg.step2.title')}</h2>
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
        <h2 className="title">{t('reg.step3.title')}</h2>
        <p className="subtitle">{t('reg.step3.sub')}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((it) => (
          <div key={it.id} style={{
            display: 'flex', gap: 14, padding: '14px 0',
            borderBottom: '1px solid var(--sage-border)',
          }}>
            <div
              className={`ck ${it.checked ? 'checked' : ''}`}
              style={{ opacity: it.required ? 0.85 : 1, cursor: it.required ? 'default' : 'pointer' }}
              onClick={it.required ? undefined : it.set}
              role="checkbox"
              aria-checked={it.checked}
              tabIndex={it.required ? -1 : 0}
              onKeyDown={(e) => { if (!it.required && (e.key === 'Enter' || e.key === ' ')) it.set(); }}
            >
              {it.checked && <Tick size={12} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, fontWeight: 600, color: 'var(--sage-ink)' }}>
                <span>{it.name}</span>
                {it.required && (
                  <span style={{
                    fontFamily: 'var(--sage-font-mono)', fontSize: 9.5, letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4,
                    background: 'var(--sage-surface-2)', color: 'var(--sage-muted)',
                    border: '1px solid var(--sage-border)',
                  }}>
                    {t('reg.consent.required')}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--sage-muted)', marginTop: 4, lineHeight: 1.45 }}>
                {it.desc}
              </div>
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
      background: 'var(--sage-surface-2)', borderRadius: 6,
      border: '1px solid var(--sage-border)',
    }}>
      {(['hi', 'en', 'ko'] as const).map((l) => (
        <button
          key={l} type="button" onClick={() => setLang(l)}
          style={{
            padding: '4px 8px', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: lang === l ? 'var(--sage-primary)' : 'transparent',
            color: lang === l ? 'var(--sage-primary-fg)' : 'var(--sage-muted)',
            border: 'none', borderRadius: 4, cursor: 'pointer',
            fontFamily: 'var(--sage-font-mono)',
          }}
        >{l.toUpperCase()}</button>
      ))}
    </div>
  );
}

function Tick({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5l3 3 6-6" />
    </svg>
  );
}
