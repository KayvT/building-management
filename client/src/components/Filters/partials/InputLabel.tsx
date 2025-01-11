import { InputLabel as MuiInputLabel } from "@mui/material";
import React from "react";

type InputLabelProps = {
  label: string;
};

export const InputLabel = ({ label }: InputLabelProps) => {
  return (
    <MuiInputLabel
      sx={{
        color: "grey",
        fontWeight: "bold",
        marginBottom: "4px",
        paddingLeft: "4px",
        fontSize: "10px",
      }}
    >
      {label}
    </MuiInputLabel>
  );
};
