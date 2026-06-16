/**
 * Unit × mastery colour grid — sage tokens, readable contrast.
 */
import type { UnitBalance } from '../../lib/queries';
import { scoreToHeatmapStyle, scoreToColor } from '../../lib/palette';

export { scoreToColor };

const LABELS = {
  score: { ko: '이해도', en: 'Mastery', hi: 'दक्षता' },
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
  embeddedInCard?: boolean;
}) {
  const grid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
      {perUnit.map((u) => {
        const studied = u.studyTimeMin > 0;
        const cell = scoreToHeatmapStyle(u.score, studied);
        return (
          <div
            key={u.unitId}
            title={`${u.unitName}\n${L('score', lang)}: ${u.score}\n${L('time', lang)}: ${u.studyTimeMin}${L('minutes', lang)}\n${lang === 'ko' ? '표본' : lang === 'hi' ? 'नमूने' : 'samples'}: ${u.samples}`}
            style={{
              backgroundColor: cell.bg,
              color: cell.fg,
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid var(--p-border)',
              fontSize: 12,
              lineHeight: 1.3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 64,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 11 }}>
              {u.unitName.length > 18 ? `${u.unitName.slice(0, 16)}…` : u.unitName}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 16, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {studied ? u.score : '—'}
              </span>
              <span style={{ fontSize: 10, color: 'var(--p-muted)' }}>
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
    <div className="card" style={{ padding: '16px 18px', marginBottom: 16 }}>
      {grid}
    </div>
  );
}
