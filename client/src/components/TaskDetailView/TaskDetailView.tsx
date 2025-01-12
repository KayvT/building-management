import { useState } from "react";
import { Drawer, Select, MenuItem, Tooltip } from "@mui/material";

import { useApolloClient, useQuery } from "@apollo/client";
import {
  GET_TASK,
  GET_TASKS,
  GET_OPERATIVES,
  GET_TENANT,
} from "../../graphql/queries";
import { ASSIGN_TASK, CLOSE_TASK } from "../../graphql/mutations";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Floor, Location } from "@/types/floors";

export const TaskDetailView = () => {
  const notify = (message: string, type: "success" | "error") =>
    toast(message, { type });
  const { taskId, tenantId } = useParams();
  const { data: operatives } = useQuery(GET_OPERATIVES);
  const [isClosingTask, setIsClosingTask] = useState(false);
  const navigate = useNavigate();

  const { data } = useQuery(GET_TASK, {
    variables: { id: taskId },
  });
  const task = data?.task;

  const { data: tenantData } = useQuery(GET_TENANT, {
    variables: { locationId: task?.location.id },
  });
  // filter through tenant and find the floor the location is on
  const taskFloor = tenantData?.tenant?.floors?.find((floor: Floor) =>
    floor.locations.some(
      (location: Location) => location.id === task?.location.id
    )
  );

  const client = useApolloClient();

  const handleClose = () => {
    navigate(`/${tenantId}/tasks`);
  };
  const [taskAssignedOperative, setTaskAssignedOperative] = useState<{
    id: string | null;
    name: string | null;
  } | null>(null);

  const handleSubmitAssignATask = async (id: string) => {
    const selectedOperative = operatives?.tenant?.operatives?.find(
      (operative: { id: string; name: string }) => operative?.id === id
    );
    setTaskAssignedOperative({
      id: id,
      name: selectedOperative?.name || null,
    });

    try {
      const { data } = await client.mutate({
        mutation: ASSIGN_TASK,
        variables: {
          taskId: taskId,
          operativeId: id,
        },
        refetchQueries: [GET_TASKS],
      });
      notify(
        `Task assigned to ${data?.assignTask?.operative?.name} successfully`,
        "success"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnassignTask = async () => {
    try {
      await client.mutate({
        mutation: ASSIGN_TASK,
        variables: {
          taskId: taskId,
          operativeId: null,
        },
        refetchQueries: [GET_TASKS],
      });
      setTaskAssignedOperative(null);
      notify("Task unassigned successfully", "success");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseTask = async () => {
    try {
      await client.mutate({
        mutation: CLOSE_TASK,
        variables: { taskId: taskId },
        refetchQueries: [GET_TASKS],
      });
      setIsClosingTask(false);
      notify("Task closed successfully", "success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer open={Boolean(taskId)} onClose={handleClose} anchor="right">
      <div className="p-6 w-[400px] h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            {task?.priority === "LOW" ? (
              <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {task?.priority}
              </span>
            ) : task?.priority === "MEDIUM" ? (
              <span className="bg-yellow-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {task?.priority}
              </span>
            ) : task?.priority === "URGENT" ? (
              <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {task?.priority}
              </span>
            ) : (
              <span className="bg-purple-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {task?.priority}
              </span>
            )}
          </div>
          <div className="text-gray-600 font-medium">{task?.id}</div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-700 font-medium">
            {task?.location?.name}
          </div>
          {task?.state === "OPEN" ? (
            <Tooltip title="Complete Task" placement="top" arrow>
              <button onClick={() => setIsClosingTask(true)}>
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </Tooltip>
          ) : (
            <></>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Assigned to:</div>
            <div className="flex items-center gap-2">
              <Select
                value={task?.operative?.id ?? ""}
                onChange={(e) => {
                  handleSubmitAssignATask(e.target.value);
                }}
                sx={{ width: "100%" }}
              >
                {operatives?.tenant?.operatives?.map(
                  (operative: { id: string; name: string }) => (
                    <MenuItem value={operative?.id} key={operative?.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: "#EAB309",
                          }}
                        >
                          <div className="text-white text-lg">
                            {operative?.name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <span className="ml-2">{operative?.name}</span>
                      </div>
                    </MenuItem>
                  )
                )}
              </Select>
              {taskAssignedOperative?.id && (
                <Tooltip title="Unassign Task" placement="top" arrow>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnassignTask();
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

          <div>
            <div className="text-sm text-gray-500 mb-1">Task State:</div>
            {task?.state === "OPEN" ? (
              <span className="bg-[#ECFBF3] text-[#254C3A] text-xs font-medium px-2.5 py-0.5 rounded-full border border-[#254C3A]">
                Open
              </span>
            ) : (
              <span className="bg-[#FFF0EC] text-[#5F1908] text-xs font-medium px-2.5 py-0.5 rounded-full border border-[#5F1908]">
                CLOSED
              </span>
            )}
          </div>

          <div>
            {task?.dueAt && (
              <>
                <div className="text-sm text-gray-500 mb-1">Due:</div>
                <div className="text-gray-700">
                  {new Date(task?.dueAt).toLocaleString()}
                </div>
              </>
            )}
          </div>
          {isClosingTask ? (
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Are you sure you want to close this task?
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsClosingTask(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={handleCloseTask}
                >
                  Yes, complete task
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="mt-auto pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">FloorID | Name</p>
              <p>
                {taskFloor?.id} | {taskFloor?.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Task ID:</p>
              <p className="text-center">{task?.id}</p>
            </div>
          </div>
          <div className="border-t mt-2 mb-2">
            {task?.createdAt && (
              <>
                <div className="text-sm text-gray-500 mt-2">
                  Task created at:
                </div>
                <div className="text-gray-700">
                  {new Date(task?.createdAt).toLocaleString()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
