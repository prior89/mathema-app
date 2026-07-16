import { IsBoolean, IsDateString, IsEmail, IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { GRADE_LEVELS, GradeLevel } from '../../../common/enums/unit.enum';

// Public registration is intentionally limited to students and the existing
// parent-to-child approval flow. Teacher/admin accounts require a verified
// invitation and must never be created by POST /auth/register.
export const USER_ROLES = ['STUDENT', 'PARENT'] as const;
export type RegisterRole = (typeof USER_ROLES)[number];

export const STUDY_GOALS = ['BOARD', 'JEE', 'SCHOOL', 'CATCHUP'] as const;
export type StudyGoal = (typeof STUDY_GOALS)[number];

// Mirrors prisma `CountryCode` enum. Drives curriculum (NCERT vs Korean 2022
// 개정), locale default, currency display. Active markets IN + KR + AE; other
// entries kept compiled but hidden from the onboarding chip UI until launch.
export const COUNTRY_CODES = ['IN', 'KR', 'US', 'UK', 'AU', 'SG', 'AE', 'ID', 'GLOBAL'] as const;
export type CountryCode = (typeof COUNTRY_CODES)[number];

export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsString() name!: string;

  /**
   * 명세서 §1 — 역할별 분기.
   *   STUDENT: 본인 학습용 (default).
   *   PARENT : 자녀 학습 모니터링 (childEmail 필요 — 자녀가 먼저 가입돼있어야 매칭).
   *   TEACHER / ADMIN: verified invite or operator provisioning only; never
   *                    accepted by this public DTO.
   */
  @IsOptional() @IsString() @IsIn(USER_ROLES as unknown as string[])
  role?: RegisterRole;

  /** PARENT 일 때만 사용. 자녀(이미 가입한 STUDENT)의 이메일. */
  @IsOptional() @IsEmail() childEmail?: string;

  /** Country selection from the onboarding country chip. Drives curriculum
   *  (IN→NCERT, KR→Korean 2022 개정), locale auto-flip (KR→ko), currency.
   *  Optional for backward compat — defaults to 'IN' if omitted. */
  @IsOptional() @IsString() @IsIn(COUNTRY_CODES as unknown as string[])
  country?: CountryCode;

  // ─── STUDENT 만 의미 — PARENT 일 때는 무시 ─────────────
  /** Approximate birth date from self-reported age — country-aware guardian email gate. */
  @IsOptional() @IsDateString() birthDate?: string;
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

  /** Minor student signup — parent/guardian contact (email verification link). */
  @IsOptional() @IsString() @MinLength(2) parentName?: string;
  @IsOptional() @IsEmail() parentEmail?: string;
  @IsOptional() @IsString() parentPhone?: string;
}
