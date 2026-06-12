import type { Me } from './queries';
import { homePathForRole } from './role-routes';
import { guardianConsentSatisfied, requiresAgeProfile } from './guardian-consent';

/** Mirrors ProtectedRoute — local flag covers transient PATCH misses during onboarding. */
export function onboardingCompletedLocally(): boolean {
  try {
    const raw = localStorage.getItem('mathema.onboarding');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.completedAt;
  } catch {
    return false;
  }
}

/** Where to land after password / Google / register auth succeeds. */
export function postAuthPath(me: Me): string {
  const role = me.role ?? 'STUDENT';
  const isGuest = me.isGuest === true;
  if (role === 'STUDENT' && !isGuest && requiresAgeProfile(me.birthDate, role)) {
    return '/onboarding';
  }
  if (role === 'STUDENT' && !isGuest && !guardianConsentSatisfied(me)) {
    return '/guardian-consent';
  }
  if (role === 'STUDENT' && !me.gradeLevel && !onboardingCompletedLocally()) {
    return '/onboarding';
  }
  return homePathForRole(role);
}