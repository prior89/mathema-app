import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MasteryModule } from '../mastery/mastery.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { ParentLinksModule } from '../parent-links/parent-links.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [MasteryModule, RecommendationsModule, ParentLinksModule, BillingModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
