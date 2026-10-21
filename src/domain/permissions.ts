/**
 * Role-Based Access Control and Permissions Map.
 * Roles:
 * - CASHIER: Capture transactions, view own till sales, initiate shift count
 * - SUPERVISOR: Void captured transactions with reason, assign & resolve exceptions, inspect ageing
 * - MANAGER: Full visibility, reports, staff management, audit log inspection, reconciliation rules
 */

export enum Role {
  CASHIER = 'CASHIER',
  SUPERVISOR = 'SUPERVISOR',
  MANAGER = 'MANAGER',
}

export type Permission =
  | 'capture:create'
  | 'capture:view_own'
  | 'capture:view_all'
  | 'capture:void'
  | 'reconciliation:view'
  | 'reconciliation:resolve'
  | 'reconciliation:export'
  | 'shifts:count'
  | 'shifts:approve'
  | 'reports:view'
  | 'staff:view'
  | 'staff:manage'
  | 'audit:view';

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.CASHIER]: [
    'capture:create',
    'capture:view_own',
    'shifts:count',
  ],
  [Role.SUPERVISOR]: [
    'capture:create',
    'capture:view_own',
    'capture:view_all',
    'capture:void',
    'reconciliation:view',
    'reconciliation:resolve',
    'reconciliation:export',
    'shifts:count',
    'shifts:approve',
    'reports:view',
    'staff:view',
    'audit:view',
  ],
  [Role.MANAGER]: [
    'capture:create',
    'capture:view_own',
    'capture:view_all',
    'capture:void',
    'reconciliation:view',
    'reconciliation:resolve',
    'reconciliation:export',
    'shifts:count',
    'shifts:approve',
    'reports:view',
    'staff:view',
    'staff:manage',
    'audit:view',
  ],
};

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const ROLE_LABELS: Record<Role, string> = {
  [Role.CASHIER]: 'Cashier',
  [Role.SUPERVISOR]: 'Supervisor',
  [Role.MANAGER]: 'Manager',
};
