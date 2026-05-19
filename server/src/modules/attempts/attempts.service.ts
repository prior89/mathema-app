import { Injectable } from '@nestjs/common';
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
  constructor(
    private readonly repo: AttemptsRepository,
    private readonly events: EventEmitter2,
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: string, dto: any) {
    const attempt = await this.repo.create(userId, dto);
    this.events.emit('attempt.completed', attempt);

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
