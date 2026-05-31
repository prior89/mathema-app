import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FeedbackRaterType, FeedbackTargetType, TeacherOverrideTargetType } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TeacherOverrideService } from './teacher-override.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class FeedbackController {
  constructor(
    private readonly override: TeacherOverrideService,
    private readonly prisma: PrismaService,
  ) {}

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

  // Spec §11 — POST /feedback. Students (or teachers/parents/admins) rate
  // an AI artifact: LLMAnalysisLog, WeeklyReport, RecommendationLog,
  // Problem explanation, etc. The Feedback model exists in schema.prisma
  // (raterType + targetType + targetId + aiInsightRating 1-5 + comment),
  // but the endpoint was missing — E2E ai-prescription.spec hit a 404
  // here for "POST /feedback" and the rest of the suite failed with it.
  // Auth provides raterId; the body only carries rater-supplied fields.
  @Post('feedback')
  async submitFeedback(
    @CurrentUser('id') raterId: string,
    @Body() body: {
      raterType: FeedbackRaterType;
      targetType: FeedbackTargetType;
      targetId: string;
      aiInsightRating: number;
      comment?: string;
    },
  ) {
    return this.prisma.feedback.create({
      data: {
        raterId,
        raterType: body.raterType,
        targetType: body.targetType,
        targetId: body.targetId,
        aiInsightRating: body.aiInsightRating,
        comment: body.comment ?? null,
      },
    });
  }
}
