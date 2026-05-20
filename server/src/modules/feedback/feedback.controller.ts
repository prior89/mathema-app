import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TeacherOverrideTargetType } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TeacherOverrideService } from './teacher-override.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class FeedbackController {
  constructor(private readonly override: TeacherOverrideService) {}

  // Spec §5 — POST /teacher-overrides. Teacher-role gating will move to a
  // dedicated guard when teacher tooling lands.
  @Post('teacher-overrides')
  applyOverride(
    @CurrentUser('id') teacherId: string,
    @Body() body: {
      studentUserId: string;
      targetType: TeacherOverrideTargetType;
      targetId: string;
      afterValue: Record<string, unknown>;
      reason: string;
    },
  ) {
    return this.override.apply({ ...body, teacherId });
  }
}
