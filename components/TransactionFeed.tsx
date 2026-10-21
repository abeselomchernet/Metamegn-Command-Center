import React from 'react';
import { Transaction, TransactionStatus, PaymentProvider, EmployeeRole } from '../types';
import { CheckCircle, AlertCircle, Clock, Smartphone, CreditCard, Ban, Trash2 } from 'lucide-react';
import { useRole } from '../context/RoleContext';

interface TransactionFeedProps {
  transactions: Transaction[];
  onVoid?: (txId: string) => void;
}

const getProviderIcon = (provider: PaymentProvider) => {
  switch (provider) {
    case PaymentProvider.TELEBIRR:
      return <Smartphone size={16} className="text-blue-500" />;
    case PaymentProvider.MPESA:
      return <Smartphone size={16} className="text-red-500" />;
    default:
      return <CreditCard size={16} className="text-slate-500" />;
  }
};

const getStatusBadge = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.SUCCESS:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Paid
        </span>
      );
    case TransactionStatus.PENDING:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock size={12} className="mr-1" />
          Pending
        </span>
      );
    case TransactionStatus.FAILED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle size={12} className="mr-1" />
          Failed
        </span>
      );
    case TransactionStatus.VOID:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 line-through decoration-slate-400">
          <Ban size={12} className="mr-1" />
          Voided
        </span>
      );
  }
};

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ transactions, onVoid }) => {
  const { role } = useRole();
  const canVoid = role === EmployeeRole.MANAGER || role === EmployeeRole.SUPERVISOR;

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        No transactions found today.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Provider
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Till
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </th>
            {canVoid && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-slate-900">
                  {tx.amount.toFixed(2)} {tx.currency}
                </div>
                <div className="text-xs text-slate-400">{tx.tx_ref}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-slate-700">
                    <span className="mr-2 bg-slate-100 p-1 rounded-full">{getProviderIcon(tx.provider)}</span>
                    {tx.provider}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {tx.till_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(tx.status)}
              </td>
              {canVoid && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {tx.status === TransactionStatus.SUCCESS && onVoid && (
                    <button 
                      onClick={() => onVoid(tx.id)}
                      className="text-slate-300 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                      title="Void Transaction"
                    >
                      <Trash2 size={16} />
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