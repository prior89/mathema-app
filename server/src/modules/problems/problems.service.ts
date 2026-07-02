import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ProblemsRepository, sanitizeForClient } from './problems.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { recommendedDifficulties } from '../../common/utils/difficulty-matcher.util';
import { Lang } from '../../common/i18n/current-lang.decorator';
import {
  PROBLEM_EN, SOURCE_EN, CONCEPT_EN, FORMULA_EN, STEP_PROMPT_EN, CHOICE_EN,
} from '../../common/i18n/content-en';

/**
 * Drop walkthrough steps that state the final answer. The prompt forbids it,
 * but small models still close with "Thus, ... = 40" (seen in prod
 * 2026-06-12), so a deterministic filter is the only reliable guard.
 * Comparison ignores whitespace and LaTeX `$` delimiters; pure-numeric
 * answers require non-digit boundaries so e.g. answer "40" doesn't false-match
 * an intermediate "140".
 */
export function stripAnswerLeak(steps: string[], answer: string | null): string[] {
  if (!answer) return steps;
  const norm = (s: string) => s.replace(/[\s$]/g, '');
  const target = norm(answer);
  if (!target) return steps;
  const isNumeric = /^-?\d+(\.\d+)?$/.test(target);
  // Boundaries: not inside a larger number ("140", "40.5", "1.40") but a
  // trailing sentence period ("= 40.") still counts as a match.
  const boundary = isNumeric
    ? new RegExp(`(?<![\\d.])${target.replace(/[.-]/g, '\\$&')}(?!\\d|\\.\\d)`)
    : null;
  return steps.filter((step) => {
    const s = norm(step);
    return boundary ? !boundary.test(s) : !s.includes(target);
  });
}

@Injectable()
export class ProblemsService {
  constructor(
    private readonly repo: ProblemsRepository,
    private readonly prisma: PrismaService,
  ) {}
  list(q: any, lang: Lang = 'en') { return this.repo.list(q, lang); }
  one(id: string, lang: Lang = 'en') { return this.repo.findById(id, lang); }

  /**
   * Variant re-quiz: return a different problem from the SAME chapter as the
   * source problem, so re-solving a wrong item tests the same concept with new
   * numbers (IN template siblings) or a distinct same-concept item (KR) — never
   * the identical problem whose answer the student may have memorised. Skips
   * problems the user attempted in the last 24h; prefers the same difficulty.
   */
  async variant(id: string, userId: string, lang: Lang = 'en') {
    const src = await this.prisma.problem.findUnique({
      where: { id },
      select: { conceptLessonId: true, koreanConceptLessonId: true, difficulty: true },
    });
    if (!src) throw new NotFoundException('problem not found');
    const lessonFilter = src.koreanConceptLessonId
      ? { koreanConceptLessonId: src.koreanConceptLessonId }
      : src.conceptLessonId
        ? { conceptLessonId: src.conceptLessonId }
        : null;
    if (!lessonFilter) throw new NotFoundException('problem has no chapter to draw a variant from');

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await this.prisma.attempt.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { problemId: true },
      distinct: ['problemId'],
    });
    const exclude = [id, ...recent.map((r) => r.problemId)];

    const base = { ...lessonFilter, steps: { some: { stepIndex: 1 } } };
    let pool = await this.prisma.problem.findMany({
      where: { ...base, id: { notIn: exclude } },
      select: { id: true, difficulty: true },
      take: 40,
    });
    if (pool.length === 0) {
      // Everything else in the chapter was seen recently — fall back to any
      // sibling except the exact source problem.
      pool = await this.prisma.problem.findMany({
        where: { ...base, id: { not: id } },
        select: { id: true, difficulty: true },
        take: 40,
      });
    }
    if (pool.length === 0) throw new NotFoundException('no variant available for this problem');

    const sameDiff = pool.filter((p) => p.difficulty === src.difficulty);
    const pick = (sameDiff.length > 0 ? sameDiff : pool)[0];
    return this.repo.findById(pick.id, lang);
  }
  hint(id: string) { return this.repo.findHint(id); }

  /**
   * Hint Lv2 — AI walks the student through the solution step-by-step.
   * Calls OpenAI (gpt-4o-mini by default) with a short structured prompt;
   * returns ≤6 lines of natural-language solution with math expressions
   * wrapped in inline LaTeX. Frontend renders this as an overlay card on
   * top of the handwriting canvas so it visually reads as "AI wrote on
   * your notebook."
   *
   * Lv1 (cached formula + concept) goes through hint() above — no LLM call,
   * instant response. Lv2 is the deliberate cost step the student has to
   * tap twice to invoke.
   */
  async hintWalkthrough(id: string): Promise<{ steps: string[] }> {
    const p = await this.prisma.problem.findUnique({
      where: { id },
      select: { body: true, formula: true, concept: true, answer: true },
    });
    if (!p) throw new NotFoundException('problem not found');
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new ServiceUnavailableException('AI hints are not configured (OPENAI_API_KEY missing).');

    const prompt =
      'You are tutoring an Indian Class 7-12 student through a math problem.\n' +
      'Walk them through the solution step by step in plain English.\n' +
      'Wrap EVERY math expression in inline LaTeX delimiters $...$ — even single variables ' +
      'like $x$ and standalone numbers used as math. Convert unicode math symbols ' +
      '(∫, π, √, ²) to LaTeX commands inside the delimiters.\n' +
      'Output JSON: {"steps": ["...", "..."]} — at most 6 short steps, each ≤200 chars.\n' +
      'NEVER state the final answer or its value in any step — not as a result, a check, ' +
      'or a paraphrase. End at the setup of the last computation and tell the student to ' +
      'finish it; they must pick the multiple-choice option themselves.\n\n' +
      `Problem: ${p.body}\n` +
      (p.formula ? `Key formula: ${p.formula}\n` : '') +
      (p.concept ? `Concept: ${p.concept}\n` : '') +
      `Correct answer (for your reasoning only — do NOT reveal it): ${p.answer}`;

    const body = {
      model: process.env.AI_HINT_MODEL ?? 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    let res: Response;
    try {
      res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new ServiceUnavailableException(`AI hint failed (${res.status}): ${errText.slice(0, 200)}`);
    }
    const json: any = await res.json();
    const text: string = json?.choices?.[0]?.message?.content ?? '';
    if (!text) return { steps: [] };
    try {
      const parsed = JSON.parse(text);
      const steps: string[] = Array.isArray(parsed?.steps)
        ? parsed.steps.filter((s: any) => typeof s === 'string').slice(0, 6)
        : [];
      return { steps: stripAnswerLeak(steps, p.answer) };
    } catch {
      // Fallback — split by newlines, take non-empty lines.
      const steps = text
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .slice(0, 6);
      return { steps: stripAnswerLeak(steps, p.answer) };
    }
  }

  /**
   * 풀이 공개 — 오답노트·복습 등 이미 풀어본 문제에 대해 정답까지 포함한 전체 풀이를 반환.
   * sanitizeForClient 가 숨기는 answer / isCorrect / rationale 도 포함.
   */
  async solution(id: string, lang: Lang = 'en') {
    const p = await this.prisma.problem.findUnique({
      where: { id },
      include: {
        unit: true, subUnit: true,
        steps: {
          orderBy: { stepIndex: 'asc' },
          include: { choices: { orderBy: { choiceIndex: 'asc' } } },
        },
      },
    });
    if (!p) throw new NotFoundException('problem not found');
    const en = PROBLEM_EN[p.source];
    const body = lang !== 'ko' && en?.body ? en.body : p.body;
    const answer = lang !== 'ko' && en?.answer ? en.answer : p.answer;
    const concept = lang !== 'ko' && CONCEPT_EN[p.source] ? CONCEPT_EN[p.source] : p.concept;
    const formula = lang !== 'ko' && FORMULA_EN[p.source] ? FORMULA_EN[p.source] : p.formula;
    const sourceDisp = lang !== 'ko' && SOURCE_EN[p.source] ? SOURCE_EN[p.source] : p.source;
    const steps = p.steps.map((s: any) => {
      const correct = s.choices.find((c: any) => c.isCorrect);
      const promptKey = `${p.source}:${s.stepIndex}`;
      const choiceKey = correct ? `${p.source}:${s.stepIndex}:${correct.choiceIndex}` : '';
      const promptEn = STEP_PROMPT_EN[promptKey];
      const choiceEn = correct ? CHOICE_EN[choiceKey] : null;
      return {
        stepIndex: s.stepIndex,
        stepType: s.stepType,
        prompt: lang !== 'ko' && promptEn ? promptEn : s.prompt,
        correctChoice: correct ? {
          choiceIndex: correct.choiceIndex,
          text: lang !== 'ko' && choiceEn ? choiceEn.text : correct.text,
        } : null,
      };
    });
    // AI Solver pipeline stores its step-by-step walkthrough in
    // expectedSolutionSteps.explanation (JSON column). Surface it so the
    // Notes/review screen can show the full solution alongside the answer.
    let explanation: string | null = null;
    const ess = p.expectedSolutionSteps as any;
    if (ess && typeof ess === 'object' && typeof ess.explanation === 'string') {
      explanation = ess.explanation;
    }
    return {
      id: p.id, source: sourceDisp,
      unit: p.unit?.name ?? null, subUnit: p.subUnit?.name ?? null,
      difficulty: p.difficulty,
      body, concept, formula, answer, explanation, steps,
    };
  }

  async recommendedFor(userId: string, unitId: string, lang: Lang = 'en') {
    const mastery = await this.prisma.masterySnapshot.findUnique({
      where: { userId_unitId: { userId, unitId } },
    });
    const score = mastery?.score ?? 50;
    const difficulties = recommendedDifficulties(score);
    const include = {
      steps: { orderBy: { stepIndex: 'asc' as const }, include: { choices: { orderBy: { choiceIndex: 'asc' as const } } } },
    };
    const problems = await this.prisma.problem.findMany({
      where: { unitId, difficulty: { in: difficulties as any } },
      include, orderBy: { createdAt: 'asc' },
    });
    const fallback = problems.length === 0
      ? await this.prisma.problem.findMany({ where: { unitId }, include, orderBy: { createdAt: 'asc' } })
      : problems;
    return fallback.map((p: any) => sanitizeForClient(p, lang));
  }

  /**
   * Sprint 3 A13: student "이 문제 신고" → immediate EXCLUDED + flag tag.
   *
   * Conservative approach: a single student report flips the active-pool
   * filter (so this Problem no longer reaches any student via Study /
   * Practice / Adaptive). Adds 'STUDENT_REPORTED' to qualityCriticalFlags
   * so an operator can later distinguish student-flagged rows from
   * LLM-graded EXCLUSIONS and restore false positives. The reporter's
   * userId + reason snapshot is logged for audit.
   *
   * Idempotent: if the problem is already EXCLUDED or already tagged
   * STUDENT_REPORTED, the call is a no-op (we still log the report
   * console-side so duplicate reports surface in operator review).
   */
  async report(userId: string, problemId: string, reason: string | null) {
    const prob = await this.prisma.problem.findUnique({
      where: { id: problemId },
      select: { id: true, qualityStatus: true, qualityCriticalFlags: true },
    });
    if (!prob) throw new NotFoundException(`Problem ${problemId} not found`);

    const alreadyTagged = prob.qualityCriticalFlags.includes('STUDENT_REPORTED');
    // eslint-disable-next-line no-console
    console.warn(
      '[problem-report]',
      JSON.stringify({
        problemId, userId,
        reason: (reason ?? '').slice(0, 200),
        priorStatus: prob.qualityStatus,
        duplicate: alreadyTagged,
        at: new Date().toISOString(),
      }),
    );

    if (alreadyTagged && prob.qualityStatus === 'EXCLUDED') {
      return { ok: true, duplicate: true };
    }

    await this.prisma.problem.update({
      where: { id: problemId },
      data: {
        qualityStatus: 'EXCLUDED',
        qualityCriticalFlags: alreadyTagged
          ? prob.qualityCriticalFlags
          : [...prob.qualityCriticalFlags, 'STUDENT_REPORTED'],
      },
    });
    return { ok: true, duplicate: false };
  }
}
