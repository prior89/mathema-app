/**
 * Unit × mastery colour grid — extracted from WeaknessDashboard (PR-11).
 * Consumes /recommendations/balance perUnit rows; reusable on MasteryScreen.
 */
import type { UnitBalance } from '../../lib/queries';

export const MASTERY_HEATMAP_COLORS = {
  ink: '#142850',
  sub: '#5C6B85',
  line: '#14285020',
  card: '#FAF7EF',
} as const;

/** mastery score 0–100 → heatmap cell colour (red → amber → green). */
export function scoreToColor(score: number): string {
  const clamped = Math.max(0, Math.min(100, score));
  if (clamped < 40) return '#D97757';
  if (clamped < 60) return '#E0A458';
  if (clamped < 80) return '#A4B574';
  return '#4A5D3A';
}

const LABELS = {
  score: { ko: '숙련도', en: 'Mastery', hi: 'दक्षता' },
  time: { ko: '시간', en: 'Time', hi: 'समय' },
  minutes: { ko: '분', en: 'min', hi: 'मिनट' },
  noStudyYet: { ko: '아직 시작 안 함', en: 'Not started', hi: 'शुरू नहीं किया' },
} as const;

function L(k: keyof typeof LABELS, lang: 'ko' | 'en' | 'hi'): string {
  return LABELS[k][lang] ?? LABELS[k].en;
}

export function MasteryHeatmap({
  perUnit,
  lang,
  embeddedInCard = true,
}: {
  perUnit: UnitBalance[];
  lang: 'ko' | 'en' | 'hi';
  /** When false, renders only the grid (parent supplies padding/border). */
  embeddedInCard?: boolean;
}) {
  const grid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
      {perUnit.map((u) => {
        const studied = u.studyTimeMin > 0;
        return (
          <div
            key={u.unitId}
            title={`${u.unitName}\n${L('score', lang)}: ${u.score}\n${L('time', lang)}: ${u.studyTimeMin}${L('minutes', lang)}\n${lang === 'ko' ? '표본' : lang === 'hi' ? 'नमूने' : 'samples'}: ${u.samples}`}
            style={{
              backgroundColor: studied ? scoreToColor(u.score) : '#D8D2C2',
              color: studied ? '#FAF7EF' : MASTERY_HEATMAP_COLORS.sub,
              padding: '10px 12px',
              borderRadius: 6,
              fontSize: 12,
              lineHeight: 1.3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 64,
            }}
          >
            <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 11, opacity: 0.95 }}>
              {u.unitName.length > 18 ? `${u.unitName.slice(0, 16)}…` : u.unitName}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 16, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                {studied ? u.score : '—'}
              </span>
              <span style={{ fontSize: 10, opacity: 0.85 }}>
                {studied ? `${u.studyTimeMin}${L('minutes', lang)}` : L('noStudyYet', lang)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (!embeddedInCard) return grid;

  return (
    <div style={{
      backgroundColor: MASTERY_HEATMAP_COLORS.card,
      border: `1px solid ${MASTERY_HEATMAP_COLORS.line}`,
      borderRadius: 8,
      padding: '20px 24px',
      marginBottom: 16,
    }}>
      {grid}
    </div>
  );
}