import React, { useEffect } from 'react';
import { Delete, ArrowRight } from 'lucide-react';

interface KeypadProps {
  amountStr: string;
  onKey: (key: string) => void;
  onQuickAdd: (birr: number) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  amountStr,
  onKey,
  onQuickAdd,
  onSubmit,
  disabled = false,
}) => {
  // Listen for physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key >= '0' && e.key <= '9') {
        onKey(e.key);
      } else if (e.key === '.') {
        onKey('.');
      } else if (e.key === 'Backspace') {
        onKey('backspace');
      } else if (e.key === 'Escape') {
        onKey('clear');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onKey, onSubmit]);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
      {/* Display Screen */}
      <div className="bg-slate-900 text-white rounded-xl p-4 text-right shadow-inner flex flex-col justify-end min-h-[96px]">
        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
          Capture Amount (ETB)
        </div>
        <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight tabular-nums mt-1 text-emerald-400">
          {amountStr ? (
            parseFloat(amountStr).toLocaleString('en-US', {
              minimumFractionDigits: amountStr.includes('.') ? amountStr.split('.')[1].length : 0,
              maximumFractionDigits: 2,
            })
          ) : (
            <span className="text-slate-600">0.00</span>
          )}
        </div>
      </div>

      {/* Quick Add Presets */}
      <div className="grid grid-cols-4 gap-1.5">
        {[50, 100, 250, 500].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onQuickAdd(preset)}
            disabled={disabled}
            className="py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
          >
            +{preset}
          </button>
        ))}
      </div>

      {/* Numerical Keypad Grid */}
      <div className="grid grid-cols-3 gap-2">
        {keys.map((k) => {
          const isBackspace = k === 'backspace';
          return (
            <button
              key={k}
              type="button"
              disabled={disabled}
              onClick={() => onKey(k)}
              className={`h-12 sm:h-14 rounded-xl text-lg font-bold font-mono transition-colors flex items-center justify-center select-none active:scale-95 ${
                isBackspace
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-xs'
              }`}
            >
              {isBackspace ? <Delete size={20} /> : k}
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <button
        type="button"
        disabled={disabled || !amountStr || parseFloat(amountStr) <= 0}
        onClick={onSubmit}
        className="w-full py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-xs"
      >
        <span>Select Payment Rail</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
