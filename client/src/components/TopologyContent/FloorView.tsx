import { useApolloClient, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  ADD_LOCATION,
  DELETE_LOCATION,
  GET_FLOOR,
  UPDATE_FLOOR,
} from "../../graphql/mutations/topology";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

import { DELETE_FLOOR, GET_TOPOLOGY } from "../../graphql/queries/tenants";
import { Floor } from "@/types/floors";

export const FloorView = () => {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [isEditingFloorName, setIsEditingFloorName] = useState(false);
  const [newFloorName, setNewFloorName] = useState("");
  const { floorId, tenantId } = useParams();
  const client = useApolloClient();
  const navigate = useNavigate();
  const notify = (message: string, type: "success" | "error") =>
    toast(message, { type });

  const { data, loading } = useQuery<{ floor: Floor }>(GET_FLOOR, {
    variables: {
      id: floorId,
    },
  });

  useEffect(() => {
    if (data?.floor?.name) {
      setNewFloorName(data?.floor?.name);
    }
  }, [data?.floor?.name]);

  const handleAddLocation = () => {
    setIsAddingLocation(true);
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_LOCATION,
        variables: {
          locationId: id,
        },
        refetchQueries: [GET_FLOOR],
      });
      if (!data?.deleteLocation) {
        notify(
          "You cannot delete this location because it has open tasks.",
          "error"
        );
      } else {
        notify("Location deleted successfully", "success");
        navigate(`/${tenantId}/topology/floors/${floorId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFloor = async () => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_FLOOR,
        variables: {
          floorId: floorId,
        },
        refetchQueries: [GET_TOPOLOGY],
      });
      if (!data.deleteFloor) {
        notify(
          "You cannot delete this floor because it has open tasks.",
          "error"
        );
      } else {
        notify("Floor deleted successfully", "success");
        navigate(`/${tenantId}/topology`);
      }
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

  const handleSubmitNewFloorName = async () => {
    if (!newFloorName.trim()) return;
    try {
      await client.mutate({
        mutation: UPDATE_FLOOR,
        variables: {
          floorId,
          data: {
            name: newFloorName,
          },
        },
        refetchQueries: [GET_FLOOR],
      });
      setIsEditingFloorName(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data?.floor) return <CircularProgress />;

  const { locations, name: floorName } = data.floor;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <CircularProgress />
      </div>
    );

  return (
    <div>
      <div className="flex flex-row gap-2 items-center justify-between mb-6 pt-4">
        <div className="flex flex-col gap-1">
          <p className="text-[8px] bg-[#84B067] text-white rounded-md px-1 py-1 w-fit">
            Floor
          </p>
          <div className="text-2xl font-bold flex flex-row gap-2 items-center justify-start">
            {isEditingFloorName ? (
              <TextField
                autoFocus
                variant="standard"
                size="small"
                sx={{
                  width: "80%",
                }}
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                placeholder="Enter floor name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitNewFloorName();
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <>
                        <IconButton
                          onClick={() => {
                            setIsEditingFloorName(false);
                            setNewFloorName(data?.floor?.name ?? "");
                          }}
                          disableRipple
                        >
                          <CloseIcon
                            sx={{
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "red",
                            }}
                          />
                        </IconButton>
                        <IconButton
                          onClick={handleSubmitNewFloorName}
                          disableRipple
                          disabled={!newFloorName.trim()}
                        >
                          <CheckIcon
                            sx={{
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "green",
                            }}
                          />
                        </IconButton>
                      </>
                    ),
                  },
                }}
              />
            ) : (
              floorName
            )}
            {!isEditingFloorName && (
              <span>
                <ModeEditIcon
                  onClick={() => setIsEditingFloorName(true)}
                  sx={{
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "#0000008a",
                  }}
                />
              </span>
            )}
          </div>
          <p className="text-[10px]">
            <span className="text-gray-500">{`${locations.length} Location${locations.length > 1 || locations.length === 0 ? "s" : ""}`}</span>
          </p>
        </div>
        <div className="flex flex-col items-end justify-center gap-1">
          <div className="text-gray-500 text-md mb-1 flex flex-row gap-6 justify-between w-full">
            <p>
              <span className="font-bold">ID:</span> {floorId}
            </p>
          </div>

          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ fontSize: "10px", textTransform: "none" }}
            onClick={handleDeleteFloor}
          >
            Delete Floor
          </Button>
        </div>
      </div>
      <p className="text-xl font-bold mb-4">All Locations</p>
      <div className="grid grid-cols-5  gap-2 mb-4 ">
        {[
          "Location Name",
          "Location ID",
          "Status",
          "Total Spots",
          "Options",
        ].map((item) => (
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
          className={`grid grid-cols-5 gap-2 ${
            index % 2 === 0 ? "bg-gray-100" : ""
          }`}
        >
          <p className="text-md text-black pl-3 mt-3 mb-3 text-center">
            {location.name}
          </p>
          <p className="text-md text-gray-500 pl-3 mt-3 mb-3 text-center">
            {location.id}
          </p>
          <p className="text-md text-gray-500 pl-3 mt-3 mb-3 text-center">
            {location.occupancy}
          </p>
          <p className="text-md text-gray-500 pl-3 mt-3 mb-3 text-center">
            {location.spots.length}
          </p>
          <div className="text-md text-blue-500 mt-3 mb-3 text-center">
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
          </div>
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
              onClick={() => {
                setIsEditingFloorName(false);
                setNewFloorName(data?.floor?.name ?? "");
              }}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                flex: 1,
              }}
            >
              Cancel
            </Button>
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
