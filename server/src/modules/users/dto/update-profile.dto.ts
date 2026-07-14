import { IsBoolean, IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { GRADE_LEVELS, GradeLevel } from '../../../common/enums/unit.enum';
import { STUDY_GOALS, StudyGoal } from '../../auth/dto/register.dto';

/** Launch markets — planned curricula must never be selectable by clients. */
const PATCHABLE_COUNTRIES = ['KR'] as const;
export type PatchableCountry = (typeof PATCHABLE_COUNTRIES)[number];

const PATCHABLE_ROLES = ['STUDENT', 'PARENT', 'TEACHER'] as const;
export type PatchableUserRole = (typeof PATCHABLE_ROLES)[number];

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() @IsIn(GRADE_LEVELS as unknown as string[])
  gradeLevel?: GradeLevel;
  @IsOptional() @IsString() @IsIn(STUDY_GOALS as unknown as string[])
  studyGoal?: StudyGoal;
  @IsOptional() @IsString() @IsIn(PATCHABLE_ROLES as unknown as string[])
  role?: PatchableUserRole;
  @IsOptional() @IsBoolean()
  pushRemindersEnabled?: boolean;
  /** Set once at onboarding — used for minor guardian consent gating. */
  @IsOptional() @IsDateString() birthDate?: string;
  /** Curriculum + guardian threshold market (KR-only launch). */
  @IsOptional() @IsString() @IsIn(PATCHABLE_COUNTRIES as unknown as string[])
  country?: PatchableCountry;
}
