import { useEffect } from "react";
import { ReactNode } from "react";
import { useTenant } from "../../contexts/TenantIdContext/useTenant";
import { GET_ALL_TENANTS } from "../../graphql/queries";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";

export default function AppWrapper({ children }: { children: ReactNode }) {
  const { data, loading } = useQuery(GET_ALL_TENANTS);
  const { tenantId } = useParams();
  const { currentTenantId, setCurrentTenantId } = useTenant();
  const navigate = useNavigate();

  useEffect(() => {
    if (tenantId) {
      setCurrentTenantId(tenantId);
    } else if (currentTenantId) {
      return;
    } else if (data?.tenants?.[0]?.id) {
      const firstTenantId = data.tenants[0].id;
      setCurrentTenantId(firstTenantId);
    }
  }, [tenantId, currentTenantId, setCurrentTenantId, data, navigate]);


  if (loading)
    return (
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 250px)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );

  return <div>{children}</div>;
}
