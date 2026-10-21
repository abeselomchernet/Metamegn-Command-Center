import React, { useState, useEffect } from 'react';
import { defaultAdapter } from '../src/data/MockAdapter';
import { ShiftRecord } from '../src/domain/types';
import { formatETB, calculateVariance } from '../src/domain/money';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useRole } from '../context/RoleContext';
import { useTranslation } from '../src/i18n/I18nContext';
import { SEEDED_TILLS } from '../src/data/seededData';
import { Layers, CheckCircle2, AlertTriangle, Clock, Banknote, PlusCircle, X, History } from 'lucide-react';
import { EmptyState, LoadingState } from '../src/ui/StateViews';

export const Shifts: React.FC = () => {
  const { role, actor, hasPerm } = useRole();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);

  // Open shift modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openTillId, setOpenTillId] = useState(SEEDED_TILLS[0].id);
  const [openingFloatStr, setOpeningFloatStr] = useState('2000.00');

  // Close shift modal
  const [closingShift, setClosingShift] = useState<ShiftRecord | null>(null);
  const [countedCashStr, setCountedCashStr] = useState('');
  const [closeNotes, setCloseNotes] = useState('');

  const loadShifts = async () => {
    setLoading(true);
    try {
      const list = await defaultAdapter.listShifts();
      setShifts(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  const handleOpenShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const floatCents = Math.round(parseFloat(openingFloatStr || '0') * 100);
    if (floatCents < 0) return;

    await defaultAdapter.openShift(openTillId, actor.name, floatCents);
    setIsOpenModal(false);
    await loadShifts();
  };

  const handleCloseShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingShift) return;

    const countedCents = Math.round(parseFloat(countedCashStr || '0') * 100);
    await defaultAdapter.closeShift(closingShift.id, countedCents, actor.name, closeNotes);

    setClosingShift(null);
    setCountedCashStr('');
    setCloseNotes('');
    await loadShifts();
  };

  const countedVal = parseFloat(countedCashStr || '0') * 100;
  const expectedVal = closingShift?.expectedCashCents || closingShift?.openingCashCents || 0;
  const liveVariance = closingShift ? calculateVariance(countedVal, expectedVal) : null;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.shiftTitle}</h1>
            <EvidenceChip status="Sample data" detail="Register accounting" />
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">{t.shiftSubtitle}</p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <PlusCircle size={14} className="text-emerald-400" />
          <span>{t.openShiftBtn}</span>
        </button>
      </div>

      {/* 2. Shifts Table */}
      {loading ? (
        <LoadingState message="Loading register shifts..." />
      ) : shifts.length === 0 ? (
        <EmptyState
          title="No shifts recorded"
          description="Open a new register shift to begin cash handover tracking."
          actionLabel="Open Register Shift"
          onAction={() => setIsOpenModal(true)}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wider uppercase text-[11px]">
                  <th className="py-3 px-4">Till Name</th>
                  <th className="py-3 px-4">Shift Opened</th>
                  <th className="py-3 px-4">Cashier / Staff</th>
                  <th className="py-3 px-4 text-right">{t.openingFloat}</th>
                  <th className="py-3 px-4 text-right">{t.expectedCash}</th>
                  <th className="py-3 px-4 text-right">{t.countedCash}</th>
                  <th className="py-3 px-4 text-right">{t.cashVariance}</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {shifts.map((s) => {
                  const isClosed = s.status === 'closed';
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-900">
                        {s.tillName}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono">
                        {new Date(s.openedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                        {new Date(s.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                        <div>{s.openedBy}</div>
                        {s.closedBy && s.closedBy !== s.openedBy && (
                          <div className="text-[10px] text-slate-400">Closed by {s.closedBy}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono tabular-nums text-slate-700">
                        {formatETB(s.openingCashCents)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono tabular-nums font-semibold text-slate-900">
                        {formatETB(s.expectedCashCents || s.openingCashCents)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono tabular-nums text-slate-900">
                        {s.countedCashCents !== undefined ? formatETB(s.countedCashCents) : '—'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono tabular-nums">
                        {s.varianceCents !== undefined ? (
                          <span
                            className={`font-bold ${
                              s.varianceCents === 0
                                ? 'text-emerald-700'
                                : s.varianceCents > 0
                                ? 'text-blue-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {s.varianceCents > 0 ? '+' : ''}
                            {formatETB(s.varianceCents)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isClosed
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isClosed ? 'Closed & Balanced' : 'Active Shift'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        {!isClosed ? (
                          <button
                            onClick={() => {
                              setClosingShift(s);
                              setCountedCashStr('');
                              setCloseNotes('');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-xs"
                          >
                            {t.closeShiftBtn}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Audit locked</span>
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

      {/* 3. Open Shift Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t.openShiftBtn}</h3>
                <p className="text-xs text-slate-500">Record cash drawer opening float</p>
              </div>
              <button onClick={() => setIsOpenModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleOpenShiftSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Till</label>
                <select
                  value={openTillId}
                  onChange={(e) => setOpenTillId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800"
                >
                  {SEEDED_TILLS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Starting Float Cash (ETB)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={openingFloatStr}
                  onChange={(e) => setOpeningFloatStr(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800 font-mono font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Open Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Count & Close Shift Modal */}
      {closingShift && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Shift Count & Variance Reconciliation</h3>
                <p className="text-xs text-slate-500">{closingShift.tillName}</p>
              </div>
              <button onClick={() => setClosingShift(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCloseShiftSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Opening Float:</span>
                  <span className="font-semibold text-slate-800">{formatETB(closingShift.openingCashCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Expected Ledger Cash:</span>
                  <span className="font-bold text-slate-900">
                    {formatETB(closingShift.expectedCashCents || closingShift.openingCashCents)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physical Cash Counted in Drawer (ETB)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  placeholder="e.g. 2320.00"
                  value={countedCashStr}
                  onChange={(e) => setCountedCashStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-900 font-mono font-bold"
                />
              </div>

              {countedCashStr && liveVariance && (
                <div
                  className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
                    liveVariance.isBalanced
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : liveVariance.isOver
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  <span className="font-sans font-semibold">
                    {liveVariance.isBalanced
                      ? 'Balanced Cleanly'
                      : liveVariance.isOver
                      ? 'Drawer Cash Over'
                      : 'Drawer Cash Short'}
                  </span>
                  <span className="font-bold">
                    {liveVariance.isOver ? '+' : ''}
                    {formatETB(liveVariance.varianceCents)}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shift Notes / Handover Observations
                </label>
                <textarea
                  rows={2}
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  placeholder="e.g. Handover to evening cashier, 20 ETB short due to coin rounding..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setClosingShift(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Confirm Count & Close Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
