import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Todo } from '../types';

interface TodoState {
  tasks: Todo[];
  addTask: (text: string) => void;
  deleteTask: (id: number) => void;
  toggleComplete: (id: number) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (text) => set((state) => ({
        tasks: [...state.tasks, { id: Date.now(), text, completed: false }]
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id)
      })),
      toggleComplete: (id) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      }))
    }),
    {
      name: 'mytasks-zustand', // The key in localStorage
    }
  )
);
