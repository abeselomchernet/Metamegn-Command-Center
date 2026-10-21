import { describe, it, expect } from 'vitest';
import { MockAdapter } from '../src/data/MockAdapter';

describe('Capture State & Seam Invariants', () => {
  it('records transactions into the ledger as "awaiting_provider" before any statement match', async () => {
    const adapter = new MockAdapter(9911);

    const event = await adapter.captureEvent({
      amountCents: 185000,
      railId: 'wallet_a',
      tillId: 'till-01',
      tillName: 'Till 01',
      cashierId: 'emp-01',
      cashierName: 'Alem T.',
    });

    expect(event.amountCents).toBe(185000);
    expect(event.railId).toBe('wallet_a');
    // Invariant: capture never shows "paid" without a match; before a match it reads "awaiting_provider"
    expect(event.status).toBe('awaiting_provider');
    expect(event.providerRef).toBeUndefined();

    // Verify it appears in listed events
    const listed = await adapter.listEvents({ tillId: 'till-01' });
    expect(listed.find((e) => e.id === event.id)).toBeDefined();
  });

  it('records cash transactions directly into shift expected cash', async () => {
    const adapter = new MockAdapter(9912);
    const shifts = await adapter.listShifts();
    const openShift = shifts.find((s) => s.status === 'open');
    expect(openShift).toBeDefined();

    const initialExpected = openShift!.expectedCashCents || openShift!.openingCashCents;

    await adapter.captureEvent({
      amountCents: 50000,
      railId: 'cash',
      tillId: openShift!.tillId,
      tillName: openShift!.tillName,
      cashierId: 'emp-01',
      cashierName: 'Alem T.',
    });

    const updatedShifts = await adapter.listShifts();
    const updatedOpenShift = updatedShifts.find((s) => s.id === openShift!.id);
    expect(updatedOpenShift!.expectedCashCents).toBe(initialExpected + 50000);
  });

  it('allows supervisors to void transactions with a mandatory audit reason', async () => {
    const adapter = new MockAdapter(9913);
    const event = await adapter.captureEvent({
      amountCents: 25000,
      railId: 'card_tap',
      tillId: 'till-01',
      tillName: 'Till 01',
      cashierId: 'emp-01',
      cashierName: 'Alem T.',
    });

    const voided = await adapter.voidEvent(event.id, 'Customer cancelled order before card tap', {
      role: 'SUPERVISOR' as any,
      name: 'Dawit M.',
    });

    expect(voided.status).toBe('voided');
    expect(voided.voidReason).toBe('Customer cancelled order before card tap');

    // Check audit log
    const audit = await adapter.listAuditLog();
    const voidEntry = audit.find((a) => a.action === 'TRANSACTION_VOIDED' && a.targetId === event.id);
    expect(voidEntry).toBeDefined();
    expect(voidEntry?.actorName).toBe('Dawit M.');
  });
});
