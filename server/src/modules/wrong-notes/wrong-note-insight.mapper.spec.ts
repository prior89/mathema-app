import type { AttemptAnalysis } from '../../infrastructure/ai/prompts/attempt-analyze.prompt';
import {
  buildFallbackInsight,
  inferConfidenceCalibration,
  mapAttemptAnalysisToInsightJson,
  WrongNoteInsightJsonSchema,
} from './wrong-note-insight.mapper';

describe('buildFallbackInsight (LLM-free why-wrong)', () => {
  it('produces a schema-valid insight from error code + concept + formula', () => {
    const r = buildFallbackInsight(
      { errorTypeRaw: 'SIGN', problemConcept: '이차방정식의 근', problemFormula: 'x = (-b±√(b²-4ac))/2a' },
      'ko',
    );
    expect(() => WrongNoteInsightJsonSchema.parse(r)).not.toThrow();
    expect(r.correctConcept).toBe('이차방정식의 근');
    expect(r.similarPatterns).toContain('부호 실수');
    expect(r.drillSteps.length).toBeGreaterThanOrEqual(1);
    expect(r.drillSteps.some((s) => s.includes('x = (-b'))).toBe(true); // formula step
  });

  it('is valid even with no error code, concept, or formula (worst case)', () => {
    const r = buildFallbackInsight({}, 'en');
    expect(() => WrongNoteInsightJsonSchema.parse(r)).not.toThrow();
    expect(r.similarPatterns).toEqual([]);
    expect(r.drillSteps.length).toBeGreaterThanOrEqual(1);
    expect(r.lang).toBe('en');
  });

  it('maps hi -> en for the insight lang enum', () => {
    expect(buildFallbackInsight({ errorTypeRaw: 'CALC' }, 'hi').lang).toBe('en');
  });

  // The goal: the cause must read as specific sentences, not a one-word label.
  it('gives a rich, multi-sentence, concept-anchored cause (not one word)', () => {
    const r = buildFallbackInsight({ errorTypeRaw: 'SIGN', problemConcept: '이차방정식의 근' }, 'ko');
    expect(r.rootCause.length).toBeGreaterThan(40);          // not a one-liner label
    expect(r.rootCause).toContain('부호');                   // the specific mechanism
    expect(r.rootCause).toContain('이차방정식의 근');         // anchored to the concept
    expect(r.rootCause).not.toContain('유형에서 막혔');      // the old thin template is gone
    // First drill step is the TARGETED remedy for this error, not generic.
    expect(r.drillSteps[0]).toContain('부호');
  });

  it('different error codes yield different, specific causes', () => {
    const codes = ['SIGN', 'CALC', 'CON', 'FORMULA', 'GRAPH', 'UNIT', 'ALG', 'LOGIC'];
    const causes = codes.map((c) => buildFallbackInsight({ errorTypeRaw: c }, 'ko').rootCause);
    expect(new Set(causes).size).toBe(codes.length);          // all distinct
    for (const c of causes) expect(c.length).toBeGreaterThan(30);
  });

  // The prod WrongNote.errorType is the Prisma ErrorType ENUM, not a mechanism
  // code. All 220 live notes are CONCEPT_MISUNDERSTANDING or CALCULATION_MISTAKE —
  // both MUST resolve to a rich, mechanism-specific cause, not the generic fallback.
  it('resolves the real prod ErrorType enum values to rich, distinct causes', () => {
    const concept = buildFallbackInsight({ errorTypeRaw: 'CONCEPT_MISUNDERSTANDING' }, 'ko');
    const calc = buildFallbackInsight({ errorTypeRaw: 'CALCULATION_MISTAKE' }, 'ko');
    expect(concept.rootCause.length).toBeGreaterThan(40);
    expect(calc.rootCause.length).toBeGreaterThan(40);
    expect(concept.rootCause).not.toEqual(calc.rootCause);   // not both the generic template
    expect(calc.rootCause).not.toContain('유형에서 막혔');    // the old thin label is gone
  });

  it('even the no-error-code case gives an actionable sentence, not a label', () => {
    const r = buildFallbackInsight({ problemConcept: '삼각비' }, 'ko');
    expect(r.rootCause.length).toBeGreaterThan(30);
    expect(r.rootCause).toContain('삼각비');
  });
});

describe('wrong-note-insight.mapper', () => {
  const baseAnalysis: AttemptAnalysis = {
    errorCodes: ['ALG', 'SIGN'],
    conceptWeakness: ['chain_rule'],
    reasoningSummary: '학생이 부호를 뒤집은 뒤 전개를 잘못했습니다.',
    recommendedAction: '부호 규칙을 다시 확인하고 한 줄씩 전개해보세요.',
    confidenceScore: 0.9,
  };

  it('maps AttemptAnalysis fields into insightJson schema', () => {
    const json = mapAttemptAnalysisToInsightJson({
      analysis: baseAnalysis,
      conceptTags: ['derivatives'],
      expectedSolutionSteps: ['Step 1: factor', 'Step 2: simplify'],
      isCorrect: false,
      selfConfidenceScore: 5,
      lang: 'ko',
    });

    expect(WrongNoteInsightJsonSchema.safeParse(json).success).toBe(true);
    expect(json.rootCause).toBe(baseAnalysis.reasoningSummary);
    expect(json.correctConcept).toBe('chain_rule');
    expect(json.drillSteps[0]).toBe(baseAnalysis.recommendedAction);
    expect(json.similarPatterns).toEqual(['대수 변형 오류', '부호 실수']);
    expect(json.confidenceCalibration).toBe('over');
    expect(json.lang).toBe('ko');
  });

  it('falls back to conceptTags when conceptWeakness is empty', () => {
    const json = mapAttemptAnalysisToInsightJson({
      analysis: { ...baseAnalysis, conceptWeakness: [] },
      conceptTags: ['quadratic'],
      isCorrect: true,
      selfConfidenceScore: 2,
      lang: 'en',
    });
    expect(json.correctConcept).toBe('quadratic');
    expect(json.lang).toBe('en');
    expect(json.confidenceCalibration).toBe('under');
  });

  it('inferConfidenceCalibration handles neutral cases', () => {
    expect(inferConfidenceCalibration(true, 3)).toBe('aligned');
    expect(inferConfidenceCalibration(false, 2)).toBe('aligned');
  });
});