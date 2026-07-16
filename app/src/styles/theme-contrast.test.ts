import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

type Rgb = { r: number; g: number; b: number };
type Tokens = Record<string, string>;
const css = readFileSync(new URL('./onboarding.css', import.meta.url), 'utf8');

function cssBlock(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escaped}\\s*\\{`).exec(css);
  const start = match?.index ?? -1;
  if (start < 0) throw new Error(`Missing ${selector} block`);
  const open = css.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  throw new Error(`Unclosed ${selector} block`);
}

function cssBlocks(selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...css.matchAll(new RegExp(`${escaped}\\s*\\{`, 'g'))];
  return matches.map((match) => {
    const open = css.indexOf('{', match.index);
    let depth = 0;
    for (let i = open; i < css.length; i += 1) {
      if (css[i] === '{') depth += 1;
      if (css[i] === '}') {
        depth -= 1;
        if (depth === 0) return css.slice(open + 1, i);
      }
    }
    throw new Error(`Unclosed ${selector} block`);
  });
}

function tokensFor(selector: string): Tokens {
  return Object.fromEntries(
    [...cssBlock(selector).matchAll(/(--p-[\w-]+)\s*:\s*([^;]+);/g)]
      .map((match) => [match[1], match[2].trim()]),
  );
}

function hex(value: string): Rgb {
  const match = value.match(/^#([0-9a-f]{6})$/i);
  if (!match) throw new Error(`Expected a six-digit hex color, got ${value}`);
  return {
    r: Number.parseInt(match[1].slice(0, 2), 16),
    g: Number.parseInt(match[1].slice(2, 4), 16),
    b: Number.parseInt(match[1].slice(4, 6), 16),
  };
}

function luminance(color: Rgb): number {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const first = luminance(hex(a));
  const second = luminance(hex(b));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function expectPair(tokens: Tokens, foreground: string, background: string, minimum: number) {
  expect(
    contrast(tokens[foreground], tokens[background]),
    `${foreground} on ${background}`,
  ).toBeGreaterThanOrEqual(minimum);
}

describe.each([':root', '.dark'])('%s theme contrast contract', (selector) => {
  const tokens = tokensFor(selector);

  it('keeps normal text at WCAG AA contrast', () => {
    for (const background of ['--p-bg', '--p-surface']) {
      expectPair(tokens, '--p-ink', background, 4.5);
      expectPair(tokens, '--p-ink-2', background, 4.5);
      expectPair(tokens, '--p-muted', background, 4.5);
    }
  });

  it('keeps filled controls and state labels readable', () => {
    expectPair(tokens, '--p-primary-fg', '--p-primary', 4.5);
    expectPair(tokens, '--p-secondary-fg', '--p-secondary', 4.5);
    expectPair(tokens, '--p-success-fg', '--p-success', 4.5);
    expectPair(tokens, '--p-danger-fg', '--p-danger', 4.5);
    expectPair(tokens, '--p-warning-fg', '--p-warning', 4.5);
    expectPair(tokens, '--p-primary', '--p-primary-tint', 4.5);
    expectPair(tokens, '--p-secondary-ink', '--p-secondary-tint', 4.5);
    expectPair(tokens, '--p-success-ink', '--p-success-tint', 4.5);
    expectPair(tokens, '--p-danger-ink', '--p-danger-tint', 4.5);
    expectPair(tokens, '--p-warning-ink', '--p-warning-tint', 4.5);
    expectPair(tokens, '--p-accent-ink', '--p-surface', 4.5);
    expectPair(tokens, '--p-success', '--p-success-tint', 4.5);
    expectPair(tokens, '--p-danger', '--p-danger-tint', 4.5);
  });

  it('keeps control boundaries distinguishable', () => {
    expectPair(tokens, '--p-border-strong', '--p-surface', 3);
  });
});

describe('theme token hygiene', () => {
  it('has a single dark palette and no undefined p-tokens', () => {
    expect(css.match(/\.dark\s*\{/g) ?? []).toHaveLength(1);
    const definitions = new Set([...css.matchAll(/(--p-[\w-]+)\s*:/g)].map((m) => m[1]));
    const uses = new Set([...css.matchAll(/var\((--p-[\w-]+)/g)].map((m) => m[1]));
    expect([...uses].filter((token) => !definitions.has(token))).toEqual([]);
  });

  it('does not reintroduce light-only surfaces on adaptive screens', () => {
    const adaptiveSelectors = [
      '.age-pill',
      '.login-form-panel',
      '.welcome-benefits > span',
      '.mathema-app .tabbar',
      '.solver-hero',
      '.formula-chip',
      '.chapter-node',
      '.practice-intro',
      '.practice-launch-card',
      '.practice-steps > div',
      '.notes-intro',
      '.notes-screen .stat',
      '.note-card',
    ];
    const lightOnlyBackground = /background(?:-color)?\s*:\s*(?:white\b|#fff(?:fff)?\b|rgba?\(\s*255\s*,\s*255\s*,\s*255)/i;

    for (const selector of adaptiveSelectors) {
      const blocks = cssBlocks(selector);
      expect(blocks.length, `missing ${selector}`).toBeGreaterThan(0);
      for (const block of blocks) expect(block, selector).not.toMatch(lightOnlyBackground);
    }
  });

  it('keeps small hero copy readable at every gradient stop', () => {
    const tokens = tokensFor(':root');
    const heroSelectors = [
      '.mission-list .mission-card:first-of-type',
      '.learn-intro',
      '.review-hero',
    ];

    for (const selector of heroSelectors) {
      const block = cssBlock(selector);
      const stops = [...block.matchAll(/#[0-9a-f]{6}\b/gi)].map((match) => match[0]);
      expect(stops.length, `missing gradient stops for ${selector}`).toBeGreaterThanOrEqual(3);
      for (const stop of stops) {
        expect(contrast(tokens['--p-hero-fg'], stop), `${selector} hero text on ${stop}`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(tokens['--p-hero-muted'], stop), `${selector} hero copy on ${stop}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('keeps the math-orbit symbol readable in every visual variant', () => {
    const tokens = tokensFor(':root');
    const variants = ['.learning-orbit', '.learning-orbit.teal', '.learning-orbit.sunny'];
    for (const selector of variants) {
      const block = cssBlock(selector);
      const stops = [...block.matchAll(/--orbit-[ab]:\s*(#[0-9a-f]{6})/gi)].map((match) => match[1]);
      expect(stops, selector).toHaveLength(2);
      for (const stop of stops) {
        expect(contrast(tokens['--p-hero-fg'], stop), `${selector} symbol on ${stop}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
