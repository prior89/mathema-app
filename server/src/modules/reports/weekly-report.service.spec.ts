import { CountryCode, ErrorPatternStatus, SubscriptionStatus } from '@prisma/client';
import { WeeklyReportService } from './weekly-report.service';

function build() {
  const prisma = {
    user: {
      findUnique: jest.fn().mockResolvedValue({ tenantId: null, country: CountryCode.KR }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    attempt: { findMany: jest.fn().mockResolvedValue([]) },
    studySession: { findMany: jest.fn().mockResolvedValue([]) },
    masteryEvent: { findMany: jest.fn().mockResolvedValue([]) },
    errorPatternProfile: { findMany: jest.fn().mockResolvedValue([]) },
    recommendationLog: { findMany: jest.fn().mockResolvedValue([]) },
    weeklyReport: {
      upsert: jest.fn().mockImplementation(async (args) => ({ id: 'report-1', ...args.create })),
    },
  };
  const service = new WeeklyReportService(prisma as any);
  return { service, prisma };
}

describe('WeeklyReportService', () => {
  it('uses country-aware week boundaries and the unique upsert selector', async () => {
    const { service, prisma } = build();
    const reference = new Date('2026-06-03T12:00:00.000Z');

    await service.generate('student-1', { weekStart: reference });
    await service.generate('student-1', { weekStart: reference });

    expect(prisma.attempt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: 'student-1',
          createdAt: {
            gte: new Date('2026-05-31T15:00:00.000Z'),
            lt: new Date('2026-06-07T15:00:00.000Z'),
          },
        },
      }),
    );
    expect(prisma.masteryEvent.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'student-1',
        createdAt: {
          gte: new Date('2026-05-31T15:00:00.000Z'),
          lt: new Date('2026-06-07T15:00:00.000Z'),
        },
      },
      select: {
        id: true,
        conceptId: true,
        masteryScore: true,
        delta: true,
        evidenceCount: true,
        createdAt: true,
        concept: { select: { name: true, nameKo: true } },
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    expect(prisma.weeklyReport.upsert).toHaveBeenCalledTimes(2);
    for (const [call] of prisma.weeklyReport.upsert.mock.calls) {
      expect(call.where).toEqual({
        userId_isoWeek: { userId: 'student-1', isoWeek: '2026-W23' },
      });
      expect(call.create).toEqual(
        expect.objectContaining({
          weekStart: new Date('2026-06-01T00:00:00.000Z'),
          weekEnd: new Date('2026-06-08T00:00:00.000Z'),
        }),
      );
      expect(call.update).toEqual(
        expect.objectContaining({
          weekStart: new Date('2026-06-01T00:00:00.000Z'),
          weekEnd: new Date('2026-06-08T00:00:00.000Z'),
        }),
      );
    }
  });

  it('summarises Korean learning evidence with Korean concept names', async () => {
    const { service, prisma } = build();
    prisma.attempt.findMany.mockResolvedValue([
      { isCorrect: true, problem: { difficultyLevel: 2, source: 'NCERT_TEXTBOOK' } },
      { isCorrect: false, problem: { difficultyLevel: 3, source: 'NCERT_TEXTBOOK' } },
    ]);
    prisma.studySession.findMany.mockResolvedValue([{ durationSec: 1800 }]);
    prisma.masteryEvent.findMany.mockResolvedValue([
      {
        id: 'mastery-event-1',
        conceptId: 'concept-1',
        masteryScore: 72,
        delta: 5,
        evidenceCount: 5,
        createdAt: new Date('2026-06-03T12:30:00.000Z'),
        concept: {
          name: 'Fractions',
          nameKo: '분수',
        },
      },
    ]);
    prisma.errorPatternProfile.findMany.mockResolvedValue([
      {
        id: 'pattern-1',
        status: ErrorPatternStatus.ACTIVE,
        errorCode: 'SIGN',
        severity: 'MEDIUM',
        concept: { id: 'concept-1', name: 'Fractions', nameKo: '분수' },
      },
    ]);
    prisma.recommendationLog.findMany.mockResolvedValue([{ accepted: true, solved: true }]);

    await service.generate('student-1', {
      weekStart: new Date('2026-06-03T12:00:00.000Z'),
    });

    expect(prisma.weeklyReport.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          totalAttempts: 2,
          totalSessions: 1,
          accuracyPct: 50,
          topImprovedConcepts: ['concept-1'],
          repeatedErrorPatterns: ['pattern-1'],
          recommendedNextGoals: [
            '분수 숙련도를 72%에서 다음 주 목표 82%까지 높여 보세요.',
            '분수에서 SIGN 유형 실수를 줄여 보세요. 풀이 과정을 한 단계씩 적어 보세요.',
          ],
          studentSummary: expect.stringContaining(
            '이번 주에는 문제를 2개 풀었고 정답률은 50%예요.',
          ),
          parentSummary: expect.stringContaining(
            '이번 주 학습 세션은 1회, 세션당 평균 30분입니다.',
          ),
          teacherSummary: expect.stringContaining('주요 오류 패턴: 분수의 SIGN (MEDIUM).'),
        }),
      }),
    );
  });

  it('uses English wording and English concept names for India', async () => {
    const { service, prisma } = build();
    prisma.user.findUnique.mockResolvedValue({ tenantId: null, country: CountryCode.IN });
    prisma.attempt.findMany.mockResolvedValue([
      { isCorrect: true, problem: { difficultyLevel: 2, source: 'NCERT_TEXTBOOK' } },
    ]);
    prisma.masteryEvent.findMany.mockResolvedValue([
      {
        id: 'mastery-event-1',
        conceptId: 'concept-1',
        masteryScore: 55,
        delta: -6,
        evidenceCount: 4,
        createdAt: new Date('2026-06-03T12:30:00.000Z'),
        concept: {
          name: 'Fractions',
          nameKo: '분수',
        },
      },
    ]);

    await service.generate('student-in', {
      weekStart: new Date('2026-06-03T12:00:00.000Z'),
    });

    const update = prisma.weeklyReport.upsert.mock.calls[0][0].update;
    expect(update.recommendedNextGoals).toEqual([
      'Raise Fractions mastery from 55% to 65% next week.',
    ]);
    expect(update.studentSummary).toContain('This week, you solved 1 problem with 100% accuracy.');
    expect(update.parentSummary).toContain('Concepts to strengthen: Fractions.');
    expect(update.teacherSummary).toContain('Concepts to strengthen: Fractions.');
    expect(update.studentSummary).not.toContain('분수');
  });

  it('keeps a retried historical report isolated from later mastery changes', async () => {
    const { service, prisma } = build();
    const allEvents = [
      {
        id: 'event-weak-1',
        conceptId: 'concept-algebra',
        masteryScore: 55,
        delta: -6,
        evidenceCount: 3,
        createdAt: new Date('2026-06-02T03:00:00.000Z'),
        concept: { name: 'Algebra', nameKo: '대수' },
      },
      {
        id: 'event-improved',
        conceptId: 'concept-geometry',
        masteryScore: 68,
        delta: 5,
        evidenceCount: 4,
        createdAt: new Date('2026-06-03T03:00:00.000Z'),
        concept: { name: 'Geometry', nameKo: '기하' },
      },
      {
        id: 'event-weak-2',
        conceptId: 'concept-algebra',
        masteryScore: 49,
        delta: -6,
        evidenceCount: 4,
        createdAt: new Date('2026-06-05T03:00:00.000Z'),
        concept: { name: 'Algebra', nameKo: '대수' },
      },
      {
        id: 'event-next-week',
        conceptId: 'concept-algebra',
        masteryScore: 92,
        delta: 43,
        evidenceCount: 5,
        createdAt: new Date('2026-06-09T03:00:00.000Z'),
        concept: { name: 'Algebra', nameKo: '대수' },
      },
    ];
    prisma.masteryEvent.findMany.mockImplementation(async (args: any) => {
      const { gte, lt } = args.where.createdAt;
      return allEvents.filter((event) => event.createdAt >= gte && event.createdAt < lt);
    });
    const reference = new Date('2026-06-03T12:00:00.000Z');

    await service.generate('student-1', { weekStart: reference });
    await service.generate('student-1', { weekStart: reference });

    const updates = prisma.weeklyReport.upsert.mock.calls.map(([args]) => args.update);
    expect(updates).toHaveLength(2);
    for (const update of updates) {
      expect(update.topImprovedConcepts).toEqual(['concept-geometry']);
      expect(update.weakConcepts).toEqual(['concept-algebra']);
      expect(update.recommendedNextGoals[0]).toBe(
        '대수 숙련도를 49%에서 다음 주 목표 59%까지 높여 보세요.',
      );
      expect(update.studentSummary).not.toContain('92%');
    }
  });

  it('stores empty mastery-derived lists when a premium candidate has no weekly evidence', async () => {
    const { service, prisma } = build();

    await service.generate('premium-no-activity', {
      weekStart: new Date('2026-06-03T12:00:00.000Z'),
    });

    const update = prisma.weeklyReport.upsert.mock.calls[0][0].update;
    expect(update).toEqual(
      expect.objectContaining({
        topImprovedConcepts: [],
        weakConcepts: [],
        recommendedNextGoals: [],
        studentSummary: '이번 주 학습 기록이 아직 없어요. 문제 한 개부터 가볍게 시작해 보세요.',
      }),
    );
  });

  it('refreshes in-week reports and includes active or entitled students without redoing final reports', async () => {
    const { service, prisma } = build();
    prisma.user.findMany.mockImplementation(async (args: any) =>
      args.where.country === CountryCode.KR ? [{ id: 'student-kr' }] : [],
    );
    const generate = jest.spyOn(service, 'generate').mockResolvedValue({ id: 'report-1' } as any);
    const now = new Date('2026-06-07T20:00:00.000Z');

    await expect(service.generateCompletedWeekReports(now)).resolves.toEqual({
      skipped: false,
      candidates: 1,
      generated: 1,
      failed: 0,
    });

    const krQuery = prisma.user.findMany.mock.calls
      .map(([args]) => args)
      .find((args) => args.where.country === CountryCode.KR);
    expect(krQuery.where).toEqual(
      expect.objectContaining({
        role: 'STUDENT',
        deletedAt: null,
        weeklyReports: {
          none: {
            isoWeek: '2026-W23',
            generatedAt: { gte: new Date('2026-06-07T15:00:00.000Z') },
          },
        },
      }),
    );
    expect(krQuery.where.OR).toEqual([
      {
        attempts: {
          some: {
            createdAt: {
              gte: new Date('2026-05-31T15:00:00.000Z'),
              lt: new Date('2026-06-07T15:00:00.000Z'),
            },
          },
        },
      },
      {
        studySessions: {
          some: {
            startedAt: {
              gte: new Date('2026-05-31T15:00:00.000Z'),
              lt: new Date('2026-06-07T15:00:00.000Z'),
            },
          },
        },
      },
      {
        weeklyReports: {
          some: {
            isoWeek: '2026-W23',
            generatedAt: { lt: new Date('2026-06-07T15:00:00.000Z') },
          },
        },
      },
      {
        subscription: {
          is: {
            status: {
              in: [
                SubscriptionStatus.ACTIVE,
                SubscriptionStatus.GRACE,
                SubscriptionStatus.CANCELED,
              ],
            },
            expiryTime: { gt: now },
          },
        },
      },
    ]);
    expect(generate).toHaveBeenCalledWith('student-kr', {
      weekStart: new Date('2026-05-31T20:00:00.000Z'),
    });
  });

  it('isolates one student failure so another report is still generated', async () => {
    const { service, prisma } = build();
    prisma.user.findMany.mockImplementation(async (args: any) =>
      args.where.country === CountryCode.IN ? [{ id: 'student-fail' }, { id: 'student-ok' }] : [],
    );
    jest
      .spyOn(service, 'generate')
      .mockRejectedValueOnce(new Error('temporary database error'))
      .mockResolvedValueOnce({ id: 'report-ok' } as any);

    await expect(
      service.generateCompletedWeekReports(new Date('2026-06-07T20:00:00.000Z')),
    ).resolves.toEqual({
      skipped: false,
      candidates: 2,
      generated: 1,
      failed: 1,
    });
  });

  it('skips an overlapping in-process scheduler invocation', async () => {
    const { service, prisma } = build();
    let release!: (rows: never[]) => void;
    prisma.user.findMany
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            release = resolve;
          }),
      )
      .mockResolvedValue([]);

    const first = service.generateCompletedWeekReports(new Date('2026-06-07T20:00:00.000Z'));
    await Promise.resolve();
    await expect(
      service.generateCompletedWeekReports(new Date('2026-06-07T20:00:00.000Z')),
    ).resolves.toEqual({ skipped: true, candidates: 0, generated: 0, failed: 0 });

    release([]);
    await expect(first).resolves.toEqual({
      skipped: false,
      candidates: 0,
      generated: 0,
      failed: 0,
    });
  });
});
