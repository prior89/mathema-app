import {
  FREE_TIER_SOLVER_LIMIT,
  GRACE_PERIOD_DAYS,
  GRACE_SOLVER_LIMIT,
} from './billing.constants';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface SolverGraceState {
  inGrace: boolean;
  graceEndsAt: Date;
  limit: number;
}

/** Pure grace-window evaluator — shared by QuotaService and unit tests. */
export function computeSolverGraceState(
  createdAt: Date,
  now: Date = new Date(),
): SolverGraceState {
  const graceEndsAt = new Date(createdAt.getTime() + GRACE_PERIOD_DAYS * MS_PER_DAY);
  const inGrace = now.getTime() < graceEndsAt.getTime();
  return {
    inGrace,
    graceEndsAt,
    limit: inGrace ? GRACE_SOLVER_LIMIT : FREE_TIER_SOLVER_LIMIT,
  };
}