import { useApolloClient, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  ADD_SPOT,
  DELETE_LOCATION,
  UPDATE_LOCATION,
} from "../../graphql/mutations/topology";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_LOCATION,
  GET_TOPOLOGY,
  GET_TASKS,
  GET_FLOOR,
  GET_LOCATION_OCCUPANCY,
} from "../../graphql/queries";
import { Spot } from "./Partials.tsx/Spot";
import { Location } from "@/types/floors";

import {
  getLocationHighestPriority,
  getPriorityColor,
} from "../../utils/locationUtils";
import { toast } from "react-toastify";

const TABLE_HEADERS = ["ID", "Name", "Options"];

export const LocationView = () => {
  const { tenantId, locationId, floorId } = useParams();
  const navigate = useNavigate();
  const [isAddingSpot, setIsAddingSpot] = useState(false);
  const [newSpotName, setNewSpotName] = useState("");
  const [open, setOpen] = useState(false);
  const notify = (message: string, type: "success" | "error") =>
    toast(message, { type });
  const client = useApolloClient();

  const { data: locationData, loading } = useQuery<{ location: Location }>(
    GET_LOCATION,
    {
      variables: {
        id: locationId,
      },
    }
  );

  const { data: tasksData } = useQuery(GET_TASKS, {
    variables: {
      filter: {
        state: "OPEN",
      },
    },
    pollInterval: 10000,
  });

  const { data } = useQuery(GET_LOCATION_OCCUPANCY, {
    variables: {
      id: locationId,
    },
    pollInterval: 500,
  });

  const highestPriority = getLocationHighestPriority(tasksData, locationId);

  const [newLocationData, setNewLocationData] = useState<Partial<Location>>({
    name: "",
    occupancy: "",
    locationType: "",
  });

  const handleDeleteLocation = async () => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_LOCATION,
        variables: {
          locationId: locationId,
        },
        refetchQueries: [GET_FLOOR, GET_TOPOLOGY],
      });

      if (!data?.deleteLocation) {
        notify(
          "You cannot delete this location because it has open tasks.",
          "error"
        );
      } else {
        notify("Location deleted successfully!", "success");
        navigate(`/${tenantId}/topology/floors/${floorId}`);
      }
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
      notify("Location updated successfully", "success");
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
      notify("Spot added successfully", "success");
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

  const {
    spots = [],
    name: locationName,
    locationType,
  } = locationData.location;

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-row gap-2 items-center justify-between mb-6 pt-4">
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-1">
                {highestPriority && (
                  <p
                    className={`text-[8px] ${getPriorityColor(
                      highestPriority
                    )} text-white rounded-md px-1 py-1 w-fit`}
                  >
                    {highestPriority}
                  </p>
                )}
              </div>
              <p className="text-2xl font-bold">
                {locationName}{" "}
                <span className="text-sm underline text-gray-500">
                  {locationType}
                </span>
              </p>
              <p className="text-sm">
                <span
                  className={`${
                    data?.location?.occupancy === "OCCUPIED"
                      ? "text-green-500"
                      : "text-red-500"
                  } flex flex-row items-center justify-start gap-1`}
                >
                  <span className="relative flex h-3 w-3">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        data?.location?.occupancy === "OCCUPIED"
                          ? "bg-green-400"
                          : "bg-red-400"
                      } opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        data?.location?.occupancy === "OCCUPIED"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                  </span>
                  {data?.location?.occupancy}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-1">
            <div className="text-gray-500 text-md mb-1 flex flex-row gap-6 justify-between w-full">
              {/* <p>
              <span className="font-bold">ID:</span> <span>{locationId}</span>
            </p> */}
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
          {TABLE_HEADERS.map((item) => (
            <p
              className="text-md text-black pl-2 mt-2 font-bold text-center"
              key={item}
            >
              {item}
            </p>
          ))}
        </div>
        <div style={{ overflowY: "auto", maxHeight: "300px" }}>
          {spots?.length > 0 ? (
            spots?.map((spot, index) => (
              <div
                key={spot.id}
                className={`grid grid-cols-3 gap-2 ${
                  index % 2 === 0 ? "bg-gray-100" : ""
                }`}
              >
                <Spot spot={spot} />
              </div>
            ))
          ) : isAddingSpot ? (
            <></>
          ) : (
            <p className="text-md text-black pl-2 mt-2 font-bold text-center">
              No spots found
            </p>
          )}
        </div>
        {isAddingSpot ? (
          <div className="mt-4 flex flex-col gap-2">
            <TextField
              autoFocus
              size="small"
              value={newSpotName}
              onChange={(e) => setNewSpotName(e.target.value)}
              placeholder="Enter spot name"
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
                  ":disabled": {
                    cursor: "not-allowed",
                  },
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
      <p className="text-sm text-grey-50 pl-2 mt-2 text-right">
        <span className="font-bold text-grey-50">ID:</span>{" "}
        <span>{locationId}</span>
      </p>
    </div>
  );
};
