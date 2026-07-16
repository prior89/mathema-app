import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdaptiveDiagnosticService } from './adaptive-diagnostic.service';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { MIN_READY_DIAGNOSTIC_SETS } from './diagnostic-pool-gate';

function makeProblem(id: string, level = 3) {
  return {
    id,
    body: `body-${id}`,
    difficulty: 'MIDDLE',
    difficultyLevel: level,
    unitId: 'unit-1',
    conceptLessonId: `lesson-${id}`,
    koreanConceptLessonId: null,
    concepts: [{ conceptId: `concept-${id}` }],
    steps: [{
      id: `step-${id}`,
      stepIndex: 1,
      prompt: 'p',
      choices: [
        { id: `c-${id}-1`, choiceIndex: 1, text: 'A' },
        { id: `c-${id}-2`, choiceIndex: 2, text: 'B' },
        { id: `c-${id}-3`, choiceIndex: 3, text: 'C' },
        { id: `c-${id}-4`, choiceIndex: 4, text: 'D' },
        { id: `c-${id}-5`, choiceIndex: 5, text: 'E' },
      ],
    }],
  };
}

function build() {
  const prisma = {
    user: { findUnique: jest.fn() },
    lessonProblemSet: { findMany: jest.fn(), count: jest.fn() },
    studySession: {
      create: jest.fn().mockResolvedValue({ id: 'sess-1' }),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    problem: { findMany: jest.fn() },
    masteryTrajectory: { findMany: jest.fn().mockResolvedValue([]) },
    userPlacementProfile: { upsert: jest.fn().mockResolvedValue({}) },
  };
  const attempts = {
    create: jest.fn().mockResolvedValue({ id: 'att-1', isCorrect: true }),
  };
  const config = { get: jest.fn().mockReturnValue('100') };
  const flags = new FeatureFlagsService(config as unknown as ConfigService);
  const firstSessionPlan = {
    seedFirstSession: jest.fn().mockResolvedValue([]),
    getActiveCards: jest.fn().mockResolvedValue([]),
  };
  const metrics = { observeAdaptiveItems: jest.fn() };
  const svc = new AdaptiveDiagnosticService(
    prisma as never,
    attempts as never,
    flags,
    firstSessionPlan as never,
    metrics as never,
  );
  return { svc, prisma, attempts, flags, firstSessionPlan };
}

describe('AdaptiveDiagnosticService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('blocks start when feature flag is off', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ gradeLevel: 'CLASS_11', country: 'IN' });
    jest.spyOn(svc['flags'], 'isEnabled').mockReturnValue(false);
    await expect(svc.start('user-1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('starts adaptive session with first problem when pool is ready', async () => {
    const { svc, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ gradeLevel: 'CLASS_11', country: 'IN' });
    prisma.lessonProblemSet.count.mockResolvedValue(MIN_READY_DIAGNOSTIC_SETS);
    prisma.lessonProblemSet.findMany.mockResolvedValue([{ problemIds: ['p1', 'p2'] }]);
    prisma.problem.findMany.mockResolvedValue([makeProblem('p1')]);

    const result = await svc.start('user-1');
    expect(result.sessionId).toBe('sess-1');
    expect(result.problem.id).toBe('p1');
    expect(result.maxItems).toBe(12);
  });

  it('finish upserts UserPlacementProfile', async () => {
    const { svc, prisma } = build();
    prisma.studySession.findUnique.mockResolvedValue({
      id: 'sess-1',
      userId: 'user-1',
      endedAt: null,
      attempts: [{
        isCorrect: true,
        confidence: 3,
        problemId: 'p1',
        problem: {
          concepts: [{ conceptId: 'c1', concept: { name: 'N', code: 'C1' } }],
          conceptLesson: { chapterCode: 'C11-CH01' },
          koreanConceptLesson: null,
        },
      }],
    });
    prisma.user.findUnique.mockResolvedValue({ gradeLevel: 'CLASS_11', country: 'IN' });

    const result = await svc.finish('user-1', 'sess-1');
    expect(prisma.userPlacementProfile.upsert).toHaveBeenCalled();
    expect(result.placement.estimatedGradeBand).toBe('CLASS_11');
    expect(result.attempted).toBe(1);
    expect(result.masteries).toEqual([expect.objectContaining({
      conceptId: 'c1',
      conceptName: 'N',
      conceptCode: 'C1',
      score: 100,
    })]);
  });

  it('uses placement scores even when only some mastery listeners have committed', async () => {
    const { svc, prisma } = build();
    prisma.masteryTrajectory.findMany.mockResolvedValue([{
      conceptId: 'c1',
      masteryScore: 55,
      concept: { name: 'N', nameKo: null, code: 'C1' },
    }]);
    prisma.studySession.findUnique.mockResolvedValue({
      id: 'sess-1',
      userId: 'user-1',
      endedAt: null,
      attempts: [{
        isCorrect: true,
        confidence: 3,
        problemId: 'p1',
        problem: {
          concepts: [{ conceptId: 'c1', concept: { name: 'N', nameKo: null, code: 'C1' } }],
          conceptLesson: { chapterCode: 'C11-CH01' },
          koreanConceptLesson: null,
        },
      }],
    });
    prisma.user.findUnique.mockResolvedValue({ gradeLevel: 'CLASS_11', country: 'IN' });

    const result = await svc.finish('user-1', 'sess-1');

    expect(result.masteries[0].score).toBe(100);
    expect(prisma.masteryTrajectory.findMany).not.toHaveBeenCalled();
  });

  it('does not reset a completed first-session plan when finish is retried', async () => {
    const { svc, prisma, firstSessionPlan } = build();
    prisma.studySession.findUnique.mockResolvedValue({
      id: 'sess-1',
      userId: 'user-1',
      endedAt: new Date('2026-07-17T00:00:00Z'),
      attempts: [],
    });
    prisma.user.findUnique.mockResolvedValue({ gradeLevel: 'CLASS_11', country: 'IN' });

    await svc.finish('user-1', 'sess-1');

    expect(firstSessionPlan.getActiveCards).toHaveBeenCalledWith('user-1');
    expect(firstSessionPlan.seedFirstSession).not.toHaveBeenCalled();
  });
});
