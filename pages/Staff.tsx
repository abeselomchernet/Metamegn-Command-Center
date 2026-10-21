import React, { useState, useEffect } from 'react';
import { defaultAdapter } from '../src/data/MockAdapter';
import { AuditEntry } from '../src/domain/types';
import { Role, ROLE_PERMISSIONS, ROLE_LABELS } from '../src/domain/permissions';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useRole } from '../context/RoleContext';
import { ShieldCheck, History, Users, Check, X, Lock } from 'lucide-react';
import { EmptyState, LoadingState } from '../src/ui/StateViews';

export const Staff: React.FC = () => {
  const { role, actor, hasPerm } = useRole();
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'audit' | 'matrix'>('audit');

  const loadAudit = async () => {
    setLoading(true);
    try {
      const list = await defaultAdapter.listAuditLog();
      setAuditLog(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, []);

  const permissionList = [
    { key: 'capture:create', label: 'Capture transaction at till' },
    { key: 'capture:view_own', label: 'View own till sales & float' },
    { key: 'capture:view_all', label: 'View sales across all terminals' },
    { key: 'capture:void', label: 'Void captured transaction with reason' },
    { key: 'reconciliation:view', label: 'View reconciliation & statement matches' },
    { key: 'reconciliation:resolve', label: 'Triage & resolve discrepancy exceptions' },
    { key: 'reconciliation:export', label: 'Export discrepancy CSV for finance audit' },
    { key: 'shifts:count', label: 'Perform physical register count & variance check' },
    { key: 'shifts:approve', label: 'Approve shift closure & lock ledger entries' },
    { key: 'reports:view', label: 'View match rate analytics & rail mix reports' },
    { key: 'staff:manage', label: 'Manage till assignments & permissions' },
    { key: 'audit:view', label: 'Inspect immutable system audit log' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Staff Governance & Audit Log</h1>
            <EvidenceChip status="Sample data" detail="RBAC & Audit" />
          </div>
          <p className="text-xs text-slate-500">
            Immutable log of sensitive actions (voids, resolution overrides, shift handovers) and role permission matrix.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History size={14} />
            <span>Audit Trail ({auditLog.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Permission Matrix</span>
          </button>
        </div>
      </div>

      {/* 2. Audit Trail View */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing append-only audit entries. No records can be deleted or updated.
            </p>
            <EvidenceChip status="Assumption" detail="Tamper-evident log" />
          </div>

          {loading ? (
            <LoadingState message="Loading immutable audit log..." />
          ) : auditLog.length === 0 ? (
            <EmptyState
              title="Audit log is empty"
              description="Actions performed in the system will automatically appear here."
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wider uppercase text-[11px]">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target ID</th>
                      <th className="py-3 px-4">Details & Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {auditLog.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-900">
                          {entry.actorName}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              entry.actorRole === Role.MANAGER
                                ? 'bg-purple-100 text-purple-800'
                                : entry.actorRole === Role.SUPERVISOR
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {entry.actorRole}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono font-semibold text-slate-800">
                          {entry.action}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                          {entry.targetId}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-md">
                          {entry.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Role Permission Matrix View */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Role Capability Matrix</h2>
              <p className="text-xs text-slate-500">
                Enforced by frontend route guards and backend adapter seams.
              </p>
            </div>
            <EvidenceChip status="Needs approval" detail="Bank security policy" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <th className="py-3 px-4">System Capability</th>
                  <th className="py-3 px-4 text-center">Cashier</th>
                  <th className="py-3 px-4 text-center">Supervisor</th>
                  <th className="py-3 px-4 text-center">Operations Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionList.map((perm) => (
                  <tr key={perm.key} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{perm.label}</div>
                      <div className="font-mono text-[10px] text-slate-400">{perm.key}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {(ROLE_PERMISSIONS[Role.CASHIER] as readonly string[]).includes(perm.key) ? (
                        <Check size={16} className="text-emerald-600 mx-auto" />
                      ) : (
                        <X size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {(ROLE_PERMISSIONS[Role.SUPERVISOR] as readonly string[]).includes(perm.key) ? (
                        <Check size={16} className="text-emerald-600 mx-auto" />
                      ) : (
                        <X size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {(ROLE_PERMISSIONS[Role.MANAGER] as readonly string[]).includes(perm.key) ? (
                        <Check size={16} className="text-emerald-600 mx-auto" />
                      ) : (
                        <X size={16} className="text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
