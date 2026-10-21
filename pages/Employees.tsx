import React from 'react';
import { Staff } from './Staff';

/**
 * Legacy route wrapper delegating to Staff & Audit page.
 */
export const Employees: React.FC = () => {
  return <Staff />;
};