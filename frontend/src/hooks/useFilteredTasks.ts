/**
 * useFilteredTasks
 *
 * Combines React Query (server state) with Zustand (UI filter state) into a
 * single, composable hook. Components should use this hook instead of calling
 * `useTasks` and the Zustand store separately – it is the single source of
 * truth for which tasks are currently visible.
 *
 * Caching: inherits staleTime / gcTime from useTasks (see useTasks.ts).
 */
import { useMemo } from 'react';
import { useTasks } from './useTasks';
import { useTodoStore } from '../store/useTodoStore';
import type { Todo } from '../types';

export interface UseFilteredTasksResult {
  filteredTasks: Todo[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export const useFilteredTasks = (): UseFilteredTasksResult => {
  const { data: tasks = [], isLoading, isSuccess, isError } = useTasks();
  const filter = useTodoStore((state) => state.filter);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'Active':
        return tasks.filter((t) => !t.completed);
      case 'Completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return { filteredTasks, isLoading, isSuccess, isError };
};
