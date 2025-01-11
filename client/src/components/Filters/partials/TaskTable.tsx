import React, { useState } from "react";
import { Drawer } from "@mui/material";
type TaskTableProps = {
  tasks: {
    id: string;
    location: { name: string; id: string };
    state: string;
    createdAt: string;
    dueAt: string;
    priority: string;
    operative: { id: string; name: string };
  }[];
};
export default function TaskTable({ tasks }: TaskTableProps) {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<
    TaskTableProps["tasks"][0] | null
  >(null);

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-400 border-b">
            <th className="p-3 text-center text-white">Location</th>
            <th className="p-3 text-center text-white">Priority</th>
            <th className="p-3 text-center text-white">Created</th>
            <th className="p-3 text-center text-white">Due Date</th>
            <th className="p-3 text-center text-white">State</th>
            <th className="p-3 text-center text-white">Operative</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              onClick={() => {
                setSelectedTask(task);
                setOpenTaskModal(true);
              }}
              className="border-b hover:bg-gray-200 transition-all duration-300 cursor-pointer"
            >
              <td className="p-3 text-center">{task?.location?.name}</td>
              <td className="p-3 text-center">
                {task?.priority === "LOW" ? (
                  <span className="bg-green-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                    {task?.priority}
                  </span>
                ) : task?.priority === "MEDIUM" ? (
                  <span className="bg-yellow-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                    {task?.priority}
                  </span>
                ) : task?.priority === "URGENT" ? (
                  <span className="bg-red-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                    {task?.priority}
                  </span>
                ) : (
                  <span className="bg-purple-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                    {task?.priority}
                  </span>
                )}
              </td>
              <td className="p-3 text-center">
                {new Date(task?.createdAt).toLocaleString()}
              </td>
              <td className="p-3 text-center">
                {new Date(task?.dueAt).toLocaleString()}
              </td>
              <td className="p-3 text-center">
                {task?.state === "OPEN" ? (
                  <span className="bg-[#ECFBF3] text-[#254C3A] text-xs font-medium me-2 px-2.5 py-0.5 rounded-full border border-[#254C3A]">
                    Open
                  </span>
                ) : (
                  <span className="bg-[#FFF0EC] text-[#5F1908] text-xs font-medium me-2 px-2.5 py-0.5 rounded-full border border-[#5F1908]">
                    CLOSED
                  </span>
                )}
              </td>
              <td className="p-3 text-center">
                <div>
                  {task?.operative?.id ? (
                    <span className="text-gray-600">{`${task?.operative?.name} || ${task?.operative?.id}`}</span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Drawer
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        anchor="right"
      >
        <div
          style={{
            width: "300px",
          }}
        >
          <div>{selectedTask?.id}</div>
          <div>{selectedTask?.location.name}</div>
          <div>{selectedTask?.state}</div>
          <div>{selectedTask?.createdAt}</div>
          <div>{selectedTask?.dueAt}</div>
          <div>{selectedTask?.priority}</div>
          <div>{selectedTask?.operative?.name}</div>
        </div>
      </Drawer>
    </div>
  );
}
