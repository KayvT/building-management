import { TenantProvider } from "./src/contexts/TenantProvider";
import RoutesWrapper from "./src/components/RoutesWrapper/RoutesWrapper";
import AppWrapper from "./src/components/AppWrapper/AppWrapper";
import NavigationHeader from "./src/components/navigation/Navigation";
import { TenantApolloProvider } from "./src/components/TenantApolloProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TenantProvider>
        <TenantApolloProvider>
          <AppWrapper>
            <NavigationHeader />
            <RoutesWrapper />
          </AppWrapper>
        </TenantApolloProvider>
      </TenantProvider>
    </LocalizationProvider>
  );
}

export default App;
