/**
 * Problem difficulty. KO labels are neutral terms mirroring DIFFICULTY_EN
 * (Easy/Medium/Hard/Challenging) — Korean exam slang ("준킬러"/"킬러") was
 * removed per user feedback 2026-06-13.
 */
export enum Difficulty {
  MIDDLE = 'MIDDLE',
  UPPER_MIDDLE = 'UPPER_MIDDLE',
  SEMI_KILLER = 'SEMI_KILLER',
  KILLER = 'KILLER',
}

export const DIFFICULTY_LABEL_KO: Record<Difficulty, string> = {
  [Difficulty.MIDDLE]: '쉬움',
  [Difficulty.UPPER_MIDDLE]: '보통',
  [Difficulty.SEMI_KILLER]: '어려움',
  [Difficulty.KILLER]: '도전',
};
