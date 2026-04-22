import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { type Todo } from '../types';

export type FilterType = 'All' | 'Active' | 'Completed';

interface TodoState {
  tasks: Todo[];
  filter: FilterType;
  addTask: (text: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  setFilter: (filter: FilterType) => void;
  fetchTasks: () => Promise<void>;
}

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      immer((set) => ({
        tasks: [],
        filter: 'All',
        addTask: (text) => set((state) => {
          state.tasks.push({ id: Date.now(), text, completed: false });
        }),
        toggleTask: (id) => set((state) => {
          const task = state.tasks.find(t => t.id === id);
          if (task) task.completed = !task.completed;
        }),
        deleteTask: (id) => set((state) => {
          state.tasks = state.tasks.filter(t => t.id !== id);
        }),
        setFilter: (filter) => set((state) => {
          state.filter = filter;
        }),
        fetchTasks: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          set((state) => {
            state.tasks = [{ id: Date.now(), text: 'Fetched Task', completed: false }];
          });
        }
      })),
      {
        name: 'mytasks-zustand',
      }
    )
  )
);
