import { IsArray } from 'class-validator';

/** Full-paper batch submit (REAL exams) — one final choice per problem. */
export class SubmitPaperDto {
  @IsArray() answers!: Array<{
    problemId: string;
    choiceId: string;
    durationSec: number;
  }>;
}
