import {
  FREE_TIER_SOLVER_LIMIT,
  GRACE_PERIOD_DAYS,
  GRACE_SOLVER_LIMIT,
} from './billing.constants';
import { computeSolverGraceState } from './solver-quota-grace.util';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

describe('computeSolverGraceState', () => {
  const createdAt = new Date('2026-06-01T12:00:00.000Z');

  it('returns grace limit on signup day', () => {
    const state = computeSolverGraceState(createdAt, createdAt);
    expect(state.inGrace).toBe(true);
    expect(state.limit).toBe(GRACE_SOLVER_LIMIT);
    expect(state.graceEndsAt.getTime()).toBe(
      createdAt.getTime() + GRACE_PERIOD_DAYS * MS_PER_DAY,
    );
  });

  it('returns grace limit on day 6 after signup', () => {
    const now = new Date(createdAt.getTime() + (GRACE_PERIOD_DAYS - 1) * MS_PER_DAY);
    const state = computeSolverGraceState(createdAt, now);
    expect(state.inGrace).toBe(true);
    expect(state.limit).toBe(GRACE_SOLVER_LIMIT);
  });

  it('returns standard limit once grace window ends', () => {
    const now = new Date(createdAt.getTime() + GRACE_PERIOD_DAYS * MS_PER_DAY);
    const state = computeSolverGraceState(createdAt, now);
    expect(state.inGrace).toBe(false);
    expect(state.limit).toBe(FREE_TIER_SOLVER_LIMIT);
  });

  it('returns standard limit well after grace window', () => {
    const now = new Date(createdAt.getTime() + 30 * MS_PER_DAY);
    const state = computeSolverGraceState(createdAt, now);
    expect(state.inGrace).toBe(false);
    expect(state.limit).toBe(FREE_TIER_SOLVER_LIMIT);
  });
});