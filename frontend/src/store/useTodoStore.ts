import { create } from 'zustand';

interface TodoState {
  taskInput: string;
  setTaskInput: (text: string) => void;
}

export const useTodoStore = create<TodoState>()((set) => ({
  taskInput: '',
  setTaskInput: (text) => set({ taskInput: text }),
}));
