import type { AttemptAnalysis } from '../../infrastructure/ai/prompts/attempt-analyze.prompt';
import {
  inferConfidenceCalibration,
  mapAttemptAnalysisToInsightJson,
  WrongNoteInsightJsonSchema,
} from './wrong-note-insight.mapper';

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