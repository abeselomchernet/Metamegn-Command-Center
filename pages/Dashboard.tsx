import React from 'react';
import { Reconciliation } from './Reconciliation';

/**
 * Primary Landing View: Reconciliation Summary & Exceptions Center.
 * As specified in user requirements: landing view is the reconciliation summary.
 * Zero payouts, zero custody, deterministic mock data only.
 */
export const Dashboard: React.FC = () => {
  return <Reconciliation />;
};