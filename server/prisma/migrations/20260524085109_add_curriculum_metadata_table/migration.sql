-- AlterTable
ALTER TABLE "ConceptLesson" ADD COLUMN     "curriculumId" TEXT;

-- AlterTable
ALTER TABLE "KoreanConceptLesson" ADD COLUMN     "curriculumId" TEXT;

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Curriculum_countryCode_order_idx" ON "Curriculum"("countryCode", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_countryCode_grade_courseCode_key" ON "Curriculum"("countryCode", "grade", "courseCode");

-- CreateIndex
CREATE INDEX "ConceptLesson_curriculumId_idx" ON "ConceptLesson"("curriculumId");

-- CreateIndex
CREATE INDEX "KoreanConceptLesson_curriculumId_idx" ON "KoreanConceptLesson"("curriculumId");

-- AddForeignKey
ALTER TABLE "ConceptLesson" ADD CONSTRAINT "ConceptLesson_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoreanConceptLesson" ADD CONSTRAINT "KoreanConceptLesson_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;
