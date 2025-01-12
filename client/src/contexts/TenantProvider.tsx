import { ReactNode, useState, useEffect } from "react";
import { TenantContext } from "./TenantContext";

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(() => {
    return localStorage.getItem("currentTenantId");
  });

  useEffect(() => {
    if (currentTenantId) {
      localStorage.setItem("currentTenantId", currentTenantId);
    } else {
      localStorage.removeItem("currentTenantId");
    }
  }, [currentTenantId]);

  return (
    <TenantContext.Provider value={{ currentTenantId, setCurrentTenantId }}>
      {children}
    </TenantContext.Provider>
  );
}
