import { useApolloClient, useQuery } from "@apollo/client";
import {
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { GET_TASKS } from "../../graphql/queries/tasks";
import { useState } from "react";
import {
  GET_LOCATIONS,
  GET_OPERATIVES,
} from "../../graphql/queries/operatives";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { CREATE_TASK } from "../../graphql/mutations/tasks";
import { Floors } from "@/types/floors";
import { TenantData } from "@/types/tenant";

type AddTaskDialogProps = {
  open: boolean;
  setOpenTaskModal: (open: boolean) => void;
  onClose: () => void;
};

export default function AddTaskDialog({
  open,
  setOpenTaskModal,
  onClose,
}: AddTaskDialogProps) {
  const { data, loading } = useQuery<{ tenant: TenantData }>(GET_OPERATIVES);
  const { data: locationsData } = useQuery<{ floors: Floors }>(GET_LOCATIONS);

  console.log("###", locationsData);
  const client = useApolloClient();
  const [newTask, setNewTask] = useState<{
    priority: string;
    operativeId: string;
    dueAt: Dayjs | null;
    locationId: string;
  }>({
    priority: "",
    operativeId: "",
    dueAt: null,
    locationId: "",
  });

  if (loading) return <CircularProgress />;

  const handleAddNewTask = async () => {
    try {
      await client.mutate({
        mutation: CREATE_TASK,
        variables: {
          locationId: newTask.locationId,
          state: "OPEN",
          createdAt: new Date().toISOString(),
          dueAt: newTask.dueAt?.toISOString(),
          priority: newTask.priority,
          operativeId: newTask.operativeId,
        },
        refetchQueries: [GET_TASKS],
      });
      setOpenTaskModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent className="flex flex-col gap-4 w-full">
        <div>
          <InputLabel
            sx={{
              color: "#808080",
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            Select Location
          </InputLabel>
          <Select
            sx={{ width: "100%" }}
            value={newTask.locationId}
            onChange={(e) =>
              setNewTask({ ...newTask, locationId: e.target.value as string })
            }
          >
            {locationsData?.floors?.map((floor) =>
              floor.locations?.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              ))
            )}
          </Select>
        </div>
        <div>
          <InputLabel
            sx={{
              color: "#808080",
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            Select Priority
          </InputLabel>
          <Select
            sx={{ width: "100%" }}
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
          >
            <MenuItem value="LOW">LOW</MenuItem>
            <MenuItem value="MEDIUM">MEDIUM</MenuItem>
            <MenuItem value="HIGH">HIGH</MenuItem>
            <MenuItem value="URGENT">URGENT</MenuItem>
          </Select>
        </div>
        <div>
          <InputLabel
            sx={{
              color: "#808080",
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            Select Operative
          </InputLabel>
          <Select
            sx={{ width: "100%" }}
            value={newTask.operativeId}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                operativeId: e.target.value as string,
              })
            }
          >
            {data?.tenant?.operatives?.map((operative) => (
              <MenuItem key={operative.id} value={operative.id}>
                {operative.name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <InputLabel
            sx={{
              color: "#808080",
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            Due At
          </InputLabel>
          <DatePicker
            value={newTask.dueAt}
            onChange={(value) => setNewTask({ ...newTask, dueAt: value })}
            sx={{
              width: "100%",
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenTaskModal(false)}>Cancel</Button>
        <Button onClick={handleAddNewTask}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
