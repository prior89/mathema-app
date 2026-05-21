import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NcertClass } from '@prisma/client';
import { ConceptLessonsService } from './concept-lessons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentLang, Lang } from '../../common/i18n/current-lang.decorator';
import {
  CompleteStepDto,
  CheckRetrievalDto,
  FinalizeConceptDto,
} from './dto/concept-step.dto';

@UseGuards(JwtAuthGuard)
@Controller('concept-lessons')
export class ConceptLessonsController {
  constructor(private readonly service: ConceptLessonsService) {}

  /** GET /concept-lessons?ncertClass=CLASS_7 — NCERT 학년별 lesson 트리 */
  @Get()
  tree(
    @CurrentUser('id') userId: string,
    @CurrentLang() lang: Lang,
    @Query('ncertClass') ncertClass?: string,
  ) {
    const cls =
      ncertClass && Object.values(NcertClass).includes(ncertClass as NcertClass)
        ? (ncertClass as NcertClass)
        : undefined;
    return this.service.tree(userId, lang, cls);
  }

  /** GET /concept-lessons/by-unit/:unitId — 한국 단원 unlock 게이팅용 */
  @Get('by-unit/:unitId')
  byUnit(
    @CurrentUser('id') userId: string,
    @CurrentLang() lang: Lang,
    @Param('unitId') unitId: string,
  ) {
    return this.service.lessonsForUnit(userId, unitId, lang);
  }

  /** GET /concept-lessons/:code/practice-problems — lesson 에 매핑된 3-step 객관식 문제 목록 */
  @Get(':code/practice-problems')
  practiceProblems(
    @CurrentUser('id') userId: string,
    @CurrentLang() lang: Lang,
    @Param('code') code: string,
  ) {
    return this.service.practiceProblems(code, lang, userId);
  }

  /** GET /concept-lessons/:code — lesson 상세 (모든 step 포함) */
  @Get(':code')
  detail(
    @CurrentUser('id') userId: string,
    @CurrentLang() lang: Lang,
    @Param('code') code: string,
  ) {
    return this.service.detail(userId, code, lang);
  }

  /** POST /concept-lessons/:code/start — 시작/이어하기 */
  @Post(':code/start')
  start(@CurrentUser('id') userId: string, @Param('code') code: string) {
    return this.service.start(userId, code);
  }

  /** POST /concept-lessons/:code/step — 한 단계 완료 표시 */
  @Post(':code/step')
  completeStep(
    @CurrentUser('id') userId: string,
    @Param('code') code: string,
    @Body() body: CompleteStepDto,
  ) {
    return this.service.completeStep(
      userId,
      code,
      body.stepIndex,
      body.durationSec ?? 0,
    );
  }

  /** POST /concept-lessons/:code/check — RETRIEVAL 응답 채점 */
  @Post(':code/check')
  check(
    @CurrentUser('id') userId: string,
    @Param('code') code: string,
    @Body() body: CheckRetrievalDto,
  ) {
    return this.service.checkRetrieval(userId, code, body.stepIndex, body.answer);
  }

  // POST /concept-lessons/:code/finalize-concept — atomic "concept phase done"
  // signal. ConceptLessonScreen calls this once at the end of the concept
  // phase (and again on phase='done' for deep-link safety) so masteredAt is
  // set reliably without racing N concurrent /step calls.
  @Post(':code/finalize-concept')
  finalizeConcept(
    @CurrentUser('id') userId: string,
    @Param('code') code: string,
    @Body() body: FinalizeConceptDto,
  ) {
    return this.service.finalizeConceptPhase(userId, code, body.durationSec ?? 0);
  }
}
