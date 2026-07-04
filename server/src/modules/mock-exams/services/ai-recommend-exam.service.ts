import { Injectable } from '@nestjs/common';
import { AiService } from '../../../infrastructure/ai/ai.service';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { WrongNotesRepository } from '../../wrong-notes/wrong-notes.repository';
import { Difficulty } from '../../../common/enums/difficulty.enum';
import { examDifficultyDistribution, productiveStruggleWeight } from '../../../common/utils/difficulty-matcher.util';
import { NCERT_TO_KR_GRADE } from '../../diagnostic/diagnostic-pool-gate';

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
      // Cold-start: no unit mastery yet. Seed the "personalized" exam from the
      // onboarding diagnostic's placement profile (weak concepts) so a brand-new
      // user's first recommended exam actually targets their weak areas instead
      // of a generic recent-problem grab. True generic fallback only if there's
      // no placement either.
      return this.coldStartExam(userId, country, 20);
    }

    const target = 20;
    // Selection weight = productive-struggle (85% rule / ZPD), not pure weakness:
    // the peak sits on the reachable-weak band, so effort isn't wasted on the
    // absolute weakest (usually prerequisite-blocked / below productive struggle).
    const weights = masteries.map((m) => ({ unitId: m.unitId, score: m.score, w: productiveStruggleWeight(m.score) }));
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

  /** Cold-start (no unit mastery): target the diagnostic-derived weak concepts
   *  from UserPlacementProfile. Falls back to generic only if there is no
   *  placement profile or its weak concepts have no linked problems. */
  private async coldStartExam(userId: string, country: 'IN' | 'KR', target: number) {
    const placement = await this.prisma.userPlacementProfile.findUnique({
      where: { userId },
      select: { weakConceptIds: true },
    });
    const weakIds = placement?.weakConceptIds ?? [];
    if (weakIds.length === 0) return this.fallbackAnyLinked(10, country);
    const treeFilter = country === 'KR'
      ? { koreanConceptLessonId: { not: null } }
      : { conceptLessonId: { not: null } };
    const ps = await this.prisma.problem.findMany({
      where: {
        ...treeFilter,
        concepts: { some: { conceptId: { in: weakIds } } },
        steps: { some: { stepIndex: 1 } },
      },
      take: target,
      orderBy: { createdAt: 'desc' },
    });
    if (ps.length === 0) return this.fallbackAnyLinked(10, country);
    return { problems: ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })) };
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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true, gradeLevel: true },
    });
    const country = user?.country === 'KR' ? 'KR' : 'IN';
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
      // Target the highest productive-struggle unit (reachable-weak), NOT the
      // single lowest-score unit — the latter is usually below productive
      // struggle (prereqs missing) and teaches little (85% rule / ZPD).
      const snaps = await this.prisma.masterySnapshot.findMany({ where: { userId } });
      const target = snaps.length
        ? snaps.reduce((best, s) =>
            productiveStruggleWeight(s.score) > productiveStruggleWeight(best.score) ? s : best)
        : null;
      if (!target) {
        const fb = await this.fallbackAnyLinked(5, country);
        return { kind, ...fb };
      }
      const dist = examDifficultyDistribution(target.score);
      const krOnly = country === 'KR' ? { koreanConceptLessonId: { not: null } } : {};
      const problems: Array<{ id: string; source: string; difficulty: string }> = [];
      for (const [diff, ratio] of Object.entries(dist) as [Difficulty, number][]) {
        const n = Math.round(10 * ratio);
        if (n <= 0) continue;
        const ps = await this.prisma.problem.findMany({
          where: { unitId: target.unitId, difficulty: diff as any, ...krOnly }, take: n,
        });
        problems.push(...ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })));
      }
      if (problems.length === 0) {
        const ps = await this.prisma.problem.findMany({ where: { unitId: target.unitId, ...krOnly }, take: 10 });
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
    // User.gradeLevel stores CLASS_7..CLASS_12 for both countries. KR maps
    // those values to MIDDLE_1..HIGH_3 before filtering the Korean lesson
    // relation. Never fall back to another grade: an empty same-grade pool is
    // safer than serving an off-grade full-paper exam.
    let pool: Array<{ id: string; source: string; difficulty: string }> = [];
    if (country === 'KR' && user?.gradeLevel) {
      const koreanGrade = NCERT_TO_KR_GRADE[user.gradeLevel];
      pool = await this.prisma.problem.findMany({
        where: {
          koreanConceptLesson: { koreanGrade },
          steps: { some: { stepIndex: 1 } },
        },
        orderBy: { source: 'asc' },
      });
    } else if (country === 'IN' && user?.gradeLevel) {
      pool = await this.prisma.problem.findMany({
        where: {
          conceptLesson: { ncertClass: user.gradeLevel },
          steps: { some: { stepIndex: 1 } },
        },
        orderBy: { source: 'asc' },
      });
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
    return { kind, fallbackReason: 'no-grade-problems' as const, problems: [] };
  }
}
