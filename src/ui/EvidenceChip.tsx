import React from 'react';
import { EvidenceStatus } from '../domain/evidence';

interface EvidenceChipProps {
  status: EvidenceStatus;
  detail?: string;
  className?: string;
}

const STATUS_CONFIG: Record<
  EvidenceStatus,
  { label: string; bg: string; text: string; border: string; indicator: string }
> = {
  'Sample data': {
    label: 'Sample data',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    indicator: 'bg-slate-400',
  },
  'Assumption': {
    label: 'Assumption',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    indicator: 'bg-amber-500',
  },
  'Not tested': {
    label: 'Not tested',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-300',
    indicator: 'bg-blue-500',
  },
  'Needs approval': {
    label: 'Needs approval',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-300',
    indicator: 'bg-rose-500',
  },
};

export const EvidenceChip: React.FC<EvidenceChipProps> = ({ status, detail, className = '' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Sample data'];

  return (
    <span
      title={detail || `Status: ${status} (No live or verified data)`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${config.bg} ${config.text} ${config.border} tracking-tight whitespace-nowrap select-none ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.indicator}`} aria-hidden="true" />
      <span>{config.label}</span>
      {detail && <span className="opacity-75 text-[10px]">({detail})</span>}
    </span>
  );
};
