import { Box } from "@mui/material";

import React, { useState } from "react";
import { LocationSpot } from "../../types/Tenant";
import { TenantFloor } from "../../types/Tenant";
import { FloorLocation } from "../../types/Tenant";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { ADD_LOCATION } from "../../graphql/mutations/topology";
import { useApolloClient } from "@apollo/client";
import { GET_TOPOLOGY } from "../../graphql/queries/tenants";
import { AddNewLocationButton } from "./AddNewLocationButton";
export const TopologyContent = ({
  selectedEntry,
}: {
  selectedEntry:
    | ((TenantFloor | FloorLocation | LocationSpot) & {
        type: "floor" | "location" | "spot";
      })
    | null;
}) => {
  const client = useApolloClient();
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");

  const handleSubmitNewLocation = async () => {
    if (!newLocationName.trim()) return;

    try {
      await client.mutate({
        mutation: ADD_LOCATION,
        variables: {
          floorId: selectedEntry?.id,
          name: newLocationName.trim(),
          occupancy: "UNOCCUPIED",
          locationType: "OTHER",
        },
        refetchQueries: [GET_TOPOLOGY],
      });
      setNewLocationName("");
      setIsAddingLocation(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      className="flex flex-col"
      sx={{
        width: "80%",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        borderRadius: "8px",
        height: "80%",
        minHeight: "600px",
        padding: "24px",
        ...(!selectedEntry
          ? {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }
          : {}),
      }}
      boxShadow={4}
    >
      {selectedEntry ? (
        <div>
          <div className="flex flex-row gap-2 items-center justify-between mb-4">
            <p className="text-2xl font-bold">{selectedEntry?.name}</p>
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="text-gray-500 text-md mb-1">
                <span className="font-bold">ID:</span> {selectedEntry?.id}
              </p>
              <p className="text-sm bg-blue-500 text-white rounded-md px-2 py-1">
                {selectedEntry?.type === "floor" && "Floor"}
                {selectedEntry?.type === "location" && "Location"}
                {selectedEntry?.type === "spot" && "Spot"}
              </p>
              {/* //need to view details of the selected entry based on what it is */}
            </div>
          </div>
          {/* {console.log("## selectedEntry", selectedEntry)} */}
          {selectedEntry?.type === "floor" && (
            <div>
              <p className="text-xl font-bold mb-4">All Locations</p>
              <div className="grid grid-cols-3  gap-2 mb-4 ">
                {["Location Name", "Location ID", "Options"].map((item) => (
                  <p
                    className="text-md text-black pl-2 mt-2 font-bold"
                    key={item}
                  >
                    {item}
                  </p>
                ))}
              </div>
              {selectedEntry?.type === "floor" &&
                (selectedEntry as TenantFloor)?.locations?.map(
                  (location, index) => (
                    <div
                      key={location.id}
                      className={`grid grid-cols-3 gap-2 ${
                        index % 2 === 0 ? "bg-gray-100" : ""
                      }`}
                    >
                      <p className="text-md text-black pl-3 mt-3 mb-3">
                        {location.name}
                      </p>
                      <p className="text-md text-gray-500 pl-3 mt-3 mb-3">
                        {location.id}
                      </p>
                      <p className="text-md text-blue-500 mt-3 mb-3">
                        <Tooltip
                          title="Add Spot"
                          placement="top"
                          arrow
                          slotProps={{
                            popper: {
                              modifiers: [
                                {
                                  name: "offset",
                                  options: {
                                    offset: [0, -10],
                                  },
                                },
                              ],
                            },
                          }}
                        >
                          <IconButton
                            aria-label="Add Location"
                            disableRipple
                            // onClick={handleAddLocation}
                            sx={{
                              paddingTop: 0,
                              paddingBottom: 0,
                            }}
                          >
                            <AddLocationIcon />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          aria-label="Add Location"
                          disableRipple
                          //   onClick={handleAddLocation}
                          sx={{
                            padding: 0,
                          }}
                        >
                          <DeleteIcon sx={{ color: "#D11A2A" }} />
                        </IconButton>
                      </p>
                    </div>
                  )
                )}

              <AddNewLocationButton
                handleSubmitNewLocation={handleSubmitNewLocation}
                isAddingLocation={isAddingLocation}
                setIsAddingLocation={setIsAddingLocation}
                newLocationName={newLocationName}
                setNewLocationName={setNewLocationName}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center justify-center h-full">
          <p className="text-xl text-gray-500 opacity-50">
            Please select an entry to view its details.
          </p>
        </div>
      )}
    </Box>
  );
};
