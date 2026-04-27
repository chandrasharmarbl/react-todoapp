import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTasks, useAddTask, useToggleTask, useDeleteTask } from './useTasks';
import * as api from '../services/api';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

vi.mock('../services/api');

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('React Query Hooks (useTasks)', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.resetAllMocks();
  });

  it('useTasks fetches tasks', async () => {
    vi.mocked(api.fetchTasks).mockResolvedValueOnce([{ id: 1, text: 'Hooks task', completed: false }]);
    const { result } = renderHook(() => useTasks(), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].text).toBe('Hooks task');
  });

  it('useAddTask mutates and invalidates', async () => {
    vi.mocked(api.addTask).mockResolvedValueOnce({ id: 2, text: 'Mutated', completed: false });
    const { result } = renderHook(() => useAddTask(), { wrapper });
    
    result.current.mutate('Mutated');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.addTask).toHaveBeenCalledWith('Mutated');
  });

  it('useToggleTask mutates and optimistically updates cache', async () => {
    // Pre-populate cache
    queryClient.setQueryData(['tasks'], [{ id: 1, text: 'Mutated', completed: false }]);

    vi.mocked(api.toggleTask).mockResolvedValueOnce({ id: 1, text: 'Mutated', completed: true });
    const { result } = renderHook(() => useToggleTask(), { wrapper });
    
    result.current.mutate({ id: 1, completed: true });

    // Verify optimistic update (cache updated before network resolves)
    const cachedTasks: any = queryClient.getQueryData(['tasks']);
    expect(cachedTasks[0].completed).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.toggleTask).toHaveBeenCalledWith(1, true);
  });

  it('useDeleteTask mutates and optimistically updates cache', async () => {
    // Pre-populate cache
    queryClient.setQueryData(['tasks'], [{ id: 1, text: 'Mutated', completed: false }]);

    vi.mocked(api.deleteTask).mockResolvedValueOnce();
    const { result } = renderHook(() => useDeleteTask(), { wrapper });
    
    result.current.mutate(1);

    // Verify optimistic update (cache updated before network resolves)
    const cachedTasks: any = queryClient.getQueryData(['tasks']);
    expect(cachedTasks).toHaveLength(0);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.deleteTask).toHaveBeenCalledWith(1);
  });
});
