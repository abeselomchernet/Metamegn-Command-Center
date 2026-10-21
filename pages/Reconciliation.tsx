import React, { useState, useEffect } from 'react';
import { defaultAdapter } from '../src/data/MockAdapter';
import {
  ExceptionRecord,
  StatementRow,
  LedgerEvent,
  ReconciliationSummary,
  ExceptionClass,
  ExceptionResolutionStatus,
  PAYMENT_RAILS,
} from '../src/domain/types';
import { formatETB } from '../src/domain/money';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useRole } from '../context/RoleContext';
import { useTranslation } from '../src/i18n/I18nContext';
import {
  GitCompare,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Copy,
  Download,
  Play,
  FileCheck2,
  Filter,
  UserCheck,
  MessageSquare,
  X,
  PlusCircle,
} from 'lucide-react';
import { EmptyState, LoadingState } from '../src/ui/StateViews';

export const Reconciliation: React.FC = () => {
  const { role, actor, hasPerm } = useRole();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution modal state
  const [resolvingException, setResolvingException] = useState<ExceptionRecord | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<ExceptionResolutionStatus>('resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignee, setAssignee] = useState('');

  // Inbound statement simulation modal
  const [isSimulating, setIsSimulating] = useState(false);
  const [simTxRef, setSimTxRef] = useState('TXR-2026-8946');
  const [simAmount, setSimAmount] = useState('1200.00');
  const [simRail, setSimRail] = useState<'wallet_a' | 'bank_b' | 'interop_qr' | 'card_tap'>('wallet_a');

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await defaultAdapter.reconcileBatch();
      setSummary(result.summary);
      setExceptions(result.exceptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunReconciliation = async () => {
    await loadData();
  };

  const handleSimulateInboundStatement = async (e: React.FormEvent) => {
    e.preventDefault();
    const cents = Math.round(parseFloat(simAmount || '0') * 100);
    if (cents <= 0) return;

    await defaultAdapter.simulateIncomingStatement(simTxRef, cents, simRail);
    setIsSimulating(false);
    await loadData();
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingException) return;

    await defaultAdapter.resolveException(resolvingException.id, {
      status: resolutionStatus,
      notes: resolutionNotes || 'Resolved during supervisory audit review.',
      resolvedBy: actor.name,
    });

    setResolvingException(null);
    setResolutionNotes('');
    await loadData();
  };

  const handleExportCSV = () => {
    const headers = [
      'Exception ID',
      'Class',
      'Reference',
      'Rail',
      'Till',
      'Till Amount (ETB)',
      'Statement Amount (ETB)',
      'Difference (ETB)',
      'Detected At',
      'Status',
      'Notes',
    ];

    const rows = filteredExceptions.map((ex) => [
      ex.id,
      ex.exceptionClass,
      ex.txRef || ex.externalRef || 'N/A',
      PAYMENT_RAILS[ex.railId]?.label || ex.railId,
      ex.tillName || 'Unassigned',
      ex.amountEventCents ? (ex.amountEventCents / 100).toFixed(2) : '0.00',
      ex.amountStatementCents ? (ex.amountStatementCents / 100).toFixed(2) : '0.00',
      ex.diffCents ? (ex.diffCents / 100).toFixed(2) : '0.00',
      ex.detectedAt,
      ex.status,
      `"${(ex.resolutionNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reconciliation_exceptions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getExceptionBadge = (cls: ExceptionClass) => {
    switch (cls) {
      case 'matched':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle size={12} className="text-emerald-600" />
            <span>{t.classMatched}</span>
          </span>
        );
      case 'missing_at_provider':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={12} className="text-amber-600" />
            <span>{t.classMissingAtProvider}</span>
          </span>
        );
      case 'missing_at_till':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
            <AlertTriangle size={12} className="text-orange-600" />
            <span>{t.classMissingAtTill}</span>
          </span>
        );
      case 'amount_mismatch':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <ArrowRightLeft size={12} className="text-rose-600" />
            <span>{t.classAmountMismatch}</span>
          </span>
        );
      case 'duplicate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Copy size={12} className="text-purple-600" />
            <span>{t.classDuplicate}</span>
          </span>
        );
    }
  };

  const filteredExceptions = exceptions.filter((ex) => {
    if (activeTab !== 'all' && ex.exceptionClass !== activeTab) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const ref = (ex.txRef || ex.externalRef || '').toLowerCase();
      const till = (ex.tillName || '').toLowerCase();
      return ref.includes(q) || till.includes(q);
    }
    return true;
  });

  const tabCounts = {
    all: exceptions.length,
    missing_at_provider: exceptions.filter((e) => e.exceptionClass === 'missing_at_provider').length,
    missing_at_till: exceptions.filter((e) => e.exceptionClass === 'missing_at_till').length,
    amount_mismatch: exceptions.filter((e) => e.exceptionClass === 'amount_mismatch').length,
    duplicate: exceptions.filter((e) => e.exceptionClass === 'duplicate').length,
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Evidence Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.reconcileTitle}</h1>
            <EvidenceChip status="Sample data" detail="Matching rules" />
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">{t.reconcileSubtitle}</p>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSimulating(true)}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle size={14} className="text-slate-500" />
            <span>{t.simulateStatement}</span>
          </button>
          <button
            onClick={handleRunReconciliation}
            className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Play size={13} className="text-emerald-400" />
            <span>{t.runMatchingEngine}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} className="text-slate-500" />
            <span>{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* 2. Executive 360 Reconciliation Metrics (Zero Custody, Tabular Figures) */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t.matchRate}</span>
              <EvidenceChip status="Sample data" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {summary.matchRatePercent}%
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              {summary.matchedCount} of {summary.totalLedgerEvents} events verified
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t.openExceptions}</span>
              <EvidenceChip status="Sample data" />
            </div>
            <div className="text-2xl font-bold text-rose-600 font-mono tabular-nums">
              {summary.openExceptionsCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Require supervisor review
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t.oldestOpen}</span>
              <EvidenceChip status="Assumption" detail="Report delay" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {summary.oldestOpenMinutes} <span className="text-sm font-normal text-slate-500">min</span>
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              Within expected batch SLA
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t.totalVolume}</span>
              <EvidenceChip status="Sample data" />
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums truncate">
              {formatETB(summary.totalVolumeCents)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Gross captured turnover
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t.matchedVolume}</span>
              <EvidenceChip status="Sample data" />
            </div>
            <div className="text-lg font-bold text-emerald-700 font-mono tabular-nums truncate">
              {formatETB(summary.matchedVolumeCents)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Confirmed on statements
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Tabs (Interactive Segmented Buttons) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Exceptions', count: tabCounts.all },
            { id: 'missing_at_provider', label: t.classMissingAtProvider, count: tabCounts.missing_at_provider },
            { id: 'missing_at_till', label: t.classMissingAtTill, count: tabCounts.missing_at_till },
            { id: 'amount_mismatch', label: t.classAmountMismatch, count: tabCounts.amount_mismatch },
            { id: 'duplicate', label: t.classDuplicate, count: tabCounts.duplicate },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Live Filter Input */}
        <div className="relative shrink-0 sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800 placeholder:text-slate-400 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 4. High-Density Reconciliation & Exception Table */}
      {loading ? (
        <LoadingState message="Running 5-class reconciliation algorithm..." />
      ) : filteredExceptions.length === 0 ? (
        <EmptyState
          title="No open exceptions found in this filter"
          description="All merchant transactions match provider statement records within the configured tolerance window."
          actionLabel="Refresh Records"
          onAction={loadData}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wider uppercase text-[11px]">
                  <th className="py-3 px-4">Discrepancy Class</th>
                  <th className="py-3 px-4">Reference ID</th>
                  <th className="py-3 px-4">Rail & Delay</th>
                  <th className="py-3 px-4">Till Location</th>
                  <th className="py-3 px-4 text-right">Till Recorded</th>
                  <th className="py-3 px-4 text-right">Provider Stmt</th>
                  <th className="py-3 px-4 text-right">Variance Diff</th>
                  <th className="py-3 px-4">Resolution Status</th>
                  <th className="py-3 px-4 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredExceptions.map((ex) => {
                  const rail = PAYMENT_RAILS[ex.railId];
                  const canResolve = hasPerm('reconciliation:resolve');

                  return (
                    <tr key={ex.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getExceptionBadge(ex.exceptionClass)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-medium text-slate-900">
                        <div>{ex.txRef || ex.externalRef || ex.id}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {new Date(ex.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{rail?.label || ex.railId}</div>
                        <div className="text-[10px] text-slate-400">{rail?.reportDelay}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                        {ex.tillName || 'Unassigned / Direct Inbound'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono tabular-nums text-slate-900">
                        {ex.amountEventCents !== undefined ? formatETB(ex.amountEventCents) : '—'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono tabular-nums text-slate-900">
                        {ex.amountStatementCents !== undefined ? formatETB(ex.amountStatementCents) : '—'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono tabular-nums">
                        {ex.diffCents !== undefined ? (
                          <span
                            className={`font-semibold ${
                              ex.diffCents > 0 ? 'text-rose-600' : 'text-amber-600'
                            }`}
                          >
                            {ex.diffCents > 0 ? '+' : ''}
                            {formatETB(ex.diffCents)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            ex.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ex.status === 'investigating'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ex.status}
                        </span>
                        {ex.resolvedBy && (
                          <div className="text-[10px] text-slate-400">By {ex.resolvedBy}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        {canResolve ? (
                          <button
                            onClick={() => {
                              setResolvingException(ex);
                              setResolutionNotes(ex.resolutionNotes || '');
                              setResolutionStatus(ex.status === 'resolved' ? 'resolved' : 'investigating');
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          >
                            Triage
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">View only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Triage & Resolution Modal */}
      {resolvingException && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Supervisory Exception Triage: {resolvingException.txRef || resolvingException.externalRef}
                </h3>
                <p className="text-xs text-slate-500">
                  Record resolution rationale. All actions are appended to the immutable audit log.
                </p>
              </div>
              <button
                onClick={() => setResolvingException(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Discrepancy Type:</span>
                  <span className="font-semibold text-slate-800">{resolvingException.exceptionClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Rail:</span>
                  <span className="font-medium text-slate-800">{PAYMENT_RAILS[resolvingException.railId]?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Till:</span>
                  <span className="font-medium text-slate-800">{resolvingException.tillName || 'Direct statement'}</span>
                </div>
                {resolvingException.diffCents !== undefined && (
                  <div className="flex justify-between font-mono font-semibold text-rose-700">
                    <span>Variance Amount:</span>
                    <span>{formatETB(resolvingException.diffCents)}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Resolution Status
                </label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as ExceptionResolutionStatus)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800"
                >
                  <option value="resolved">Resolved (Approved by supervisor)</option>
                  <option value="investigating">Investigating (Escalated to branch manager)</option>
                  <option value="voided">Voided (Invalid entry / reversal)</option>
                  <option value="open">Re-open for review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mandatory Audit Notes & Rationale
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Explain resolution reason, verified slip number, or provider contact reference..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800 placeholder:text-slate-400 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResolvingException(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Confirm & Commit to Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Inbound Statement Row Simulator Modal */}
      {isSimulating && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Simulate Provider Statement Row</h3>
                <p className="text-xs text-slate-500">
                  Ingests an external provider/bank statement row to test matching.
                </p>
              </div>
              <button onClick={() => setIsSimulating(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSimulateInboundStatement} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  External Transaction Reference
                </label>
                <input
                  type="text"
                  required
                  value={simTxRef}
                  onChange={(e) => setSimTxRef(e.target.value)}
                  placeholder="e.g. TXR-2026-8946"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reported Amount (ETB)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={simAmount}
                  onChange={(e) => setSimAmount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Rail
                </label>
                <select
                  value={simRail}
                  onChange={(e) => setSimRail(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800"
                >
                  <option value="wallet_a">Wallet Rail A</option>
                  <option value="bank_b">Bank Rail B</option>
                  <option value="interop_qr">Interoperable QR</option>
                  <option value="card_tap">Card Tap (SoftPOS)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSimulating(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Ingest Statement Row
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
