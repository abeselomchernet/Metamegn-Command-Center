import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RoleProvider } from './context/RoleContext';
import { I18nProvider } from './src/i18n/I18nContext';
import { RouteGuard } from './src/app/RouteGuard';

// Pages
import { Reconciliation } from './pages/Reconciliation';
import { Ledger } from './pages/Ledger';
import { POS } from './pages/POS';
import { Shifts } from './pages/Shifts';
import { Reports } from './pages/Reports';
import { Staff } from './pages/Staff';
import { About } from './pages/About';
import { Tills } from './pages/Tills';

const App: React.FC = () => {
  return (
    <HashRouter>
      <I18nProvider>
        <RoleProvider>
          <Layout>
            <Routes>
              {/* Primary Landing View: Reconciliation Summary & Exceptions */}
              <Route path="/" element={<Reconciliation />} />
              <Route path="/reconcile" element={<Reconciliation />} />

              {/* Event Ledger */}
              <Route path="/ledger" element={<Ledger />} />

              {/* Cashier Fast Capture POS Terminal */}
              <Route path="/pos" element={<POS />} />

              {/* Shifts & Register Cash Variance */}
              <Route
                path="/shifts"
                element={
                  <RouteGuard permission="shifts:count" title="Shifts & Registers">
                    <Shifts />
                  </RouteGuard>
                }
              />

              {/* Reports & Analytics (Match Rate, Rail Mix) */}
              <Route
                path="/reports"
                element={
                  <RouteGuard permission="reports:view" title="Reports">
                    <Reports />
                  </RouteGuard>
                }
              />

              {/* Staff Management & Immutable Audit Log */}
              <Route
                path="/staff"
                element={
                  <RouteGuard permission="staff:view" title="Staff & Audit">
                    <Staff />
                  </RouteGuard>
                }
              />

              {/* Registered Tills */}
              <Route
                path="/tills"
                element={
                  <RouteGuard permission="capture:view_all" title="Manage Tills">
                    <Tills />
                  </RouteGuard>
                }
              />

              {/* About & 4 Proof Gates */}
              <Route path="/about" element={<About />} />

              {/* Legacy route redirects */}
              <Route path="/settlements" element={<Navigate to="/reconcile" replace />} />
              <Route path="/employees" element={<Navigate to="/staff" replace />} />
              <Route path="/supervisor" element={<Navigate to="/reconcile" replace />} />
              <Route path="/employee" element={<Navigate to="/pos" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </RoleProvider>
      </I18nProvider>
    </HashRouter>
  );
};

export default App;