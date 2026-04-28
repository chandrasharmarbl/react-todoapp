import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTasks, useAddTask, useToggleTask, useDeleteTask, TASKS_STALE_TIME, TASKS_GC_TIME } from './useTasks';
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

// ─── Caching Strategies ───────────────────────────────────────────────────────
describe('Caching strategies and stale time', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.resetAllMocks();
  });

  it('exports TASKS_STALE_TIME constant (30 seconds)', () => {
    // Tests that staleTime is exported and has the expected value so other
    // consumers (e.g. QueryClient default config) can reuse it.
    expect(TASKS_STALE_TIME).toBe(30_000);
  });

  it('exports TASKS_GC_TIME constant (5 minutes)', () => {
    // gcTime controls how long inactive query data stays in memory before
    // being garbage-collected.
    expect(TASKS_GC_TIME).toBe(5 * 60 * 1_000);
  });

  it('useTasks does NOT refetch when cache is still fresh (within staleTime)', async () => {
    // Seed the cache with fresh data
    queryClient.setQueryData(['tasks'], [{ id: 1, text: 'Cached task', completed: false }]);

    vi.mocked(api.fetchTasks).mockResolvedValueOnce([{ id: 99, text: 'New from server', completed: false }]);

    // Mount the hook – because data is fresh, fetchTasks should NOT be called
    const { result } = renderHook(() => useTasks(), { wrapper });

    // Data should come straight from cache
    expect(result.current.data).toEqual([{ id: 1, text: 'Cached task', completed: false }]);
    expect(api.fetchTasks).not.toHaveBeenCalled();
  });

  it('useTasks refetches when cached data is stale', async () => {
    // Mark the data as stale by setting updatedAt in the past
    queryClient.setQueryData(['tasks'], [{ id: 1, text: 'Old task', completed: false }]);
    // Force the query to be stale by setting its dataUpdatedAt to far in the past
    const queryCache = queryClient.getQueryCache();
    const query = queryCache.find({ queryKey: ['tasks'] });
    if (query) {
      // Manually override internal timestamp to make data stale
      (query as any).state.dataUpdatedAt = Date.now() - (TASKS_STALE_TIME + 1_000);
    }

    vi.mocked(api.fetchTasks).mockResolvedValueOnce([{ id: 2, text: 'Fresh task', completed: false }]);

    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // fetchTasks should have been called because the cache was stale
    expect(api.fetchTasks).toHaveBeenCalledTimes(1);
  });

  it('useTasks passes correct staleTime and gcTime options', async () => {
    vi.mocked(api.fetchTasks).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useTasks(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Retrieve the active query from the cache and verify options
    const query = queryClient.getQueryCache().find({ queryKey: ['tasks'] });
    expect((query?.options as any).staleTime).toBe(TASKS_STALE_TIME);
    expect((query?.options as any).gcTime).toBe(TASKS_GC_TIME);
  });
});
