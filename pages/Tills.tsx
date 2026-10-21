import React, { useState } from 'react';
import { SEEDED_TILLS } from '../src/data/seededData';
import { Till } from '../src/domain/types';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useTranslation } from '../src/i18n/I18nContext';
import { Store, QrCode, Plus, X, User, MapPin, Printer, CheckCircle } from 'lucide-react';

export const Tills: React.FC = () => {
  const { t } = useTranslation();
  const [tills, setTills] = useState<Till[]>(SEEDED_TILLS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTillName, setNewTillName] = useState('');
  const [newTillLocation, setNewTillLocation] = useState('');

  // Sample QR modal
  const [qrTill, setQrTill] = useState<Till | null>(null);

  const handleAddTill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTillName.trim()) return;

    const created: Till = {
      id: `till-0${tills.length + 1}`,
      name: newTillName.trim(),
      location: newTillLocation.trim() || 'Merchant Floor',
      assignedCashierId: `emp-0${tills.length + 1}`,
      assignedCashierName: 'Unassigned Cashier (Sample)',
      active: true,
    };

    setTills([...tills, created]);
    setIsModalOpen(false);
    setNewTillName('');
    setNewTillLocation('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Registered Merchant Terminals & Tills</h1>
            <EvidenceChip status="Sample data" detail="Terminal config" />
          </div>
          <p className="text-xs text-slate-500">
            Physical and remote checkout points configured for acceptance event capture.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus size={14} className="text-emerald-400" />
          <span>Register New Till</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tills.map((till) => (
          <div
            key={till.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{till.id}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{till.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active Terminal
              </span>
            </div>

            <div className="space-y-2 text-xs border-t border-b border-slate-100 py-3">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={13} className="text-slate-400 shrink-0" />
                <span>{till.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <User size={13} className="text-slate-400 shrink-0" />
                <span>{till.assignedCashierName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setQrTill(till)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <QrCode size={14} />
                <span>Interoperable QR Spec</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Register New Till Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Register New Terminal</h3>
                <p className="text-xs text-slate-500">Assign a till point identifier</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTill} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Till Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Till 04 - Drive-thru Window"
                  value={newTillName}
                  onChange={(e) => setNewTillName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Zone</label>
                <input
                  type="text"
                  placeholder="e.g. Building B West Concourse"
                  value={newTillLocation}
                  onChange={(e) => setNewTillLocation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-900 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Create Terminal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Spec Modal */}
      {qrTill && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden p-6 text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">{qrTill.name}</span>
              <button onClick={() => setQrTill(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block">
              {/* Simulated QR Pattern */}
              <div className="w-40 h-40 bg-slate-900 rounded-lg p-2 flex flex-col justify-between items-center text-white text-[10px] font-mono">
                <div className="flex justify-between w-full">
                  <div className="w-8 h-8 bg-white rounded-xs p-1">
                    <div className="w-full h-full bg-slate-900" />
                  </div>
                  <div className="w-8 h-8 bg-white rounded-xs p-1">
                    <div className="w-full h-full bg-slate-900" />
                  </div>
                </div>
                <div className="text-center font-bold tracking-widest text-[11px] text-emerald-400">
                  SAMPLE QR
                </div>
                <div className="flex justify-between w-full items-end">
                  <div className="w-8 h-8 bg-white rounded-xs p-1">
                    <div className="w-full h-full bg-slate-900" />
                  </div>
                  <span className="text-[9px] text-slate-400">{qrTill.id}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-tight space-y-1">
              <p className="font-semibold text-slate-800">Interoperable QR (Sample Specification)</p>
              <p className="text-[11px]">Payload conforms to merchant static QR schema with embedded till identifier.</p>
              <EvidenceChip status="Sample data" detail="QR payload" />
            </div>

            <button
              onClick={() => setQrTill(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};