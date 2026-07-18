/* LLM Draft Service — raw textbook / uploaded problem text → 3-step MC (CONCEPT / PROCESS / ANSWER) draft.
 *
 * Policy:
 *   - The product rule is "AI does not generate user-facing content", but this is not the student learning flow —
 *     it is the *pre-human-review draft* stage. Content only reaches users after a reviewer promotes the
 *     ContentDraft to APPROVED.
 *   - If the LLM response diverges from the schema, the draft stays PENDING and draftsCreated is not incremented
 *     (a reviewer can re-run it).
 *   - Token and cost tracking → ContentDraft.aiTokensIn/Out/CostUsd.
 */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../../infrastructure/ai/ai.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import type { NormalizedProblem } from './types';

export const DRAFT_PROMPT_VERSION = 'v1.2026-05-13';

/// Raw response shape that the LLM fills in. Maps 1:1 onto ProblemStep + ProblemChoice.
export type DraftChoice = {
  text: string;
  isCorrect: boolean;
  distractorType?: 'CONCEPT_CONFUSION' | 'CALC_ERROR' | 'PROCESS_SKIP' | 'TIME_PRESSURE_GUESS' | null;
  rationale?: string;
};
export type DraftStep = {
  stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER';
  prompt: string;
  choices: DraftChoice[];
};

/**
 * One draft payload covers both Mastery (3-step MC) and Study (single 5-choice
 * MC) — the only difference is `steps.length`. Mastery has [CONCEPT, PROCESS,
 * ANSWER]; Study has just [ANSWER]. Splitting the schema in two would force
 * every downstream consumer (draft-publisher, validation, admin review UI) to
 * branch — keeping a single shape and varying the array length is cheaper.
 */
export type DraftPayload = {
  problemBody: string;
  hint: string;
  concept: string;
  difficulty: 'MIDDLE' | 'UPPER_MIDDLE' | 'SEMI_KILLER' | 'KILLER';
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  expectedTimeSec: number;
  /// Target exam style — set by the caller via generate() opts.examFormat
  /// and echoed back in the payload so draft-publisher can persist it to
  /// Problem.examFormat without re-plumbing the option through.
  examFormat?:
    | 'NCERT_TEXTBOOK' | 'CBSE_BOARD'
    | 'JEE_MAIN' | 'JEE_ADVANCED' | 'NEET'
    | 'KSAT' | 'KR_INTERNAL' | 'KR_MOCK_EVAL';
  steps: DraftStep[]; // length 1 (Study) or 3 (Mastery)
};

export type DraftResult = {
  payload: DraftPayload;
  tokensIn: number;
  tokensOut: number;
  model: string;
};

/**
 * `multi-step` — 3-step CONCEPT/PROCESS/ANSWER (Mastery / ConceptLessonScreen
 *                practice phase). Used for variation problems that probe each
 *                stage of the reasoning.
 * `single-step` — one 5-choice MC + handwriting canvas (Study tab). Solve the
 *                 whole problem at once.
 */
export type DraftMode = 'multi-step' | 'single-step';

export const SYSTEM_PROMPT_MULTI_STEP = `You are an expert Korean math educator transforming Korean middle/high-school math problems into a strict 3-step multiple-choice format for the Matheo learning app.

You MUST return a single JSON object with this exact schema (no markdown, no commentary):

{
  "problemBody": "<the cleaned problem statement, preserving LaTeX where present>",
  "hint": "<one-sentence hint that nudges the student toward the right concept without giving away the answer>",
  "concept": "<one or two sentences naming the key idea/formula the student must apply>",
  "difficulty": "MIDDLE" | "UPPER_MIDDLE" | "SEMI_KILLER" | "KILLER",
  "difficultyLevel": 1-5,
  "expectedTimeSec": integer (60-600),
  "steps": [
    {
      "stepType": "CONCEPT",
      "prompt": "Which concept/formula does this problem require?",
      "choices": [
        { "text": "...", "isCorrect": true,  "distractorType": null,                  "rationale": null },
        { "text": "...", "isCorrect": false, "distractorType": "CONCEPT_CONFUSION",   "rationale": "why a student might pick this" },
        { "text": "...", "isCorrect": false, "distractorType": "PROCESS_SKIP",        "rationale": "..." },
        { "text": "...", "isCorrect": false, "distractorType": "CALC_ERROR",          "rationale": "..." },
        { "text": "...", "isCorrect": false, "distractorType": "TIME_PRESSURE_GUESS", "rationale": "..." }
      ]
    },
    { "stepType": "PROCESS", "prompt": "Which is the correct first procedural step?",   "choices": [ ...5 items same shape... ] },
    { "stepType": "ANSWER",  "prompt": "What is the final answer?",                      "choices": [ ...5 items same shape... ] }
  ]
}

Rules:
- Exactly 5 choices per step. Exactly one isCorrect:true.
- distractorType MUST be one of: CONCEPT_CONFUSION, CALC_ERROR, PROCESS_SKIP, TIME_PRESSURE_GUESS (and null only for the correct choice).
- For EVERY wrong choice, produce a **student-facing elaborated rationale** (2–4 full sentences). Structure: (1) name the specific misconception or error the student is likely making, (2) explain *why this thinking fails in this exact problem/context*, (3) contrast with the correct reasoning ("올바른 생각은..." / "The correct approach is..."), (4) give one actionable next step or re-teach hint. Never write analyst-only notes. The student will read this directly in feedback.
- ANSWER choices must be concrete answers (numbers / expressions). If the source problem's correct answer is ambiguous, choose the mathematically canonical answer and flag the ambiguity in the hint.
- Do not invent problems; faithfully transcribe the input. If the input is broken/unparseable, set every field to "UNCLEAR" and isCorrect:true on the first choice of each step.
- Produce natural Korean for Korean curriculum formats (KSAT/KR_*). If the original source is entirely English, English is acceptable, but never reference foreign curriculum labels in student-facing text.
- Output JSON ONLY. No leading/trailing prose.

Additional rule for high-quality conceptual teaching:
- When the prompt references or generates worked-example style content, ensure narrations use explicit explanatory language ("because...", "this works because...", "to preserve equality / model the real situation...", "prevents the common error of..."). Pure procedural steps ("add the numerators") are insufficient.

Hattie & Timperley feedback layering (apply per wrong choice; do not flatten):
- Process layer: name the strategy the student tried and why it does not fit THIS problem's structure.
- Self-regulation layer: end every rationale with one concrete check the student can run before attempting a similar problem ("Next time: …", "다음에는 …", "Check: …"). One short sentence; no praise, no self-level commentary.
Research caveat (Chi et al. 2024): a generic "explain why" prompt can lower the worked-example benefit. Keep self-regulation hints tightly scoped to the actual error type instead of asking the student to self-explain in general.`;

export const SYSTEM_PROMPT_SINGLE_STEP = `You are an expert Korean math educator generating a single-step multiple-choice question for Matheo Korean middle/high-school students.

Return a single JSON object with this exact schema (no markdown, no commentary):

{
  "problemBody": "<the cleaned problem statement, preserving LaTeX where present>",
  "hint": "<one-sentence hint that nudges the student toward the right concept without giving away the answer>",
  "concept": "<one or two sentences naming the key idea/formula the student must apply>",
  "difficulty": "MIDDLE" | "UPPER_MIDDLE" | "SEMI_KILLER" | "KILLER",
  "difficultyLevel": 1-5,
  "expectedTimeSec": integer (60-600),
  "steps": [
    {
      "stepType": "ANSWER",
      "prompt": "Solve the problem and pick the answer.",
      "choices": [
        { "text": "...", "isCorrect": true,  "distractorType": null,                  "rationale": null },
        { "text": "...", "isCorrect": false, "distractorType": "CONCEPT_CONFUSION",   "rationale": "why a student might pick this" },
        { "text": "...", "isCorrect": false, "distractorType": "PROCESS_SKIP",        "rationale": "..." },
        { "text": "...", "isCorrect": false, "distractorType": "CALC_ERROR",          "rationale": "..." },
        { "text": "...", "isCorrect": false, "distractorType": "TIME_PRESSURE_GUESS", "rationale": "..." }
      ]
    }
  ]
}

Rules:
- Exactly ONE step with stepType="ANSWER". No CONCEPT or PROCESS step — Study tab is for whole-problem practice with a scratch pad, not staged reasoning.
- Exactly 5 choices. Exactly one isCorrect:true.
- distractorType MUST be one of: CONCEPT_CONFUSION, CALC_ERROR, PROCESS_SKIP, TIME_PRESSURE_GUESS (null only for the correct choice).
- For EVERY wrong choice, produce a **student-facing elaborated rationale** (2–4 full sentences). Structure: (1) name the specific misconception or error the student is likely making, (2) explain *why this thinking fails in this exact problem/context*, (3) contrast with the correct reasoning ("올바른 생각은..." / "The correct approach is..."), (4) give one actionable next step or re-teach hint. Never write analyst-only notes. The student will read this directly in feedback.
- The answer choices must be concrete final answers (numbers / expressions / coordinates), not procedural fragments.
- The four distractors must each represent a plausible mistake a real Korean middle/high-school student would make — never random or absurd wrong values.
- Match the requested grade/chapter difficulty band. Do not exceed the chapter's topic boundary.
- Produce natural Korean for Korean curriculum formats. If the original source is entirely English, English is acceptable, but never reference foreign curriculum labels in student-facing text.
- Output JSON ONLY.

Hattie & Timperley feedback layering (apply per wrong choice; do not flatten):
- Process layer: name the strategy the student tried and why it does not fit THIS problem's structure.
- Self-regulation layer: end every rationale with one concrete check the student can run before attempting a similar problem ("Next time: …", "다음에는 …", "Check: …"). One short sentence; no praise, no self-level commentary.
Research caveat (Chi et al. 2024): a generic "explain why" prompt can lower the worked-example benefit. Keep self-regulation hints tightly scoped to the actual error type instead of asking the student to self-explain in general.`;

/**
 * Per-exam-style framing prepended to the LLM prompt. Each line is a short
 * directive the LLM applies on top of the base system prompt. Legacy external
 * textbook formats return a style hint only when explicitly requested; otherwise
 * the base prompts use the Korea-first voice.
 * voice — the hint adds nothing.
 *
 * Calibrated for the 2026-05-22 user spec ([[matheo-ux-spec-full]]):
 *   - Korea: KSAT (수능) + 내신 + 평가원 모의고사 variants
 *   - Legacy external formats: retained only for backward-compatible admin ingest
 *
 * 2026-06-14 Analysis-driven update (see CONTENT_QUALITY_RUBRIC.md):
 * All generated content and rationales must meet the "sufficient" bar for
 * conceptual depth and elaborated, student-facing error feedback.
 */
function examStyleHint(format: DraftPayload['examFormat'] | undefined): string | null {
  if (!format || format === 'NCERT_TEXTBOOK') return null;
  switch (format) {
    case 'CBSE_BOARD':
      return 'Legacy external-board style. Keep student-facing text curriculum-neutral unless a reviewer explicitly requests otherwise.';
    case 'JEE_MAIN':
      return 'Legacy competitive-exam style. Concise numerical / single-correct MCQ. Avoid foreign curriculum labels in student-facing text.';
    case 'JEE_ADVANCED':
      return 'Legacy advanced-exam style. Multi-concept fusion where appropriate. Avoid foreign curriculum labels in student-facing text.';
    case 'NEET':
      return 'Authoring style: NEET. Bias toward formula-recall and direct application. Distractors should target unit-conversion slips, sign flips, and trigonometric-identity confusions common in biology-bound students with weaker math fluency.';
    case 'KSAT':
      return 'Authoring style: 한국 수능 수학 영역. 5지선다, 정답 1개. 객관식 풀이 시간 ~3분 가정. 4개 오답은 (i) 개념 혼동, (ii) 부호·차원 실수, (iii) 풀이 중간 단계 누락, (iv) 흔한 함정 (예: 정의역 누락) 패턴을 각각 반영. 2022 개정 특화: 증명 가정 오류, 그래프에서 변화 의미 오해, skewed 데이터에서 평균/중앙값 혼동, 함수 그래프 x/y 좌표 스왑 등을 적극 반영.';
    case 'KR_INTERNAL':
      return 'Authoring style: 한국 고교 내신. 교과서 예제 / 평가 기준에 충실. 풀이 길이 4~6줄, 단답 친화. 오답은 교사가 흔히 보는 풀이 실수 (계산 오류, 공식 적용 오류) 위주. 2022 개정: 증명 없이 성질 사용, 대푯값/중앙값 혼동, 변화와 관계에서 그래프 해석 오류 등을 명시적으로 다룰 것.';
    case 'KR_MOCK_EVAL':
      return 'Authoring style: 한국 평가원 모의고사 (3월·6월·9월). 수능 형식과 동일하나 신유형 1개 포함 권장. 오답은 EBS 빈출 함정 + 평가원 특유 비주얼 트릭 (좌표·그래프 오독) 반영. 2022 개정 signature misconceptions (증명 가정, 함수 변화, 통계 대표값, 좌표 혼동 등)을 1개 이상 포함.';
    default:
      return null;
  }
}

@Injectable()
export class LlmDraftService {
  private readonly logger = new Logger(LlmDraftService.name);
  /** Daily per-user cap on LLM problem generations (Mastery + Study combined). */
  private static readonly DAILY_CAP = 100;

  constructor(
    private readonly ai: AiService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  async generate(
    input: {
      ncertClass?: string;
      chapterNumber?: number;
      chapterTitleHint?: string;
      exerciseId?: string;
      qIndex?: number;
      text: string;
    },
    opts: { mode?: DraftMode; userId?: string | null; examFormat?: DraftPayload['examFormat'] } = {},
  ): Promise<DraftResult> {
    const mode: DraftMode = opts.mode ?? 'multi-step';

    // Per-user daily quota — guards against a single account hot-looping
    // LLM cost into the floor. userId === null/undefined bypasses the
    // check (admin scripts like prewarm-mastery, content-ingest admin
    // imports). On a real student session the caller passes the JWT user
    // id and over-cap requests get a 429.
    if (opts.userId) {
      const today = new Date().toISOString().slice(0, 10);
      const key = `llm:gen:daily:${opts.userId}:${today}`;
      const after = await this.redis.incrWithTtl(key, 24 * 3600);
      if (after > LlmDraftService.DAILY_CAP) {
        this.logger.warn(`LLM quota exceeded user=${opts.userId} count=${after}`);
        throw new HttpException(
          {
            message: `Daily AI generation quota reached (${LlmDraftService.DAILY_CAP}/day). The pool refreshes at 00:00 UTC.`,
            quota: LlmDraftService.DAILY_CAP,
            used: after,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
    const ctxLine = [
      input.ncertClass ? `Class: ${input.ncertClass}` : null,
      input.chapterNumber ? `Chapter: ${input.chapterNumber}` : null,
      input.chapterTitleHint ? `Chapter title: ${input.chapterTitleHint}` : null,
      input.exerciseId ? `Exercise: ${input.exerciseId}` : null,
      input.qIndex ? `Q: ${input.qIndex}` : null,
    ].filter(Boolean).join(' · ');

    // Per-exam-style framing — appended to the system prompt so the LLM
    // shapes vocabulary, distractor flavour, and difficulty calibration to
    // match the target exam culture. Empty for NCERT_TEXTBOOK (the default,
    // which already matches the base system prompt).
    const styleHint = examStyleHint(opts.examFormat);

    const prompt = `${ctxLine ? ctxLine + '\n\n' : ''}${styleHint ? styleHint + '\n\n' : ''}Source problem:\n"""\n${input.text}\n"""\n\nReturn the strict JSON draft now.`;

    // The base prompts target NCERT/English. A Korean source problem (KR AI-solve
    // uploads) must yield Korean student-facing strings, or the practice step /
    // wrong-answer rationale comes back in English for a Korean student.
    const koreanSource = /[가-힣]/.test(input.text);
    const system =
      (mode === 'multi-step' ? SYSTEM_PROMPT_MULTI_STEP : SYSTEM_PROMPT_SINGLE_STEP) +
      (koreanSource
        ? '\n\nThe source problem is KOREAN: write ALL student-facing strings (prompt, choice text, rationale, hint, concept) in natural Korean. JSON keys and LaTeX notation stay unchanged.'
        : '');
    // Single-step payload is ~1/3 the token budget of multi-step.
    const maxTokens = mode === 'multi-step' ? 4000 : 1500;

    // Temperature 0.4 trades a little determinism for measurably more
    // variety across same-prompt batches — the 0.2 default produced near-
    // identical questions in 5-way parallel prewarms (370 exact-body
    // duplicates discovered post-mortem). 0.4 keeps schema compliance
    // (parseAndValidate still passes virtually 100% of payloads) while
    // shifting wording, numeric values and distractor choices enough that
    // the dedupe pass no longer finds collisions on the same chapter.
    const res = await this.ai.generateText({
      prompt,
      system,
      maxTokens,
      temperature: 0.4,
      jsonObject: true,       // OpenAI: response_format=json_object — provider-side JSON guarantee
    });
    const payload = this.parseAndValidate(res.text, mode);
    // Echo back the requested exam format so the downstream publisher can
    // persist it to Problem.examFormat without re-plumbing the option. The
    // LLM never sees / sets this field — it's a caller-side tag.
    if (opts.examFormat) payload.examFormat = opts.examFormat;
    return {
      payload,
      tokensIn: res.inputTokens,
      tokensOut: res.outputTokens,
      model: this.config.get<string>('ai.llm.model') ?? 'unknown',
    };
  }

  /** Extract JSON from the LLM response (handle markdown-fenced output) and validate the schema. */
  private parseAndValidate(raw: string, mode: DraftMode): DraftPayload {
    const t = raw.trim();
    const jsonStr = this.stripFences(t);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      throw new Error(`LLM returned non-JSON: ${this.preview(raw)}`);
    }
    const p = parsed as DraftPayload;

    if (!p || typeof p !== 'object') throw new Error('LLM payload not an object');
    if (typeof p.problemBody !== 'string' || p.problemBody.length < 5) throw new Error('problemBody missing/short');
    if (!['MIDDLE', 'UPPER_MIDDLE', 'SEMI_KILLER', 'KILLER'].includes(p.difficulty)) throw new Error(`bad difficulty: ${p.difficulty}`);
    if (!Number.isInteger(p.difficultyLevel) || p.difficultyLevel < 1 || p.difficultyLevel > 5) throw new Error('bad difficultyLevel');

    const expectedSteps: ReadonlyArray<DraftStep['stepType']> =
      mode === 'multi-step' ? ['CONCEPT', 'PROCESS', 'ANSWER'] : ['ANSWER'];
    if (!Array.isArray(p.steps) || p.steps.length !== expectedSteps.length) {
      throw new Error(`steps must be length ${expectedSteps.length} (mode=${mode})`);
    }
    p.steps.forEach((s, i) => {
      if (s.stepType !== expectedSteps[i]) {
        throw new Error(`step[${i}] stepType must be ${expectedSteps[i]} (mode=${mode})`);
      }
      if (!s.prompt || typeof s.prompt !== 'string') throw new Error(`step[${i}] prompt missing`);
      if (!Array.isArray(s.choices) || s.choices.length !== 5) throw new Error(`step[${i}] must have exactly 5 choices`);
      const correct = s.choices.filter((c) => c.isCorrect === true);
      if (correct.length !== 1) throw new Error(`step[${i}] must have exactly one correct choice (got ${correct.length})`);
      s.choices.forEach((c) => {
        if (typeof c.text !== 'string' || c.text.length === 0) throw new Error(`step[${i}] choice text missing`);
        if (!c.isCorrect && c.distractorType && !['CONCEPT_CONFUSION', 'CALC_ERROR', 'PROCESS_SKIP', 'TIME_PRESSURE_GUESS'].includes(c.distractorType)) {
          throw new Error(`step[${i}] bad distractorType: ${c.distractorType}`);
        }
      });
    });
    return p;
  }

  private stripFences(t: string): string {
    const m = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    return m ? m[1].trim() : t;
  }

  private preview(s: string): string {
    return s.slice(0, 200).replace(/\s+/g, ' ');
  }
}
