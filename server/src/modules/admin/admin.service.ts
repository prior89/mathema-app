import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { StepType } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { UNIT_NAME_EN } from '../../common/i18n/content-en';
import type { ConceptLessonsService } from '../concept-lessons/concept-lessons.service';
import type { CreateKoreanStudyProblemDto } from './dto/create-korean-study-problem.dto';

// Exported so AdminController can name this type for its `prewarmMastery`
// return — without `export` TS4053 fired at build time because the controller
// method's inferred return type references a file-local interface that the
// emitted .d.ts cannot reach.
export interface PrewarmResult {
  chapterCode: string;
  before: number;
  generated: number;
  after: number;
  error?: string;
}

const localizeUnit = (name: string | undefined | null, lang: Lang) =>
  lang !== 'ko' ? (name && UNIT_NAME_EN[name]) || name || '—' : name || '—';

/**
 * 관리자 데이터 — 전체 사용자/시스템 통계 + 개별 사용자 상세.
 * 모든 메서드는 read-only.
 */
@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(private readonly prisma: PrismaService) {}

  // ===== 시스템 전체 개요 =====
  async overview() {
    const now = new Date();
    const day7 = new Date(now); day7.setDate(day7.getDate() - 7);
    const day30 = new Date(now); day30.setDate(day30.getDate() - 30);

    const [
      totalUsers, activeUsers7d, totalAttempts, attemptsLast7d, attemptsLast30d,
      totalProblems, totalUnits, totalWrongNotes, masteredWrongNotes,
      totalMockResults, totalAnalyticsEvents,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({
        where: { deletedAt: null, attempts: { some: { createdAt: { gte: day7 } } } },
      }),
      this.prisma.attempt.count(),
      this.prisma.attempt.count({ where: { createdAt: { gte: day7 } } }),
      this.prisma.attempt.count({ where: { createdAt: { gte: day30 } } }),
      this.prisma.problem.count(),
      this.prisma.unit.count(),
      this.prisma.wrongNote.count(),
      this.prisma.wrongNote.count({ where: { status: 'MASTERED' } }),
      this.prisma.mockExamResult.count(),
      this.prisma.analyticsEvent.count(),
    ]);

    const recentSignups = await this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, email: true, name: true, gradeLevel: true, createdAt: true } as any,
    });

    const accuracyAgg = await this.prisma.attempt.groupBy({
      by: ['isCorrect'], _count: true,
    });
    const correct = accuracyAgg.find((x) => x.isCorrect)?._count ?? 0;
    const wrong = accuracyAgg.find((x) => !x.isCorrect)?._count ?? 0;
    const overallAccuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    return {
      totalUsers, activeUsers7d, overallAccuracy,
      totalAttempts, attemptsLast7d, attemptsLast30d,
      totalProblems, totalUnits, totalWrongNotes, masteredWrongNotes,
      totalMockResults, totalAnalyticsEvents,
      recentSignups,
    };
  }

  // ===== 사용자 목록 + 핵심 지표 =====
  async listUsers(limit = 100) {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' }, take: limit,
      select: {
        id: true, email: true, name: true,
        examDate: true, targetGrade: true,
        createdAt: true, updatedAt: true,
        gradeLevel: true,
      } as any,
    });
    if (users.length === 0) return [];

    const ids: string[] = users.map((u: any) => u.id);
    const [attempts, masteries, wrongNotes, mockResults, lastAttempts] = await Promise.all([
      this.prisma.attempt.groupBy({ by: ['userId', 'isCorrect'], where: { userId: { in: ids } }, _count: true }),
      this.prisma.masterySnapshot.groupBy({ by: ['userId'], where: { userId: { in: ids } }, _avg: { score: true }, _count: true }),
      this.prisma.wrongNote.groupBy({ by: ['userId', 'status'], where: { userId: { in: ids } }, _count: true }),
      this.prisma.mockExamResult.groupBy({ by: ['userId'], where: { userId: { in: ids } }, _count: true, _avg: { score: true } }),
      this.prisma.attempt.findMany({
        where: { userId: { in: ids } },
        orderBy: { createdAt: 'desc' }, distinct: ['userId'],
        select: { userId: true, createdAt: true },
      }),
    ]);

    const byUser = new Map<string, any>();
    (users as any[]).forEach((u) => byUser.set(u.id, {
      ...u, attemptsTotal: 0, attemptsCorrect: 0, accuracy: 0,
      masteryAvg: null as number | null, masteryCount: 0,
      wrongNotesTotal: 0, wrongNotesMastered: 0,
      mockExamCount: 0, mockExamAvgScore: null as number | null,
      lastActivityAt: null as Date | null,
    }));
    for (const a of attempts) {
      const r = byUser.get(a.userId); if (!r) continue;
      r.attemptsTotal += a._count;
      if (a.isCorrect) r.attemptsCorrect += a._count;
    }
    for (const r of byUser.values()) {
      r.accuracy = r.attemptsTotal > 0 ? Math.round((r.attemptsCorrect / r.attemptsTotal) * 100) : 0;
    }
    for (const m of masteries) {
      const r = byUser.get(m.userId); if (!r) continue;
      r.masteryAvg = m._avg.score != null ? Math.round(m._avg.score) : null;
      r.masteryCount = m._count;
    }
    for (const w of wrongNotes) {
      const r = byUser.get(w.userId); if (!r) continue;
      r.wrongNotesTotal += w._count;
      if (w.status === 'MASTERED') r.wrongNotesMastered += w._count;
    }
    for (const m of mockResults) {
      const r = byUser.get(m.userId); if (!r) continue;
      r.mockExamCount = m._count;
      r.mockExamAvgScore = m._avg.score != null ? Math.round(m._avg.score) : null;
    }
    for (const a of lastAttempts) {
      const r = byUser.get(a.userId); if (!r) continue;
      r.lastActivityAt = a.createdAt;
    }
    return Array.from(byUser.values());
  }

  // ===== 사용자 상세 =====
  async userDetail(userId: string, lang: Lang = 'en') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, examDate: true, targetGrade: true,
        gradeLevel: true, createdAt: true, updatedAt: true, deletedAt: true,
      } as any,
    });
    if (!user) throw new NotFoundException('user not found');

    const [mastery, recentAttempts, wrongNotes, mockResults, dailyActivity, weeklyReports, recentEvents] = await Promise.all([
      this.prisma.masterySnapshot.findMany({
        where: { userId }, include: { unit: true }, orderBy: { score: 'asc' },
      }),
      this.prisma.attempt.findMany({
        where: { userId }, orderBy: { createdAt: 'desc' }, take: 50,
        include: {
          problem: { select: { source: true, difficulty: true, unit: { select: { name: true } } } },
          choice: { select: { choiceIndex: true, isCorrect: true, distractorType: true } },
        },
      }),
      this.prisma.wrongNote.findMany({
        where: { userId }, orderBy: { createdAt: 'desc' },
        include: { problem: { select: { source: true, body: true, unit: { select: { name: true } }, subUnit: { select: { name: true } } } } },
      }),
      this.prisma.mockExamResult.findMany({
        where: { userId }, orderBy: { takenAt: 'desc' }, include: { mockExam: true },
      }),
      this.prisma.dailyActivity.findMany({
        where: { userId }, orderBy: { date: 'desc' }, take: 90,
      }),
      this.prisma.weeklyReport.findMany({
        where: { userId }, orderBy: { weekStart: 'desc' }, take: 12,
      }),
      this.prisma.analyticsEvent.findMany({
        where: { userId }, orderBy: { createdAt: 'desc' }, take: 100,
      }),
    ]);

    // 단원명 lang 적용 — mastery / attempts / wrongNotes 모두
    const masteryL = mastery.map((m: any) => ({ ...m, unit: { ...m.unit, name: localizeUnit(m.unit?.name, lang) } }));
    const attemptsL = recentAttempts.map((a: any) => ({
      ...a,
      problem: { ...a.problem, unit: a.problem.unit ? { ...a.problem.unit, name: localizeUnit(a.problem.unit.name, lang) } : null },
    }));
    const wrongL = wrongNotes.map((w: any) => ({
      ...w,
      problem: {
        ...w.problem,
        unit: w.problem.unit ? { ...w.problem.unit, name: localizeUnit(w.problem.unit.name, lang) } : null,
      },
    }));
    return { user, mastery: masteryL, recentAttempts: attemptsL, wrongNotes: wrongL, mockResults, dailyActivity, weeklyReports, recentEvents };
  }

  // ===== Analytics 이벤트 (모든 사용자) =====
  async events(params: { from?: string; to?: string; type?: string; userId?: string; limit?: number }) {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.type) where.eventType = params.type;
    if (params.from || params.to) {
      where.createdAt = {};
      if (params.from) where.createdAt.gte = new Date(params.from);
      if (params.to) where.createdAt.lte = new Date(params.to);
    }
    const limit = Math.min(500, Math.max(10, params.limit ?? 100));
    const [items, byType] = await Promise.all([
      this.prisma.analyticsEvent.findMany({
        where, orderBy: { createdAt: 'desc' }, take: limit,
        include: { user: { select: { email: true, name: true } } },
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['eventType'], where, _count: true,
      } as any),
    ]);
    return { items, byType };
  }

  // ===== 국가별 사용자 분포 — Phase 2/3 확장 모니터링 =====
  async usersByCountry() {
    const rows = await this.prisma.user.groupBy({
      by: ['country'] as any, where: { deletedAt: null }, _count: true,
    } as any);
    return (rows as any[]).sort((a, b) => b._count - a._count);
  }

  // ===== 콘텐츠 커버리지 — Class × Unit × (problems / stepped / with concept / with formula) =====
  async contentCoverage(lang: Lang = 'en') {
    const units = await this.prisma.unit.findMany({
      orderBy: { order: 'asc' },
      include: { problems: { include: { _count: { select: { steps: true } } } } },
    });

    const result = units.map((u: any) => {
      const total = u.problems.length;
      const stepped = u.problems.filter((p: any) => p._count.steps >= 3).length;
      const withConcept = u.problems.filter((p: any) => !!p.concept).length;
      const withFormula = u.problems.filter((p: any) => !!p.formula).length;
      const byDifficulty: Record<string, number> = {};
      for (const p of u.problems) byDifficulty[p.difficulty] = (byDifficulty[p.difficulty] ?? 0) + 1;
      return {
        unitId: u.id,
        unitName: localizeUnit(u.name, lang),
        gradeLevels: u.gradeLevels ?? [],
        order: u.order,
        problems: total,
        stepped,
        withConcept,
        withFormula,
        byDifficulty,
        gapToTarget: Math.max(0, 20 - total),
      };
    });

    // 학년별 요약
    const grades = ['CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'];
    const summary = grades.map((g) => {
      const inGrade = result.filter((u) => (u.gradeLevels as string[]).includes(g));
      const total = inGrade.reduce((s, u) => s + u.problems, 0);
      const stepped = inGrade.reduce((s, u) => s + u.stepped, 0);
      const target = inGrade.length * 20;
      return {
        grade: g, units: inGrade.length, problems: total, stepped, target,
        coverage: target > 0 ? Math.round((total / target) * 100) : 0,
      };
    });

    return { units: result, summary };
  }

  // ===== Distractor 선택 분포 — 콘텐츠 품질 + 학습자 misconception 시그널 =====
  async distractorInsights(days = 30, lang: Lang = 'en') {
    const since = new Date(); since.setDate(since.getDate() - days);
    const wrongAttempts = await this.prisma.attempt.findMany({
      where: { isCorrect: false, choiceId: { not: null }, createdAt: { gte: since } },
      include: {
        choice: { select: { distractorType: true, rationale: true, step: { select: { stepType: true } } } },
        problem: { select: { source: true, unit: { select: { name: true } } } },
      },
    });

    const totalWrong = wrongAttempts.length;
    const byType: Record<string, number> = {};
    const byStepType: Record<string, number> = {};
    const byUnit: Record<string, { unit: string; total: number; byType: Record<string, number> }> = {};

    for (const a of wrongAttempts) {
      const dt = a.choice?.distractorType ?? 'UNCLASSIFIED';
      const st = a.choice?.step?.stepType ?? 'UNKNOWN';
      const unitName = localizeUnit(a.problem.unit?.name, lang);
      byType[dt] = (byType[dt] ?? 0) + 1;
      byStepType[`${st}/${dt}`] = (byStepType[`${st}/${dt}`] ?? 0) + 1;
      const u = byUnit[unitName] ?? (byUnit[unitName] = { unit: unitName, total: 0, byType: {} });
      u.total += 1;
      u.byType[dt] = (u.byType[dt] ?? 0) + 1;
    }

    // 가장 많이 선택된 distractor (rationale 샘플 포함) — 콘텐츠 검수용
    const choiceCounts = new Map<string, number>();
    for (const a of wrongAttempts) {
      if (!a.choiceId) continue;
      choiceCounts.set(a.choiceId, (choiceCounts.get(a.choiceId) ?? 0) + 1);
    }
    const topIds = [...choiceCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([id]) => id);
    const topChoices = topIds.length === 0 ? [] : await this.prisma.problemChoice.findMany({
      where: { id: { in: topIds } },
      select: {
        id: true, text: true, distractorType: true, rationale: true,
        step: { select: { stepType: true, problem: { select: { source: true, unit: { select: { name: true } } } } } },
      },
    });
    const topDistractors = topChoices
      .map((c: any) => ({
        choiceId: c.id,
        text: c.text,
        distractorType: c.distractorType,
        rationale: c.rationale,
        unit: localizeUnit(c.step?.problem?.unit?.name, lang),
        source: c.step?.problem?.source ?? '—',
        stepType: c.step?.stepType ?? '—',
        count: choiceCounts.get(c.id) ?? 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      windowDays: days,
      totalWrong,
      byType: Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ key: k, count: v, share: totalWrong ? Math.round((v / totalWrong) * 100) : 0 })),
      byStepType: Object.entries(byStepType).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ key: k, count: v })),
      byUnit: Object.values(byUnit).sort((a, b) => b.total - a.total),
      topDistractors,
    };
  }

  // ===== 푸시 헬스 — DeviceToken 활성 / 비활성 / 플랫폼별 =====
  async pushHealth() {
    const [total, active, disabled, byPlatform, recentSent] = await Promise.all([
      this.prisma.deviceToken.count(),
      this.prisma.deviceToken.count({ where: { disabledAt: null } }),
      this.prisma.deviceToken.count({ where: { disabledAt: { not: null } } }),
      this.prisma.deviceToken.groupBy({
        by: ['platform'], _count: true,
      } as any),
      this.prisma.deviceToken.findMany({
        where: { disabledAt: null }, orderBy: { lastSentAt: 'desc' }, take: 10,
        include: { user: { select: { email: true, name: true } } },
      }),
    ]);
    return { total, active, disabled, byPlatform, recentSent };
  }

  // ===== 어드민 감사 로그 =====
  async auditLogs(params: { limit?: number; email?: string; path?: string }) {
    const where: any = {};
    if (params.email) where.adminEmail = params.email;
    if (params.path) where.path = { contains: params.path };
    const limit = Math.min(1000, Math.max(10, params.limit ?? 200));
    const items = await (this.prisma as any).adminAccessLog.findMany({
      where, orderBy: { createdAt: 'desc' }, take: limit,
    });
    const byEmail = await (this.prisma as any).adminAccessLog.groupBy({
      by: ['adminEmail'], _count: true,
    });
    return { items, byEmail };
  }

  // ===== 일별 활성 사용자 (최근 N일) =====
  async dailyActives(days = 30) {
    const since = new Date(); since.setDate(since.getDate() - days);
    const acts = await this.prisma.dailyActivity.findMany({
      where: { date: { gte: since }, intensity: { gt: 0 } },
      select: { userId: true, date: true },
    });
    const map = new Map<string, Set<string>>();
    for (const a of acts) {
      const key = a.date.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(a.userId);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, set]) => ({ date, dau: set.size }));
  }

  // ===== Prewarm Mastery — HTTP wrapper around scripts/prewarm-mastery.ts =====

  /** Counts multi-step problems (steps 1, 2, AND 3) for a chapter — same
   *  definition the script uses. */
  private async countMultiStep(chapterCode: string): Promise<number> {
    const rows = await this.prisma.$queryRaw<Array<{ n: bigint }>>`
      SELECT COUNT(*)::bigint AS n
      FROM "Problem" p
      JOIN "ConceptLesson" cl ON cl.id = p."conceptLessonId"
      WHERE cl."chapterCode" = ${chapterCode}
        AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 1)
        AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 2)
        AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 3);
    `;
    return Number(rows[0]?.n ?? 0);
  }

  /** Every chapter whose multi-step pool is currently < target. */
  private async findUnderstocked(target: number): Promise<string[]> {
    const rows = await this.prisma.$queryRaw<Array<{ chapterCode: string; multi: bigint }>>`
      SELECT cl."chapterCode" AS "chapterCode",
             (SELECT COUNT(*)
              FROM "Problem" p
              WHERE p."conceptLessonId" = cl.id
                AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 1)
                AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 2)
                AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 3)
             )::bigint AS multi
      FROM "ConceptLesson" cl
      WHERE cl."unitId" IS NOT NULL
      ORDER BY cl."chapterCode";
    `;
    return rows.filter((r) => Number(r.multi) < target).map((r) => r.chapterCode);
  }

  /** Pool-gap audit — per chapter, how many multi-step (Mastery) and
   *  single-step (Study) problems exist vs. the 20 target. Use this to
   *  decide which chapters to hand-curate now that LLM auto-topup is off. */
  async poolGaps() {
    const rows = await this.prisma.$queryRawUnsafe<Array<{
      chapter_code: string;
      title_en: string;
      ncert_class: string;
      chapter_number: number;
      multi_step: bigint;
      single_step: bigint;
      mastery_frozen: boolean;
    }>>(`
      SELECT
        cl."chapterCode"   AS chapter_code,
        cl."titleEn"       AS title_en,
        cl."ncertClass"    AS ncert_class,
        cl."chapterNumber" AS chapter_number,
        (SELECT COUNT(*) FROM "Problem" p
          WHERE p."conceptLessonId" = cl.id
            AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 1)
            AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 2)
            AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 3)
        ) AS multi_step,
        (SELECT COUNT(*) FROM "Problem" p
          WHERE p."conceptLessonId" = cl.id
            AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 1)
            AND NOT EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" >= 2)
        ) AS single_step,
        (array_length(cl."masterySetProblemIds", 1) IS NOT NULL
          AND array_length(cl."masterySetProblemIds", 1) = 20) AS mastery_frozen
      FROM "ConceptLesson" cl
      ORDER BY cl."ncertClass", cl."chapterNumber";
    `);
    const TARGET = 20;
    return rows.map((r) => ({
      chapterCode: r.chapter_code,
      title: r.title_en,
      ncertClass: r.ncert_class,
      chapterNumber: r.chapter_number,
      multiStepCount: Number(r.multi_step),
      singleStepCount: Number(r.single_step),
      multiStepGap: Math.max(0, TARGET - Number(r.multi_step)),
      singleStepGap: Math.max(0, TARGET - Number(r.single_step)),
      masteryFrozen: r.mastery_frozen,
      needsCuration: Number(r.multi_step) < TARGET || Number(r.single_step) < TARGET,
    }));
  }

  /** Phase 1 readiness inventory off the LessonProblemSet shadow table.
   *  Read-only: the student runtime still consumes masterySetProblemIds
   *  on ConceptLesson / KoreanConceptLesson. This view exists so admin can
   *  measure IN and KR set completeness with the same contract.
   *
   *  Behaviour:
   *  - per (country, chapterCode, setType) returns the active (non-retired)
   *    version row when present.
   *  - lessons that have no LessonProblemSet row at all are surfaced with
   *    status=MISSING so the gap is explicit.
   *  - filters: country=IN|KR, setType=MASTERY_3STEP|STUDY_1STEP|DIAGNOSTIC. */
  async lessonProblemSetReadiness(opts: {
    country?: 'IN' | 'KR';
    setType?: 'MASTERY_3STEP' | 'STUDY_1STEP' | 'DIAGNOSTIC';
  }) {
    const country = opts.country;
    const setType = opts.setType ?? 'MASTERY_3STEP';

    // Authoritative lesson lists per side — these are the "should exist"
    // universe; LessonProblemSet rows are the "do exist" overlay.
    const wantIN = !country || country === 'IN';
    const wantKR = !country || country === 'KR';

    const ncert = wantIN ? await this.prisma.conceptLesson.findMany({
      select: { id: true, chapterCode: true, ncertClass: true, chapterNumber: true, titleEn: true },
      orderBy: [{ ncertClass: 'asc' }, { chapterNumber: 'asc' }],
    }) : [];
    const korean = wantKR ? await this.prisma.koreanConceptLesson.findMany({
      select: { id: true, chapterCode: true, koreanGrade: true, koreanSubject: true, chapterNumber: true, titleKo: true },
      orderBy: [{ koreanGrade: 'asc' }, { koreanSubject: 'asc' }, { chapterNumber: 'asc' }],
    }) : [];

    const sets = await this.prisma.lessonProblemSet.findMany({
      where: {
        ...(country ? { country } : {}),
        setType,
        retiredAt: null,
      },
      select: {
        country: true, chapterCode: true, status: true, version: true,
        problemIds: true, curatedAt: true, updatedAt: true,
      },
    });
    const byKey = new Map<string, typeof sets[number]>();
    for (const s of sets) {
      byKey.set(`${s.country}:${s.chapterCode}`, s);
    }

    const inRows = ncert.map((l) => {
      const s = byKey.get(`IN:${l.chapterCode}`);
      return {
        country: 'IN' as const,
        chapterCode: l.chapterCode,
        label: `${l.ncertClass} CH${String(l.chapterNumber).padStart(2, '0')} — ${l.titleEn}`,
        status: s?.status ?? 'MISSING',
        version: s?.version ?? null,
        problemCount: s?.problemIds.length ?? 0,
        curatedAt: s?.curatedAt ?? null,
      };
    });
    const krRows = korean.map((l) => {
      const s = byKey.get(`KR:${l.chapterCode}`);
      return {
        country: 'KR' as const,
        chapterCode: l.chapterCode,
        label: `${l.koreanGrade} ${l.koreanSubject} CH${String(l.chapterNumber).padStart(2, '0')} — ${l.titleKo}`,
        status: s?.status ?? 'MISSING',
        version: s?.version ?? null,
        problemCount: s?.problemIds.length ?? 0,
        curatedAt: s?.curatedAt ?? null,
      };
    });

    const all = [...inRows, ...krRows];
    const summary = {
      country: country ?? 'ALL',
      setType,
      totalChapters: all.length,
      ready: all.filter((r) => r.status === 'READY').length,
      needsReview: all.filter((r) => r.status === 'NEEDS_REVIEW').length,
      draft: all.filter((r) => r.status === 'DRAFT').length,
      missing: all.filter((r) => r.status === 'MISSING').length,
    };
    return { summary, chapters: all };
  }

  /** HTTP-callable equivalent of scripts/prewarm-mastery.ts. Blocks until done.
   *  Each chapter takes ~30-60s × (target - existing)/5 — a full sweep can
   *  run for minutes. Caller (AdminController) holds the HTTP connection open. */
  async prewarmMastery(opts: {
    chapterCodes?: string[];
    target: number;
    lessons: ConceptLessonsService;
  }): Promise<{ target: number; processed: number; totalGenerated: number; results: PrewarmResult[] }> {
    const { target, lessons } = opts;
    const chapters = opts.chapterCodes?.length
      ? opts.chapterCodes
      : await this.findUnderstocked(target);

    if (chapters.length === 0) {
      return { target, processed: 0, totalGenerated: 0, results: [] };
    }

    this.logger.log(`prewarm-mastery queue: ${chapters.length} chapter(s), target=${target}`);

    const results: PrewarmResult[] = [];
    let totalGenerated = 0;
    for (const code of chapters) {
      const t0 = Date.now();
      const before = await this.countMultiStep(code);
      const need = Math.max(0, target - before);
      if (need === 0) {
        results.push({ chapterCode: code, before, generated: 0, after: before });
        continue;
      }
      try {
        await lessons.prewarmChapter(code, need);
        const after = await this.countMultiStep(code);
        const generated = after - before;
        totalGenerated += generated;
        results.push({ chapterCode: code, before, generated, after });
        this.logger.log(
          `prewarm [${code}] before=${before} generated=${generated} after=${after} took=${((Date.now() - t0) / 1000).toFixed(1)}s`,
        );
      } catch (e) {
        const error = (e as Error).message;
        this.logger.error(`prewarm [${code}] FAILED: ${error}`);
        results.push({ chapterCode: code, before, generated: 0, after: before, error });
      }
    }

    return { target, processed: results.length, totalGenerated, results };
  }

  /** Author one KR Study (single-step) problem. Validates exactly 1 correct,
   *  inserts Problem + ANSWER step + 5 choices. Returns created problem id.
   *  Used by AdminKoreanStudyEditorScreen.
   */
  async createKoreanStudyProblem(dto: CreateKoreanStudyProblemDto) {
    const lesson = await this.prisma.koreanConceptLesson.findUnique({
      where: { chapterCode: dto.chapterCode }, select: { id: true },
    });
    if (!lesson) throw new NotFoundException(`KoreanConceptLesson ${dto.chapterCode} not found`);

    // Exactly 1 correct + 4 wrong validation.
    const correctCount = dto.options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      throw new BadRequestException(`Exactly 1 option must be isCorrect=true (got ${correctCount})`);
    }
    // Wrong options must carry errorCode + rationale (qualitative validation —
    // matches the seed file convention so analytics keeps a consistent shape).
    for (const o of dto.options) {
      if (!o.isCorrect && (!o.errorCode || !o.rationale)) {
        throw new BadRequestException('Wrong options require both errorCode and rationale');
      }
    }

    // Problem.unitId is NOT NULL on the legacy NCERT side — Korean rows reuse
    // a fallback unit since the Korean curriculum is wired through
    // koreanConceptLessonId. The first unit by order is fine; mirrors the
    // pattern in scripts/seed-korean-study-problems.ts.
    const fallbackUnit = await this.prisma.unit.findFirst({
      orderBy: { order: 'asc' }, select: { id: true },
    });
    if (!fallbackUnit) throw new NotFoundException('No Unit row found to use as Problem.unitId fallback');

    const answerText = dto.options.find((o) => o.isCorrect)?.text ?? '';
    const problem = await this.prisma.problem.create({
      data: {
        source: 'Matheo KR (2022 개정) · Study · admin-authored',
        unitId: fallbackUnit.id,
        koreanConceptLessonId: lesson.id,
        difficulty: dto.difficulty,
        difficultyLevel: dto.difficultyLevel,
        body: dto.stem,
        concept: dto.concept,
        answer: answerText,
        requiredSkills: dto.requiredSkills ?? [],
        expectedSolutionSteps: { explanation: dto.solution } as any,
        steps: {
          create: [{
            stepIndex: 1,
            stepType: StepType.ANSWER,
            prompt: dto.stem,
            choices: {
              create: dto.options.map((o, i) => ({
                choiceIndex: i + 1,
                text: o.text,
                isCorrect: o.isCorrect,
                distractorErrorCode: o.errorCode ?? null,
                rationale: o.rationale ?? null,
              })),
            },
          }],
        },
      },
      select: { id: true },
    });
    return { id: problem.id, chapterCode: dto.chapterCode };
  }

  /** Chapter picker source for the admin form. Returns lessons (all KR
   *  chapters) annotated with current study-pool size (single-step problem
   *  count) so the admin can see "이미 N개 있음" before adding more. */
  async koreanChaptersWithStudyCounts() {
    const lessons = await this.prisma.koreanConceptLesson.findMany({
      orderBy: [{ koreanGrade: 'asc' }, { koreanSubject: 'asc' }, { chapterNumber: 'asc' }],
      select: {
        id: true, chapterCode: true, titleKo: true,
        koreanGrade: true, koreanSubject: true, chapterNumber: true,
      },
    });
    // Single-step (Study) count per lesson — 1-step ANSWER-only problems.
    const counts = await this.prisma.problem.groupBy({
      by: ['koreanConceptLessonId'],
      where: {
        koreanConceptLessonId: { in: lessons.map((l) => l.id) },
        steps: { every: { stepType: 'ANSWER' } },
      },
      _count: { _all: true },
    });
    const studyCount = new Map(counts.map((c) => [c.koreanConceptLessonId, c._count._all]));
    return lessons.map((l) => ({
      ...l,
      studyProblemCount: studyCount.get(l.id) ?? 0,
    }));
  }

  /**
   * Sprint 5 #76 E: inspect a chapter's frozen 20-set + the candidate pool.
   *
   * Returns the current canonical_20 (in order) with per-row quality flags
   * and the broader pool of mastery-eligible problems (3-step + same lesson)
   * that aren't already in the set — admin picks one as `newProblemId` for
   * a swap. Country-aware: chapterCode starting with 'K-' → KR, else NCERT.
   */
  async masterySetInventory(chapterCode: string) {
    const isKR = chapterCode.startsWith('K-');
    const lesson = isKR
      ? await this.prisma.koreanConceptLesson.findUnique({
          where: { chapterCode },
          select: { id: true, masterySetProblemIds: true, titleKo: true },
        })
      : await this.prisma.conceptLesson.findUnique({
          where: { chapterCode },
          select: { id: true, masterySetProblemIds: true, titleEn: true },
        });
    if (!lesson) throw new NotFoundException(`Lesson ${chapterCode} not found`);
    const lessonFkKey = isKR ? 'koreanConceptLessonId' : 'conceptLessonId';

    // Current frozen set — preserve admin-set order.
    const currentRows = await this.prisma.problem.findMany({
      where: { id: { in: lesson.masterySetProblemIds } },
      select: {
        id: true, source: true, body: true, difficulty: true, difficultyLevel: true,
        qualityStatus: true, qualityCriticalFlags: true, conceptMismatch: true,
        _count: { select: { steps: true } },
      },
    });
    const rowsById = new Map(currentRows.map((p) => [p.id, p]));
    const current = lesson.masterySetProblemIds.map((id, idx) => {
      const p = rowsById.get(id);
      return {
        index: idx,
        problemId: id,
        present: !!p,
        source: p?.source ?? null,
        body: p?.body.slice(0, 120) ?? null,
        difficulty: p?.difficulty ?? null,
        difficultyLevel: p?.difficultyLevel ?? null,
        stepCount: p?._count.steps ?? 0,
        qualityStatus: p?.qualityStatus ?? null,
        flags: p?.qualityCriticalFlags ?? [],
        conceptMismatch: p?.conceptMismatch ?? false,
        // Suggested-for-replacement if any active-pool guard would reject it.
        needsSwap:
          !p ||
          p._count.steps !== 3 ||
          p.qualityStatus === 'EXCLUDED' ||
          p.conceptMismatch,
      };
    });

    // Candidate pool — same lesson, 3-step Mastery format, quality OK,
    // not already in the canonical set.
    const candidates = await this.prisma.problem.findMany({
      where: {
        [lessonFkKey]: lesson.id,
        id: { notIn: lesson.masterySetProblemIds },
        AND: [
          { steps: { some: { stepIndex: 1 } } },
          { steps: { some: { stepIndex: 2 } } },
          { steps: { some: { stepIndex: 3 } } },
        ],
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
      },
      orderBy: [{ difficultyLevel: 'asc' }, { source: 'asc' }],
      take: 50,
      select: {
        id: true, source: true, body: true, difficulty: true, difficultyLevel: true,
        qualityStatus: true,
      },
    });

    return {
      chapterCode,
      curriculum: isKR ? 'KR' : 'IN',
      lessonId: lesson.id,
      title: isKR ? (lesson as any).titleKo : (lesson as any).titleEn,
      canonicalCount: lesson.masterySetProblemIds.length,
      needsSwapCount: current.filter((r) => r.needsSwap).length,
      current,
      candidates: candidates.map((p) => ({
        problemId: p.id,
        source: p.source,
        body: p.body.slice(0, 120),
        difficulty: p.difficulty,
        difficultyLevel: p.difficultyLevel,
        qualityStatus: p.qualityStatus,
      })),
      candidatePoolSize: candidates.length,
    };
  }

  /**
   * Sprint 5 #76 E: swap one entry in masterySetProblemIds. Index preserved.
   *
   * Validates:
   *   - old in current set
   *   - new in same lesson, 3-step, quality OK, conceptMismatch=false
   *   - new not already in current set
   *
   * Returns the updated array + a structured audit log (also stamped via
   * AdminAuditInterceptor on the request side).
   */
  async swapMasterySetProblem(
    chapterCode: string,
    dto: { oldProblemId: string; newProblemId: string; reason: string },
  ) {
    if (dto.oldProblemId === dto.newProblemId) {
      throw new BadRequestException('oldProblemId == newProblemId');
    }
    const isKR = chapterCode.startsWith('K-');
    const lesson = isKR
      ? await this.prisma.koreanConceptLesson.findUnique({
          where: { chapterCode },
          select: { id: true, masterySetProblemIds: true },
        })
      : await this.prisma.conceptLesson.findUnique({
          where: { chapterCode },
          select: { id: true, masterySetProblemIds: true },
        });
    if (!lesson) throw new NotFoundException(`Lesson ${chapterCode} not found`);
    const lessonFkKey = isKR ? 'koreanConceptLessonId' : 'conceptLessonId';

    const idx = lesson.masterySetProblemIds.indexOf(dto.oldProblemId);
    if (idx < 0) {
      throw new BadRequestException(
        `oldProblemId ${dto.oldProblemId} not in ${chapterCode} canonical set`,
      );
    }
    if (lesson.masterySetProblemIds.includes(dto.newProblemId)) {
      throw new BadRequestException(
        `newProblemId ${dto.newProblemId} already in canonical set`,
      );
    }

    const newProb = await this.prisma.problem.findUnique({
      where: { id: dto.newProblemId },
      select: {
        id: true,
        conceptLessonId: true,
        koreanConceptLessonId: true,
        qualityStatus: true,
        conceptMismatch: true,
        _count: { select: { steps: true } },
      },
    });
    if (!newProb) throw new NotFoundException(`newProblemId ${dto.newProblemId} not found`);

    const newLessonFk = (newProb as any)[lessonFkKey] as string | null;
    if (newLessonFk !== lesson.id) {
      throw new BadRequestException(
        `newProblemId belongs to a different lesson (${lessonFkKey}=${newLessonFk})`,
      );
    }
    if (newProb._count.steps !== 3) {
      throw new BadRequestException(
        `newProblemId has ${newProb._count.steps} steps; Mastery requires 3`,
      );
    }
    if (newProb.conceptMismatch) {
      throw new BadRequestException('newProblemId is conceptMismatch=true; refusing to swap in');
    }
    if (newProb.qualityStatus === 'EXCLUDED') {
      throw new BadRequestException('newProblemId is qualityStatus=EXCLUDED; refusing to swap in');
    }

    const updated = [...lesson.masterySetProblemIds];
    updated[idx] = dto.newProblemId;

    if (isKR) {
      await this.prisma.koreanConceptLesson.update({
        where: { id: lesson.id },
        data: { masterySetProblemIds: updated },
      });
    } else {
      await this.prisma.conceptLesson.update({
        where: { id: lesson.id },
        data: { masterySetProblemIds: updated },
      });
    }

    // eslint-disable-next-line no-console
    console.warn(
      '[mastery-set-swap]',
      JSON.stringify({
        chapterCode, curriculum: isKR ? 'KR' : 'IN', index: idx,
        oldProblemId: dto.oldProblemId, newProblemId: dto.newProblemId,
        reason: dto.reason.slice(0, 200), at: new Date().toISOString(),
      }),
    );

    return {
      ok: true,
      chapterCode,
      index: idx,
      oldProblemId: dto.oldProblemId,
      newProblemId: dto.newProblemId,
      masterySetProblemIds: updated,
    };
  }

  /**
   * Sprint 7: list student-reported problems for operator review.
   *
   * Surfaces every Problem with 'STUDENT_REPORTED' in qualityCriticalFlags —
   * regardless of current qualityStatus (post-restore still shows up so we
   * can see the history). Joined with the chapter source-of-truth so the
   * operator sees "where this problem lives" without a separate lookup.
   *
   * Optional filter:
   *   curriculum: 'KR' | 'IN' — restrict to one curriculum.
   */
  async listReportedProblems(filter: { curriculum?: 'KR' | 'IN' } = {}) {
    const where: any = { qualityCriticalFlags: { has: 'STUDENT_REPORTED' } };
    if (filter.curriculum === 'KR') where.koreanConceptLessonId = { not: null };
    else if (filter.curriculum === 'IN') where.conceptLessonId = { not: null };

    const rows = await this.prisma.problem.findMany({
      where,
      select: {
        id: true,
        source: true,
        body: true,
        difficulty: true,
        difficultyLevel: true,
        qualityStatus: true,
        qualityCriticalFlags: true,
        conceptLessonId: true,
        koreanConceptLessonId: true,
        conceptLesson: { select: { chapterCode: true, titleEn: true } },
        koreanConceptLesson: { select: { chapterCode: true, titleKo: true } },
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });

    return rows.map((p) => ({
      problemId: p.id,
      source: p.source,
      body: p.body.slice(0, 160),
      difficulty: p.difficulty,
      difficultyLevel: p.difficultyLevel,
      qualityStatus: p.qualityStatus,
      flags: p.qualityCriticalFlags,
      curriculum: p.koreanConceptLessonId ? 'KR' : p.conceptLessonId ? 'IN' : 'LEGACY',
      chapterCode:
        p.koreanConceptLesson?.chapterCode ?? p.conceptLesson?.chapterCode ?? null,
      chapterTitle:
        p.koreanConceptLesson?.titleKo ?? p.conceptLesson?.titleEn ?? null,
      reportedAt: p.updatedAt, // best-effort — Problem.updatedAt is the report stamp
    }));
  }

  /**
   * Sprint 7: restore a student-reported problem back into the active pool.
   *
   * - Removes 'STUDENT_REPORTED' from qualityCriticalFlags.
   * - If no other critical flags remain, also resets qualityStatus to NULL
   *   so the row passes the active-pool filter again (NULL = legacy/USABLE).
   * - If other flags remain (e.g. CHAPTER_MISMATCH from LLM grader), keeps
   *   qualityStatus=EXCLUDED so the row stays out.
   *
   * Operator note: a restored row is back in front of students immediately.
   * Use this when the report turned out to be a false alarm.
   */
  async restoreReportedProblem(problemId: string) {
    const p = await this.prisma.problem.findUnique({
      where: { id: problemId },
      select: { id: true, qualityStatus: true, qualityCriticalFlags: true },
    });
    if (!p) throw new NotFoundException(`Problem ${problemId} not found`);
    if (!p.qualityCriticalFlags.includes('STUDENT_REPORTED')) {
      throw new BadRequestException('Problem is not flagged STUDENT_REPORTED');
    }

    const remainingFlags = p.qualityCriticalFlags.filter((f) => f !== 'STUDENT_REPORTED');
    const newStatus = remainingFlags.length === 0 ? null : p.qualityStatus;

    await this.prisma.problem.update({
      where: { id: problemId },
      data: {
        qualityCriticalFlags: remainingFlags,
        qualityStatus: newStatus,
      },
    });

    // eslint-disable-next-line no-console
    console.warn(
      '[problem-report-restore]',
      JSON.stringify({
        problemId, priorStatus: p.qualityStatus, newStatus,
        remainingFlags, at: new Date().toISOString(),
      }),
    );
    return { ok: true, problemId, qualityStatus: newStatus, flags: remainingFlags };
  }
}
