import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Modal from '../Modal';
import {
  celebrateFirstSessionAchievement,
  fetchFirstSessionAchievements,
  type FirstSessionAchievement,
  type FirstSessionAchievementKind,
} from '../../lib/queries';
import { useFeatureFlag } from '../../hooks/useFeatureFlags';
import { useT } from '../../lib/i18n';
import { Glyph } from '../onboarding/Glyph';

function achievementCopy(kind: FirstSessionAchievementKind, t: ReturnType<typeof useT>['t']) {
  switch (kind) {
    case 'FIRST_CONCEPT_STEP':
      return { title: t('achievement.firstConcept.title'), body: t('achievement.firstConcept.body') };
    case 'FIRST_PRACTICE_CORRECT':
      return { title: t('achievement.firstCorrect.title'), body: t('achievement.firstCorrect.body') };
    case 'FIRST_WRONGNOTE_MASTERED':
      return { title: t('achievement.firstMastered.title'), body: t('achievement.firstMastered.body') };
  }
}

export function FirstAchievementModal() {
  const { t } = useT();
  const enabled = useFeatureFlag('first_session_achievement');
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchFirstSessionAchievements,
    enabled,
    refetchInterval: enabled ? 15_000 : false,
  });

  const pending = useMemo(
    () => (q.data ?? []).find((a: FirstSessionAchievement) => !a.celebratedAt) ?? null,
    [q.data],
  );

  const celebrate = useMutation({
    mutationFn: (kind: FirstSessionAchievementKind) => celebrateFirstSessionAchievement(kind),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['achievements'] }),
  });

  if (!enabled || !pending) return null;

  const copy = achievementCopy(pending.kind, t);

  return (
    <Modal
      open
      onClose={() => celebrate.mutate(pending.kind)}
      subtitle={t('achievement.modal.eyebrow')}
      title={copy.title}
      width={480}
    >
      <div style={{ position: 'relative', marginBottom: 8 }}>
        <div className="fb-confetti" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`fb-confetti-bit b${i}`} />
          ))}
        </div>
        <div className="fb-icon celebrate" aria-hidden>🎉</div>
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--p-ink-2)', margin: '0 0 20px', textAlign: 'center' }}>
        {copy.body}
      </p>
      <button
        className="btn"
        onClick={() => celebrate.mutate(pending.kind)}
        disabled={celebrate.isPending}
        style={{ width: '100%' }}
      >
        {t('achievement.modal.cta')}
        <Glyph.ChevronR />
      </button>
    </Modal>
  );
}