import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { PROBLEM_EN, STEP_PROMPT_EN, CHOICE_EN, SOURCE_EN, HINT_EN, CONCEPT_EN, FORMULA_EN } from '../../common/i18n/content-en';

/**
 * 학습/응시 시 클라이언트로 전달할 때는 isCorrect/distractorType/rationale은 숨겨야 함.
 * Problem 객체에는 정답 답안 문자열도 포함되므로 fetch 시점에 sanitize.
 *
 * EN 모드 시 body/prompt/choice text를 영문 사전으로 치환.
 *
 * 매 요청마다 보기 순서를 무작위로 섞어 정답이 항상 1번에 오는 패턴을 방지.
 * choiceIndex(DB 식별자)는 그대로 두고 배열 순서만 셔플 — 클라이언트는 배열 순으로 1~5 번호 표시.
 */
const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const sanitizeForClient = (p: any, lang: Lang = 'en') => {
  if (!p) return p;
  const { answer, ...rest } = p;
  if (lang !== 'ko') {
    const en = PROBLEM_EN[p.source];
    if (en) rest.body = en.body;
    if (SOURCE_EN[p.source]) rest.source = SOURCE_EN[p.source];
    if (rest.hint && HINT_EN[rest.hint]) rest.hint = HINT_EN[rest.hint];
    if (CONCEPT_EN[p.source]) rest.concept = CONCEPT_EN[p.source];
    if (FORMULA_EN[p.source]) rest.formula = FORMULA_EN[p.source];
  }
  if (Array.isArray(rest.steps)) {
    rest.steps = rest.steps.map((s: any) => {
      const promptKey = `${p.source}:${s.stepIndex}`;
      const promptEn = STEP_PROMPT_EN[promptKey];
      const choices = (s.choices ?? []).map((c: any) => {
        const choiceKey = `${p.source}:${s.stepIndex}:${c.choiceIndex}`;
        const choiceEn = CHOICE_EN[choiceKey];
        return {
          id: c.id, choiceIndex: c.choiceIndex,
          text: lang !== 'ko' && choiceEn ? choiceEn.text : c.text,
        };
      });
      return {
        id: s.id, stepIndex: s.stepIndex, stepType: s.stepType,
        prompt: lang !== 'ko' && promptEn ? promptEn : s.prompt,
        choices: shuffle(choices),
      };
    });
  }
  return rest;
};

const PAGE_SIZE_DEFAULT = 100;
const PAGE_SIZE_MAX = 200;

@Injectable()
export class ProblemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Slim picker shape on purpose: the old include pulled every step + choice
  // for the whole pool (~17.6MB). Full content stays behind /problems/:id.
  async list(q: any, lang: Lang = 'en') {
    const rows = await this.prisma.problem.findMany({
      where: this.buildWhere(q),
      select: { id: true, source: true, difficulty: true, unitId: true },
      orderBy: { createdAt: 'asc' },
      ...this.buildPage(q),
    });
    if (lang === 'ko') return rows;
    return rows.map((p) => (SOURCE_EN[p.source] ? { ...p, source: SOURCE_EN[p.source] } : p));
  }

  private buildPage(q: any): { skip?: number; take?: number } {
    if (q?.page === undefined || q.page === null || q.page === '') return {};
    const page = Math.max(1, Math.floor(Number(q.page)) || 1);
    const sizeRaw = Math.floor(Number(q.pageSize));
    const take = Number.isFinite(sizeRaw) && sizeRaw > 0 ? Math.min(sizeRaw, PAGE_SIZE_MAX) : PAGE_SIZE_DEFAULT;
    return { skip: (page - 1) * take, take };
  }

  async findById(id: string, lang: Lang = 'en') {
    const row = await this.prisma.problem.findUnique({
      where: { id },
      include: { steps: { orderBy: { stepIndex: 'asc' }, include: { choices: { orderBy: { choiceIndex: 'asc' } } } } },
    });
    return sanitizeForClient(row, lang);
  }

  // Returns the cheap "Hint Lv1" payload — formula + concept + the
  // free-form hint. Hint Lv2 (AI walks the solution onto the canvas) goes
  // through a separate /hint-walkthrough endpoint that calls the LLM.
  async findHint(id: string) {
    const p = await this.prisma.problem.findUnique({
      where: { id },
      select: { hint: true, formula: true, concept: true },
    });
    return {
      hint: p?.hint ?? null,
      formula: p?.formula ?? null,
      concept: p?.concept ?? null,
    };
  }

  private buildWhere(q: any) {
    const w: any = {};
    if (q?.unitId) w.unitId = q.unitId;
    if (q?.difficulty) w.difficulty = q.difficulty;
    if (q?.source) w.source = { contains: q.source, mode: 'insensitive' };
    return w;
  }
}

export const _sanitizeForClient = sanitizeForClient;
export { sanitizeForClient };
