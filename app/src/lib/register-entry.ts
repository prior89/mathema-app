/**
 * The student acquisition funnel lives in /onboarding because that is where
 * goals, placement diagnostics, and the first weak-area profile are created.
 * The standalone form remains only for flows that cannot use that funnel:
 * guest upgrades and parent invitations.
 */
export function shouldUseStandaloneRegister(
  search: URLSearchParams,
  isGuest: boolean,
): boolean {
  if (search.get('upgrade') === '1') return isGuest;
  return search.get('role')?.trim().toLowerCase() === 'parent';
}
