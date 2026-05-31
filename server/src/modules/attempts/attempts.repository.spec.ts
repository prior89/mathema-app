/**
 * AttemptsRepository — unit tests for the grading + WrongNote write path.
 *
 * Mocks PrismaService and GradingService; verifies:
 *   • choice-based grading (correct + wrong)
 *   • text-answer normalization (case + whitespace, null guard)
 *   • single-shot auto-MASTERED graduation
 *   • multi-step does NOT auto-MASTERED (perfect-cycle is enforced elsewhere)
 *   • retry: previously attempted (session, problem, stepIndex) skips WrongNote
 *   • WrongNote upsert on wrong + first try
 */
import { AttemptsRepository } from './attempts.repository';

type AnyMock = { [k: string]: jest.Mock };

function mockGrading(): AnyMock {
  return {
    analyze: jest.fn().mockReturnValue({ errorCodes: [], legacyErrorType: 'OTHER' }),
  };
}

function mockPrisma(over: any = {}) {
  return {
    problem: {
      findUniqueOrThrow: jest.fn().mockResolvedValue({
        id: 'p1', answer: 'X+1', expectedTimeSec: 60, expectedSolutionSteps: null,
        difficultyLevel: 'MIDDLE',
        concepts: [{ conceptId: 'c1' }],
        steps: [],
        ...over.problem,
      }),
    },
    problemChoice: {
      findUnique: jest.fn().mockResolvedValue(null),
      ...over.problemChoice,
    },
    attempt: {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockImplementation(async ({ data }: any) => ({ id: 'att-1', ...data })),
    },
    user: {
      findUnique: jest.fn().mockResolvedValue({ tenantId: null }),
    },
    wrongNote: {
      upsert: jest.fn().mockResolvedValue(undefined),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    concept: {
      findMany: jest.fn().mockResolvedValue([{ code: 'CONCEPT-A' }]),
    },
  };
}

function build(over: { prisma?: any; grading?: AnyMock } = {}) {
  const prisma = over.prisma ?? mockPrisma();
  const grading = over.grading ?? mockGrading();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repo = new AttemptsRepository(prisma as any, grading as any);
  return { repo, prisma, grading };
}

describe('AttemptsRepository.create', () => {
  // ─── choice grading ───
  it('marks attempt correct when the chosen ProblemChoice.isCorrect is true', async () => {
    const prisma = mockPrisma();
    prisma.problemChoice.findUnique = jest.fn().mockResolvedValue({
      id: 'ch-1', text: '42', isCorrect: true, distractorType: null, stepId: 's-1', step: { problemId: 'p1' },
    });
    const { repo } = build({ prisma });
    const r = await repo.create('u1', { problemId: 'p1', choiceId: 'ch-1' });
    expect(r.isCorrect).toBe(true);
    expect(prisma.wrongNote.upsert).not.toHaveBeenCalled();
  });

  it('marks attempt wrong + upserts WrongNote when choice is incorrect (first try)', async () => {
    const prisma = mockPrisma();
    prisma.problemChoice.findUnique = jest.fn().mockResolvedValue({
      id: 'ch-2', text: '0', isCorrect: false, distractorType: 'CALC_ERROR', stepId: 's-1', step: { problemId: 'p1' },
    });
    const grading = mockGrading();
    grading.analyze.mockReturnValue({ errorCodes: ['CALC'], legacyErrorType: 'CALCULATION_MISTAKE' });
    const { repo } = build({ prisma, grading });
    const r = await repo.create('u1', { problemId: 'p1', choiceId: 'ch-2' });
    expect(r.isCorrect).toBe(false);
    expect(prisma.wrongNote.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId_problemId: { userId: 'u1', problemId: 'p1' } },
      create: expect.objectContaining({ status: 'PENDING', errorType: 'CALCULATION_MISTAKE' }),
    }));
  });

  it('throws when choiceId does not resolve to a ProblemChoice', async () => {
    const prisma = mockPrisma();
    prisma.problemChoice.findUnique = jest.fn().mockResolvedValue(null);
    const { repo } = build({ prisma });
    await expect(repo.create('u1', { problemId: 'p1', choiceId: 'ch-bad' }))
      .rejects.toThrow(/Invalid choiceId/);
  });

  // P0-1 regression guard: cross-problem choiceId attack.
  it('throws when choiceId belongs to a step of a different problem', async () => {
    const prisma = mockPrisma();
    prisma.problemChoice.findUnique = jest.fn().mockResolvedValue({
      id: 'ch-evil', text: '42', isCorrect: true, distractorType: null, stepId: 's-other',
      step: { problemId: 'p-OTHER' },
    });
    const { repo } = build({ prisma });
    await expect(repo.create('u1', { problemId: 'p1', choiceId: 'ch-evil' }))
      .rejects.toThrow(/does not belong to problemId p1/);
    // Critical: no Attempt row should have been created when the guard rejects.
    expect(prisma.attempt.create).not.toHaveBeenCalled();
  });

  // ─── text answer normalization ───
  it('accepts text answer with whitespace + case differences', async () => {
    const prisma = mockPrisma({ problem: { answer: 'X+1' } });
    const { repo } = build({ prisma });
    const r = await repo.create('u1', { problemId: 'p1', answer: '  x + 1  ' });
    expect(r.isCorrect).toBe(true);
  });

  it('never grades correct when problem.answer is null even if dto.answer is empty', async () => {
    const prisma = mockPrisma({ problem: { answer: null } });
    const { repo } = build({ prisma });
    const r = await repo.create('u1', { problemId: 'p1', answer: '' });
    expect(r.isCorrect).toBe(false);
  });

  // ─── auto-MASTERED policy ───
  it('graduates WrongNote to MASTERED on a correct single-shot attempt (no stepIndex)', async () => {
    const prisma = mockPrisma({ problem: { answer: 'X+1' } });
    const { repo } = build({ prisma });
    await repo.create('u1', { problemId: 'p1', answer: 'X+1' });
    expect(prisma.wrongNote.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 'u1', problemId: 'p1', status: { not: 'MASTERED' } },
      data: { status: 'MASTERED', masteredAt: expect.any(Date) },
    }));
  });

  it('does NOT graduate WrongNote on a correct multi-step attempt (stepIndex provided)', async () => {
    const prisma = mockPrisma();
    prisma.problemChoice.findUnique = jest.fn().mockResolvedValue({
      id: 'ch-1', text: '42', isCorrect: true, distractorType: null, stepId: 's-1',
      // 2026-05-27: choice.step.stepIndex must match dto.stepIndex per the
      // new cross-check (stale-step-id defence). Without this the assertion
      // crashes with BadRequest before reaching the WrongNote guard.
      step: { problemId: 'p1', stepIndex: 1 },
    });
    const { repo } = build({ prisma });
    await repo.create('u1', { problemId: 'p1', choiceId: 'ch-1', stepIndex: 1 });
    expect(prisma.wrongNote.updateMany).not.toHaveBeenCalled();
  });

  // ─── retry guard ───
  it('skips WrongNote upsert on a wrong retry (same session+problem+stepIndex)', async () => {
    const prisma = mockPrisma();
    prisma.problemChoice.findUnique = jest.fn().mockResolvedValue({
      id: 'ch-x', text: '0', isCorrect: false, distractorType: null, stepId: 's-1',
      step: { problemId: 'p1', stepIndex: 1 },
    });
    prisma.attempt.count = jest.fn().mockResolvedValue(1); // previous attempt exists
    const { repo } = build({ prisma });
    await repo.create('u1', {
      problemId: 'p1', choiceId: 'ch-x',
      studySessionId: 'ss-1', stepIndex: 1,
    });
    expect(prisma.wrongNote.upsert).not.toHaveBeenCalled();
  });

  // ─── enrichment ───
  it('includes conceptTags + difficultyLevel in the returned payload', async () => {
    const prisma = mockPrisma({ problem: { difficultyLevel: 'SEMI_KILLER' } });
    prisma.problemChoice.findUnique = jest.fn().mockResolvedValue({
      id: 'ch-1', text: '42', isCorrect: true, distractorType: null, stepId: 's-1', step: { problemId: 'p1' },
    });
    const { repo } = build({ prisma });
    const r = await repo.create('u1', { problemId: 'p1', choiceId: 'ch-1' });
    expect(r.conceptTags).toEqual(['CONCEPT-A']);
    expect(r.difficultyLevel).toBe('SEMI_KILLER');
  });
});
