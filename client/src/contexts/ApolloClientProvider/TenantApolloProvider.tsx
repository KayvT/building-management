import React, { useMemo } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useTenant } from "../../contexts/TenantIdContext/useTenant";

export function TenantApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: maybe I can also export the client itself from here as well?
  const { currentTenantId } = useTenant();
  const client = useMemo(() => {
    return new ApolloClient({
      uri: "https://building-management-8ed5.onrender.com",
      // uri: "http://localhost:4000",
      cache: new InMemoryCache(),
      headers: {
        "X-Tenant-ID": currentTenantId || "",
      },
    });
  }, [currentTenantId]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
