import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class SolveMathHelperDto {
  @IsOptional()
  @IsInt()
  @Min(7)
  @Max(12)
  classLevel?: number;

  @IsString()
  @MinLength(3)
  @MaxLength(4000)
  question!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  studentAnswer?: string;

  /** Wall-clock seconds the client thinks the user spent before submitting.
   *  Server clamps to [5, 600] to keep DailyActivity.durationMin honest. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(7200)
  durationSec?: number;
}
