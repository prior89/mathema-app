import { Prisma } from '@prisma/client';
import { AchievementsService } from './achievements.service';

function build() {
  const prisma = {
    userAchievement: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    conceptProgress: { count: jest.fn().mockResolvedValue(1) },
    koreanConceptProgress: { count: jest.fn().mockResolvedValue(0) },
    firstSessionPlan: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
  };
  return { svc: new AchievementsService(prisma as never), prisma };
}

describe('AchievementsService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('awards FIRST_CONCEPT_STEP once', async () => {
    const { svc, prisma } = build();
    prisma.userAchievement.findUnique.mockResolvedValue(null);
    prisma.userAchievement.create.mockResolvedValue({
      kind: 'FIRST_CONCEPT_STEP',
      earnedAt: new Date('2026-06-09'),
      metadata: null,
    });

    const row = await svc.tryAwardFirstConceptStep('u1', { chapterCode: 'C11-CH01' });
    expect(row?.kind).toBe('FIRST_CONCEPT_STEP');
    expect(prisma.firstSessionPlan.updateMany).toHaveBeenCalled();
  });

  it('is idempotent on duplicate award', async () => {
    const { svc, prisma } = build();
    const err = new Prisma.PrismaClientKnownRequestError('dup', {
      code: 'P2002',
      clientVersion: '5',
    });
    prisma.userAchievement.create.mockRejectedValue(err);

    const row = await svc.tryAward('u1', 'FIRST_PRACTICE_CORRECT');
    expect(row).toBeNull();
  });
});