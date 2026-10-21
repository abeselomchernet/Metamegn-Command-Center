import React from 'react';
import { useRole } from '../../context/RoleContext';
import { Permission, ROLE_LABELS } from '../domain/permissions';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RouteGuardProps {
  permission: Permission;
  title: string;
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ permission, title, children }) => {
  const { role, hasPerm } = useRole();

  if (!hasPerm(permission)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-xl text-center shadow-sm">
        <div className="w-12 h-12 mx-auto mb-4 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
          <ShieldAlert size={26} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Restricted Section: {title}</h2>
        <p className="text-sm text-slate-600 mb-4">
          The current active role (<span className="font-semibold text-slate-800">{ROLE_LABELS[role]}</span>) does not have the required permission (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{permission}</code>).
        </p>
        <p className="text-xs text-slate-500 mb-6">
          Use the <strong>Demo role switcher</strong> in the top header to switch to <strong>Supervisor</strong> or <strong>Manager</strong> to inspect this view.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/pos"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Go to Cashier POS
          </Link>
          <Link
            to="/reconcile"
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
          >
            Go to Reconciliation
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
