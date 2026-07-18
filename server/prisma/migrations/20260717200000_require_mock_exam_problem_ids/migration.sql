-- Rolling-deploy guard: NOT VALID deliberately leaves pre-existing system
-- templates alone, while PostgreSQL still enforces the constraint for every
-- new or updated MockExam written by either the old or new app revision.
-- The earlier 20260717190000 migration may already be applied in production;
-- never rewrite it to add this guard.
ALTER TABLE "MockExam"
ADD CONSTRAINT "MockExam_problemIds_nonempty_check"
CHECK (cardinality("problemIds") > 0) NOT VALID;
