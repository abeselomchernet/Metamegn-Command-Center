/**
 * Seeded sample dataset for Metamegn Command Center v2.
 * All identifiers and values are masked deterministic samples.
 * Zero live or actual banking/PSS data.
 */

import { Till, LedgerEvent, StatementRow, ShiftRecord, AuditEntry } from '../domain/types';

export const SEEDED_TILLS: Till[] = [
  {
    id: 'till-01',
    name: 'Till 01 - Main Counter',
    location: 'Ground Floor Checkout A',
    assignedCashierId: 'emp-01',
    assignedCashierName: 'Alem T. (Sample Staff)',
    active: true,
  },
  {
    id: 'till-02',
    name: 'Till 02 - Express Register',
    location: 'Ground Floor Checkout B',
    assignedCashierId: 'emp-02',
    assignedCashierName: 'Bereket D. (Sample Staff)',
    active: true,
  },
  {
    id: 'till-03',
    name: 'Till 03 - Patio / Service Bar',
    location: 'Upper Terrace Area',
    assignedCashierId: 'emp-03',
    assignedCashierName: 'Chaltu K. (Sample Staff)',
    active: true,
  },
];

export const INITIAL_LEDGER_EVENTS: LedgerEvent[] = [
  {
    id: 'ev-101',
    txRef: 'TXR-2026-8941',
    amountCents: 145000, // ETB 1,450.00
    railId: 'wallet_a',
    tillId: 'till-01',
    tillName: 'Till 01 - Main Counter',
    cashierId: 'emp-01',
    cashierName: 'Alem T.',
    createdAt: '2026-10-21T08:15:30Z',
    status: 'matched',
    providerRef: 'WAL-STMT-9901',
  },
  {
    id: 'ev-102',
    txRef: 'TXR-2026-8942',
    amountCents: 45000, // ETB 450.00
    railId: 'interop_qr',
    tillId: 'till-01',
    tillName: 'Till 01 - Main Counter',
    cashierId: 'emp-01',
    cashierName: 'Alem T.',
    createdAt: '2026-10-21T08:24:10Z',
    status: 'matched',
    providerRef: 'IQR-STMT-9902',
  },
  {
    id: 'ev-103',
    txRef: 'TXR-2026-8943',
    amountCents: 280000, // ETB 2,800.00
    railId: 'bank_b',
    tillId: 'till-02',
    tillName: 'Till 02 - Express Register',
    cashierId: 'emp-02',
    cashierName: 'Bereket D.',
    createdAt: '2026-10-21T08:42:00Z',
    status: 'matched',
    providerRef: 'BNK-STMT-9903',
  },
  {
    id: 'ev-104',
    txRef: 'TXR-2026-8944',
    amountCents: 85000, // ETB 850.00
    railId: 'card_tap',
    tillId: 'till-01',
    tillName: 'Till 01 - Main Counter',
    cashierId: 'emp-01',
    cashierName: 'Alem T.',
    createdAt: '2026-10-21T09:05:15Z',
    status: 'matched',
    providerRef: 'CRD-STMT-9904',
  },
  {
    id: 'ev-105',
    txRef: 'TXR-2026-8945',
    amountCents: 32000, // ETB 320.00 (Cash)
    railId: 'cash',
    tillId: 'till-01',
    tillName: 'Till 01 - Main Counter',
    cashierId: 'emp-01',
    cashierName: 'Alem T.',
    createdAt: '2026-10-21T09:12:00Z',
    status: 'captured',
  },
  // Class 2: Missing at Provider
  {
    id: 'ev-106',
    txRef: 'TXR-2026-8946',
    amountCents: 120000, // ETB 1,200.00
    railId: 'wallet_a',
    tillId: 'till-02',
    tillName: 'Till 02 - Express Register',
    cashierId: 'emp-02',
    cashierName: 'Bereket D.',
    createdAt: '2026-10-21T09:30:00Z',
    status: 'exception',
    notes: 'Captured at till, customer phone showed confirmation, but no statement row received.',
  },
  // Class 4: Amount Mismatch (Till has 750.00, Statement has 700.00)
  {
    id: 'ev-107',
    txRef: 'TXR-2026-8947',
    amountCents: 75000, // ETB 750.00
    railId: 'interop_qr',
    tillId: 'till-03',
    tillName: 'Till 03 - Patio / Service Bar',
    cashierId: 'emp-03',
    cashierName: 'Chaltu K.',
    createdAt: '2026-10-21T09:45:00Z',
    status: 'exception',
  },
  // Class 5: Duplicate at Till
  {
    id: 'ev-108a',
    txRef: 'TXR-2026-8948',
    amountCents: 50000, // ETB 500.00
    railId: 'bank_b',
    tillId: 'till-01',
    tillName: 'Till 01 - Main Counter',
    cashierId: 'emp-01',
    cashierName: 'Alem T.',
    createdAt: '2026-10-21T10:02:10Z',
    status: 'exception',
  },
  {
    id: 'ev-108b',
    txRef: 'TXR-2026-8948',
    amountCents: 50000, // ETB 500.00
    railId: 'bank_b',
    tillId: 'till-01',
    tillName: 'Till 01 - Main Counter',
    cashierId: 'emp-01',
    cashierName: 'Alem T.',
    createdAt: '2026-10-21T10:02:14Z',
    status: 'exception',
  },
  // Pending match
  {
    id: 'ev-109',
    txRef: 'TXR-2026-8949',
    amountCents: 360000, // ETB 3,600.00
    railId: 'bank_b',
    tillId: 'till-02',
    tillName: 'Till 02 - Express Register',
    cashierId: 'emp-02',
    cashierName: 'Bereket D.',
    createdAt: '2026-10-21T10:15:00Z',
    status: 'awaiting_provider',
  },
];

export const INITIAL_STATEMENT_ROWS: StatementRow[] = [
  {
    id: 'st-01',
    statementDate: '2026-10-21',
    statementTime: '08:15:35',
    railId: 'wallet_a',
    externalRef: 'TXR-2026-8941',
    amountCents: 145000,
    feeCents: 725,
    payerMasked: '+251-91-***-1402',
    rawPayloadRef: 'RAW-BATCH-20261021-01',
  },
  {
    id: 'st-02',
    statementDate: '2026-10-21',
    statementTime: '08:24:15',
    railId: 'interop_qr',
    externalRef: 'TXR-2026-8942',
    amountCents: 45000,
    feeCents: 135,
    payerMasked: '+251-93-***-8821',
    rawPayloadRef: 'RAW-BATCH-20261021-01',
  },
  {
    id: 'st-03',
    statementDate: '2026-10-21',
    statementTime: '08:42:05',
    railId: 'bank_b',
    externalRef: 'TXR-2026-8943',
    amountCents: 280000,
    feeCents: 560,
    payerMasked: 'ACCT-***-9022',
    rawPayloadRef: 'RAW-BATCH-20261021-02',
  },
  {
    id: 'st-04',
    statementDate: '2026-10-21',
    statementTime: '09:05:22',
    railId: 'card_tap',
    externalRef: 'TXR-2026-8944',
    amountCents: 85000,
    feeCents: 1020,
    payerMasked: 'PAN-****-5519',
    rawPayloadRef: 'RAW-BATCH-20261021-02',
  },
  // Mismatch statement (Class 4): externalRef TXR-2026-8947 has 700.00 instead of 750.00
  {
    id: 'st-05',
    statementDate: '2026-10-21',
    statementTime: '09:45:10',
    railId: 'interop_qr',
    externalRef: 'TXR-2026-8947',
    amountCents: 70000, // ETB 700.00
    feeCents: 210,
    payerMasked: '+251-92-***-4011',
    rawPayloadRef: 'RAW-BATCH-20261021-03',
  },
  // Missing at Till (Class 3): Customer paid via direct bank rail, cashier forgot to record
  {
    id: 'st-06',
    statementDate: '2026-10-21',
    statementTime: '10:05:00',
    railId: 'bank_b',
    externalRef: 'UNREC-BNK-9811',
    amountCents: 185000, // ETB 1,850.00
    feeCents: 370,
    payerMasked: 'ACCT-***-3381',
    rawPayloadRef: 'RAW-BATCH-20261021-03',
  },
];

export const INITIAL_SHIFTS: ShiftRecord[] = [
  {
    id: 'shift-01',
    tillId: 'till-01',
    tillName: 'Till 01 - Main Counter',
    openedAt: '2026-10-21T07:30:00Z',
    openedBy: 'Alem T.',
    openingCashCents: 200000, // ETB 2,000.00 float
    expectedCashCents: 232000, // float + 320.00 cash sales
    status: 'open',
  },
  {
    id: 'shift-02',
    tillId: 'till-02',
    tillName: 'Till 02 - Express Register',
    openedAt: '2026-10-20T14:00:00Z',
    closedAt: '2026-10-20T22:00:00Z',
    openedBy: 'Bereket D.',
    closedBy: 'Bereket D.',
    openingCashCents: 150000,
    expectedCashCents: 410000,
    countedCashCents: 410000,
    varianceCents: 0,
    notes: 'Shift balanced cleanly. Zero variance.',
    status: 'closed',
  },
];

export const INITIAL_AUDIT_LOG: AuditEntry[] = [
  {
    id: 'aud-01',
    timestamp: '2026-10-21T07:30:00Z',
    actorRole: 'CASHIER',
    actorName: 'Alem T.',
    action: 'SHIFT_OPEN',
    targetType: 'shift',
    targetId: 'shift-01',
    details: 'Opened Till 01 with opening float ETB 2,000.00',
  },
  {
    id: 'aud-02',
    timestamp: '2026-10-21T09:46:12Z',
    actorRole: 'SUPERVISOR',
    actorName: 'Dawit M. (Supervisor)',
    action: 'EXCEPTION_DETECTED',
    targetType: 'exception',
    targetId: 'exc-amt-diff-ev-107-st-05',
    details: 'System flagged amount discrepancy on TXR-2026-8947: recorded ETB 750.00 vs reported ETB 700.00',
  },
  {
    id: 'aud-03',
    timestamp: '2026-10-21T10:03:00Z',
    actorRole: 'SUPERVISOR',
    actorName: 'Dawit M. (Supervisor)',
    action: 'DUPLICATE_FLAGGED',
    targetType: 'event',
    targetId: 'ev-108b',
    details: 'Flagged duplicate rapid till capture for reference TXR-2026-8948',
  },
];
