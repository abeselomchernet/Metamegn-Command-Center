import React, { useState } from 'react';
import {
  FileText,
  GitCompare,
  Store,
  Layers,
  BarChart3,
  Users2,
  Info,
  Menu,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { Role, ROLE_LABELS } from '../src/domain/permissions';
import { DemoBanner, DisclaimerFooter } from '../src/ui/UniversalNotice';
import { RoleSwitcher } from '../src/ui/RoleSwitcher';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useTranslation } from '../src/i18n/I18nContext';
import { Locale } from '../src/i18n/types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { role, hasPerm } = useRole();
  const { locale, setLocale, t } = useTranslation();

  const navItems = [
    {
      to: '/reconcile',
      label: t.navReconciliation,
      icon: GitCompare,
      show: hasPerm('reconciliation:view'),
      badge: 'Core',
    },
    {
      to: '/ledger',
      label: t.navLedger,
      icon: FileText,
      show: true,
    },
    {
      to: '/pos',
      label: t.navPOS,
      icon: Store,
      show: true,
      highlight: true,
    },
    {
      to: '/shifts',
      label: t.navShifts,
      icon: Layers,
      show: hasPerm('shifts:count'),
    },
    {
      to: '/reports',
      label: t.navReports,
      icon: BarChart3,
      show: hasPerm('reports:view'),
    },
    {
      to: '/staff',
      label: t.navStaff,
      icon: Users2,
      show: hasPerm('staff:view'),
    },
    {
      to: '/about',
      label: t.navAbout,
      icon: Info,
      show: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1. Permanent Top Demo Banner on EVERY route */}
      <DemoBanner />

      {/* 2. Top Navigation Bar adhering to Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Zone 1: Brand Wordmark (Single Text Element) */}
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/reconcile" className="flex items-center gap-2 group">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors whitespace-nowrap">
                  Metamegn <span className="font-normal text-slate-400 font-ethiopic text-sm">(መተማመኛ)</span>
                </span>
              </Link>
              <EvidenceChip status="Sample data" detail="UI illustration" className="hidden sm:inline-flex" />
            </div>

            {/* Zone 2: Navigation Links (single-line, clean unboxed text) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium text-slate-600">
              {navItems
                .filter((item) => item.show)
                .map((item) => {
                  const isActive = location.pathname === item.to || (item.to === '/reconcile' && location.pathname === '/');
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon size={14} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
            </nav>

            {/* Zone 3: Controls (Role Switcher + Locale Selector + Mobile Menu Trigger) */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Language Selector */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs">
                {(['en', 'am', 'om'] as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocale(loc)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      locale === loc
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {loc === 'en' ? 'EN' : loc === 'am' ? 'አማ' : 'ORO'}
                  </button>
                ))}
              </div>

              {/* Demo Role Switcher */}
              <div className="hidden sm:block">
                <RoleSwitcher />
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
            <div className="py-2 border-b border-slate-100 sm:hidden">
              <RoleSwitcher />
            </div>
            <div className="grid grid-cols-2 gap-1 pt-2">
              {navItems
                .filter((item) => item.show)
                .map((item) => {
                  const isActive = location.pathname === item.to || (item.to === '/reconcile' && location.pathname === '/');
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </header>

      {/* 3. Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* 4. Permanent Footer on EVERY route */}
      <DisclaimerFooter />
    </div>
  );
};