-- SolverAttempt log table — append-only audit of every math-helper /solve.
-- See schema.prisma comment for rationale.

CREATE TABLE "SolverAttempt" (
    "id"              TEXT NOT NULL,
    "userId"          TEXT,
    "problemId"       TEXT,
    "question"        TEXT NOT NULL,
    "classLevel"      INTEGER,
    "llmAnswer"       TEXT,
    "llmExplanation"  TEXT,
    "llmSteps"        JSONB,
    "modelUsed"       TEXT,
    "durationMs"      INTEGER,
    "detected"        JSONB,
    "studentAnswer"   TEXT,
    "studentCorrect"  BOOLEAN,
    "fewShotCount"    INTEGER NOT NULL DEFAULT 0,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolverAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SolverAttempt_createdAt_idx" ON "SolverAttempt"("createdAt");
CREATE INDEX "SolverAttempt_userId_createdAt_idx" ON "SolverAttempt"("userId", "createdAt");
CREATE INDEX "SolverAttempt_problemId_idx" ON "SolverAttempt"("problemId");
