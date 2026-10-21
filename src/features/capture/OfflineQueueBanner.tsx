import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { EvidenceChip } from '../../ui/EvidenceChip';

interface OfflineQueueBannerProps {
  isOffline: boolean;
  onToggleOffline: (val: boolean) => void;
  queueCount: number;
  onReplayQueue: () => Promise<{ replayedCount: number; duplicateCount: number }>;
}

export const OfflineQueueBanner: React.FC<OfflineQueueBannerProps> = ({
  isOffline,
  onToggleOffline,
  queueCount,
  onReplayQueue,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await onReplayQueue();
      setSyncResult(
        `Synced ${res.replayedCount} transaction(s)${
          res.duplicateCount > 0 ? ` (${res.duplicateCount} duplicate(s) flagged)` : ''
        }`
      );
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOffline ? (
            <WifiOff size={16} className="text-amber-500" />
          ) : (
            <Wifi size={16} className="text-emerald-500" />
          )}
          <span className="text-xs font-bold text-slate-800">
            {isOffline ? 'Offline Simulation Active' : 'Online Connection Active'}
          </span>
        </div>
        <EvidenceChip status="Assumption" detail="Network drop simulation" className="text-[10px] py-0 px-1" />
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isOffline}
            onChange={(e) => onToggleOffline(e.target.checked)}
            className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
          />
          <span>Simulate Offline Mode</span>
        </label>

        {queueCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {queueCount} queued
            </span>
            <button
              type="button"
              disabled={isOffline || syncing}
              onClick={handleSync}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Syncing...' : 'Replay'}</span>
            </button>
          </div>
        )}
      </div>

      {syncResult && (
        <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
          <CheckCircle2 size={13} className="shrink-0" />
          <span>{syncResult}</span>
        </div>
      )}
    </div>
  );
};
