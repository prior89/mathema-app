-- Internal key/value store for bootstrap sync state.
-- First consumer: ConceptLessonsBootstrap stores a stable content hash here
-- so re-syncs only run when the seed actually changed.
CREATE TABLE "SystemMetadata" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemMetadata_pkey" PRIMARY KEY ("key")
);
