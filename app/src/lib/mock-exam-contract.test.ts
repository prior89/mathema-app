import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  api: { post: vi.fn() },
}));

vi.mock('./api', () => apiMocks);

import { startRecommendedExam } from './mutations';
import { fetchMockResultDetail } from './queries';

describe('recommended weak-area exam API contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts the existing backend-recommended exam endpoint', async () => {
    apiMocks.post.mockResolvedValue({ resultId: null, problems: [] });

    await startRecommendedExam();

    expect(apiMocks.post).toHaveBeenCalledWith('/mock-exams/recommended/start');
  });

  it('loads the persisted result detail used by the report/retest actions', async () => {
    const response = {
      id: 'result-1',
      type: 'RECOMMENDED',
      problems: [],
      weakAreas: [{
        conceptId: 'concept-1',
        code: 'ALG-01',
        name: '일차방정식',
        problemCount: 4,
        incorrectProblems: 2,
        accuracyPct: 50,
      }],
      scoreDelta: 8,
    };
    apiMocks.get.mockResolvedValue(response);

    await expect(fetchMockResultDetail('result-1')).resolves.toBe(response);

    expect(apiMocks.get).toHaveBeenCalledWith('/mock-exams/results/result-1');
  });
});
