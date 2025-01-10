import React from "react";
import { TenantProvider } from "./src/contexts/TenantProvider";
import RoutesWrapper from "./src/components/RoutesWrapper/RoutesWrapper";
import AppWrapper from "./src/components/AppWrapper/AppWrapper";
import NavigationHeader from "./src/components/navigation/Navigation";
import { TenantApolloProvider } from "./src/components/TenantApolloProvider";

function App() {
  return (
    <TenantProvider>
      <TenantApolloProvider>
        <AppWrapper>
          <NavigationHeader />
          <RoutesWrapper />
        </AppWrapper>
      </TenantApolloProvider>
    </TenantProvider>
  );
}

export default App;
