import React, { useState } from 'react';
import { Landmark, ArrowRight, Download, CheckCircle2, Wallet, Smartphone, History, Filter, Banknote, Building2, CreditCard, RefreshCw, FileText } from 'lucide-react';

interface Payout {
    id: string;
    date: string;
    provider: string;
    amount: number;
    status: 'completed' | 'processing' | 'pending_payout';
    ref: string;
}

export const Settlements: React.FC = () => {
  const [filter, setFilter] = useState('all');

  // Mock balances per provider
  const [balances, setBalances] = useState({
    telebirr: 18450.00,
    mpesa: 12200.00,
    cbe: 8500.00,
    chapa: 4500.00,
    cash: 6100.00,
  });

  const [payouts, setPayouts] = useState<Payout[]>([
      { id: '1', date: 'Today, 09:00 AM', provider: 'Telebirr', amount: 12400.00, status: 'processing', ref: 'SET-882190' },
      { id: '2', date: 'Oct 24, 2023', provider: 'Other Banks (CBE)', amount: 45100.00, status: 'completed', ref: 'SET-882189' },
  ]);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const totalBalance = Object.values(balances).reduce((a, b) => a + b, 0);

  const handleInitiatePayout = (provider: keyof typeof balances, name: string) => {
      const amount = balances[provider];
      if (amount <= 0) return;

      if (confirm(`Initiate payout of ETB ${amount.toLocaleString()} for ${name}?`)) {
          // Add to payouts with 'pending_payout' status
          const newPayout: Payout = {
              id: Date.now().toString(),
              date: 'Just now',
              provider: name,
              amount: amount,
              status: 'pending_payout',
              ref: `SET-${Math.floor(Math.random() * 100000)}`
          };
          setPayouts([newPayout, ...payouts]);
          
          // Clear balance
          setBalances(prev => ({...prev, [provider]: 0}));
      }
  };

  const handleChapaReconciliation = () => {
      setIsGeneratingReport(true);
      setTimeout(() => {
          setIsGeneratingReport(false);
          alert("Chapa Reconciliation Report (CSV) generated and downloaded successfully.");
      }, 2000);
  };

  const getStatusBadge = (status: Payout['status']) => {
      switch(status) {
          case 'completed': 
            return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center w-fit"><CheckCircle2 size={12} className="mr-1"/> Completed</span>;
          case 'processing': 
            return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center w-fit"><RefreshCw size={12} className="mr-1 animate-spin-slow"/> Processing</span>;
          case 'pending_payout': 
            return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center w-fit"><History size={12} className="mr-1"/> Pending Payout</span>;
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 font-ethiopic">Settlements & Payouts</h1>
             <p className="text-slate-500 font-ethiopic">Manage wallet balances and bank transfers / የባንክ ገቢዎች</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium flex items-center">
                <Filter size={16} className="mr-2" /> Filter
            </button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium flex items-center">
                <History size={16} className="mr-2" /> History
            </button>
          </div>
       </div>

       {/* Total Balance Hero */}
       <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end">
               <div>
                   <p className="text-slate-400 font-medium mb-1 flex items-center">
                        <Wallet size={16} className="mr-2" /> Total Uncleared Funds
                   </p>
                   <h2 className="text-5xl font-black tracking-tight mt-2">ETB {totalBalance.toLocaleString()}</h2>
                   <p className="text-sm text-green-400 mt-3 flex items-center font-medium bg-green-400/10 w-fit px-3 py-1 rounded-full border border-green-400/20">
                       <CheckCircle2 size={14} className="mr-2" />
                       All funds verified and ready for payout
                   </p>
               </div>
               <div className="mt-6 md:mt-0 text-right">
                   <p className="text-slate-400 text-xs mb-1">Next Auto-Settlement</p>
                   <p className="font-bold text-lg">Tomorrow, 9:00 AM</p>
               </div>
           </div>
       </div>

       {/* Provider Breakdown Grid */}
       <h3 className="font-bold text-slate-800 text-lg mt-4">Wallet Breakdown</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
           {/* Telebirr */}
           <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
               <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                           tele
                       </div>
                       <span className="font-bold text-slate-700">Telebirr</span>
                   </div>
                   <h4 className="text-2xl font-bold text-slate-900 mb-1">{balances.telebirr.toLocaleString()}</h4>
                   <p className="text-xs text-slate-500 mb-4">ETB</p>
                   <button 
                    onClick={() => handleInitiatePayout('telebirr', 'Telebirr')}
                    disabled={balances.telebirr === 0}
                    className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors text-sm disabled:opacity-50">
                       Transfer to Bank
                   </button>
               </div>
           </div>

           {/* M-Pesa */}
           <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
               <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs">
                           M
                       </div>
                       <span className="font-bold text-slate-700">M-Pesa</span>
                   </div>
                   <h4 className="text-2xl font-bold text-slate-900 mb-1">{balances.mpesa.toLocaleString()}</h4>
                   <p className="text-xs text-slate-500 mb-4">ETB</p>
                   <button 
                    onClick={() => handleInitiatePayout('mpesa', 'M-Pesa')}
                    disabled={balances.mpesa === 0}
                    className="w-full py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50">
                       Transfer to Bank
                   </button>
               </div>
           </div>

           {/* Chapa - NEW */}
           <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
               <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                           <CreditCard size={18} />
                       </div>
                       <span className="font-bold text-slate-700">Chapa</span>
                   </div>
                   <h4 className="text-2xl font-bold text-slate-900 mb-1">{balances.chapa.toLocaleString()}</h4>
                   <p className="text-xs text-slate-500 mb-4">ETB</p>
                   <div className="flex gap-2">
                        <button 
                            onClick={() => handleInitiatePayout('chapa', 'Chapa')}
                            disabled={balances.chapa === 0}
                            className="flex-1 py-2 bg-green-50 text-green-600 font-bold rounded-lg hover:bg-green-100 transition-colors text-xs disabled:opacity-50">
                            Payout
                        </button>
                        <button 
                            onClick={handleChapaReconciliation}
                            disabled={isGeneratingReport}
                            className="px-3 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors text-xs flex items-center justify-center disabled:opacity-70"
                            title="Generate Reconciliation Report"
                        >
                            {isGeneratingReport ? <RefreshCw size={14} className="animate-spin"/> : <FileText size={14} />}
                        </button>
                   </div>
               </div>
           </div>

           {/* Other Banks */}
           <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
               <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                           <Building2 size={18} />
                       </div>
                       <span className="font-bold text-slate-700">Other Banks</span>
                   </div>
                   <h4 className="text-2xl font-bold text-slate-900 mb-1">{balances.cbe.toLocaleString()}</h4>
                   <p className="text-xs text-slate-500 mb-4">ETB</p>
                   <button 
                    onClick={() => handleInitiatePayout('cbe', 'Other Banks')}
                    disabled={balances.cbe === 0}
                    className="w-full py-2 bg-purple-50 text-purple-600 font-bold rounded-lg hover:bg-purple-100 transition-colors text-sm disabled:opacity-50">
                       Process Batch
                   </button>
               </div>
           </div>

           {/* Cash */}
           <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
               <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                           <Banknote size={18} />
                       </div>
                       <span className="font-bold text-slate-700">Cash on Hand</span>
                   </div>
                   <h4 className="text-2xl font-bold text-slate-900 mb-1">{balances.cash.toLocaleString()}</h4>
                   <p className="text-xs text-slate-500 mb-4">ETB (Needs Deposit)</p>
                   <button 
                    onClick={() => handleInitiatePayout('cash', 'Cash Deposit')}
                    disabled={balances.cash === 0}
                    className="w-full py-2 bg-orange-50 text-orange-700 font-bold rounded-lg hover:bg-orange-100 transition-colors text-sm disabled:opacity-50">
                       Mark Deposited
                   </button>
               </div>
           </div>
       </div>

       {/* Recent Settlements Table */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-6">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">Recent Payouts</h3>
               <button className="text-brand-green text-sm font-medium flex items-center hover:underline">
                   <Download size={16} className="mr-1" /> Export Statement
               </button>
           </div>
           
           <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-slate-200">
                   <thead className="bg-slate-50">
                       <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ref ID</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Destination</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-200">
                       {payouts.map((payout) => (
                           <tr key={payout.id} className="hover:bg-slate-50 group">
                                <td className="px-6 py-4 text-sm text-slate-600">{payout.date}</td>
                                <td className="px-6 py-4 text-sm font-mono text-slate-500">{payout.ref}</td>
                                <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                                    {payout.provider}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-900">ETB {payout.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(payout.status)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-blue-600 text-xs font-medium">Details</button>
                                </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       </div>
    </div>
  );
};