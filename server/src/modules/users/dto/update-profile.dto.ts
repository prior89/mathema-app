import { IsIn, IsOptional, IsString } from 'class-validator';
import { GRADE_LEVELS, GradeLevel } from '../../../common/enums/unit.enum';
import { STUDY_GOALS, StudyGoal } from '../../auth/dto/register.dto';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() @IsIn(GRADE_LEVELS as unknown as string[])
  gradeLevel?: GradeLevel;
  @IsOptional() @IsString() @IsIn(STUDY_GOALS as unknown as string[])
  studyGoal?: StudyGoal;
}
