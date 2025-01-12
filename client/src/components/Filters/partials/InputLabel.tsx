import { InputLabel as MuiInputLabel } from "@mui/material";

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
        fontSize: "16px",
        textTransform: "capitalize",
      }}
    >
      {label}
    </MuiInputLabel>
  );
};
