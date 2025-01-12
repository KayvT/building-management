import { useState } from "react";
import {
  Box,
  CircularProgress,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  DialogActions,
} from "@mui/material";
import { useApolloClient, useQuery } from "@apollo/client";
import { CREATE_OPERATIVE, DELETE_OPERATIVE } from "../../graphql/mutations";
import { GET_OPERATIVES_DETAILS } from "../../graphql/queries";
import DeleteIcon from "@mui/icons-material/Delete";
import { Operative } from "@/types/operative";
import { toast } from "react-toastify";
export default function OperativesRoute() {
  const { data, loading, error } = useQuery<{
    tenant: { operatives: Operative[] };
  }>(GET_OPERATIVES_DETAILS);
  const notify = (message: string, type: "success" | "error") =>
    toast(message, { type });
  const [open, setOpen] = useState(false);
  const [newOperative, setNewOperative] = useState({
    name: "",
    code: "",
    isHuman: true,
  });
  const client = useApolloClient();

  if (!data || loading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  const { operatives } = data.tenant;

  const handleDeleteOperative = async (id: string) => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_OPERATIVE,
        variables: { operativeId: id },
        refetchQueries: [GET_OPERATIVES_DETAILS],
      });
      if (!data.deleteOperative) {
        toast(
          "You cannot delete this operative because they have open tasks.",
          {
            type: "error",
          }
        );
      } else {
        toast("Operative deleted successfully", { type: "success" });
      }
    } catch (error) {
      console.error("Error deleting operative", error);
    }
  };

  const handleAddOperative = async () => {
    try {
      await client.mutate({
        mutation: CREATE_OPERATIVE,
        variables: {
          name: newOperative.name,
          code: newOperative.code,
          isHuman: newOperative.isHuman,
        },
        refetchQueries: [GET_OPERATIVES_DETAILS],
      });
      notify("Operative added successfully", "success");
      setOpen(false);
      setNewOperative({
        name: "",
        code: "",
        isHuman: true,
      });
    } catch (error) {
      console.error("Error adding operative", error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 250px)",
          justifyContent: "center",
          alignItems: "center",
          margin: "48px auto",
          flexDirection: "column",
        }}
      >
        <div
          className="flex flex-row justify-between items-center w-full"
          style={{
            width: "100%",
            maxWidth: "1100px",
          }}
        >
          <h1 className="text-5xl font-bold mb-4">Operatives</h1>
        </div>
        <Box
          className="flex flex-col"
          sx={{
            width: "100%",
            flex: 1,
            maxWidth: "1100px",
            boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            borderRadius: "8px",
            height: "800px",
            overflowY: "auto",
            padding: "1rem 2rem",
            gap: "1rem",
          }}
        >
          <div className="flex flex-row gap-2 flex-wrap">
            {operatives?.map((operative) => (
              <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C5097C] flex items-center justify-center">
                      <div className="text-white font-bold">
                        {operative.name?.slice(0,2).toUpperCase()}
                      </div>
                    </div>
                    <span className="font-semibold text-gray-700">
                      {operative?.name}
                    </span>
                  </div>
                  <IconButton
                    disableRipple
                    onClick={() => handleDeleteOperative(operative?.id)}
                  >
                    <DeleteIcon sx={{ color: "#D11A2A" }} />
                  </IconButton>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">ID: </span>
                    <span>{operative?.id}</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Code: </span>
                    <span>{operative?.code}</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Is Human: </span>
                    <span>{operative?.isHuman ? "Yes" : "No"}</span>
                  </p>
                </div>
              </div>
            ))}
            <button
              className="w-full shadow-lg max-w-xs p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <div className="flex flex-col items-center justify-center h-32">
                <div className="text-green-400 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="text-gray-600 font-medium">Add Operative</span>
              </div>
            </button>
          </div>
        </Box>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              marginBottom: "1rem",
            }}
          >
            Add Operative
          </DialogTitle>
          <DialogContent
            className="flex flex-col gap-4"
            sx={{
              paddingTop: "0.5rem",
            }}
          >
            <TextField
              variant="standard"
              label="Name"
              value={newOperative.name}
              onChange={(e) =>
                setNewOperative({ ...newOperative, name: e.target.value })
              }
            />
            <TextField
              variant="standard"
              label="Code"
              value={newOperative.code}
              onChange={(e) =>
                setNewOperative({ ...newOperative, code: e.target.value })
              }
            />
            <Select
              variant="standard"
              label="Is Human"
              value={newOperative.isHuman}
              onChange={(e) =>
                setNewOperative({
                  ...newOperative,
                  isHuman: e.target.value === "true",
                })
              }
            >
              <MenuItem value="true">Human</MenuItem>
              <MenuItem value="false">Bot</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddOperative}>Add</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
