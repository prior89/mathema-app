import type { Me } from './queries';
import { homePathForRole } from './role-routes';
import { guardianConsentSatisfied, requiresAgeProfile } from './guardian-consent';

/** Mirrors ProtectedRoute — local flag covers transient PATCH misses during onboarding. */
export function onboardingCompletedLocally(userId?: string | null): boolean {
  if (!userId) return false;
  try {
    const raw = localStorage.getItem('mathema.onboarding');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.userId === userId && !!parsed?.completedAt;
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
  if (role === 'STUDENT' && !me.gradeLevel && !onboardingCompletedLocally(me.id)) {
    return '/onboarding';
  }
  return homePathForRole(role);
}

/** Preserve only same-app relative deep links after authentication. Auth and
 *  guardian/onboarding gates always win over the requested destination. */
export function resolvePostAuthPath(me: Me, requestedPath?: string | null): string {
  const gatedPath = postAuthPath(me);
  if (!requestedPath || !requestedPath.startsWith('/') || requestedPath.startsWith('//')) {
    return gatedPath;
  }
  const role = me.role ?? 'STUDENT';
  const roleRoot = homePathForRole(role);
  if (gatedPath !== roleRoot) return gatedPath;

  const allowedPrefix = role === 'STUDENT' ? '/app' : roleRoot;
  if (requestedPath === allowedPrefix || requestedPath.startsWith(`${allowedPrefix}/`)) {
    return requestedPath;
  }
  return gatedPath;
}
