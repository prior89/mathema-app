-- AlterTable
ALTER TABLE "ConceptProgress" ADD COLUMN     "conceptWalkthroughAt" TIMESTAMP(3);

-- Backfill: existing `masteredAt` rows were set by the old finalize-concept
-- handler (concept walkthrough completion), which conflated "read the
-- lesson" with "mastered the 20 practice problems". Move that signal to the
-- new conceptWalkthroughAt column and null out masteredAt so the new
-- attempt-driven hook (AttemptsService.create) can correctly re-derive it
-- from Attempt history.
UPDATE "ConceptProgress"
SET "conceptWalkthroughAt" = "masteredAt",
    "masteredAt"           = NULL
WHERE "masteredAt" IS NOT NULL;
