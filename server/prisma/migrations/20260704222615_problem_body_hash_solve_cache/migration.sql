-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "bodyHash" TEXT,
ADD COLUMN     "normalizedBody" TEXT;

-- CreateIndex
CREATE INDEX "Problem_bodyHash_idx" ON "Problem"("bodyHash");
