// src/store/useTaskStore.ts
import { create } from "zustand";
import { Task } from "../types/task";

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  state: boolean;
  setState(state: boolean): void;
  edit: Task | null;
  setEdit: (task: Task) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  state: false,
  setState: (state) => set({ state }),
  edit: null,
  setEdit: (task) => set({ edit: task }),
}));

export default useTaskStore;
