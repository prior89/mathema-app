import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { StudentEfficacyService } from './student-efficacy.service';
import { AdminModule } from '../admin/admin.module';
import { ActivityModule } from '../activity/activity.module';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';

@Module({
  imports: [AdminModule, ActivityModule, FeatureFlagsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, StudentEfficacyService],
  exports: [UsersService],
})
export class UsersModule {}
