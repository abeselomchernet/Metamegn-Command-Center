import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmployeeRole } from '../types';

interface RoleContextType {
  role: EmployeeRole;
  setRole: (role: EmployeeRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<EmployeeRole>(() => {
    const saved = localStorage.getItem('mock_role');
    return (saved as EmployeeRole) || EmployeeRole.MANAGER;
  });

  useEffect(() => {
    localStorage.setItem('mock_role', role);
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};