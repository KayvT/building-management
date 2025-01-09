import React, { createContext, useState, ReactNode, useEffect } from "react";

interface TenantContextType {
  currentTenantId: string | null;
  setCurrentTenantId: (id: string | null) => void;
}

export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(() => {
    return localStorage.getItem('currentTenantId');
  });

  useEffect(() => {
    if (currentTenantId) {
      localStorage.setItem('currentTenantId', currentTenantId);
    } else {
      localStorage.removeItem('currentTenantId');
    }
  }, [currentTenantId]);

  return (
    <TenantContext.Provider value={{ currentTenantId, setCurrentTenantId }}>
      {children}
    </TenantContext.Provider>
  );
}
