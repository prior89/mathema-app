import { IsBoolean, IsDateString, IsEmail, IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { GRADE_LEVELS, GradeLevel } from '../../../common/enums/unit.enum';

export const USER_ROLES = ['STUDENT', 'PARENT', 'TEACHER'] as const;
export type RegisterRole = (typeof USER_ROLES)[number];

export const STUDY_GOALS = ['BOARD', 'JEE', 'SCHOOL', 'CATCHUP'] as const;
export type StudyGoal = (typeof STUDY_GOALS)[number];

export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsString() name!: string;

  /**
   * 명세서 §1 — 역할별 분기.
   *   STUDENT: 본인 학습용 (default).
   *   PARENT : 자녀 학습 모니터링 (childEmail 필요 — 자녀가 먼저 가입돼있어야 매칭).
   *   TEACHER: 학원·교사 (tenantCode 로 기관에 합류, 없으면 solo 교사).
   *   ADMIN  은 일반 회원가입에서 발급되지 않음 — 운영자 수동 부여만.
   */
  @IsOptional() @IsString() @IsIn(USER_ROLES as unknown as string[])
  role?: RegisterRole;

  /** PARENT 일 때만 사용. 자녀(이미 가입한 STUDENT)의 이메일. */
  @IsOptional() @IsEmail() childEmail?: string;

  /** TEACHER 일 때만 사용. 학원/기관 코드 (Tenant.code). 없으면 solo 교사. */
  @IsOptional() @IsString() tenantCode?: string;

  // ─── STUDENT 만 의미 — PARENT/TEACHER 일 때는 무시 ─────────────
  @IsOptional() @IsDateString() examDate?: string;
  @IsOptional() @IsInt() @Min(1) @Max(9) targetGrade?: number;
  @IsOptional() @IsString() @IsIn(GRADE_LEVELS as unknown as string[])
  gradeLevel?: GradeLevel;
  @IsOptional() @IsString() @IsIn(STUDY_GOALS as unknown as string[])
  studyGoal?: StudyGoal;

  // DPDP/GDPR 선택 동의 (필수 동의 DATA_PROCESSING 는 가입 자체로 간주 — 별도 필드 X)
  @IsOptional() @IsBoolean() consentAnalytics?: boolean;
  @IsOptional() @IsBoolean() consentMarketing?: boolean;
  @IsOptional() @IsBoolean() consentAiTraining?: boolean;
}
