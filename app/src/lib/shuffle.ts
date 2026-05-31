/**
 * Choice randomization — 보기 위치 셔플 유틸.
 *
 * 시드 파일들이 일관적으로 정답을 A 자리에 배치하는 경향이 있어
 * 학생이 "항상 1번"같은 패턴을 외울 수 있는 위험을 피하려고, 렌더링 시점에
 * 보기 배열을 Fisher-Yates 로 셔플한다.
 *
 * 정책:
 *   - 같은 문제 (= 같은 choice id 집합) 보는 동안은 순서 고정 — 오답 후
 *     다시 시도하거나 화면 재렌더가 일어나도 보기가 흔들리지 않음.
 *   - 다음 문제로 넘어가면 (choice id 집합이 바뀌면) 새로 셔플.
 *   - 페이지를 떠났다 다시 들어오면 (컴포넌트 mount) useMemo 가 새로 호출
 *     되며 새 순서가 나옴 — 같은 문제를 두 번 풀 때 위치가 같지 않게 함.
 *
 * Grading 안전성: 백엔드 채점은 choice.id (UUID) 기반이므로 순서 셔플과
 * 무관함. isCorrect 등 필드는 각 choice 객체에 그대로 따라감.
 */
import { useMemo } from 'react';

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Choice 배열을 stable 한 키 (choice id concat) 기준으로 셔플해 메모이즈.
 *  같은 문제 보는 동안 순서 유지, 새 문제로 넘어가면 자동 재셔플. */
export function useShuffledChoices<T extends { id: string }>(choices: T[]): T[] {
  // deps 키: choice id 집합. 같은 집합이면 같은 셔플 결과 유지.
  // 새 문제 → 새 id 집합 → useMemo 재계산 → 새 셔플.
  const key = choices.map((c) => c.id).join(',');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => shuffle(choices), [key]);
}
