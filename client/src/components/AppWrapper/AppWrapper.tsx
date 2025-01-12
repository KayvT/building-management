import { useEffect } from "react";
import { ReactNode } from "react";
import { useTenant } from "../../contexts/useTenant";
import { GET_ALL_TENANTS } from "../../graphql/queries/tenants";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

export default function AppWrapper({ children }: { children: ReactNode }) {
  const { data, loading } = useQuery(GET_ALL_TENANTS);
  const { tenantId } = useParams();
  const { currentTenantId, setCurrentTenantId } = useTenant();

  useEffect(() => {
    if (tenantId) {
      setCurrentTenantId(tenantId);
    } else if (currentTenantId) {
      return;
    } else if (data?.tenants?.[0]?.id) {
      setCurrentTenantId(data.tenants[0].id);
    }
  }, [tenantId, currentTenantId, setCurrentTenantId, data]);

  if (loading) return null;

  return <div>{children}</div>;
}
