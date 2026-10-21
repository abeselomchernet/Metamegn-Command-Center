import React from 'react';
import { useTranslation } from '../i18n/I18nContext';
import { AlertTriangle, Info } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-900 text-amber-300 text-xs font-semibold py-1.5 px-4 text-center tracking-wide uppercase border-b border-slate-800 flex items-center justify-center gap-2 select-none">
      <AlertTriangle size={13} className="text-amber-400 shrink-0" aria-hidden="true" />
      <span>{t.demoBanner}</span>
    </div>
  );
};

export const DisclaimerFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-3 px-4 text-center text-xs text-slate-500 shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
        <Info size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
        <p className="font-medium">
          {t.footerDisclaimer}
        </p>
      </div>
    </footer>
  );
};
