import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminAuditInterceptor } from './admin-audit.interceptor';
import { CurrentLang, Lang } from '../../common/i18n/current-lang.decorator';
import { ConceptLessonsService } from '../concept-lessons/concept-lessons.service';
import { CreateKoreanStudyProblemDto } from './dto/create-korean-study-problem.dto';
import { SwapMasterySetDto } from './dto/swap-mastery-set.dto';

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

  /** Phase 1 LessonProblemSet shadow inventory. country/setType optional —
   *  defaults to all rows. Read-only; the student runtime still uses the
   *  legacy masterySetProblemIds arrays. Use this to answer "which chapters
   *  have a READY mastery set per the same contract in IN and KR". */
  @Get('content/readiness')
  readiness(
    @Query('country') country?: 'IN' | 'KR',
    @Query('setType') setType?: 'MASTERY_3STEP' | 'STUDY_1STEP' | 'DIAGNOSTIC',
  ) {
    return this.service.lessonProblemSetReadiness({ country, setType });
  }
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

  /** Author one KR Study (single-step) problem. Inserts Problem + 1 ANSWER
   *  ProblemStep + 5 ProblemChoice rows. Validates exactly 1 isCorrect=true.
   *  Lesson lookup by chapterCode. Per [[feedback-no-llm-for-problem-content]] —
   *  human-authored only path; admin manually fills the form. */
  @Post('korean-study-problems')
  async createKoreanStudyProblem(@Body() dto: CreateKoreanStudyProblemDto) {
    return this.service.createKoreanStudyProblem(dto);
  }

  /** GET — KR chapters with study problem counts. Frontend shows the picker
   *  + "이미 N개 있음" hint so the admin doesn't double-author. */
  @Get('korean-chapters')
  koreanChapters() {
    return this.service.koreanChaptersWithStudyCounts();
  }

  /**
   * Sprint 5 #76 E: Mastery 20-set admin swap tool.
   *
   * GET — inspect a chapter's canonical 20 with per-row quality flags +
   *       the candidate pool (3-step + same lesson + quality OK).
   * POST — swap one entry. Preserves array index so a student already
   *        partway through the set sees a continuous progression.
   */
  @Get('mastery-set/:chapterCode')
  masterySetInventory(@Param('chapterCode') chapterCode: string) {
    return this.service.masterySetInventory(chapterCode);
  }

  @Post('mastery-set/:chapterCode/swap')
  swapMasterySet(
    @Param('chapterCode') chapterCode: string,
    @Body() dto: SwapMasterySetDto,
  ) {
    return this.service.swapMasterySetProblem(chapterCode, dto);
  }

  /**
   * Sprint 7: student-report review dashboard.
   *
   * GET — every Problem flagged STUDENT_REPORTED (post-restore included so
   *       operator sees the history), joined with chapter source-of-truth.
   * POST /restore — clear the flag + flip qualityStatus back to NULL when
   *       no other critical flag remains. The row re-enters the active pool.
   */
  @Get('reports')
  listReports(@Query('curriculum') curriculum?: 'KR' | 'IN') {
    return this.service.listReportedProblems({ curriculum });
  }

  @Post('reports/:problemId/restore')
  restoreReport(@Param('problemId') problemId: string) {
    return this.service.restoreReportedProblem(problemId);
  }
}
