import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import React from "react";

export const AddNewLocationButton = ({
  handleSubmitNewLocation,
  isAddingLocation,
  setIsAddingLocation,
  newLocationName,
  setNewLocationName,
}) => {
  const handleAddLocation = () => {
    setIsAddingLocation(true);
  };
  return (
    <>
      {isAddingLocation && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          <TextField
            autoFocus
            size="small"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder="Enter location name"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmitNewLocation();
              }
            }}
          />
          <div className="col-span-2 flex gap-2">
            <Button
              onClick={handleSubmitNewLocation}
              variant="contained"
              disabled={!newLocationName.trim()}
              size="small"
            >
              Confirm
            </Button>
            <Button
              onClick={() => {
                setIsAddingLocation(false);
                setNewLocationName("");
              }}
              variant="outlined"
              size="small"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={handleAddLocation}
        disableRipple
        variant="outlined"
        disableTouchRipple
        sx={{
          marginTop: "16px",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        Add Location
      </Button>
    </>
  );
};
