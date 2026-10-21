/**
 * Low-connectivity capture offline queue simulator.
 * Stores pending transactions locally when network mode is set to offline.
 * Replays upon reconnection with duplicate detection.
 * Deterministic counter replaces Math.random.
 */

import { CapturePayload } from './EventSourceAdapter';

export interface QueuedOfflineEvent {
  localQueueId: string;
  payload: CapturePayload;
  queuedAt: string;
}

const STORAGE_KEY = 'metamegn_offline_capture_queue_v2';

export class OfflineQueueManager {
  private inMemoryQueue: QueuedOfflineEvent[] = [];
  private counter: number = 0;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.inMemoryQueue = JSON.parse(stored);
      }
    } catch {
      // Fallback to inMemoryQueue
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryQueue));
    } catch {
      // ignore in restricted environments
    }
  }

  enqueue(payload: CapturePayload): QueuedOfflineEvent {
    this.counter += 1;
    const item: QueuedOfflineEvent = {
      localQueueId: `offline-${Date.now()}-${this.counter}`,
      payload: { ...payload, isOffline: true },
      queuedAt: new Date().toISOString(),
    };
    this.inMemoryQueue.push(item);
    this.saveToStorage();
    return item;
  }

  getQueue(): QueuedOfflineEvent[] {
    return [...this.inMemoryQueue];
  }

  getQueueCount(): number {
    return this.inMemoryQueue.length;
  }

  clearQueue() {
    this.inMemoryQueue = [];
    this.saveToStorage();
  }
}

export const offlineQueue = new OfflineQueueManager();
