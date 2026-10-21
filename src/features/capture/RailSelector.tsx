import React from 'react';
import { PaymentRailId, PAYMENT_RAILS } from '../../domain/types';
import { Smartphone, Building2, QrCode, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import { EvidenceChip } from '../../ui/EvidenceChip';

interface RailSelectorProps {
  amountBirr: number;
  onSelectRail: (rail: PaymentRailId) => void;
  onBack: () => void;
  disabled?: boolean;
}

const railIcons: Record<PaymentRailId, React.ReactNode> = {
  wallet_a: <Smartphone size={22} className="text-blue-500" />,
  bank_b: <Building2 size={22} className="text-emerald-500" />,
  interop_qr: <QrCode size={22} className="text-purple-500" />,
  card_tap: <CreditCard size={22} className="text-amber-500" />,
  cash: <Banknote size={22} className="text-slate-500" />,
};

export const RailSelector: React.FC<RailSelectorProps> = ({
  amountBirr,
  onSelectRail,
  onBack,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 p-1 rounded"
        >
          <ArrowLeft size={14} />
          <span>Change Amount</span>
        </button>
        <span className="font-mono font-bold text-slate-900 text-sm">
          ETB {amountBirr.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="space-y-2">
        {Object.values(PAYMENT_RAILS).map((rail) => (
          <button
            key={rail.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectRail(rail.id)}
            className="w-full p-3 bg-white border border-slate-200 hover:border-slate-400 rounded-xl transition-all text-left flex items-start gap-3 shadow-xs group active:scale-[0.99]"
          >
            <div className="p-2 bg-slate-50 rounded-lg shrink-0 mt-0.5 group-hover:bg-slate-100 transition-colors">
              {railIcons[rail.id]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-slate-900 text-sm">{rail.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">{rail.reportDelay}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{rail.description}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">{rail.sampleFeeModel}</span>
                <EvidenceChip status="Sample data" detail="Fee spec" className="text-[9px] py-0 px-1" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
