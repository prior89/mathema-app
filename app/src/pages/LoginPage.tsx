/* LoginPage — sage-themed mobile-app login.
 * PoC: admin/admin → dev-login. Regular email/password also supported.
 * Also re-exports AuthShell + Field for legacy ForgotPassword/ResetPassword/VerifyEmail pages.
 */
import { ReactNode } from 'react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { post, tokens, get } from '../lib/api';
import type { Me } from '../lib/queries';
import { useT } from '../lib/i18n';
import { Glyph } from '../components/onboarding/Glyph';
import { BrandLogo } from '../components/Brand';
import '../styles/onboarding.css';

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ?? '';

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
      return null;
    } catch { return null; }
  });
  const [busy, setBusy] = useState(false);
  const gsiRef = useRef<HTMLDivElement | null>(null);

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
        await refreshUser();
        navigate('/app');
        return;
      }
      await login(email, password);
      navigate('/app');
    } catch (e: any) {
      // P4 fix 2026-05-27: surface 429 / network as actionable copy instead of
      // raw backend message. Locale picked from localStorage since LoginPage
      // sits before any country gate.
      const isKR = (() => { try { return localStorage.getItem('mathema.lang') === 'ko'; } catch { return false; } })();
      const status = e?.response?.status;
      if (status === 429) {
        setErr(isKR
          ? '로그인 시도가 너무 많아요. 잠시 후 다시 시도해주세요.'
          : 'Too many login attempts. Please retry in a minute.');
      } else if (!status) {
        setErr(isKR
          ? '서버에 연결할 수 없어요. 인터넷 연결을 확인해주세요.'
          : 'Cannot reach the server. Check your connection.');
      } else {
        setErr(e?.response?.data?.error?.message ?? t('login.failed'));
      }
    } finally {
      setBusy(false);
    }
  };

  // Google Identity Services — VITE_GOOGLE_CLIENT_ID 가 설정된 경우만 활성화.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !gsiRef.current) return;
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
            navigate('/app');
          } catch (e: any) {
            const isKR = (() => { try { return localStorage.getItem('mathema.lang') === 'ko'; } catch { return false; } })();
            const status = e?.response?.status;
            if (status === 429) {
              setErr(isKR
                ? '로그인 시도가 너무 많아요. 잠시 후 다시 시도해주세요.'
                : 'Too many login attempts. Please retry in a minute.');
            } else if (!status) {
              setErr(isKR
                ? '서버에 연결할 수 없어요. 인터넷 연결을 확인해주세요.'
                : 'Cannot reach the server. Check your connection.');
            } else {
              setErr(e?.response?.data?.error?.message ?? t('login.google.failed'));
            }
          } finally {
            setBusy(false);
          }
        },
      });
      g.accounts.id.renderButton(gsiRef.current, {
        theme: 'outline',
        size: 'large',
        width: 280,
        text: 'continue_with',
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
  }, [loginWithGoogle, navigate]);

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

              {GOOGLE_CLIENT_ID && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
                    <span className="caption" style={{ fontSize: 11 }}>{t('login.or')}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--p-border)' }} />
                  </div>
                  <div ref={gsiRef} style={{ display: 'flex', justifyContent: 'center' }} />
                </div>
              )}

              {/* PoC dev-login hint card removed per user request 2026-05-27 —
                  surfaced even in dogfood builds via import.meta.env.DEV and
                  felt like a leaked internal note. The admin/admin shortcut
                  still works for development; the on-screen reminder just
                  isn't shown anymore. */}

              <div style={{ flex: 1 }} />

              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link to="/onboarding" style={{ color: 'var(--p-primary)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
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
