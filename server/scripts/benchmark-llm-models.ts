/**
 * benchmark-llm-models.ts — call every chat-capable model from OpenAI + Gemini
 * with the user's hardest in-scope problem (the multi-part sequence/series
 * problem that has been returning 60000) and report:
 *
 *   - the raw answer the model produced
 *   - whether Part (1) matches n(n+1)(4n+3)/2
 *   - whether Part (2) matches 1977400
 *   - latency (ms) per call
 *
 * Usage:
 *   npx ts-node scripts/benchmark-llm-models.ts
 *
 * Reads OPENAI_API_KEY + GEMINI_API_KEY from env (Prisma .env loader picks
 * them up automatically because we run from /server).
 */

// Load env from server/.env so OPENAI_API_KEY + GEMINI_API_KEY are available
// without manual exporting. ts-node doesn't auto-load .env.
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import * as fs from 'fs';

const QUESTION = `12. 여러 가지 수열 181

필수 예제 12-4 다음 각 물음에 답하여라.
(1) ∑(k=1..n) a_k = n^2 + 2n 일 때, ∑(k=1..n) k·a_(3k) 를 구하여라.
(2) 수열 {a_n} 에서 처음 n 항의 합 S_n 이 S_n = 2n^3 + 3n^2 − 600n 일 때, ∑(n=1..100) |a_n| 의 값을 구하여라.`;

const PROMPT = `You are an expert math tutor. Solve the following problem for a Korean high-school student (수능 수준).

If the problem has labelled sub-parts (e.g. (1), (2)), answer EVERY part. The first part's answer is a formula in n; the second part's answer is a specific integer.

Reminder: if a problem gives S_n (the sum of the first n terms of a sequence), the individual terms are recovered by SUBTRACTION: a_n = S_n − S_(n−1) for n ≥ 2, with a_1 = S_1. Do not differentiate S_n.

Return ONLY this JSON object:
{
  "part1_answer": "<formula in n, in plain LaTeX-free notation>",
  "part2_answer": "<integer>",
  "steps": ["<short reasoning line 1>", "<line 2>", "..."]
}

Problem:
${QUESTION}`;

// Expected answers
const EXPECTED_PART1_FORMS = [
  'n(n+1)(4n+3)/2',
  '(n(n+1)(4n+3))/2',
  '(4n^3+7n^2+3n)/2',
  '(4n^3 + 7n^2 + 3n)/2',
];
const EXPECTED_PART2 = 1977400;

function normalizeFormula(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\*/g, '')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\cdot/g, '')
    .replace(/[{}]/g, '');
}

function checkPart1(answer: string): boolean {
  const n = normalizeFormula(answer);
  return EXPECTED_PART1_FORMS.some((expected) => {
    const e = normalizeFormula(expected);
    return n.includes(e) || e.includes(n);
  });
}

function checkPart2(answer: string): boolean {
  const digits = answer.replace(/[^0-9]/g, '');
  return digits === '1977400' || answer.includes('1977400') || answer.includes('1,977,400');
}

type ProviderResult = {
  model: string;
  provider: 'openai' | 'gemini';
  ok: boolean;
  part1?: string;
  part2?: string;
  part1Correct?: boolean;
  part2Correct?: boolean;
  rawSnippet?: string;
  latencyMs?: number;
  error?: string;
};

async function listOpenAiChatModels(apiKey: string): Promise<string[]> {
  const res = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    console.error(`OpenAI list failed: ${res.status}`);
    return [];
  }
  const json: any = await res.json();
  const ids: string[] = (json.data ?? []).map((m: any) => m.id);
  // Filter to recent chat-completion-capable models likely to handle reasoning.
  // Skip image / audio / embedding / older 3.5 variants.
  return ids.filter((id) =>
    /^(gpt-4o|gpt-4\.1|gpt-5|o1|o3|o4)/.test(id) &&
    !/audio|tts|whisper|realtime|embed|image|search|preview-2024/.test(id),
  );
}

async function listGeminiChatModels(apiKey: string): Promise<string[]> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  if (!res.ok) return [];
  const json: any = await res.json();
  return (json.models ?? [])
    .filter((m: any) => (m.supportedGenerationMethods ?? []).includes('generateContent'))
    .map((m: any) => m.name.replace(/^models\//, ''))
    .filter((id: string) =>
      // Pro + Flash tiers, skip image-only / tts / lite / preview-tts.
      /^(gemini-2\.|gemini-3|gemini-flash-latest|gemini-pro-latest)/.test(id) &&
      !/-tts|-image|-customtools/.test(id),
    );
}

async function callOpenAi(model: string, apiKey: string): Promise<ProviderResult> {
  const t0 = Date.now();
  // Reasoning models (o1, o3) don't accept temperature and use different params.
  const isReasoning = /^o[134]/.test(model);
  const body: any = {
    model,
    messages: [{ role: 'user', content: PROMPT }],
    response_format: { type: 'json_object' },
  };
  if (!isReasoning) {
    body.temperature = 0;
    body.max_tokens = 4096;
  } else {
    body.max_completion_tokens = 8192;
  }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    });
    const latencyMs = Date.now() - t0;
    if (!res.ok) {
      const txt = await res.text();
      return { model, provider: 'openai', ok: false, error: `${res.status}: ${txt.slice(0, 150)}`, latencyMs };
    }
    const json: any = await res.json();
    const content = json.choices?.[0]?.message?.content ?? '';
    return parseAndScore({ model, provider: 'openai', latencyMs }, content);
  } catch (e) {
    return { model, provider: 'openai', ok: false, error: (e as Error).message };
  }
}

async function callGemini(model: string, apiKey: string): Promise<ProviderResult> {
  const t0 = Date.now();
  const body = {
    contents: [{ parts: [{ text: PROMPT }] }],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      // Defensive cap — script is manual benchmark, doesn't need thinking
      // burn while iterating. Drop this line if you want to measure thinking
      // cost vs accuracy on a specific model.
      thinkingConfig: { thinkingBudget: 0 },
    },
  };
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    const latencyMs = Date.now() - t0;
    if (!res.ok) {
      const txt = await res.text();
      return { model, provider: 'gemini', ok: false, error: `${res.status}: ${txt.slice(0, 150)}`, latencyMs };
    }
    const json: any = await res.json();
    const content = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return parseAndScore({ model, provider: 'gemini', latencyMs }, content);
  } catch (e) {
    return { model, provider: 'gemini', ok: false, error: (e as Error).message };
  }
}

function parseAndScore(
  base: Pick<ProviderResult, 'model' | 'provider' | 'latencyMs'>,
  content: string,
): ProviderResult {
  if (!content) {
    return { ...base, ok: false, error: 'empty response' };
  }
  try {
    const parsed = JSON.parse(content);
    const part1 = String(parsed.part1_answer ?? '').trim();
    const part2 = String(parsed.part2_answer ?? '').trim();
    return {
      ...base,
      ok: true,
      part1,
      part2,
      part1Correct: checkPart1(part1),
      part2Correct: checkPart2(part2),
      rawSnippet: content.slice(0, 200),
    };
  } catch (e) {
    return { ...base, ok: false, error: `parse: ${(e as Error).message}`, rawSnippet: content.slice(0, 200) };
  }
}

async function main() {
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!openaiKey || !geminiKey) {
    console.error('Both OPENAI_API_KEY and GEMINI_API_KEY must be set.');
    process.exit(2);
  }

  console.log('Listing models...');
  const [openaiModels, geminiModels] = await Promise.all([
    listOpenAiChatModels(openaiKey),
    listGeminiChatModels(geminiKey),
  ]);
  console.log(`OpenAI candidates (${openaiModels.length}): ${openaiModels.join(', ')}`);
  console.log(`Gemini candidates (${geminiModels.length}): ${geminiModels.join(', ')}`);
  console.log('');

  const all: ProviderResult[] = [];

  // Run in small parallel batches per provider so a slow one doesn't gate the
  // whole sweep. 3 concurrent calls per provider keeps the rate limiters happy.
  async function runBatch<T>(items: T[], limit: number, fn: (x: T) => Promise<ProviderResult>) {
    for (let i = 0; i < items.length; i += limit) {
      const slice = items.slice(i, i + limit);
      const results = await Promise.all(slice.map(fn));
      for (const r of results) {
        all.push(r);
        const partA = r.part1Correct ? '✓' : '✗';
        const partB = r.part2Correct ? '✓' : '✗';
        const status = r.ok ? `${partA}/${partB}` : 'ERR';
        console.log(`[${r.provider}] ${r.model.padEnd(36)}  ${status}  ${r.latencyMs ?? '?'}ms  ${r.error ?? ''}`);
        if (r.ok) {
          console.log(`    part1: ${r.part1}`);
          console.log(`    part2: ${r.part2}`);
        }
      }
    }
  }

  await runBatch(openaiModels, 2, (m) => callOpenAi(m, openaiKey));
  await runBatch(geminiModels, 3, (m) => callGemini(m, geminiKey));

  console.log('\n=== Summary ===');
  console.log('Model'.padEnd(40), 'Part1', 'Part2', 'Time');
  for (const r of all) {
    console.log(
      r.model.padEnd(40),
      r.part1Correct ? '✓   ' : '✗   ',
      r.part2Correct ? '✓   ' : '✗   ',
      r.latencyMs ? `${r.latencyMs}ms` : (r.error ?? ''),
    );
  }

  // Persist for record-keeping.
  fs.writeFileSync('/tmp/llm-benchmark-result.json', JSON.stringify(all, null, 2));
  console.log('\nFull results: /tmp/llm-benchmark-result.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
