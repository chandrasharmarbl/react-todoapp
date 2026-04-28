/**
 * TDD – Failing tests for React Query + Zustand integration
 *
 * Feature: useFilteredTasks hook
 * - Combines React Query's cached server data with the Zustand `filter` slice.
 * - The hook is the single source of truth for what tasks are visible in the UI.
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFilteredTasks } from './useFilteredTasks';
import { useTodoStore } from '../store/useTodoStore';
import * as api from '../services/api';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';

vi.mock('../services/api');

let queryClient: QueryClient;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const TASKS = [
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Write tests', completed: true },
  { id: 3, text: 'Ship feature', completed: false },
];

describe('useFilteredTasks – React Query + Zustand integration', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    // Reset Zustand filter to default
    useTodoStore.setState({ filter: 'All' });
    vi.resetAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('returns all tasks when Zustand filter is "All"', async () => {
    vi.mocked(api.fetchTasks).mockResolvedValueOnce(TASKS);
    useTodoStore.setState({ filter: 'All' });

    const { result } = renderHook(() => useFilteredTasks(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.filteredTasks).toHaveLength(3);
  });

  it('returns only active tasks when Zustand filter is "Active"', async () => {
    vi.mocked(api.fetchTasks).mockResolvedValueOnce(TASKS);
    useTodoStore.setState({ filter: 'Active' });

    const { result } = renderHook(() => useFilteredTasks(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.filteredTasks).toHaveLength(2);
    expect(result.current.filteredTasks.every((t) => !t.completed)).toBe(true);
  });

  it('returns only completed tasks when Zustand filter is "Completed"', async () => {
    vi.mocked(api.fetchTasks).mockResolvedValueOnce(TASKS);
    useTodoStore.setState({ filter: 'Completed' });

    const { result } = renderHook(() => useFilteredTasks(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].text).toBe('Write tests');
  });

  it('re-filters automatically when Zustand filter changes after mount', async () => {
    vi.mocked(api.fetchTasks).mockResolvedValueOnce(TASKS);
    useTodoStore.setState({ filter: 'All' });

    const { result } = renderHook(() => useFilteredTasks(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.filteredTasks).toHaveLength(3);

    // Change filter via Zustand – hook should react without remounting
    useTodoStore.getState().setFilter('Completed');

    await waitFor(() => expect(result.current.filteredTasks).toHaveLength(1));
    expect(result.current.filteredTasks[0].text).toBe('Write tests');
  });

  it('exposes isLoading from React Query while fetching', () => {
    // Never resolve – keep it in loading state
    vi.mocked(api.fetchTasks).mockReturnValueOnce(new Promise(() => {}));

    const { result } = renderHook(() => useFilteredTasks(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.filteredTasks).toEqual([]);
  });

  it('exposes isError from React Query on fetch failure', async () => {
    vi.mocked(api.fetchTasks).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useFilteredTasks(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.filteredTasks).toEqual([]);
  });
});
