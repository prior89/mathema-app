import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { TeacherOverrideService } from './teacher-override.service';

@Module({
  controllers: [FeedbackController],
  providers: [TeacherOverrideService],
  exports: [TeacherOverrideService],
})
export class FeedbackModule {}
