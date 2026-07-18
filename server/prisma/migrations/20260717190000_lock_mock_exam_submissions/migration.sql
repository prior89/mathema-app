-- Persist the exact problem allowlist for every newly-created mock exam.
ALTER TABLE "MockExam"
ADD COLUMN "problemIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Existing rows predate the allowlist contract. Close them during migration so
-- an empty legacy allowlist can never become a submit-anything fallback.
ALTER TABLE "MockExamResult"
ADD COLUMN "finalizedAt" TIMESTAMP(3);

UPDATE "MockExamResult"
SET "finalizedAt" = "takenAt"
WHERE "finalizedAt" IS NULL;
