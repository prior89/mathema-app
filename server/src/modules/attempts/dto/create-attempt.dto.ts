/**
 * P1-5 / DTO for POST /attempts.
 *
 * AttemptsController previously took @Body() body: any, so the global
 * ValidationPipe had nothing to validate. Any client could send arbitrary
 * shapes -- including a number where stepIndex 1..3 is expected, a 1MB
 * `answer` string, or unknown context values that the downstream grading
 * logic mishandles.
 *
 * Field choices mirror the shape AttemptsRepository.create() actually reads.
 * Anything not declared here is stripped by ValidationPipe whitelist mode.
 */
import {
  IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max,
  MaxLength, Min,
} from 'class-validator';
import { SessionContext } from '../../../common/enums/session-context.enum';

export class CreateAttemptDto {
  // Problem.id is a non-UUID string in the seed data ("C11-CH01-Q1" etc.),
  // so we only enforce non-empty string + reasonable max length. choiceId
  // and studySessionId remain proper UUIDs.
  @IsString()
  @MaxLength(128)
  problemId!: string;

  @IsOptional()
  @IsUUID()
  choiceId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  answer?: string;

  /** 1..3 for multi-step problems; absent for single-shot. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  stepIndex?: number;

  /** 0..3600s (1h hard cap; longer attempts are clamped server-side anyway). */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3600)
  durationSec?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  responseTimeMs?: number;

  /** 0..100 user-supplied confidence pre-submit (UI sometimes asks). */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  confidence?: number;

  /** 1..5 Likert self-confidence after solving. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  selfConfidenceScore?: number;

  @IsOptional()
  @IsBoolean()
  hintUsed?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  hintCount?: number;

  /** Free-form scratch-pad steps -- capped at 32 entries x 512 chars each. */
  @IsOptional()
  @IsArray()
  stepByStepInput?: unknown[];

  @IsOptional()
  @IsString()
  @MaxLength(16) // 'android' | 'ios' | 'web' — enum check happens in repo
  deviceType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  timeOfDay?: number;

  @IsOptional()
  @IsEnum(SessionContext)
  context?: SessionContext;

  @IsOptional()
  @IsUUID()
  studySessionId?: string;

  // mockExamResultId is intentionally not part of the public /attempts DTO.
  // Exam attempts must go through /mock-exams/results/:id/* so ownership,
  // offered-problem membership, duplicate and finalized-state checks run.
}
