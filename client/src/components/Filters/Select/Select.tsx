import { InputLabel, MenuItem, Select } from "@mui/material";

type FilterSelectProps = {
  label: string;
  options: string[];
};

export const WrapperSelect = ({ label, options }: FilterSelectProps) => {
  return (
    <div>
      <InputLabel
        sx={{
          color: "grey",
          fontWeight: "bold",
          marginBottom: "4px",
          paddingLeft: "4px",
          fontSize: "10px",
        }}
      >
        {label}
      </InputLabel>
      <Select
        size="small"
        sx={{
          width: "200px",
          height: "40px",
          borderRadius: "8px",
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
