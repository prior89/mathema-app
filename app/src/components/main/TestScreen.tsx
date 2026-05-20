/* Test tab — entry point for the wrong-note review queue.
 *
 * The actual review (FIFO + 3-day cooldown + sequential gate) lives in
 * ReviewQueueScreen. This tab shows the current queue depth and routes the
 * user there. Auto-scheduled weekly/monthly reviews (cron) are a follow-up;
 * for now reviews are user-triggered.
 */
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchReviewQueueNext } from '../../lib/queries';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

export function TestScreen() {
  const nav = useNavigate();
  const queue = useQuery({ queryKey: ['queue-next'], queryFn: fetchReviewQueueNext });

  const ready = queue.data?.totalEligible ?? 0;
  const queueEmpty = queue.data && !queue.data.wrongNote;
  const hasPending = !!queue.data?.wrongNote;

  let nextCountdown: string | null = null;
  if (queueEmpty && queue.data?.nextEligibleAt) {
    const ms = new Date(queue.data.nextEligibleAt).getTime() - Date.now();
    if (ms > 0) {
      const h = Math.floor(ms / 3_600_000);
      const d = Math.floor(h / 24);
      nextCountdown = d > 0 ? `${d} day${d === 1 ? '' : 's'}` : `${h} hour${h === 1 ? '' : 's'}`;
    }
  }

  return (
    <div className="screen">
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="app-head" style={{ paddingBottom: 0 }}>
          <div>
            <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>Review</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>Test</div>
          </div>
        </div>

        <div style={{ padding: '12px 22px 0' }}>
          <div
            className="card"
            style={{ background: 'var(--p-primary-tint)', borderColor: 'transparent' }}
          >
            <div style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', color: 'var(--p-primary)', fontWeight: 700 }}>
              WRONG-NOTE QUEUE
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 4, color: 'var(--p-ink)', letterSpacing: '-0.005em' }}>
              {queue.isLoading
                ? 'Loading…'
                : hasPending
                  ? `${ready} ${ready === 1 ? 'problem' : 'problems'} ready`
                  : 'All caught up'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--p-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              {hasPending
                ? 'Solve them one by one — oldest first'
                : nextCountdown
                  ? `Next unlocks in ${nextCountdown}`
                  : 'Practice more chapters in Study to grow the queue'}
            </div>
            <button
              className="btn"
              disabled={!hasPending}
              onClick={() => nav('/app/review')}
              style={{ marginTop: 12, height: 44, fontSize: 13 }}
            >
              {hasPending ? 'Start review' : 'Nothing to review yet'}
              <Glyph.ChevronR />
            </button>
          </div>

          {/* Rule reminder — explains the 3-day cooldown + forced order. */}
          <div className="section-h">
            <span className="label">How this works</span>
          </div>
          <div className="card" style={{ padding: 14, fontSize: 13, lineHeight: 1.55, color: 'var(--p-ink-2)' }}>
            Wrong notes ripen for <strong style={{ color: 'var(--p-ink)' }}>three days</strong> before
            you can re-try them — long enough to learn the concept first, short
            enough to keep memory fresh. You solve them <strong style={{ color: 'var(--p-ink)' }}>one at a time</strong>{' '}
            in the order they were added. Hints unlock after three wrong tries
            on the same problem. Auto-scheduled weekly reviews are{' '}
            <span className="chip" style={{ padding: '1px 6px', fontSize: 10.5 }}>Coming soon</span>.
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <TabBar />
    </div>
  );
}
