import { IconButton } from "@mui/material";
import { Location as LocationType } from "../../../types/floors";
import DeleteIcon from "@mui/icons-material/Delete";
type LocationProps = {
  location: LocationType;
  handleDeleteLocation: (id: string) => void;
};

export const FloorLocation = ({
  location,
  handleDeleteLocation,
}: LocationProps) => {
  return (
    <>
      <p className="text-md text-gray-500 pl-3 mt-3 mb-3 text-center">
        {location.id}
      </p>
      <p className="text-md text-black pl-3 mt-3 mb-3 text-center">
        {location.name}
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
    </>
  );
};
