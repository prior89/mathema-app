-- CreateEnum
CREATE TYPE "StudyGoal" AS ENUM ('BOARD', 'JEE', 'SCHOOL', 'CATCHUP');

-- DropForeignKey
ALTER TABLE "Concept" DROP CONSTRAINT "Concept_parentConceptId_fkey";

-- DropForeignKey
ALTER TABLE "Concept" DROP CONSTRAINT "Concept_unitId_fkey";

-- DropForeignKey
ALTER TABLE "ErrorPatternProfile" DROP CONSTRAINT "ErrorPatternProfile_conceptId_fkey";

-- DropForeignKey
ALTER TABLE "ErrorPatternProfile" DROP CONSTRAINT "ErrorPatternProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_raterId_fkey";

-- DropForeignKey
ALTER TABLE "LLMAnalysisLog" DROP CONSTRAINT "LLMAnalysisLog_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "LLMAnalysisLog" DROP CONSTRAINT "LLMAnalysisLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "MasteryEvent" DROP CONSTRAINT "MasteryEvent_conceptId_fkey";

-- DropForeignKey
ALTER TABLE "MasteryEvent" DROP CONSTRAINT "MasteryEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "MasteryTrajectory" DROP CONSTRAINT "MasteryTrajectory_conceptId_fkey";

-- DropForeignKey
ALTER TABLE "MasteryTrajectory" DROP CONSTRAINT "MasteryTrajectory_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemConcept" DROP CONSTRAINT "ProblemConcept_conceptId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemConcept" DROP CONSTRAINT "ProblemConcept_problemId_fkey";

-- DropForeignKey
ALTER TABLE "RecommendationLog" DROP CONSTRAINT "RecommendationLog_recommendedProblemId_fkey";

-- DropForeignKey
ALTER TABLE "RecommendationLog" DROP CONSTRAINT "RecommendationLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherOverride" DROP CONSTRAINT "TeacherOverride_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherOverride" DROP CONSTRAINT "TeacherOverride_userId_fkey";

-- DropIndex
DROP INDEX "Attempt_userId_timeOfDay_idx";

-- DropIndex
DROP INDEX "MasterySnapshot_userId_studyTimeMin_idx";

-- DropIndex
DROP INDEX "User_role_tenantId_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "studyGoal" "StudyGoal";

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_parentConceptId_fkey" FOREIGN KEY ("parentConceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemConcept" ADD CONSTRAINT "ProblemConcept_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemConcept" ADD CONSTRAINT "ProblemConcept_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryTrajectory" ADD CONSTRAINT "MasteryTrajectory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryTrajectory" ADD CONSTRAINT "MasteryTrajectory_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryEvent" ADD CONSTRAINT "MasteryEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryEvent" ADD CONSTRAINT "MasteryEvent_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErrorPatternProfile" ADD CONSTRAINT "ErrorPatternProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErrorPatternProfile" ADD CONSTRAINT "ErrorPatternProfile_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LLMAnalysisLog" ADD CONSTRAINT "LLMAnalysisLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LLMAnalysisLog" ADD CONSTRAINT "LLMAnalysisLog_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_recommendedProblemId_fkey" FOREIGN KEY ("recommendedProblemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherOverride" ADD CONSTRAINT "TeacherOverride_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherOverride" ADD CONSTRAINT "TeacherOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
