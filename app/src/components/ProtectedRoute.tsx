import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../lib/queries';
import { LoadingSplash } from './Brand';

// Has the user reached the end of /onboarding (= ScreenReady.finalize ran
// to the localStorage write)? This is a SECONDARY signal — the backend's
// User.gradeLevel is the source of truth, but PATCH /users/me can fail
// transiently (offline, throttle, 5xx) and we don't want a temporary save
// miss to ricochet the user back into /onboarding from /app forever.
//
// Audit 2026-05-27: the prior guard was gradeLevel-only, so finalize()'s
// silent-catch on the PATCH meant any blip during onboarding left the
// account permanently stuck in /onboarding ↔ /app oscillation. P3
// separately makes finalize loud about that failure so the user can retry;
// this flag is the safety net so the user isn't trapped in the meantime.
function onboardingCompletedLocally(): boolean {
  try {
    const raw = localStorage.getItem('mathema.onboarding');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.completedAt;
  } catch {
    return false;
  }
}

type ProtectedRouteProps = {
  children: JSX.Element;
  /** When set, only these roles may access the route (PR-04b). */
  roles?: UserRole[];
};

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <LoadingSplash />;
  if (!user) {
    // Unauth → /login (preserve target so we return here after sign-in).
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  // Password sign-ups must prove they own the email before any learning or
  // billing surface is reachable. /users/me stays available server-side so
  // this guard can render the verification screen instead of logging out.
  if (!user.emailVerifiedAt && !location.pathname.startsWith('/verify-required')) {
    return <Navigate to="/verify-required" replace />;
  }
  // Google sign-up creates users without a class. Force them through the
  // NCERT picker (CLASS_7..CLASS_12) before /app/* is reachable — UNLESS
  // the user has already finished onboarding locally (PATCH may have just
  // missed a beat; we don't want to loop them).
  if (!user.gradeLevel && !onboardingCompletedLocally()) {
    return <Navigate to="/onboarding" replace />;
  }
  if (roles && roles.length > 0) {
    const userRole = user.role ?? 'STUDENT';
    if (!roles.includes(userRole)) {
      return <Navigate to="/app" replace />;
    }
  }
  return children;
}
