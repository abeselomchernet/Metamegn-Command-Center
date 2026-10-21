import React, { useState } from 'react';
import { ShoppingBag, Activity, AlertOctagon } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { TransactionFeed } from '../components/TransactionFeed';
import { MOCK_TRANSACTIONS } from '../constants';
import { Transaction, TransactionStatus } from '../types';
import { Link } from 'react-router-dom';

export const SupervisorDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Supervisor Actions
  const handleVoidTransaction = (txId: string) => {
      const tx = transactions.find(t => t.id === txId);
      if (tx) {
          const confirmVoid = window.confirm(`Are you sure you want to VOID transaction ${tx.tx_ref} of ${tx.amount} ETB? \n\nThis action will be logged.`);
          if (confirmVoid) {
              setTransactions(prev => prev.map(t => 
                  t.id === txId ? { ...t, status: TransactionStatus.VOID } : t
              ));
          }
      }
  };

  // Calculate Shift Metrics
  const activeTills = 3;
  const voidCount = transactions.filter(t => t.status === TransactionStatus.VOID).length;
  const todayCount = transactions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 font-ethiopic">Supervisor Dashboard</h1>
            <p className="text-slate-500">Branch Operations & Monitoring</p>
        </div>
        <Link to="/tills" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Manage Tills
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Active Tills" 
          subTitle="ንቁ መዝገቦች"
          value={`${activeTills}`} 
          icon={Activity}
        />
        <StatsCard 
          title="Total Transactions" 
          subTitle="የግብይት ብዛት"
          value={todayCount} 
          icon={ShoppingBag}
        />
        <StatsCard 
          title="Voided / Cancelled" 
          subTitle="የተሰረዙ"
          value={voidCount} 
          icon={AlertOctagon}
          trend={voidCount > 0 ? "Requires Attention" : "Good"}
          trendUp={voidCount === 0}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-blue-50/30">
            <h2 className="text-lg font-bold text-slate-900 font-ethiopic">Live Transaction Monitor</h2>
            <p className="text-xs text-slate-500">Monitor and Void suspicious transactions.</p>
          </div>
          <TransactionFeed transactions={transactions} onVoid={handleVoidTransaction} />
      </div>
    </div>
  );
};