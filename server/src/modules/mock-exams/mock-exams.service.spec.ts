/**
 * MockExamsService — focused unit tests for the Study one-at-a-time flow
 * (nextChapterProblem). Heavy DB collaborators are mocked.
 *
 * Covers:
 *   • NotFound when chapter does not exist
 *   • Forbidden when Mastery has not been completed for the chapter
 *   • Returns null when the pool is empty AND LLM top-up generates nothing
 */
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MockExamsService } from './mock-exams.service';

function mockPrisma(over: any = {}) {
  return {
    user: {
      findUnique: jest.fn().mockResolvedValue({ country: 'IN' }),
      ...over.user,
    },
    conceptLesson: {
      findUnique: jest.fn().mockResolvedValue(null),
      ...over.conceptLesson,
    },
    conceptProgress: {
      findUnique: jest.fn().mockResolvedValue(null),
      ...over.conceptProgress,
    },
    attempt: {
      findMany: jest.fn().mockResolvedValue([]),
      ...over.attempt,
    },
    errorPatternProfile: {
      findMany: jest.fn().mockResolvedValue([]),
      ...over.errorPatternProfile,
    },
    lessonProblemSet: {
      findFirst: jest.fn().mockResolvedValue(null),
      ...over.lessonProblemSet,
    },
    problemConcept: {
      findMany: jest.fn().mockResolvedValue([]),
      ...over.problemConcept,
    },
    masteryTrajectory: {
      findMany: jest.fn().mockResolvedValue([]),
      ...over.masteryTrajectory,
    },
    problem: { findMany: jest.fn().mockResolvedValue([]), ...over.problem },
    $queryRawUnsafe: jest.fn().mockResolvedValue([]),
    ...over.rest,
  };
}

function build(over: any = {}) {
  const repo = over.repo ?? {};
  const grading = over.grading ?? {};
  const aiRec = over.aiRec ?? {};
  const attempts = over.attempts ?? {};
  const prisma = over.prisma ?? mockPrisma();
  const llmDraft = over.llmDraft ?? { generate: jest.fn().mockResolvedValue(null) };
  const det = over.det ?? { check: jest.fn() };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svc = new MockExamsService(repo as any, grading as any, aiRec as any, attempts as any, prisma as any, llmDraft as any, det as any);
  return { svc, prisma, llmDraft };
}

describe('MockExamsService.nextChapterProblem', () => {
  it('throws NotFound when the chapter is unknown', async () => {
    const { svc } = build();
    await expect(svc.nextChapterProblem('u1', 'NOPE')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws Forbidden when the user has not mastered the chapter', async () => {
    const prisma = mockPrisma({
      conceptLesson: { findUnique: jest.fn().mockResolvedValue({
        id: 'L1', ncertClass: 'CLASS_7', chapterNumber: 1, titleEn: 'X', unitId: 'u1', subUnitId: 's1',
      }) },
      conceptProgress: { findUnique: jest.fn().mockResolvedValue({ masteredAt: null }) },
    });
    const { svc } = build({ prisma });
    await expect(svc.nextChapterProblem('u1', 'CH-1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('returns null when pool is empty AND LLM top-up produces nothing', async () => {
    const prisma = mockPrisma({
      conceptLesson: { findUnique: jest.fn().mockResolvedValue({
        id: 'L1', ncertClass: 'CLASS_7', chapterNumber: 1, titleEn: 'X', unitId: 'u1', subUnitId: 's1',
      }) },
      conceptProgress: { findUnique: jest.fn().mockResolvedValue({ masteredAt: new Date() }) },
      attempt: { findMany: jest.fn().mockResolvedValue([]) },
    });
    prisma.$queryRawUnsafe = jest.fn().mockResolvedValue([]); // dry pool
    const llmDraft = { generate: jest.fn().mockResolvedValue(null) }; // LLM also returns nothing
    const { svc } = build({ prisma, llmDraft });
    const r = await svc.nextChapterProblem('u1', 'CH-1');
    expect(r).toBeNull();
  });
});

// ── pickStudyProblemId scoring (weakness match + concept-mastery boost) ──

/** 5-choice single-step candidate. wrongMeta lands on the first wrong choice. */
function candidate(
  id: string,
  over: Partial<{ difficultyLevel: number; createdAt: Date; commonErrorCodes: string[] }> = {},
  wrongMeta: Partial<{ distractorType: string; distractorErrorCode: string }> = {},
) {
  const wrong = (meta: typeof wrongMeta = {}) => ({
    isCorrect: false,
    distractorErrorCode: meta.distractorErrorCode ?? null,
    distractorType: meta.distractorType ?? null,
  });
  return {
    id,
    difficultyLevel: over.difficultyLevel ?? 1,
    createdAt: over.createdAt ?? new Date('2026-01-01'),
    commonErrorCodes: over.commonErrorCodes ?? [],
    steps: [{
      choices: [
        { isCorrect: true, distractorErrorCode: null, distractorType: null },
        wrong(wrongMeta), wrong(), wrong(), wrong(),
      ],
    }],
  };
}

function pickArgs() {
  return {
    userId: 'u1',
    country: 'IN',
    chapterCode: 'CH-1',
    lessonId: 'L1',
    lessonFk: 'conceptLessonId' as const,
  };
}

describe('MockExamsService.pickStudyProblemId scoring', () => {
  it('prefers a problem whose IN distractorType maps to an ACTIVE weakness code', async () => {
    const prisma = mockPrisma({
      errorPatternProfile: { findMany: jest.fn().mockResolvedValue([{ errorCode: 'CALC' }]) },
      problem: { findMany: jest.fn().mockResolvedValue([
        candidate('p-easy', { difficultyLevel: 1 }),
        candidate('p-calc', { difficultyLevel: 3 }, { distractorType: 'CALC_ERROR' }),
      ]) },
    });
    const { svc } = build({ prisma });
    const picked = await (svc as any).pickStudyProblemId(pickArgs());
    expect(picked).toBe('p-calc');
  });

  it('maps KR distractorErrorCode strings to enum before matching', async () => {
    const prisma = mockPrisma({
      errorPatternProfile: { findMany: jest.fn().mockResolvedValue([{ errorCode: 'SIGN' }]) },
      problem: { findMany: jest.fn().mockResolvedValue([
        candidate('p-plain', { difficultyLevel: 1 }),
        candidate('p-sign', { difficultyLevel: 3 }, { distractorErrorCode: 'SIGN_ERROR' }),
      ]) },
    });
    const { svc } = build({ prisma });
    const picked = await (svc as any).pickStudyProblemId({ ...pickArgs(), country: 'KR', lessonFk: 'koreanConceptLessonId' as const });
    expect(picked).toBe('p-sign');
  });

  it('falls back to concept-mastery boost when no weakness code matches', async () => {
    const prisma = mockPrisma({
      problem: { findMany: jest.fn().mockResolvedValue([
        candidate('p-strong', { difficultyLevel: 1 }),
        candidate('p-weak', { difficultyLevel: 3 }),
      ]) },
      problemConcept: { findMany: jest.fn().mockResolvedValue([
        { problemId: 'p-strong', conceptId: 'c-high', weight: 1 },
        { problemId: 'p-weak', conceptId: 'c-low', weight: 1 },
      ]) },
      masteryTrajectory: { findMany: jest.fn().mockResolvedValue([
        { conceptId: 'c-high', masteryScore: 90 },
        { conceptId: 'c-low', masteryScore: 20 },
      ]) },
    });
    const { svc } = build({ prisma });
    const picked = await (svc as any).pickStudyProblemId(pickArgs());
    expect(picked).toBe('p-weak');
  });

  it('preserves operator set order for cold-start users (no signals)', async () => {
    const prisma = mockPrisma({
      lessonProblemSet: { findFirst: jest.fn().mockResolvedValue({ problemIds: ['p-2', 'p-1'] }) },
      problem: { findMany: jest.fn().mockResolvedValue([
        candidate('p-1', { difficultyLevel: 1 }),
        candidate('p-2', { difficultyLevel: 3 }),
      ]) },
    });
    const { svc } = build({ prisma });
    const picked = await (svc as any).pickStudyProblemId(pickArgs());
    expect(picked).toBe('p-2');
  });
});
