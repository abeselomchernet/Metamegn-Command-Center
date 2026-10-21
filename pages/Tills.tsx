import React, { useState } from 'react';
import { MOCK_TILLS } from '../constants';
import { Till } from '../types';
import { QrCode, MoreVertical, Smartphone, Printer, Circle, Plus, X, Check } from 'lucide-react';

export const Tills: React.FC = () => {
  const [tills, setTills] = useState<Till[]>(MOCK_TILLS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTill, setNewTill] = useState({ name: '', location: '', type: 'counter' });

  const handleAddTill = (e: React.FormEvent) => {
      e.preventDefault();
      const till: Till = {
          id: `TILL-00${tills.length + 1}`,
          name: newTill.name,
          location: newTill.location,
          status: 'active',
          daily_total: 0,
          employee_name: 'Unassigned'
      };
      setTills([...tills, till]);
      setIsModalOpen(false);
      setNewTill({ name: '', location: '', type: 'counter' });
  };

  const handleGenerateQR = (tillName: string) => {
      // Simulate generation
      alert(`Generating ETHQR (Standard) for ${tillName}...\n\nSent to printer.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-ethiopic">Manage Tills</h1>
          <p className="text-slate-500 font-ethiopic">የሽያጭ መዝገቦች አስተዳደር</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-green hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
        >
            <Plus size={20} className="mr-2" />
            <span>Add New Till</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tills.map((till) => (
          <div key={till.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative group hover:border-brand-green transition-colors">
             <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                <MoreVertical size={20} />
             </button>

             <div className="flex items-center space-x-3 mb-4">
                <div className="bg-slate-100 p-3 rounded-full">
                    {till.name.toLowerCase().includes('window') || till.name.toLowerCase().includes('remote') 
                        ? <Smartphone size={24} className="text-slate-600" /> 
                        : <Printer size={24} className="text-slate-600" />
                    }
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-900">{till.name}</h3>
                    <div className="flex items-center text-xs text-slate-500">
                        <Circle size={8} className={`mr-1 fill-current ${till.status === 'active' ? 'text-green-500' : 'text-slate-300'}`} />
                        <span className="capitalize">{till.status}</span>
                    </div>
                </div>
             </div>

             <div className="space-y-2 py-4 border-t border-b border-slate-50">
                 <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Till ID:</span>
                     <span className="font-mono text-slate-700 bg-slate-50 px-2 rounded">{till.id}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Location:</span>
                     <span className="text-slate-700">{till.location}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Staff:</span>
                     <span className={`text-sm ${till.employee_name === 'Unassigned' ? 'text-slate-400 italic' : 'text-slate-700 font-medium'}`}>
                         {till.employee_name}
                     </span>
                 </div>
             </div>

             <div className="pt-4 flex flex-col space-y-2">
                 <div className="flex justify-between items-end mb-2">
                     <span className="text-xs text-slate-500 uppercase">Today's Total</span>
                     <span className="text-xl font-bold text-slate-900">ETB {till.daily_total.toLocaleString()}</span>
                 </div>
                 <button 
                    onClick={() => handleGenerateQR(till.name)}
                    className="w-full border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-colors active:bg-slate-100"
                >
                     <QrCode size={16} className="mr-2" />
                     Generate QR / Print
                 </button>
             </div>
          </div>
        ))}
      </div>

      {/* Add Till Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-xl font-bold text-slate-900 mb-1">Add New Till</h2>
                <p className="text-sm text-slate-500 mb-6">Create a new checkout point.</p>
                
                <form onSubmit={handleAddTill} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Till Name</label>
                        <input 
                            type="text" 
                            required
                            value={newTill.name}
                            onChange={(e) => setNewTill({...newTill, name: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors"
                            placeholder="e.g. Counter 3 (በረንዳ)"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location / Branch</label>
                        <input 
                            type="text" 
                            required
                            value={newTill.location}
                            onChange={(e) => setNewTill({...newTill, location: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors"
                            placeholder="e.g. Bole Main Hall"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full bg-brand-green hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/10 transition-colors flex items-center justify-center"
                        >
                            <Plus size={20} className="mr-2" />
                            Create Till
                        </button>
                    </div>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};