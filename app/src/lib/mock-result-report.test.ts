import { describe, expect, it } from 'vitest';
import { normalizeScoreDelta, normalizeWeakAreas } from './mock-result-report';

describe('weak-area result report compatibility', () => {
  it('normalizes the new backend weak-area shape', () => {
    expect(normalizeWeakAreas([{
      conceptId: 'concept-1',
      code: 'ALG-01',
      name: '일차방정식',
      problemCount: 4,
      incorrectProblems: 2,
      accuracyPct: 50,
    }])).toEqual([{
      key: 'concept-1',
      name: '일차방정식',
      problemCount: 4,
      incorrectProblems: 2,
      accuracyPct: 50,
    }]);
  });

  it('ignores missing and malformed optional report fields safely', () => {
    expect(normalizeWeakAreas(undefined)).toEqual([]);
    expect(normalizeWeakAreas([null, {}, { name: '  ' }, { name: '함수', accuracyPct: 'bad' }]))
      .toEqual([{
        key: '함수-3',
        name: '함수',
        accuracyPct: null,
        problemCount: null,
        incorrectProblems: null,
      }]);
    expect(normalizeScoreDelta('12')).toBeNull();
    expect(normalizeScoreDelta(Number.NaN)).toBeNull();
  });

  it('preserves positive, zero, and negative score changes', () => {
    expect(normalizeScoreDelta(8)).toBe(8);
    expect(normalizeScoreDelta(0)).toBe(0);
    expect(normalizeScoreDelta(-6)).toBe(-6);
  });
});
