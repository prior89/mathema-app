import { useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';

export type FeatureFlags = {
  adaptive_diagnostic: boolean;
  first_session_achievement: boolean;
  kr_cold_start: boolean;
  student_efficacy_card: boolean;
  /** Try-first guest mode — pre-auth evaluation, effectively 0 or 100 only. */
  guest_mode: boolean;
};

type FeaturesResponse = {
  flags: FeatureFlags;
  rolloutPct: Record<keyof FeatureFlags, number>;
};

export function useFeatureFlags() {
  return useQuery({
    queryKey: ['config', 'features'],
    queryFn: () => get<FeaturesResponse>('/config/features'),
    staleTime: 5 * 60_000,
  });
}

export function useFeatureFlag(name: keyof FeatureFlags): boolean {
  const q = useFeatureFlags();
  return q.data?.flags[name] ?? false;
}