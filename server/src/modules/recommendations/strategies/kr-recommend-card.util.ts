import { Lang } from '../../../common/i18n/current-lang.decorator';

export type KrRecommendCard = {
  tag: string;
  tagColor: string;
  unit: string;
  title: string;
  reason: string;
  time: string;
  type: string;
  icon: string;
  unitId: null;
  chapterCode: string;
  route: string;
};

type ChapterLabels = { chapterCode: string; titleKo: string; titleEn: string | null };

export function chapterLabel(labels: ChapterLabels, lang: Lang): string {
  if (lang === 'ko') return labels.titleKo || labels.titleEn || labels.chapterCode;
  return labels.titleEn || labels.titleKo || labels.chapterCode;
}

export function buildKrCard(
  labels: ChapterLabels,
  lang: Lang,
  variant: 'focus' | 'reinforce' | 'maintain',
  detail: { occurrences?: number; noteCount?: number; progressPct?: number; gapPct?: number },
): KrRecommendCard {
  const label = chapterLabel(labels, lang);
  const route = `/app/learn/${labels.chapterCode}`;

  if (variant === 'focus') {
    const occ = detail.occurrences ?? 0;
    const notes = detail.noteCount ?? 0;
    const min = Math.min(45, 8 + occ * 2);
    if (lang === 'ko') {
      return {
        tag: '오답 집중',
        tagColor: '#8B3A1F',
        unit: label,
        title: `${label} 오답 복습`,
        reason: `누적 오답 ${occ}회 (${notes}문제) — 즉시 보강 필요`,
        time: `${min}분`,
        type: '인터랙티브 학습',
        icon: 'Layers',
        unitId: null,
        chapterCode: labels.chapterCode,
        route,
      };
    }
    return {
      tag: 'Focus mistakes',
      tagColor: '#8B3A1F',
      unit: label,
      title: `Review mistakes in ${label}`,
      reason: `${occ} missed attempts across ${notes} problems — reinforce now`,
      time: `${min} min`,
      type: 'Interactive practice',
      icon: 'Layers',
      unitId: null,
      chapterCode: labels.chapterCode,
      route,
    };
  }

  if (variant === 'reinforce') {
    const score = detail.progressPct ?? 0;
    const gap = detail.gapPct ?? 0;
    const time = score < 40 ? (lang === 'ko' ? '30분' : '30 min')
      : score < 60 ? (lang === 'ko' ? '20분' : '20 min')
        : (lang === 'ko' ? '15분' : '15 min');
    if (lang === 'ko') {
      return {
        tag: '약점 보강',
        tagColor: '#B45309',
        unit: `${label} · 핵심 개념`,
        title: `${label} 이어서 학습`,
        reason: gap > 0
          ? `진도 ${score}% — 목표 대비 ${gap}%p 부족`
          : `진도 ${score}% — 안정 단계로 끌어올리기`,
        time,
        type: '개념 학습',
        icon: 'Eye',
        unitId: null,
        chapterCode: labels.chapterCode,
        route,
      };
    }
    return {
      tag: 'Strengthen weak spot',
      tagColor: '#B45309',
      unit: `${label} · core concepts`,
      title: `Continue ${label}`,
      reason: gap > 0
        ? `Progress ${score}% — ${gap}%p below target`
        : `Progress ${score}% — build a stable foundation`,
      time,
      type: 'Concept lesson',
      icon: 'Eye',
      unitId: null,
      chapterCode: labels.chapterCode,
      route,
    };
  }

  const score = detail.progressPct ?? 0;
  if (lang === 'ko') {
    return {
      tag: '강점 유지',
      tagColor: '#4A5D3A',
      unit: `${label} · 실전 응용`,
      title: `${label} 심화 도전`,
      reason: `진도 ${score}% 유지·심화를 위해`,
      time: '45분',
      type: '실전 문제',
      icon: 'Zap',
      unitId: null,
      chapterCode: labels.chapterCode,
      route,
    };
  }
  return {
    tag: 'Maintain strength',
    tagColor: '#4A5D3A',
    unit: `${label} · advanced practice`,
    title: `Challenge yourself in ${label}`,
    reason: `Keep momentum at ${score}% progress`,
    time: '45 min',
    type: 'Practice',
    icon: 'Zap',
    unitId: null,
    chapterCode: labels.chapterCode,
    route,
  };
}