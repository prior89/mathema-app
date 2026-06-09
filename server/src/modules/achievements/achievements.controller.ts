import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AchievementKind } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AchievementsService } from './achievements.service';

@UseGuards(JwtAuthGuard)
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly service: AchievementsService) {}

  @Get()
  list(@CurrentUser('id') userId: string) {
    return this.service.list(userId);
  }

  @Post(':kind/celebrate')
  celebrate(
    @CurrentUser('id') userId: string,
    @Param('kind') kind: AchievementKind,
  ) {
    return this.service.celebrate(userId, kind);
  }
}