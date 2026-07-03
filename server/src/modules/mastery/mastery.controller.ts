import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MasteryService } from './mastery.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentLang, Lang } from '../../common/i18n/current-lang.decorator';
import { MasteryTrajectoryService } from './mastery-trajectory.service';
import { ErrorPatternService } from './error-pattern.service';
import { ConceptChapterLinkService } from './concept-chapter-link.service';

@UseGuards(JwtAuthGuard)
@Controller('mastery')
export class MasteryController {
  constructor(
    private readonly service: MasteryService,
    private readonly trajectory: MasteryTrajectoryService,
    private readonly errorPattern: ErrorPatternService,
    private readonly chapterLinks: ConceptChapterLinkService,
  ) {}

  // Unit-level snapshot — listed by Home/Mastery dashboards.
  @Get()
  all(@CurrentUser('id') userId: string, @CurrentLang() lang: Lang) {
    return this.service.all(userId, lang);
  }

  // Concept-level trajectory (§5 of spec).
  @Get('trajectory')
  conceptTrajectory(@CurrentUser('id') userId: string) {
    return this.trajectory.getAllForUser(userId);
  }

  @Get('trajectory/:conceptId/history')
  conceptHistory(
    @CurrentUser('id') userId: string,
    @Param('conceptId') conceptId: string,
    @Query('take') take?: string,
  ) {
    return this.trajectory.getHistory(userId, conceptId, take ? parseInt(take, 10) : 30);
  }

  @Get('error-patterns/active')
  activeErrorPatterns(@CurrentUser('id') userId: string) {
    return this.errorPattern.getActiveForUser(userId);
  }

  /**
   * Batch-resolve conceptId → country-correct chapterCode for deep-linking a
   * weakness card straight to its lesson. `ids` is a comma-separated list.
   * Values are null when no lesson resolves (client falls back to /app/learn).
   */
  @Get('chapter-links')
  getChapterLinks(
    @CurrentUser('id') userId: string,
    @Query('ids') ids?: string,
  ) {
    const conceptIds = (ids ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    return this.chapterLinks.resolveForUser(userId, conceptIds);
  }
}
