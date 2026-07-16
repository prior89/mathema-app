import { TeacherOverrideTargetType } from '@prisma/client';
import {
  IsEnum,
  IsObject,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Public HTTP contract; target-specific fields are also validated by the service. */
export class ApplyTeacherOverrideDto {
  @IsUUID()
  studentUserId!: string;

  @IsEnum(TeacherOverrideTargetType)
  targetType!: TeacherOverrideTargetType;

  @IsUUID()
  targetId!: string;

  @IsObject()
  afterValue!: Record<string, unknown>;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  reason!: string;
}
