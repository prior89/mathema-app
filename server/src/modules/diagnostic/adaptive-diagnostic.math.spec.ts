import {
  buildConceptScores,
  meanStandardError,
  placementScoreForConcept,
  shouldStopAdaptive,
  standardErrorForConcept,
  targetDifficultyLevel,
} from './adaptive-diagnostic.math';

describe('adaptive-diagnostic.math', () => {
  it('computes placement score with confidence weighting', () => {
    const score = placementScoreForConcept([
      { isCorrect: true, confidence: 4 },
      { isCorrect: false, confidence: 2 },
    ]);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('lowers SE as attempts accumulate', () => {
    const se1 = standardErrorForConcept([{ confidence: 2 }]);
    const se3 = standardErrorForConcept([
      { confidence: 2 },
      { confidence: 3 },
      { confidence: 4 },
    ]);
    expect(se3).toBeLessThan(se1);
  });

  it('stops at max items or when mean SE is low enough', () => {
    expect(shouldStopAdaptive(12, 0.5)).toBe(true);
    expect(shouldStopAdaptive(6, 0.3)).toBe(true);
    expect(shouldStopAdaptive(5, 0.2)).toBe(false);
  });

  it('branches difficulty from correctness and confidence', () => {
    expect(targetDifficultyLevel(true, 4)).toBe(4);
    expect(targetDifficultyLevel(false, 3)).toBe(2);
    expect(targetDifficultyLevel(true, 2)).toBe(2);
  });

  it('builds per-concept scores from attempt snapshots', () => {
    const scores = buildConceptScores([
      { isCorrect: true, confidence: 3, conceptIds: ['c1'] },
      { isCorrect: false, confidence: 2, conceptIds: ['c2'] },
    ]);
    expect(scores).toHaveLength(2);
    expect(meanStandardError(scores)).toBeGreaterThan(0);
  });
});