import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CompleteStepDto {
  @IsInt()
  @Min(0)
  @Max(20)
  stepIndex!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3600)
  durationSec?: number;
}

export class CheckRetrievalDto {
  @IsInt()
  @Min(0)
  @Max(20)
  stepIndex!: number;

  @IsString()
  @MaxLength(2048)
  answer!: string;
}

export class FinalizeConceptDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3600)
  durationSec?: number;
}
