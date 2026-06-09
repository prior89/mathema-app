import type { Me } from './queries';
import { homePathForRole } from './role-routes';

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
  if (role === 'STUDENT' && !me.gradeLevel && !onboardingCompletedLocally()) {
    return '/onboarding';
  }
  return homePathForRole(role);
}