import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AchievementsService } from './achievements.service';

@Injectable()
export class AchievementsListener {
  constructor(private readonly achievements: AchievementsService) {}

  @OnEvent('attempt.completed')
  handleAttempt(attempt: { userId: string; isCorrect: boolean; context: string; problemId: string }) {
    if (!attempt.isCorrect) return;
    if (attempt.context !== 'STUDY' && attempt.context !== 'PRACTICE') return;
    void this.achievements.tryAward(attempt.userId, 'FIRST_PRACTICE_CORRECT', {
      problemId: attempt.problemId,
    });
  }

  @OnEvent('wrong-note.mastered')
  handleWrongNoteMastered(payload: { userId: string; problemId: string }) {
    void this.achievements.tryAward(payload.userId, 'FIRST_WRONGNOTE_MASTERED', {
      problemId: payload.problemId,
    });
  }
}