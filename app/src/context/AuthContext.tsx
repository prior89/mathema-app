import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { post, tokens, get } from '../lib/api';
import type { Me, GradeLevel } from '../lib/queries';
import { track } from '../lib/analytics';

export type { GradeLevel };

type AuthState = {
  user: Me | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
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
  examDate?: string; targetGrade?: number; gradeLevel?: GradeLevel;
  // PARENT 전용
  childEmail?: string;
  // TEACHER 전용 (선택)
  tenantCode?: string;
  // DPDP/GDPR
  consentAnalytics?: boolean; consentMarketing?: boolean; consentAiTraining?: boolean;
};

const Ctx = createContext<AuthState | null>(null);

// Demo auto-login — only honoured in dev builds. The earlier check looked at
// VITE_ENABLE_DEMO_AUTO_LOGIN alone, which meant a misconfigured CI env var
// would silently ship a prod bundle that auto-logs every visitor in as the
// demo admin. import.meta.env.PROD is set by Vite at build time, so this
// short-circuits to false in any prod build regardless of env vars present.
const DEMO_AUTO_LOGIN =
  !import.meta.env.PROD &&
  (import.meta as any).env?.VITE_ENABLE_DEMO_AUTO_LOGIN === 'true';
const DEMO_EMAIL = (import.meta as any).env?.VITE_DEMO_EMAIL ?? 'polopot123@gmail.com';
const DEMO_PASSWORD = (import.meta as any).env?.VITE_DEMO_PASSWORD ?? 'password1234';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
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
      } catch {
        tokens.clear();
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
    navigate('/');
  };

  /** Google Sign-In — Web GIS or Capacitor plugin 이 발급한 idToken 으로 백엔드 인증. */
  const loginWithGoogle = async (idToken: string) => {
    const t = await post<{ accessToken: string; refreshToken: string }>('/auth/google/id-token', { idToken });
    tokens.set(t.accessToken, t.refreshToken);
    const me = await get<Me>('/users/me');
    setUser(me);
    track('auth.login', { method: 'google' });
    navigate('/');
  };

  const register = async (input: RegisterInput) => {
    const t = await post<{ accessToken: string; refreshToken: string }>('/auth/register', input);
    tokens.set(t.accessToken, t.refreshToken);
    const me = await get<Me>('/users/me');
    setUser(me);
    track('auth.register', { role: input.role, targetGrade: input.targetGrade });
    navigate('/');
  };

  const logout = async () => {
    track('auth.logout');
    tokens.clear();
    sessionStorage.clear();
    setUser(null);
    // 데모 모드에서만 로그아웃 직후 시드 계정으로 재진입.
    // production: /login 으로 이동.
    if (DEMO_AUTO_LOGIN) {
      try {
        const t = await post<{ accessToken: string; refreshToken: string }>('/auth/login', {
          email: DEMO_EMAIL, password: DEMO_PASSWORD,
        });
        tokens.set(t.accessToken, t.refreshToken);
        const me = await get<Me>('/users/me');
        setUser(me);
        navigate('/');
        return;
      } catch {/* fall through */}
    }
    navigate('/login');
  };

  const refreshUser = async () => {
    try {
      const me = await get<Me>('/users/me');
      setUser(me);
    } catch {
      /* leave existing user — caller likely just made a partial update */
    }
  };

  return <Ctx.Provider value={{ user, ready, login, loginWithGoogle, register, logout, refreshUser }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthProvider not mounted');
  return v;
}
