import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Permission, hasPermission } from '../src/domain/permissions';

interface ActorProfile {
  name: string;
  role: Role;
  id: string;
}

const DEFAULT_ACTORS: Record<Role, ActorProfile> = {
  [Role.CASHIER]: {
    id: 'emp-01',
    name: 'Alem T. (Cashier)',
    role: Role.CASHIER,
  },
  [Role.SUPERVISOR]: {
    id: 'sup-01',
    name: 'Dawit M. (Supervisor)',
    role: Role.SUPERVISOR,
  },
  [Role.MANAGER]: {
    id: 'mgr-01',
    name: 'Sara B. (Operations Manager)',
    role: Role.MANAGER,
  },
};

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  actor: ActorProfile;
  hasPerm: (permission: Permission) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    try {
      const saved = localStorage.getItem('metamegn_role_v2');
      if (saved === Role.CASHIER || saved === Role.SUPERVISOR || saved === Role.MANAGER) {
        return saved;
      }
    } catch {
      // ignore
    }
    return Role.SUPERVISOR; // Default to Supervisor so reconciliation & audit are visible on load
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('metamegn_role_v2', newRole);
    } catch {
      // ignore
    }
  };

  const actor = DEFAULT_ACTORS[role];
  const hasPerm = (permission: Permission) => hasPermission(role, permission);

  return (
    <RoleContext.Provider value={{ role, setRole, actor, hasPerm }}>
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