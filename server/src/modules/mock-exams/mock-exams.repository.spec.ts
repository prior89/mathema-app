import { MockExamsRepository } from './mock-exams.repository';

describe('MockExamsRepository session integrity', () => {
  it('excludes open results from score history', async () => {
    const prisma = {
      mockExamResult: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const repo = new MockExamsRepository(prisma as never);

    await repo.findRecent('student-1', 10);

    expect(prisma.mockExamResult.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        userId: 'student-1',
        finalizedAt: { not: null },
      }),
    }));
  });

  it('creates the exam allowlist and open result atomically', async () => {
    const tx = {
      mockExam: {
        create: jest.fn().mockResolvedValue({ id: 'exam-1' }),
      },
      mockExamResult: {
        create: jest.fn().mockResolvedValue({ id: 'result-1' }),
      },
    };
    const prisma = {
      $transaction: jest.fn(async (callback: any) => callback(tx)),
    };
    const repo = new MockExamsRepository(prisma as never);

    await repo.createSession('student-1', {
      name: 'Weakness test',
      type: 'RECOMMENDED',
      totalProblems: 2,
      totalMinutes: 50,
      problemIds: ['p-1', 'p-2'],
    });

    expect(tx.mockExam.create).toHaveBeenCalledWith({
      data: {
        name: 'Weakness test',
        type: 'RECOMMENDED',
        totalProblems: 2,
        totalMinutes: 50,
        problemIds: ['p-1', 'p-2'],
      },
    });
    expect(tx.mockExamResult.create).toHaveBeenCalledWith({
      data: {
        userId: 'student-1',
        mockExamId: 'exam-1',
        score: 0,
        grade: 9,
        percentile: 0,
        durationMin: 0,
        finalizedAt: null,
      },
    });
  });

  it('owner-scopes result updates', async () => {
    const prisma = {
      mockExamResult: { update: jest.fn().mockResolvedValue({ id: 'result-1' }) },
    };
    const repo = new MockExamsRepository(prisma as never);

    await repo.saveResult('student-1', 'result-1', { score: 75 });

    expect(prisma.mockExamResult.update).toHaveBeenCalledWith({
      where: { id: 'result-1', userId: 'student-1' },
      data: { score: 75 },
    });
  });
});
