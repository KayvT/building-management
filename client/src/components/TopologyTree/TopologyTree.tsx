import { useState } from "react";
import { TenantData } from "../../types/tenant";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import { ADD_FLOOR } from "../../graphql/mutations/topology";
import { useApolloClient } from "@apollo/client";
import { GET_TOPOLOGY } from "../../graphql/queries";
import { TreeView } from "./TreeView";
import { toast } from "react-toastify";
type Props = {
  tree: {
    tenant: TenantData;
  };
};
export const TopologyTreeView = ({ tree }: Props) => {
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [newFloorName, setNewFloorName] = useState("");
  const { tenantId } = useParams();
  const client = useApolloClient();
  const navigate = useNavigate();
  const notify = (message: string, type: "success" | "error") =>
    toast(message, { type });
  const handleSubmitNewFloor = async () => {
    try {
      const { data } = await client.mutate({
        mutation: ADD_FLOOR,
        variables: {
          name: newFloorName,
        },
        refetchQueries: [GET_TOPOLOGY],
      });
      setIsAddingFloor(false);
      setNewFloorName("");
      navigate(`/${tenantId}/topology/floors/${data.createFloor.id}
        `);
      notify("Floor added successfully!", "success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      className="flex flex-col"
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        width: "250px",
        height: "650px",
        overflowY: "auto",
        padding: "16px 8px 24px 24px",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <p className="text-gray-400 text-[10px] pb-1">Topology Tree</p>
      <div>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="font-bold text-2xl mb-3">🏛️ {tree?.tenant?.name}</div>
        </div>
        <TreeView floors={tree?.tenant?.floors} />
      </div>
      {isAddingFloor ? (
        <div className="mt-4 flex flex-col gap-2">
          <TextField
            autoFocus
            size="small"
            value={newFloorName}
            onChange={(e) => setNewFloorName(e.target.value)}
            placeholder="Enter floor name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitNewFloor();
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setIsAddingFloor(false);
                setNewFloorName("");
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
              onClick={handleSubmitNewFloor}
              variant="contained"
              disabled={!newFloorName.trim()}
              sx={{
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
          onClick={() => setIsAddingFloor(true)}
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
          Add New Floor
        </Button>
      )}
    </Box>
  );
};
