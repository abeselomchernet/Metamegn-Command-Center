import React, { useState } from 'react';
import { MOCK_EMPLOYEES } from '../constants';
import { Employee, EmployeeRole } from '../types';
import { Phone, Shield, User, Lock, CheckCircle2, X, Plus, Trash2 } from 'lucide-react';

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<{name: string, phone: string, role: EmployeeRole}>({
    name: '',
    phone: '',
    role: EmployeeRole.CASHIER
  });

  const handleRoleChange = (id: string, newRole: EmployeeRole) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, role: newRole } : emp
    ));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to remove this employee?')) {
          setEmployees(prev => prev.filter(e => e.id !== id));
      }
  }

  const handleAddSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const id = `EMP-${Math.floor(Math.random() * 9000) + 1000}`;
      const employee: Employee = {
          id,
          name: newEmployee.name,
          phone: newEmployee.phone,
          role: newEmployee.role,
          status: 'active',
          last_active: 'Just now'
      };
      setEmployees([...employees, employee]);
      setIsAddModalOpen(false);
      setNewEmployee({ name: '', phone: '', role: EmployeeRole.CASHIER });
  };

  const getRoleBadgeStyle = (role: EmployeeRole) => {
    switch (role) {
      case EmployeeRole.MANAGER: return 'bg-purple-100 text-purple-700 border-purple-200';
      case EmployeeRole.SUPERVISOR: return 'bg-blue-100 text-blue-700 border-blue-200';
      case EmployeeRole.CASHIER: return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-ethiopic">Employees</h1>
          <p className="text-slate-500 font-ethiopic">Manage staff access and roles / የሰራተኛ አስተዳደር</p>
        </div>
        <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-green hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
        >
            <Plus size={20} className="mr-2" />
            <span>Add Employee</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-700">Staff Directory</h3>
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0 uppercase">
                            {emp.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                        <div className="text-xs text-slate-500 flex items-center mt-0.5">
                            <Phone size={10} className="mr-1" />
                            {emp.phone}
                        </div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === emp.id ? (
                            <select 
                                value={emp.role}
                                autoFocus
                                onBlur={() => setEditingId(null)}
                                onChange={(e) => handleRoleChange(emp.id, e.target.value as EmployeeRole)}
                                className="block w-full pl-2 pr-8 py-1 text-sm border-gray-300 focus:outline-none focus:ring-brand-green focus:border-brand-green rounded-md shadow-sm"
                            >
                                {Object.values(EmployeeRole).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        ) : (
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeStyle(emp.role)}`}>
                                {emp.role}
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <span className={`h-2.5 w-2.5 rounded-full mr-2 ${emp.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            <span className="text-sm text-slate-700 capitalize">{emp.status}</span>
                        </div>
                        <div className="text-xs text-slate-400 pl-4.5 mt-0.5">Active {emp.last_active}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-3">
                            {editingId === emp.id ? (
                                <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                                    Done
                                </button>
                            ) : (
                                <button onClick={() => setEditingId(emp.id)} className="text-brand-green hover:text-green-700 font-semibold">
                                    Edit Role
                                </button>
                            )}
                            <button onClick={() => handleDelete(emp.id)} className="text-slate-400 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            </div>
        </div>

        {/* Role Definitions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-fit">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-brand-green" />
                Role Permissions
            </h3>
            
            <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-slate-200">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-100 border-2 border-slate-300"></div>
                    <h4 className="font-semibold text-slate-800 text-sm">Cashier (POS Only)</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-2">Restricted access to the Employee Dashboard.</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                        <li className="flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500 mt-0.5" /> Process Payments</li>
                        <li className="flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500 mt-0.5" /> View Daily Personal Total</li>
                        <li className="flex items-start opacity-50"><Lock className="w-3 h-3 mr-1 text-slate-400 mt-0.5" /> No Access to Reports</li>
                    </ul>
                </div>

                <div className="relative pl-6 border-l-2 border-blue-200">
                     <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-50 border-2 border-blue-300"></div>
                    <h4 className="font-semibold text-slate-800 text-sm">Supervisor</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-2">Can manage basic branch operations.</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                        <li className="flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500 mt-0.5" /> Manage Tills</li>
                        <li className="flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500 mt-0.5" /> Void Transactions</li>
                        <li className="flex items-start opacity-50"><Lock className="w-3 h-3 mr-1 text-slate-400 mt-0.5" /> Cannot Edit Financial Settings</li>
                        <li className="flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500 mt-0.5" /> And other branch operations</li>
                    </ul>
                </div>

                <div className="relative pl-6 border-l-2 border-purple-200">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-purple-50 border-2 border-purple-300"></div>
                    <h4 className="font-semibold text-slate-800 text-sm">Manager (Admin)</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-2">Full system access.</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                        <li className="flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500 mt-0.5" /> Full Financial Analytics</li>
                        <li className="flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500 mt-0.5" /> Manage Employees & Roles</li>
                        <li className="flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500 mt-0.5" /> Bank Settlements</li>
                        <li className="flex items-start"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500 mt-0.5" /> And other admin controls</li>
                    </ul>
                </div>
            </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-xl font-bold text-slate-900 mb-1">Add New Employee</h2>
                <p className="text-sm text-slate-500 mb-6">Create credentials for a new staff member.</p>
                
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors"
                            placeholder="e.g. Abebe Bikila"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            required
                            value={newEmployee.phone}
                            onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors"
                            placeholder="e.g. 0911234567"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.values(EmployeeRole).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setNewEmployee({...newEmployee, role})}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                                        newEmployee.role === role 
                                            ? 'bg-brand-green text-white border-brand-green shadow-sm' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full bg-brand-green hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/10 transition-colors flex items-center justify-center"
                        >
                            <Plus size={20} className="mr-2" />
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};