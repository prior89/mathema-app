import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastHost } from './components/Toast';
import { LoadingSplash } from './components/Brand';
import { useAuth } from './context/AuthContext';
import { trackPageView } from './lib/analytics';
import { fetchMe } from './lib/queries';
import { homePathForRole } from './lib/role-routes';
import { useT } from './lib/i18n';
import { resolveAppLang } from './lib/lang-preference';
import { useBillingRecovery } from './hooks/useBillingRecovery';
import { usePushSync } from './hooks/usePushSync';

/**
 * Matheo — Sage 통합 앱 라우팅 (인도 PoC).
 *   /          → /app  (인증 후 단일 앱 진입점)
 *   /onboarding → 9 화면 sage 온보딩 → /app
 *   /login      → sage 로그인 (admin/admin PoC dev-login)
 *   /app/*      → MainAppPage (5탭 + lesson + settings) — STUDENT
 *   /parent     → ParentDashboardPage — PARENT (PR-27)
 *   /teacher    → TeacherDashboardPage — TEACHER (PR-27)
 *
 *   옛 web UI (StudentDashboard / ConceptHub / 옛 ConceptLessonPage /
 *   MathLearningApp) 는 라우팅에서 제외 — 소스는 보존하되 진입 차단.
 *
 *   /settings, /learn/:code 는 sage 화면으로 redirect 처리 (외부 링크 호환).
 */

// 인증 진입점
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ParentLinkApprovePage = lazy(() => import('./pages/ParentLinkApprovePage'));
const GuardianConsentPage = lazy(() => import('./pages/GuardianConsentPage'));
const GuardianConsentVerifyPage = lazy(() => import('./pages/GuardianConsentVerifyPage'));
const VerifyRequiredPage = lazy(() => import('./pages/VerifyRequiredPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));

// 메인 sage 앱
const MainAppPage = lazy(() => import('./pages/MainAppPage'));
const ParentDashboardPage = lazy(() => import('./pages/ParentDashboardPage'));
const TeacherDashboardPage = lazy(() => import('./pages/TeacherDashboardPage'));

function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
}

/**
 * Language sync when preference is "auto" (Settings → Language → Match country).
 *   - KR account → ko, else → en
 * Explicit ko/en/hi choice in Settings overrides until the user picks Auto again.
 *
 * Mounted once at app root. fetchMe 401s pre-auth (silent — me.data stays
 * undefined, effect no-ops). Once auth resolves the effect fires once per
 * country change and triggers exactly one setLang() → 50ms page reload.
 */
function I18nCountrySync() {
  const { lang, setLang } = useT();
  const location = useLocation();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe, retry: false });
  useEffect(() => {
    if (!me.data) return;
    // BUG FIX 2026-05-27: skip lang flip while the user is on /onboarding.
    // setLang() reloads the page in 50ms — if it fires mid-onboarding
    // (e.g., right after /auth/register sets tokens, me.data resolves with
    // country=IN while the browser still has lang='ko' from a prior KR
    // dogfood session), the reload wipes the onboarding React state and
    // bounces the user back to welcome, eventually landing on /login.
    // Once onboarding completes and routes to /app, this effect runs and
    // does the country→lang flip exactly once.
    if (location.pathname.startsWith('/onboarding') || location.pathname.startsWith('/guardian-consent')) return;
    const want = resolveAppLang(me.data.country);
    if (lang !== want) setLang(want);
  }, [me.data, lang, setLang, location.pathname]);
  return null;
}

function PushSync() {
  usePushSync();
  return null;
}

function BillingRecoverySync() {
  useBillingRecovery();
  return null;
}

export default function App() {
  return (
    <>
      <PageViewTracker />
      <I18nCountrySync />
      <PushSync />
      <BillingRecoverySync />
      <Suspense fallback={<LoadingSplash />}>
        <Routes>
          {/* Auth flow */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/parent-link/approve" element={<ParentLinkApprovePage action="approve" />} />
          <Route path="/parent-link/reject" element={<ParentLinkApprovePage action="reject" />} />
          <Route path="/guardian-consent/verify" element={<GuardianConsentVerifyPage />} />
          <Route
            path="/guardian-consent"
            element={
              <ProtectedRoute>
                <GuardianConsentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-required"
            element={
              <ProtectedRoute>
                <VerifyRequiredPage />
              </ProtectedRoute>
            }
          />
          {/* Public Privacy / Terms routes — reachable without login so the
              Play Store / DPDP "Privacy URL" requirement is satisfied. */}
          <Route path="/privacy" element={<PolicyPage kind="privacy" />} />
          <Route path="/terms" element={<PolicyPage kind="terms" />} />

          {/* Main sage app — student learning shell */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute roles={['STUDENT', 'ADMIN']}>
                <MainAppPage />
              </ProtectedRoute>
            }
          />

          {/* Role dashboards (PR-27) */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute roles={['PARENT']}>
                <ParentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute roles={['TEACHER']}>
                <TeacherDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Root + legacy paths */}
          <Route path="/" element={<RoleHomeRedirect />} />
          <Route path="/student" element={<Navigate to="/app" replace />} />
          <Route path="/learn" element={<Navigate to="/app/learn" replace />} />
          <Route path="/learn/:code" element={<LegacyLessonRedirect />} />
          <Route path="/settings" element={<Navigate to="/app/me/settings" replace />} />
          <Route path="/app-legacy" element={<Navigate to="/app" replace />} />

          {/* Unknown paths → /app (or /login via ProtectedRoute if unauth) */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </Suspense>
      <ToastHost />
    </>
  );
}

function RoleHomeRedirect() {
  const { user, ready } = useAuth();
  if (!ready) return <LoadingSplash />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={homePathForRole(user.role)} replace />;
}

// /learn/:code → /app/learn/:code
function LegacyLessonRedirect() {
  const code = useLocation().pathname.split('/').pop() || '';
  return <Navigate to={`/app/learn/${code}`} replace />;
}
