import { aggregateKrGradeMastery } from './kr-grade-mastery.util';

describe('aggregateKrGradeMastery', () => {
  it('groups trajectories by grade and averages scores', () => {
    const rows = aggregateKrGradeMastery(
      [
        { masteryScore: 80, evidenceCount: 5, concept: { gradeLevel: 'CLASS_10' } },
        { masteryScore: 60, evidenceCount: 3, concept: { gradeLevel: 'CLASS_10' } },
        { masteryScore: 40, evidenceCount: 2, concept: { gradeLevel: 'CLASS_11' } },
      ],
      'ko',
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ value: 70, unitId: 'kr-grade:CLASS_10' });
    expect(rows[1]).toMatchObject({ value: 40, unitId: 'kr-grade:CLASS_11' });
  });

  it('uses English labels for en lang', () => {
    const rows = aggregateKrGradeMastery(
      [{ masteryScore: 55, evidenceCount: 1, concept: { gradeLevel: 'CLASS_7' } }],
      'en',
    );
    expect(rows[0].subject).toBe('Class 7');
  });
});