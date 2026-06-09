/** Concept-lesson step styling — WCAG AA-friendly: dark text on light tints. */
export type StepTone = {
  eyebrow: string;
  chipBg: string;
  chipColor: string;
  accent: string;
};

export const STEP_TONE: Record<string, StepTone> = {
  HOOK: {
    eyebrow: 'HOOK',
    chipBg: 'var(--p-primary-tint)',
    chipColor: 'var(--p-primary)',
    accent: 'var(--p-primary)',
  },
  CONCRETE: {
    eyebrow: 'CONCRETE',
    chipBg: 'var(--p-accent-tint)',
    chipColor: 'oklch(0.40 0.11 65)',
    accent: 'var(--p-accent)',
  },
  PICTORIAL: {
    eyebrow: 'PICTORIAL',
    chipBg: 'oklch(0.96 0.018 200)',
    chipColor: 'oklch(0.36 0.06 200)',
    accent: 'oklch(0.52 0.07 200)',
  },
  ABSTRACT: {
    eyebrow: 'ABSTRACT',
    chipBg: 'var(--p-surface-2)',
    chipColor: 'var(--p-ink-2)',
    accent: 'var(--p-border-strong)',
  },
  WORKED_EXAMPLE: {
    eyebrow: 'WORKED EXAMPLE',
    chipBg: 'var(--p-accent-tint)',
    chipColor: 'oklch(0.40 0.11 65)',
    accent: 'var(--p-accent)',
  },
  GUIDED_PRACTICE: {
    eyebrow: 'GUIDED PRACTICE',
    chipBg: 'var(--p-primary-tint)',
    chipColor: 'var(--p-primary)',
    accent: 'var(--p-primary)',
  },
  RETRIEVAL: {
    eyebrow: 'RETRIEVAL',
    chipBg: 'var(--p-success-tint)',
    chipColor: 'var(--p-success)',
    accent: 'var(--p-success)',
  },
  MISCONCEPTION: {
    eyebrow: 'COMMON MISTAKE',
    chipBg: 'var(--p-danger-tint)',
    chipColor: 'var(--p-danger)',
    accent: 'var(--p-danger)',
  },
  REFLECT: {
    eyebrow: 'REFLECT',
    chipBg: 'var(--p-surface-2)',
    chipColor: 'var(--p-ink-2)',
    accent: 'var(--p-muted)',
  },
};

export const DEFAULT_STEP_TONE = STEP_TONE.ABSTRACT;