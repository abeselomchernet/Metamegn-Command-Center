/**
 * EventSourceAdapter Seam Interface.
 * Architectural seam between presentation layer and underlying event sources.
 * In this illustration, only MockAdapter is supplied.
 */

import {
  LedgerEvent,
  StatementRow,
  ExceptionRecord,
  ShiftRecord,
  AuditEntry,
  PaymentRailId,
  ExceptionResolutionStatus,
  BankId,
} from '../domain/types';
import { MatchingResult } from '../domain/reconciliation';
import { Role } from '../domain/permissions';

export interface EventFilter {
  tillId?: string;
  railId?: PaymentRailId;
  bankId?: BankId;
  status?: string;
  searchQuery?: string;
}

export interface CapturePayload {
  amountCents: number;
  railId: PaymentRailId;
  bankId?: BankId;
  tillId: string;
  tillName: string;
  cashierId: string;
  cashierName: string;
  txRef?: string;
  isOffline?: boolean;
}

export interface EventSourceAdapter {
  listEvents(filter?: EventFilter): Promise<LedgerEvent[]>;
  listStatements(): Promise<StatementRow[]>;
  listExceptions(filter?: { bankId?: BankId }): Promise<ExceptionRecord[]>;
  reconcileBatch(): Promise<MatchingResult>;
  captureEvent(payload: CapturePayload): Promise<LedgerEvent>;
  voidEvent(id: string, reason: string, actor: { role: Role; name: string }): Promise<LedgerEvent>;
  resolveException(
    id: string,
    resolution: { status: ExceptionResolutionStatus; notes: string; resolvedBy: string }
  ): Promise<ExceptionRecord>;
  listShifts(): Promise<ShiftRecord[]>;
  openShift(tillId: string, openedBy: string, openingCashCents: number): Promise<ShiftRecord>;
  closeShift(shiftId: string, countedCashCents: number, closedBy: string, notes?: string): Promise<ShiftRecord>;
  listAuditLog(): Promise<AuditEntry[]>;
  replayOfflineQueue(): Promise<{ replayedCount: number; duplicateCount: number }>;
  simulateIncomingEvents(count?: number): Promise<number>;
  simulateIncomingStatement(txRef: string, amountCents: number, railId: PaymentRailId, bankId?: BankId): Promise<StatementRow>;
  setProviderFeedDown(down: boolean): Promise<void>;
  isProviderFeedDown(): Promise<boolean>;
}
