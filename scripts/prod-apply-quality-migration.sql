-- prod-apply-quality-migration.sql
-- Idempotent version of prisma/migrations/20260522215115_add_problem_quality_score/migration.sql
-- Adds the QualityStatus enum + 8 Problem columns + index. Safe to re-run.
--
-- After this, INSERT a row into _prisma_migrations (separate command) so
-- future `prisma migrate deploy` skips this migration.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QualityStatus') THEN
    CREATE TYPE "QualityStatus" AS ENUM ('APPROVED', 'USABLE', 'EXCLUDED');
  END IF;
END
$$;

ALTER TABLE "Problem"
  ADD COLUMN IF NOT EXISTS "conceptMismatch"      BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "qualityCriticalFlags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "qualityModel"         TEXT,
  ADD COLUMN IF NOT EXISTS "qualityPromptVersion" TEXT,
  ADD COLUMN IF NOT EXISTS "qualityRubric"        JSONB,
  ADD COLUMN IF NOT EXISTS "qualityScore"         DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "qualityScoredAt"      TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "qualityStatus"        "QualityStatus";

CREATE INDEX IF NOT EXISTS "Problem_qualityStatus_idx" ON "Problem"("qualityStatus");

-- Verify
SELECT
  COUNT(*) FILTER (WHERE column_name IN ('qualityScore','qualityStatus','qualityRubric','conceptMismatch','qualityCriticalFlags','qualityModel','qualityPromptVersion','qualityScoredAt')) AS new_columns_present
FROM information_schema.columns
WHERE table_name = 'Problem';
