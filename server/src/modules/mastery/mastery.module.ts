import { Module } from '@nestjs/common';
import { MasteryController } from './mastery.controller';
import { MasteryService } from './mastery.service';
import { MasteryRepository } from './mastery.repository';
import { MasteryAttemptListener } from './listeners/attempt-completed.listener';
import { MasteryTrajectoryService } from './mastery-trajectory.service';
import { ErrorPatternService } from './error-pattern.service';
import { MasteryTrajectoryListener } from './listeners/mastery-trajectory.listener';
import { ConceptChapterLinkService } from './concept-chapter-link.service';

@Module({
  controllers: [MasteryController],
  providers: [
    MasteryService,
    MasteryRepository,
    MasteryAttemptListener,
    MasteryTrajectoryService,
    ErrorPatternService,
    MasteryTrajectoryListener,
    ConceptChapterLinkService,
  ],
  exports: [MasteryService, MasteryTrajectoryService, ErrorPatternService, ConceptChapterLinkService],
})
export class MasteryModule {}
