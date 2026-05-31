import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ErrorCode, MasteryUpdateSource } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { MasteryTrajectoryService } from '../mastery-trajectory.service';
import { ErrorPatternService } from '../error-pattern.service';

/**
 * attempt.completed 이벤트 → MasteryTrajectory + ErrorPatternProfile 갱신.
 *
 *   기존 MasteryAttemptListener (unit 단위 MasterySnapshot) 와 병행 동작.
 *   이건 concept 단위 — Phase 1.1 신규 모델 사용.
 *
 *   ErrorPatternService 의 status 가 Mastery delta 에 영향 → 호출 순서:
 *     1. 현 MasteryScore + hasActiveErrorPattern 조회
 *     2. MasteryTrajectory 갱신 (delta 계산)
 *     3. ErrorPatternProfile 갱신 (recentFrequency·status·severity)
 *
 *   AttemptCompletedEvent 페이로드 — attempts.repository 가 이미 발행.
 */

interface AttemptCompletedPayload {
  id: string;
  userId: string;
  problemId: string;
  isCorrect: boolean;
  durationSec: number;
  hintUsed?: boolean;
  confidence?: number | null;
  /** rule-based 1차 추정 errorCodes (GradingService). */
  errorCodes?: ErrorCode[];
  /** KR distractor taxonomy on the selected wrong choice (string form). */
  distractorErrorCode?: string | null;
  isRetry?: boolean;
  tenantId?: string | null;
}

/** KR distractor strings → ErrorCode enum. Unmapped strings are dropped. */
const KR_DISTRACTOR_TO_ENUM: Record<string, ErrorCode> = {
  SIGN_ERROR: ErrorCode.SIGN,
  ARITHMETIC_ERROR: ErrorCode.CALC,
  CONCEPT_MISUNDERSTANDING: ErrorCode.CON,
  CONDITION_MISSING: ErrorCode.CONDITION_MISSING,
  DENOMINATOR_ERROR: ErrorCode.DENOMINATOR_ERROR,
  ALGEBRA_ERROR: ErrorCode.ALG,
  FORMULA_SELECTION_ERROR: ErrorCode.FORMULA,
  GRAPH_READING_ERROR: ErrorCode.GRAPH,
  GEOMETRY_PROPERTY_ERROR: ErrorCode.GEOMETRY_PROPERTY_ERROR,
  RATIO_SCALE_ERROR: ErrorCode.RATIO_SCALE_ERROR,
  PROBABILITY_COUNTING_ERROR: ErrorCode.PROBABILITY_COUNTING_ERROR,
  STATISTICS_INTERPRETATION_ERROR: ErrorCode.STATISTICS_INTERPRETATION_ERROR,
  SLOPE_INTERCEPT_CONFUSION: ErrorCode.SLOPE_INTERCEPT_CONFUSION,
  CORRESPONDING_PART_ERROR: ErrorCode.CORRESPONDING_PART_ERROR,
  AREA_RATIO_ERROR: ErrorCode.AREA_RATIO_ERROR,
  ADD_NUMERATOR_ONLY: ErrorCode.ADD_NUMERATOR_ONLY,
  // Common KR seed strings that don't have a dedicated enum entry — fall
  // back to CON (concept misunderstanding) since EXPONENT/COORDINATE
  // mistakes are conceptually misapplied rules.
  EXPONENT_ERROR: ErrorCode.CON,
  COORDINATE_ERROR: ErrorCode.CON,
};

@Injectable()
export class MasteryTrajectoryListener {
  private readonly logger = new Logger(MasteryTrajectoryListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly trajectory: MasteryTrajectoryService,
    private readonly errorPattern: ErrorPatternService,
  ) {}

  @OnEvent('attempt.completed')
  async onAttemptCompleted(payload: AttemptCompletedPayload): Promise<void> {
    if (payload.isRetry) return;

    // 이 문제가 측정하는 모든 Concept 조회 (ProblemConcept N:M).
    const problem = await this.prisma.problem.findUnique({
      where: { id: payload.problemId },
      select: {
        difficultyLevel: true,
        expectedTimeSec: true,
        concepts: { select: { conceptId: true, weight: true } },
      },
    });
    if (!problem || problem.concepts.length === 0) return;

    const conceptIds = problem.concepts.map((c) => c.conceptId);

    // 현 mastery 조회 (severity 계산용)
    const trajectories = await this.prisma.masteryTrajectory.findMany({
      where: { userId: payload.userId, conceptId: { in: conceptIds } },
      select: { conceptId: true, masteryScore: true },
    });
    const masteryByConcept = new Map(trajectories.map((t) => [t.conceptId, t.masteryScore]));

    // 1) MasteryTrajectory 갱신 — 각 concept 별.
    for (const cid of conceptIds) {
      const hasActive = await this.errorPattern.hasActiveForConcept(payload.userId, cid);
      try {
        await this.trajectory.updateAfterAttempt({
          userId: payload.userId,
          conceptId: cid,
          tenantId: payload.tenantId ?? null,
          attemptId: payload.id,
          isCorrect: payload.isCorrect,
          durationSec: payload.durationSec,
          expectedTimeSec: problem.expectedTimeSec ?? null,
          hintUsed: payload.hintUsed === true,
          difficultyLevel: problem.difficultyLevel,
          confidence: payload.confidence ?? null,
          hasActiveErrorPattern: hasActive,
          source: MasteryUpdateSource.RULE_BASED,
        });
      } catch (err) {
        this.logger.error(`Mastery update failed for concept ${cid}: ${(err as Error).message}`);
      }
    }

    // 2) ErrorPatternProfile 갱신 — errorCodes 가 있을 때만.
    //    Sprint 1 A3: merge KR distractor errorCode (string) into the codes
    //    array. Unmapped strings drop; mapped ones feed the same pipeline
    //    as IN GradingService output so recommender sees a single signal.
    const krCode = payload.distractorErrorCode
      ? KR_DISTRACTOR_TO_ENUM[payload.distractorErrorCode] ?? null
      : null;
    const mergedCodes: ErrorCode[] = [
      ...(payload.errorCodes ?? []),
      ...(krCode ? [krCode] : []),
    ];
    if (mergedCodes.length > 0) {
      try {
        await this.errorPattern.updateAfterAttempt({
          userId: payload.userId,
          tenantId: payload.tenantId ?? null,
          attemptId: payload.id,
          conceptIds,
          errorCodes: mergedCodes,
          isCorrect: payload.isCorrect,
          masteryScoreByConcept: masteryByConcept,
        });
      } catch (err) {
        this.logger.error(`ErrorPattern update failed: ${(err as Error).message}`);
      }
    } else if (payload.isCorrect) {
      // 정답이면 errorCodes 가 없어도 IMPROVING/RESOLVED 판정을 위해 refresh.
      try {
        await this.errorPattern.updateAfterAttempt({
          userId: payload.userId,
          tenantId: payload.tenantId ?? null,
          attemptId: payload.id,
          conceptIds,
          errorCodes: [],
          isCorrect: true,
          masteryScoreByConcept: masteryByConcept,
        });
      } catch (err) {
        this.logger.warn(`ErrorPattern refresh on correct failed: ${(err as Error).message}`);
      }
    }
  }
}
