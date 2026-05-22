import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminAuditInterceptor } from './admin-audit.interceptor';
import { CurrentLang, Lang } from '../../common/i18n/current-lang.decorator';
import { ConceptLessonsService } from '../concept-lessons/concept-lessons.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(AdminAuditInterceptor)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly lessons: ConceptLessonsService,
  ) {}

  @Get('overview')        overview() { return this.service.overview(); }
  @Get('users')           users(@Query('limit') limit = 100) { return this.service.listUsers(+limit); }
  @Get('users/:id')       user(@CurrentLang() lang: Lang, @Param('id') id: string) {
    return this.service.userDetail(id, lang);
  }
  @Get('events')          events(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('type') type?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.events({ from, to, type, userId, limit: limit ? +limit : undefined });
  }
  @Get('dau')             dau(@Query('days') days = 30) { return this.service.dailyActives(+days); }
  @Get('users-by-country') usersByCountry() { return this.service.usersByCountry(); }
  @Get('content/coverage') contentCoverage(@CurrentLang() lang: Lang) {
    return this.service.contentCoverage(lang);
  }
  /** Per-chapter Mastery (multi-step) + Study (single-step) pool counts
   *  with gap-vs-20 figures. Use this to decide which chapters need
   *  hand-curation now that LLM auto-topup is off (2026-05-22). */
  @Get('content/pool-gaps')
  poolGaps() { return this.service.poolGaps(); }
  @Get('insights/distractors') distractors(@CurrentLang() lang: Lang, @Query('days') days = 30) {
    return this.service.distractorInsights(+days, lang);
  }
  @Get('push/health')      pushHealth() { return this.service.pushHealth(); }

  /**
   * 어드민 감사 로그 — 누가 언제 어떤 데이터에 접근했는지.
   * 본인 호출도 기록되므로 무한히 증가하진 않게 자주 archive 권장 (추후 운영).
   */
  @Get('audit-logs')
  auditLogs(
    @Query('limit') limit?: string,
    @Query('email') email?: string,
    @Query('path') path?: string,
  ) {
    return this.service.auditLogs({ limit: limit ? +limit : 200, email, path });
  }

  /**
   * Top up every Mastery chapter that has fewer than 20 multi-step problems
   * via LLM generation — mirrors the scripts/prewarm-mastery.ts one-shot
   * admin tool but callable over HTTP so we don't need shell access to a
   * Container App instance to fill new chapters.
   *
   * Body (all optional):
   *   { chapterCodes?: string[], target?: number }
   *     - chapterCodes: specific chapters to top up; default = all under-stocked
   *     - target: chapter problem floor; default 20
   *
   * Returns: { chapterCode, before, generated, after }[]
   *
   * NB: each chapter takes ~30-60s × (target - existing)/5. With ~80 chapters
   * a full sweep can run for minutes — the call blocks the HTTP connection
   * until done. For larger jobs prefer the CLI script or split into batches.
   */
  @Post('prewarm-mastery')
  async prewarmMastery(@Body() body: { chapterCodes?: string[]; target?: number }) {
    const target = body?.target ?? 20;
    return this.service.prewarmMastery({
      chapterCodes: body?.chapterCodes,
      target,
      lessons: this.lessons,
    });
  }
}
