import { Module } from '@nestjs/common';
import { KoreanConceptLessonsController } from './korean-concept-lessons.controller';
import { KoreanConceptLessonsService } from './korean-concept-lessons.service';

@Module({
  controllers: [KoreanConceptLessonsController],
  providers: [KoreanConceptLessonsService],
  exports: [KoreanConceptLessonsService],
})
export class KoreanConceptLessonsModule {}
