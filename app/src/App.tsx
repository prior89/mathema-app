import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastHost } from './components/Toast';
import { LoadingSplash } from './components/Brand';
import { trackPageView } from './lib/analytics';

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

// 메인 sage 앱
const MainAppPage = lazy(() => import('./pages/MainAppPage'));

function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
}

export default function App() {
  return (
    <>
      <PageViewTracker />
      <Suspense fallback={<LoadingSplash />}>
        <Routes>
          {/* Auth flow */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

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
