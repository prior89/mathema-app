/* LoginPage — sage-themed mobile-app login.
 * PoC: admin/admin → dev-login. Regular email/password also supported.
 * Also re-exports AuthShell + Field for legacy ForgotPassword/ResetPassword/VerifyEmail pages.
 */
import { type FormEvent, type ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { post, tokens, get } from '../lib/api';
import type { Me } from '../lib/queries';
import { homePathForRole } from '../lib/role-routes';
import { useT } from '../lib/i18n';
import { BrandLockup } from '../components/Brand';
import { LearningOrbit } from '../components/design/LearningOrbit';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { AuthDivider } from '../components/auth/AuthDivider';
import { formatAuthError } from '../lib/auth-errors';
import '../styles/onboarding.css';

export default function LoginPage() {
  const { login, loginWithGoogle, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useT();
  // PoC dev-login은 DEV 빌드에서만 prefill — production은 빈 폼 (admin/admin 누른 사용자가
  // /auth/dev-login → "dev-login disabled in production" 에러를 받지 않도록).
  const [email, setEmail] = useState(import.meta.env.DEV ? 'admin' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? 'admin' : '');
  const emailInputType = import.meta.env.DEV ? 'text' : 'email';
  const [err, setErr] = useState<string | null>(null);
  // DEV-7 -- displaced-session notice: when api.ts redirects from /auth/refresh
  // with code=device_displaced it sets sessionStorage.matheo.loginNotice; show
  // it here as an explanation, then clear so refreshes don't re-show it.
  const [notice, setNotice] = useState<string | null>(() => {
    try {
      const v = sessionStorage.getItem('matheo.loginNotice');
      sessionStorage.removeItem('matheo.loginNotice');
      if (v === 'device_displaced')
        return t('login.notice.displaced');
      if (v === 'device_mismatch')
        return t('login.notice.mismatch');
      if (v === 'session_expired')
        return t('login.notice.expired');
      return null;
    } catch { return null; }
  });
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      // PoC: admin/admin → dev-login (DEV 빌드 전용; production은 항상 normal /auth/login).
      if (import.meta.env.DEV && email.trim().toLowerCase() === 'admin' && password === 'admin') {
        const tk = await post<{ accessToken: string; refreshToken: string }>('/auth/dev-login', {});
        tokens.set(tk.accessToken, tk.refreshToken);
        // 2026-05-27 fix: previously `await get<Me>('/users/me')` did fetch
        // /users/me but the response was thrown away — AuthContext.user
        // stayed null, so ProtectedRoute on /app bounced back to /login.
        // Hydrate the context properly so the navigation actually sticks.
        const me = await get<Me>('/users/me');
        await refreshUser();
        navigate(homePathForRole(me.role));
        return;
      }
      await login(email, password);
    } catch (e: unknown) {
      setErr(formatAuthError(e, { context: 'login' }));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async (idToken: string) => {
    setErr(null);
    setGoogleBusy(true);
    try {
      await loginWithGoogle(idToken);
    } catch (e: unknown) {
      setErr(formatAuthError(e, { context: 'login' }));
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <div className="mathema-app auth-shell">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <main className="screen login-screen">
            <header className="login-brand-row">
              <BrandLockup />
              <span className="age-pill">{t('login.subtitleClass')}</span>
            </header>

            <div className="login-layout">
              <section className="login-story" aria-labelledby="login-story-title">
                <div className="login-story-copy">
                  <span className="story-kicker"><Sparkles size={15} />{t('login.hero.kicker')}</span>
                  <h1 id="login-story-title">
                    {t('login.hero.title.pre')}<br />
                    <em>{t('login.hero.title.em')}</em>{t('login.hero.title.post')}
                  </h1>
                  <p>{t('login.tagline')}</p>
                </div>
                <LearningOrbit />
                <div className="login-benefits" aria-label={t('login.hero.benefitsAria')}>
                  <span><Camera size={17} />{t('login.hero.point.one')}</span>
                  <span><TrendingUp size={17} />{t('login.hero.point.two')}</span>
                  <span><Sparkles size={17} />{t('login.hero.point.three')}</span>
                </div>
              </section>

              <section className="login-form-panel" aria-labelledby="login-form-title">
                <div className="login-form-heading">
                  <span className="eyebrow">{t('login.eyebrow')}</span>
                  <h2 id="login-form-title">{t('login.form.title')}</h2>
                  <p>{t('login.form.sub')}</p>
                </div>

              {notice && (
                <div
                  role="status"
                  className="auth-notice"
                  onClick={() => setNotice(null)}
                >
                  {notice}
                </div>
              )}

              <form onSubmit={onSubmit} className="login-form">
                <div className="field">
                  <label htmlFor="login-email">{t('login.field.email')}</label>
                  <input
                    id="login-email"
                    type={emailInputType}
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="field">
                  <div className="field-label-row">
                    <label htmlFor="login-password">{t('login.field.password')}</label>
                    <Link to="/forgot-password">{t('login.forgotPw')}</Link>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••"
                  />
                </div>
                {err && (
                  <div className="auth-error" role="alert">{err}</div>
                )}
                <button className="btn login-submit" type="submit" disabled={busy}>
                  {busy ? t('login.busy') : t('login.submit')}
                  <ArrowRight size={18} />
                </button>
              </form>

              <AuthDivider labelKey="login.or" />
              <GoogleSignInButton
                mode="continue"
                onCredential={handleGoogleSignIn}
                onError={() => setErr(t('login.google.failed'))}
                busy={googleBusy}
                disabled={busy}
              />

                <div className="signup-prompt">
                  <span>{t('login.signupPrompt')}</span>
                  <Link to="/onboarding">{t('login.goOnboarding')} <ArrowRight size={15} /></Link>
                </div>
                <div className="login-trust"><ShieldCheck size={15} />{t('login.trust')}</div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ───────── Legacy compat for ForgotPassword / ResetPassword / VerifyEmail pages ─────────
// Minimal sage-styled shell + field. New pages should use Glyph + .mathema-app classes directly.
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mathema-app auth-shell">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <div className="screen auth-utility-screen">
            <div className="login-brand-row">
              <BrandLockup />
              <span className="age-pill">{subtitle}</span>
            </div>
            <div className="screen-body auth-utility-body">
              <div>
                <span className="eyebrow">{subtitle}</span>
                <h1 className="title">{title}</h1>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, type = 'text', value, onChange }: { label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
