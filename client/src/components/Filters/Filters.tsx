import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { InputLabel } from "./partials/InputLabel";
import { Operative } from "@/types/operative";

type FiltersProps = {
  operatives: Operative[];
  handlePriorityChange: (value: string) => void;
  handleStateChange: (value: string) => void;
  handleOperativeChange: (event?: SelectChangeEvent<string | null>) => void;
  filters: {
    priority: string | undefined;
    state: string | undefined;
    operativeId: string | undefined | null;
  };
  handleClear: () => void;
};

export default function Filters({
  operatives,
  handlePriorityChange,
  handleStateChange,
  handleOperativeChange,
  filters,
  handleClear,
}: FiltersProps) {
  return (
    <div className="mb-4">
      <p className="text-md font-bold mb-2 flex flex-row gap-2 items-center mb-3">
        <span>Filters</span>
        {filters.priority || filters.state || filters.operativeId ? (
          <span
            className="text-[10px] text-blue-500 underline cursor-pointer mt-1"
            onClick={handleClear}
          >
            {"Clear all filters"}
          </span>
        ) : null}
      </p>
      <div className="flex flex-row items-start justify-start gap-4">
        <div className="flex flex-col justify-center items-start">
          <InputLabel label="Priority" />
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "4px",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.priority === "LOW"}
                  onChange={() => handlePriorityChange("LOW")}
                />
              }
              label="Low"
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.priority === "MEDIUM"}
                  onChange={() => handlePriorityChange("MEDIUM")}
                />
              }
              label="Medium"
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.priority === "HIGH"}
                  onChange={() => handlePriorityChange("HIGH")}
                />
              }
              label="High"
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.priority === "URGENT"}
                  onChange={() => handlePriorityChange("URGENT")}
                />
              }
              label="Urgent"
            />
          </FormGroup>
        </div>

        <div className="flex flex-col justify-center items-start">
          <InputLabel label="State" />
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "4px",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.state === "OPEN"}
                  onChange={() => handleStateChange("OPEN")}
                />
              }
              label="Open"
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.state === "CLOSED"}
                  onChange={() => handleStateChange("CLOSED")}
                />
              }
              label="Closed"
            />
          </FormGroup>
        </div>
        <div className="flex flex-col justify-center items-start">
          <InputLabel label="Operative" />
          <div className="flex flex-row items-center gap-2">
            <Select
              value={filters.operativeId}
              variant="outlined"
              size="small"
              sx={{
                width: "200px",
                height: "40px",
                borderRadius: "8px",
              }}
              onChange={handleOperativeChange}
            >
              {operatives?.map((operative) => (
                <MenuItem key={operative.id} value={operative.id}>
                  {operative.name}
                </MenuItem>
              ))}
            </Select>
            {filters.operativeId && (
              <Tooltip title="Clear Operative" placement="top" arrow>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOperativeChange();
                  }}
                  className="p-1 rounded-full"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
