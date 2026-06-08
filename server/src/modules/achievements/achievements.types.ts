import { AchievementKind } from '@prisma/client';

export type AchievementDto = {
  kind: AchievementKind;
  earnedAt: string;
  celebratedAt: string | null;
  metadata: Record<string, unknown> | null;
};

export const ACHIEVEMENT_COPY: Record<AchievementKind, { en: { title: string; body: string }; ko: { title: string; body: string } }> = {
  FIRST_CONCEPT_STEP: {
    en: { title: 'First concept step', body: 'You started your first concept lesson — great first move.' },
    ko: { title: '첫 개념 학습', body: '첫 개념 학습을 시작했어요 — 좋은 출발이에요.' },
  },
  FIRST_PRACTICE_CORRECT: {
    en: { title: 'First correct answer', body: 'You solved a practice problem correctly. Keep the momentum.' },
    ko: { title: '첫 정답', body: '연습 문제를 처음 맞혔어요. 이 기세를 이어가요.' },
  },
  FIRST_WRONGNOTE_MASTERED: {
    en: { title: 'First review mastered', body: 'You cleared a wrong note from your queue.' },
    ko: { title: '첫 오답 정복', body: '오답노트를 처음으로 정복했어요.' },
  },
};