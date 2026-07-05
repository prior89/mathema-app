/* LoginPage — sage-themed mobile-app login.
 * PoC: admin/admin → dev-login. Regular email/password also supported.
 * Also re-exports AuthShell + Field for legacy ForgotPassword/ResetPassword/VerifyEmail pages.
 */
import { ReactNode } from 'react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { post, tokens, get } from '../lib/api';
import type { Me } from '../lib/queries';
import { homePathForRole } from '../lib/role-routes';
import { useT } from '../lib/i18n';
import { Glyph } from '../components/onboarding/Glyph';
import { BrandLogo } from '../components/Brand';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { AuthDivider } from '../components/auth/AuthDivider';
import { formatAuthError } from '../lib/auth-errors';
import { isGoogleSignInConfigured } from '../lib/google-client-id';
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
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <div className="screen">
            <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <BrandLogo size="sm" />
              <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>{t('login.subtitleClass')}</span>
            </div>

            <div className="screen-body" style={{ gap: 24, paddingTop: 32 }}>
              <div>
                <span className="eyebrow">{t('login.eyebrow')}</span>
                <h1 className="display" style={{ marginTop: 10, fontSize: 36, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                  <span>{t('login.title.short')}</span>
                  <BrandLogo size="md" />
                </h1>
                <p className="subtitle">{t('login.tagline')}</p>
              </div>

              {notice && (
                <div
                  role="status"
                  style={{
                    padding: '10px 12px', borderRadius: 8, fontSize: 13,
                    background: 'var(--p-surface-2)', border: '1px solid var(--p-border)',
                    color: 'var(--p-ink)',
                  }}
                  onClick={() => setNotice(null)}
                >
                  {notice}
                </div>
              )}

              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="field">
                  <label>{t('login.field.email')}</label>
                  <input
                    type={emailInputType}
                    inputMode="email"
                    autoFocus
                    autoCapitalize="none"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="field">
                  <label>{t('login.field.password')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••"
                  />
                </div>
                {err && (
                  <div style={{ color: 'var(--p-danger)', fontSize: 13 }}>{err}</div>
                )}
                <button className="btn" type="submit" disabled={busy} style={{ marginTop: 4 }}>
                  {busy ? t('login.busy') : t('login.submit')}
                  <Glyph.ChevronR />
                </button>
              </form>

              {isGoogleSignInConfigured() && (
                <>
                  <AuthDivider labelKey="login.or" />
                  <GoogleSignInButton
                    mode="continue"
                    onCredential={handleGoogleSignIn}
                    onError={() => setErr(t('login.google.failed'))}
                    busy={googleBusy}
                    disabled={busy}
                  />
                </>
              )}

              {/* PoC dev-login hint card removed per user request 2026-05-27 —
                  surfaced even in dogfood builds via import.meta.env.DEV and
                  felt like a leaked internal note. The admin/admin shortcut
                  still works for development; the on-screen reminder just
                  isn't shown anymore. */}

              <div style={{ flex: 1 }} />

              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link
                  to="/onboarding"
                  className="btn outline"
                  style={{ height: 44, maxWidth: 240, alignSelf: 'center', textDecoration: 'none' }}
                >
                  {t('login.goOnboarding')}
                </Link>
                <Link to="/forgot-password" style={{ color: 'var(--p-muted)', fontSize: 12, textDecoration: 'none' }}>
                  {t('login.forgotPw')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────── Legacy compat for ForgotPassword / ResetPassword / VerifyEmail pages ─────────
// Minimal sage-styled shell + field. New pages should use Glyph + .mathema-app classes directly.
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <div className="screen">
            <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <BrandLogo size="sm" />
              <span className="caption" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>{subtitle}</span>
            </div>
            <div className="screen-body" style={{ gap: 24, paddingTop: 32 }}>
              <div>
                <span className="eyebrow">{subtitle}</span>
                <h1 className="title" style={{ marginTop: 10, fontSize: 28 }}>{title}</h1>
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
