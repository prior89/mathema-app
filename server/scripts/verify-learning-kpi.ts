import { PrismaClient } from '@prisma/client';
import {
  resolveMetricsExcludedUserIds,
  sqlUserIdNotIn,
  userIdNotExcluded,
} from '../src/modules/admin/metrics-test-user-filter';

const p = new PrismaClient();

async function main() {
  const excludedIds = await resolveMetricsExcludedUserIds(p);
  const userFilter = userIdNotExcluded(excludedIds);
  const userSql = sqlUserIdNotIn(excludedIds);
  console.log('ExcludedTesters', { count: excludedIds.length, ids: excludedIds });

  const since90 = new Date();
  since90.setDate(since90.getDate() - 90);
  since90.setHours(0, 0, 0, 0);
  const windowMs = 14 * 24 * 60 * 60 * 1000;

  const [inP, krP] = await Promise.all([
    p.conceptProgress.findMany({
      where: { startedAt: { gte: since90 }, ...userFilter },
      select: { userId: true, startedAt: true, masteredAt: true },
    }),
    p.koreanConceptProgress.findMany({
      where: { startedAt: { gte: since90 }, ...userFilter },
      select: { userId: true, startedAt: true, masteredAt: true },
    }),
  ]);
  const starters = new Set<string>();
  const mastered14 = new Set<string>();
  for (const r of [...inP, ...krP]) {
    starters.add(r.userId);
    if (r.masteredAt) {
      const e = r.masteredAt.getTime() - r.startedAt.getTime();
      if (e >= 0 && e <= windowMs) mastered14.add(r.userId);
    }
  }
  console.log('NorthStar', {
    starters: starters.size,
    mastered14Users: mastered14.size,
    pct: starters.size ? (mastered14.size / starters.size * 100).toFixed(1) : 0,
  });

  const students = await p.user.count({
    where: {
      deletedAt: null,
      role: 'STUDENT',
      createdAt: { gte: since90 },
      ...(excludedIds.length > 0 ? { id: { notIn: excludedIds } } : {}),
    },
  });
  console.log('CohortStudents90d', students);

  const [inM, krM, inS, krS] = await Promise.all([
    p.conceptProgress.count({ where: { masteredAt: { not: null }, ...userFilter } }),
    p.koreanConceptProgress.count({ where: { masteredAt: { not: null }, ...userFilter } }),
    p.conceptProgress.count({ where: userFilter }),
    p.koreanConceptProgress.count({ where: userFilter }),
  ]);
  console.log('ChapterRows', {
    mastered: inM + krM,
    started: inS + krS,
    pct: ((inM + krM) / (inS + krS) * 100).toFixed(1),
  });

  const wnTotal = await p.wrongNote.count({ where: userFilter });
  const wnMastered = await p.wrongNote.count({ where: { status: 'MASTERED', ...userFilter } });
  console.log('WrongNotes', {
    total: wnTotal,
    mastered: wnMastered,
    pct: wnTotal ? (wnMastered / wnTotal * 100).toFixed(1) : 0,
  });

  const solverTotal = await p.solverAttempt.count({
    where: excludedIds.length > 0
      ? { OR: [{ userId: null }, { userId: { notIn: excludedIds } }] }
      : {},
  });
  const answered = await p.solverAttempt.count({
    where: {
      studentCorrect: { not: null },
      ...(excludedIds.length > 0
        ? { OR: [{ userId: null }, { userId: { notIn: excludedIds } }] }
        : {}),
    },
  });
  const correct = await p.solverAttempt.count({
    where: {
      studentCorrect: true,
      ...(excludedIds.length > 0
        ? { OR: [{ userId: null }, { userId: { notIn: excludedIds } }] }
        : {}),
    },
  });
  console.log('Solver', {
    total: solverTotal,
    answered,
    correct,
    pct: answered ? (correct / answered * 100).toFixed(1) : null,
  });

  const ep = await p.errorPatternProfile.groupBy({
    by: ['status'],
    where: userFilter,
    _count: true,
  });
  console.log('ErrorPatterns', ep);

  const since7 = new Date();
  since7.setDate(since7.getDate() - 7);
  const acts = await p.dailyActivity.findMany({
    where: { date: { gte: since7 }, intensity: { gt: 0 }, ...userFilter },
    select: { userId: true },
  });
  console.log('DailyActivity7d', {
    rows: acts.length,
    uniqueUsers: new Set(acts.map((a) => a.userId)).size,
  });

  const events = await p.analyticsEvent.groupBy({
    by: ['eventType'],
    where: {
      createdAt: { gte: since7 },
      ...(excludedIds.length > 0
        ? { OR: [{ userId: null }, { userId: { notIn: excludedIds } }] }
        : {}),
    },
    _count: { _all: true },
    orderBy: { _count: { eventType: 'desc' } },
    take: 10,
  });
  console.log('Analytics7d', events.map((e) => ({ type: e.eventType, n: e._count._all })));

  const avgRows = await p.$queryRaw<Array<{ avg_days: number | null }>>`
    SELECT AVG(days)::float AS avg_days FROM (
      SELECT EXTRACT(EPOCH FROM ("masteredAt" - "startedAt")) / 86400.0 AS days
      FROM "ConceptProgress" WHERE "masteredAt" IS NOT NULL ${userSql}
      UNION ALL
      SELECT EXTRACT(EPOCH FROM ("masteredAt" - "startedAt")) / 86400.0 AS days
      FROM "KoreanConceptProgress" WHERE "masteredAt" IS NOT NULL ${userSql}
    ) t
  `;
  console.log('AvgDaysToMastery', avgRows[0]?.avg_days);
}

main().finally(() => p.$disconnect());