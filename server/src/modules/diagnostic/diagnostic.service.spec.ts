import { BadRequestException } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';

function makeStep(problemId: string) {
  return {
    id: `step-${problemId}`,
    stepIndex: 1,
    prompt: `prompt-${problemId}`,
    choices: [
      { id: `choice-${problemId}-1`, choiceIndex: 1, text: 'A' },
      { id: `choice-${problemId}-2`, choiceIndex: 2, text: 'B' },
    ],
  };
}

function makeProblem(
  id: string,
  overrides: Partial<{
    unitId: string;
    conceptLessonId: string | null;
    koreanConceptLessonId: string | null;
  }> = {},
) {
  return {
    id,
    body: `body-${id}`,
    difficulty: 'MIDDLE',
    unitId: overrides.unitId ?? 'unit-1',
    conceptLessonId: overrides.conceptLessonId ?? 'lesson-1',
    koreanConceptLessonId: overrides.koreanConceptLessonId ?? null,
    steps: [makeStep(id)],
  };
}

function build() {
  const prisma = {
    user: { findUnique: jest.fn() },
    problem: { findMany: jest.fn() },
    studySession: {
      create: jest.fn().mockResolvedValue({ id: 'session-1' }),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    masteryTrajectory: { findMany: jest.fn().mockResolvedValue([]) },
    conceptLesson: { findMany: jest.fn() },
    koreanConceptLesson: { findMany: jest.fn() },
    lessonProblemSet: { findMany: jest.fn().mockResolvedValue([]) },
  };
  const attempts = { create: jest.fn() };
  const firstSessionPlan = {
    seedFirstSession: jest.fn().mockResolvedValue([]),
    getActiveCards: jest.fn().mockResolvedValue([]),
  };
  return {
    prisma,
    firstSessionPlan,
    service: new DiagnosticService(prisma as any, attempts as any, firstSessionPlan as any),
  };
}

describe('DiagnosticService.start grade selection', () => {
  it('selects NCERT diagnostic problems by the exact ConceptLesson.ncertClass', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ gradeLevel: 'CLASS_11', country: 'IN' });
    prisma.problem.findMany.mockResolvedValue([
      makeProblem('p1', { conceptLessonId: 'l1' }),
      makeProblem('p2', { conceptLessonId: 'l2' }),
      makeProblem('p3', { conceptLessonId: 'l3' }),
      makeProblem('p4', { conceptLessonId: 'l4' }),
    ]);

    const result = await service.start('user-1');

    expect(result.problems).toHaveLength(4);
    expect(prisma.conceptLesson.findMany).not.toHaveBeenCalled();
    expect(prisma.problem.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.problem.findMany.mock.calls[0][0].where).toMatchObject({
      conceptLesson: { ncertClass: 'CLASS_11' },
      steps: { some: { stepIndex: 1 } },
      conceptMismatch: { not: true },
      OR: [
        { qualityStatus: null },
        { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
      ],
    });
  });

  it('does not fall back to all NCERT grades when the selected grade has no pool', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ gradeLevel: 'CLASS_8', country: 'IN' });
    prisma.problem.findMany.mockResolvedValue([]);

    await expect(service.start('user-1')).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.problem.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.studySession.create).not.toHaveBeenCalled();
  });

  it('selects KR diagnostic problems by the exact mapped Korean grade', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ gradeLevel: 'CLASS_11', country: 'KR' });
    prisma.problem.findMany.mockResolvedValue([
      makeProblem('kp1', { conceptLessonId: null, koreanConceptLessonId: 'kl1' }),
      makeProblem('kp2', { conceptLessonId: null, koreanConceptLessonId: 'kl2' }),
      makeProblem('kp3', { conceptLessonId: null, koreanConceptLessonId: 'kl3' }),
      makeProblem('kp4', { conceptLessonId: null, koreanConceptLessonId: 'kl4' }),
    ]);

    const result = await service.start('user-kr');

    expect(result.problems).toHaveLength(4);
    expect(prisma.koreanConceptLesson.findMany).not.toHaveBeenCalled();
    expect(prisma.problem.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.problem.findMany.mock.calls[0][0].where).toMatchObject({
      koreanConceptLesson: { koreanGrade: 'HIGH_2' },
      steps: { some: { stepIndex: 1 } },
      conceptMismatch: { not: true },
      OR: [
        { qualityStatus: null },
        { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
      ],
    });
  });
});

describe('DiagnosticService.finish', () => {
  it('returns deterministic concept results while async mastery listeners are still pending', async () => {
    const { service, prisma, firstSessionPlan } = build();
    prisma.studySession.findUnique.mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
      endedAt: null,
      attempts: [
        {
          isCorrect: false,
          problem: {
            concepts: [{
              conceptId: 'concept-1',
              concept: { name: 'Integers', nameKo: '정수', code: 'INT' },
            }],
            conceptLesson: { chapterCode: 'C8-CH01' },
            koreanConceptLesson: null,
          },
        },
      ],
    });

    const result = await service.finish('user-1', 'session-1');

    expect(result.masteries).toEqual([{
      conceptId: 'concept-1',
      conceptName: 'Integers',
      conceptNameKo: '정수',
      conceptCode: 'INT',
      score: 0,
    }]);
    expect(firstSessionPlan.seedFirstSession).toHaveBeenCalledWith('user-1', {
      recommendedChapterCodes: ['C8-CH01'],
      weakConceptIds: ['concept-1'],
    });
  });

  it('does not mix a partially updated trajectory into the session result', async () => {
    const { service, prisma } = build();
    prisma.masteryTrajectory.findMany.mockResolvedValue([{
      conceptId: 'concept-1',
      masteryScore: 55,
      concept: { name: 'Integers', nameKo: '정수', code: 'INT' },
    }]);
    prisma.studySession.findUnique.mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
      endedAt: null,
      attempts: [{
        isCorrect: false,
        problem: {
          concepts: [{
            conceptId: 'concept-1',
            concept: { name: 'Integers', nameKo: '정수', code: 'INT' },
          }],
          conceptLesson: { chapterCode: 'C8-CH01' },
          koreanConceptLesson: null,
        },
      }],
    });

    const result = await service.finish('user-1', 'session-1');

    expect(result.masteries[0].score).toBe(0);
    expect(prisma.masteryTrajectory.findMany).not.toHaveBeenCalled();
  });

  it('does not resurrect a completed first-session plan on finish retry', async () => {
    const { service, prisma, firstSessionPlan } = build();
    firstSessionPlan.getActiveCards.mockResolvedValue([]);
    prisma.studySession.findUnique.mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
      endedAt: new Date('2026-07-17T00:00:00Z'),
      attempts: [],
    });

    const result = await service.finish('user-1', 'session-1');

    expect(result.firstSessionPlan).toEqual([]);
    expect(firstSessionPlan.getActiveCards).toHaveBeenCalledWith('user-1');
    expect(firstSessionPlan.seedFirstSession).not.toHaveBeenCalled();
  });
});
