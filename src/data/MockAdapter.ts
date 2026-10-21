/**
 * MockAdapter: Deterministic Mock Implementation of EventSourceAdapter.
 * Purely client-side mock data; zero live provider/bank APIs or funds custody.
 */

import {
  LedgerEvent,
  StatementRow,
  ExceptionRecord,
  ShiftRecord,
  AuditEntry,
  PaymentRailId,
  ExceptionResolutionStatus,
} from '../domain/types';
import { runReconciliation, MatchingResult } from '../domain/reconciliation';
import { EventSourceAdapter, EventFilter, CapturePayload } from './EventSourceAdapter';
import {
  INITIAL_LEDGER_EVENTS,
  INITIAL_STATEMENT_ROWS,
  INITIAL_SHIFTS,
  INITIAL_AUDIT_LOG,
  SEEDED_TILLS,
} from './seededData';
import { DeterministicPRNG } from './prng';
import { offlineQueue } from './offlineQueue';
import { Role } from '../domain/permissions';

export class MockAdapter implements EventSourceAdapter {
  private events: LedgerEvent[] = [];
  private statements: StatementRow[] = [];
  private shifts: ShiftRecord[] = [];
  private auditLog: AuditEntry[] = [];
  private exceptions: ExceptionRecord[] = [];
  private prng: DeterministicPRNG;
  private txCounter: number = 8950;

  constructor(seed: number = 77123) {
    this.prng = new DeterministicPRNG(seed);
    this.events = JSON.parse(JSON.stringify(INITIAL_LEDGER_EVENTS));
    this.statements = JSON.parse(JSON.stringify(INITIAL_STATEMENT_ROWS));
    this.shifts = JSON.parse(JSON.stringify(INITIAL_SHIFTS));
    this.auditLog = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOG));

    // Run initial reconciliation
    const initResult = runReconciliation(this.events, this.statements);
    this.exceptions = initResult.exceptions;
  }

  async listEvents(filter?: EventFilter): Promise<LedgerEvent[]> {
    let result = [...this.events];

    if (filter?.tillId) {
      result = result.filter((e) => e.tillId === filter.tillId);
    }
    if (filter?.railId) {
      result = result.filter((e) => e.railId === filter.railId);
    }
    if (filter?.status) {
      result = result.filter((e) => e.status === filter.status);
    }
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.txRef.toLowerCase().includes(q) ||
          e.cashierName.toLowerCase().includes(q) ||
          e.tillName.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async listStatements(): Promise<StatementRow[]> {
    return [...this.statements].sort((a, b) => {
      const timeA = `${a.statementDate}T${a.statementTime}`;
      const timeB = `${b.statementDate}T${b.statementTime}`;
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
  }

  async reconcileBatch(): Promise<MatchingResult> {
    const result = runReconciliation(this.events, this.statements, this.exceptions);
    this.exceptions = result.exceptions;
    return result;
  }

  async captureEvent(payload: CapturePayload): Promise<LedgerEvent> {
    const ref = payload.txRef || `TXR-2026-${++this.txCounter}`;
    const newEvent: LedgerEvent = {
      id: `ev-${Date.now()}-${this.prng.nextInt(100, 999)}`,
      txRef: ref,
      amountCents: payload.amountCents,
      railId: payload.railId,
      tillId: payload.tillId,
      tillName: payload.tillName,
      cashierId: payload.cashierId,
      cashierName: payload.cashierName,
      createdAt: new Date().toISOString(),
      // A capture never shows "paid" without a match; before a match it reads "awaiting_provider" (or "captured" for cash)
      status: payload.railId === 'cash' ? 'captured' : 'awaiting_provider',
      offlineQueued: payload.isOffline || false,
    };

    this.events.unshift(newEvent);

    // Update expected cash in current open shift if cash
    if (payload.railId === 'cash') {
      const openShift = this.shifts.find((s) => s.tillId === payload.tillId && s.status === 'open');
      if (openShift) {
        openShift.expectedCashCents = (openShift.expectedCashCents || openShift.openingCashCents) + payload.amountCents;
      }
    }

    // Append to audit log
    this.auditLog.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole: 'CASHIER',
      actorName: payload.cashierName,
      action: 'TRANSACTION_CAPTURED',
      targetType: 'event',
      targetId: newEvent.id,
      details: `Captured ${payload.railId} transaction ${ref} for ETB ${(payload.amountCents / 100).toFixed(2)} at ${payload.tillName}`,
    });

    return newEvent;
  }

  async voidEvent(id: string, reason: string, actor: { role: Role; name: string }): Promise<LedgerEvent> {
    const ev = this.events.find((e) => e.id === id);
    if (!ev) {
      throw new Error(`Event ${id} not found.`);
    }

    ev.status = 'voided';
    ev.voidReason = reason;
    ev.voidedAt = new Date().toISOString();
    ev.voidedBy = actor.name;

    // Adjust shift if cash
    if (ev.railId === 'cash') {
      const openShift = this.shifts.find((s) => s.tillId === ev.tillId && s.status === 'open');
      if (openShift && openShift.expectedCashCents) {
        openShift.expectedCashCents = Math.max(openShift.openingCashCents, openShift.expectedCashCents - ev.amountCents);
      }
    }

    this.auditLog.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole: actor.role,
      actorName: actor.name,
      action: 'TRANSACTION_VOIDED',
      targetType: 'event',
      targetId: ev.id,
      details: `Voided transaction ${ev.txRef} (ETB ${(ev.amountCents / 100).toFixed(2)}). Reason: ${reason}`,
    });

    return ev;
  }

  async resolveException(
    id: string,
    resolution: { status: ExceptionResolutionStatus; notes: string; resolvedBy: string }
  ): Promise<ExceptionRecord> {
    const ex = this.exceptions.find((e) => e.id === id);
    if (!ex) {
      throw new Error(`Exception ${id} not found.`);
    }

    ex.status = resolution.status;
    ex.resolutionNotes = resolution.notes;
    ex.resolvedAt = new Date().toISOString();
    ex.resolvedBy = resolution.resolvedBy;

    // If marked resolved and it had an event, mark event matched
    if (resolution.status === 'resolved' && ex.eventId) {
      const ev = this.events.find((e) => e.id === ex.eventId);
      if (ev) {
        ev.status = 'matched';
      }
    }

    this.auditLog.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole: 'SUPERVISOR',
      actorName: resolution.resolvedBy,
      action: 'EXCEPTION_RESOLVED',
      targetType: 'exception',
      targetId: ex.id,
      details: `Resolved ${ex.exceptionClass} exception (${ex.txRef || ex.externalRef || id}) with status: ${resolution.status}. Notes: ${resolution.notes}`,
    });

    return ex;
  }

  async listShifts(): Promise<ShiftRecord[]> {
    return [...this.shifts].sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
  }

  async openShift(tillId: string, openedBy: string, openingCashCents: number): Promise<ShiftRecord> {
    const till = SEEDED_TILLS.find((t) => t.id === tillId);
    const newShift: ShiftRecord = {
      id: `shift-${Date.now()}`,
      tillId,
      tillName: till ? till.name : tillId,
      openedAt: new Date().toISOString(),
      openedBy,
      openingCashCents,
      expectedCashCents: openingCashCents,
      status: 'open',
    };

    this.shifts.unshift(newShift);

    this.auditLog.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole: 'CASHIER',
      actorName: openedBy,
      action: 'SHIFT_OPEN',
      targetType: 'shift',
      targetId: newShift.id,
      details: `Opened new register shift for ${newShift.tillName} with float ETB ${(openingCashCents / 100).toFixed(2)}`,
    });

    return newShift;
  }

  async closeShift(
    shiftId: string,
    countedCashCents: number,
    closedBy: string,
    notes?: string
  ): Promise<ShiftRecord> {
    const shift = this.shifts.find((s) => s.id === shiftId);
    if (!shift) {
      throw new Error(`Shift ${shiftId} not found.`);
    }

    const expected = shift.expectedCashCents || shift.openingCashCents;
    const variance = countedCashCents - expected;

    shift.status = 'closed';
    shift.closedAt = new Date().toISOString();
    shift.closedBy = closedBy;
    shift.countedCashCents = countedCashCents;
    shift.varianceCents = variance;
    shift.notes = notes;

    this.auditLog.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole: 'SUPERVISOR',
      actorName: closedBy,
      action: 'SHIFT_CLOSE',
      targetType: 'shift',
      targetId: shift.id,
      details: `Closed shift for ${shift.tillName}. Counted: ETB ${(countedCashCents / 100).toFixed(2)}, Expected: ETB ${(expected / 100).toFixed(2)}, Variance: ETB ${(variance / 100).toFixed(2)}. ${notes || ''}`,
    });

    return shift;
  }

  async listAuditLog(): Promise<AuditEntry[]> {
    return [...this.auditLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async replayOfflineQueue(): Promise<{ replayedCount: number; duplicateCount: number }> {
    const queuedItems = offlineQueue.getQueue();
    if (queuedItems.length === 0) {
      return { replayedCount: 0, duplicateCount: 0 };
    }

    let replayedCount = 0;
    let duplicateCount = 0;

    for (const item of queuedItems) {
      const ref = item.payload.txRef || `TXR-2026-${++this.txCounter}`;
      // Check if reference already exists in ledger
      const existing = this.events.find((e) => e.txRef === ref);

      if (existing) {
        duplicateCount++;
      } else {
        replayedCount++;
      }

      const replayedEvent: LedgerEvent = {
        id: `ev-replayed-${Date.now()}-${this.prng.nextInt(100, 999)}`,
        txRef: ref,
        amountCents: item.payload.amountCents,
        railId: item.payload.railId,
        tillId: item.payload.tillId,
        tillName: item.payload.tillName,
        cashierId: item.payload.cashierId,
        cashierName: item.payload.cashierName,
        createdAt: item.queuedAt,
        status: item.payload.railId === 'cash' ? 'captured' : 'awaiting_provider',
        offlineQueued: true,
        replayedAt: new Date().toISOString(),
      };

      this.events.unshift(replayedEvent);
    }

    offlineQueue.clearQueue();

    this.auditLog.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole: 'CASHIER',
      actorName: 'Till Replay Engine',
      action: 'OFFLINE_QUEUE_REPLAYED',
      targetType: 'event',
      targetId: `replay-${Date.now()}`,
      details: `Replayed ${queuedItems.length} transactions from offline queue. Replayed: ${replayedCount}, Potential Duplicates: ${duplicateCount}`,
    });

    return { replayedCount, duplicateCount };
  }

  async simulateIncomingEvents(count: number = 2): Promise<number> {
    const rails: PaymentRailId[] = ['wallet_a', 'bank_b', 'interop_qr', 'card_tap'];
    const tills = SEEDED_TILLS;

    for (let i = 0; i < count; i++) {
      const rail = this.prng.pick(rails);
      const till = this.prng.pick(tills);
      const amountCents = this.prng.nextInt(150, 4800) * 100; // between 150.00 and 4800.00 ETB
      const ref = `TXR-2026-${++this.txCounter}`;

      const newEv: LedgerEvent = {
        id: `ev-sim-${Date.now()}-${i}`,
        txRef: ref,
        amountCents,
        railId: rail,
        tillId: till.id,
        tillName: till.name,
        cashierId: till.assignedCashierId,
        cashierName: till.assignedCashierName,
        createdAt: new Date().toISOString(),
        status: 'awaiting_provider',
      };

      this.events.unshift(newEv);

      // In 70% of cases, also simulate corresponding matching statement row
      if (this.prng.next() < 0.7) {
        const stmtTime = new Date().toTimeString().slice(0, 8);
        const stmtRow: StatementRow = {
          id: `st-sim-${Date.now()}-${i}`,
          statementDate: new Date().toISOString().slice(0, 10),
          statementTime: stmtTime,
          railId: rail,
          externalRef: ref,
          amountCents,
          feeCents: Math.round(amountCents * 0.005),
          payerMasked: `+251-91-***-${this.prng.nextInt(1000, 9999)}`,
          rawPayloadRef: `RAW-SIM-${Date.now()}`,
        };
        this.statements.unshift(stmtRow);
        newEv.status = 'matched';
        newEv.providerRef = stmtRow.id;
      }
    }

    return count;
  }

  async simulateIncomingStatement(txRef: string, amountCents: number, railId: PaymentRailId): Promise<StatementRow> {
    const stmtRow: StatementRow = {
      id: `st-inbound-${Date.now()}`,
      statementDate: new Date().toISOString().slice(0, 10),
      statementTime: new Date().toTimeString().slice(0, 8),
      railId,
      externalRef: txRef,
      amountCents,
      feeCents: Math.round(amountCents * 0.005),
      payerMasked: `+251-92-***-${this.prng.nextInt(1000, 9999)}`,
      rawPayloadRef: `RAW-SIM-${Date.now()}`,
    };

    this.statements.unshift(stmtRow);

    // Update event if matches
    const matchingEv = this.events.find((e) => e.txRef === txRef && e.amountCents === amountCents);
    if (matchingEv) {
      matchingEv.status = 'matched';
      matchingEv.providerRef = stmtRow.id;
    }

    return stmtRow;
  }
}

// Global default singleton instance for app state
export const defaultAdapter = new MockAdapter();
