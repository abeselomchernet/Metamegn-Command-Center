import React, { useState, useEffect } from 'react';
import { MySalesSummary } from '../components/MySalesSummary';
import { QuickPayButton } from '../components/QuickPayButton';
import { LiveTransactionFeed } from '../components/LiveTransactionFeed';
import { Transaction, TransactionStatus, PaymentProvider } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { LogOut, X, Delete, QrCode, Banknote, Printer, CheckCircle2, RefreshCw, FileText, Smartphone, Building2, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type PaymentStep = 'amount' | 'method' | 'generating-qr' | 'digital-pending' | 'success';

export const EmployeeDashboard: React.FC = () => {
  // Employee State
  const [transactions, setTransactions] = useState<Transaction[]>(
    MOCK_TRANSACTIONS.filter(t => t.till_name.includes('Main'))
  );
  
  // Modal & Flow State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('amount');
  const [inputAmount, setInputAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentProvider | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentTx, setCurrentTx] = useState<Transaction | null>(null);
  const [ussdSent, setUssdSent] = useState(false);
  
  // Calculate totals
  const dailyTotal = transactions
    .filter(t => t.status === TransactionStatus.SUCCESS)
    .reduce((sum, t) => sum + t.amount, 0);

  const cashTotal = transactions
    .filter(t => t.status === TransactionStatus.SUCCESS && t.provider === PaymentProvider.CASH)
    .reduce((sum, t) => sum + t.amount, 0);

  const digitalTotal = dailyTotal - cashTotal;

  // Simulate Real-time incoming transactions (background)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) { // Reduced frequency
        const newTx: Transaction = {
          id: `tx_${Date.now()}`,
          tx_ref: `REF-${Math.floor(Math.random() * 900000) + 100000}`,
          amount: [50, 100, 150][Math.floor(Math.random() * 3)],
          currency: 'ETB',
          status: TransactionStatus.SUCCESS,
          provider: PaymentProvider.TELEBIRR,
          created_at: new Date().toISOString(),
          till_name: 'Main Counter (ዋና)',
        };
        setTransactions(prev => [newTx, ...prev]);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---

  const openNewPayment = () => {
      setInputAmount('');
      setPaymentStep('amount');
      setSelectedMethod(null);
      setCurrentTx(null);
      setUssdSent(false);
      setIsPaymentModalOpen(true);
  };

  const handleKeypadPress = (val: string) => {
      if (val === 'backspace') {
          setInputAmount(prev => prev.slice(0, -1));
          return;
      }
      if (val === '.' && inputAmount.includes('.')) return;
      if (inputAmount.length > 7) return; 
      setInputAmount(prev => prev + val);
  };

  const handleAmountSubmit = () => {
      if (!inputAmount || parseFloat(inputAmount) === 0) return;
      setPaymentStep('method');
  };

  const handleMethodSelect = (method: PaymentProvider) => {
      setSelectedMethod(method);
      if (method === PaymentProvider.CASH) {
          processTransaction(method);
      } else {
          // Simulate QR/USSD Initialization Phase
          setPaymentStep('generating-qr');
          setTimeout(() => {
              setPaymentStep('digital-pending');
          }, 1500);
      }
  };

  const processTransaction = (provider: PaymentProvider) => {
      setProcessing(true);
      const newTx: Transaction = {
        id: `tx_new_${Date.now()}`,
        tx_ref: `REF-${Math.floor(Math.random() * 900000)}`,
        amount: parseFloat(inputAmount),
        currency: 'ETB',
        status: TransactionStatus.SUCCESS,
        provider: provider,
        created_at: new Date().toISOString(),
        till_name: 'Main Counter (ዋና)',
    };
    
    // Simulate network delay
    setTimeout(() => {
        setTransactions(prev => [newTx, ...prev]);
        setCurrentTx(newTx);
        setProcessing(false);
        setPaymentStep('success');
    }, 1000);
  };

  // Helper to simulate verifying a digital payment
  const verifyDigitalPayment = () => {
      processTransaction(selectedMethod || PaymentProvider.TELEBIRR);
  };

  const handleSendUSSD = () => {
      setUssdSent(true);
      // Simulate API call
      setTimeout(() => {
          // Auto-check after USSD could go here
      }, 3000);
  };

  const handlePrintReceipt = () => {
      alert("Printing receipt to thermal printer...");
  };

  const handleBack = () => {
    if (paymentStep === 'method') setPaymentStep('amount');
    if (paymentStep === 'digital-pending') setPaymentStep('method');
  };

  // --- Render Steps ---

  const renderAmountStep = () => (
    <>
        <div className="p-8 text-center bg-white">
            <div className="text-sm text-slate-500 mb-1">Enter Amount</div>
            <div className="text-5xl font-black text-slate-900 tracking-tight flex items-center justify-center">
            <span className="text-2xl text-slate-400 mr-2 font-medium">ETB</span>
            {inputAmount || '0'}
            </div>
        </div>

        <div className="bg-slate-50 p-4 grid grid-cols-3 gap-3 flex-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                key={num}
                onClick={() => handleKeypadPress(num.toString())}
                className="bg-white rounded-xl shadow-sm border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 text-2xl font-bold text-slate-700 py-4 transition-all"
                >
                    {num}
                </button>
            ))}
            <button 
                onClick={() => handleKeypadPress('.')}
                className="bg-white rounded-xl shadow-sm border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 text-2xl font-bold text-slate-700 py-4 transition-all"
            >
                .
            </button>
            <button 
                onClick={() => handleKeypadPress('0')}
                className="bg-white rounded-xl shadow-sm border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 text-2xl font-bold text-slate-700 py-4 transition-all"
            >
                0
            </button>
            <button 
                onClick={() => handleKeypadPress('backspace')}
                className="bg-slate-200 rounded-xl shadow-sm border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 text-slate-600 py-4 transition-all flex items-center justify-center"
            >
                <Delete size={28} />
            </button>
        </div>
        <div className="p-4 bg-white border-t border-slate-100">
            <button 
                onClick={handleAmountSubmit}
                disabled={!inputAmount || parseFloat(inputAmount) === 0}
                className="w-full py-4 rounded-xl text-xl font-bold text-white bg-brand-green hover:bg-green-600 shadow-lg shadow-green-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
            >
                CONTINUE
            </button>
        </div>
    </>
  );

  const renderMethodStep = () => (
      <div className="flex-1 bg-slate-50 p-6 flex flex-col justify-center space-y-3">
          <div className="text-center mb-4">
              <p className="text-slate-500">Total to Pay</p>
              <h2 className="text-3xl font-bold text-slate-900">ETB {inputAmount}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Telebirr */}
            <button 
                onClick={() => handleMethodSelect(PaymentProvider.TELEBIRR)}
                className="bg-white p-4 rounded-xl shadow-sm border-2 border-slate-100 hover:border-blue-500 group transition-all flex flex-col items-center text-center"
            >
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <div className="font-bold text-xs">tele</div>
                </div>
                <span className="font-bold text-slate-700 text-sm">Telebirr</span>
            </button>

            {/* M-Pesa */}
            <button 
                onClick={() => handleMethodSelect(PaymentProvider.MPESA)}
                className="bg-white p-4 rounded-xl shadow-sm border-2 border-slate-100 hover:border-red-500 group transition-all flex flex-col items-center text-center"
            >
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <span className="font-bold text-xs">M</span>
                </div>
                <span className="font-bold text-slate-700 text-sm">M-Pesa</span>
            </button>
          </div>

          {/* Other Banks / ETHQR */}
          <button 
            onClick={() => handleMethodSelect(PaymentProvider.CBE)} // Using CBE as proxy for 'Other Banks' generic
            className="bg-white p-4 rounded-xl shadow-sm border-2 border-slate-100 hover:border-purple-500 group transition-all flex items-center"
          >
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                  <Building2 size={20} />
              </div>
              <div className="ml-3 text-left">
                  <h3 className="font-bold text-slate-900 text-sm">Other Bank Apps</h3>
                  <p className="text-xs text-slate-500">CBE, BOAbyssinia, Awash (ETHQR)</p>
              </div>
          </button>

          {/* Cash */}
          <button 
            onClick={() => handleMethodSelect(PaymentProvider.CASH)}
            className="bg-white p-4 rounded-xl shadow-sm border-2 border-slate-100 hover:border-brand-green group transition-all flex items-center"
          >
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-brand-green group-hover:text-white transition-colors shrink-0">
                  <Banknote size={20} />
              </div>
              <div className="ml-3 text-left">
                  <h3 className="font-bold text-slate-900 text-sm">Cash Payment</h3>
                  <p className="text-xs text-slate-500">Manual record</p>
              </div>
          </button>
      </div>
  );

  const renderGeneratingQR = () => {
      const isMobileMoney = selectedMethod === PaymentProvider.TELEBIRR || selectedMethod === PaymentProvider.MPESA;
      return (
        <div className="flex-1 bg-white p-6 flex flex-col items-center justify-center text-center">
            <RefreshCw size={48} className="text-slate-300 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">
                {isMobileMoney ? 'Initializing Payment...' : 'Generating ETHQR...'}
            </h3>
            <p className="text-sm text-slate-500">Securing transaction parameters</p>
        </div>
      );
  };

  const renderDigitalPendingStep = () => {
    const isMobileMoney = selectedMethod === PaymentProvider.TELEBIRR || selectedMethod === PaymentProvider.MPESA;
    
    return (
      <div className="flex-1 bg-white p-6 flex flex-col items-center justify-start text-center overflow-y-auto">
          {processing ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="animate-spin text-brand-green mb-4"><RefreshCw size={48} /></div>
                  <p className="font-medium text-slate-600">Verifying Payment...</p>
              </div>
          ) : (
              <>
                <p className={`text-sm font-bold text-slate-900 mb-4 px-3 py-1 rounded-full animate-pulse ${isMobileMoney ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {isMobileMoney ? "Waiting for Mobile Confirmation" : "Waiting for Bank Transfer"}
                </p>
                <div className="w-full bg-white p-4 border-2 border-slate-900 rounded-2xl mb-4 shadow-xl relative overflow-hidden">
                    {/* Simulated Receipt Header in QR */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900"></div>
                    <div className="mb-2 text-xs font-mono text-slate-500">KALDIS COFFEE - BOLE</div>
                    <div className="flex justify-center my-2">
                        <QrCode size={160} className="text-slate-900" />
                    </div>
                    <div className="flex justify-between items-end border-t border-dashed border-slate-300 pt-2">
                        <div className="text-left">
                            <p className="text-[10px] text-slate-400">REF</p>
                            <p className="text-xs font-bold font-mono">TRX-{Math.floor(Math.random()*10000)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-black text-slate-900">ETB {inputAmount}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 w-full">
                     {isMobileMoney && (
                        <button 
                            onClick={handleSendUSSD}
                            disabled={ussdSent}
                            className={`w-full py-3 rounded-xl font-bold shadow-sm border transition-all flex items-center justify-center ${
                                ussdSent 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                            }`}
                        >
                            {ussdSent ? (
                                <><CheckCircle2 size={20} className="mr-2" /> Prompt Sent to Customer</>
                            ) : (
                                <><Send size={20} className="mr-2" /> Send USSD Request</>
                            )}
                        </button>
                    )}

                    <button 
                        onClick={verifyDigitalPayment}
                        className="w-full py-4 bg-brand-green text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-colors animate-pulse"
                    >
                        Verify Payment Status
                    </button>
                    
                    <button 
                        onClick={() => setPaymentStep('method')}
                        className="text-sm text-slate-400 font-medium hover:text-slate-600 underline"
                    >
                        Change Method
                    </button>
                </div>
              </>
          )}
      </div>
    );
  };

  const renderSuccessStep = () => (
      <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
              <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Payment Successful!</h2>
          <p className="text-slate-500 mb-6">Transaction {currentTx?.tx_ref}</p>
          
          <div className="bg-slate-50 rounded-xl p-4 w-full mb-8 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-slate-900 text-lg">ETB {currentTx?.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-slate-500">Method</span>
                  <span className="font-medium text-slate-700 capitalize">{currentTx?.provider}</span>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
              <button 
                onClick={handlePrintReceipt}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 hover:border-slate-300 text-slate-600 transition-colors"
              >
                  <Printer size={24} className="mb-2" />
                  <span className="font-bold text-sm">Print Receipt</span>
              </button>
              <button 
                onClick={openNewPayment}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-brand-green text-white hover:bg-green-700 shadow-lg shadow-green-100 transition-colors"
              >
                  <RefreshCw size={24} className="mb-2" />
                  <span className="font-bold text-sm">New Sale</span>
              </button>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* 1. Header */}
      <nav className="bg-white px-4 py-3 shadow-sm flex justify-between items-center border-b-2 border-brand-green shrink-0 z-10">
        <div>
          <p className="text-xs text-slate-500 font-mono">ID: EMP-8821</p>
          <h1 className="text-lg font-bold text-slate-900 font-ethiopic">የሽያጭ መቆጣጠሪያ</h1>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsSettlementOpen(true)}
                className="text-sm font-medium text-slate-600 hover:text-brand-green flex items-center px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
            >
                <FileText size={16} className="mr-2" />
                Settlement
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <Link to="/" className="p-2 text-slate-400 hover:text-slate-600" title="Exit to Admin">
                <LogOut size={20} />
            </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4 overflow-hidden flex flex-col max-w-lg mx-auto w-full">
        <div className="shrink-0">
            <MySalesSummary total={dailyTotal} count={transactions.length} />
        </div>

        <div className="shrink-0">
            <QuickPayButton onClick={openNewPayment} />
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-slate-500 text-xs font-bold uppercase tracking-wider font-ethiopic">የቅርብ ጊዜ ክፍያዎች (Live Feed)</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <LiveTransactionFeed transactions={transactions} />
          </div>
        </div>
      </main>

      {/* POS Modal */}
      {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center">
             <div className="w-full max-w-sm bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-auto sm:min-h-[500px]">
                 {/* Modal Header */}
                 <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center">
                        {paymentStep !== 'amount' && paymentStep !== 'success' && (
                             <button onClick={handleBack} className="mr-2 text-slate-400 hover:text-slate-600">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                         <span className="font-bold text-slate-700 font-ethiopic">
                             {paymentStep === 'amount' && 'Receive Payment'}
                             {paymentStep === 'method' && 'Select Method'}
                             {(paymentStep === 'generating-qr' || paymentStep === 'digital-pending') && 'Awaiting Payment'}
                             {paymentStep === 'success' && 'Completed'}
                         </span>
                    </div>
                     <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                         <X size={24} />
                     </button>
                 </div>

                 {/* Flow Content */}
                 <div className="flex-1 flex flex-col overflow-y-auto">
                    {paymentStep === 'amount' && renderAmountStep()}
                    {paymentStep === 'method' && renderMethodStep()}
                    {paymentStep === 'generating-qr' && renderGeneratingQR()}
                    {paymentStep === 'digital-pending' && renderDigitalPendingStep()}
                    {paymentStep === 'success' && renderSuccessStep()}
                 </div>
             </div>
          </div>
      )}

      {/* Settlement Modal */}
      {isSettlementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsSettlementOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <button 
                    onClick={() => setIsSettlementOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-xl font-bold text-slate-900 mb-1">Shift Settlement</h2>
                <p className="text-sm text-slate-500 mb-6">Current shift summary.</p>
                
                <div className="space-y-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                        <div className="flex items-center text-slate-600">
                            <Banknote size={20} className="mr-3" />
                            <span>Cash Total</span>
                        </div>
                        <span className="font-bold text-slate-900">ETB {cashTotal.toLocaleString()}</span>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl flex justify-between items-center text-blue-900">
                        <div className="flex items-center">
                            <QrCode size={20} className="mr-3 text-blue-500" />
                            <span>Digital Total</span>
                        </div>
                        <span className="font-bold">ETB {digitalTotal.toLocaleString()}</span>
                    </div>
                    <div className="p-4 border-t-2 border-slate-100 flex justify-between items-center pt-4">
                        <span className="font-bold text-slate-900">Grand Total</span>
                        <span className="font-black text-2xl text-brand-green">ETB {dailyTotal.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    onClick={() => alert('Shift Closed. Report generated.')}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Close Shift & Print Report
                </button>
            </div>
        </div>
      )}
    </div>
  );
};