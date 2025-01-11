import { useApolloClient, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  ADD_SPOT,
  DELETE_LOCATION,
  GET_FLOOR,
  UPDATE_LOCATION,
} from "../../graphql/mutations/topology";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DELETE_SPOT,
  GET_LOCATION,
  GET_TOPOLOGY,
} from "../../graphql/queries/tenants";

export const LocationView = () => {
  const { tenantId, locationId, floorId } = useParams();
  const navigate = useNavigate();
  const [isAddingSpot, setIsAddingSpot] = useState(false);
  const [newSpotName, setNewSpotName] = useState("");
  const [open, setOpen] = useState(false);

  const client = useApolloClient();

  const { data: locationData, loading } = useQuery(GET_LOCATION, {
    variables: {
      id: locationId,
    },
    pollInterval: 10000,
  });

  const [newLocationData, setNewLocationData] = useState({
    // name: locationData?.location?.name,
    // occupancy: locationData?.location?.occupancy,
    // locationType: locationData?.location?.locationType,
    name: "",
    occupancy: "",
    locationType: "",
  });

  const handleDeleteLocation = async () => {
    try {
      await client.mutate({
        mutation: DELETE_LOCATION,
        variables: {
          locationId: locationId,
        },
        refetchQueries: [GET_FLOOR, GET_TOPOLOGY],
      });
      navigate(`/${tenantId}/topology/floors/${floorId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      await client.mutate({
        mutation: UPDATE_LOCATION,
        variables: {
          locationId: locationId,
          data: {
            name: newLocationData.name,
            occupancy: newLocationData.occupancy,
            locationType: newLocationData.locationType,
          },
        },
        refetchQueries: [GET_LOCATION, GET_FLOOR],
      });
      setOpen(false);
      setNewLocationData({
        name: locationData?.location?.name,
        occupancy: locationData?.location?.occupancy,
        locationType: locationData?.location?.locationType,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSpot = () => {
    setIsAddingSpot(true);
  };

  const handleDeleteSpot = async (id: string) => {
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

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setNewLocationData({
      name: locationData?.location?.name,
      occupancy: locationData?.location?.occupancy,
      locationType: locationData?.location?.locationType,
    });
  }, [locationData]);

  if (loading || !locationData)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <CircularProgress />
      </div>
    );

  const { spots, name: locationName, locationType } = locationData.location;

  return (
    <div>
      <div className="flex flex-row gap-2 items-center justify-between mb-6 pt-4">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[8px] bg-[#718cc0] text-white rounded-md px-1 py-1 w-fit">
              {locationType}
            </p>
            <p className="text-2xl font-bold">{locationName}</p>
            <p className="text-sm">
              <span
                className={`${
                  newLocationData.occupancy === "OCCUPIED"
                    ? "text-green-500"
                    : "text-red-500"
                } flex flex-row items-center justify-start gap-1`}
              >
                <span className="relative flex h-3 w-3">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      newLocationData.occupancy === "OCCUPIED"
                        ? "bg-green-400"
                        : "bg-red-400"
                    } opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      newLocationData.occupancy === "OCCUPIED"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                </span>
                {newLocationData.occupancy}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center gap-1">
          <div className="text-gray-500 text-md mb-1 flex flex-row gap-6 justify-between w-full">
            <p>
              <span className="font-bold">ID:</span> <span>{locationId}</span>
            </p>
          </div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ fontSize: "10px" }}
            onClick={() => setOpen(true)}
          >
            Update Location
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ fontSize: "10px" }}
            onClick={handleDeleteLocation}
          >
            Delete Location
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
            placeholder="Spot name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitNewSpot();
              }
            }}
          />
          <div className="flex gap-2">
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Location</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <TextField
            autoFocus
            size="small"
            value={newLocationData.name}
            onChange={(e) =>
              setNewLocationData({ ...newLocationData, name: e.target.value })
            }
            placeholder="Location name"
          />
          <Select
            size="small"
            value={newLocationData.occupancy}
            onChange={(e) =>
              setNewLocationData({
                ...newLocationData,
                occupancy: e.target.value as string,
              })
            }
            label="Select Occupancy"
          >
            <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
            <MenuItem value="UNOCCUPIED">UNOCCUPIED</MenuItem>
          </Select>
          <Select
            size="small"
            value={newLocationData.locationType}
            onChange={(e) =>
              setNewLocationData({
                ...newLocationData,
                locationType: e.target.value,
              })
            }
            label="Select Location Type"
          >
            <MenuItem value="OFFICE">OFFICE</MenuItem>
            <MenuItem value="EATING_AREA">EATING_AREA</MenuItem>
            <MenuItem value="WASH_ROOM">WASH_ROOM</MenuItem>
            <MenuItem value="RECEPTION">RECEPTION</MenuItem>
            <MenuItem value="CORRIDOR">CORRIDOR</MenuItem>
            <MenuItem value="OTHER">OTHER</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateLocation}
            disabled={!newLocationData.name?.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
