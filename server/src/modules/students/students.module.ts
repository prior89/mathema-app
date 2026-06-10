import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MasteryModule } from '../mastery/mastery.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { ParentLinksModule } from '../parent-links/parent-links.module';

@Module({
  imports: [MasteryModule, RecommendationsModule, ParentLinksModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
