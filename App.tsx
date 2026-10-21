import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tills } from './pages/Tills';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { Employees } from './pages/Employees';
import { Settlements } from './pages/Settlements';
import { Reports } from './pages/Reports';
import { SupervisorDashboard } from './pages/SupervisorDashboard';
import { RoleProvider } from './context/RoleContext';

const App: React.FC = () => {
  return (
    <HashRouter>
      <RoleProvider>
        <Routes>
          {/* Standalone Employee Route */}
          <Route path="/employee" element={<EmployeeDashboard />} />

          {/* Admin/Supervisor Routes wrapped in Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/supervisor" element={<SupervisorDashboard />} />
                <Route path="/tills" element={<Tills />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/settlements" element={<Settlements />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </RoleProvider>
    </HashRouter>
  );
};

export default App;