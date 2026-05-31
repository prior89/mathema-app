-- CreateEnum
CREATE TYPE "KoreanGrade" AS ENUM ('MIDDLE_1', 'MIDDLE_2', 'MIDDLE_3', 'HIGH_1', 'HIGH_2', 'HIGH_3');

-- CreateEnum
CREATE TYPE "KoreanSubject" AS ENUM ('MIDDLE_MATH_1', 'MIDDLE_MATH_2', 'MIDDLE_MATH_3', 'HIGH_COMMON_1', 'HIGH_COMMON_2', 'HIGH_ALGEBRA', 'HIGH_CALCULUS_1', 'HIGH_CALCULUS_2', 'HIGH_STATISTICS', 'HIGH_GEOMETRY');

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "koreanConceptLessonId" TEXT;

-- CreateTable
CREATE TABLE "KoreanConceptLesson" (
    "id" TEXT NOT NULL,
    "koreanGrade" "KoreanGrade" NOT NULL,
    "koreanSubject" "KoreanSubject" NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "chapterCode" TEXT NOT NULL,
    "titleKo" TEXT NOT NULL,
    "titleEn" TEXT,
    "bigIdeaKo" TEXT NOT NULL,
    "bigIdeaEn" TEXT,
    "estimatedMin" INTEGER NOT NULL DEFAULT 15,
    "cognitiveLoad" INTEGER NOT NULL DEFAULT 1,
    "prerequisiteCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "masterySetProblemIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "masterySetCuratedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KoreanConceptLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KoreanConceptStep" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "kind" "ConceptStepKind" NOT NULL,
    "titleKo" TEXT NOT NULL,
    "bodyKo" TEXT NOT NULL,
    "visualType" TEXT,
    "visualUrl" TEXT,
    "visualData" JSONB,
    "misconception" JSONB,
    "workedSteps" JSONB,
    "retrievalCheck" JSONB,
    "reflectPrompts" JSONB,

    CONSTRAINT "KoreanConceptStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KoreanConceptLesson_chapterCode_key" ON "KoreanConceptLesson"("chapterCode");

-- CreateIndex
CREATE INDEX "KoreanConceptLesson_koreanGrade_koreanSubject_idx" ON "KoreanConceptLesson"("koreanGrade", "koreanSubject");

-- CreateIndex
CREATE UNIQUE INDEX "KoreanConceptLesson_koreanGrade_koreanSubject_chapterNumber_key" ON "KoreanConceptLesson"("koreanGrade", "koreanSubject", "chapterNumber");

-- CreateIndex
CREATE INDEX "KoreanConceptStep_lessonId_idx" ON "KoreanConceptStep"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "KoreanConceptStep_lessonId_stepIndex_key" ON "KoreanConceptStep"("lessonId", "stepIndex");

-- CreateIndex
CREATE INDEX "Problem_koreanConceptLessonId_idx" ON "Problem"("koreanConceptLessonId");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_koreanConceptLessonId_fkey" FOREIGN KEY ("koreanConceptLessonId") REFERENCES "KoreanConceptLesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoreanConceptStep" ADD CONSTRAINT "KoreanConceptStep_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "KoreanConceptLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
