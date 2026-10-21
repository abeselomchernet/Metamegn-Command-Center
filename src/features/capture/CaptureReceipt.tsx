import React from 'react';
import { LedgerEvent, PAYMENT_RAILS } from '../../domain/types';
import { formatETB } from '../../domain/money';
import { CheckCircle2, Clock, RotateCcw, Printer, Share2 } from 'lucide-react';
import { EvidenceChip } from '../../ui/EvidenceChip';

interface CaptureReceiptProps {
  event: LedgerEvent;
  onNewCapture: () => void;
}

export const CaptureReceipt: React.FC<CaptureReceiptProps> = ({ event, onNewCapture }) => {
  const rail = PAYMENT_RAILS[event.railId];
  const isCash = event.railId === 'cash';

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Paper Receipt Simulation */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-md relative overflow-hidden text-center font-sans">
        {/* Top Notch Decor */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

        <div className="inline-flex p-2.5 rounded-full bg-amber-50 text-amber-600 mb-2">
          {isCash ? (
            <CheckCircle2 size={32} className="text-slate-600" />
          ) : (
            <Clock size={32} className="text-amber-600" />
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900">
          {isCash ? 'Cash Captured at Till' : 'Recorded, Awaiting Provider Report'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {isCash
            ? 'Counted into cash drawer. Reconciles at shift close.'
            : 'Event recorded into acceptance ledger. Awaiting provider batch report.'}
        </p>

        <div className="my-5 py-4 border-y border-dashed border-slate-200">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Captured Amount</div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
            {formatETB(event.amountCents)}
          </div>
        </div>

        <div className="space-y-2 text-xs text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Reference:</span>
            <span className="font-mono font-bold text-slate-900">{event.txRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment Rail:</span>
            <span className="font-medium text-slate-800">{rail?.label || event.railId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Till / Cashier:</span>
            <span className="font-medium text-slate-800">{event.tillName} ({event.cashierName})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Timestamp:</span>
            <span className="font-mono text-slate-600 text-[11px]">
              {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          {event.offlineQueued && (
            <div className="flex justify-between text-amber-700 bg-amber-50 p-1.5 rounded text-[11px] font-medium">
              <span>Sync Mode:</span>
              <span>Queued offline (local storage)</span>
            </div>
          )}
        </div>

        {/* Audit Disclaimer */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-tight">
          Independent acceptance event record. Not a fund transfer. Does not imply custody or settlement.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 py-2.5 px-3 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Printer size={15} />
          <span>Print Slip</span>
        </button>
        <button
          type="button"
          onClick={onNewCapture}
          className="flex-2 py-2.5 px-3 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <RotateCcw size={15} />
          <span>New Transaction</span>
        </button>
      </div>
    </div>
  );
};
