import { Task } from "@/types/tasks";

export const getPriorityColor = (priority: string) => {
  const priorityOrder = {
    LOW: "bg-green-500",
    MEDIUM: "bg-yellow-500",
    HIGH: "bg-orange-500",
    URGENT: "bg-red-500",
  };
  return priorityOrder[priority as keyof typeof priorityOrder];
};

export const getLocationHighestPriority = (
  tasksData: { tasks: Task[] },
  locationId: string | undefined
) => {
  if (!tasksData?.tasks || !locationId) return null;

  const locationTasks = tasksData.tasks.filter(
    (task: Task) => task.location.id === locationId
  );

  if (locationTasks.length === 0) return null;

  const priorityOrder = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    URGENT: 4,
  };

  return locationTasks.reduce((highest: string, task: Task) => {
    const currentPriority =
      priorityOrder[task.priority as keyof typeof priorityOrder];
    const highestPriority =
      priorityOrder[highest as keyof typeof priorityOrder];
    return currentPriority > highestPriority ? task.priority : highest;
  }, "LOW");
};
