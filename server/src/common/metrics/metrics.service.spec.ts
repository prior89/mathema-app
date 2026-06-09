import { register } from 'prom-client';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let svc: MetricsService;

  beforeEach(() => {
    register.clear();
    svc = new MetricsService();
  });

  it('registers custom matheo_* metrics on the default registry', async () => {
    svc.observeAdaptiveItems(7, 'IN');
    svc.incWnConflict();
    svc.incFirstSessionAchievement('FIRST_PRACTICE_CORRECT');
    svc.incPushDelivery('sent', 'streak.reminder');

    const text = await register.metrics();
    expect(text).toContain('matheo_diagnostic_adaptive_items_total');
    expect(text).toContain('matheo_review_scheduler_wn_conflict_total');
    expect(text).toContain('matheo_first_session_achievement_total');
    expect(text).toContain('matheo_push_delivery_total');
  });
});