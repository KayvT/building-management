import { createContext } from "react";

interface TenantContextType {
  currentTenantId: string | null;
  setCurrentTenantId: (id: string | null) => void;
}

export const TenantContext = createContext<TenantContextType | undefined>(undefined);
