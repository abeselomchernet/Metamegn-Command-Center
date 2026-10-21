import React from 'react';
import { Transaction, TransactionStatus } from '../types';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface LiveTransactionFeedProps {
  transactions: Transaction[];
}

export const LiveTransactionFeed: React.FC<LiveTransactionFeedProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p>No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto h-full pr-2 pb-4">
      {transactions.map((tx, index) => (
        <div 
          key={tx.id} 
          className={`flex items-center justify-between p-4 rounded-xl border ${
            index === 0 ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              tx.status === TransactionStatus.SUCCESS ? 'bg-green-100 text-green-600' :
              tx.status === TransactionStatus.PENDING ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {tx.status === TransactionStatus.SUCCESS && <CheckCircle size={20} />}
              {tx.status === TransactionStatus.PENDING && <Clock size={20} />}
              {tx.status === TransactionStatus.FAILED && <AlertCircle size={20} />}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">
                {tx.amount.toFixed(2)} <span className="text-sm text-slate-500">{tx.currency}</span>
              </p>
              <p className="text-xs text-slate-500 font-mono">{new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {tx.provider}</p>
            </div>
          </div>
          <div className="text-right">
             <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600">
               {tx.tx_ref}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
};