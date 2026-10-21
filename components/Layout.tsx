import React, { useState } from 'react';
import { LayoutDashboard, Store, PieChart, Users, Settings, LogOut, Menu, X, ShieldCheck, Smartphone, Landmark } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { EmployeeRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { role, setRole } = useRole();

  // Define menu items with required permissions
  const allMenuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      subLabel: 'ዳሽቦርድ', 
      path: role === EmployeeRole.SUPERVISOR ? '/supervisor' : '/',
      allowed: [EmployeeRole.MANAGER, EmployeeRole.SUPERVISOR]
    },
    { 
      icon: Store, 
      label: 'Tills', 
      subLabel: 'መዝገቦች', 
      path: '/tills',
      allowed: [EmployeeRole.MANAGER, EmployeeRole.SUPERVISOR]
    },
    { 
      icon: Landmark, 
      label: 'Settlements', 
      subLabel: 'የባንክ ገቢ', 
      path: '/settlements',
      allowed: [EmployeeRole.MANAGER]
    },
    { 
      icon: PieChart, 
      label: 'Reports', 
      subLabel: 'ሪፖርቶች', 
      path: '/reports',
      allowed: [EmployeeRole.MANAGER]
    },
    { 
      icon: Users, 
      label: 'Employees', 
      subLabel: 'ሰራተኞች', 
      path: '/employees',
      allowed: [EmployeeRole.MANAGER]
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      subLabel: 'ማስተካከያ', 
      path: '/settings',
      allowed: [EmployeeRole.MANAGER]
    },
  ];

  const menuItems = allMenuItems.filter(item => item.allowed.includes(role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${role === EmployeeRole.MANAGER ? 'bg-brand-green' : 'bg-blue-600'}`}>
                <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold font-ethiopic">Metamegn</h1>
                <p className="text-xs text-slate-400">{role === EmployeeRole.MANAGER ? 'Admin' : 'Supervisor'}</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${
                      isActive 
                        ? 'bg-slate-800 text-white border-l-4 border-brand-green' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} className={`mr-3 ${isActive ? 'text-brand-green' : 'text-slate-400 group-hover:text-white'}`} />
                    <div>
                      <span className="block font-medium">{item.label}</span>
                      <span className="text-xs opacity-70 font-ethiopic">{item.subLabel}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Role Switcher for Demo */}
        <div className="p-4 bg-slate-800 m-2 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Simulate Role</p>
            <div className="flex gap-2">
                <button 
                    onClick={() => setRole(EmployeeRole.MANAGER)}
                    className={`flex-1 py-1 text-xs font-bold rounded ${role === EmployeeRole.MANAGER ? 'bg-brand-green text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                    Manager
                </button>
                <button 
                    onClick={() => setRole(EmployeeRole.SUPERVISOR)}
                    className={`flex-1 py-1 text-xs font-bold rounded ${role === EmployeeRole.SUPERVISOR ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                    Supervisor
                </button>
            </div>
        </div>

        <div className="p-4 border-t border-slate-700 space-y-2">
           <Link to="/employee" className="flex items-center w-full px-4 py-3 bg-slate-800 text-brand-green hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700">
            <Smartphone size={20} className="mr-3" />
            <div>
                <span className="block font-medium text-sm">Switch to Employee</span>
                <span className="text-xs opacity-70">POS View</span>
            </div>
          </Link>
          <button className="flex items-center w-full px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-slate-800">Kaldis Coffee</span>
                <span className="text-xs text-slate-500">Bole Branch</span>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold ${role === EmployeeRole.MANAGER ? 'bg-brand-green' : 'bg-blue-600'}`}>
                {role === EmployeeRole.MANAGER ? 'M' : 'S'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};