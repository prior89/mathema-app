/* LLM Draft Service — raw NCERT (or EBS, etc.) problem text → 3-step MC (CONCEPT / PROCESS / ANSWER) draft.
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

const SYSTEM_PROMPT_MULTI_STEP = `You are an expert math educator transforming NCERT (Indian Class 7-12) and similar problems into a strict 3-step multiple-choice format for the Matheo learning app.

You MUST return a single JSON object with this exact schema (no markdown, no commentary):

{
  "problemBody": "<the cleaned NCERT problem statement, preserving LaTeX where present>",
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
- rationale (for wrong choices) names the specific misconception or slip — useful for the analyst, not shown to students.
- ANSWER choices must be concrete answers (numbers / expressions). If the NCERT problem's correct answer is ambiguous, choose the canonical answer from the NCERT solution manual.
- Do not invent problems; faithfully transcribe the input. If the input is broken/unparseable, set every field to "UNCLEAR" and isCorrect:true on the first choice of each step.
- All strings in English (the app's primary content language is English for Indian users).
- Output JSON ONLY. No leading/trailing prose.`;

const SYSTEM_PROMPT_SINGLE_STEP = `You are an expert math educator generating a single-step multiple-choice question for Matheo (Indian NCERT Class 7-12 students).

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
- The answer choices must be concrete final answers (numbers / expressions / coordinates), not procedural fragments.
- The four distractors must each represent a plausible mistake a real Class 7-12 student would make — never random or absurd wrong values.
- Match the requested NCERT class + chapter difficulty band. Do not exceed the chapter's topic boundary.
- All strings in English. Output JSON ONLY.`;

/**
 * Per-exam-style framing prepended to the LLM prompt. Each line is a short
 * directive the LLM applies on top of the base system prompt. NCERT_TEXTBOOK
 * (the default) returns null because the base prompts already match its
 * voice — the hint adds nothing.
 *
 * Calibrated for the 2026-05-22 user spec ([[matheo-ux-spec-full]]):
 *   - India: NCERT base + JEE/NEET/CBSE variants
 *   - Korea: KSAT (수능) + 내신 + 평가원 모의고사 variants
 */
function examStyleHint(format: DraftPayload['examFormat'] | undefined): string | null {
  if (!format || format === 'NCERT_TEXTBOOK') return null;
  switch (format) {
    case 'CBSE_BOARD':
      return 'Authoring style: CBSE Class 10/12 board exam. Step marks visible in the solution flow, formal language, formula-recall over trick shortcuts.';
    case 'JEE_MAIN':
      return 'Authoring style: JEE Main (NTA). Concise numerical / single-correct MCQ. Distractors must reflect classic shortcut errors and sign / index slips under 2-min-per-question pressure.';
    case 'JEE_ADVANCED':
      return 'Authoring style: JEE Advanced. Multi-concept fusion (e.g. coordinate + calculus + trig in one problem). One distractor should target the "wrong concept invoked" misread; another the "right concept, off-by-one limit" slip.';
    case 'NEET':
      return 'Authoring style: NEET. Bias toward formula-recall and direct application. Distractors should target unit-conversion slips, sign flips, and trigonometric-identity confusions common in biology-bound students with weaker math fluency.';
    case 'KSAT':
      return 'Authoring style: 한국 수능 수학 영역. 5지선다, 정답 1개. 객관식 풀이 시간 ~3분 가정. 4개 오답은 (i) 개념 혼동, (ii) 부호·차원 실수, (iii) 풀이 중간 단계 누락, (iv) 흔한 함정 (예: 정의역 누락) 패턴을 각각 반영.';
    case 'KR_INTERNAL':
      return 'Authoring style: 한국 고교 내신. 교과서 예제 / 평가 기준에 충실. 풀이 길이 4~6줄, 단답 친화. 오답은 교사가 흔히 보는 풀이 실수 (계산 오류, 공식 적용 오류) 위주.';
    case 'KR_MOCK_EVAL':
      return 'Authoring style: 한국 평가원 모의고사 (3월·6월·9월). 수능 형식과 동일하나 신유형 1개 포함 권장. 오답은 EBS 빈출 함정 + 평가원 특유 비주얼 트릭 (좌표·그래프 오독) 반영.';
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

    const system = mode === 'multi-step' ? SYSTEM_PROMPT_MULTI_STEP : SYSTEM_PROMPT_SINGLE_STEP;
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
