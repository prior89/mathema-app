import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('diagnostic')
export class DiagnosticController {
  constructor(private readonly service: DiagnosticService) {}

  /** 4문항 진단 시작 — StudySession(DIAGNOSTIC) 생성 + 4 problems 반환. */
  @Post('start')
  start(@CurrentUser('id') userId: string) {
    return this.service.start(userId);
  }

  /** 답안 1건 제출 — Attempt 생성. */
  @Post('answer')
  answer(
    @CurrentUser('id') userId: string,
    @Body() body: { sessionId: string; problemId: string; choiceId: string; confidence?: number },
  ) {
    return this.service.submitAnswer(userId, body);
  }

  /** 세션 종료 → 초기 MasteryTrajectory 작성 + 결과 반환. */
  @Post(':sessionId/finish')
  finish(
    @CurrentUser('id') userId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.service.finish(userId, sessionId);
  }
}
