/**
 * MockExamsService — focused unit tests for the Study one-at-a-time flow
 * (nextChapterProblem). Heavy DB collaborators are mocked.
 *
 * Covers:
 *   • NotFound when chapter does not exist
 *   • Forbidden when Mastery has not been completed for the chapter
 *   • Returns null when the pool is empty AND LLM top-up generates nothing
 */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MockExamsService } from './mock-exams.service';

function mockPrisma(over: any = {}) {
  const prisma: any = {
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
      findFirst: jest.fn().mockResolvedValue(null),
      ...over.attempt,
    },
    mockExamResult: {
      findFirst: jest.fn().mockResolvedValue(null),
      findFirstOrThrow: jest.fn().mockResolvedValue({
        id: 'result-1',
        userId: 'student-1',
        finalizedAt: null,
        mockExam: { type: 'RECOMMENDED', problemIds: ['p-1'] },
      }),
      ...over.mockExamResult,
    },
    recommendationLog: {
      createMany: jest.fn().mockResolvedValue({ count: 0 }),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      ...over.recommendationLog,
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
    problemChoice: {
      findUnique: jest.fn().mockResolvedValue(null),
      ...over.problemChoice,
    },
    $queryRaw: jest.fn().mockResolvedValue([{ id: 'result-1' }]),
    $queryRawUnsafe: jest.fn().mockResolvedValue([]),
    ...over.rest,
  };
  prisma.$transaction = over.$transaction ?? jest.fn(async (callback: any) => callback(prisma));
  return prisma;
}

function build(over: any = {}) {
  const repo = over.repo ?? {};
  const grading = over.grading ?? {};
  const aiRec = over.aiRec ?? {};
  const attempts = over.attempts ?? {};
  const prisma = over.prisma ?? mockPrisma();
  const llmDraft = over.llmDraft ?? { generate: jest.fn().mockResolvedValue(null) };
  const det = over.det ?? { check: jest.fn() };
  const weeklyReports = over.weeklyReports ?? { generate: jest.fn().mockResolvedValue({ id: 'weekly-1' }) };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svc = new MockExamsService(
    repo as any,
    grading as any,
    aiRec as any,
    attempts as any,
    prisma as any,
    llmDraft as any,
    det as any,
    weeklyReports as any,
  );
  return { svc, prisma, repo, grading, attempts, llmDraft, weeklyReports };
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

describe('MockExamsService.startTyped country guard', () => {
  it.each([
    ['Korean', 'KR'],
    ['country-unset', null],
  ])('blocks the JEE-scored REAL paper for %s users before composing it', async (_label, country) => {
    const aiRec = { composeTyped: jest.fn() };
    const prisma = mockPrisma({
      user: { findUnique: jest.fn().mockResolvedValue({ country }) },
    });
    const { svc } = build({ prisma, aiRec });

    await expect(svc.startTyped('u1', 'real', 'ko')).rejects.toMatchObject({
      response: { code: 'real_exam_country_unavailable' },
    });
    expect(aiRec.composeTyped).not.toHaveBeenCalled();
  });
});

function playableProblem(id = 'p-1') {
  return {
    id,
    source: `source-${id}`,
    body: `body-${id}`,
    difficulty: 'MEDIUM',
    answer: '2',
    steps: [{
      id: `step-${id}`,
      stepIndex: 1,
      stepType: 'ANSWER',
      prompt: 'Pick one',
      choices: [
        { id: `choice-${id}-1`, choiceIndex: 1, text: '1', isCorrect: false },
        { id: `choice-${id}-2`, choiceIndex: 2, text: '2', isCorrect: true },
      ],
    }],
  };
}

describe('MockExamsService recommended weakness loop', () => {
  it.each([
    ['KR', 'ko', 'AI 맞춤형 약점 시험'],
    ['IN', 'en', 'AI-tailored Weakness Test'],
  ] as const)('localizes the %s exam name and records every offered problem', async (country, lang, name) => {
    const aiRec = { compose: jest.fn().mockResolvedValue({ problems: [{ id: 'p-1', source: 'seed', difficulty: 'MEDIUM' }] }) };
    const repo = {
      createSession: jest.fn().mockResolvedValue({ result: { id: 'result-1' } }),
    };
    const prisma = mockPrisma({
      user: { findUnique: jest.fn().mockResolvedValue({ country, tenantId: 'tenant-1' }) },
      problem: { findMany: jest.fn().mockResolvedValue([playableProblem()]) },
    });
    const { svc } = build({ prisma, aiRec, repo });

    const result = await svc.startRecommended('student-1', lang);

    expect(result).toMatchObject({ resultId: 'result-1', name, problems: [{ id: 'p-1' }] });
    expect(repo.createSession).toHaveBeenCalledWith('student-1', {
      name,
      type: 'RECOMMENDED',
      totalProblems: 1,
      totalMinutes: 50,
      problemIds: ['p-1'],
    });
    expect(prisma.recommendationLog.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({
        userId: 'student-1',
        sessionId: 'result-1',
        tenantId: 'tenant-1',
        recommendedProblemId: 'p-1',
        recommendationType: 'REVIEW_PROBLEM',
      })],
    });
  });

  it('validates full problem steps before creating a session, avoiding an orphan result', async () => {
    const aiRec = { compose: jest.fn().mockResolvedValue({ problems: [{ id: 'broken', source: 'seed', difficulty: 'MEDIUM' }] }) };
    const repo = { createSession: jest.fn() };
    const prisma = mockPrisma({
      problem: { findMany: jest.fn().mockResolvedValue([{ ...playableProblem('broken'), steps: [] }]) },
    });
    const { svc } = build({ prisma, aiRec, repo });

    const result = await svc.startRecommended('student-1');

    expect(result).toMatchObject({ resultId: null, problems: [] });
    expect(repo.createSession).not.toHaveBeenCalled();
    expect(prisma.recommendationLog.createMany).not.toHaveBeenCalled();
  });

  it('returns concept-based weak areas and comparison with the previous recommended exam', async () => {
    const current = {
      id: 'result-new',
      userId: 'student-1',
      score: 70,
      grade: 3,
      percentile: 75,
      durationMin: 18,
      takenAt: new Date('2026-07-17T09:00:00Z'),
      mockExam: { type: 'RECOMMENDED', name: 'AI-tailored Weakness Test', totalMinutes: 50 },
      attempts: [{
        problemId: 'p-1',
        stepIndex: 1,
        problem: {
          id: 'p-1', source: 'seed', body: 'body', difficulty: 'MEDIUM',
          concepts: [{ concept: { id: 'c-1', code: 'fractions', name: 'Fractions', nameKo: '분수' } }],
        },
        choice: { choiceIndex: 1, text: 'wrong', isCorrect: false, rationale: 'sign error' },
      }],
    };
    const previous = { id: 'result-old', score: 55, takenAt: new Date('2026-07-10T09:00:00Z') };
    const findFirst = jest.fn().mockResolvedValueOnce(current).mockResolvedValueOnce(previous);
    const prisma = mockPrisma({ mockExamResult: { findFirst } });
    const { svc } = build({ prisma });

    const result = await svc.getResultById('student-1', 'result-new', 'ko');

    expect(result.type).toBe('RECOMMENDED');
    expect(result.weakAreas).toEqual([{
      conceptId: 'c-1',
      code: 'fractions',
      name: '분수',
      problemCount: 1,
      incorrectProblems: 1,
      accuracyPct: 0,
    }]);
    expect(result.scoreDelta).toBe(15);
    expect(result.comparison).toEqual({
      previousResultId: 'result-old',
      previousScore: 55,
      currentScore: 70,
      delta: 15,
      trend: 'improved',
    });
    expect(findFirst).toHaveBeenLastCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        userId: 'student-1',
        mockExam: { type: 'RECOMMENDED' },
        attempts: { some: {} },
      }),
    }));
  });

  it('refreshes the current weekly report after grading', async () => {
    const repo = {
      saveResult: jest.fn().mockResolvedValue({ id: 'result-1', score: 80 }),
    };
    const grading = {
      grade: jest.fn().mockResolvedValue({
        score: 80, grade: 2, percentile: 82, durationMin: 20,
        correctCount: 8, totalProblems: 10, attemptedProblems: 10,
      }),
    };
    const weeklyReports = { generate: jest.fn().mockResolvedValue({ id: 'weekly-1' }) };
    const prisma = mockPrisma({
      attempt: { findMany: jest.fn().mockResolvedValue([
        { problemId: 'p-1', isCorrect: true },
        { problemId: 'p-1', isCorrect: false },
      ]) },
    });
    const { svc } = build({ repo, grading, weeklyReports, prisma });

    await expect(svc.finalize('student-1', 'result-1')).resolves.toMatchObject({ score: 80 });
    expect(prisma.recommendationLog.updateMany).toHaveBeenCalledWith({
      where: {
        userId: 'student-1',
        sessionId: 'result-1',
        recommendedProblemId: 'p-1',
        recommendationType: 'REVIEW_PROBLEM',
      },
      data: { accepted: true, solved: true, result: 'INCORRECT' },
    });
    expect(weeklyReports.generate).toHaveBeenCalledWith('student-1');
    expect(prisma.recommendationLog.updateMany.mock.invocationCallOrder[0])
      .toBeLessThan(weeklyReports.generate.mock.invocationCallOrder[0]);
  });

  it('keeps a durable finalized result when weekly report refresh fails', async () => {
    const repo = {
      saveResult: jest.fn().mockResolvedValue({ id: 'result-1', score: 80 }),
    };
    const grading = {
      grade: jest.fn().mockResolvedValue({
        score: 80, grade: 2, percentile: 82, durationMin: 20,
        correctCount: 8, totalProblems: 10, attemptedProblems: 10,
      }),
    };
    const weeklyReports = { generate: jest.fn().mockRejectedValue(new Error('report db unavailable')) };
    const { svc } = build({ repo, grading, weeklyReports });
    jest.spyOn((svc as any).logger, 'warn').mockImplementation(() => undefined);

    await expect(svc.finalize('student-1', 'result-1')).resolves.toMatchObject({ score: 80 });
  });
});

describe('MockExamsService result write boundaries', () => {
  const answerDto = {
    problemId: 'p-1',
    choiceId: 'choice-p-1-2',
    stepIndex: 1,
    durationSec: 12,
  };

  function ownedResult(over: any = {}) {
    return {
      id: 'result-1',
      userId: 'student-1',
      finalizedAt: null,
      mockExam: { type: 'RECOMMENDED', problemIds: ['p-1'] },
      ...over,
    };
  }

  function choice() {
    return {
      id: answerDto.choiceId,
      choiceIndex: 2,
      text: '2',
      isCorrect: true,
      distractorType: null,
      rationale: 'because',
      step: {
        stepIndex: 1,
        stepType: 'ANSWER',
        problemId: 'p-1',
        problem: { source: 'seed' },
      },
    };
  }

  it('hides and rejects another account result before any attempt write', async () => {
    const prisma = mockPrisma();
    prisma.$queryRaw.mockResolvedValue([]);
    const attempts = { createInTransaction: jest.fn() };
    const { svc } = build({ prisma, attempts });

    await expect(svc.submitStepAnswer('attacker', 'result-1', answerDto))
      .rejects.toBeInstanceOf(NotFoundException);
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
  });

  it('applies the same owner lock to the legacy batch submit route', async () => {
    const prisma = mockPrisma();
    prisma.$queryRaw.mockResolvedValue([]);
    const attempts = { createInTransaction: jest.fn() };
    const { svc } = build({ prisma, attempts });

    await expect(svc.submit('attacker', 'result-1', { answers: [] }))
      .rejects.toBeInstanceOf(NotFoundException);
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
  });

  it('does not grade or reveal another account result through finalize', async () => {
    const prisma = mockPrisma();
    prisma.$queryRaw.mockResolvedValue([]);
    const grading = { grade: jest.fn() };
    const { svc } = build({ prisma, grading });

    await expect(svc.finalize('attacker', 'result-1'))
      .rejects.toBeInstanceOf(NotFoundException);
    expect(grading.grade).not.toHaveBeenCalled();
  });

  it('rejects a problem outside the immutable offered-problem list', async () => {
    const prisma = mockPrisma();
    const attempts = { createInTransaction: jest.fn() };
    const { svc } = build({ prisma, attempts });

    await expect(svc.submitStepAnswer('student-1', 'result-1', {
      ...answerDto,
      problemId: 'p-not-offered',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
  });

  it('rejects arbitrary problems on the staged batch submission contract', async () => {
    const prisma = mockPrisma();
    const attempts = { createInTransaction: jest.fn() };
    const { svc } = build({ prisma, attempts });

    await expect(svc.submit('student-1', 'result-1', {
      answers: [{
        problemId: 'p-not-offered', answer: '1', durationSec: 10,
      }],
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
  });

  it('rejects an arbitrary problem on the REAL paper submission contract', async () => {
    const prisma = mockPrisma({
      mockExamResult: {
        findFirstOrThrow: jest.fn().mockResolvedValue(
          ownedResult({ mockExam: { type: 'REAL', problemIds: ['p-1'] } }),
        ),
      },
    });
    const attempts = { createInTransaction: jest.fn() };
    const { svc } = build({ prisma, attempts });

    await expect(svc.submitPaper('student-1', 'result-1', {
      answers: [{
        problemId: 'p-not-offered', choiceId: answerDto.choiceId, durationSec: 10,
      }],
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
  });

  it('rejects per-step answer writes after finalization', async () => {
    const prisma = mockPrisma({
      mockExamResult: {
        findFirstOrThrow: jest.fn().mockResolvedValue(
          ownedResult({ finalizedAt: new Date('2026-07-17T10:00:00Z') }),
        ),
      },
    });
    const attempts = { createInTransaction: jest.fn() };
    const { svc } = build({ prisma, attempts });

    await expect(svc.submitStepAnswer('student-1', 'result-1', answerDto))
      .rejects.toBeInstanceOf(ConflictException);
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
  });

  it('makes submit-paper REAL-only and blocks every staged route for REAL', async () => {
    const real = ownedResult({ mockExam: { type: 'REAL', problemIds: ['p-1'] } });
    const prisma = mockPrisma({
      mockExamResult: { findFirstOrThrow: jest.fn().mockResolvedValue(real) },
    });
    const attempts = { createInTransaction: jest.fn() };
    const grading = { grade: jest.fn() };
    const { svc } = build({ prisma, attempts, grading });

    await expect(svc.submitStepAnswer('student-1', 'result-1', answerDto))
      .rejects.toMatchObject({ response: { code: 'real_exam_requires_paper_submit' } });
    await expect(svc.finalize('student-1', 'result-1'))
      .rejects.toMatchObject({ response: { code: 'real_exam_requires_paper_submit' } });
    await expect(svc.submit('student-1', 'result-1', { answers: [] }))
      .rejects.toMatchObject({ response: { code: 'real_exam_requires_paper_submit' } });
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
    expect(grading.grade).not.toHaveBeenCalled();

    const stagedPrisma = mockPrisma();
    const staged = build({ prisma: stagedPrisma, attempts });
    await expect(staged.svc.submitPaper('student-1', 'result-1', { answers: [] }))
      .rejects.toMatchObject({ response: { code: 'paper_submit_requires_real_exam' } });
  });

  it('rejects a REAL paper choice that is not from the canonical ANSWER step', async () => {
    const prisma = mockPrisma({
      mockExamResult: {
        findFirstOrThrow: jest.fn().mockResolvedValue(
          ownedResult({ mockExam: { type: 'REAL', problemIds: ['p-1'] } }),
        ),
      },
      problemChoice: {
        findUnique: jest.fn().mockResolvedValue({
          step: { problemId: 'p-1', stepIndex: 2, stepType: 'PROCESS' },
        }),
      },
    });
    const attempts = { createInTransaction: jest.fn() };
    const { svc } = build({ prisma, attempts });

    await expect(svc.submitPaper('student-1', 'result-1', {
      answers: [{ problemId: 'p-1', choiceId: answerDto.choiceId, durationSec: 10 }],
    })).rejects.toMatchObject({ response: { code: 'choice_not_in_required_step' } });
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
  });

  it('returns an exact open-step retry idempotently without replaying listeners', async () => {
    const existing = {
      id: 'attempt-1',
      userId: 'student-1',
      problemId: 'p-1',
      mockExamResultId: 'result-1',
      choiceId: answerDto.choiceId,
      answer: '2',
      stepIndex: 1,
      isCorrect: true,
      errorCodes: [],
      hintUsed: false,
      durationSec: 12,
    };
    const prisma = mockPrisma({
      attempt: { findFirst: jest.fn().mockResolvedValue(existing) },
      problemChoice: { findUnique: jest.fn().mockResolvedValue(choice()) },
    });
    const attempts = {
      createInTransaction: jest.fn(),
      publishCommitted: jest.fn(),
      formatCommitted: jest.fn().mockResolvedValue({ ...existing, attemptId: existing.id }),
    };
    const { svc } = build({ prisma, attempts });

    await expect(svc.submitStepAnswer('student-1', 'result-1', answerDto))
      .resolves.toMatchObject({ attemptId: 'attempt-1', idempotent: true });
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
    expect(attempts.publishCommitted).not.toHaveBeenCalled();
    expect(attempts.formatCommitted).toHaveBeenCalledWith(existing);
  });

  it('rejects a different choice for an already occupied result/problem/step', async () => {
    const prisma = mockPrisma({
      attempt: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'attempt-1', choiceId: 'different-choice', answer: '1', stepIndex: 1,
        }),
      },
      problemChoice: { findUnique: jest.fn().mockResolvedValue(choice()) },
    });
    const attempts = { createInTransaction: jest.fn() };
    const { svc } = build({ prisma, attempts });

    await expect(svc.submitStepAnswer('student-1', 'result-1', answerDto))
      .rejects.toBeInstanceOf(ConflictException);
    expect(attempts.createInTransaction).not.toHaveBeenCalled();
  });

  it('replays finalize for the owner without reopening or rewriting the score', async () => {
    const stored = {
      id: 'result-1', userId: 'student-1', score: 80, grade: 2,
      percentile: 82, durationMin: 20, finalizedAt: new Date('2026-07-17T10:00:00Z'),
    };
    const prisma = mockPrisma({
      mockExamResult: {
        findFirstOrThrow: jest.fn()
          .mockResolvedValueOnce(ownedResult({ finalizedAt: stored.finalizedAt }))
          .mockResolvedValueOnce(stored),
      },
    });
    const grading = { grade: jest.fn().mockResolvedValue({
      score: 80, grade: 2, percentile: 82, durationMin: 20,
      correctCount: 8, totalProblems: 10, attemptedProblems: 10,
    }) };
    const repo = { saveResult: jest.fn() };
    const weeklyReports = { generate: jest.fn().mockResolvedValue({ id: 'weekly-1' }) };
    const { svc } = build({ prisma, grading, repo, weeklyReports });

    await expect(svc.finalize('student-1', 'result-1')).resolves.toMatchObject({
      id: 'result-1', score: 80, idempotent: true, correctCount: 8,
    });
    expect(repo.saveResult).not.toHaveBeenCalled();
    expect(grading.grade).toHaveBeenCalledWith('student-1', 'result-1', {}, prisma);
    expect(weeklyReports.generate).toHaveBeenCalledWith('student-1');
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
