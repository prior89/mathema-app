import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CheckWrongNoteDto {
  @IsString()
  @MaxLength(2048)
  answer!: string;

  /** Clamped to [1, 600] server-side anyway, but reject obviously bogus values early. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3600)
  durationSec?: number;
}
