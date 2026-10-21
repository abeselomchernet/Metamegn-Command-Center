import React from 'react';
import { POS } from './POS';

/**
 * Standalone employee cashier view.
 * Uses the refactored modular POS state machine and components.
 */
export const EmployeeDashboard: React.FC = () => {
  return <POS />;
};