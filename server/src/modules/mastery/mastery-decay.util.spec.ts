import {
  applyMasteryDecay,
  MASTERY_DECAY_FLOOR,
  MASTERY_DECAY_GRACE_DAYS,
} from './mastery-decay.util';

const DAY = 86_400_000;
const NOW = new Date('2026-06-12T00:00:00Z').getTime();
const daysAgo = (n: number) => new Date(NOW - n * DAY);

describe('applyMasteryDecay', () => {
  it('returns the score unchanged when lastAttemptAt is missing', () => {
    expect(applyMasteryDecay(80, null, NOW)).toBe(80);
    expect(applyMasteryDecay(80, undefined, NOW)).toBe(80);
  });

  it('does not decay inside the grace window', () => {
    expect(applyMasteryDecay(80, daysAgo(0), NOW)).toBe(80);
    expect(applyMasteryDecay(80, daysAgo(MASTERY_DECAY_GRACE_DAYS), NOW)).toBe(80);
  });

  it('decays 0.5/day after the grace window', () => {
    expect(applyMasteryDecay(80, daysAgo(MASTERY_DECAY_GRACE_DAYS + 10), NOW)).toBe(75);
    expect(applyMasteryDecay(80, daysAgo(MASTERY_DECAY_GRACE_DAYS + 40), NOW)).toBe(60);
  });

  it('never decays below the floor', () => {
    expect(applyMasteryDecay(80, daysAgo(365), NOW)).toBe(MASTERY_DECAY_FLOOR);
  });

  it('keeps already-low scores untouched (floor = current score)', () => {
    expect(applyMasteryDecay(20, daysAgo(365), NOW)).toBe(20);
  });
});
