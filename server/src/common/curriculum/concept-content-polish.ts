import type { ConceptChapterContent } from './concept-content';
import type { KoreanConceptChapterContent } from './concept-content-ko';

export const CONCEPT_CONTENT_POLISH_VERSION = 'concept-polish-v2';

const KO_WHY = /때문에|이유|왜냐하면|왜\s*실패|모델|의미/i;
const EN_WHY = /because|why|this works|model|meaning/i;
const KO_FOUR_PARTS = [
  /오답\s*이름|오개념|오류|착각|혼동/i,
  /왜\s*(실패|틀|혼동)|실패하나|맞지 않|때문에/i,
  /대신|올바른|정답 접근/i,
  /다음에는|다음\s*단계|확인|점검/i,
];
const EN_FOUR_PARTS = [
  /misconception\s*name|misconception|error|confusion/i,
  /why\s*this\s*fails|fails|because|does not|doesn't|not preserve/i,
  /correct\s*contrast|instead|correct|safer move/i,
  /next\s*step|next time|check|hint|repair|before choosing/i,
];

export function polishConceptChapterContent(content: ConceptChapterContent): ConceptChapterContent {
  return {
    ...content,
    abstract: {
      ...content.abstract,
      ko: polishAbstractKo(content.abstract.ko),
      en: polishAbstractEn(content.abstract.en),
    },
    worked: {
      ...content.worked,
      steps: content.worked.steps.map((s) => ({
        ...s,
        narrationKo: polishNarrationKo(s.narrationKo),
        narrationEn: polishNarrationEn(s.narrationEn),
      })),
    },
    misconception: content.misconception
      ? {
          ...content.misconception,
          whyKo: polishWhyKo(content.misconception.whyKo, content.misconception.correctKo, content.misconception.wrongKo),
          whyEn: polishWhyEn(content.misconception.whyEn, content.misconception.correctEn, content.misconception.wrongEn),
          correctKo: polishCorrectKo(content.misconception.correctKo),
          correctEn: polishCorrectEn(content.misconception.correctEn),
        }
      : content.misconception,
  };
}

export function polishKoreanConceptChapterContent(content: KoreanConceptChapterContent): KoreanConceptChapterContent {
  return {
    ...content,
    abstract: polishAbstractKo(content.abstract),
    worked: {
      ...content.worked,
      steps: content.worked.steps.map((s) => ({
        ...s,
        narration: polishNarrationKo(s.narration),
      })),
    },
    misconception: content.misconception
      ? {
          ...content.misconception,
          why: polishWhyKo(content.misconception.why, content.misconception.correct, content.misconception.wrong),
          correct: polishCorrectKo(content.misconception.correct),
        }
      : content.misconception,
  };
}

export function polishWhyKo(why: string, correct: string, wrong?: string): string {
  if (why.length >= 120 && hasAllParts(why, KO_FOUR_PARTS)) return why;
  const label = compact(wrong || why || '개념 적용 오류', 36);
  const failure = trimSentence(why || '선택한 풀이가 문제 조건과 맞지 않습니다');
  const contrast = trimSentence(correct || '문제 조건을 먼저 확인한 뒤 정의나 공식을 적용해야 합니다');
  return `오답 이름: ${label}. 왜 실패하나: ${failure}. 그래서 이 문제의 조건이나 계산 흐름을 끝까지 보존하지 못합니다. 계산 결과만 맞춰 보면 이런 조건 차이를 놓치기 쉽습니다. 대신 ${contrast}. 다음에는 선택한 식이 문제 조건의 어느 줄에서 나오는지 한 문장으로 확인하세요.`;
}

export function polishWhyEn(why: string, correct: string, wrong?: string): string {
  if (why.length >= 120 && hasAllParts(why, EN_FOUR_PARTS)) return why;
  const label = compact(wrong || why || 'concept application error', 42);
  const failure = trimSentence(why || 'the chosen reasoning does not match the condition in the problem');
  const contrast = trimSentence(correct || 'start from the condition, then apply the definition or formula');
  return `Misconception name: ${label}. Why this fails: ${failure}, so the reasoning does not preserve the exact condition or quantity in this problem. Correct contrast: ${contrast}; the safer move is to connect the symbol to the condition before calculating. Next step: write which condition justifies the chosen formula before selecting an answer.`;
}

export function polishCorrectKo(correct: string): string {
  if (correct.length >= 80 && KO_WHY.test(correct)) return correct;
  const body = trimSentence(correct || '문제 조건을 먼저 확인한 뒤 정의나 공식을 적용합니다');
  return `올바른 접근: ${body}. 이 방법이 더 안전한 이유는 계산 절차가 문제 조건에서 직접 출발해 중간에 임의의 추측을 넣지 않기 때문입니다. 다음에는 답을 고르기 전에 식의 각 항이 어떤 조건에서 왔는지 표시하세요.`;
}

export function polishCorrectEn(correct: string): string {
  if (correct.length >= 80 && EN_WHY.test(correct)) return correct;
  const body = trimSentence(correct || 'start from the condition, then apply the definition or formula');
  return `The correct approach is ${body}. This is safer because each step comes from the given condition instead of from a memorized-looking pattern. Next time, mark which condition justifies each term before choosing the answer.`;
}

function polishAbstractKo(text: string): string {
  if (KO_WHY.test(text) && text.length >= 80) return text;
  return `${trimSentence(text)}. 이 관점이 필요한 이유는 공식을 외운 모양으로만 쓰지 않고, 기호가 어떤 조건과 양을 모델링하는지 함께 확인하게 해 주기 때문입니다.`;
}

function polishAbstractEn(text: string): string {
  if (EN_WHY.test(text) && text.length >= 90) return text;
  return `${trimSentence(text)}. This matters because it links the symbol or formula to the condition it models, rather than treating the rule as a memorized shape.`;
}

function polishNarrationKo(text: string): string {
  if (KO_WHY.test(text) && text.length >= 45) return text;
  return `${trimSentence(text)}. 이 단계가 필요한 이유는 이전 줄과 같은 값을 유지하면서 다음 계산으로 넘어가기 위해서입니다.`;
}

function polishNarrationEn(text: string): string {
  if (EN_WHY.test(text) && text.length >= 55) return text;
  return `${trimSentence(text)}. This step matters because it preserves the same quantity while moving to the next calculation.`;
}

function trimSentence(text: string): string {
  return text.trim().replace(/[.。!?？！]\s*$/, '');
}

function compact(text: string, max: number): string {
  const oneLine = trimSentence(text).replace(/\s+/g, ' ');
  return oneLine.length <= max ? oneLine : `${oneLine.slice(0, max - 1)}…`;
}

function hasAllParts(text: string, patterns: RegExp[]): boolean {
  return patterns.every((pattern) => pattern.test(text));
}
