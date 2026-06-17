-- Add Korean localised name on Concept. Back-fill on next ConceptsBootstrap.sync()
-- (which reads NCERT_CHAPTERS.titleKo and upserts both columns).
ALTER TABLE "Concept" ADD COLUMN "nameKo" TEXT;
