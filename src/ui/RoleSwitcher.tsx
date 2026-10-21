import React from 'react';
import { useRole } from '../../context/RoleContext';
import { Role, ROLE_LABELS } from '../domain/permissions';
import { Shield } from 'lucide-react';
import { useTranslation } from '../i18n/I18nContext';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useRole();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs">
      <div className="flex items-center gap-1.5 px-2 py-0.5 text-slate-500 font-medium" title={t.roleSwitcherLabel}>
        <Shield size={13} className="text-slate-400" />
        <span className="hidden xl:inline">{t.roleSwitcherLabel}:</span>
        <span className="xl:hidden">Demo Role:</span>
      </div>
      <div className="flex items-center gap-0.5">
        {(Object.keys(ROLE_LABELS) as Role[]).map((r) => {
          const isActive = role === r;
          return (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {ROLE_LABELS[r]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
