import { Outlet, useLocation, useParams } from "react-router-dom";
import { TopologyTreeView } from "../../components/TopologyTree/TopologyTree";
import { useQuery } from "@apollo/client";
import { GET_TOPOLOGY } from "../../graphql/queries/tenants";
import { Box, CircularProgress } from "@mui/material";

export default function TopologyLayout() {
  const { tenantId } = useParams();
  const { data: topologyTreeData, loading } = useQuery(GET_TOPOLOGY);
  const path = useLocation();
  const isEmptyView = path.pathname === `/${tenantId}/topology`;

  if (loading) return <CircularProgress />;
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 250px)",
        justifyContent: "start",
        alignItems: "start",
        margin: "48px auto",
        flexDirection: "column",
      }}
    >
      <div
        className="flex flex-row justify-between items-center w-full"
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "auto",
          paddingLeft: "2rem",
        }}
      >
        <h1 className="text-5xl font-bold">Topology Tree</h1>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          height: "calc(100vh - 250px)",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto auto",
        }}
      >
        <div
          style={{
            padding: "1rem",
          }}
        >
          {topologyTreeData && <TopologyTreeView tree={topologyTreeData} />}
        </div>
        <Box
          className="flex flex-col"
          sx={{
            flex: 1,
            maxWidth: "800px",
            boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            borderRadius: "8px",
            height: "650px",
            overflowY: "auto",
            padding: "1rem 2rem",
          }}
          boxShadow={4}
        >
          {isEmptyView ? (
            <div className="flex flex-row gap-2 items-center justify-center h-full">
              <p className="text-xl text-gray-500 opacity-50">
                Please select an entry to view its details.
              </p>
            </div>
          ) : (
            <Outlet />
          )}
        </Box>
      </div>
    </div>
  );
}
