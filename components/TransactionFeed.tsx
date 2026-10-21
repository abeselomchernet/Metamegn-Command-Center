import React from 'react';
import { LedgerEvent, LedgerStatus, PaymentRailId, PAYMENT_RAILS } from '../src/domain/types';
import { formatETB } from '../src/domain/money';
import { CheckCircle, AlertCircle, Clock, Smartphone, CreditCard, Ban, Trash2, Building2, QrCode, Banknote } from 'lucide-react';
import { useRole } from '../context/RoleContext';

interface TransactionFeedProps {
  transactions: LedgerEvent[];
  onVoid?: (txId: string) => void;
}

const getRailIcon = (rail: PaymentRailId) => {
  switch (rail) {
    case 'wallet_a':
      return <Smartphone size={15} className="text-blue-500" />;
    case 'bank_b':
      return <Building2 size={15} className="text-emerald-500" />;
    case 'interop_qr':
      return <QrCode size={15} className="text-purple-500" />;
    case 'card_tap':
      return <CreditCard size={15} className="text-amber-500" />;
    case 'cash':
      return <Banknote size={15} className="text-slate-500" />;
  }
};

const getStatusBadge = (status: LedgerStatus) => {
  switch (status) {
    case 'matched':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle size={11} className="mr-1 text-emerald-600" />
          Matched
        </span>
      );
    case 'awaiting_provider':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock size={11} className="mr-1 text-amber-600" />
          Awaiting Report
        </span>
      );
    case 'captured':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <CheckCircle size={11} className="mr-1 text-slate-500" />
          Captured
        </span>
      );
    case 'exception':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <AlertCircle size={11} className="mr-1 text-rose-600" />
          Exception
        </span>
      );
    case 'voided':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 line-through">
          <Ban size={11} className="mr-1 text-slate-400" />
          Voided
        </span>
      );
  }
};

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ transactions, onVoid }) => {
  const { hasPerm } = useRole();
  const canVoid = hasPerm('capture:void');

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-slate-400">
        No transactions recorded in this period.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px]">
          <tr>
            <th className="py-2.5 px-4">Time</th>
            <th className="py-2.5 px-4">Amount</th>
            <th className="py-2.5 px-4">Rail</th>
            <th className="py-2.5 px-4">Till</th>
            <th className="py-2.5 px-4">Status</th>
            {canVoid && <th className="py-2.5 px-4 text-right">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-2.5 px-4 text-slate-500 font-mono">
                {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="py-2.5 px-4">
                <div className="font-bold text-slate-900 font-mono tabular-nums">
                  {formatETB(tx.amountCents)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{tx.txRef}</div>
              </td>
              <td className="py-2.5 px-4">
                <div className="flex items-center gap-1.5 text-slate-700">
                  {getRailIcon(tx.railId)}
                  <span className="font-medium">{PAYMENT_RAILS[tx.railId]?.label || tx.railId}</span>
                </div>
              </td>
              <td className="py-2.5 px-4 text-slate-600">{tx.tillName}</td>
              <td className="py-2.5 px-4">{getStatusBadge(tx.status)}</td>
              {canVoid && (
                <td className="py-2.5 px-4 text-right">
                  {tx.status !== 'voided' && onVoid && (
                    <button
                      onClick={() => onVoid(tx.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                      title="Void transaction"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};