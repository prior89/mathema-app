import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class DiagnosticAnswerDto {
  @IsUUID()
  sessionId!: string;

  @IsString()
  @MaxLength(128)
  problemId!: string;

  @IsUUID()
  choiceId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  confidence?: number;
}
