import { describe, it, expect } from 'vitest';
import { Role, hasPermission, ROLE_PERMISSIONS } from '../src/domain/permissions';

describe('Permissions & Role-Based Access Control', () => {
  it('enforces Cashier permissions correctly', () => {
    expect(hasPermission(Role.CASHIER, 'capture:create')).toBe(true);
    expect(hasPermission(Role.CASHIER, 'capture:view_own')).toBe(true);
    expect(hasPermission(Role.CASHIER, 'shifts:count')).toBe(true);

    // Cashier must NOT have supervisor/manager permissions
    expect(hasPermission(Role.CASHIER, 'capture:void')).toBe(false);
    expect(hasPermission(Role.CASHIER, 'reconciliation:view')).toBe(false);
    expect(hasPermission(Role.CASHIER, 'reconciliation:resolve')).toBe(false);
    expect(hasPermission(Role.CASHIER, 'staff:manage')).toBe(false);
    expect(hasPermission(Role.CASHIER, 'audit:view')).toBe(false);
  });

  it('enforces Supervisor permissions correctly', () => {
    expect(hasPermission(Role.SUPERVISOR, 'capture:void')).toBe(true);
    expect(hasPermission(Role.SUPERVISOR, 'reconciliation:view')).toBe(true);
    expect(hasPermission(Role.SUPERVISOR, 'reconciliation:resolve')).toBe(true);
    expect(hasPermission(Role.SUPERVISOR, 'shifts:approve')).toBe(true);
    expect(hasPermission(Role.SUPERVISOR, 'audit:view')).toBe(true);

    // Supervisor does not have full org settings
    expect(hasPermission(Role.SUPERVISOR, 'staff:manage')).toBe(false);
  });

  it('enforces Manager permissions correctly', () => {
    expect(hasPermission(Role.MANAGER, 'capture:create')).toBe(true);
    expect(hasPermission(Role.MANAGER, 'capture:void')).toBe(true);
    expect(hasPermission(Role.MANAGER, 'reconciliation:resolve')).toBe(true);
    expect(hasPermission(Role.MANAGER, 'reports:view')).toBe(true);
    expect(hasPermission(Role.MANAGER, 'staff:manage')).toBe(true);
    expect(hasPermission(Role.MANAGER, 'audit:view')).toBe(true);
  });
});
