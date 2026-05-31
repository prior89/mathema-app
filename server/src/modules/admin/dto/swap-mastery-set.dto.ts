import { IsString, IsUUID } from 'class-validator';

/** Sprint 5 #76 E: swap one problem in a chapter's frozen canonical 20-set.
 *  Index in masterySetProblemIds is preserved so student progress (which
 *  problem-index they're on) stays continuous. */
export class SwapMasterySetDto {
  @IsUUID()
  oldProblemId!: string;

  @IsUUID()
  newProblemId!: string;

  @IsString()
  reason!: string;
}
