-- CreateTable
CREATE TABLE "KoreanConceptProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "masteredAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KoreanConceptProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KoreanConceptProgress_userId_idx" ON "KoreanConceptProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KoreanConceptProgress_userId_lessonId_key" ON "KoreanConceptProgress"("userId", "lessonId");

-- AddForeignKey
ALTER TABLE "KoreanConceptProgress" ADD CONSTRAINT "KoreanConceptProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoreanConceptProgress" ADD CONSTRAINT "KoreanConceptProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "KoreanConceptLesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
