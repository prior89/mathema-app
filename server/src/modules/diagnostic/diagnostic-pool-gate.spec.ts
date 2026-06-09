import {
  MIN_READY_DIAGNOSTIC_SETS,
  NCERT_TO_KR_GRADE,
  ONBOARDING_NCERT_GRADES,
  countReadyDiagnosticSets,
  evaluateDiagnosticPoolGate,
  expectedDiagnosticPoolGrades,
  formatDiagnosticPoolGateReport,
} from './diagnostic-pool-gate';

describe('diagnostic-pool-gate', () => {
  it('covers all NCERT onboarding grades and mapped KR grades', () => {
    const keys = expectedDiagnosticPoolGrades();
    const inGrades = keys.filter((k) => k.country === 'IN').map((k) => k.grade);
    const krGrades = keys.filter((k) => k.country === 'KR').map((k) => k.grade);
    expect(inGrades).toEqual(ONBOARDING_NCERT_GRADES);
    expect(new Set(krGrades)).toEqual(new Set(Object.values(NCERT_TO_KR_GRADE)));
  });

  it('counts READY DIAGNOSTIC sets with country-specific grade filters', async () => {
    const prisma = {
      lessonProblemSet: {
        count: jest.fn().mockResolvedValue(9),
      },
    };

    await countReadyDiagnosticSets(prisma as any, { country: 'IN', grade: 'CLASS_11' });
    expect(prisma.lessonProblemSet.count).toHaveBeenCalledWith({
      where: {
        country: 'IN',
        setType: 'DIAGNOSTIC',
        status: 'READY',
        retiredAt: null,
        conceptLesson: { ncertClass: 'CLASS_11' },
      },
    });

    await countReadyDiagnosticSets(prisma as any, { country: 'KR', grade: 'HIGH_2' });
    expect(prisma.lessonProblemSet.count).toHaveBeenCalledWith({
      where: {
        country: 'KR',
        setType: 'DIAGNOSTIC',
        status: 'READY',
        retiredAt: null,
        koreanConceptLesson: { koreanGrade: 'HIGH_2' },
      },
    });
  });

  it('passes when every grade meets the minimum', async () => {
    const prisma = {
      lessonProblemSet: {
        count: jest.fn().mockResolvedValue(MIN_READY_DIAGNOSTIC_SETS),
      },
    };

    const result = await evaluateDiagnosticPoolGate(prisma as any);
    expect(result.ok).toBe(true);
    expect(result.failures).toHaveLength(0);
    expect(result.rows).toHaveLength(expectedDiagnosticPoolGrades().length);
  });

  it('fails when any grade is below the minimum', async () => {
    const prisma = {
      lessonProblemSet: {
        count: jest
          .fn()
          .mockResolvedValueOnce(7)
          .mockResolvedValue(MIN_READY_DIAGNOSTIC_SETS),
      },
    };

    const result = await evaluateDiagnosticPoolGate(prisma as any);
    expect(result.ok).toBe(false);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].grade).toBe('CLASS_7');
    expect(formatDiagnosticPoolGateReport(result)).toContain('Gate FAILED');
  });
});