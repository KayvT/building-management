import { useState } from "react";
import { Drawer, Select, MenuItem, Tooltip } from "@mui/material";
import { GET_OPERATIVES } from "../graphql/queries/operatives";
import { useApolloClient, useQuery } from "@apollo/client";
import {
  ASSIGN_TASK,
  CLOSE_TASK,
  GET_TASK,
  GET_TASKS,
} from "../graphql/queries/tasks";
import { useNavigate, useParams } from "react-router-dom";

export const TaskDetailView = () => {
  const { taskId, tenantId } = useParams();
  const { data: operatives } = useQuery(GET_OPERATIVES);
  const navigate = useNavigate();
  const { data } = useQuery(GET_TASK, {
    variables: { id: taskId },
  });
  const task = data?.task;
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
      await client.mutate({
        mutation: ASSIGN_TASK,
        variables: {
          taskId: taskId,
          operativeId: id,
        },
        refetchQueries: [GET_TASKS],
      });
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
      setTaskAssignedOperative({ id: null, name: null });
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer open={Boolean(taskId)} onClose={handleClose} anchor="right">
      {/* {console.log("#### SELECTED TASK", selectedTask)} */}
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
            <Tooltip title="Close Task" placement="top" arrow>
              <button onClick={handleCloseTask}>
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
        </div>

        {task?.createdAt && (
          <div className="mt-auto pt-6 border-t">
            <div className="text-sm text-gray-500">Task created at:</div>
            <div className="text-gray-700">
              {new Date(task?.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
