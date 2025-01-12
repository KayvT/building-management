import { TenantProvider } from "./src/contexts/TenantIdContext/TenantProvider";
import RoutesWrapper from "./src/components/RoutesWrapper/RoutesWrapper";
import AppWrapper from "./src/components/AppWrapper/AppWrapper";
import NavigationHeader from "./src/components/navigation/Navigation";
import { TenantApolloProvider } from "./src/contexts/ApolloClientProvider/TenantApolloProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Slide, ToastContainer } from "react-toastify";

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
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
        transition={Slide}
        pauseOnHover={false}
        closeButton={true}
      />
    </LocalizationProvider>
  );
}

export default App;
