import { MasteryUpdateSource } from '@prisma/client';
import { MasteryTrajectoryService } from './mastery-trajectory.service';

describe('MasteryTrajectoryService concurrency', () => {
  it('holds a per-student/concept transaction lock across read and writes', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      masteryTrajectory: {
        findUnique: jest.fn().mockResolvedValue({
          masteryScore: 50,
          lastAttemptAt: new Date(),
          recentAccuracy: 0.5,
          averageResponseTimeSec: 30,
          hintUsageRate: 0,
          confidenceGap: 0,
          evidenceCount: 7,
        }),
        upsert: jest.fn().mockResolvedValue({}),
      },
      masteryEvent: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
      },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    };
    const service = new MasteryTrajectoryService(prisma as never);

    await expect(service.updateAfterAttempt({
      userId: 'student-1',
      conceptId: 'concept-1',
      attemptId: 'attempt-8',
      isCorrect: true,
      durationSec: 20,
      hintUsed: false,
      difficultyLevel: 3,
      hasActiveErrorPattern: false,
      source: MasteryUpdateSource.RULE_BASED,
    })).resolves.toEqual({ score: 55, delta: 5 });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.$queryRaw).toHaveBeenCalledTimes(1);
    expect(tx.$queryRaw.mock.invocationCallOrder[0])
      .toBeLessThan(tx.masteryTrajectory.findUnique.mock.invocationCallOrder[0]);
    expect(tx.masteryTrajectory.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: expect.objectContaining({ masteryScore: 55, evidenceCount: 8 }),
    }));
    expect(tx.masteryEvent.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        attemptId: 'attempt-8',
        masteryScore: 55,
        evidenceCount: 8,
      }),
    }));
  });
});
