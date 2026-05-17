import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ChapterTestDto {
  @IsOptional()
  @IsInt()
  @Min(7)
  @Max(12)
  classLevel?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  chapterCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  chapter?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  questionCount?: number;
}

export class WeeklyAssessmentDto {
  @IsOptional()
  @IsInt()
  @Min(7)
  @Max(12)
  classLevel?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(40)
  questionCount?: number;
}
