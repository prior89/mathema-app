import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Difficulty, ErrorCode } from '@prisma/client';

/** One choice (5 options per problem). errorCode + rationale required on wrong, null on correct. */
export class KoreanStudyOptionDto {
  @IsString() @MinLength(1) @MaxLength(500)
  text!: string;

  @IsBoolean()
  isCorrect!: boolean;

  @IsOptional() @IsIn(Object.values(ErrorCode))
  errorCode?: ErrorCode | null;

  @IsOptional() @IsString() @MaxLength(500)
  rationale?: string | null;
}

/** POST /admin/korean-study-problems — author one single-step KR Study problem
 *  for a given KoreanConceptLesson. */
export class CreateKoreanStudyProblemDto {
  /** KoreanConceptLesson.chapterCode (e.g. "K-G7-MATH1-CH02-INTEGERS"). */
  @IsString() @MinLength(1)
  chapterCode!: string;

  @IsIn(Object.values(Difficulty))
  difficulty!: Difficulty;

  @IsInt() @Min(1) @Max(5)
  difficultyLevel!: number;

  @IsString() @MinLength(1) @MaxLength(2000)
  stem!: string;

  @IsString() @MinLength(1) @MaxLength(200)
  concept!: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  requiredSkills?: string[];

  @IsString() @MinLength(1) @MaxLength(2000)
  solution!: string;

  /** Exactly 5 options, exactly 1 isCorrect=true. */
  @IsArray() @ArrayMinSize(5) @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => KoreanStudyOptionDto)
  options!: KoreanStudyOptionDto[];
}
