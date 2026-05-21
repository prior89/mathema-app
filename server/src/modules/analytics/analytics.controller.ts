import { Body, Controller, Headers, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
import { ConsentKind } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { PrivacyService } from '../privacy/privacy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * 프론트엔드 명시적 트래킹 엔드포인트.
 *
 * 현재는 인증 사용자만 — POC 시 익명 트래킹 필요해지면 OptionalJwtGuard 추가 가능.
 * fire-and-forget. 응답은 항상 빠르게 200.
 */
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(
    private readonly service: AnalyticsService,
    private readonly privacy: PrivacyService,
  ) {}

  @Post('events')
  @HttpCode(200)
  async record(
    @CurrentUser('id') userId: string,
    @Body() body: { eventType: string; payload?: any; sessionId?: string },
    @Headers('user-agent') userAgent: string | undefined,
  ) {
    const allowed = await this.privacy.isActive(userId, ConsentKind.ANALYTICS);
    if (!allowed) {
      this.logger.debug(`analytics skipped — no consent for user=${userId}`);
      return { ok: true };
    }
    await this.service.record({
      userId,
      eventType: body.eventType,
      payload: body.payload,
      sessionId: body.sessionId,
      userAgent,
      source: 'frontend',
    });
    return { ok: true };
  }
}
