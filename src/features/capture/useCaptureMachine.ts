import { useState, useCallback } from 'react';
import { PaymentRailId, LedgerEvent } from '../../domain/types';
import { defaultAdapter } from '../../data/MockAdapter';
import { offlineQueue } from '../../data/offlineQueue';

export type CaptureState = 'amount' | 'method' | 'pending' | 'recorded' | 'failed';

export interface UseCaptureMachineProps {
  tillId: string;
  tillName: string;
  cashierId: string;
  cashierName: string;
  onEventCreated?: (event: LedgerEvent) => void;
}

export const useCaptureMachine = ({
  tillId,
  tillName,
  cashierId,
  cashierName,
  onEventCreated,
}: UseCaptureMachineProps) => {
  const [state, setState] = useState<CaptureState>('amount');
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedRail, setSelectedRail] = useState<PaymentRailId | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(() => offlineQueue.getQueueCount());
  const [lastEvent, setLastEvent] = useState<LedgerEvent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleKeypadInput = useCallback((key: string) => {
    if (key === 'clear') {
      setAmountStr('');
      return;
    }
    if (key === 'backspace') {
      setAmountStr((prev) => prev.slice(0, -1));
      return;
    }
    if (key === '.' && amountStr.includes('.')) {
      return;
    }
    if (amountStr.length >= 8) return;
    setAmountStr((prev) => prev + key);
  }, [amountStr]);

  const handleQuickAdd = useCallback((addBirr: number) => {
    const current = parseFloat(amountStr || '0');
    setAmountStr((current + addBirr).toString());
  }, [amountStr]);

  const proceedToMethod = useCallback(() => {
    const num = parseFloat(amountStr);
    if (!num || num <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0.');
      return;
    }
    setErrorMessage(null);
    setState('method');
  }, [amountStr]);

  const selectRailAndExecute = useCallback(async (railId: PaymentRailId) => {
    setSelectedRail(railId);
    setState('pending');
    setErrorMessage(null);

    const amountCents = Math.round(parseFloat(amountStr) * 100);

    try {
      if (isOfflineMode) {
        // Enqueue to offline manager
        offlineQueue.enqueue({
          amountCents,
          railId,
          tillId,
          tillName,
          cashierId,
          cashierName,
          isOffline: true,
        });
        setOfflineQueueCount(offlineQueue.getQueueCount());

        const mockLocalEv: LedgerEvent = {
          id: `local-off-${Date.now()}`,
          txRef: `OFF-${Date.now().toString().slice(-6)}`,
          amountCents,
          railId,
          tillId,
          tillName,
          cashierId,
          cashierName,
          createdAt: new Date().toISOString(),
          status: 'awaiting_provider',
          offlineQueued: true,
        };
        setLastEvent(mockLocalEv);
        setState('recorded');
        if (onEventCreated) onEventCreated(mockLocalEv);
        return;
      }

      // Online capture via MockAdapter
      const ev = await defaultAdapter.captureEvent({
        amountCents,
        railId,
        tillId,
        tillName,
        cashierId,
        cashierName,
      });

      setLastEvent(ev);
      setState('recorded');
      if (onEventCreated) onEventCreated(ev);
    } catch (err: any) {
      setErrorMessage(err.message || 'Capture failed');
      setState('failed');
    }
  }, [amountStr, isOfflineMode, tillId, tillName, cashierId, cashierName, onEventCreated]);

  const resetFlow = useCallback(() => {
    setAmountStr('');
    setSelectedRail(null);
    setLastEvent(null);
    setErrorMessage(null);
    setState('amount');
  }, []);

  const replayOffline = useCallback(async () => {
    const result = await defaultAdapter.replayOfflineQueue();
    setOfflineQueueCount(offlineQueue.getQueueCount());
    return result;
  }, []);

  return {
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
  };
};
