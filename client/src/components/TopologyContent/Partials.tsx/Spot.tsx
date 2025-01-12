import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { UPDATE_SPOT } from "../../../graphql/mutations/topology";
import { useApolloClient } from "@apollo/client";
import { DELETE_SPOT } from "../../../graphql/queries/tenants";
import { GET_LOCATION } from "../../../graphql/queries/tenants";
import { LocationSpot } from "@/types/tenant";

type SpotProps = {
  spot: LocationSpot;
};

export const Spot = ({ spot }: SpotProps) => {
  const [isEditingSpotName, setIsEditingSpotName] = useState(false);
  const [newSpotName, setNewSpotName] = useState(spot.name ?? "");
  const client = useApolloClient();

  const handleSubmitNewSpotName = async () => {
    if (!newSpotName.trim()) return;

    try {
      await client.mutate({
        mutation: UPDATE_SPOT,
        variables: {
          spotId: spot.id,
          data: { name: newSpotName.trim() },
        },
        refetchQueries: [GET_LOCATION],
      });
      setIsEditingSpotName(false);
      setNewSpotName(spot.name ?? "");
    } catch (error) {
      console.error(error);
    }
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

  return (
    <>
      {isEditingSpotName ? (
        <TextField
          autoFocus
          variant="standard"
          size="small"
          sx={{
            width: "60%",
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "center",
          }}
          value={newSpotName}
          onChange={(e) => setNewSpotName(e.target.value)}
          placeholder="Enter spot name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmitNewSpotName();
            }
          }}
          slotProps={{
            input: {
              endAdornment: (
                <>
                  <IconButton
                    onClick={() => {
                      setIsEditingSpotName(false);
                      setNewSpotName(spot.name ?? "");
                    }}
                    disableRipple
                  >
                    <CloseIcon
                      sx={{
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "red",
                      }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={handleSubmitNewSpotName}
                    disableRipple
                    disabled={!newSpotName.trim()}
                  >
                    <CheckIcon
                      sx={{
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "green",
                      }}
                    />
                  </IconButton>
                </>
              ),
            },
          }}
        />
      ) : (
        <p className="text-md text-black  mt-3 mb-3 text-center">{spot.name}</p>
      )}
      <p className="text-md text-gray-500  mt-3 mb-3 text-center">{spot.id}</p>
      <p className="text-md text-blue-500 mt-3 mb-3 text-center">
        {!isEditingSpotName && (
          <span>
            <ModeEditIcon
              onClick={() => setIsEditingSpotName(true)}
              sx={{
                fontSize: "20px",
                cursor: "pointer",
                color: "#0000008a",
                marginRight: "6px",
              }}
            />
          </span>
        )}
        <IconButton
          aria-label="Add Location"
          disableRipple
          onClick={() => handleDeleteSpot(spot.id)}
          sx={{
            padding: 0,
          }}
        >
          <DeleteIcon sx={{ color: "#d32f2f", opacity: 0.8 }} />
        </IconButton>
      </p>
    </>
  );
};
