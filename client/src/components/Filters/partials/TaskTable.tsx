import { Task } from "@/types/tasks";
import { Tasks } from "@/types/tasks";
import { useNavigate, useParams } from "react-router-dom";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

type TaskTableProps = {
  tasks: Tasks;
};

export default function TaskTable({ tasks }: TaskTableProps) {
  const navigate = useNavigate();

  const { tenantId } = useParams();

  const handleTaskClick = (task: Task) => {
    navigate(`/${tenantId}/tasks/${task.id}`);
  };

  const getTaskPriorityTag = (priority: string) => {
    switch (priority) {
      case "LOW":
        return (
          <span className="bg-green-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            {priority}
          </span>
        );
      case "MEDIUM":
        return (
          <span className="bg-yellow-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            {priority}
          </span>
        );
      case "URGENT":
        return (
          <span className="bg-red-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            {priority}
          </span>
        );
      default:
        return (
          <span className="bg-purple-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            {priority}
          </span>
        );
    }
  };
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-400 border-b">
            <th className="p-3 text-center text-white">ID</th>
            <th className="p-3 text-center text-white">Location</th>
            <th className="p-3 text-center text-white">Priority</th>
            <th className="p-3 text-center text-white">Created</th>
            <th className="p-3 text-center text-white">Due Date</th>
            <th className="p-3 text-center text-white">State</th>
            <th className="p-3 text-center text-white">Operative</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="border-b hover:bg-gray-200 transition-all duration-300 cursor-pointer"
              >
                <td className="p-3 text-center text-gray-500">{task?.id}</td>
                <td className="p-3 text-center">{task?.location?.name}</td>
                <td className="p-3 text-center">
                  {getTaskPriorityTag(task?.priority)}
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
                <td className="p-3">
                  <div className="flex items-center justify-center">
                    {task?.operative?.id ? (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "#755596",
                        }}
                      >
                        <div className="text-white font-bold">
                          {task?.operative?.name?.slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        <PersonAddAltIcon />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-3 text-center">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
