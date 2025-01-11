import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import React from "react";

export const AddNewBranchButton = ({
  caption,
  handleSubmitNewBranch,
  isAddingBranch,
  setIsAddingBranch,
  newBranchName,
  setNewBranchName,
}) => {
  const handleAddBranch = () => {
    setIsAddingBranch(true);
  };
  return (
    <>
      {isAddingBranch && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          <TextField
            autoFocus
            size="small"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            placeholder="Enter location name"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSubmitNewBranch();
              }
            }}
          />
          <div className="col-span-2 flex gap-2">
            <Button
              onClick={handleSubmitNewBranch}
              variant="contained"
              disabled={!newBranchName.trim()}
              size="small"
            >
              Confirm
            </Button>
            <Button
              onClick={() => {
                setIsAddingBranch(false);
                setNewBranchName("");
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
        onClick={handleAddBranch}
        disableRipple
        variant="outlined"
        disableTouchRipple
        sx={{
          marginTop: "16px",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        {caption}
      </Button>
    </>
  );
};
