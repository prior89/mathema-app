import type { UserRole } from './queries';

/** Post-auth landing path per role (PR-27). */
export function homePathForRole(role?: UserRole | null): string {
  switch (role) {
    case 'PARENT':
      return '/parent';
    case 'TEACHER':
      return '/teacher';
    default:
      return '/app';
  }
}