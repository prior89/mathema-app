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
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../../infrastructure/ai/ai.service';
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
export type DraftPayload = {
  problemBody: string;
  hint: string;
  concept: string;
  difficulty: 'MIDDLE' | 'UPPER_MIDDLE' | 'SEMI_KILLER' | 'KILLER';
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  expectedTimeSec: number;
  steps: [DraftStep, DraftStep, DraftStep];
};

export type DraftResult = {
  payload: DraftPayload;
  tokensIn: number;
  tokensOut: number;
  model: string;
};

const SYSTEM_PROMPT = `You are an expert math educator transforming NCERT (Indian Class 7-12) and similar problems into a strict 3-step multiple-choice format for the Mathēma learning app.

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

@Injectable()
export class LlmDraftService {
  private readonly logger = new Logger(LlmDraftService.name);

  constructor(
    private readonly ai: AiService,
    private readonly config: ConfigService,
  ) {}

  async generate(input: { ncertClass?: string; chapterNumber?: number; chapterTitleHint?: string; exerciseId?: string; qIndex?: number; text: string }): Promise<DraftResult> {
    const ctxLine = [
      input.ncertClass ? `Class: ${input.ncertClass}` : null,
      input.chapterNumber ? `Chapter: ${input.chapterNumber}` : null,
      input.chapterTitleHint ? `Chapter title: ${input.chapterTitleHint}` : null,
      input.exerciseId ? `Exercise: ${input.exerciseId}` : null,
      input.qIndex ? `Q: ${input.qIndex}` : null,
    ].filter(Boolean).join(' · ');

    const prompt = `${ctxLine ? ctxLine + '\n\n' : ''}Source problem:\n"""\n${input.text}\n"""\n\nReturn the strict JSON draft now.`;

    const res = await this.ai.generateText({ prompt, system: SYSTEM_PROMPT, maxTokens: 2200, temperature: 0.2 });
    const payload = this.parseAndValidate(res.text);
    return {
      payload,
      tokensIn: res.inputTokens,
      tokensOut: res.outputTokens,
      model: this.config.get<string>('ai.llm.model') ?? 'unknown',
    };
  }

  /** Extract JSON from the LLM response (handle markdown-fenced output) and validate the schema. */
  private parseAndValidate(raw: string): DraftPayload {
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
    if (!Array.isArray(p.steps) || p.steps.length !== 3) throw new Error('steps must be length 3');

    const expected = ['CONCEPT', 'PROCESS', 'ANSWER'] as const;
    p.steps.forEach((s, i) => {
      if (s.stepType !== expected[i]) throw new Error(`step[${i}] stepType must be ${expected[i]}`);
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
