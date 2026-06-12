import { Injectable } from '@nestjs/common';
import { AiService } from '../../../infrastructure/ai/ai.service';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { WrongNotesRepository } from '../../wrong-notes/wrong-notes.repository';
import { Difficulty } from '../../../common/enums/difficulty.enum';
import { examDifficultyDistribution } from '../../../common/utils/difficulty-matcher.util';

/**
 * AI 맞춤 진단 모의고사 — 약점 단원 위주 30문제 자동 구성.
 * (UI: "맞춤 진단 모의고사 / 30문제 / 60분 / 지금 시작하기")
 */
@Injectable()
export class AiRecommendExamService {
  constructor(
    private readonly ai: AiService,
    private readonly prisma: PrismaService,
    private readonly wrongNotesRepo: WrongNotesRepository,
  ) {}

  /**
   * 맞춤 진단: 약점 단원 역가중치 + ZPD 난이도 분포 기반 30문제 구성.
   *   1) 단원별 할당량 = (100 - mastery.score) 가중치로 30문제 분배
   *   2) 단원별 평균 mastery → 권장 난이도 분포 → 문제 추출
   */
  async compose(userId: string) {
    const country = await this.userCountry(userId);
    const masteries = await this.prisma.masterySnapshot.findMany({
      where: { userId }, include: { unit: true },
    });
    if (masteries.length === 0) {
      // Cold-start: no mastery yet → fall back to any concept-lesson-linked problems.
      return this.fallbackAnyLinked(10, country);
    }

    const target = 20;
    const weights = masteries.map((m) => ({ unitId: m.unitId, score: m.score, w: Math.max(5, 100 - m.score) }));
    const totalW = weights.reduce((s, x) => s + x.w, 0);

    // Units are shared across the IN/KR curriculum trees, so a unit draw for
    // a KR user must still exclude English NCERT-tree problems.
    const krOnly = country === 'KR' ? { koreanConceptLessonId: { not: null } } : {};

    const problems: Array<{ id: string; source: string; difficulty: string }> = [];
    for (const m of weights) {
      const allocate = Math.max(1, Math.round((m.w / totalW) * target));
      const dist = examDifficultyDistribution(m.score);
      for (const [diff, ratio] of Object.entries(dist) as [Difficulty, number][]) {
        const n = Math.round(allocate * ratio);
        if (n <= 0) continue;
        const ps = await this.prisma.problem.findMany({
          where: { unitId: m.unitId, difficulty: diff as any, ...krOnly },
          take: n,
          orderBy: { createdAt: 'desc' },
        });
        problems.push(...ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })));
      }
    }
    if (problems.length === 0) return this.fallbackAnyLinked(10, country);
    return { problems: problems.slice(0, target) };
  }

  private async userCountry(userId: string): Promise<'IN' | 'KR'> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true },
    });
    return user?.country === 'KR' ? 'KR' : 'IN';
  }

  /** Cold-start fallback: any curriculum-linked problem from the user's
   *  country tree — KR users must never receive the English NCERT seed. */
  private async fallbackAnyLinked(limit: number, country: 'IN' | 'KR' = 'IN') {
    const lessonFilter = country === 'KR'
      ? { koreanConceptLessonId: { not: null } }
      : { conceptLessonId: { not: null } };
    const ps = await this.prisma.problem.findMany({
      where: { ...lessonFilter, steps: { some: { stepIndex: 1 } } },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return { problems: ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })) };
  }

  /**
   * 유형별:
   *   mini       — 약점 1단원에서 10문제
   *   wrong-redo — SM-2 due 큐의 오답들 (최대 30개)
   *   real       — 6단원 균등 분포 30문제 (실전 시험 시뮬레이션)
   */
  async composeTyped(userId: string, kind: 'mini' | 'wrong-redo' | 'real') {
    const country = await this.userCountry(userId);
    if (kind === 'wrong-redo') {
      const due = await this.wrongNotesRepo.findDue(userId, 20);
      const problemIds = due.map((d: any) => d.problemId);
      if (problemIds.length === 0) {
        // Fresh user with no wrong notes — fall back to general practice.
        const fb = await this.fallbackAnyLinked(5, country);
        return { kind, fallbackReason: 'no-wrong-notes' as const, ...fb };
      }
      const ps = await this.prisma.problem.findMany({ where: { id: { in: problemIds } } });
      return {
        kind,
        problems: ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })),
      };
    }

    if (kind === 'mini') {
      const weakest = await this.prisma.masterySnapshot.findFirst({
        where: { userId }, orderBy: { score: 'asc' },
      });
      if (!weakest) {
        const fb = await this.fallbackAnyLinked(5, country);
        return { kind, ...fb };
      }
      const dist = examDifficultyDistribution(weakest.score);
      const krOnly = country === 'KR' ? { koreanConceptLessonId: { not: null } } : {};
      const problems: Array<{ id: string; source: string; difficulty: string }> = [];
      for (const [diff, ratio] of Object.entries(dist) as [Difficulty, number][]) {
        const n = Math.round(10 * ratio);
        if (n <= 0) continue;
        const ps = await this.prisma.problem.findMany({
          where: { unitId: weakest.unitId, difficulty: diff as any, ...krOnly }, take: n,
        });
        problems.push(...ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })));
      }
      if (problems.length === 0) {
        const ps = await this.prisma.problem.findMany({ where: { unitId: weakest.unitId, ...krOnly }, take: 10 });
        if (ps.length > 0) {
          return { kind, problems: ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })) };
        }
        const fb = await this.fallbackAnyLinked(5, country);
        return { kind, ...fb };
      }
      return { kind, problems };
    }

    // real — grade-wide mixed paper (board-exam simulation, every chapter
    // eligible regardless of unit weakness).
    //
    // KR has no per-user Korean grade (User.gradeLevel is the NCERT enum even
    // for country=KR), so the KR paper draws from the whole Korean curriculum
    // pool instead of a grade slice — drawing from the NCERT tree here was the
    // bug that served English problems to Korean users.
    let pool: Array<{ id: string; source: string; difficulty: string }> = [];
    if (country === 'KR') {
      pool = await this.prisma.problem.findMany({
        where: { koreanConceptLessonId: { not: null }, steps: { some: { stepIndex: 1 } } },
        orderBy: { source: 'asc' },
      });
    } else {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { gradeLevel: true },
      });
      const ncertClass = GRADE_TO_NCERT[user?.gradeLevel ?? ''];
      if (ncertClass) {
        const lessons = await this.prisma.conceptLesson.findMany({
          where: { ncertClass: ncertClass as any },
          select: { id: true },
        });
        const lessonIds = lessons.map((l) => l.id);
        if (lessonIds.length > 0) {
          pool = await this.prisma.problem.findMany({
            where: { conceptLessonId: { in: lessonIds }, steps: { some: { stepIndex: 1 } } },
            orderBy: { source: 'asc' },
          });
        }
      }
    }
    if (pool.length > 0) {
      const shuffled = [...pool];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const picked = shuffled.slice(0, 10);
      return { kind, problems: picked.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })) };
    }
    // Last resort: any-linked (country-scoped).
    const fb = await this.fallbackAnyLinked(10, country);
    return { kind, fallbackReason: 'no-grade-problems' as const, ...fb };
  }
}

/** GradeLevel → NcertClass (DB enum 매핑 — 1:1) */
const GRADE_TO_NCERT: Record<string, string> = {
  CLASS_7: 'CLASS_7', CLASS_8: 'CLASS_8', CLASS_9: 'CLASS_9',
  CLASS_10: 'CLASS_10', CLASS_11: 'CLASS_11', CLASS_12: 'CLASS_12',
};
