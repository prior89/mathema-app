import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastHost } from './components/Toast';
import { LoadingSplash } from './components/Brand';
import { trackPageView } from './lib/analytics';
import { fetchMe } from './lib/queries';
import { useT } from './lib/i18n';

/**
 * Matheo — Sage 통합 앱 라우팅 (인도 PoC).
 *   /          → /app  (인증 후 단일 앱 진입점)
 *   /onboarding → 9 화면 sage 온보딩 → /app
 *   /login      → sage 로그인 (admin/admin PoC dev-login)
 *   /app/*      → MainAppPage (5탭 + lesson + settings)
 *
 *   옛 web UI (StudentDashboard / ParentDashboard / TeacherDashboard /
 *   ConceptHub / 옛 ConceptLessonPage / MathLearningApp) 는 라우팅에서 제외 —
 *   소스는 보존하되 진입 차단.
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
const VerifyRequiredPage = lazy(() => import('./pages/VerifyRequiredPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));

// 메인 sage 앱
const MainAppPage = lazy(() => import('./pages/MainAppPage'));

function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
}

/**
 * Country → language sync (country-strict, both directions).
 *   - User.country === 'KR'  → lang='ko' (always)
 *   - User.country !== 'KR'  → lang='en' (always — IN default, no Hindi v1)
 *
 * User.country is the ground truth. Saved localStorage is *ignored* because
 * (a) v1 has no language picker UI (project_mathema_v1_scope.md: EN-only
 *     ship, KO is country-driven not user-driven), and
 * (b) the earlier "respect saved" branch let stale 'ko' from a KR test
 *     session leak into the next IN admin login — every page rendered
 *     Korean for an India user. Country-strict overwrite prevents that.
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
    if (location.pathname.startsWith('/onboarding')) return;
    const want: 'ko' | 'en' = me.data.country === 'KR' ? 'ko' : 'en';
    if (lang !== want) setLang(want);
  }, [me.data, lang, setLang, location.pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <PageViewTracker />
      <I18nCountrySync />
      <Suspense fallback={<LoadingSplash />}>
        <Routes>
          {/* Auth flow */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
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

          {/* Main sage app — all post-auth UX */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <MainAppPage />
              </ProtectedRoute>
            }
          />

          {/* Root + legacy paths → consolidate to /app */}
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/student" element={<Navigate to="/app" replace />} />
          <Route path="/parent" element={<Navigate to="/app" replace />} />
          <Route path="/teacher" element={<Navigate to="/app" replace />} />
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

// /learn/:code → /app/learn/:code
function LegacyLessonRedirect() {
  const code = useLocation().pathname.split('/').pop() || '';
  return <Navigate to={`/app/learn/${code}`} replace />;
}
