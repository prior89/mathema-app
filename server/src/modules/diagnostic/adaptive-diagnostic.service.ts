import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GradeLevel, KoreanGrade } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AttemptsService } from '../attempts/attempts.service';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { FirstSessionPlanService } from '../recommendations/first-session-plan.service';
import {
  ADAPTIVE_DIAGNOSTIC_CONFIG,
  AdaptiveProblemPayload,
  PlacementConceptScore,
} from './adaptive-diagnostic.constants';
import {
  AttemptSnapshot,
  buildConceptScores,
  meanStandardError,
  shouldStopAdaptive,
  targetDifficultyLevel,
} from './adaptive-diagnostic.math';
import {
  MIN_READY_DIAGNOSTIC_SETS,
  NCERT_TO_KR_GRADE,
  countReadyDiagnosticSets,
} from './diagnostic-pool-gate';

type PoolRow = AdaptiveProblemPayload & {
  unitId: string;
  conceptIds: string[];
  koreanConceptLessonId?: string | null;
};

const NCERT_TO_KR = NCERT_TO_KR_GRADE;

@Injectable()
export class AdaptiveDiagnosticService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attempts: AttemptsService,
    private readonly flags: FeatureFlagsService,
    private readonly firstSessionPlan: FirstSessionPlanService,
  ) {}

  async start(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true, country: true },
    });
    if (!user) throw new NotFoundException('user not found');

    if (!this.flags.isEnabled('adaptive_diagnostic', userId)) {
      throw new ForbiddenException({
        code: 'adaptive_diagnostic_disabled',
        message: 'Adaptive diagnostic is not enabled for this account.',
      });
    }

    const grade = (user.gradeLevel ?? 'CLASS_11') as GradeLevel;
    const country = user.country === 'KR' ? 'KR' : 'IN';
    const poolKey = country === 'KR'
      ? { country: 'KR' as const, grade: NCERT_TO_KR[grade] }
      : { country: 'IN' as const, grade };

    const readyCount = await countReadyDiagnosticSets(this.prisma, poolKey);
    if (readyCount < MIN_READY_DIAGNOSTIC_SETS) {
      throw new BadRequestException({
        code: 'diagnostic_pool_not_ready',
        message: 'Diagnostic content is not ready for your grade yet.',
      });
    }

    const pool = await this.loadPool(country, grade);
    if (!pool.length) {
      throw new BadRequestException('No adaptive diagnostic problems available for your grade yet.');
    }

    const first = this.pickNext(pool, new Set(), new Set(), 3);
    if (!first) {
      throw new BadRequestException('No adaptive diagnostic problems available for your grade yet.');
    }

    const session = await this.prisma.studySession.create({
      data: {
        userId,
        unitId: first.unitId,
        sessionNumber: 1,
        totalSessions: 1,
        context: 'DIAGNOSTIC',
        problemCount: ADAPTIVE_DIAGNOSTIC_CONFIG.maxItems,
      },
    });

    return {
      sessionId: session.id,
      maxItems: ADAPTIVE_DIAGNOSTIC_CONFIG.maxItems,
      problem: this.toClientProblem(first),
    };
  }

  async submitAnswer(
    userId: string,
    body: {
      sessionId: string;
      problemId: string;
      choiceId: string;
      confidence?: number;
      durationSec?: number;
    },
  ) {
    const session = await this.prisma.studySession.findUnique({
      where: { id: body.sessionId },
      include: {
        attempts: {
          include: {
            problem: {
              include: { concepts: { select: { conceptId: true } } },
            },
          },
        },
      },
    });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');
    if (session.endedAt) throw new BadRequestException('Session already finished');

    const attempt = await this.attempts.create(userId, {
      problemId: body.problemId,
      choiceId: body.choiceId,
      stepIndex: 1,
      durationSec: body.durationSec ?? 0,
      confidence: body.confidence,
      context: 'DIAGNOSTIC',
      studySessionId: body.sessionId,
    });

    const refreshed = await this.prisma.studySession.findUnique({
      where: { id: body.sessionId },
      include: {
        attempts: {
          include: {
            problem: {
              include: { concepts: { select: { conceptId: true } } },
            },
          },
        },
      },
    });
    const snapshots = this.toSnapshots(refreshed?.attempts ?? []);
    const conceptScores = buildConceptScores(snapshots);
    const itemsAnswered = snapshots.length;
    const meanSE = meanStandardError(conceptScores);
    const stop = shouldStopAdaptive(itemsAnswered, meanSE);

    if (stop) {
      return {
        attemptId: attempt.id,
        isCorrect: attempt.isCorrect,
        itemsAnswered,
        meanSE,
        shouldFinish: true as const,
        nextProblem: null,
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true, country: true },
    });
    const grade = (user?.gradeLevel ?? 'CLASS_11') as GradeLevel;
    const country = user?.country === 'KR' ? 'KR' : 'IN';
    const pool = await this.loadPool(country, grade);
    const usedProblems = new Set((refreshed?.attempts ?? []).map((a) => a.problemId));
    const usedConcepts = new Set(snapshots.flatMap((s) => s.conceptIds));
    const targetLevel = targetDifficultyLevel(attempt.isCorrect, body.confidence);
    const next = this.pickNext(pool, usedProblems, usedConcepts, targetLevel);

    return {
      attemptId: attempt.id,
      isCorrect: attempt.isCorrect,
      itemsAnswered,
      meanSE,
      shouldFinish: !next,
      nextProblem: next ? this.toClientProblem(next) : null,
    };
  }

  async finish(userId: string, sessionId: string) {
    const session = await this.prisma.studySession.findUnique({
      where: { id: sessionId },
      include: {
        attempts: {
          include: {
            problem: {
              include: {
                concepts: { include: { concept: true } },
                conceptLesson: { select: { chapterCode: true } },
                koreanConceptLesson: { select: { chapterCode: true } },
              },
            },
          },
        },
      },
    });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');

    if (!session.endedAt) {
      await this.prisma.studySession.update({
        where: { id: sessionId },
        data: {
          endedAt: new Date(),
          correctCount: session.attempts.filter((a) => a.isCorrect).length,
        },
      });
    }

    const snapshots = this.toSnapshots(session.attempts);
    const conceptScores = buildConceptScores(snapshots);
    const weakConceptIds = conceptScores
      .filter((c) => c.placementScore < 50)
      .map((c) => c.conceptId);

    const weakChapters = session.attempts
      .filter((a) => a.problem.concepts.some((pc) => weakConceptIds.includes(pc.conceptId)))
      .map((a) => a.problem.conceptLesson?.chapterCode ?? a.problem.koreanConceptLesson?.chapterCode)
      .filter((c): c is string => !!c);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true, country: true },
    });
    const estimatedGradeBand = user?.country === 'KR'
      ? (NCERT_TO_KR[(user.gradeLevel ?? 'CLASS_11') as GradeLevel] as KoreanGrade)
      : (user?.gradeLevel ?? 'CLASS_11');

    const placementPayload: PlacementConceptScore[] = conceptScores;

    const recommendedChapterCodes = [...new Set(weakChapters)].slice(0, 5);

    await this.prisma.userPlacementProfile.upsert({
      where: { userId },
      create: {
        userId,
        sessionId,
        estimatedGradeBand,
        conceptScores: placementPayload,
        weakConceptIds,
        recommendedChapterCodes,
      },
      update: {
        sessionId,
        estimatedGradeBand,
        conceptScores: placementPayload,
        weakConceptIds,
        recommendedChapterCodes,
      },
    });

    const firstSessionPlan = await this.firstSessionPlan.seedFirstSession(userId, {
      recommendedChapterCodes,
      weakConceptIds,
      estimatedGradeBand,
    });

    const conceptIds = [...new Set(snapshots.flatMap((s) => s.conceptIds))];
    const trajectories = conceptIds.length
      ? await this.prisma.masteryTrajectory.findMany({
          where: { userId, conceptId: { in: conceptIds } },
          include: { concept: { select: { name: true, code: true } } },
        })
      : [];

    return {
      sessionId,
      attempted: session.attempts.length,
      correct: session.attempts.filter((a) => a.isCorrect).length,
      masteries: trajectories.map((t) => ({
        conceptId: t.conceptId,
        conceptName: t.concept.name,
        conceptCode: t.concept.code,
        score: t.masteryScore,
      })),
      placement: {
        estimatedGradeBand,
        conceptScores: placementPayload,
        weakConceptIds,
        recommendedChapterCodes,
      },
      firstSessionPlan,
    };
  }

  private toSnapshots(
    rows: Array<{
      isCorrect: boolean;
      confidence?: number | null;
      problem: { concepts: Array<{ conceptId: string }> };
    }>,
  ): AttemptSnapshot[] {
    return rows.map((r) => ({
      isCorrect: r.isCorrect,
      confidence: r.confidence,
      conceptIds: r.problem.concepts.map((c) => c.conceptId),
    }));
  }

  private toClientProblem(row: PoolRow) {
    return {
      id: row.id,
      body: row.body,
      difficulty: row.difficulty,
      step: row.step,
      conceptLessonId: row.conceptLessonId,
    };
  }

  private pickNext(
    pool: PoolRow[],
    usedProblemIds: Set<string>,
    usedConceptIds: Set<string>,
    targetLevel: number,
  ): PoolRow | null {
    const candidates = pool.filter((p) => !usedProblemIds.has(p.id) && p.step);
    if (!candidates.length) return null;

    const score = (p: PoolRow) => {
      let s = -Math.abs(p.difficultyLevel - targetLevel) * 10;
      const novelConcept = p.conceptIds.some((id) => !usedConceptIds.has(id));
      if (novelConcept) s += 5;
      return s;
    };

    return [...candidates].sort((a, b) => score(b) - score(a))[0] ?? null;
  }

  private async loadPool(country: 'IN' | 'KR', grade: GradeLevel): Promise<PoolRow[]> {
    const krGrade = NCERT_TO_KR[grade] ?? 'HIGH_2';
    const sets = await this.prisma.lessonProblemSet.findMany({
      where: {
        country,
        setType: 'DIAGNOSTIC',
        status: 'READY',
        retiredAt: null,
        ...(country === 'IN'
          ? { conceptLesson: { ncertClass: grade } }
          : { koreanConceptLesson: { koreanGrade: krGrade } }),
      },
      orderBy: { chapterCode: 'asc' },
      select: { problemIds: true },
    });

    const ids = sets.flatMap((s) => s.problemIds.slice(0, ADAPTIVE_DIAGNOSTIC_CONFIG.itemsPerSet));
    if (!ids.length) return [];

    const rows = await this.prisma.problem.findMany({
      where: {
        id: { in: ids },
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
      },
      select: {
        id: true,
        body: true,
        difficulty: true,
        difficultyLevel: true,
        unitId: true,
        conceptLessonId: true,
        koreanConceptLessonId: true,
        concepts: { select: { conceptId: true } },
        steps: {
          where: { stepIndex: 1 },
          take: 1,
          include: {
            choices: {
              orderBy: { choiceIndex: 'asc' },
              select: { id: true, choiceIndex: true, text: true },
            },
          },
        },
      },
    });

    return rows
      .filter((p) => p.steps[0]?.choices.length === 5)
      .map((p) => ({
        id: p.id,
        body: p.body,
        difficulty: p.difficulty,
        difficultyLevel: p.difficultyLevel,
        unitId: p.unitId,
        conceptLessonId: p.conceptLessonId,
        conceptIds: p.concepts.map((c) => c.conceptId),
        koreanConceptLessonId: p.koreanConceptLessonId,
        step: p.steps[0]
          ? {
              id: p.steps[0].id,
              stepIndex: p.steps[0].stepIndex,
              prompt: p.steps[0].prompt,
              choices: p.steps[0].choices,
            }
          : null,
      }));
  }
}