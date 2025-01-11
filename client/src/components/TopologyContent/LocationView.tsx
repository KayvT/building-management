import { useApolloClient, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { ADD_SPOT } from "../../graphql/mutations/topology";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { DELETE_SPOT, GET_LOCATION } from "../../graphql/queries/tenants";

export const LocationView = () => {
  const { locationId } = useParams();
  const [isAddingSpot, setIsAddingSpot] = useState(false);
  const [newSpotName, setNewSpotName] = useState("");
  const client = useApolloClient();

  const { data: locationData, loading } = useQuery(GET_LOCATION, {
    variables: {
      id: locationId,
    },
  });
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <CircularProgress />
      </div>
    );

  const { spots, name: locationName } = locationData.location;

  const handleAddSpot = () => {
    setIsAddingSpot(true);
  };

  const handleDeleteSpot = async (id: string) => {
    console.log("delete spot", id);
    try {
      await client.mutate({
        mutation: DELETE_SPOT,
        variables: {
          spotId: id,
        },
        refetchQueries: [GET_LOCATION],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitNewSpot = async () => {
    if (!newSpotName.trim()) return;

    try {
      await client.mutate({
        mutation: ADD_SPOT,
        variables: {
          locationId: locationId,
          name: newSpotName.trim(),
        },
        refetchQueries: [GET_LOCATION],
      });
      setNewSpotName("");
      setIsAddingSpot(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-2 items-center justify-between mb-4">
        <p className="text-2xl font-bold">{locationName}</p>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-gray-500 text-md mb-1">
            <span className="font-bold">ID:</span> {locationId}
          </p>
          <p className="text-sm bg-blue-500 text-white rounded-md px-2 py-1">
            Location
          </p>
          <Button variant="contained" color="error">
            DELETE LOCATION
          </Button>
        </div>
      </div>
      <p className="text-xl font-bold mb-4">All Spots</p>
      <div className="grid grid-cols-3  gap-2 mb-4 ">
        {["Spot Name", "Spot ID", "Options"].map((item) => (
          <p
            className="text-md text-black pl-2 mt-2 font-bold text-center"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
      {spots?.map((spot, index) => (
        <div
          key={spot.id}
          className={`grid grid-cols-3 gap-2 ${
            index % 2 === 0 ? "bg-gray-100" : ""
          }`}
        >
          <p className="text-md text-black pl-3 mt-3 mb-3 text-center">
            {spot.name}
          </p>
          <p className="text-md text-gray-500 pl-3 mt-3 mb-3 text-center">
            {spot.id}
          </p>
          <p className="text-md text-blue-500 mt-3 mb-3 text-center">
            {/* <Tooltip
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
            </Tooltip> */}
            <IconButton
              aria-label="Add Location"
              disableRipple
              onClick={() => handleDeleteSpot(spot.id)}
              sx={{
                padding: 0,
              }}
            >
              <DeleteIcon sx={{ color: "#d32f2f" }} />
            </IconButton>
          </p>
        </div>
      ))}
      {isAddingSpot ? (
        <div className="mt-4 flex flex-col gap-2">
          <TextField
            autoFocus
            size="small"
            value={newSpotName}
            onChange={(e) => setNewSpotName(e.target.value)}
            placeholder="Enter floor name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitNewSpot();
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmitNewSpot}
              variant="contained"
              disabled={!newSpotName.trim()}
              sx={{
                borderRadius: "8px",
                flex: 1,
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={() => {
                setIsAddingSpot(false);
                setNewSpotName("");
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
          onClick={handleAddSpot}
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
          Add Spot
        </Button>
      )}
    </div>
  );
};
