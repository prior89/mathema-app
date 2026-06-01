-- Schema-vs-DDL alignment fix: the Prisma model declares
-- `problemIds String[] @default([])` (effectively non-null in app code),
-- but the original CreateTable in 20260601000000 omitted the NOT NULL
-- constraint at the database level. Phase 1 only ever inserts non-null
-- arrays, so any safety-net NULLs found in the wild get coerced to an
-- empty array first.
UPDATE "LessonProblemSet" SET "problemIds" = ARRAY[]::TEXT[] WHERE "problemIds" IS NULL;

-- AlterColumn: enforce non-null at the DB layer too.
ALTER TABLE "LessonProblemSet" ALTER COLUMN "problemIds" SET NOT NULL;
