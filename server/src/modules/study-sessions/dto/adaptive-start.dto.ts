import { IsIn, IsOptional, IsString } from 'class-validator';

/**
 * Sprint 2 A9: POST /study-sessions/adaptive/start body.
 *
 *   mode='daily'   → 학생 약점 + 오답 패턴 기반 20문제 (default)
 *   mode='chapter' + chapterCode → 특정 챕터에서만 후보 추출
 *
 * country-agnostic — KR/IN 모두 같은 endpoint. 추천 알고리즘이 user.country
 * 시그널로 Problem 풀을 자동 필터링.
 */
export class AdaptiveStartDto {
  @IsOptional()
  @IsIn(['daily', 'chapter'])
  mode?: 'daily' | 'chapter';

  @IsOptional()
  @IsString()
  chapterCode?: string;
}
