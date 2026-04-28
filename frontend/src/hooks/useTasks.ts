import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, addTask, toggleTask, deleteTask } from '../services/api';
import type { Todo } from '../types';

/** How long cached tasks are considered fresh before a background refetch. */
export const TASKS_STALE_TIME = 30_000; // 30 seconds

/** How long inactive task data is kept in memory before garbage collection. */
export const TASKS_GC_TIME = 5 * 60 * 1_000; // 5 minutes

export const useTasks = () => {
  return useQuery<Todo[], Error>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: TASKS_STALE_TIME,
    gcTime: TASKS_GC_TIME,
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => addTask(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => toggleTask(id, completed),
    onMutate: async (updatedTask) => {
      queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Todo[]>(['tasks']);
      queryClient.setQueryData<Todo[]>(['tasks'], (old) =>
        old?.map((task) =>
          task.id === updatedTask.id ? { ...task, completed: updatedTask.completed } : task
        )
      );
      return { previousTasks };
    },
    onError: (_err, _updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onMutate: async (id) => {
      queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Todo[]>(['tasks']);
      queryClient.setQueryData<Todo[]>(['tasks'], (old) =>
        old?.filter((task) => task.id !== id)
      );
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
