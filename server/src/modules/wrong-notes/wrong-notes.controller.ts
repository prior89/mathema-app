import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards } from '@nestjs/common';
import { WrongNotesService } from './wrong-notes.service';
import { CreateWrongNoteDto } from './dto/create-wrong-note.dto';
import { QueryWrongNotesDto } from './dto/query-wrong-notes.dto';
import { ReviewWrongNoteDto } from './dto/review-wrong-note.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentLang, Lang } from '../../common/i18n/current-lang.decorator';

/**
 * 오답노트 라우트.
 * UI ↔ 라우트:
 *  - 오답노트 페이지 헤더 4 stat        → GET /stats
 *  - 그리드 + 필터/정렬                 → GET /
 *  - 사진 등록                          → POST /upload-photo
 *  - 직접 입력                          → POST /
 *  - PDF 업로드                         → POST /upload-pdf
 *  - 단건 + 유사문제                    → GET /:id
 *  - 상태 변경 (analyzing → mastered)   → PATCH /:id/status
 *  - 대시보드 최근 오답 카드 3개        → GET /recent
 */
@UseGuards(JwtAuthGuard)
@Controller('wrong-notes')
export class WrongNotesController {
  constructor(private readonly service: WrongNotesService) {}

  @Get('stats')
  getStats(@CurrentUser('id') userId: string) {
    return this.service.getStats(userId);
  }

  @Get('recent')
  getRecent(@CurrentUser('id') userId: string, @CurrentLang() lang: Lang, @Query('limit') limit = 3) {
    return this.service.getRecent(userId, +limit, lang);
  }

  @Get('due')
  getDue(@CurrentUser('id') userId: string, @CurrentLang() lang: Lang, @Query('limit') limit?: string) {
    return this.service.getDue(userId, limit ? +limit : undefined, lang);
  }

  /** FIFO queue with a 3-day cooldown — returns 1 ready note (or null). */
  @Get('queue/next')
  queueNext(@CurrentUser('id') userId: string) {
    return this.service.getQueueNext(userId);
  }

  /** Review-queue grading. Server compares the answer, records an Attempt,
   *  and (if correct) flips the wrong note to MASTERED. */
  @Post(':id/check')
  checkAnswer(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: { answer: string; durationSec?: number },
  ) {
    return this.service.checkAnswer(userId, id, body);
  }

  @Get()
  list(@CurrentUser('id') userId: string, @CurrentLang() lang: Lang, @Query() query: QueryWrongNotesDto) {
    return this.service.list(userId, query, lang);
  }

  @Get(':id')
  getOne(@CurrentUser('id') userId: string, @CurrentLang() lang: Lang, @Param('id') id: string) {
    return this.service.getOne(userId, id, lang);
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateWrongNoteDto) {
    return this.service.create(userId, dto);
  }

  // POST /upload-photo and /upload-pdf removed — they were stubs. Photo + PDF
  // upload now lives at POST /math-helper/ocr-solve, which actually persists
  // a Problem + Attempt + WrongNote via recordSolveAttempt.

  @Patch(':id/status')
  updateStatus(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.service.updateStatus(userId, id, status);
  }

  /**
   * Mastery graduation by problem id.
   *
   * Called by SoloProblemScreen when a student lands the done phase of a
   * 3-step MC walkthrough with ZERO wrong picks across all steps. The
   * client-side cycle tracker is the authority here — backend just flips
   * the wrong note(s) for this user × problem to MASTERED. Multi-step
   * attempts.create no longer auto-graduates, so this endpoint is the
   * single path for multi-step problems to leave the queue.
   */
  @Post('by-problem/:problemId/master')
  masterByProblem(
    @CurrentUser('id') userId: string,
    @Param('problemId') problemId: string,
  ) {
    return this.service.masterByProblem(userId, problemId);
  }

  @Post(':id/review')
  review(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ReviewWrongNoteDto,
  ) {
    return this.service.review(userId, id, dto);
  }
}
