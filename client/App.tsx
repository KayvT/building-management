import React from "react";
import { TenantProvider } from "./src/contexts/TenantProvider";
import RoutesWrapper from "./src/components/RoutesWrapper/RoutesWrapper";
import AppWrapper from "./src/components/AppWrapper/AppWrapper";
import NavigationHeader from "./src/components/navigation/Navigation";

function App() {
  return (
    <TenantProvider>
      <AppWrapper>
        <NavigationHeader />
        <RoutesWrapper />
      </AppWrapper>
    </TenantProvider>
  );
}

export default App;
