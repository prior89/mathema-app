import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) { return this.prisma.user.create({ data }); }
  findById(id: string) { return this.prisma.user.findUnique({ where: { id } }); }
  findByEmail(email: string) { return this.prisma.user.findUnique({ where: { email } }); }
  update(id: string, data: any) { return this.prisma.user.update({ where: { id }, data }); }

  /**
   * Hard delete — PRIVACY_POLICY.md §6 promises 30-day-max purge and Play
   * 2024 deletion policy expects the data to actually be gone, not just
   * deactivated. We do it immediately under transactional control because:
   *
   *   1. The User model's relations to Attempt / WrongNote / StudySession /
   *      MockExamResult / DailyActivity / MasterySnapshot / WeeklyReport
   *      were authored WITHOUT an `onDelete` clause, so they default to
   *      Restrict (Prisma) and a naive `user.delete()` would FK-fail. We
   *      run an explicit deleteMany on each before deleting the User row.
   *
   *   2. AnalyticsEvent has `onDelete: SetNull` — that anonymises the row
   *      automatically and lets us preserve aggregate funnel signal without
   *      keeping per-user trace.
   *
   *   3. PasswordResetToken / EmailVerificationToken hold a userId without
   *      a Prisma relation, so they aren't auto-cascaded — delete them by
   *      userId explicitly so no dangling token outlives the account.
   *
   *   4. AdminAccessLog is intentionally NOT touched — it records
   *      operator actions and must survive for the legal retention window.
   *      It does not have a relation back to User, so it isn't tied to the
   *      deleted account's identity once email + name are gone.
   *
   * Returns { deletedAt } for the response envelope. The User row itself
   * is gone, but we return a timestamp so the client can show "deleted at".
   */
  async hardDelete(id: string) {
    const exists = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return null;
    const deletedAt = new Date();
    await this.prisma.$transaction([
      // Tables whose relation lacks onDelete:Cascade — must clear first.
      this.prisma.attempt.deleteMany({ where: { userId: id } }),
      this.prisma.wrongNote.deleteMany({ where: { userId: id } }),
      this.prisma.studySession.deleteMany({ where: { userId: id } }),
      this.prisma.mockExamResult.deleteMany({ where: { userId: id } }),
      this.prisma.dailyActivity.deleteMany({ where: { userId: id } }),
      this.prisma.masterySnapshot.deleteMany({ where: { userId: id } }),
      this.prisma.weeklyReport.deleteMany({ where: { userId: id } }),
      this.prisma.conceptProgress.deleteMany({ where: { userId: id } }),
      this.prisma.koreanConceptProgress.deleteMany({ where: { userId: id } }),
      this.prisma.contentIngestJob.deleteMany({ where: { uploadedById: id } }),
      // Tokens that hold userId without a relation — cascade them manually.
      this.prisma.passwordResetToken.deleteMany({ where: { userId: id } }),
      this.prisma.emailVerificationToken.deleteMany({ where: { userId: id } }),
      // These tables intentionally have no User FK. Purge them explicitly so
      // identifiers, answers, model-job metadata, IPs, and device fingerprints
      // cannot survive the user's account-deletion request.
      this.prisma.solverAttempt.deleteMany({ where: { userId: id } }),
      this.prisma.lLMAnalysisJob.deleteMany({ where: { userId: id } }),
      this.prisma.securityEvent.deleteMany({ where: { userId: id } }),
      // Cascade-marked tables (Consent, DeviceToken, ConceptProgress,
      // MasteryTrajectory, MasteryEvent, ErrorPatternProfile, LLMAnalysisLog,
      // RecommendationLog, Feedback, TeacherOverride) are wiped automatically
      // when the User row below is deleted. AnalyticsEvent.userId is set to
      // NULL (SetNull) so aggregate analytics retain their shape minus the
      // personal identifier.
      this.prisma.user.delete({ where: { id } }),
    ]);
    return { deletedAt };
  }

  /**
   * 사용자의 모든 데이터 export — GDPR Art. 20 / Play Data Safety 자기데이터 다운로드.
   * Prisma include 사용 — 추가 모델 생기면 여기 한곳에서 확장.
   */
  async exportAll(id: string) {
    const [user, solverAttempts, llmAnalysisJobs, securityEvents] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: { id },
        include: {
          attempts: { take: 10000, orderBy: { createdAt: 'desc' } },
          wrongNotes: { take: 10000, orderBy: { createdAt: 'desc' } },
          studySessions: { take: 5000, orderBy: { startedAt: 'desc' } },
          mockExamResults: { take: 1000, orderBy: { takenAt: 'desc' } },
          activities: { take: 5000, orderBy: { date: 'desc' } },
          masteries: true,
          masteryTrajectories: true,
          masteryEvents: { take: 10000, orderBy: { createdAt: 'desc' } },
          errorPatterns: true,
          weeklyReports: { take: 200, orderBy: { generatedAt: 'desc' } },
          conceptProgress: true,
          koreanConceptProgress: true,
          analyticsEvents: { take: 5000, orderBy: { createdAt: 'desc' } },
          recommendationLogs: { take: 5000, orderBy: { createdAt: 'desc' } },
          llmAnalysisLogs: { take: 5000, orderBy: { createdAt: 'desc' } },
          feedbacks: { take: 1000, orderBy: { createdAt: 'desc' } },
          consents: { orderBy: { grantedAt: 'desc' } },
          authDevices: true,
          deviceTokens: true,
          placementProfile: true,
          firstSessionPlan: true,
          achievements: true,
          parentChildLinksAsParent: true,
          parentChildLinksAsChild: true,
          guardianConsentRequest: true,
          subscription: {
            include: {
              events: { take: 500, orderBy: { receivedAt: 'desc' } },
              purchaseTokens: { orderBy: { createdAt: 'asc' } },
            },
          },
        },
      }),
      this.prisma.solverAttempt.findMany({
        where: { userId: id }, take: 5000, orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lLMAnalysisJob.findMany({
        where: { userId: id }, take: 5000, orderBy: { createdAt: 'desc' },
      }),
      this.prisma.securityEvent.findMany({
        where: { userId: id }, take: 5000, orderBy: { createdAt: 'desc' },
      }),
    ]);
    if (!user) return null;
    return { ...user, solverAttempts, llmAnalysisJobs, securityEvents };
  }
}
