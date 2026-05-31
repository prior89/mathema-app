-- CreateEnum
CREATE TYPE "QualityStatus" AS ENUM ('APPROVED', 'USABLE', 'EXCLUDED');

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "conceptMismatch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qualityCriticalFlags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "qualityModel" TEXT,
ADD COLUMN     "qualityPromptVersion" TEXT,
ADD COLUMN     "qualityRubric" JSONB,
ADD COLUMN     "qualityScore" DOUBLE PRECISION,
ADD COLUMN     "qualityScoredAt" TIMESTAMP(3),
ADD COLUMN     "qualityStatus" "QualityStatus";

-- CreateIndex
CREATE INDEX "Problem_qualityStatus_idx" ON "Problem"("qualityStatus");
