/* Source-agnostic normalized types — every adapter (PDF/HTTP/JSON/CSV) emits the same shape. */
import type { ContentIngestStatus, NcertClass } from '@prisma/client';

/// Single problem unit produced by an adapter — consumed as input to the LLM draft step.
export type NormalizedProblem = {
  /// Auto-detected class. If absent, the reviewer must map it.
  ncertClass?: NcertClass;
  /// NCERT chapter number (the LLM infers it when missing).
  chapterNumber?: number;
  /// Best-guess English chapter title (used to enrich LLM input).
  chapterTitleHint?: string;
  /// Source identifier such as "EX5.1".
  exerciseId?: string;
  /// Question number within the same exercise.
  qIndex?: number;
  /// Problem body (cleaned text / LaTeX).
  text: string;
  /// Origin pointer — pageNumber for PDFs, record id for APIs.
  sourceRef?: string;
};

/// Context an adapter uses to update the in-flight ContentIngestJob.
export type IngestContext = {
  updateStatus: (status: ContentIngestStatus, partial?: Partial<JobMetrics>) => Promise<void>;
  setIndex: (json: unknown) => Promise<void>;
};

export type JobMetrics = {
  totalItems: number;
  extractedExercises: number;
  extractedProblems: number;
  draftsCreated: number;
  detectedClasses: string[];
};

/// Per-source config objects. Each adapter only cares about its own type.
export type SourceConfig =
  | { type: 'PDF'; fileName: string; fileSize: number; sha256: string; filePath: string }
  | { type: 'HTTP_API'; url: string; method?: 'GET' | 'POST'; authRef?: string; queryJson?: string; bodyJson?: string }
  | { type: 'JSON_BULK'; filePath: string }
  | { type: 'CSV'; filePath: string; delimiter?: string };
