/** Stored in FirstSessionPlan.cards JSON (PR-07). */
export type FirstSessionCard = {
  chapterCode: string;
  label: string;
  route: string;
  priority: number;
};

export type SeedPlacementInput = {
  recommendedChapterCodes: string[];
  weakConceptIds?: string[];
  estimatedGradeBand?: string;
};