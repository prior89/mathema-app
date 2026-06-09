import { Module } from '@nestjs/common';
import { AchievementsModule } from '../achievements/achievements.module';
import { KoreanConceptLessonsController } from './korean-concept-lessons.controller';
import { KoreanConceptLessonsService } from './korean-concept-lessons.service';

@Module({
  imports: [AchievementsModule],
  controllers: [KoreanConceptLessonsController],
  providers: [KoreanConceptLessonsService],
  exports: [KoreanConceptLessonsService],
})
export class KoreanConceptLessonsModule {}
