import { TextField } from "@mui/material";
import { WrapperSelect } from "./Select/Select";
import { InputLabel } from "./partials/InputLabel";

export default function Filters() {
  return (
    <div className="mb-4">
      <p className="text-md font-bold mb-2">Filters</p>
      <div className="flex flex-row items-center justify-start gap-4">
        <WrapperSelect
          label="Select Priority"
          options={["LOW", "MEDIUM", "HIGH", "URGENT"]}
        />
        <WrapperSelect label="Select State" options={["OPEN", "CLOSED"]} />
        <div>
          <InputLabel label="Operative ID" />
          <TextField size="small" />
        </div>
      </div>
    </div>
  );
}
