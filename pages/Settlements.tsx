import React from 'react';
import { Reconciliation } from './Reconciliation';

/**
 * Legacy route redirect wrapper.
 * Replaces Settlements and Payouts with Reconciliation and Exceptions.
 * No payouts, no transfers, and zero funds custody.
 */
export const Settlements: React.FC = () => {
  return <Reconciliation />;
};