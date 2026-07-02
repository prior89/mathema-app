import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ProblemsService } from './problems.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentLang, Lang } from '../../common/i18n/current-lang.decorator';
import { QueryProblemsDto } from './dto/query-problems.dto';

/** Sprint 3 A13: student-report payload. reason is free-text up to 200ch
 *  ("정답이 옵션에 없어요" / "오답 풀이 이상해요" 등) — optional. */
class ReportProblemDto {
  @IsOptional() @IsString() @MaxLength(200) reason?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('problems')
export class ProblemsController {
  constructor(private readonly service: ProblemsService) {}
  @Get() list(@Query() q: QueryProblemsDto, @CurrentLang() lang: Lang) { return this.service.list(q, lang); }

  @Get('recommended')
  recommended(@CurrentUser('id') userId: string, @CurrentLang() lang: Lang, @Query('unitId') unitId: string) {
    return this.service.recommendedFor(userId, unitId, lang);
  }

  @Get(':id') one(@Param('id') id: string, @CurrentLang() lang: Lang) { return this.service.one(id, lang); }

  /** Variant re-quiz: a fresh problem from the SAME chapter (same type, new
   *  numbers for IN template items; a distinct same-concept item for KR) so
   *  re-solving a wrong problem can't be gamed by memorising the answer. */
  @Get(':id/variant')
  variant(@Param('id') id: string, @CurrentUser('id') userId: string, @CurrentLang() lang: Lang) {
    return this.service.variant(id, userId, lang);
  }

  @Get(':id/hint') hint(@Param('id') id: string) { return this.service.hint(id); }

  /** Hint Lv2 — OpenAI step-by-step walkthrough. LLM-billed per call; the
   *  frontend caches per problem id so re-opening the hint doesn't re-bill. */
  @Get(':id/hint-walkthrough')
  hintWalkthrough(@Param('id') id: string) { return this.service.hintWalkthrough(id); }

  /** 풀이 공개 (오답노트/복습용) — body + concept + formula + 단계별 풀이 + 정답 */
  @Get(':id/solution')
  solution(@Param('id') id: string, @CurrentLang() lang: Lang) { return this.service.solution(id, lang); }

  /**
   * Sprint 3 A13: student "이 문제 신고" — moves the problem out of the active
   * pool immediately. Adds 'STUDENT_REPORTED' to qualityCriticalFlags so an
   * operator can later distinguish student-flagged from LLM-graded EXCLUSIONS
   * and restore false positives. Logged by user so reports are auditable.
   */
  @Post(':id/report')
  report(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ReportProblemDto,
  ) {
    return this.service.report(userId, id, dto.reason ?? null);
  }
}
