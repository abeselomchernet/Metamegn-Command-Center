# EventSourceAdapter: Integration Requirements & Prerequisite Gates

This document specifies the technical and legal requirements necessary before any real-world production implementation of the `EventSourceAdapter` interface could be considered.

---

## Prerequisite Gates (Must Be Cleared Before Any Implementation)

> [!WARNING]
> **Status: NONE OF THESE GATES ARE DONE.**
> This codebase contains only `MockAdapter` operating on deterministic mock data. No production adapter exists, no production integration is planned, and no authorization has been requested or granted.

### 1. Legal and Licence Scope Gate
- **Regulatory Licensing Determination**: Written legal confirmation from national financial authorities regarding whether operating a bank-scoped transaction event matching layer constitutes payment processing, third-party processing, or data routing under national payment system regulations.
- **Contractual Scope**: Explicit commercial and legal agreements defining that the software layer performs *recording, reconciliation, and exception routing only*, and does not hold, clear, or transmit funds.

### 2. Data-Protection Basis Gate
- **Lawful Basis for Processing**: Established GDPR/national personal data protection compliance basis for ingesting customer payment references, phone numbers, or bank identifiers into the reconciliation database.
- **Data Minimization & Masking**: Implementation of hardware security module (HSM) hashing and tokenization for any payer identifiers prior to event storage.
- **Data Retention & Erasure Policies**: Legally certified retention limits for transaction event logs and immutable audit records.

### 3. Comprehensive Security Review Gate
- **Threat Modeling & Architectural Audit**: Formal threat model evaluating risks of rogue event injection, cashier manipulation, or replay attacks.
- **Third-Party Penetration Testing**: Independent CREST-certified penetration testing of all API seams, ingress parsers, and data storage layers.
- **FIPS 140-3 Compliance**: Cryptographic verification of all in-transit and at-rest encryption keys.

### 4. Written Permission From Each Data Owner Gate
- **Acquiring Bank Authorization**: Explicit written contract from the sponsoring acquiring commercial bank authorizing automated matching against merchant accounts.
- **Payment Rail Consents**: Bilateral API and statement ingestion agreements with each underlying payment rail (interoperable QR operator, mobile wallets, card networks).
- **Merchant Consent**: Written agreement from merchants for automated discrepancy detection and supervisor resolution auditing.

---

## Technical Seam Specification

The software architecture enforces a strict seam via `EventSourceAdapter`:

```typescript
export interface EventSourceAdapter {
  listEvents(filter?: EventFilter): Promise<LedgerEvent[]>;
  listStatements(): Promise<StatementRow[]>;
  reconcileBatch(): Promise<MatchingResult>;
  captureEvent(payload: CapturePayload): Promise<LedgerEvent>;
  voidEvent(id: string, reason: string, actor: { role: Role; name: string }): Promise<LedgerEvent>;
  resolveException(id: string, resolution: ExceptionResolution): Promise<ExceptionRecord>;
  listShifts(): Promise<ShiftRecord[]>;
  openShift(tillId: string, openedBy: string, openingCashCents: number): Promise<ShiftRecord>;
  closeShift(shiftId: string, countedCashCents: number, closedBy: string, notes?: string): Promise<ShiftRecord>;
  listAuditLog(): Promise<AuditEntry[]>;
  replayOfflineQueue(): Promise<{ replayedCount: number; duplicateCount: number }>;
}
```

### Real Implementation Architecture (Hypothetical)
In a hypothetical future implementation with all 4 prerequisite gates passed:
1. `listStatements()` would ingest statement rows via secure SFTP or signed ISO 20022 camt.053 XML batch feeds directly from core banking and clearing house endpoints.
2. `captureEvent()` would interface with certified POS terminal hardware or merchant apps via mutual TLS (mTLS).
3. `reconcileBatch()` would execute an automated matching engine running against encrypted database tables.
4. **No money movement methods exist on this interface.** Money movement remains strictly within the banking rail settlement engine.
