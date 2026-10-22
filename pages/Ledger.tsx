import React, { useState, useEffect } from 'react';
import { defaultAdapter } from '../src/data/MockAdapter';
import {
  LedgerEvent,
  LedgerStatus,
  PaymentRailId,
  PAYMENT_RAILS,
  BankId,
  NEUTRAL_BANKS,
  TRANSACTION_STATES,
} from '../src/domain/types';
import { formatETB } from '../src/domain/money';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useRole } from '../context/RoleContext';
import { useTranslation } from '../src/i18n/I18nContext';
import { SEEDED_TILLS } from '../src/data/seededData';
import {
  FileText,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Ban,
  Trash2,
  Download,
  RefreshCw,
  PlusCircle,
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  Building2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { EmptyState, LoadingState } from '../src/ui/StateViews';

const getRailIcon = (railId: PaymentRailId) => {
  switch (railId) {
    case 'wallet_a':
      return <Smartphone size={14} className="text-blue-500" />;
    case 'bank_b':
      return <Building2 size={14} className="text-emerald-500" />;
    case 'interop_qr':
      return <QrCode size={14} className="text-purple-500" />;
    case 'card_tap':
      return <CreditCard size={14} className="text-amber-500" />;
    case 'cash':
      return <Banknote size={14} className="text-slate-500" />;
  }
};

export const Ledger: React.FC = () => {
  const { role, actor, hasPerm } = useRole();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [selectedTill, setSelectedTill] = useState<string>('all');
  const [selectedRail, setSelectedRail] = useState<string>('all');
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Void modal state
  const [voidingEvent, setVoidingEvent] = useState<LedgerEvent | null>(null);
  const [voidReason, setVoidReason] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const filter = {
        tillId: selectedTill !== 'all' ? selectedTill : undefined,
        railId: selectedRail !== 'all' ? (selectedRail as PaymentRailId) : undefined,
        bankId: selectedBank !== 'all' ? (selectedBank as BankId) : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        searchQuery: searchQuery || undefined,
      };
      const list = await defaultAdapter.listEvents(filter);
      setEvents(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedTill, selectedRail, selectedBank, selectedStatus, searchQuery]);

  const handleSimulateNewEvents = async () => {
    await defaultAdapter.simulateIncomingEvents(2);
    await loadEvents();
  };

  const handleConfirmVoid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voidingEvent || !voidReason.trim()) return;

    await defaultAdapter.voidEvent(voidingEvent.id, voidReason, {
      role,
      name: actor.name,
    });

    setVoidingEvent(null);
    setVoidReason('');
    await loadEvents();
  };

  const handleExportCSV = () => {
    const headers = [
      'Event ID',
      'Transaction Ref',
      'Timestamp (ISO)',
      'Rail',
      'Amount (ETB)',
      'Till ID',
      'Till Name',
      'Cashier',
      'Status',
      'Provider Statement Ref',
      'Void Reason',
    ];

    const rows = events.map((ev) => [
      ev.id,
      ev.txRef,
      ev.createdAt,
      PAYMENT_RAILS[ev.railId]?.label || ev.railId,
      (ev.amountCents / 100).toFixed(2),
      ev.tillId,
      `"${ev.tillName}"`,
      `"${ev.cashierName}"`,
      ev.status,
      ev.providerRef || 'N/A',
      `"${(ev.voidReason || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `event_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: LedgerStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle size={12} className="text-emerald-600" />
            <span>CONFIRMED</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={12} className="text-amber-600" />
            <span>PENDING</span>
          </span>
        );
      case 'NEEDS_RECONCILIATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle size={12} className="text-rose-600" />
            <span>NEEDS_RECON</span>
          </span>
        );
      case 'REVERSED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <RotateCcw size={12} className="text-purple-600" />
            <span>REVERSED</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 line-through">
            <Ban size={12} className="text-slate-400" />
            <span>FAILED</span>
          </span>
        );
      case 'INITIATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock size={12} className="text-blue-600" />
            <span>INITIATED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
            <span>{status}</span>
          </span>
        );
    }
  };

  const canVoid = hasPerm('capture:void');

  // Multi-bank separation test verification
  const bank2VisibleCount = selectedBank === 'bank-1' ? events.filter((e) => e.bankId === 'bank-2').length : 0;
  const bank3VisibleCount = selectedBank === 'bank-1' ? events.filter((e) => e.bankId === 'bank-3').length : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Evidence Chip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.navLedger}</h1>
            <EvidenceChip status="Sample data" detail="Deterministic events" />
          </div>
          <p className="text-xs text-slate-500">
            Append-only merchant transaction records. Captures show "recorded, awaiting provider report" (PENDING) until verified against external statements.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSimulateNewEvents}
            className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlusCircle size={14} className="text-emerald-400" />
            <span>Simulate Incoming Events</span>
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

      {/* 2. Transaction Six-State Lifecycle Diagram */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Transaction State Machine (Six Formal States)
            </span>
            <EvidenceChip status="Assumption" detail="Formal state model" />
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Traceable references</span>
        </div>

        {/* Small State Flow Diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs pt-1">
          <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg flex flex-col justify-center items-center">
            <span className="font-mono font-bold text-blue-900 text-[11px]">1. INITIATED</span>
            <span className="text-[10px] text-blue-700 mt-0.5">Amount keyed at till</span>
          </div>

          <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg flex flex-col justify-center items-center">
            <span className="font-mono font-bold text-amber-900 text-[11px]">2. PENDING</span>
            <span className="text-[10px] text-amber-700 mt-0.5">Logged, awaiting batch</span>
          </div>

          <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg flex flex-col justify-center items-center">
            <span className="font-mono font-bold text-emerald-900 text-[11px]">3. CONFIRMED</span>
            <span className="text-[10px] text-emerald-700 mt-0.5">Statement verified</span>
          </div>

          <div className="p-2 bg-rose-50/70 border border-rose-200 rounded-lg flex flex-col justify-center items-center">
            <span className="font-mono font-bold text-rose-900 text-[11px]">4. NEEDS_RECON</span>
            <span className="text-[10px] text-rose-700 mt-0.5">Mismatch or missing</span>
          </div>

          <div className="p-2 bg-purple-50/70 border border-purple-200 rounded-lg flex flex-col justify-center items-center">
            <span className="font-mono font-bold text-purple-900 text-[11px]">5. REVERSED</span>
            <span className="text-[10px] text-purple-700 mt-0.5">Late provider clawback</span>
          </div>

          <div className="p-2 bg-slate-100 border border-slate-300 rounded-lg flex flex-col justify-center items-center">
            <span className="font-mono font-bold text-slate-700 text-[11px]">6. FAILED</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Rejected or voided</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic pt-1">
          Rule: A local "success" animation or a network timeout must never display as CONFIRMED. An event transitions to CONFIRMED only upon external statement verification.
        </p>
      </div>

      {/* 3. Bank Scope Verification Card (when filtered to Bank 1) */}
      {selectedBank === 'bank-1' && (
        <div className="bg-slate-900 text-white rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">
                {t.bankScopeSeparationTest}
              </span>
              <span className="text-slate-300 text-[11px]">
                Active view: Bank 1. Bank 2 events visible: {bank2VisibleCount} (Zero/Pass). Bank 3 events visible: {bank3VisibleCount} (Zero/Pass).
              </span>
            </div>
          </div>
          <EvidenceChip status="Assumption" detail="Illustrates separation requirement; not a security proof" className="bg-slate-800 text-slate-200 border-slate-700" />
        </div>
      )}

      {/* 4. Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800 font-sans"
          />
        </div>

        {/* Bank Scope Selector */}
        <select
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800 font-semibold"
        >
          <option value="all">{t.bankScopeAll}</option>
          <option value="bank-1">{t.bankScopeBank1}</option>
          <option value="bank-2">{t.bankScopeBank2}</option>
          <option value="bank-3">{t.bankScopeBank3}</option>
        </select>

        {/* Till Selector */}
        <select
          value={selectedTill}
          onChange={(e) => setSelectedTill(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800"
        >
          <option value="all">{t.allTills}</option>
          {SEEDED_TILLS.map((till) => (
            <option key={till.id} value={till.id}>
              {till.name}
            </option>
          ))}
        </select>

        {/* Rail Selector */}
        <select
          value={selectedRail}
          onChange={(e) => setSelectedRail(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800"
        >
          <option value="all">{t.allRails}</option>
          {Object.values(PAYMENT_RAILS).map((rail) => (
            <option key={rail.id} value={rail.id}>
              {rail.label}
            </option>
          ))}
        </select>

        {/* Status Selector */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800"
        >
          <option value="all">All Six States</option>
          {TRANSACTION_STATES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Event Ledger Table */}
      {loading ? (
        <LoadingState message="Loading merchant event ledger..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events match current criteria"
          description="Try adjusting your filter options or simulate incoming transactions."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedTill('all');
            setSelectedRail('all');
            setSelectedStatus('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wider uppercase text-[11px]">
                  <th className="py-3 px-4">{t.time}</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">{t.rail}</th>
                  <th className="py-3 px-4">Bank Scope</th>
                  <th className="py-3 px-4">{t.till} & Cashier</th>
                  <th className="py-3 px-4 text-right">{t.amount}</th>
                  <th className="py-3 px-4">{t.status}</th>
                  <th className="py-3 px-4">Source Statement Ref</th>
                  {canVoid && <th className="py-3 px-4 text-right">{t.action}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {events.map((ev) => {
                  const rail = PAYMENT_RAILS[ev.railId];
                  return (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono">
                        {new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{ev.txRef}</span>
                          {ev.offlineQueued && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-sans">
                              Synced
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          {getRailIcon(ev.railId)}
                          <span className="font-medium">{rail?.label || ev.railId}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {NEUTRAL_BANKS[ev.bankId]?.name || ev.bankId}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                        <div className="font-medium text-slate-900">{ev.tillName}</div>
                        <div className="text-[10px] text-slate-400">{ev.cashierName}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatETB(ev.amountCents)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(ev.status)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                        {ev.providerRef ? (
                          <span className="text-emerald-700 font-medium">{ev.providerRef}</span>
                        ) : ev.status === 'voided' ? (
                          <span className="text-slate-400 italic">Voided ({ev.voidReason})</span>
                        ) : (
                          <span className="text-slate-400 italic">Awaiting external batch</span>
                        )}
                      </td>
                      {canVoid && (
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          {ev.status !== 'voided' && (
                            <button
                              onClick={() => {
                                setVoidingEvent(ev);
                                setVoidReason('');
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                              title="Void with reason (Supervisor action)"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Supervisor Void Modal */}
      {voidingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Void Transaction: {voidingEvent.txRef}</h3>
                <p className="text-xs text-slate-500">
                  Supervisor action. Transaction is marked voided and audited.
                </p>
              </div>
              <button onClick={() => setVoidingEvent(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmVoid} className="p-5 space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-mono font-bold text-slate-900">{formatETB(voidingEvent.amountCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Till:</span>
                  <span className="font-medium text-slate-800">{voidingEvent.tillName}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Void (Mandatory)
                </label>
                <textarea
                  required
                  rows={3}
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="e.g. Duplicate customer tap, cashier misentry, customer cancelled before goods..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVoidingEvent(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors"
                >
                  Confirm Void & Commit Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
