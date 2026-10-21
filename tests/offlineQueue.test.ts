import { describe, it, expect, beforeEach } from 'vitest';
import { offlineQueue } from '../src/data/offlineQueue';
import { MockAdapter } from '../src/data/MockAdapter';

describe('Offline Queue & Disconnected Capture Replay', () => {
  beforeEach(() => {
    offlineQueue.clearQueue();
  });

  it('queues offline transactions locally when disconnected', () => {
    expect(offlineQueue.getQueueCount()).toBe(0);

    const q1 = offlineQueue.enqueue({
      amountCents: 90000,
      railId: 'interop_qr',
      tillId: 'till-01',
      tillName: 'Till 01',
      cashierId: 'c1',
      cashierName: 'Alem T.',
      txRef: 'TXR-OFF-01',
    });

    expect(q1.localQueueId).toBeDefined();
    expect(q1.payload.isOffline).toBe(true);
    expect(offlineQueue.getQueueCount()).toBe(1);

    offlineQueue.enqueue({
      amountCents: 120000,
      railId: 'wallet_a',
      tillId: 'till-01',
      tillName: 'Till 01',
      cashierId: 'c1',
      cashierName: 'Alem T.',
      txRef: 'TXR-OFF-02',
    });

    expect(offlineQueue.getQueueCount()).toBe(2);
  });

  it('replays offline queue upon reconnection and detects duplicates', async () => {
    const adapter = new MockAdapter(8844);

    // Enqueue one regular offline item and one that collides with existing reference in seeded data
    offlineQueue.enqueue({
      amountCents: 145000,
      railId: 'wallet_a',
      tillId: 'till-01',
      tillName: 'Till 01 - Main Counter',
      cashierId: 'emp-01',
      cashierName: 'Alem T.',
      txRef: 'TXR-2026-8941', // Already exists in seeded data!
    });

    offlineQueue.enqueue({
      amountCents: 75000,
      railId: 'card_tap',
      tillId: 'till-01',
      tillName: 'Till 01 - Main Counter',
      cashierId: 'emp-01',
      cashierName: 'Alem T.',
      txRef: 'TXR-2026-UNIQUE-77',
    });

    expect(offlineQueue.getQueueCount()).toBe(2);

    const replayResult = await adapter.replayOfflineQueue();

    // 1 duplicate flagged, 1 unique replayed
    expect(replayResult.duplicateCount).toBe(1);
    expect(replayResult.replayedCount).toBe(1);

    // Queue should now be empty
    expect(offlineQueue.getQueueCount()).toBe(0);

    // Audit log should contain replay entry
    const audit = await adapter.listAuditLog();
    const replayEntry = audit.find((a) => a.action === 'OFFLINE_QUEUE_REPLAYED');
    expect(replayEntry).toBeDefined();
  });
});
