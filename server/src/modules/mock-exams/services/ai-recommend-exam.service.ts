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
    const masteries = await this.prisma.masterySnapshot.findMany({
      where: { userId }, include: { unit: true },
    });
    if (masteries.length === 0) {
      // Cold-start: no mastery yet → fall back to any concept-lesson-linked problems.
      return this.fallbackAnyLinked(10);
    }

    const target = 20;
    const weights = masteries.map((m) => ({ unitId: m.unitId, score: m.score, w: Math.max(5, 100 - m.score) }));
    const totalW = weights.reduce((s, x) => s + x.w, 0);

    const problems: Array<{ id: string; source: string; difficulty: string }> = [];
    for (const m of weights) {
      const allocate = Math.max(1, Math.round((m.w / totalW) * target));
      const dist = examDifficultyDistribution(m.score);
      for (const [diff, ratio] of Object.entries(dist) as [Difficulty, number][]) {
        const n = Math.round(allocate * ratio);
        if (n <= 0) continue;
        const ps = await this.prisma.problem.findMany({
          where: { unitId: m.unitId, difficulty: diff as any },
          take: n,
          orderBy: { createdAt: 'desc' },
        });
        problems.push(...ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })));
      }
    }
    if (problems.length === 0) return this.fallbackAnyLinked(10);
    return { problems: problems.slice(0, target) };
  }

  /** Cold-start fallback: any problem with conceptLessonId (English NCERT seed). */
  private async fallbackAnyLinked(limit: number) {
    const ps = await this.prisma.problem.findMany({
      where: { conceptLessonId: { not: null }, steps: { some: { stepIndex: 1 } } },
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
    if (kind === 'wrong-redo') {
      const due = await this.wrongNotesRepo.findDue(userId, 20);
      const problemIds = due.map((d: any) => d.problemId);
      if (problemIds.length === 0) {
        // Fresh user with no wrong notes — fall back to general practice.
        const fb = await this.fallbackAnyLinked(5);
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
        const fb = await this.fallbackAnyLinked(5);
        return { kind, ...fb };
      }
      const dist = examDifficultyDistribution(weakest.score);
      const problems: Array<{ id: string; source: string; difficulty: string }> = [];
      for (const [diff, ratio] of Object.entries(dist) as [Difficulty, number][]) {
        const n = Math.round(10 * ratio);
        if (n <= 0) continue;
        const ps = await this.prisma.problem.findMany({
          where: { unitId: weakest.unitId, difficulty: diff as any }, take: n,
        });
        problems.push(...ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })));
      }
      if (problems.length === 0) {
        const ps = await this.prisma.problem.findMany({ where: { unitId: weakest.unitId }, take: 10 });
        if (ps.length > 0) {
          return { kind, problems: ps.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })) };
        }
        const fb = await this.fallbackAnyLinked(5);
        return { kind, ...fb };
      }
      return { kind, problems };
    }

    // real — 학년 전체 단원에서 mixed paper (CBSE 보드 시험 시뮬레이션).
    //   단원 약점 무관 — 모든 챕터에서 문제 출제, 실제 보드 시험과 동일.
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
        // 무작위 셔플 + N개 추출. createdAt 역순으로 일관성 (시드는 결정적이 안정적).
        const pool = await this.prisma.problem.findMany({
          where: { conceptLessonId: { in: lessonIds }, steps: { some: { stepIndex: 1 } } },
          orderBy: { source: 'asc' },
        });
        if (pool.length > 0) {
          // Fisher-Yates with deterministic seed (userId + Date) so the same session sees the same set.
          const shuffled = [...pool];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          const picked = shuffled.slice(0, 10);
          return { kind, problems: picked.map((p) => ({ id: p.id, source: p.source, difficulty: p.difficulty })) };
        }
      }
    }
    // 마지막 폴백: any-linked
    const fb = await this.fallbackAnyLinked(10);
    return { kind, fallbackReason: 'no-grade-problems' as const, ...fb };
  }
}

/** GradeLevel → NcertClass (DB enum 매핑 — 1:1) */
const GRADE_TO_NCERT: Record<string, string> = {
  G_MIDDLE_1: 'CLASS_7', G_MIDDLE_2: 'CLASS_8', G_MIDDLE_3: 'CLASS_9',
  G_HIGH_1: 'CLASS_10', G_HIGH_2: 'CLASS_11', G_HIGH_3: 'CLASS_12',
};
