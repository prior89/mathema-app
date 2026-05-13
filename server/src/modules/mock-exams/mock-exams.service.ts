import { Injectable, NotFoundException } from '@nestjs/common';
import { MockExamsRepository } from './mock-exams.repository';
import { GradingService } from './services/grading.service';
import { AiRecommendExamService } from './services/ai-recommend-exam.service';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { pointsToNextGrade } from '../../common/utils/grade-calculator.util';
import { AttemptsService } from '../attempts/attempts.service';
import { SessionContext } from '../../common/enums/session-context.enum';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { PROBLEM_EN, STEP_PROMPT_EN, CHOICE_EN, SOURCE_EN, HINT_EN, CONCEPT_EN, FORMULA_EN } from '../../common/i18n/content-en';

/**
 * MockExam name → English short label.
 * 예: "2024 9월 모의평가" → "2024 Sep Mock", "6월 모의평가" → "Jun Mock"
 */
function translateExamName(name: string): string {
  if (!name) return name;
  let s = name;
  const monthMap: Record<string, string> = {
    '1월': 'Jan', '2월': 'Feb', '3월': 'Mar', '4월': 'Apr', '5월': 'May', '6월': 'Jun',
    '7월': 'Jul', '8월': 'Aug', '9월': 'Sep', '10월': 'Oct', '11월': 'Nov', '12월': 'Dec',
  };
  for (const [k, v] of Object.entries(monthMap)) s = s.replace(k, v);
  s = s.replace('모의평가', 'Mock').replace('학력평가', 'Practice')
       .replace('수능', 'SAT').replace('교육청', 'Edu')
       .replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * 응시용 sanitize — answer/isCorrect/distractorType/rationale 제거 + lang 번역 + 보기 셔플.
 * 매 요청마다 보기 순서를 무작위로 섞어 "정답은 항상 1번" 패턴 차단.
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sanitizeForExam(p: any, lang: Lang = 'ko'): any {
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
      const promptEn = STEP_PROMPT_EN[`${p.source}:${s.stepIndex}`];
      const choices = (s.choices ?? []).map((c: any) => {
        const choiceEn = CHOICE_EN[`${p.source}:${s.stepIndex}:${c.choiceIndex}`];
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
}

@Injectable()
export class MockExamsService {
  constructor(
    private readonly repo: MockExamsRepository,
    private readonly grading: GradingService,
    private readonly aiRec: AiRecommendExamService,
    private readonly attempts: AttemptsService,
    private readonly prisma: PrismaService,
  ) {}

  async trajectory(userId: string, count: number, lang: Lang = 'ko') {
    const rows = await this.repo.findTrajectory(userId, count);
    // 목표선 — 사용자 targetGrade 기반 동적 환산. 가짜 고정값 80 제거.
    // 등급당 ~8점 (1등급=96, 2등급=88, 3등급=80, 4등급=72 ...)
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, select: { targetGrade: true },
    });
    const target = user?.targetGrade ? Math.max(40, 100 - (user.targetGrade - 1) * 8) : null;
    return rows.map((r: any) => ({
      name: lang !== 'ko'
        ? translateExamName(r.mockExam.name)
        : r.mockExam.name.replace(/^2024\s+/, '').replace('학력평가', '학평').replace('모의평가', '모평'),
      score: r.score, grade: r.grade, target,
    }));
  }

  async recentResults(userId: string, count: number, lang: Lang = 'ko') {
    const rows = await this.repo.findRecent(userId, count);
    return rows.map((r: any) => {
      const iso = r.takenAt.toISOString().slice(0, 10);
      const dateKo = iso.replace(/-/g, '년 ').replace(/년 (\d+)$/, '년 $1월') + '일';
      return {
        id: r.id,
        name: lang !== 'ko' ? translateExamName(r.mockExam.name) : r.mockExam.name,
        date: lang !== 'ko' ? iso : dateKo,
        score: r.score, grade: r.grade, percentile: r.percentile,
        time: lang !== 'ko'
          ? `${r.durationMin}min / ${r.mockExam.totalMinutes}min`
          : `${r.durationMin}분/${r.mockExam.totalMinutes}분`,
      };
    });
  }

  /**
   * 단일 결과 상세 — Recent results 카드 클릭 시 review 페이지에 표시.
   * 응시 attempt 별 problem 이름·정답 여부·내가 고른 보기까지 포함.
   */
  async getResultById(userId: string, resultId: string, lang: Lang = 'ko') {
    const r = await this.prisma.mockExamResult.findFirst({
      where: { id: resultId, userId },
      include: {
        mockExam: true,
        attempts: {
          include: {
            problem: { select: { id: true, source: true, body: true, difficulty: true } },
            choice: { select: { choiceIndex: true, text: true, isCorrect: true, rationale: true } },
          },
          orderBy: [{ problemId: 'asc' }, { stepIndex: 'asc' }],
        },
      },
    });
    if (!r) throw new NotFoundException('Result not found');

    // 문제별로 묶기: { problemId → { source, steps:[{stepIndex, isCorrect, choiceText}] } }
    const byProblem = new Map<string, any>();
    for (const a of r.attempts) {
      const key = a.problemId;
      const cur = byProblem.get(key) ?? {
        problemId: a.problemId,
        source: lang !== 'ko' && SOURCE_EN[a.problem.source]
          ? SOURCE_EN[a.problem.source]
          : a.problem.source,
        body: a.problem.body,
        steps: [],
        allCorrect: true,
      };
      const isCorrect = !!a.choice?.isCorrect;
      cur.steps.push({
        stepIndex: a.stepIndex,
        isCorrect,
        myChoice: a.choice?.text ?? null,
        rationale: a.choice?.rationale ?? null,
      });
      if (!isCorrect) cur.allCorrect = false;
      byProblem.set(key, cur);
    }
    return {
      id: r.id,
      name: lang !== 'ko' ? translateExamName(r.mockExam.name) : r.mockExam.name,
      takenAt: r.takenAt.toISOString(),
      score: r.score,
      grade: r.grade,
      percentile: r.percentile,
      durationMin: r.durationMin,
      totalMinutes: r.mockExam.totalMinutes,
      problems: Array.from(byProblem.values()),
    };
  }

  async summary(userId: string) {
    // 최근 10개 + 전체 count 동시 조회.
    const [recent, attemptCount] = await Promise.all([
      this.repo.findRecent(userId, 10),
      this.prisma.mockExamResult.count({ where: { userId } }),
    ]);
    const last = recent[0];
    const N = recent.length;

    let reliability: number | null = null;
    let bestScore: number | null = null;
    let avgScore: number | null = null;
    let improvementSinceFirst: number | null = null;
    let scoreDelta: number | null = null;

    if (N > 0) {
      const scores = recent.map((r: any) => r.score);
      bestScore = Math.max(...scores);
      avgScore = Math.round(scores.reduce((s: number, x: number) => s + x, 0) / N);
      // recent 는 takenAt desc 순 — 첫 응시는 배열 끝.
      const first = scores[scores.length - 1];
      improvementSinceFirst = last!.score - first;
      // 직전 응시(idx 1) vs 이번(idx 0).
      if (N >= 2) scoreDelta = last!.score - scores[1];

      const mean = avgScore;
      const variance = scores.reduce((s: number, x: number) => s + (x - mean) ** 2, 0) / N;
      const sigma = Math.sqrt(variance);
      const base = Math.min(95, Math.round(50 + 7 * Math.sqrt(N) + (N >= 3 ? 10 : 0)));
      const penalty = sigma >= 10 ? 10 : sigma >= 5 ? 5 : 0;
      reliability = Math.max(0, base - penalty);
    }

    return {
      lastScore:         last?.score ?? null,
      expectedGrade:     last?.grade ?? null,
      reliability,
      pointsToNextGrade: last ? pointsToNextGrade(last.score) : null,
      percentile:        last?.percentile ?? null,
      // 신규 — frontend stat 라벨과 1:1 매칭.
      bestScore,
      avgScore,
      attemptCount,
      improvementSinceFirst,
      scoreDelta,
    };
  }

  async startRecommended(userId: string, lang: Lang = 'en') {
    const { problems } = await this.aiRec.compose(userId);
    return this.beginSession(
      userId,
      { name: 'AI-tailored Mock', type: 'RECOMMENDED' as any, totalMinutes: 50, problems },
      lang,
    );
  }

  async startTyped(userId: string, kind: 'mini' | 'wrong-redo' | 'real', lang: Lang = 'en') {
    const result = await this.aiRec.composeTyped(userId, kind);
    const fb = (result as any).fallbackReason as string | undefined;
    const meta: Record<string, { name: string; type: any; totalMinutes: number }> = {
      mini:        { name: 'Unit Mini Test',                  type: 'MINI',       totalMinutes: 15 },
      'wrong-redo':{ name: 'Wrong-Redo Exam',                 type: 'WRONG_REDO', totalMinutes: 30 },
      real:        { name: 'Full Mock Exam (Grade-wide)',     type: 'REAL',       totalMinutes: 60 },
    };
    const m = { ...meta[kind] };
    // Override name if a fallback kicked in — keep user informed.
    if (fb === 'no-wrong-notes' && kind === 'wrong-redo') {
      m.name = 'Practice (no wrong notes yet)';
    } else if (fb === 'no-grade-problems' && kind === 'real') {
      m.name = 'Practice (grade pool empty)';
    }
    return this.beginSession(userId, { ...m, problems: result.problems }, lang);
  }

  private async beginSession(userId: string, p: {
    name: string; type: any; totalMinutes: number;
    problems: Array<{ id: string; source: string; difficulty: string }>;
  }, lang: Lang = 'ko') {
    if (!p.problems || p.problems.length === 0) {
      return { resultId: null, name: p.name, totalMinutes: p.totalMinutes, problems: [] };
    }
    const { result } = await this.repo.createSession(userId, {
      name: p.name, type: p.type, totalProblems: p.problems.length, totalMinutes: p.totalMinutes,
    });
    const fullProblems = await this.fetchFullProblems(p.problems.map((x) => x.id), lang);
    return {
      resultId: result.id,
      name: p.name,
      totalMinutes: p.totalMinutes,
      problems: fullProblems,
    };
  }

  private async fetchFullProblems(ids: string[], lang: Lang = 'ko') {
    if (ids.length === 0) return [];
    const ps = await this.prisma.problem.findMany({
      where: { id: { in: ids } },
      include: {
        steps: {
          orderBy: { stepIndex: 'asc' },
          include: { choices: { orderBy: { choiceIndex: 'asc' } } },
        },
      },
    });
    const byId = new Map(ps.map((p) => [p.id, p]));
    return ids
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((p: any) => sanitizeForExam(p, lang));
  }

  /**
   * 모의고사 — 학습과 같은 방식으로 per-step 제출.
   * choice를 선택하면 attempt 생성 + isCorrect/distractorType/rationale 즉시 반환.
   * 학습페이지의 study-sessions/:id/answer 와 동일한 흐름.
   */
  async submitStepAnswer(userId: string, resultId: string, dto: {
    problemId: string; choiceId: string;
    stepIndex: number; durationSec: number; confidence?: number;
  }, lang: Lang = 'ko') {
    const attempt = await this.attempts.create(userId, {
      problemId: dto.problemId,
      answer: '',
      durationSec: dto.durationSec,
      confidence: dto.confidence,
      stepIndex: dto.stepIndex,
      choiceId: dto.choiceId,
      context: SessionContext.EXAM,
      mockExamResultId: resultId,
    });
    const choice = await this.prisma.problemChoice.findUnique({
      where: { id: dto.choiceId },
      select: {
        id: true, choiceIndex: true, text: true, isCorrect: true, distractorType: true, rationale: true,
        step: { select: { stepIndex: true, problem: { select: { source: true } } } },
      },
    });
    if (choice && lang !== 'ko' && choice.step) {
      const key = `${choice.step.problem.source}:${choice.step.stepIndex}:${choice.choiceIndex}`;
      const en = CHOICE_EN[key];
      if (en) return { ...attempt, choice: { ...choice, text: en.text, rationale: en.rationale ?? null } };
    }
    return { ...attempt, choice };
  }

  /**
   * 모의고사 종료 — 저장된 attempt 들로부터 점수 산출.
   * (학습형 per-step 흐름에서 모든 문제 완료 시 호출)
   */
  async finalize(userId: string, resultId: string) {
    const result = await this.prisma.mockExamResult.findFirstOrThrow({
      where: { id: resultId, userId },
      include: { attempts: { include: { choice: true } }, mockExam: { select: { totalProblems: true } } },
    });
    // 한 문제당 모든 단계가 정답이어야 정답으로 카운트 (mock 채점: 부분 점수 X).
    // 단일 step 만 응시한 경우(예: AI Diagnostic) 도 동일 기준 적용 — totalSteps.size == correctSteps.size.
    const byProblem = new Map<string, { correctSteps: Set<number>; totalSteps: Set<number> }>();
    for (const a of result.attempts) {
      if (!a.stepIndex || !a.choice) continue;
      const cur = byProblem.get(a.problemId) ?? { correctSteps: new Set(), totalSteps: new Set() };
      cur.totalSteps.add(a.stepIndex);
      if (a.choice.isCorrect) cur.correctSteps.add(a.stepIndex);
      byProblem.set(a.problemId, cur);
    }
    let correctCount = 0;
    for (const [, v] of byProblem) {
      if (v.totalSteps.size > 0 && v.correctSteps.size === v.totalSteps.size) correctCount += 1;
    }
    // totalProblems: 시작 시점 의도된 문제 수 (mockExam.totalProblems) 우선,
    //   응시 attempt 가 그보다 적으면 attempt 기준.
    const intendedTotal = result.mockExam?.totalProblems ?? 0;
    const attemptedTotal = byProblem.size;
    const totalProblems = Math.max(intendedTotal, attemptedTotal, 1);
    const score = Math.round((correctCount / totalProblems) * 100);
    const grade = score >= 96 ? 1 : score >= 88 ? 2 : score >= 78 ? 3 : score >= 65 ? 4 : score >= 50 ? 5 : score >= 33 ? 6 : 7;
    const percentile = Math.min(99, Math.max(1, score));
    const durationMin = Math.max(1, Math.round(
      result.attempts.reduce((s, a) => s + (a.durationSec ?? 0), 0) / 60,
    ));
    const saved = await this.repo.saveResult(resultId, { score, grade, percentile, durationMin });
    return {
      ...saved,
      correctCount,
      totalProblems,
      attemptedProblems: attemptedTotal,
    };
  }

  /**
   * 모의고사 제출 (레거시 — 한 번에 모든 답안 제출).
   *   1) 각 답안을 Attempt로 저장 (context: EXAM, mockExamResultId 연결)
   *      → attempt.completed 이벤트가 mastery·activity·wrong-note 자동 갱신
   *   2) totalScore 기반 등급/백분위 계산 후 MockExamResult 업데이트
   *
   * 결과로 mastery score는 단원별로 PFA에 따라 변동, DailyActivity는 풀이수·시간 누적.
   */
  async submit(userId: string, resultId: string, dto: SubmitExamDto) {
    // 각 답안 → Attempt 생성 (이벤트 발행 → 리스너 연쇄 갱신)
    // 객관식 모드: 한 문제당 3개 choiceId → 3개 Attempt(stepIndex 1/2/3)
    // 단일 답안 모드: 1개 Attempt
    for (const a of dto.answers) {
      if (a.choiceIds && a.choiceIds.length > 0) {
        const perStepDuration = Math.max(1, Math.round(a.durationSec / a.choiceIds.length));
        for (let i = 0; i < a.choiceIds.length; i++) {
          await this.attempts.create(userId, {
            problemId: a.problemId,
            answer: '',
            durationSec: perStepDuration,
            confidence: a.confidence,
            stepIndex: i + 1,
            choiceId: a.choiceIds[i],
            context: SessionContext.EXAM,
            mockExamResultId: resultId,
          });
        }
      } else {
        await this.attempts.create(userId, {
          problemId: a.problemId,
          answer: a.answer,
          durationSec: a.durationSec,
          confidence: a.confidence,
          context: SessionContext.EXAM,
          mockExamResultId: resultId,
        });
      }
    }
    const graded = await this.grading.grade(userId, resultId, dto);
    return this.repo.saveResult(resultId, graded);
  }
}
