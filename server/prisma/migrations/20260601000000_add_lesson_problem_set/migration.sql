-- Phase 1 of the LessonProblemSet expand-contract migration: shadow table only.
-- Runtime keeps reading ConceptLesson.masterySetProblemIds /
-- KoreanConceptLesson.masterySetProblemIds. Backfill populates this table so
-- admin readiness endpoints can surface IN/KR set completeness on a single
-- contract. Dual-write and dual-read are explicitly deferred (post-launch).

-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('MASTERY_3STEP', 'STUDY_1STEP', 'DIAGNOSTIC');

-- CreateEnum
CREATE TYPE "SetStatus" AS ENUM ('DRAFT', 'READY', 'NEEDS_REVIEW', 'RETIRED');

-- CreateTable
CREATE TABLE "LessonProblemSet" (
    "id" TEXT NOT NULL,
    "country" "CountryCode" NOT NULL,
    "setType" "SetType" NOT NULL,
    "conceptLessonId" TEXT,
    "koreanConceptLessonId" TEXT,
    "chapterCode" TEXT NOT NULL,
    "problemIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "SetStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "curatedAt" TIMESTAMP(3),
    "retiredAt" TIMESTAMP(3),
    "curatedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProblemSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonProblemSet_country_chapterCode_setType_version_key"
    ON "LessonProblemSet"("country", "chapterCode", "setType", "version");

-- CreateIndex
CREATE INDEX "LessonProblemSet_country_status_setType_idx"
    ON "LessonProblemSet"("country", "status", "setType");

-- CreateIndex
CREATE INDEX "LessonProblemSet_conceptLessonId_idx"
    ON "LessonProblemSet"("conceptLessonId");

-- CreateIndex
CREATE INDEX "LessonProblemSet_koreanConceptLessonId_idx"
    ON "LessonProblemSet"("koreanConceptLessonId");

-- AddForeignKey
ALTER TABLE "LessonProblemSet" ADD CONSTRAINT "LessonProblemSet_conceptLessonId_fkey"
    FOREIGN KEY ("conceptLessonId") REFERENCES "ConceptLesson"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProblemSet" ADD CONSTRAINT "LessonProblemSet_koreanConceptLessonId_fkey"
    FOREIGN KEY ("koreanConceptLessonId") REFERENCES "KoreanConceptLesson"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- CHECK constraint: exactly one of the two polymorphic FKs must be set.
-- Prisma schema.prisma cannot express CHECK constraints natively; added here
-- as raw SQL per the official guidance for unsupported features.
ALTER TABLE "LessonProblemSet" ADD CONSTRAINT "LessonProblemSet_lesson_xor_check"
    CHECK ((("conceptLessonId" IS NOT NULL)::int + ("koreanConceptLessonId" IS NOT NULL)::int) = 1);
