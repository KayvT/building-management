import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { GET_TOPOLOGY } from "../../graphql/queries/tenants";
import { Box } from "@mui/system";

export default function TopologyRoute() {
  const { tenantId } = useParams();
  const { data } = useQuery(GET_TOPOLOGY, {
    variables: { tenantId },
  });

  return (
    <div
      className="flex flex-row gap-4"
      style={{
        maxWidth: "1100px",
        maxHeight: "80vh",
        margin: "auto",
        marginTop: "100px",
      }}
    >
      <Box
        className="flex flex-col"
        sx={{
          width: "30%",
          backgroundColor: "white",
          borderRadius: "8px",
          height: "80%",
          minHeight: "600px",
          padding: "24px",
        }}
        boxShadow={4}
      >
        <div>
          <div className="font-bold text-2xl pb-3">🏛️ {data?.tenant?.name}</div>
          {data?.tenant?.floors?.map((floor) => (
            <div key={floor.id}>
              <div
                style={{ paddingLeft: "20px" }}
                className="flex items-center relative ml-2 pt-2 pb-1"
              >
                <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
                <div className="absolute left-0 top-1/2 w-5 h-[2px] bg-gray-200" />
                <span>📍 {floor.name}</span>
              </div>
              {floor.locations?.map((location, locationIndex) => (
                <>
                  <div
                    key={location.id}
                    style={{ paddingLeft: "40px" }}
                    className="flex items-center relative ml-2 pt-2 pb-1"
                  >
                    <div
                      className={`absolute left-0 top-0 h-full w-[2px] bg-gray-200 ${
                        locationIndex === floor.locations.length - 1
                          ? "h-1/2"
                          : ""
                      }`}
                    />
                    <div className="absolute left-0 top-1/2 w-8 h-[2px] bg-gray-200" />
                    <span>🏢 {location.name}</span>
                  </div>
                  {location.spots?.map((spot) => (
                    <div
                      key={spot.id}
                      style={{ paddingLeft: "60px" }}
                      className="flex items-center relative ml-2 pt-1 pb-1"
                    >
                      <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
                      <div className="absolute left-0 top-1/2 w-12 h-[2px] bg-gray-200" />
                      <span>⭐ {spot.name}</span>
                    </div>
                  ))}
                </>
              ))}
            </div>
          ))}
        </div>
      </Box>
      <Box
        className="flex flex-col"
        sx={{
          width: "80%",
          backgroundColor: "white",
          borderRadius: "8px",
          height: "80%",
          minHeight: "600px",
          padding: "24px",
        }}
        boxShadow={4}
      >
        <div>testing 123</div>
      </Box>
    </div>
  );
}
