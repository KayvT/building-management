import React, { useEffect } from "react";
import { ReactNode } from "react";
import { useTenant } from "../contexts/useTenant";
import { GET_ALL_TENANTS } from "../graphql/queries/tenants";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

export default function AppWrapper({ children }: { children: ReactNode }) {
  const { data, loading } = useQuery(GET_ALL_TENANTS);
  const { tenantId } = useParams();
  const { currentTenantId, setCurrentTenantId } = useTenant();

  useEffect(() => {
    // If we have a URL tenant ID, use that
    if (tenantId) {
      setCurrentTenantId(tenantId);
    } 
    // If we don't have a URL tenant ID but have one in context/localStorage, keep using that
    else if (currentTenantId) {
      // No need to setCurrentTenantId since we already have it
      return;
    } 
    // If we have neither, use the first tenant from the query
    else if (data?.tenants?.[0]?.id) {
      setCurrentTenantId(data.tenants[0].id);
    }
  }, [tenantId, currentTenantId, setCurrentTenantId, data]);

  if (loading) return null;

  return <div>{children}</div>;
}
