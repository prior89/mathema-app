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
    studySession: { create: jest.fn().mockResolvedValue({ id: 'session-1' }) },
    conceptLesson: { findMany: jest.fn() },
    koreanConceptLesson: { findMany: jest.fn() },
  };
  const attempts = { create: jest.fn() };
  return {
    prisma,
    service: new DiagnosticService(prisma as any, attempts as any),
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
