import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  post,
  tokens,
  get,
  restoreStoredSession,
  revokeRefreshToken,
} from '../lib/api';
import type { Me, GradeLevel, CountryCode } from '../lib/queries';
import { postAuthPath } from '../lib/post-auth-path';
import { unregisterPushToken } from '../native/push-bridge';
import { track } from '../lib/analytics';
import { clearSentryUser, tagSentryUser } from '../lib/sentry';

export type { GradeLevel };

type AuthState = {
  user: Me | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string, opts?: { skipNavigate?: boolean }) => Promise<Me>;
  register: (input: RegisterInput) => Promise<void>;
  /** Try-first guest session — zero-PII account, no navigation (caller decides). */
  startGuest: (input?: GuestStartInput) => Promise<Me>;
  logout: () => Promise<void>;
  completeAccountDeletion: () => Promise<void>;
  /** Re-fetch /users/me and replace the cached user. Onboarding calls this
   *  after PATCH /users/me so ProtectedRoute drops the !gradeLevel guard. */
  refreshUser: () => Promise<void>;
};

export type RegisterRole = 'STUDENT' | 'PARENT' | 'TEACHER';

/**
 * 명세서 §1 — 역할별 가입.
 *   STUDENT: examDate/targetGrade/gradeLevel 입력
 *   PARENT : childEmail (자녀가 미리 가입돼 있어야 함)
 *   TEACHER: tenantCode (선택 — 없으면 solo)
 */
export type RegisterInput = {
  email: string; password: string; name: string;
  role: RegisterRole;
  // STUDENT 전용
  birthDate?: string;
  examDate?: string; targetGrade?: number; gradeLevel?: GradeLevel;
  // PARENT 전용
  childEmail?: string;
  // TEACHER 전용 (선택)
  tenantCode?: string;
  // Country chip (IN | KR | ...). Optional — backend defaults to IN when
  // missing for back-compat with the pre-2026-05-24 onboarding flow.
  country?: CountryCode;
  // Minor student — parent contact (sent during signup)
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  // DPDP/GDPR (adults only — minors must not self-grant optional consents)
  consentAnalytics?: boolean; consentMarketing?: boolean; consentAiTraining?: boolean;
};

export type GuestStartInput = {
  country?: RegisterInput['country'];
  gradeLevel?: GradeLevel;
};

const Ctx = createContext<AuthState | null>(null);

// Demo auto-login — only honoured in dev builds. import.meta.env.PROD is set
// by Vite at build time, so this short-circuits to false in any prod build
// regardless of env vars present. Demo credentials must come from the
// developer's local .env — there are no literal fallbacks so a prod bundle
// can never embed real credentials, even if VITE_ENABLE_DEMO_AUTO_LOGIN is
// accidentally true.
const DEMO_EMAIL = (import.meta as any).env?.VITE_DEMO_EMAIL ?? '';
const DEMO_PASSWORD = (import.meta as any).env?.VITE_DEMO_PASSWORD ?? '';
const DEMO_AUTO_LOGIN =
  !import.meta.env.PROD &&
  (import.meta as any).env?.VITE_ENABLE_DEMO_AUTO_LOGIN === 'true' &&
  DEMO_EMAIL.length > 0 &&
  DEMO_PASSWORD.length > 0;

function isAuthRejection(e: any): boolean {
  const status = e?.response?.status;
  const code = e?.response?.data?.error?.code ?? e?.response?.data?.code;
  return status === 401
    || status === 403
    || code === 'device_displaced'
    || code === 'device_mismatch'
    || code === 'token_revoked'
    || code === 'invalid_refresh_token';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // P5 fix 2026-05-27: react to the api.ts 'matheo:auth-rejected' event
  // (dispatched when /auth/refresh fails with a genuine auth rejection — 401,
  // 403, device_displaced, etc.). Replaces the prior hard window.location
  // redirect: we clear the React Query cache, drop the in-memory user, then
  // navigate via React Router. Single-page transition + no white flash.
  useEffect(() => {
    const onAuthRejected = () => {
      (window as any).__matheoAuthHandled = true;
      try { queryClient.clear(); } catch { /* ignore */ }
      setUser(null);
      if (!window.location.pathname.startsWith('/login')) {
        navigate('/login', { replace: true });
      }
      // Reset the handled flag on next tick so future events fire normally.
      setTimeout(() => { (window as any).__matheoAuthHandled = false; }, 500);
    };
    window.addEventListener('matheo:auth-rejected', onAuthRejected);
    return () => window.removeEventListener('matheo:auth-rejected', onAuthRejected);
  }, [navigate, queryClient]);

  useEffect(() => {
    const onBillingRedirect = (event: Event) => {
      const path = (event as CustomEvent<{ path?: string }>).detail?.path;
      if (!path?.startsWith('/app/paywall')) return;
      (window as any).__matheoBillingRedirectHandled = true;
      navigate(path, { replace: true });
    };
    window.addEventListener('matheo:billing-redirect', onBillingRedirect);
    return () => window.removeEventListener('matheo:billing-redirect', onBillingRedirect);
  }, [navigate]);

  useEffect(() => {
    if (user) tagSentryUser({ id: user.id });
    else clearSentryUser();
  }, [user?.id]);

  useEffect(() => {
    const init = async () => {
      if (!tokens.get() && tokens.getRefresh()) {
        try {
          await restoreStoredSession();
        } catch (e) {
          if (isAuthRejection(e)) {
            tokens.clear();
            try { sessionStorage.setItem('matheo.loginNotice', 'session_expired'); } catch {
              // Storage may be unavailable in private or embedded contexts.
            }
          }
          setReady(true);
          return;
        }
      }

      if (!tokens.get()) {
        // 토큰 없음 + 데모 모드 비활성화 → 무인증 상태로 진입 (ProtectedRoute가 /login 으로 리다이렉트).
        if (!DEMO_AUTO_LOGIN) {
          setReady(true);
          return;
        }
        // 데모 모드: 시드 계정으로 자동 로그인 시도.
        try {
          const t = await post<{ accessToken: string; refreshToken: string }>('/auth/login', {
            email: DEMO_EMAIL, password: DEMO_PASSWORD,
          });
          tokens.set(t.accessToken, t.refreshToken);
          const me = await get<Me>('/users/me');
          setUser(me);
        } catch {
          // 시드 없거나 백엔드 꺼짐 → 무인증 유지
        } finally {
          setReady(true);
        }
        return;
      }
      try {
        const me = await get<Me>('/users/me');
        setUser(me);
      } catch (e) {
        // Do not erase a valid-looking local session just because the backend
        // or network had a transient startup hiccup. api.ts already clears
        // tokens when /auth/refresh fails with a real auth rejection; this
        // boot path should only clear on that same class of errors.
        if (isAuthRejection(e)) tokens.clear();
      } finally {
        setReady(true);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const t = await post<{ accessToken: string; refreshToken: string }>('/auth/login', { email, password });
    tokens.set(t.accessToken, t.refreshToken);
    const me = await get<Me>('/users/me');
    setUser(me);
    track('auth.login', { method: 'password' });
    navigate(postAuthPath(me));
  };

  /** Google Sign-In — Web GIS or Capacitor plugin 이 발급한 idToken 으로 백엔드 인증. */
  const loginWithGoogle = async (idToken: string, opts?: { skipNavigate?: boolean }) => {
    const t = await post<{ accessToken: string; refreshToken: string }>('/auth/google/id-token', { idToken });
    tokens.set(t.accessToken, t.refreshToken);
    const me = await get<Me>('/users/me');
    setUser(me);
    track('auth.login', { method: 'google' });
    if (!opts?.skipNavigate) {
      navigate(postAuthPath(me));
    }
    return me;
  };

  const register = async (input: RegisterInput) => {
    const t = await post<{ accessToken: string; refreshToken: string }>('/auth/register', input);
    tokens.set(t.accessToken, t.refreshToken);
    const me = await get<Me>('/users/me');
    setUser(me);
    track('auth.register', { role: input.role, targetGrade: input.targetGrade });
    navigate(postAuthPath(me));
  };

  const startGuest = async (input: GuestStartInput = {}) => {
    const t = await post<{ accessToken: string; refreshToken: string }>('/auth/guest/start', input);
    tokens.set(t.accessToken, t.refreshToken);
    const me = await get<Me>('/users/me');
    setUser(me);
    track('auth.guest_start', { country: input.country });
    return me;
  };

  const logout = async () => {
    track('auth.logout');
    const refreshToken = tokens.getRefresh();
    await unregisterPushToken().catch(() => {});
    tokens.clear();
    sessionStorage.clear();
    queryClient.clear();
    setUser(null);
    await revokeRefreshToken(refreshToken).catch(() => {});
    navigate('/login', { replace: true });
  };

  const completeAccountDeletion = async () => {
    const refreshToken = tokens.getRefresh();
    tokens.clear();
    sessionStorage.clear();
    queryClient.clear();
    setUser(null);
    // The account deletion transaction already removes the server push token.
    // Clearing auth first makes unregisterPushToken perform local/native cleanup only.
    await Promise.allSettled([
      unregisterPushToken(),
      revokeRefreshToken(refreshToken),
    ]);
    navigate('/login', { replace: true });
  };

  const refreshUser = async () => {
    try {
      const me = await get<Me>('/users/me');
      setUser(me);
    } catch {
      /* leave existing user — caller likely just made a partial update */
    }
  };

  return (
    <Ctx.Provider value={{
      user,
      ready,
      login,
      loginWithGoogle,
      register,
      startGuest,
      logout,
      completeAccountDeletion,
      refreshUser,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthProvider not mounted');
  return v;
}
