import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type FilterType = 'All' | 'Active' | 'Completed';

interface TodoState {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      immer((set) => ({
        filter: 'All',
        setFilter: (filter) => set((state) => {
          state.filter = filter;
        }),
      })),
      {
        name: 'mytodo-filter-zustand',
      }
    )
  )
);
