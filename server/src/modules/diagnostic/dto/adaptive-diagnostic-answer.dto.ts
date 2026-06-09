import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DiagnosticAnswerDto } from './diagnostic-answer.dto';

export class AdaptiveDiagnosticAnswerDto extends DiagnosticAnswerDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  durationSec?: number;
}