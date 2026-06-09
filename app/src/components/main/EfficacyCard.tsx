import { useQuery } from '@tanstack/react-query';
import { fetchEfficacy, type StudentEfficacyCard } from '../../lib/queries';
import { useT } from '../../lib/i18n';
import { useFeatureFlag } from '../../hooks/useFeatureFlags';

export function EfficacyCard({ compact = false }: { compact?: boolean }) {
  const { t } = useT();
  const enabled = useFeatureFlag('student_efficacy_card');
  const q = useQuery({
    queryKey: ['efficacy'],
    queryFn: fetchEfficacy,
    enabled,
    staleTime: 30 * 60_000,
  });

  if (!enabled) return null;
  if (q.isLoading) {
    return (
      <div className="card" style={{ padding: compact ? 14 : 16, marginTop: compact ? 0 : 12 }}>
        <div style={{ fontSize: 12, color: 'var(--p-muted)' }}>{t('efficacy.loading')}</div>
      </div>
    );
  }
  if (q.isError || !q.data) return null;

  return <EfficacyCardBody data={q.data} compact={compact} />;
}

function EfficacyCardBody({ data, compact }: { data: StudentEfficacyCard; compact?: boolean }) {
  const { t } = useT();

  return (
    <div
      className="card"
      style={{
        padding: compact ? 14 : 16,
        marginTop: compact ? 0 : 12,
        background: 'linear-gradient(135deg, var(--p-primary-tint) 0%, var(--p-surface) 55%)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{t('efficacy.title')}</span>
        {data.northStarPct != null && (
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--p-muted)' }}>
            {t('efficacy.cohort', { n: data.cohortSize })}
          </span>
        )}
      </div>

      <div style={{ fontSize: compact ? 13 : 14, lineHeight: 1.5, color: 'var(--p-ink-2)', marginBottom: 12 }}>
        {data.message}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        <MiniStat label={t('efficacy.chapters')} value={String(data.chaptersMastered)} />
        <MiniStat label={t('efficacy.streak')} value={t('efficacy.streakDays', { n: data.streakDays })} />
        <MiniStat label={t('efficacy.wrongNotes')} value={`${data.wrongNotesMasteredPct}%`} />
        <MiniStat
          label={t('efficacy.patterns')}
          value={String(data.errorPatternsImproving)}
        />
      </div>

      {data.northStarPct != null && (
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--p-muted)', fontFamily: 'var(--font-mono)' }}>
          {t('efficacy.northStar', { pct: data.northStarPct })}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 10, background: 'var(--p-surface)', border: '1px solid var(--p-border)' }}>
      <div style={{ fontSize: 10, color: 'var(--p-muted)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{value}</div>
    </div>
  );
}