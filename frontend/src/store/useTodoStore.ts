import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Todo } from '../types';

export type FilterType = 'All' | 'Active' | 'Completed';

interface TodoState {
  tasks: Todo[];
  filter: FilterType;
  addTask: (text: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  setFilter: (filter: FilterType) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      tasks: [],
      filter: 'All',
      addTask: (text) => set((state) => ({
        tasks: [...state.tasks, { id: Date.now(), text, completed: false }]
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      setFilter: (filter) => set({ filter }),
    }),
    {
      name: 'mytasks-zustand',
    }
  )
);
