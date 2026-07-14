import { UsersRepository } from './users.repository';

describe('UsersRepository account deletion', () => {
  const deletionModels = [
    'attempt',
    'wrongNote',
    'studySession',
    'mockExamResult',
    'dailyActivity',
    'masterySnapshot',
    'weeklyReport',
    'conceptProgress',
    'koreanConceptProgress',
    'passwordResetToken',
    'emailVerificationToken',
    'solverAttempt',
    'lLMAnalysisJob',
    'securityEvent',
  ] as const;

  function makePrisma() {
    const prisma: any = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ id: 'user-1' }),
        delete: jest.fn().mockResolvedValue({ id: 'user-1' }),
      },
      $transaction: jest.fn().mockImplementation(async (ops: unknown[]) => Promise.all(ops)),
    };
    for (const model of deletionModels) {
      prisma[model] = { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) };
    }
    prisma.contentIngestJob = { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) };
    return prisma;
  }

  it('purges every non-cascading user-data table before deleting the account', async () => {
    const prisma = makePrisma();
    const repository = new UsersRepository(prisma);

    await repository.hardDelete('user-1');

    for (const model of deletionModels) {
      expect(prisma[model].deleteMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
    }
    expect(prisma.contentIngestJob.deleteMany).toHaveBeenCalledWith({
      where: { uploadedById: 'user-1' },
    });
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-1' } });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the user does not exist', async () => {
    const prisma = makePrisma();
    prisma.user.findUnique.mockResolvedValue(null);
    const repository = new UsersRepository(prisma);

    await expect(repository.hardDelete('missing')).resolves.toBeNull();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
