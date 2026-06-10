import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { KoreanGrade, KoreanSubject } from '@prisma/client';
import { KoreanConceptLessonsService } from './korean-concept-lessons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Korean curriculum endpoints (2022 개정). Frontend selects these instead of
 * /concept-lessons when the authenticated User.country === 'KR'.
 *
 * 2026-05-27 fix: @SkipThrottle on the whole controller. KR mastery hits
 * GET .../detail, GET .../practice-problems, GET .../mastery on every
 * navigation; combined with react-query background refetches a single
 * student can rack up dozens of requests/minute through normal use. The
 * IP-bucketed throttler was 429-ing legitimate learners mid-chapter. Auth
 * is handled by JwtAuthGuard; that's the only gate this surface needs.
 */
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('korean-concept-lessons')
export class KoreanConceptLessonsController {
  constructor(private readonly service: KoreanConceptLessonsService) {}

  /** GET /korean-concept-lessons?koreanGrade=HIGH_2&koreanSubject=HIGH_ALGEBRA */
  @Get()
  tree(
    @CurrentUser('id') userId: string,
    @Query('koreanGrade') koreanGrade?: string,
    @Query('koreanSubject') koreanSubject?: string,
  ) {
    const grade =
      koreanGrade && Object.values(KoreanGrade).includes(koreanGrade as KoreanGrade)
        ? (koreanGrade as KoreanGrade)
        : undefined;
    const subject =
      koreanSubject && Object.values(KoreanSubject).includes(koreanSubject as KoreanSubject)
        ? (koreanSubject as KoreanSubject)
        : undefined;
    return this.service.tree({ koreanGrade: grade, koreanSubject: subject, userId });
  }

  /** GET /korean-concept-lessons/:code — detail (with steps + per-user progress).
   *  Adds nextProblemId computed from KR Mastery 20-set vs user's attempts so
   *  the frontend Learn-chapter-click → "연습 문제 풀기" lands the student on
   *  their in-progress problem (user spec 2026-05-24). */
  @Get(':code')
  detail(@Param('code') code: string, @CurrentUser('id') userId: string) {
    return this.service.detail(code, userId);
  }

  /** GET /korean-concept-lessons/:code/practice-problems — 20 3-step MC problems (Mastery) */
  @Get(':code/practice-problems')
  practiceProblems(@Param('code') code: string, @CurrentUser('id') userId: string) {
    return this.service.practiceProblems(code, userId);
  }

  /** GET /korean-concept-lessons/:code/study-problems — 20 single-step MC (Study).
   *  2026-05-29: now user-aware. Problems the student has already solved
   *  correctly in STUDY context are pushed to the back of the list so the
   *  next "문제풀이" entry starts with un-attempted (or wrong-noted) rows. */
  @Get(':code/study-problems')
  studyProblems(@Param('code') code: string, @CurrentUser('id') userId: string) {
    return this.service.studyProblems(code, userId);
  }
}
