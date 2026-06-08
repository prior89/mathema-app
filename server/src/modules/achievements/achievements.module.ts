import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AchievementsController } from './achievements.controller';
import { AchievementsListener } from './achievements.listener';
import { AchievementsService } from './achievements.service';

@Module({
  imports: [PrismaModule],
  controllers: [AchievementsController],
  providers: [AchievementsService, AchievementsListener],
  exports: [AchievementsService],
})
export class AchievementsModule {}