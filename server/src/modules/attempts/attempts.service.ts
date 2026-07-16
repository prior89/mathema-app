import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ErrorCode } from '@prisma/client';
import { AttemptsRepository } from './attempts.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * POST /attempts response:
 *   { attemptId, isCorrect, basicFeedback, nextAction, ... }
 *
 *   basicFeedback / nextAction are produced from rule-based errorCodes
 *   immediately; LLM-derived reasoningSummary is filled in asynchronously.
 *
 *   Strings below are English (primary release). For a non-English release,
 *   swap the literals in this file (or branch the repo per locale) — no
 *   runtime language toggle.
 */
@Injectable()
export class AttemptsService {
  private readonly logger = new Logger(AttemptsService.name);

  constructor(
    private readonly repo: AttemptsRepository,
    private readonly events: EventEmitter2,
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: string, dto: any) {
    const attempt = await this.repo.create(userId, dto);
    // Wait for the learning-state listeners before returning. Recommended
    // weakness retests are often started immediately after an answer; the old
    // fire-and-forget emit let that request read stale mastery and recommend
    // the same material. Listener failures are logged because the Attempt is
    // already durably committed and must not be duplicated by a client retry.
    try {
      await this.events.emitAsync('attempt.completed', attempt);
    } catch (error) {
      this.logger.error(
        `Post-attempt learning update failed for attempt=${attempt.id}: ${(error as Error).message}`,
      );
    }

    // Mastery → Study unlock gate (user-spec 2026-05-24 정정): the chapter's
    // ConceptProgress.masteredAt fires when the user has submitted an
    // ANSWER-step attempt on every problem in the chapter's canonical
    // Mastery 20-set, regardless of correctness. Triggered on every
    // ANSWER-step submit in PRACTICE context (right or wrong) so a stuck
    // problem can't permanently block Study access. Idempotent + sticky.
    if (attempt.stepIndex === 3 && attempt.context === 'PRACTICE') {
      // Fire-and-forget — checking 20 attempts shouldn't block the user's
      // next-problem render. Errors are logged but don't fail the request.
      void this.checkAndUnlockMastery(userId, attempt.problemId).catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('[mastery-unlock] failed:', (e as Error).message);
      });
    }

    // Pull selected choice + correct choice for rationale rendering.
    let selectedChoice: any = null;
    let correctChoice: any = null;
    if (attempt.choiceId) {
      selectedChoice = await this.prisma.problemChoice.findUnique({
        where: { id: attempt.choiceId },
        select: {
          id: true, choiceIndex: true, text: true, isCorrect: true,
          distractorType: true, rationale: true, stepId: true,
        },
      });
      if (selectedChoice && !selectedChoice.isCorrect) {
        correctChoice = await this.prisma.problemChoice.findFirst({
          where: { stepId: selectedChoice.stepId, isCorrect: true },
          select: { id: true, choiceIndex: true, text: true },
        });
      }
    }

    return {
      ...attempt,
      attemptId: attempt.id,
      basicFeedback: this.buildBasicFeedback(attempt),
      nextAction:    this.buildNextAction(attempt),
      selectedChoice,
      correctChoice,
    };
  }

  /**
   * Check if the user has now attempted every problem in the chapter's
   * canonical Mastery 20-set, and if so stamp ConceptProgress.masteredAt
   * (sticky). This is the Study-unlock gate.
   *
   * Definition of "완주" (user-spec 2026-05-24 정정):
   *   At least one Attempt row exists on stepIndex=3 (ANSWER step) for the
   *   given problem in STUDY or PRACTICE context. Correctness is irrelevant
   *   — the gate is "submitted an answer", not "submitted a correct answer"
   *   (and definitely not perfect-cycle). A stuck-on-one-problem learner
   *   should still graduate to Study so they can drill further.
   */
  private async checkAndUnlockMastery(userId: string, problemId: string): Promise<void> {
    const problem = await this.prisma.problem.findUnique({
      where: { id: problemId },
      select: { conceptLessonId: true, koreanConceptLessonId: true },
    });
    if (!problem) return;

    // Country gate by which lesson the problem belongs to:
    //   NCERT problem (conceptLessonId set)         → ConceptProgress
    //   Korean problem (koreanConceptLessonId set)  → KoreanConceptProgress
    // A problem maps to one or the other, never both; both paths use the same
    // "submitted ANSWER-step on every canonical-set problem" gate.
    if (problem.koreanConceptLessonId) {
      await this.unlockKorean(userId, problem.koreanConceptLessonId);
      return;
    }
    if (problem.conceptLessonId) {
      await this.unlockNcert(userId, problem.conceptLessonId);
    }
  }

  private async unlockNcert(userId: string, lessonId: string): Promise<void> {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { id: lessonId },
      select: { masterySetProblemIds: true },
    });
    if (!lesson || lesson.masterySetProblemIds.length !== 20) return;

    const attemptedRows = await this.prisma.attempt.findMany({
      where: {
        userId,
        problemId: { in: lesson.masterySetProblemIds },
        stepIndex: 3,
        context: { in: ['STUDY' as const, 'PRACTICE' as const] },
      },
      distinct: ['problemId'],
      select: { problemId: true },
    });
    if (attemptedRows.length < 20) return;

    const existing = await this.prisma.conceptProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: { masteredAt: true },
    });
    if (existing?.masteredAt) return;

    await this.prisma.conceptProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, masteredAt: new Date() },
      update: { masteredAt: new Date() },
    });
  }

  private async unlockKorean(userId: string, lessonId: string): Promise<void> {
    const lesson = await this.prisma.koreanConceptLesson.findUnique({
      where: { id: lessonId },
      select: { masterySetProblemIds: true },
    });
    if (!lesson || lesson.masterySetProblemIds.length !== 20) return;

    const attemptedRows = await this.prisma.attempt.findMany({
      where: {
        userId,
        problemId: { in: lesson.masterySetProblemIds },
        stepIndex: 3,
        context: { in: ['STUDY' as const, 'PRACTICE' as const] },
      },
      distinct: ['problemId'],
      select: { problemId: true },
    });
    if (attemptedRows.length < 20) return;

    const existing = await this.prisma.koreanConceptProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: { masteredAt: true },
    });
    if (existing?.masteredAt) return;

    await this.prisma.koreanConceptProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, masteredAt: new Date() },
      update: { masteredAt: new Date() },
    });
  }

  private buildBasicFeedback(a: { isCorrect: boolean; errorCodes: ErrorCode[]; hintUsed: boolean; durationSec: number }): string {
    if (a.isCorrect) {
      if (a.hintUsed) return 'Correct. Try once more without the hint next time.';
      return 'Correct.';
    }
    if (a.errorCodes.includes(ErrorCode.SIGN))    return 'Looks like a sign-handling slip in the working.';
    if (a.errorCodes.includes(ErrorCode.CALC))    return 'Step-by-step calculation slip likely.';
    if (a.errorCodes.includes(ErrorCode.CON))     return 'Concept application step seems to be the sticking point.';
    if (a.errorCodes.includes(ErrorCode.FORMULA)) return "Let's revisit the formula choice / application.";
    if (a.errorCodes.includes(ErrorCode.LOGIC))   return 'A step in the solution flow looks skipped.';
    if (a.errorCodes.includes(ErrorCode.GRAPH))   return 'Re-check the graph interpretation step.';
    if (a.errorCodes.includes(ErrorCode.UNIT))    return 'Re-check the unit conversion step.';
    if (a.errorCodes.includes(ErrorCode.ALG))     return 'Re-check the algebraic manipulation step.';
    if (a.durationSec > 240) return 'Time pressure may have hurt — try ordering the steps next time.';
    return "Let's work through it again together.";
  }

  private buildNextAction(a: { isCorrect: boolean; errorCodes: ErrorCode[] }): string {
    if (a.isCorrect) return 'Next: a slightly harder problem on the same concept.';
    if (a.errorCodes.length === 0) return 'Next: a similarly-difficult problem in a different form.';
    return 'Next: a same-concept problem that walks the steps one by one.';
  }
}
