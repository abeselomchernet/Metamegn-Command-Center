import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Activity, RefreshCw, Landmark, ArrowRight } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { SalesChart } from '../components/SalesChart';
import { TransactionFeed } from '../components/TransactionFeed';
import { MOCK_CHART_DATA, MOCK_TRANSACTIONS } from '../constants';
import { Transaction, TransactionStatus, PaymentProvider } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isLive, setIsLive] = useState(true);

  // Calculate totals
  const totalRevenue = transactions
    .filter(t => t.status === TransactionStatus.SUCCESS)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const txCount = transactions.length;

  // Simulate Real-time incoming transactions
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // 30% chance to add a new transaction every 5 seconds
      if (Math.random() > 0.7) {
        const newTx: Transaction = {
          id: `tx_${Date.now()}`,
          tx_ref: `REF-${Math.floor(Math.random() * 900000) + 100000}`,
          amount: [50, 120, 200, 500, 1000][Math.floor(Math.random() * 5)],
          currency: 'ETB',
          status: TransactionStatus.SUCCESS,
          provider: Math.random() > 0.5 ? PaymentProvider.TELEBIRR : PaymentProvider.MPESA,
          created_at: new Date().toISOString(),
          till_name: Math.random() > 0.5 ? 'Main Counter (ዋና)' : 'Cafe Window (መስኮት)',
        };

        setTransactions(prev => [newTx, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6">
      {/* Top Bar with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-ethiopic">Admin Overview / አጠቃላይ</h1>
          <p className="text-slate-500">Financial Performance & Analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/settlements" className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            <Landmark size={16} className="mr-2" />
            Settlements
          </Link>
          <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </div>
          <button 
            onClick={() => setIsLive(!isLive)}
            className="p-2 text-slate-400 hover:text-brand-green hover:bg-slate-100 rounded-lg transition-colors"
            title={isLive ? "Pause Feed" : "Resume Feed"}
          >
            <RefreshCw size={20} className={isLive ? "animate-spin-slow" : ""} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Revenue" 
          subTitle="ጠቅላላ ሽያጭ"
          value={`ETB ${totalRevenue.toLocaleString()}`} 
          icon={DollarSign}
          trend="12.5%"
          trendUp={true}
        />
        <StatsCard 
          title="Transactions" 
          subTitle="የግብይት ብዛት"
          value={txCount} 
          icon={ShoppingBag}
          trend="4.2%"
          trendUp={true}
        />
        <StatsCard 
          title="Active Tills" 
          subTitle="ንቁ መዝገቦች"
          value="2/3" 
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed - Takes up 2/3 space on large screens */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 font-ethiopic">Live Transactions</h2>
            <Link to="/reports" className="text-sm text-brand-green font-medium hover:underline flex items-center">
                Full Report <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
          <TransactionFeed transactions={transactions} />
        </div>

        {/* Chart - Takes up 1/3 space on large screens */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-1 font-ethiopic">Weekly Sales</h2>
          <p className="text-xs text-slate-500 mb-6 font-ethiopic">ሳምንታዊ የሽያጭ ሁኔታ</p>
          <div className="flex-1 min-h-[250px]">
            <SalesChart data={MOCK_CHART_DATA} />
          </div>
        </div>
      </div>
    </div>
  );
};