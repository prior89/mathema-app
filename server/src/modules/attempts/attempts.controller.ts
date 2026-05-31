import { Body, Controller, Get, Param, Post, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AttemptsService } from './attempts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SimilarProblemService } from '../recommendations/services/similar-problem.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';

// 2026-05-27 fix: attempts is the core grading endpoint students hit on
// every choice click. Even with user-bucketed throttler the natural pace
// of a 20-problem × 3-step mastery run plus react-query refetches can
// brush the global ceiling, and a throttle here looks identical to a
// network error to the learner ("서버가 답을 채점하지 못했어요"). JWT auth
// alone is the right control surface — fraud-detection belongs to a
// separate analytics layer, not the rate limiter.
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('attempts')
export class AttemptsController {
  constructor(
    private readonly service: AttemptsService,
    private readonly prisma: PrismaService,
    private readonly similar: SimilarProblemService,
  ) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateAttemptDto) {
    return this.service.create(userId, dto);
  }

  /** 명세서 §5 — GET /api/attempts/:attemptId. 본인 것만 반환. */
  @Get(':attemptId')
  async getById(@CurrentUser('id') userId: string, @Param('attemptId') id: string) {
    const a = await this.prisma.attempt.findUnique({
      where: { id },
      include: { problem: { select: { id: true, source: true, difficultyLevel: true } } },
    });
    if (!a) throw new NotFoundException('Attempt not found');
    if (a.userId !== userId) throw new ForbiddenException('Cannot access other user attempt');
    return a;
  }

  /** 명세서 §5 — GET /api/attempts/:attemptId/similar-problems. /recommendations/similar/:id 의 명세서 path 별칭. */
  @Get(':attemptId/similar-problems')
  similarProblems(@CurrentUser('id') userId: string, @Param('attemptId') id: string) {
    return this.similar.getSimilar(userId, id);
  }
}
