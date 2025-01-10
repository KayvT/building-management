import React, { useMemo } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useTenant } from "../contexts/useTenant";

export function TenantApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTenantId } = useTenant();
  const client = useMemo(() => {
    return new ApolloClient({
      uri: "http://localhost:4000",
      cache: new InMemoryCache(),
      headers: {
        "X-Tenant-ID": currentTenantId || "",
      },
    });
  }, [currentTenantId]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
