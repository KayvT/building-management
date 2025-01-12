import { Operative } from "./operative";

export type Task = {
  id: string;
  location: { name: string; id: string };
  state: string;
  createdAt: string;
  dueAt: string;
  priority: string;
  operative: Operative;
};

export type Tasks = Task[];