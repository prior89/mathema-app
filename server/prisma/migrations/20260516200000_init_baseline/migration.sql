-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('MIDDLE', 'UPPER_MIDDLE', 'SEMI_KILLER', 'KILLER');

-- CreateEnum
CREATE TYPE "ErrorType" AS ENUM ('CONCEPT_MISUNDERSTANDING', 'CALCULATION_MISTAKE', 'TIME_SHORTAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "NoteStatus" AS ENUM ('PENDING', 'ANALYZING', 'MASTERED');

-- CreateEnum
CREATE TYPE "SessionContext" AS ENUM ('STUDY', 'EXAM', 'PRACTICE', 'DIAGNOSTIC');

-- CreateEnum
CREATE TYPE "MockExamType" AS ENUM ('HAKPYEONG', 'MOPYEONG', 'SUNEUNG', 'RECOMMENDED', 'MINI', 'WRONG_REDO', 'REAL');

-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('CONCEPT', 'PROCESS', 'ANSWER');

-- CreateEnum
CREATE TYPE "DistractorType" AS ENUM ('CONCEPT_CONFUSION', 'CALC_ERROR', 'PROCESS_SKIP', 'TIME_PRESSURE_GUESS');

-- CreateEnum
CREATE TYPE "GradeLevel" AS ENUM ('G_MIDDLE_1', 'G_MIDDLE_2', 'G_MIDDLE_3', 'G_HIGH_1', 'G_HIGH_2', 'G_HIGH_3');

-- CreateEnum
CREATE TYPE "NcertClass" AS ENUM ('CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12');

-- CreateEnum
CREATE TYPE "ConceptStepKind" AS ENUM ('HOOK', 'CONCRETE', 'PICTORIAL', 'ABSTRACT', 'WORKED_EXAMPLE', 'GUIDED_PRACTICE', 'RETRIEVAL', 'MISCONCEPTION', 'REFLECT');

-- CreateEnum
CREATE TYPE "ConsentKind" AS ENUM ('DATA_PROCESSING', 'ANALYTICS', 'MARKETING', 'AI_TRAINING');

-- CreateEnum
CREATE TYPE "SchoolLevel" AS ENUM ('ELEMENTARY', 'MIDDLE', 'HIGH');

-- CreateEnum
CREATE TYPE "StudyGoal" AS ENUM ('BOARD', 'JEE', 'SCHOOL', 'CATCHUP');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'PARENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ErrorCode" AS ENUM ('SIGN', 'ALG', 'CON', 'FORMULA', 'GRAPH', 'UNIT', 'CALC', 'LOGIC');

-- CreateEnum
CREATE TYPE "ErrorPatternStatus" AS ENUM ('ACTIVE', 'IMPROVING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "LLMValidationStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "LLMJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'NEEDS_REVIEW', 'RETRYING');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('ADAPTIVE_NEXT', 'SIMILAR_PROBLEM', 'REVIEW_PROBLEM');

-- CreateEnum
CREATE TYPE "RecommendationResult" AS ENUM ('CORRECT', 'INCORRECT', 'SKIPPED');

-- CreateEnum
CREATE TYPE "MasteryTrend" AS ENUM ('UP', 'DOWN', 'STABLE');

-- CreateEnum
CREATE TYPE "MasteryUpdateSource" AS ENUM ('RULE_BASED', 'LLM', 'HYBRID', 'TEACHER_OVERRIDE');

-- CreateEnum
CREATE TYPE "FeedbackTargetType" AS ENUM ('AI_INSIGHT', 'WEEKLY_REPORT', 'NEXT_PROBLEM', 'EXPLANATION');

-- CreateEnum
CREATE TYPE "FeedbackRaterType" AS ENUM ('STUDENT', 'TEACHER', 'PARENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "TeacherOverrideTargetType" AS ENUM ('MASTERY', 'ERROR_PATTERN', 'RECOMMENDATION');

-- CreateEnum
CREATE TYPE "CountryCode" AS ENUM ('IN', 'KR', 'US', 'UK', 'AU', 'SG', 'GLOBAL');

-- CreateEnum
CREATE TYPE "ContentSourceType" AS ENUM ('PDF', 'HTTP_API', 'JSON_BULK', 'CSV');

-- CreateEnum
CREATE TYPE "ContentIngestStatus" AS ENUM ('QUEUED', 'FETCHING', 'EXTRACTING', 'INDEXING', 'DRAFTING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "ContentDraftStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "targetGrade" INTEGER NOT NULL,
    "gradeLevel" "GradeLevel" DEFAULT 'G_HIGH_3',
    "country" "CountryCode" NOT NULL DEFAULT 'IN',
    "schoolLevel" "SchoolLevel",
    "studyGoal" "StudyGoal",
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "childOfUserId" TEXT,
    "tenantId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "ConsentKind" NOT NULL,
    "policyVersion" TEXT NOT NULL DEFAULT '1.0',
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "gradeLevels" "GradeLevel"[] DEFAULT ARRAY[]::"GradeLevel"[],

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubUnit" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SubUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "subUnitId" TEXT,
    "difficulty" "Difficulty" NOT NULL,
    "body" TEXT NOT NULL,
    "formula" TEXT,
    "concept" TEXT,
    "answer" TEXT NOT NULL,
    "imageUrl" TEXT,
    "hint" TEXT,
    "difficultyLevel" INTEGER NOT NULL DEFAULT 3,
    "requiredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expectedSolutionSteps" JSONB,
    "commonErrorCodes" "ErrorCode"[] DEFAULT ARRAY[]::"ErrorCode"[],
    "expectedTimeSec" INTEGER,
    "conceptLessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemStep" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "stepType" "StepType" NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "ProblemStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemChoice" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "choiceIndex" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "distractorType" "DistractorType",
    "rationale" TEXT,

    CONSTRAINT "ProblemChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "tenantId" TEXT,
    "context" "SessionContext" NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "responseTimeMs" INTEGER,
    "confidence" INTEGER,
    "selfConfidenceScore" INTEGER,
    "hintUsed" BOOLEAN NOT NULL DEFAULT false,
    "hintCount" INTEGER NOT NULL DEFAULT 0,
    "stepByStepInput" JSONB,
    "errorCodes" "ErrorCode"[] DEFAULT ARRAY[]::"ErrorCode"[],
    "deviceType" TEXT,
    "timeOfDay" INTEGER,
    "stepIndex" INTEGER,
    "choiceId" TEXT,
    "studySessionId" TEXT,
    "mockExamResultId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WrongNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "errorType" "ErrorType" NOT NULL,
    "insight" TEXT NOT NULL,
    "insightJson" JSONB,
    "status" "NoteStatus" NOT NULL DEFAULT 'PENDING',
    "similarCount" INTEGER NOT NULL DEFAULT 0,
    "occurrences" INTEGER NOT NULL DEFAULT 1,
    "masteredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "easinessFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitionCount" INTEGER NOT NULL DEFAULT 0,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),
    "lapseCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WrongNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "tenantId" TEXT,
    "sessionNumber" INTEGER NOT NULL,
    "totalSessions" INTEGER NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationSec" INTEGER NOT NULL DEFAULT 0,
    "context" "SessionContext" NOT NULL DEFAULT 'STUDY',
    "deviceType" TEXT,
    "focusScore" DOUBLE PRECISION,
    "fatigueSignal" TEXT,
    "timeOfDay" INTEGER,
    "problemCount" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "averageResponseTimeSec" INTEGER,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockExam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MockExamType" NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "totalProblems" INTEGER NOT NULL DEFAULT 30,
    "totalMinutes" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockExamResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mockExamId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "percentile" INTEGER NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 0,
    "problemsSolved" INTEGER NOT NULL DEFAULT 0,
    "accuracyPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "intensity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterySnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "samples" INTEGER NOT NULL DEFAULT 0,
    "studyTimeMin" INTEGER NOT NULL DEFAULT 0,
    "lastErrorTypes" JSONB,
    "lastAttemptAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "appVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSentAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "sessionId" TEXT,
    "userAgent" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "requestIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAccessLog" (
    "id" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "query" TEXT,
    "body" TEXT,
    "statusCode" INTEGER NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "durationMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptLesson" (
    "id" TEXT NOT NULL,
    "ncertClass" "NcertClass" NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "chapterCode" TEXT NOT NULL,
    "titleKo" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT,
    "bigIdeaKo" TEXT NOT NULL,
    "bigIdeaEn" TEXT NOT NULL,
    "bigIdeaHi" TEXT,
    "estimatedMin" INTEGER NOT NULL DEFAULT 15,
    "cognitiveLoad" INTEGER NOT NULL DEFAULT 1,
    "prerequisiteCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unitId" TEXT,
    "subUnitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptStep" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "kind" "ConceptStepKind" NOT NULL,
    "titleKo" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT,
    "bodyKo" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyHi" TEXT,
    "visualType" TEXT,
    "visualUrl" TEXT,
    "visualData" JSONB,
    "misconception" JSONB,
    "workedSteps" JSONB,
    "retrievalCheck" JSONB,
    "reflectPrompts" JSONB,

    CONSTRAINT "ConceptStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "completedSteps" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "masteredAt" TIMESTAMP(3),
    "retrievalScore" DOUBLE PRECISION,
    "durationSec" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isoWeek" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "weekEnd" DATE,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "problemsSolved" INTEGER NOT NULL,
    "accuracyPct" DOUBLE PRECISION NOT NULL,
    "aiScore" DOUBLE PRECISION NOT NULL,
    "mentorMessage" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,
    "studentSummary" TEXT,
    "parentSummary" TEXT,
    "teacherSummary" TEXT,
    "topImprovedConcepts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weakConcepts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "repeatedErrorPatterns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "averageStudyDurationSec" INTEGER NOT NULL DEFAULT 0,
    "recommendedNextGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "contactEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concept" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT 'math',
    "gradeLevel" "GradeLevel",
    "parentConceptId" TEXT,
    "prerequisiteConceptIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relatedConceptIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemConcept" (
    "problemId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "ProblemConcept_pkey" PRIMARY KEY ("problemId","conceptId")
);

-- CreateTable
CREATE TABLE "MasteryTrajectory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "tenantId" TEXT,
    "masteryScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "confidenceInterval" DOUBLE PRECISION,
    "trend" "MasteryTrend" NOT NULL DEFAULT 'STABLE',
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "recentAccuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageResponseTimeSec" INTEGER NOT NULL DEFAULT 0,
    "hintUsageRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "confidenceGap" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "updatedBy" "MasteryUpdateSource" NOT NULL DEFAULT 'RULE_BASED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasteryTrajectory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasteryEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "tenantId" TEXT,
    "attemptId" TEXT,
    "masteryScore" DOUBLE PRECISION NOT NULL,
    "delta" DOUBLE PRECISION NOT NULL,
    "evidenceCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasteryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorPatternProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "tenantId" TEXT,
    "errorCode" "ErrorCode" NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "recentFrequency" INTEGER NOT NULL DEFAULT 0,
    "severity" TEXT NOT NULL DEFAULT 'low',
    "firstDetectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastDetectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "llmSummary" TEXT,
    "evidenceAttemptIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ErrorPatternStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ErrorPatternProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LLMAnalysisLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "tenantId" TEXT,
    "modelName" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "inputHash" TEXT NOT NULL,
    "rawOutput" JSONB NOT NULL,
    "parsedOutput" JSONB NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "validationStatus" "LLMValidationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LLMAnalysisLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LLMAnalysisJob" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "tenantId" TEXT,
    "status" "LLMJobStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "bullJobId" TEXT,
    "lastError" TEXT,
    "startedAt" TIMESTAMP(3),
    "lastChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultLogId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LLMAnalysisJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT,
    "tenantId" TEXT,
    "recommendedProblemId" TEXT NOT NULL,
    "recommendationType" "RecommendationType" NOT NULL,
    "reason" TEXT NOT NULL,
    "targetConceptId" TEXT,
    "targetErrorCode" "ErrorCode",
    "expectedDifficulty" INTEGER NOT NULL DEFAULT 3,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "solved" BOOLEAN NOT NULL DEFAULT false,
    "result" "RecommendationResult",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecommendationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherOverride" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT,
    "targetType" "TeacherOverrideTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "beforeValue" JSONB NOT NULL,
    "afterValue" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "targetType" "FeedbackTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "raterType" "FeedbackRaterType" NOT NULL,
    "raterId" TEXT NOT NULL,
    "aiInsightRating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentIngestJob" (
    "id" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "sourceType" "ContentSourceType" NOT NULL,
    "sourceConfigJson" JSONB NOT NULL,
    "sourceDigest" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" "ContentIngestStatus" NOT NULL DEFAULT 'QUEUED',
    "detectedClasses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalItems" INTEGER,
    "extractedExercises" INTEGER,
    "extractedProblems" INTEGER,
    "draftsCreated" INTEGER,
    "errorMessage" TEXT,
    "indexJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ContentIngestJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentDraft" (
    "id" TEXT NOT NULL,
    "ingestJobId" TEXT,
    "conceptLessonId" TEXT,
    "sourceLabel" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "sourcePage" INTEGER,
    "aiModel" TEXT,
    "aiPromptVer" TEXT,
    "aiResponseJson" JSONB,
    "aiTokensIn" INTEGER,
    "aiTokensOut" INTEGER,
    "aiCostUsd" DECIMAL(10,6),
    "editedJson" JSONB,
    "proposedDifficulty" "Difficulty" NOT NULL DEFAULT 'MIDDLE',
    "proposedDifficultyLevel" INTEGER NOT NULL DEFAULT 3,
    "status" "ContentDraftStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewerNote" TEXT,
    "publishedProblemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_examDate_idx" ON "User"("examDate");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");

-- CreateIndex
CREATE INDEX "Consent_userId_kind_revokedAt_idx" ON "Consent"("userId", "kind", "revokedAt");

-- CreateIndex
CREATE INDEX "Consent_userId_grantedAt_idx" ON "Consent"("userId", "grantedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubUnit_unitId_name_key" ON "SubUnit"("unitId", "name");

-- CreateIndex
CREATE INDEX "Problem_unitId_difficulty_idx" ON "Problem"("unitId", "difficulty");

-- CreateIndex
CREATE INDEX "Problem_difficultyLevel_idx" ON "Problem"("difficultyLevel");

-- CreateIndex
CREATE INDEX "Problem_conceptLessonId_idx" ON "Problem"("conceptLessonId");

-- CreateIndex
CREATE INDEX "ProblemStep_problemId_idx" ON "ProblemStep"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemStep_problemId_stepIndex_key" ON "ProblemStep"("problemId", "stepIndex");

-- CreateIndex
CREATE INDEX "ProblemChoice_stepId_idx" ON "ProblemChoice"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemChoice_stepId_choiceIndex_key" ON "ProblemChoice"("stepId", "choiceIndex");

-- CreateIndex
CREATE INDEX "Attempt_userId_createdAt_idx" ON "Attempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Attempt_userId_problemId_idx" ON "Attempt"("userId", "problemId");

-- CreateIndex
CREATE INDEX "Attempt_choiceId_idx" ON "Attempt"("choiceId");

-- CreateIndex
CREATE INDEX "Attempt_tenantId_createdAt_idx" ON "Attempt"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "WrongNote_userId_status_idx" ON "WrongNote"("userId", "status");

-- CreateIndex
CREATE INDEX "WrongNote_userId_errorType_idx" ON "WrongNote"("userId", "errorType");

-- CreateIndex
CREATE INDEX "WrongNote_userId_nextReviewAt_idx" ON "WrongNote"("userId", "nextReviewAt");

-- CreateIndex
CREATE UNIQUE INDEX "WrongNote_userId_problemId_key" ON "WrongNote"("userId", "problemId");

-- CreateIndex
CREATE INDEX "StudySession_userId_endedAt_idx" ON "StudySession"("userId", "endedAt");

-- CreateIndex
CREATE INDEX "MockExamResult_userId_takenAt_idx" ON "MockExamResult"("userId", "takenAt");

-- CreateIndex
CREATE INDEX "DailyActivity_userId_date_idx" ON "DailyActivity"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyActivity_userId_date_key" ON "DailyActivity"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MasterySnapshot_userId_unitId_key" ON "MasterySnapshot"("userId", "unitId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_token_key" ON "DeviceToken"("token");

-- CreateIndex
CREATE INDEX "DeviceToken_userId_disabledAt_idx" ON "DeviceToken"("userId", "disabledAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_userId_createdAt_idx" ON "AnalyticsEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventType_createdAt_idx" ON "AnalyticsEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "AnalyticsEvent"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_expiresAt_idx" ON "EmailVerificationToken"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "AdminAccessLog_adminEmail_createdAt_idx" ON "AdminAccessLog"("adminEmail", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAccessLog_path_createdAt_idx" ON "AdminAccessLog"("path", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptLesson_chapterCode_key" ON "ConceptLesson"("chapterCode");

-- CreateIndex
CREATE INDEX "ConceptLesson_ncertClass_chapterNumber_idx" ON "ConceptLesson"("ncertClass", "chapterNumber");

-- CreateIndex
CREATE INDEX "ConceptLesson_unitId_idx" ON "ConceptLesson"("unitId");

-- CreateIndex
CREATE INDEX "ConceptStep_lessonId_idx" ON "ConceptStep"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptStep_lessonId_stepIndex_key" ON "ConceptStep"("lessonId", "stepIndex");

-- CreateIndex
CREATE INDEX "ConceptProgress_userId_masteredAt_idx" ON "ConceptProgress"("userId", "masteredAt");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptProgress_userId_lessonId_key" ON "ConceptProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "WeeklyReport_tenantId_weekStart_idx" ON "WeeklyReport"("tenantId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReport_userId_isoWeek_key" ON "WeeklyReport"("userId", "isoWeek");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_code_key" ON "Tenant"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Concept_code_key" ON "Concept"("code");

-- CreateIndex
CREATE INDEX "Concept_subject_gradeLevel_idx" ON "Concept"("subject", "gradeLevel");

-- CreateIndex
CREATE INDEX "Concept_parentConceptId_idx" ON "Concept"("parentConceptId");

-- CreateIndex
CREATE INDEX "ProblemConcept_conceptId_idx" ON "ProblemConcept"("conceptId");

-- CreateIndex
CREATE INDEX "MasteryTrajectory_tenantId_masteryScore_idx" ON "MasteryTrajectory"("tenantId", "masteryScore");

-- CreateIndex
CREATE INDEX "MasteryTrajectory_userId_lastAttemptAt_idx" ON "MasteryTrajectory"("userId", "lastAttemptAt");

-- CreateIndex
CREATE UNIQUE INDEX "MasteryTrajectory_userId_conceptId_key" ON "MasteryTrajectory"("userId", "conceptId");

-- CreateIndex
CREATE INDEX "MasteryEvent_userId_conceptId_createdAt_idx" ON "MasteryEvent"("userId", "conceptId", "createdAt");

-- CreateIndex
CREATE INDEX "ErrorPatternProfile_tenantId_status_idx" ON "ErrorPatternProfile"("tenantId", "status");

-- CreateIndex
CREATE INDEX "ErrorPatternProfile_userId_status_idx" ON "ErrorPatternProfile"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ErrorPatternProfile_userId_conceptId_errorCode_key" ON "ErrorPatternProfile"("userId", "conceptId", "errorCode");

-- CreateIndex
CREATE INDEX "LLMAnalysisLog_userId_createdAt_idx" ON "LLMAnalysisLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "LLMAnalysisLog_attemptId_idx" ON "LLMAnalysisLog"("attemptId");

-- CreateIndex
CREATE INDEX "LLMAnalysisLog_promptVersion_modelName_idx" ON "LLMAnalysisLog"("promptVersion", "modelName");

-- CreateIndex
CREATE UNIQUE INDEX "LLMAnalysisJob_attemptId_key" ON "LLMAnalysisJob"("attemptId");

-- CreateIndex
CREATE INDEX "LLMAnalysisJob_status_lastChangedAt_idx" ON "LLMAnalysisJob"("status", "lastChangedAt");

-- CreateIndex
CREATE INDEX "LLMAnalysisJob_userId_status_idx" ON "LLMAnalysisJob"("userId", "status");

-- CreateIndex
CREATE INDEX "LLMAnalysisJob_tenantId_status_idx" ON "LLMAnalysisJob"("tenantId", "status");

-- CreateIndex
CREATE INDEX "RecommendationLog_userId_createdAt_idx" ON "RecommendationLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RecommendationLog_tenantId_createdAt_idx" ON "RecommendationLog"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "RecommendationLog_userId_accepted_solved_idx" ON "RecommendationLog"("userId", "accepted", "solved");

-- CreateIndex
CREATE INDEX "TeacherOverride_userId_createdAt_idx" ON "TeacherOverride"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "TeacherOverride_teacherId_createdAt_idx" ON "TeacherOverride"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "TeacherOverride_tenantId_createdAt_idx" ON "TeacherOverride"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Feedback_targetType_targetId_idx" ON "Feedback"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "Feedback_raterId_createdAt_idx" ON "Feedback"("raterId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentIngestJob_sourceDigest_key" ON "ContentIngestJob"("sourceDigest");

-- CreateIndex
CREATE INDEX "ContentIngestJob_uploadedById_createdAt_idx" ON "ContentIngestJob"("uploadedById", "createdAt");

-- CreateIndex
CREATE INDEX "ContentIngestJob_status_createdAt_idx" ON "ContentIngestJob"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContentIngestJob_sourceType_createdAt_idx" ON "ContentIngestJob"("sourceType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentDraft_publishedProblemId_key" ON "ContentDraft"("publishedProblemId");

-- CreateIndex
CREATE INDEX "ContentDraft_status_createdAt_idx" ON "ContentDraft"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContentDraft_ingestJobId_status_idx" ON "ContentDraft"("ingestJobId", "status");

-- CreateIndex
CREATE INDEX "ContentDraft_conceptLessonId_status_idx" ON "ContentDraft"("conceptLessonId", "status");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubUnit" ADD CONSTRAINT "SubUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_conceptLessonId_fkey" FOREIGN KEY ("conceptLessonId") REFERENCES "ConceptLesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_subUnitId_fkey" FOREIGN KEY ("subUnitId") REFERENCES "SubUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemStep" ADD CONSTRAINT "ProblemStep_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemChoice" ADD CONSTRAINT "ProblemChoice_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "ProblemStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "ProblemChoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "StudySession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_mockExamResultId_fkey" FOREIGN KEY ("mockExamResultId") REFERENCES "MockExamResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrongNote" ADD CONSTRAINT "WrongNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrongNote" ADD CONSTRAINT "WrongNote_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockExamResult" ADD CONSTRAINT "MockExamResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockExamResult" ADD CONSTRAINT "MockExamResult_mockExamId_fkey" FOREIGN KEY ("mockExamId") REFERENCES "MockExam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterySnapshot" ADD CONSTRAINT "MasterySnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterySnapshot" ADD CONSTRAINT "MasterySnapshot_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptLesson" ADD CONSTRAINT "ConceptLesson_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptLesson" ADD CONSTRAINT "ConceptLesson_subUnitId_fkey" FOREIGN KEY ("subUnitId") REFERENCES "SubUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptStep" ADD CONSTRAINT "ConceptStep_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "ConceptLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptProgress" ADD CONSTRAINT "ConceptProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptProgress" ADD CONSTRAINT "ConceptProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "ConceptLesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_parentConceptId_fkey" FOREIGN KEY ("parentConceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemConcept" ADD CONSTRAINT "ProblemConcept_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemConcept" ADD CONSTRAINT "ProblemConcept_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryTrajectory" ADD CONSTRAINT "MasteryTrajectory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryTrajectory" ADD CONSTRAINT "MasteryTrajectory_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryEvent" ADD CONSTRAINT "MasteryEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryEvent" ADD CONSTRAINT "MasteryEvent_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErrorPatternProfile" ADD CONSTRAINT "ErrorPatternProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErrorPatternProfile" ADD CONSTRAINT "ErrorPatternProfile_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LLMAnalysisLog" ADD CONSTRAINT "LLMAnalysisLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LLMAnalysisLog" ADD CONSTRAINT "LLMAnalysisLog_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_recommendedProblemId_fkey" FOREIGN KEY ("recommendedProblemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherOverride" ADD CONSTRAINT "TeacherOverride_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherOverride" ADD CONSTRAINT "TeacherOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentIngestJob" ADD CONSTRAINT "ContentIngestJob_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentDraft" ADD CONSTRAINT "ContentDraft_ingestJobId_fkey" FOREIGN KEY ("ingestJobId") REFERENCES "ContentIngestJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentDraft" ADD CONSTRAINT "ContentDraft_conceptLessonId_fkey" FOREIGN KEY ("conceptLessonId") REFERENCES "ConceptLesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentDraft" ADD CONSTRAINT "ContentDraft_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

