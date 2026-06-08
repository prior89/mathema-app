-- CreateEnum
CREATE TYPE "AchievementKind" AS ENUM ('FIRST_CONCEPT_STEP', 'FIRST_PRACTICE_CORRECT', 'FIRST_WRONGNOTE_MASTERED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pushRemindersEnabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "UserPlacementProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "estimatedGradeBand" TEXT,
    "conceptScores" JSONB NOT NULL DEFAULT '[]',
    "weakConceptIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendedChapterCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPlacementProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FirstSessionPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cards" JSONB NOT NULL DEFAULT '[]',
    "seededAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "FirstSessionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "AchievementKind" NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPlacementProfile_userId_key" ON "UserPlacementProfile"("userId");

-- CreateIndex
CREATE INDEX "UserPlacementProfile_sessionId_idx" ON "UserPlacementProfile"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "FirstSessionPlan_userId_key" ON "FirstSessionPlan"("userId");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_earnedAt_idx" ON "UserAchievement"("userId", "earnedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_kind_key" ON "UserAchievement"("userId", "kind");

-- AddForeignKey
ALTER TABLE "UserPlacementProfile" ADD CONSTRAINT "UserPlacementProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FirstSessionPlan" ADD CONSTRAINT "FirstSessionPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
