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

/** Named mastery tiers (Khan-style ladder) layered over the raw 0-100 score so
 *  each band reads as a legible milestone instead of an opaque number. Bands
 *  deliberately mirror scoreToHeatmapStyle so tint and label always agree. */
export type MasteryTierKey =
  | 'mastery.tier.notStarted'
  | 'mastery.tier.started'
  | 'mastery.tier.practicing'
  | 'mastery.tier.proficient'
  | 'mastery.tier.mastered';

export function scoreToTierKey(score: number, studied: boolean): MasteryTierKey {
  if (!studied) return 'mastery.tier.notStarted';
  const s = Math.max(0, Math.min(100, score));
  if (s < 40) return 'mastery.tier.started';
  if (s < 60) return 'mastery.tier.practicing';
  if (s < 80) return 'mastery.tier.proficient';
  return 'mastery.tier.mastered';
}