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
