export type DisplayWeakArea = {
  key: string;
  name: string;
  accuracyPct: number | null;
  problemCount: number | null;
  incorrectProblems: number | null;
};

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** API responses can be cached across a rolling deploy. Keep the report usable
 * if an old response omits weakAreas or a malformed row slips through. */
export function normalizeWeakAreas(value: unknown): DisplayWeakArea[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((candidate, index) => {
    if (!candidate || typeof candidate !== 'object') return [];
    const row = candidate as Record<string, unknown>;
    const name = typeof row.name === 'string' ? row.name.trim() : '';
    if (!name) return [];
    const conceptId = typeof row.conceptId === 'string' ? row.conceptId : '';
    const code = typeof row.code === 'string' ? row.code : '';
    return [{
      key: conceptId || code || `${name}-${index}`,
      name,
      accuracyPct: finiteNumber(row.accuracyPct),
      problemCount: finiteNumber(row.problemCount),
      incorrectProblems: finiteNumber(row.incorrectProblems),
    }];
  });
}

export function normalizeScoreDelta(value: unknown): number | null {
  return finiteNumber(value);
}
