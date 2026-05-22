-- ConceptLesson: canonical Mastery 20-problem set
-- Every user on a chapter sees the same Problem IDs in the same order so
-- cohort statistics + per-concept weakness diagnostics are comparable.
-- Curated lazily on first practiceProblems() call and frozen thereafter.

ALTER TABLE "ConceptLesson"
  ADD COLUMN "masterySetProblemIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "masterySetCuratedAt" TIMESTAMP(3);
