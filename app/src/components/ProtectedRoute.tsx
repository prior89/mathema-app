import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../lib/queries';
import { homePathForRole } from '../lib/role-routes';
import { onboardingCompletedLocally } from '../lib/post-auth-path';
import { guardianConsentSatisfied, requiresAgeProfile } from '../lib/guardian-consent';
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
  const userRole = user.role ?? 'STUDENT';
  // Guests carry zero PII (no birthDate, synthetic verified email), so the
  // age-profile and guardian gates don't apply — they re-engage at upgrade.
  const isGuest = user.isGuest === true;
  // Age profile (self-reported) required for all students — covers Google sign-in skips.
  if (
    userRole === 'STUDENT'
    && !isGuest
    && requiresAgeProfile(user.birthDate, userRole)
    && !location.pathname.startsWith('/onboarding')
  ) {
    return <Navigate to="/onboarding" replace />;
  }
  // Under-threshold minors: parent email confirmation before learning data.
  // IMPORTANT: This must be checked BEFORE email verification for new minor signups.
  // A fresh minor registers with guardianConsentPending. We must let them reach
  // /guardian-consent (and the parent verify link flow) even if email is not yet verified.
  // See checklist G3-C 3.19 and backend JwtAuthGuard allowsUnverifiedEmail + assertGuardianGate.
  if (
    userRole === 'STUDENT'
    && !isGuest
    && !guardianConsentSatisfied(user)
    && !location.pathname.startsWith('/guardian-consent')
    && !location.pathname.startsWith('/onboarding')
  ) {
    return <Navigate to="/guardian-consent" replace />;
  }

  // Password sign-ups must prove they own the email before any learning or
  // billing surface is reachable. /users/me stays available server-side so
  // this guard can render the verification screen instead of logging out.
  //
  // Exception for guardian consent flow: minors who just registered may land here
  // with guardianConsentPending=true while emailVerifiedAt is still null.
  // The guardian consent page (and its verify sibling) are exempted so the parent
  // email request + verification can complete before forcing email OTP.
  const isGuardianFlow = location.pathname.startsWith('/guardian-consent');
  if (!user.emailVerifiedAt && !location.pathname.startsWith('/verify-required') && !isGuardianFlow) {
    return <Navigate to="/verify-required" replace />;
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
