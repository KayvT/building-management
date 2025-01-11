import React, { useState } from "react";
import { TenantData } from "../../types/Tenant";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import { ADD_FLOOR } from "../../graphql/mutations/topology";
import { useApolloClient } from "@apollo/client";
import { GET_TOPOLOGY } from "../../graphql/queries/tenants";
type Props = {
  tree: {
    tenant: TenantData;
  };
};
export const TopologyTreeView = ({ tree }: Props) => {
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [newFloorName, setNewFloorName] = useState("");
  const { tenantId } = useParams();
  const client = useApolloClient();
  const navigate = useNavigate();

  const handleSubmitNewFloor = async () => {
    try {
      const { data } = await client.mutate({
        mutation: ADD_FLOOR,
        variables: {
          name: newFloorName,
        },
        refetchQueries: [GET_TOPOLOGY],
      });
      setIsAddingFloor(false);
      setNewFloorName("");
      navigate(`/${tenantId}/topology/floors/${data.createFloor.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      className="flex flex-col"
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        width: "250px",
        height: "800px",
        overflowY: "auto",
        padding: "8px 24px 24px 24px",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <p className="text-gray-400 text-[10px] pb-1">Topology Tree</p>
      <div>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="font-bold text-2xl mb-3">🏛️ {tree?.tenant?.name}</div>
        </div>
        {tree?.tenant?.floors?.map((floor) => (
          <div key={floor.id}>
            <Link
              to={`/${tree.tenant.id}/topology/floors/${floor.id}`}
              style={{ paddingLeft: "20px" }}
              className="flex items-center relative ml-2 pt-1 pb-1 cursor-pointer"
            >
              <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
              <div className="absolute left-0 top-1/2 w-5 h-[2px] bg-gray-200" />
              <div className="flex flex-row gap-2 items-center justify-between w-full">
                <span
                  className="hover:text-blue-600 transition-all duration-300 
                 cursor-pointer hover:translate-y-[-2px] hover:font-bold"
                >
                  🏗️ {floor.name}
                </span>
              </div>
            </Link>
            {floor.locations?.map((location, locationIndex) => (
              <React.Fragment key={location.id}>
                <Link
                  to={`/${tree.tenant.id}/topology/floors/${floor.id}/locations/${location.id}`}
                  className="flex items-center relative ml-2 pt-1 pb-1 pl-[40px]
                  whitespace-nowrap cursor-pointer"
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-[2px] bg-gray-200 ${
                      locationIndex === floor.locations.length - 1
                        ? "h-1/2"
                        : ""
                    }`}
                  />
                  <div className="absolute left-0 top-1/2 w-8 h-[2px] bg-gray-200" />
                  <span
                    className="hover:text-blue-600 transition-all duration-300 
                 cursor-pointer hover:translate-y-[-2px] hover:font-bold"
                  >
                    🎯 {location.name}
                  </span>
                </Link>
                {location.spots?.map((spot) => (
                  <Link
                    to={`/${tree.tenant.id}/topology/floors/${floor.id}/locations/${location.id}/spots/${spot.id}`}
                    key={spot.id}
                    style={{ paddingLeft: "60px" }}
                    className="flex items-center relative ml-2 pt-1 pb-1 cursor-pointer hover:text-blue-600 transition-all duration-300"
                  >
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
                    <div className="absolute left-0 top-1/2 w-12 h-[2px] bg-gray-200" />
                    <span
                      className="hover:text-blue-600 transition-all duration-300 
                 cursor-pointer hover:translate-y-[-2px] hover:font-bold"
                    >
                      📍 {spot.name}
                    </span>
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
      {isAddingFloor ? (
        <div className="mt-4 flex flex-col gap-2">
          <TextField
            autoFocus
            size="small"
            value={newFloorName}
            onChange={(e) => setNewFloorName(e.target.value)}
            placeholder="Enter floor name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitNewFloor();
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmitNewFloor}
              variant="contained"
              disabled={!newFloorName.trim()}
              sx={{
                borderRadius: "8px",
                flex: 1,
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={() => {
                setIsAddingFloor(false);
                setNewFloorName("");
              }}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                flex: 1,
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingFloor(true)}
          disableRipple
          variant="outlined"
          disableTouchRipple
          sx={{
            marginTop: "16px",
            borderRadius: "8px",
            maxWidth: "80%",
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
          }}
        >
          Add New Floor
        </Button>
      )}
    </Box>
  );
};
