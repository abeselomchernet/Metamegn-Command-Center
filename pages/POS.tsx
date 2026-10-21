import React, { useState, useEffect } from 'react';
import { useCaptureMachine } from '../src/features/capture/useCaptureMachine';
import { Keypad } from '../src/features/capture/Keypad';
import { RailSelector } from '../src/features/capture/RailSelector';
import { CaptureReceipt } from '../src/features/capture/CaptureReceipt';
import { OfflineQueueBanner } from '../src/features/capture/OfflineQueueBanner';
import { defaultAdapter } from '../src/data/MockAdapter';
import { LedgerEvent, PAYMENT_RAILS } from '../src/domain/types';
import { formatETB } from '../src/domain/money';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useRole } from '../context/RoleContext';
import { useTranslation } from '../src/i18n/I18nContext';
import { SEEDED_TILLS } from '../src/data/seededData';
import { Store, Clock, CheckCircle, RefreshCw, Smartphone, Building2, QrCode, CreditCard, Banknote } from 'lucide-react';

export const POS: React.FC = () => {
  const { actor } = useRole();
  const { t } = useTranslation();

  const [till, setTill] = useState(SEEDED_TILLS[0]);
  const [recentEvents, setRecentEvents] = useState<LedgerEvent[]>([]);

  const loadRecentEvents = async () => {
    const list = await defaultAdapter.listEvents({ tillId: till.id });
    setRecentEvents(list.slice(0, 8));
  };

  const {
    state,
    amountStr,
    selectedRail,
    isOfflineMode,
    setIsOfflineMode,
    offlineQueueCount,
    lastEvent,
    errorMessage,
    handleKeypadInput,
    handleQuickAdd,
    proceedToMethod,
    selectRailAndExecute,
    resetFlow,
    replayOffline,
  } = useCaptureMachine({
    tillId: till.id,
    tillName: till.name,
    cashierId: actor.id,
    cashierName: actor.name,
    onEventCreated: () => loadRecentEvents(),
  });

  useEffect(() => {
    loadRecentEvents();
  }, [till.id]);

  const handleReplay = async () => {
    const res = await replayOffline();
    await loadRecentEvents();
    return res;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header with Till Switcher & Evidence Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.posTitle}</h1>
            <EvidenceChip status="Sample data" detail="Fast capture" />
          </div>
          <p className="text-xs text-slate-500">
            Acceptance recording terminal. Transactions record immediately into the local ledger and await external statement matching.
          </p>
        </div>

        {/* Till selection */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-slate-500 font-medium">Active Till:</label>
          <select
            value={till.id}
            onChange={(e) => {
              const selected = SEEDED_TILLS.find((t) => t.id === e.target.value);
              if (selected) setTill(selected);
            }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-hidden focus:border-slate-900"
          >
            {SEEDED_TILLS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Split POS Grid (Cashier Terminal + Recent Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Keypad & Flow (360px Mobile-First Container) */}
        <div className="lg:col-span-6 w-full space-y-4">
          {/* Offline simulator status */}
          <OfflineQueueBanner
            isOffline={isOfflineMode}
            onToggleOffline={setIsOfflineMode}
            queueCount={offlineQueueCount}
            onReplayQueue={handleReplay}
          />

          {errorMessage && (
            <div className="max-w-sm mx-auto p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* State Machine Views */}
          {state === 'amount' && (
            <Keypad
              amountStr={amountStr}
              onKey={handleKeypadInput}
              onQuickAdd={handleQuickAdd}
              onSubmit={proceedToMethod}
            />
          )}

          {state === 'method' && (
            <RailSelector
              amountBirr={parseFloat(amountStr || '0')}
              onSelectRail={selectRailAndExecute}
              onBack={resetFlow}
            />
          )}

          {state === 'pending' && (
            <div className="w-full max-w-sm mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs space-y-4">
              <RefreshCw size={36} className="animate-spin text-slate-700 mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recording Acceptance Event...</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting to local immutable event store. Generating merchant reference.
                </p>
              </div>
            </div>
          )}

          {state === 'recorded' && lastEvent && (
            <CaptureReceipt event={lastEvent} onNewCapture={resetFlow} />
          )}

          {state === 'failed' && (
            <div className="w-full max-w-sm mx-auto bg-white border border-rose-200 rounded-2xl p-6 text-center space-y-4">
              <p className="text-xs text-rose-700 font-semibold">{errorMessage || 'Capture failed'}</p>
              <button
                onClick={resetFlow}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Recent Till Captures Feed */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Captures at {till.name}</h2>
              <p className="text-xs text-slate-500">Live local log of events recorded at this till</p>
            </div>
            <EvidenceChip status="Sample data" detail="Till stream" />
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {recentEvents.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No events recorded at this till yet. Use keypad to capture first transaction.
              </div>
            ) : (
              recentEvents.map((ev) => {
                const rail = PAYMENT_RAILS[ev.railId];
                return (
                  <div
                    key={ev.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 shrink-0">
                        {ev.railId === 'wallet_a' && <Smartphone size={16} className="text-blue-500" />}
                        {ev.railId === 'bank_b' && <Building2 size={16} className="text-emerald-500" />}
                        {ev.railId === 'interop_qr' && <QrCode size={16} className="text-purple-500" />}
                        {ev.railId === 'card_tap' && <CreditCard size={16} className="text-amber-500" />}
                        {ev.railId === 'cash' && <Banknote size={16} className="text-slate-500" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 font-mono">
                          {formatETB(ev.amountCents)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {rail?.label} · <span className="font-mono">{ev.txRef}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded mt-1 ${
                          ev.status === 'matched'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ev.status === 'awaiting_provider'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ev.status === 'matched'
                          ? 'Matched'
                          : ev.status === 'awaiting_provider'
                          ? 'Awaiting Report'
                          : 'Captured'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
