import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { GradingService } from './grading.service';

/**
 * AttemptsRepository — Attempt 1 row 저장 + WrongNote upsert + 이벤트 페이로드 구성.
 *
 *   요구사항 명세서 Flow 2 (문제 제출):
 *     1) 채점 (객관식 choiceId 또는 단일답안 answer)
 *     2) GradingService 로 errorCodes 1차 추정
 *     3) Attempt row create — 신규 필드 (stepByStepInput, hintCount,
 *        selfConfidenceScore, errorCodes, tenantId) 포함
 *     4) 오답이면 WrongNote upsert (호환 유지)
 *     5) 이벤트 페이로드에 모든 시그널 포함 → mastery / errorPattern listener 가 사용
 *
 *   LLM 비동기 분석은 별도 worker (LLMAnalysisService — Phase 2 후속) 가
 *   attempt.completed 이벤트를 받아 처리.
 */
@Injectable()
export class AttemptsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly grading: GradingService,
  ) {}

  async create(userId: string, dto: any) {
    const problem = await this.prisma.problem.findUniqueOrThrow({
      where: { id: dto.problemId },
      include: {
        concepts: { select: { conceptId: true } },
        steps: { select: { stepIndex: true } },
      },
    });

    // 두 모드 지원:
    //   (A) 객관식: choiceId 제공 → ProblemChoice.isCorrect 기준
    //   (B) 단일답안: answer 문자열 → problem.answer 와 비교
    let isCorrect: boolean;
    let answerText: string;
    let distractorType: string | null = null;
    let distractorErrorCode: string | null = null;

    if (dto.choiceId) {
      // P0-1 fix: choiceId must belong to a step of dto.problemId. Without
      // this check the client could submit the correct choice from a
      // different problem and score this problem correct — corrupting
      // Attempt, WrongNote, Mastery, and Recommendation downstream.
      const choice = await this.prisma.problemChoice.findUnique({
        where: { id: dto.choiceId },
        select: {
          id: true, text: true, isCorrect: true, distractorType: true,
          distractorErrorCode: true, stepId: true,
          step: { select: { problemId: true, stepIndex: true } },
        },
      });
      if (!choice) throw new BadRequestException(`Invalid choiceId: ${dto.choiceId}`);
      if (choice.step.problemId !== dto.problemId) {
        throw new BadRequestException(
          `choiceId does not belong to problemId ${dto.problemId}`,
        );
      }
      // 2026-05-27 KR audit follow-up: warn-only mismatch detector for
      // stale-step submissions. The earlier strict throw blocked a legit
      // KR Q15 PROCESS submit in the wild (data was correct, all 5 students'
      // tries 400'd as "choiceId belongs to step undefined") — turning the
      // defence into a denial-of-service. Now we log the mismatch and let
      // grading continue using the choice's actual step. Future telemetry
      // on this counter will tell us whether the original threat (stale
      // pickedId crossing step boundaries) ever materialises in real use.
      if (typeof dto.stepIndex === 'number'
          && typeof choice.step.stepIndex === 'number'
          && choice.step.stepIndex !== dto.stepIndex) {
        // eslint-disable-next-line no-console
        console.warn(
          `[attempts] stepIndex mismatch (silent): choiceId=${dto.choiceId} ` +
          `choice.step.stepIndex=${choice.step.stepIndex} dto.stepIndex=${dto.stepIndex} ` +
          `problemId=${dto.problemId}`,
        );
      }
      isCorrect = choice.isCorrect;
      answerText = choice.text;
      distractorType = choice.distractorType ?? null;
      // KR distractor taxonomy (SIGN_ERROR, DENOMINATOR_ERROR, ...) carried
      // through to Attempt for ErrorPatternProfile + adaptive recommender.
      // NULL when the choice was correct or the seed didn't tag an errorCode.
      distractorErrorCode = !choice.isCorrect ? (choice.distractorErrorCode ?? null) : null;
    } else {
      // Math-answer normalization — case-insensitive + all whitespace stripped.
      // Single source of truth for text grading; wrong-note review queue
      // (POST /wrong-notes/:id/check) routes through here so the same answer
      // can't be MASTERED in one flow and isCorrect=false in another.
      // Guard against null problem.answer (MC-only problems) — never auto-mark
      // an empty answer correct.
      const normalize = (s: string | null | undefined) =>
        (s ?? '').trim().toLowerCase().replace(/\s+/g, '');
      const expected = normalize(problem.answer);
      const given = normalize(dto.answer);
      isCorrect = expected.length > 0 && expected === given;
      answerText = String(dto.answer ?? '');
    }

    // 재시도 판정 — 학습 모드에서 같은 (session, problem, stepIndex) 의 이전 attempt 가 있으면 retry.
    const isRetry = !!(dto.studySessionId && typeof dto.stepIndex === 'number'
      && (await this.prisma.attempt.count({
        where: {
          userId, problemId: dto.problemId,
          studySessionId: dto.studySessionId,
          stepIndex: dto.stepIndex,
        },
      })) > 0);

    const timeOfDay = typeof dto.timeOfDay === 'number'
      ? Math.max(0, Math.min(23, Math.floor(dto.timeOfDay)))
      : new Date().getHours();
    const deviceType = typeof dto.deviceType === 'string'
      && ['android', 'ios', 'web'].includes(dto.deviceType) ? dto.deviceType : null;

    // GradingService 로 rule-based errorCodes + legacyErrorType 1차 추정.
    const stepByStepInput = Array.isArray(dto.stepByStepInput) ? dto.stepByStepInput : null;
    const { errorCodes, legacyErrorType } = this.grading.analyze({
      isCorrect,
      distractorType,
      durationSec: dto.durationSec ?? 0,
      expectedTimeSec: problem.expectedTimeSec ?? null,
      hintUsed: dto.hintUsed === true,
      hintCount: dto.hintCount,
      confidence: typeof dto.confidence === 'number' ? dto.confidence : null,
      stepByStepInput,
      problemHasSteps: !!problem.expectedSolutionSteps,
    });

    // tenantId — User 로부터 lookup (denormalize).
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, select: { tenantId: true },
    });
    const tenantId = user?.tenantId ?? null;

    const attempt = await this.prisma.attempt.create({
      data: {
        userId, problemId: dto.problemId, tenantId,
        context: dto.context ?? 'STUDY',
        answer: answerText, isCorrect,
        durationSec: dto.durationSec ?? 0,
        responseTimeMs: typeof dto.responseTimeMs === 'number'
          ? Math.max(0, Math.floor(dto.responseTimeMs)) : null,
        confidence: typeof dto.confidence === 'number'
          ? Math.max(0, Math.min(100, Math.round(dto.confidence))) : null,
        selfConfidenceScore: typeof dto.selfConfidenceScore === 'number'
          ? Math.max(1, Math.min(5, Math.round(dto.selfConfidenceScore))) : null,
        hintUsed: dto.hintUsed === true,
        hintCount: typeof dto.hintCount === 'number' ? Math.max(0, Math.floor(dto.hintCount)) : 0,
        stepByStepInput: stepByStepInput ?? undefined,
        errorCodes,
        deviceType,
        timeOfDay,
        stepIndex: typeof dto.stepIndex === 'number' ? dto.stepIndex : null,
        choiceId: dto.choiceId ?? null,
        distractorErrorCode,
        studySessionId: dto.studySessionId ?? null,
        mockExamResultId: dto.mockExamResultId ?? null,
      },
    });

    // 오답 + 첫 시도일 때만 WrongNote upsert (호환 유지).
    if (!isCorrect && !isRetry) {
      await this.prisma.wrongNote.upsert({
        where: { userId_problemId: { userId, problemId: dto.problemId } },
        update: { occurrences: { increment: 1 } },
        create: {
          userId, problemId: dto.problemId,
          errorType: legacyErrorType,
          insight: '',
          status: 'PENDING',
        },
      });
    }

    // Auto-MASTERED policy.
    //
    // Multi-step problems (ConceptLesson practice / mock exam / Study chapter
    // test — anything that submits stepIndex 1, 2, 3 separately) NEVER
    // graduate a wrong note here. The user must clear the whole problem in
    // a single solve cycle with zero mistakes — SoloProblemScreen tracks
    // the cycle client-side and calls POST /wrong-notes/by-problem/:id/master
    // explicitly when the user lands the done phase with no wrong picks.
    //
    // Single-shot problems (text answers without a stepIndex — e.g. the
    // ReviewQueue's /wrong-notes/:id/check, math-helper's recordSolveAttempt)
    // still graduate immediately on a correct attempt: there are no
    // intermediate steps to "perfect", so the answer itself is the cycle.
    if (isCorrect && typeof dto.stepIndex !== 'number') {
      await this.prisma.wrongNote.updateMany({
        where: { userId, problemId: dto.problemId, status: { not: 'MASTERED' } },
        data: { status: 'MASTERED', masteredAt: new Date() },
      });
    }

    // 이벤트 페이로드 — mastery-trajectory.listener 가 이걸로 갱신 수행.
    //   명세서 §1-2: conceptTags / difficultyLevel 도 API 응답에 명시 노출 (Attempt 자체에는 정규화 안 됨, Problem 참조).
    const conceptIds = problem.concepts.map((c) => c.conceptId);
    const conceptCodes = await this.prisma.concept.findMany({
      where: { id: { in: conceptIds } }, select: { code: true },
    });
    return Object.assign(attempt, {
      isRetry,
      errorTypeForSnapshot: legacyErrorType,
      errorCodes,
      // Sprint 1 A3: emitted in attempt.completed payload so listeners can
      // feed ErrorPatternProfile without re-querying ProblemChoice.
      distractorErrorCode,
      tenantId,
      conceptIds,
      conceptTags: conceptCodes.map((c) => c.code),       // 명세서 §1-2
      difficultyLevel: problem.difficultyLevel,           // 명세서 §1-2
    });
  }
}
