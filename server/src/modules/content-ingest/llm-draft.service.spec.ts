/**
 * LlmDraftService — unit tests for the schema validator + daily quota guard.
 *
 * generate() makes a real call to AiService.generateText(); we mock it so the
 * spec exercises the validator on arbitrary fake LLM payloads without burning
 * OpenAI quota. parseAndValidate is private so we drive it via generate().
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  LlmDraftService,
  SYSTEM_PROMPT_MULTI_STEP,
  SYSTEM_PROMPT_SINGLE_STEP,
} from './llm-draft.service';

function validMulti() {
  const choices = [
    { text: 'right', isCorrect: true, distractorType: null, rationale: null },
    { text: 'w1', isCorrect: false, distractorType: 'CONCEPT_CONFUSION', rationale: 'r' },
    { text: 'w2', isCorrect: false, distractorType: 'CALC_ERROR', rationale: 'r' },
    { text: 'w3', isCorrect: false, distractorType: 'PROCESS_SKIP', rationale: 'r' },
    { text: 'w4', isCorrect: false, distractorType: 'TIME_PRESSURE_GUESS', rationale: 'r' },
  ];
  return {
    problemBody: 'Solve 2 + 3.', hint: 'add', concept: 'addition',
    difficulty: 'MIDDLE', difficultyLevel: 2, expectedTimeSec: 90,
    steps: [
      { stepType: 'CONCEPT', prompt: 'Which concept?', choices },
      { stepType: 'PROCESS', prompt: 'First step?', choices },
      { stepType: 'ANSWER', prompt: 'Final?', choices },
    ],
  };
}
function validSingle() {
  const m = validMulti();
  return { ...m, steps: [{ stepType: 'ANSWER', prompt: 'Solve.', choices: m.steps[0].choices }] };
}

function build(over: { ai?: any; redis?: any; config?: any } = {}) {
  const ai = over.ai ?? { generateText: jest.fn() };
  const redis = over.redis ?? { incrWithTtl: jest.fn().mockResolvedValue(1) };
  const config = over.config ?? { get: jest.fn().mockReturnValue('gpt-4o-mini') };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svc = new LlmDraftService(ai as any, config as any, redis as any);
  return { svc, ai, redis, config };
}

function aiReturning(payload: unknown) {
  return {
    generateText: jest.fn().mockResolvedValue({
      text: typeof payload === 'string' ? payload : JSON.stringify(payload),
      inputTokens: 100, outputTokens: 200,
    }),
  };
}

describe('System prompts — pedagogical directives must not drift', () => {
  // These prompts are the only piece of LLM-draft pipeline a future
  // refactor can silently erase. Lock the four pedagogical layers
  // (Rubric / EF / Hattie process+self-regulation / Chi caveat) into a
  // spec so a stray edit that removes one of them fails CI rather than
  // shipping a flatter rationale to learners.
  const HATTIE_PROCESS = /process layer/i;
  const HATTIE_SELF_REG = /self-regulation/i;
  const CHI_CAVEAT = /chi.*2024/i;
  const FOUR_PART = /4-part|4-part|four[- ]part|student-facing/i;
  const CAUSAL_NARRATION = /because|this works because/i;
  const PROMPTS = {
    'SYSTEM_PROMPT_MULTI_STEP': SYSTEM_PROMPT_MULTI_STEP,
    'SYSTEM_PROMPT_SINGLE_STEP': SYSTEM_PROMPT_SINGLE_STEP,
  };
  Object.entries(PROMPTS).forEach(([name, prompt]) => {
    it(`${name} keeps Hattie process layer`, () => {
      expect(prompt).toMatch(HATTIE_PROCESS);
    });
    it(`${name} keeps Hattie self-regulation layer`, () => {
      expect(prompt).toMatch(HATTIE_SELF_REG);
    });
    it(`${name} keeps Chi 2024 caveat (no generic self-explain)`, () => {
      expect(prompt).toMatch(CHI_CAVEAT);
    });
    it(`${name} keeps the 4-part / student-facing rationale rule`, () => {
      expect(prompt).toMatch(FOUR_PART);
    });
  });
  // Worked-example narration only lives in the multi-step prompt (Study-tab
  // single-step is a one-shot MC with no per-step narration).
  it('SYSTEM_PROMPT_MULTI_STEP keeps explicit "because" causal-narration directive', () => {
    expect(SYSTEM_PROMPT_MULTI_STEP).toMatch(CAUSAL_NARRATION);
  });
});

describe('LlmDraftService.generate — schema validation', () => {
  it('accepts a valid multi-step payload', async () => {
    const ai = aiReturning(validMulti());
    const { svc } = build({ ai });
    const r = await svc.generate({ text: 'Solve 2+3' });
    expect(r.payload.steps).toHaveLength(3);
    expect(r.payload.steps[0].stepType).toBe('CONCEPT');
    expect(r.tokensIn).toBe(100);
    expect(r.model).toBe('gpt-4o-mini');
  });

  it('accepts a valid single-step payload in mode=single-step', async () => {
    const ai = aiReturning(validSingle());
    const { svc } = build({ ai });
    const r = await svc.generate({ text: 'Solve 2+3' }, { mode: 'single-step' });
    expect(r.payload.steps).toHaveLength(1);
    expect(r.payload.steps[0].stepType).toBe('ANSWER');
  });

  it('strips markdown fences before parsing JSON', async () => {
    const fenced = '```json\n' + JSON.stringify(validMulti()) + '\n```';
    const ai = aiReturning(fenced);
    const { svc } = build({ ai });
    const r = await svc.generate({ text: 'Solve 2+3' });
    expect(r.payload.problemBody).toBe('Solve 2 + 3.');
  });

  it('rejects non-JSON output', async () => {
    const ai = aiReturning('Sure, here is your problem!');
    const { svc } = build({ ai });
    await expect(svc.generate({ text: 'x' })).rejects.toThrow(/non-JSON/);
  });

  it('rejects bad difficulty enum', async () => {
    const bad = { ...validMulti(), difficulty: 'IMPOSSIBLE' };
    const ai = aiReturning(bad);
    const { svc } = build({ ai });
    await expect(svc.generate({ text: 'x' })).rejects.toThrow(/bad difficulty/);
  });

  it('rejects when steps.length mismatches mode (single-step gets 3-step payload)', async () => {
    const ai = aiReturning(validMulti());
    const { svc } = build({ ai });
    await expect(svc.generate({ text: 'x' }, { mode: 'single-step' })).rejects.toThrow(/steps must be length 1/);
  });

  it('rejects when a step has != 5 choices', async () => {
    const bad = validMulti();
    bad.steps[0].choices = bad.steps[0].choices.slice(0, 3);
    const ai = aiReturning(bad);
    const { svc } = build({ ai });
    await expect(svc.generate({ text: 'x' })).rejects.toThrow(/exactly 5 choices/);
  });

  it('rejects when a step has != 1 correct choice', async () => {
    const bad = validMulti();
    bad.steps[0].choices[1].isCorrect = true; // now two correct
    const ai = aiReturning(bad);
    const { svc } = build({ ai });
    await expect(svc.generate({ text: 'x' })).rejects.toThrow(/exactly one correct/);
  });

  it('rejects an invalid distractorType', async () => {
    const bad = validMulti();
    (bad.steps[0].choices[1] as any).distractorType = 'BIZARRE';
    const ai = aiReturning(bad);
    const { svc } = build({ ai });
    await expect(svc.generate({ text: 'x' })).rejects.toThrow(/bad distractorType/);
  });
});

describe('LlmDraftService.generate — daily quota guard', () => {
  it('does NOT consume quota when userId is missing (admin path)', async () => {
    const ai = aiReturning(validMulti());
    const redis = { incrWithTtl: jest.fn() };
    const { svc } = build({ ai, redis });
    await svc.generate({ text: 'x' }); // no userId
    expect(redis.incrWithTtl).not.toHaveBeenCalled();
  });

  it('increments daily counter with 24h TTL when userId is given', async () => {
    const ai = aiReturning(validMulti());
    const redis = { incrWithTtl: jest.fn().mockResolvedValue(1) };
    const { svc } = build({ ai, redis });
    await svc.generate({ text: 'x' }, { userId: 'u1' });
    expect(redis.incrWithTtl).toHaveBeenCalledWith(expect.stringMatching(/^llm:gen:daily:u1:/), 86400);
  });

  it('throws 429 when daily counter exceeds DAILY_CAP', async () => {
    const ai = aiReturning(validMulti());
    const redis = { incrWithTtl: jest.fn().mockResolvedValue(101) };
    const { svc } = build({ ai, redis });
    await expect(svc.generate({ text: 'x' }, { userId: 'u1' }))
      .rejects.toMatchObject({
        getStatus: expect.any(Function),
      });
    // Verify it's specifically 429:
    let captured: HttpException | null = null;
    try { await svc.generate({ text: 'x' }, { userId: 'u1' }); }
    catch (e) { captured = e as HttpException; }
    expect(captured!.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect((captured!.getResponse() as any).quota).toBe(100);
  });
});
