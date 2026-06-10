import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../lib/queries';
import { homePathForRole } from '../lib/role-routes';
import { onboardingCompletedLocally } from '../lib/post-auth-path';
import { guardianConsentSatisfied } from '../lib/guardian-consent';
import { LoadingSplash } from './Brand';

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
  const userRole = user.role ?? 'STUDENT';
  if (
    userRole === 'STUDENT'
    && !guardianConsentSatisfied(user)
    && !location.pathname.startsWith('/guardian-consent')
  ) {
    return <Navigate to="/guardian-consent" replace />;
  }
  // Google sign-up creates users without a class. Force them through the
  // NCERT picker (CLASS_7..CLASS_12) before /app/* is reachable — UNLESS
  // the user has already finished onboarding locally (PATCH may have just
  // missed a beat; we don't want to loop them). PARENT/TEACHER skip this.
  if (
    userRole === 'STUDENT'
    && !user.gradeLevel
    && !onboardingCompletedLocally()
  ) {
    return <Navigate to="/onboarding" replace />;
  }
  if (roles && roles.length > 0) {
    if (!roles.includes(userRole)) {
      return <Navigate to={homePathForRole(userRole)} replace />;
    }
  }
  return children;
}
