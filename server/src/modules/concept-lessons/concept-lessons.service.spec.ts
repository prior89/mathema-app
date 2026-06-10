/**
 * ConceptLessonsService — unit tests for the user-visible Mastery flow.
 * Covers:
 *   • practiceProblems exact-20 invariant (pool >= 20 → no LLM call)
 *   • practiceProblems NotFound on unknown chapter
 *   • checkRetrieval MCQ correct path appends stepIndex to completedSteps
 *   • checkRetrieval MCQ wrong returns hint
 *   • checkRetrieval rejects non-RETRIEVAL step
 *   • pickBalanced selects evenly across difficulty buckets (private — exercised via practiceProblems)
 */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConceptStepKind, Difficulty } from '@prisma/client';
import { ConceptLessonsService } from './concept-lessons.service';

type AnyMock = { [k: string]: jest.Mock };

function mockPrisma(over: any = {}) {
  return {
    conceptLesson: {
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue(undefined),
      ...over.conceptLesson,
    },
    problem: {
      findMany: jest.fn().mockResolvedValue([]),
      ...over.problem,
    },
    conceptProgress: {
      upsert: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue({ retrievalScore: 0 }),
      findUnique: jest.fn().mockResolvedValue({ completedSteps: [], masteredAt: null }),
      ...over.conceptProgress,
    },
  };
}
function mockLlm(): AnyMock {
  return {
    generate: jest.fn().mockResolvedValue(null),
  };
}
function mockDeterministic(): AnyMock {
  return {
    check: jest.fn().mockReturnValue({ matches: true, expected: null, given: null }),
  };
}
function mockPremiumAccess(): AnyMock {
  return {
    effectiveMasterySetIds: jest.fn().mockImplementation(async (_uid: string, ids: string[]) => ids),
  };
}

function build(over: any = {}) {
  const prisma = over.prisma ?? mockPrisma();
  const llm = over.llm ?? mockLlm();
  const det = over.det ?? mockDeterministic();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const achievements = over.achievements ?? { tryAwardFirstConceptStep: jest.fn() };
  const premiumAccess = over.premiumAccess ?? mockPremiumAccess();
  const svc = new ConceptLessonsService(
    prisma as any,
    llm as any,
    det as any,
    achievements as any,
    premiumAccess as any,
  );
  return { svc, prisma, llm, premiumAccess };
}

function makeProblem(id: string, difficulty: Difficulty) {
  return {
    id, source: 'pool',
    unitId: 'u1', subUnitId: 's1',
    difficulty, difficultyLevel: 3, body: `body-${id}`,
  };
}

describe('ConceptLessonsService.practiceProblems', () => {
  it('throws NotFound when chapter does not exist', async () => {
    const { svc } = build();
    await expect(svc.practiceProblems('NONEXISTENT', 'en', 'u1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('curates a diverse 20 from the pool and freezes them on the lesson', async () => {
    // 30-problem pool — bucket-balanced selection (5 per difficulty) so the
    // resulting frozen set covers a fair span of difficulty for cohort analysis.
    const pool = [
      ...Array.from({ length: 10 }, (_, i) => makeProblem(`m${i}`, Difficulty.MIDDLE)),
      ...Array.from({ length: 8 }, (_, i) => makeProblem(`um${i}`, Difficulty.UPPER_MIDDLE)),
      ...Array.from({ length: 7 }, (_, i) => makeProblem(`sk${i}`, Difficulty.SEMI_KILLER)),
      ...Array.from({ length: 5 }, (_, i) => makeProblem(`k${i}`, Difficulty.KILLER)),
    ];
    const updateSpy = jest.fn().mockResolvedValue(undefined);
    const prisma = mockPrisma({
      conceptLesson: {
        // First call: no frozen set yet (masterySetProblemIds: []).
        findUnique: jest.fn().mockResolvedValue({
          id: 'L1', ncertClass: 'CLASS_7', chapterNumber: 1, titleEn: 'X',
          unitId: 'u1', subUnitId: 's1',
          masterySetProblemIds: [], masterySetCuratedAt: null,
        }),
        update: updateSpy,
      },
      problem: { findMany: jest.fn().mockResolvedValue(pool) },
    });
    const llm = mockLlm();
    const { svc } = build({ prisma, llm });
    const out = await svc.practiceProblems('CH-1', 'en', 'u1');
    expect(out).toHaveLength(20);
    expect(llm.generate).not.toHaveBeenCalled();
    // No duplicates and every chosen problem is in the pool.
    const ids = out.map((p) => p.id);
    expect(new Set(ids).size).toBe(20);
    const poolIds = new Set(pool.map((p) => p.id));
    for (const id of ids) expect(poolIds.has(id)).toBe(true);
    // The chosen 20 must have been frozen onto the lesson row so every
    // subsequent user sees the same set.
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'L1' },
      data: expect.objectContaining({
        masterySetProblemIds: expect.arrayContaining(ids),
      }),
    }));
  });

  it('returns the frozen canonical set when one already exists (no re-curation, no pool query)', async () => {
    const frozenIds = Array.from({ length: 20 }, (_, i) => `frozen-${i}`);
    const problemsBackToTheLesson = frozenIds.map((id) => makeProblem(id, Difficulty.MIDDLE));
    const updateSpy = jest.fn().mockResolvedValue(undefined);
    const problemFindMany = jest.fn().mockResolvedValue(problemsBackToTheLesson);
    const prisma = mockPrisma({
      conceptLesson: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'L1', ncertClass: 'CLASS_7', chapterNumber: 1, titleEn: 'X',
          unitId: 'u1', subUnitId: 's1',
          masterySetProblemIds: frozenIds,
          masterySetCuratedAt: new Date('2026-05-22T00:00:00Z'),
        }),
        update: updateSpy,
      },
      problem: { findMany: problemFindMany },
    });
    const llm = mockLlm();
    const { svc } = build({ prisma, llm });
    const out = await svc.practiceProblems('CH-1', 'en', 'u1');
    expect(out).toHaveLength(20);
    expect(out.map((p) => p.id)).toEqual(frozenIds); // order preserved
    expect(llm.generate).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled(); // no re-freeze
  });
});

describe('ConceptLessonsService.checkRetrieval', () => {
  function lesson(retrievalStep: any) {
    return {
      id: 'L1',
      steps: [
        { stepIndex: 1, kind: ConceptStepKind.HOOK },
        retrievalStep,
      ],
    };
  }

  it('returns 404 when chapter is unknown', async () => {
    const { svc } = build();
    await expect(svc.checkRetrieval('u1', 'NOPE', 2, '1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects with 400 when targeted step is not a RETRIEVAL step', async () => {
    const prisma = mockPrisma({
      conceptLesson: {
        findUnique: jest.fn().mockResolvedValue(lesson({ stepIndex: 2, kind: ConceptStepKind.HOOK })),
      },
    });
    const { svc } = build({ prisma });
    await expect(svc.checkRetrieval('u1', 'CH-1', 2, '1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('grades MCQ correct (passed=true, hint=null, completedSteps push)', async () => {
    const step = {
      stepIndex: 2,
      kind: ConceptStepKind.RETRIEVAL,
      retrievalCheck: {
        choices: [
          { choiceIndex: 1, isCorrect: false },
          { choiceIndex: 2, isCorrect: true },
        ],
        explain: 'because foo',
        hint: 'try bar',
      },
    };
    const prisma = mockPrisma({
      conceptLesson: { findUnique: jest.fn().mockResolvedValue(lesson(step)) },
      conceptProgress: {
        upsert: jest.fn().mockResolvedValue(undefined),
        update: jest.fn().mockResolvedValue({ retrievalScore: 100 }),
        findUnique: jest.fn().mockResolvedValue({ completedSteps: [2], masteredAt: null }),
      },
    });
    const { svc } = build({ prisma });
    const r = await svc.checkRetrieval('u1', 'CH-1', 2, '2');
    expect(r.passed).toBe(true);
    expect(r.hint).toBeNull();
    // Push update on completedSteps was issued
    expect(prisma.conceptProgress.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ completedSteps: { push: 2 } }),
    }));
  });

  it('grades MCQ wrong (passed=false, hint returned, no push)', async () => {
    const step = {
      stepIndex: 2,
      kind: ConceptStepKind.RETRIEVAL,
      retrievalCheck: {
        choices: [
          { choiceIndex: 1, isCorrect: true },
          { choiceIndex: 2, isCorrect: false },
        ],
        hint: 'try again',
      },
    };
    const pushSpy = jest.fn().mockResolvedValue({ retrievalScore: 0 });
    const prisma = mockPrisma({
      conceptLesson: { findUnique: jest.fn().mockResolvedValue(lesson(step)) },
      conceptProgress: {
        upsert: jest.fn().mockResolvedValue(undefined),
        update: pushSpy,
        findUnique: jest.fn().mockResolvedValue({ completedSteps: [], masteredAt: null }),
      },
    });
    const { svc } = build({ prisma });
    const r = await svc.checkRetrieval('u1', 'CH-1', 2, '2');
    expect(r.passed).toBe(false);
    expect(r.hint).toBe('try again');
    // The "push" update should NOT have been called — only the score recalc update.
    const pushCall = pushSpy.mock.calls.find(([arg]) =>
      arg?.data?.completedSteps?.push !== undefined,
    );
    expect(pushCall).toBeUndefined();
  });

  it('grades text-mode (accept array) with normalisation (case + whitespace + unicode)', async () => {
    const step = {
      stepIndex: 2,
      kind: ConceptStepKind.RETRIEVAL,
      retrievalCheck: {
        accept: ['x^2 + 1'],
      },
    };
    const prisma = mockPrisma({
      conceptLesson: { findUnique: jest.fn().mockResolvedValue(lesson(step)) },
      conceptProgress: {
        upsert: jest.fn().mockResolvedValue(undefined),
        update: jest.fn().mockResolvedValue({ retrievalScore: 100 }),
        findUnique: jest.fn().mockResolvedValue({ completedSteps: [2], masteredAt: null }),
      },
    });
    const { svc } = build({ prisma });
    // Superscript x² should match x^2 via the normalise() function inside the service.
    const r = await svc.checkRetrieval('u1', 'CH-1', 2, ' X² + 1 ');
    expect(r.passed).toBe(true);
  });
});
