import { useApolloClient, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  ADD_LOCATION,
  DELETE_LOCATION,
  GET_FLOOR,
} from "../../graphql/mutations/topology";
import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { DELETE_FLOOR, GET_TOPOLOGY } from "../../graphql/queries/tenants";

export const FloorView = () => {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const { floorId, tenantId } = useParams();
  const client = useApolloClient();
  const navigate = useNavigate();

  const { data, loading } = useQuery(GET_FLOOR, {
    variables: {
      id: floorId,
    },
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <CircularProgress />
      </div>
    );

  const handleAddLocation = () => {
    setIsAddingLocation(true);
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      await client.mutate({
        mutation: DELETE_LOCATION,
        variables: {
          locationId: id,
        },
        refetchQueries: [GET_FLOOR],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFloor = async () => {
    try {
      await client.mutate({
        mutation: DELETE_FLOOR,
        variables: {
          floorId: floorId,
        },
        refetchQueries: [GET_TOPOLOGY],
      });
      navigate(`/${tenantId}/topology`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitNewLocation = async () => {
    if (!newLocationName.trim()) return;

    try {
      await client.mutate({
        mutation: ADD_LOCATION,
        variables: {
          floorId: floorId,
          name: newLocationName.trim(),
          occupancy: "UNOCCUPIED",
          locationType: "OTHER",
        },
        refetchQueries: [GET_FLOOR],
      });
      setNewLocationName("");
      setIsAddingLocation(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data.floor) return <div>No floor ID</div>;

  const { locations, name: floorName } = data.floor;

  return (
    <div>
      <div className="flex flex-row gap-2 items-center justify-between mb-4">
        <p className="text-2xl font-bold">{floorName.name}</p>
        <div className="flex flex-col items-end justify-center gap-1">
          <div className="text-gray-500 text-md mb-1 flex flex-row gap-6 justify-between w-full">
            <p>
              <span className="font-bold">ID:</span> {floorId}
            </p>
            <p className="text-[10px] bg-blue-500 text-white rounded-md px-1 py-1">
              Floor
            </p>
          </div>

          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ fontSize: "10px" }}
            onClick={handleDeleteFloor}
          >
            DELETE LOCATION
          </Button>
        </div>
      </div>
      <p className="text-xl font-bold mb-4">All Locations</p>
      <div className="grid grid-cols-3  gap-2 mb-4 ">
        {["Location Name", "Location ID", "Options"].map((item) => (
          <p
            className="text-md text-black pl-2 mt-2 font-bold text-center"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
      {locations?.map((location, index) => (
        <div
          key={location.id}
          className={`grid grid-cols-3 gap-2 ${
            index % 2 === 0 ? "bg-gray-100" : ""
          }`}
        >
          <p className="text-md text-black pl-3 mt-3 mb-3 text-center">
            {location.name}
          </p>
          <p className="text-md text-gray-500 pl-3 mt-3 mb-3 text-center">
            {location.id}
          </p>
          <p className="text-md text-blue-500 mt-3 mb-3 text-center">
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
              onClick={() => handleDeleteLocation(location.id)}
              sx={{
                padding: 0,
              }}
            >
              <DeleteIcon sx={{ color: "#d32f2f", opacity: 0.8 }} />
            </IconButton>
          </p>
        </div>
      ))}
      {isAddingLocation ? (
        <div className="mt-4 flex flex-col gap-2">
          <TextField
            autoFocus
            size="small"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder="Enter floor name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitNewLocation();
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmitNewLocation}
              variant="contained"
              disabled={!newLocationName.trim()}
              sx={{
                borderRadius: "8px",
                flex: 1,
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={() => {
                setIsAddingLocation(false);
                setNewLocationName("");
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
          onClick={handleAddLocation}
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
          Add Location
        </Button>
      )}
    </div>
  );
};
