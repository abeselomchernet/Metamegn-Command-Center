import React, { useState, useEffect } from 'react';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useTranslation } from '../src/i18n/I18nContext';
import { defaultAdapter } from '../src/data/MockAdapter';
import { LedgerEvent } from '../src/domain/types';
import { formatETB } from '../src/domain/money';
import {
  computeBankLens,
  computeMerchantLens,
  computeOperatorLens,
  computeSystemInclusionMetrics,
  BankLensInputs,
  MerchantLensInputs,
  OperatorLensInputs,
} from '../src/domain/value';
import {
  VALUE_LAB_TOP_LINE,
  BANK_ALREADY_SOLVES_IT_MESSAGE,
  MERCHANT_GAINS_NOTE,
  NO_PRICE_WORKS_SENTENCE,
  BANK_CEILING_BELOW_FLOOR_REASON,
  INCLUSION_HONEST_LIMIT_TEXT,
  CHALLENGE_PANEL_FOOTER_LINE,
  DEFAULT_BANK_INPUTS,
  DEFAULT_MERCHANT_INPUTS,
  DEFAULT_OPERATOR_INPUTS,
  SYSTEM_INCLUSION_HYPOTHESES,
  CHALLENGE_MODE_ROWS,
} from '../src/data/valueLab';
import {
  Building2,
  Store,
  Layers,
  Globe2,
  AlertTriangle,
  HelpCircle,
  Sliders,
  CheckCircle2,
  XCircle,
  Info,
  Scale,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export const ValueLab: React.FC = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'bank' | 'merchant' | 'operator' | 'system'>('bank');
  const [events, setEvents] = useState<LedgerEvent[]>([]);

  // Bank Lens state
  const [bankInputs, setBankInputs] = useState<BankLensInputs>({
    eventsPerDay: DEFAULT_BANK_INPUTS.eventsPerDay.defaultValue,
    minutesPerManualItem: DEFAULT_BANK_INPUTS.minutesPerManualItem.defaultValue,
    staffCostPerHourETB: DEFAULT_BANK_INPUTS.staffCostPerHourETB.defaultValue,
    complaintSharePercent: DEFAULT_BANK_INPUTS.complaintSharePercent.defaultValue,
    bankAlreadySolvesIt: false,
  });

  // Merchant Lens state
  const [merchantInputs, setMerchantInputs] = useState<MerchantLensInputs>({
    salesPerDay: DEFAULT_MERCHANT_INPUTS.salesPerDay.defaultValue,
    minutesLostPerDispute: DEFAULT_MERCHANT_INPUTS.minutesLostPerDispute.defaultValue,
    merchantAlreadyCopes: false,
  });

  // Operator Lens state
  const [operatorInputs, setOperatorInputs] = useState<{
    supportCostPerHourETB: number;
    fixedMonthlyRunCostETB: number;
    pricePerBankPerMonthETB: number;
    participatingBanksCount: number;
  }>({
    supportCostPerHourETB: DEFAULT_OPERATOR_INPUTS.supportCostPerHourETB.defaultValue,
    fixedMonthlyRunCostETB: DEFAULT_OPERATOR_INPUTS.fixedMonthlyRunCostETB.defaultValue,
    pricePerBankPerMonthETB: DEFAULT_OPERATOR_INPUTS.pricePerBankPerMonthETB.defaultValue,
    participatingBanksCount: DEFAULT_OPERATOR_INPUTS.participatingBanksCount.defaultValue,
  });

  useEffect(() => {
    const loadEvents = async () => {
      const list = await defaultAdapter.listEvents();
      setEvents(list);
    };
    loadEvents();
  }, []);

  const bankOutputs = computeBankLens(bankInputs);
  const merchantOutputs = computeMerchantLens(merchantInputs);
  const operatorOutputs = computeOperatorLens({
    ...operatorInputs,
    bankValueCeilingETB: bankOutputs.bankValueCeilingETBCents / 100,
  });
  const systemOutputs = computeSystemInclusionMetrics(events);

  return (
    <div className="space-y-6">
      {/* 1. Top Notice Banner (Fixed Text with Assumption Chip) */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 text-xs text-slate-800 leading-relaxed font-medium shadow-xs space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Notice</span>
          <EvidenceChip status="Assumption" detail="Simulation boundary" />
        </div>
        <p>{VALUE_LAB_TOP_LINE}</p>
        <p className="text-slate-500 text-[11px] italic pt-1 border-t border-slate-200">
          {t.valueLabHonestLimit}
        </p>
      </div>

      {/* 2. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.valueLabTitle}</h1>
            <EvidenceChip status="Assumption" detail="Economic model" />
          </div>
          <p className="text-xs text-slate-500">{t.valueLabSubtitle}</p>
        </div>
      </div>

      {/* 3. Four Equal Lenses Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('bank')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors border ${
            activeTab === 'bank'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 size={14} />
          <span>{t.tabBankLens}</span>
        </button>

        <button
          onClick={() => setActiveTab('merchant')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors border ${
            activeTab === 'merchant'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Store size={14} />
          <span>{t.tabMerchantLens}</span>
        </button>

        <button
          onClick={() => setActiveTab('operator')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors border ${
            activeTab === 'operator'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers size={14} />
          <span>{t.tabOperatorLens}</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors border ${
            activeTab === 'system'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Globe2 size={14} />
          <span>{t.tabSystemLens}</span>
        </button>
      </div>

      {/* 4. Lens Content Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
        {/* LENS 1: BANK LENS */}
        {activeTab === 'bank' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{t.bankLensHeading}</h2>
                  <EvidenceChip status="Assumption" detail="Bank effort" />
                </div>
                <p className="text-xs text-slate-500">
                  Calculates operational exception-handling effort with vs without the ledger layer.
                </p>
              </div>

              {/* Kill-switch Toggle: Bank Already Solves It */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <input
                  type="checkbox"
                  id="bankSolvesToggle"
                  checked={bankInputs.bankAlreadySolvesIt}
                  onChange={(e) =>
                    setBankInputs((prev) => ({ ...prev, bankAlreadySolvesIt: e.target.checked }))
                  }
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="bankSolvesToggle" className="text-xs font-medium text-slate-800 cursor-pointer">
                  {t.bankAlreadySolvesItLabel}
                </label>
              </div>
            </div>

            {/* If bank already solves it notice */}
            {bankInputs.bankAlreadySolvesIt && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                {t.bankAlreadySolvesItNote}
              </div>
            )}

            {/* Inputs Grid */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Editable Inputs</span>
                <span className="text-[10px] text-slate-400">(Placeholders for interview elicitation)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Events per day */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700">Events / Day</label>
                    <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                  </div>
                  <input
                    type="number"
                    value={bankInputs.eventsPerDay}
                    onChange={(e) =>
                      setBankInputs((prev) => ({
                        ...prev,
                        eventsPerDay: Math.max(10, parseInt(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 block">Digital merchant transactions</span>
                </div>

                {/* Minutes per manual item */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700">Minutes / Item</label>
                    <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                  </div>
                  <input
                    type="number"
                    value={bankInputs.minutesPerManualItem}
                    onChange={(e) =>
                      setBankInputs((prev) => ({
                        ...prev,
                        minutesPerManualItem: Math.max(1, parseInt(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 block">Manual matching time</span>
                </div>

                {/* Staff cost per hour */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700">Staff Cost (ETB/hr)</label>
                    <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                  </div>
                  <input
                    type="number"
                    value={bankInputs.staffCostPerHourETB}
                    onChange={(e) =>
                      setBankInputs((prev) => ({
                        ...prev,
                        staffCostPerHourETB: Math.max(10, parseInt(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 block">Bank reconciliation specialist</span>
                </div>

                {/* Complaint share */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700">Complaint Share (%)</label>
                    <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                  </div>
                  <input
                    type="number"
                    value={bankInputs.complaintSharePercent}
                    onChange={(e) =>
                      setBankInputs((prev) => ({
                        ...prev,
                        complaintSharePercent: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)),
                      }))
                    }
                    className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 block">Exceptions found by customer</span>
                </div>
              </div>
            </div>

            {/* Computed Outputs Comparison */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                Monthly Effort & Discrepancy Breakdown
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500">Baseline Match Rate</span>
                  <div className="text-xl font-bold font-mono text-slate-800">
                    {bankOutputs.baselineMatchRatePercent}%
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {bankInputs.bankAlreadySolvesIt ? 'Internal script automation' : 'Standard manual batch matching'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500">Effort Without Layer</span>
                  <div className="text-xl font-bold font-mono text-slate-800">
                    {bankOutputs.hoursWithoutPerMonth} hrs / mo
                  </div>
                  <span className="text-[10px] text-slate-400">
                    ~{bankOutputs.manualItemsPerDayWithout} items/day manual
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500">Effort With Layer</span>
                  <div className="text-xl font-bold font-mono text-emerald-800">
                    {bankOutputs.hoursWithPerMonth} hrs / mo
                  </div>
                  <span className="text-[10px] text-slate-400">
                    ~{bankOutputs.manualItemsPerDayWith} items/day residual
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500">Monthly Hours Saved</span>
                  <div className="text-xl font-bold font-mono text-slate-900">
                    {bankOutputs.hoursSavedPerMonth} hrs / mo
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Avoids ~{bankOutputs.complaintsAvoidedPerMonth} complaints/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Break-even / What You Would Have to Believe Statement */}
            <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs space-y-1.5 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-amber-300 uppercase tracking-widest text-[10px]">
                  Break-Even Condition ("What you would have to believe")
                </span>
                <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0 bg-slate-800 text-slate-200 border-slate-700" />
              </div>
              <p className="leading-relaxed text-slate-100 font-medium">
                "{bankOutputs.breakEvenSentence}"
              </p>
              <p className="text-[11px] text-slate-400">
                Formula: Value ceiling Z = (Hours saved × hourly rate) + (Complaints avoided × resolution overhead).
              </p>
            </div>
          </div>
        )}

        {/* LENS 2: MERCHANT LENS */}
        {activeTab === 'merchant' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{t.merchantLensHeading}</h2>
                  <EvidenceChip status="Assumption" detail="Merchant experience" />
                </div>
                <p className="text-xs text-slate-500">
                  Measures confirmation latency, register variance, and dispute investigation overhead.
                </p>
              </div>

              {/* Kill-switch Toggle: Merchant Already Copes */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <input
                  type="checkbox"
                  id="merchantCopesToggle"
                  checked={merchantInputs.merchantAlreadyCopes}
                  onChange={(e) =>
                    setMerchantInputs((prev) => ({ ...prev, merchantAlreadyCopes: e.target.checked }))
                  }
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="merchantCopesToggle" className="text-xs font-medium text-slate-800 cursor-pointer">
                  {t.merchantAlreadyCopesLabel}
                </label>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">Sales / Day</label>
                  <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                </div>
                <input
                  type="number"
                  value={merchantInputs.salesPerDay}
                  onChange={(e) =>
                    setMerchantInputs((prev) => ({
                      ...prev,
                      salesPerDay: Math.max(5, parseInt(e.target.value) || 0),
                    }))
                  }
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-500 block">Total till transactions processed</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">Minutes Lost per Dispute</label>
                  <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                </div>
                <input
                  type="number"
                  value={merchantInputs.minutesLostPerDispute}
                  onChange={(e) =>
                    setMerchantInputs((prev) => ({
                      ...prev,
                      minutesLostPerDispute: Math.max(1, parseInt(e.target.value) || 0),
                    }))
                  }
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-500 block">Time to inspect SMS or receipts</span>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3">Metric</th>
                    <th className="p-3">Without Ledger Layer</th>
                    <th className="p-3">With Acceptance Layer</th>
                    <th className="p-3">Merchant Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-medium">Record Confirmation Latency</td>
                    <td className="p-3 font-mono text-slate-600">{merchantOutputs.timeToConfirmedWithout}</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">{merchantOutputs.timeToConfirmedWith}</td>
                    <td className="p-3 text-slate-900 font-medium">Near real-time visibility</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Disputed / Unknown Sales / Week</td>
                    <td className="p-3 font-mono text-slate-600">~{merchantOutputs.disputedSalesPerWeekWithout} sales</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">~{merchantOutputs.disputedSalesPerWeekWith} sale</td>
                    <td className="p-3 text-slate-900 font-medium">Reduced customer friction</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Shift Register Cash Variance at Close</td>
                    <td className="p-3 font-mono text-slate-600">{formatETB(merchantOutputs.shiftVarianceWithoutETBCents)}</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">{formatETB(merchantOutputs.shiftVarianceWithETBCents)}</td>
                    <td className="p-3 text-slate-900 font-medium">Balanced physical cash count</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Time to Trace Missing Transaction</td>
                    <td className="p-3 font-mono text-slate-600">{merchantOutputs.timeToFindMissingSaleWithoutMin} min</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">{merchantOutputs.timeToFindMissingSaleWithMin} min</td>
                    <td className="p-3 text-slate-900 font-medium">Fast till filter by ref</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Merchant Note */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 italic">
              {MERCHANT_GAINS_NOTE}
            </div>
          </div>
        )}

        {/* LENS 3: OPERATOR LENS */}
        {activeTab === 'operator' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{t.operatorLensHeading}</h2>
                  <EvidenceChip status="Assumption" detail="Operator economics" />
                </div>
                <p className="text-xs text-slate-500">
                  Computes viable price floor vs bank value ceiling and zero-bank cash runway accrual.
                </p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">Support Cost (ETB/hr)</label>
                  <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                </div>
                <input
                  type="number"
                  value={operatorInputs.supportCostPerHourETB}
                  onChange={(e) =>
                    setOperatorInputs((prev) => ({
                      ...prev,
                      supportCostPerHourETB: Math.max(10, parseInt(e.target.value) || 0),
                    }))
                  }
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">Fixed Run Cost (ETB/mo)</label>
                  <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                </div>
                <input
                  type="number"
                  value={operatorInputs.fixedMonthlyRunCostETB}
                  onChange={(e) =>
                    setOperatorInputs((prev) => ({
                      ...prev,
                      fixedMonthlyRunCostETB: Math.max(0, parseInt(e.target.value) || 0),
                    }))
                  }
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">Tested Fee / Bank (ETB)</label>
                  <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                </div>
                <input
                  type="number"
                  placeholder="0"
                  value={operatorInputs.pricePerBankPerMonthETB || ''}
                  onChange={(e) =>
                    setOperatorInputs((prev) => ({
                      ...prev,
                      pricePerBankPerMonthETB: Math.max(0, parseInt(e.target.value) || 0),
                    }))
                  }
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">Participating Banks</label>
                  <EvidenceChip status="Assumption" className="text-[9px] px-1 py-0" />
                </div>
                <input
                  type="number"
                  value={operatorInputs.participatingBanksCount}
                  onChange={(e) =>
                    setOperatorInputs((prev) => ({
                      ...prev,
                      participatingBanksCount: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Switching Value Banner (Hard Gate Logic) */}
            <div
              className={`p-4 rounded-xl border space-y-2 text-xs ${
                operatorOutputs.noPriceWorks
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {operatorOutputs.noPriceWorks ? (
                    <ShieldAlert size={16} className="text-rose-600" />
                  ) : (
                    <ShieldCheck size={16} className="text-emerald-600" />
                  )}
                  <span className="font-bold text-xs uppercase tracking-wide">
                    {t.operatorSwitchingValue}
                  </span>
                </div>
                <EvidenceChip status="Assumption" detail="Switching value" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-slate-600 block">Viable Price Floor (Operator Break-Even)</span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {formatETB(operatorOutputs.viablePriceFloorETBCents)} / bank / mo
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-600 block">Bank Value Ceiling (Max Justifiable Fee)</span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {formatETB(operatorOutputs.bankValueCeilingETBCents)} / bank / mo
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 font-medium">
                {operatorOutputs.noPriceWorks ? (
                  <div>
                    <span className="font-bold text-rose-700 block text-sm">
                      {NO_PRICE_WORKS_SENTENCE}
                    </span>
                    <span className="text-xs text-rose-600">
                      Reason: {BANK_CEILING_BELOW_FLOOR_REASON} (Operator requires at least {formatETB(operatorOutputs.viablePriceFloorETBCents)}, but bank efficiency value is capped at {formatETB(operatorOutputs.bankValueCeilingETBCents)}).
                    </span>
                  </div>
                ) : (
                  <span className="text-emerald-800">
                    {operatorOutputs.statusSentence}
                  </span>
                )}
              </div>
            </div>

            {/* Zero-bank months table */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                {t.operatorZeroBankMonths}
              </span>
              <p className="text-xs text-slate-500 mb-3">
                Shows fixed run costs accruing while no commercial bank has signed a deployment subscription.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {operatorOutputs.zeroBankAccrualMonths.map((m) => (
                  <div key={m.months} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[11px] font-mono font-semibold text-slate-500 block">
                      {m.months} {m.months === 1 ? 'Month' : 'Months'}
                    </span>
                    <span className="font-mono font-bold text-sm text-rose-700 block mt-0.5">
                      {formatETB(m.accruedCostETBCents)}
                    </span>
                    <span className="text-[10px] text-slate-400">Accrued run cost</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LENS 4: SYSTEM & INCLUSION LENS */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{t.systemLensHeading}</h2>
                  <EvidenceChip status="Assumption" detail="Macro scope" />
                </div>
                <p className="text-xs text-slate-500">
                  Hypotheses on merchant digitisation and credit assessment beyond bilateral bank-merchant pairs.
                </p>
              </div>
            </div>

            {/* Metrics Computed From Sample Events */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                Sample Event Digitisation Footprint
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500">Low-Value Micro-Sales (≤ 200 ETB)</span>
                  <div className="text-xl font-bold font-mono text-slate-800">
                    {systemOutputs.microTransactionsSharePercent}%
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {systemOutputs.microTransactionsCount} of {systemOutputs.totalSampleEvents} sample transactions
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500">Continuous Event Records</span>
                  <div className="text-xl font-bold font-mono text-slate-800">
                    {systemOutputs.merchantsWithContinuousRecord} merchants
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Tracked across {systemOutputs.observationPeriodWeeks} weeks observation
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500">Credit Decisioning Engine</span>
                  <div className="text-base font-bold text-slate-800">
                    Deliberately Excluded
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Zero credit scoring or automated lending
                  </span>
                </div>
              </div>
            </div>

            {/* Hypotheses List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                System Hypotheses (Non-Production Exploratory)
              </span>
              <div className="space-y-3">
                {SYSTEM_INCLUSION_HYPOTHESES.map((hyp) => (
                  <div key={hyp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900">{hyp.title}</h3>
                      <div className="flex items-center gap-1">
                        <EvidenceChip status="Not tested" className="text-[10px] px-1.5 py-0" />
                        <EvidenceChip status="Needs approval" className="text-[10px] px-1.5 py-0" />
                      </div>
                    </div>
                    <p className="text-slate-700 leading-normal">{hyp.hypothesis}</p>
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                      <strong>Prerequisites:</strong> {hyp.prerequisites}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Honest Limit Text */}
            <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-center text-xs text-slate-800 font-semibold shadow-xs">
              "{INCLUSION_HONEST_LIMIT_TEXT}"
            </div>
          </div>
        )}
      </div>

      {/* 5. Part C: The Defence Panel ("How this could be wrong" / Challenge Mode) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{t.challengeModeTitle}</h2>
              <EvidenceChip status="Assumption" detail="Defence review" />
            </div>
            <p className="text-xs text-slate-500">
              Independent-review questions from the research testing every critical assumption.
            </p>
          </div>
        </div>

        {/* 6 Challenge Rows */}
        <div className="divide-y divide-slate-100">
          {CHALLENGE_MODE_ROWS.map((row) => (
            <div key={row.id} className="py-3.5 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-slate-400 shrink-0 mt-0.5">({row.id})</span>
                <span className="font-bold text-slate-900 leading-snug">{row.challenge}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pl-6 pt-1">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                    What Demo Can Show
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{row.demoCanShow}</p>
                </div>

                <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-0.5">
                    What It Cannot Show
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{row.cannotShow}</p>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-0.5">
                    Evidence That Would Answer It
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{row.evidenceToAnswer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Footer Line */}
        <div className="pt-3 border-t border-slate-200 text-center text-xs font-semibold text-slate-600 italic">
          {CHALLENGE_PANEL_FOOTER_LINE}
        </div>
      </div>
    </div>
  );
};
