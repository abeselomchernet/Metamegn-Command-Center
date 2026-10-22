/**
 * Core Domain Types for Metamegn Command Center v2.
 * Independent Acceptance 360 illustration.
 */

export type PaymentRailId = 'wallet_a' | 'bank_b' | 'interop_qr' | 'card_tap' | 'cash';

export interface RailConfig {
  id: PaymentRailId;
  label: string;
  supportsQR: boolean;
  supportsPushUSSD: boolean;
  reportDelay: string;
  sampleFeeModel: string;
  description: string;
  accentColor: string;
}

export const PAYMENT_RAILS: Record<PaymentRailId, RailConfig> = {
  wallet_a: {
    id: 'wallet_a',
    label: 'Wallet Rail A',
    supportsQR: true,
    supportsPushUSSD: true,
    reportDelay: '15 min batch',
    sampleFeeModel: '0.50% (Sample fee model)',
    description: 'Digital wallet rail with instant consumer app push / dynamic QR.',
    accentColor: '#3B82F6',
  },
  bank_b: {
    id: 'bank_b',
    label: 'Bank Rail B',
    supportsQR: true,
    supportsPushUSSD: true,
    reportDelay: 'Next-day T+1 statement',
    sampleFeeModel: '0.20% (Sample fee model)',
    description: 'Direct core-banking account debit rail with account reference lookup.',
    accentColor: '#10B981',
  },
  interop_qr: {
    id: 'interop_qr',
    label: 'Interoperable QR',
    supportsQR: true,
    supportsPushUSSD: false,
    reportDelay: 'Hourly statement report',
    sampleFeeModel: '0.30% (Sample fee model)',
    description: 'National interoperable merchant QR standard (sample specification).',
    accentColor: '#8B5CF6',
  },
  card_tap: {
    id: 'card_tap',
    label: 'Card Tap (SoftPOS-style)',
    supportsQR: false,
    supportsPushUSSD: false,
    reportDelay: 'Daily card batch (T+1)',
    sampleFeeModel: '1.20% (Sample fee model)',
    description: 'NFC contactless tap on merchant phone / SoftPOS emulation.',
    accentColor: '#F59E0B',
  },
  cash: {
    id: 'cash',
    label: 'Cash',
    supportsQR: false,
    supportsPushUSSD: false,
    reportDelay: 'Immediate shift register count',
    sampleFeeModel: '0.00% (Sample fee model)',
    description: 'Physical cash notes verified and counted at shift handover.',
    accentColor: '#64748B',
  },
};

export const TRANSACTION_STATES = [
  'INITIATED',
  'PENDING',
  'CONFIRMED',
  'FAILED',
  'REVERSED',
  'NEEDS_RECONCILIATION',
] as const;

export type LedgerStatus = (typeof TRANSACTION_STATES)[number];

export type BankId = 'bank-1' | 'bank-2' | 'bank-3';

export interface BankScopeConfig {
  id: BankId;
  name: string;
}

export const NEUTRAL_BANKS: Record<BankId, BankScopeConfig> = {
  'bank-1': { id: 'bank-1', name: 'Bank 1' },
  'bank-2': { id: 'bank-2', name: 'Bank 2' },
  'bank-3': { id: 'bank-3', name: 'Bank 3' },
};

export interface LedgerEvent {
  id: string;
  txRef: string;
  amountCents: number;
  railId: PaymentRailId;
  bankId: BankId;
  tillId: string;
  tillName: string;
  cashierId: string;
  cashierName: string;
  createdAt: string; // ISO
  status: LedgerStatus;
  providerRef?: string;
  voidReason?: string;
  voidedAt?: string;
  voidedBy?: string;
  offlineQueued?: boolean;
  replayedAt?: string;
  notes?: string;
  isLateReversal?: boolean;
  isUnknownOutcome?: boolean;
}

export interface StatementRow {
  id: string;
  statementDate: string; // YYYY-MM-DD
  statementTime: string; // HH:mm:ss
  railId: PaymentRailId;
  bankId?: BankId;
  externalRef: string;
  amountCents: number;
  feeCents: number;
  payerMasked?: string;
  rawPayloadRef: string;
  isReversal?: boolean;
}

export type ExceptionClass =
  | 'matched'
  | 'missing_at_provider'
  | 'missing_at_till'
  | 'amount_mismatch'
  | 'duplicate'
  | 'late_reversal'
  | 'unknown_outcome';

export type ExceptionResolutionStatus = 'open' | 'investigating' | 'resolved' | 'voided';

export interface ExceptionRecord {
  id: string;
  eventId?: string;
  statementId?: string;
  txRef?: string;
  externalRef?: string;
  railId: PaymentRailId;
  bankId?: BankId;
  exceptionClass: ExceptionClass;
  tillId?: string;
  tillName?: string;
  amountEventCents?: number;
  amountStatementCents?: number;
  diffCents?: number;
  detectedAt: string;
  ageMinutes?: number;
  status: ExceptionResolutionStatus;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ReconciliationSummary {
  totalLedgerEvents: number;
  matchedCount: number;
  openExceptionsCount: number;
  matchRatePercent: number; // e.g. 94.2
  oldestOpenMinutes: number;
  totalVolumeCents: number;
  matchedVolumeCents: number;
  unmatchedVolumeCents: number;
}

export interface Till {
  id: string;
  name: string;
  location: string;
  assignedCashierId: string;
  assignedCashierName: string;
  active: boolean;
}

export interface ShiftRecord {
  id: string;
  tillId: string;
  tillName: string;
  openedAt: string;
  closedAt?: string;
  openedBy: string;
  closedBy?: string;
  openingCashCents: number;
  countedCashCents?: number;
  expectedCashCents?: number;
  varianceCents?: number;
  notes?: string;
  status: 'open' | 'closed';
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorRole: string;
  actorName: string;
  action: string;
  targetType: 'event' | 'exception' | 'shift' | 'settings' | 'till';
  targetId: string;
  details: string;
}
