import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

/** Prometheus custom metrics — uses the default registry wired in main.ts /metrics. */
@Injectable()
export class MetricsService {
  private readonly adaptiveItems: Histogram<'country'>;
  private readonly wnConflict: Counter;
  private readonly firstSessionAchievement: Counter<'kind'>;
  private readonly pushDelivery: Counter<'status' | 'type'>;

  constructor() {
    this.adaptiveItems = new Histogram({
      name: 'matheo_diagnostic_adaptive_items_total',
      help: 'Adaptive diagnostic items answered per finished session',
      labelNames: ['country'],
      buckets: [3, 5, 8, 10, 12, 15, 20],
      registers: [register],
    });

    this.wnConflict = new Counter({
      name: 'matheo_review_scheduler_wn_conflict_total',
      help: 'WrongNote due 3-consumer mismatch detections (must stay 0)',
      registers: [register],
    });

    this.firstSessionAchievement = new Counter({
      name: 'matheo_first_session_achievement_total',
      help: 'First-session achievements newly awarded',
      labelNames: ['kind'],
      registers: [register],
    });

    this.pushDelivery = new Counter({
      name: 'matheo_push_delivery_total',
      help: 'FCM push delivery attempts by outcome',
      labelNames: ['status', 'type'],
      registers: [register],
    });
  }

  observeAdaptiveItems(count: number, country: 'IN' | 'KR' = 'IN') {
    if (count > 0) this.adaptiveItems.observe({ country }, count);
  }

  incWnConflict() {
    this.wnConflict.inc();
  }

  incFirstSessionAchievement(kind: string) {
    this.firstSessionAchievement.inc({ kind });
  }

  incPushDelivery(status: 'sent' | 'failed' | 'disabled', type = 'unknown') {
    this.pushDelivery.inc({ status, type });
  }
}