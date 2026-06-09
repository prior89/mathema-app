/** Sage design-system helpers — map server hex → CSS tokens where possible. */

const ERROR_DNA_HEX: Record<string, string> = {
  '#8B3A1F': 'var(--p-dna-concept)',
  '#B5552B': 'var(--p-dna-calc)',
  '#C97B4A': 'var(--p-dna-time)',
  '#A89684': 'var(--p-dna-other)',
  '#B45309': 'var(--p-dna-calc)',
  '#4A5D3A': 'var(--p-success)',
};

export function resolveBarColor(serverColor: string): string {
  const key = serverColor.trim().toUpperCase();
  return ERROR_DNA_HEX[key] ?? serverColor;
}

export type HeatmapCellStyle = { bg: string; fg: string };

/** Mastery score → readable tint bg + dark label (never white-on-saturated). */
export function scoreToHeatmapStyle(score: number, studied: boolean): HeatmapCellStyle {
  if (!studied) {
    return { bg: 'var(--p-heatmap-0-bg)', fg: 'var(--p-heatmap-0-fg)' };
  }
  const s = Math.max(0, Math.min(100, score));
  if (s < 40) return { bg: 'var(--p-heatmap-1-bg)', fg: 'var(--p-heatmap-1-fg)' };
  if (s < 60) return { bg: 'var(--p-heatmap-2-bg)', fg: 'var(--p-heatmap-2-fg)' };
  if (s < 80) return { bg: 'var(--p-heatmap-3-bg)', fg: 'var(--p-heatmap-3-fg)' };
  return { bg: 'var(--p-heatmap-4-bg)', fg: 'var(--p-heatmap-4-fg)' };
}

/** @deprecated Legacy dashboards — returns bg token only. */
export function scoreToColor(score: number): string {
  return scoreToHeatmapStyle(score, true).bg;
}