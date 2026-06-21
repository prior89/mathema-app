/* Source-agnostic normalized types — every adapter (PDF/HTTP/JSON/CSV) emits the same shape. */
import type { ContentIngestStatus, ErrorCode, NcertClass } from '@prisma/client';

/// Distractor as ingested from external sources (rich NCERT JSON format).
/// Maps to ProblemChoice + LLMAnalysisLog reasoning when published.
export type NormalizedDistractor = {
  answer: string;
  errorCode: ErrorCode;
  reason: string;
};

/// Single problem unit produced by an adapter — consumed as input to the LLM draft step.
/// Minimal viable shape: { text }. All other fields are best-effort enrichment.
/// Rich NCERT JSON adapters can populate the optional fields; bare PDF text extraction
/// will fill only the basics and let LlmDraftService synthesize the rest.
export type NormalizedProblem = {
  /// Stable external identifier (e.g. "NCERT-C7-CH01-EX1.1-Q1"). Use for dedup + provenance.
  problemKey?: string;
  /// Auto-detected class. If absent, the reviewer must map it.
  ncertClass?: NcertClass;
  /// NCERT chapter number (the LLM infers it when missing).
  chapterNumber?: number;
  /// Curriculum chapter code (e.g. "C7-CH01-INTEGERS"). Links to taxonomy.
  chapterCode?: string;
  /// Best-guess English chapter title (used to enrich LLM input).
  chapterTitleHint?: string;
  /// Curriculum topic code (e.g. "C7-CH01-T01").
  topicCode?: string;
  /// Source identifier such as "EX5.1".
  exerciseId?: string;
  /// Question number within the same exercise.
  qIndex?: number;
  /// Problem body (cleaned text / LaTeX).
  text: string;
  /// Free-response / MCQ / assertion-reason / numerical etc. (NCERT vocabulary).
  questionType?: 'FREE_RESPONSE' | 'MCQ' | 'ASSERTION_REASON' | 'NUMERICAL' | 'SUBJECTIVE';
  /// Canonical correct answer.
  correctAnswer?: string;
  /// Alternate accepted answers (e.g. different ordering, fractional forms).
  acceptedAnswers?: string[];
  /// 1 (easiest) – 5 (killer). LlmDraftService can refine.
  difficultyLevel?: 1 | 2 | 3 | 4 | 5;
  /// Estimated solving time in seconds.
  estimatedTimeSec?: number;
  /// Concept codes from curriculum.json (e.g. ["C7_INT_NUMBER_LINE"]).
  conceptCodes?: string[];
  /// Required skills (e.g. ["compare_integers"]).
  requiredSkills?: string[];
  /// Canonical solution steps (used by LLM to seed PROCESS step distractors).
  expectedSolutionSteps?: string[];
  /// Tiered hints (used by Wrong Note + AI Coach).
  hints?: string[];
  /// Misconception error codes attached to this problem.
  commonErrorCodes?: ErrorCode[];
  /// Pre-curated distractors with errorCode mapping (rich ingest format).
  /// When present, LlmDraftService preserves these instead of inventing new ones.
  distractors?: NormalizedDistractor[];
  /// Final answer of the solution (canonical).
  solutionFinalAnswer?: string;
  /// Worked solution steps.
  solutionSteps?: string[];
  /// One-paragraph rationale.
  solutionExplanation?: string;
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
