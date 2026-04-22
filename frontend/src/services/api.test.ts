import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTasks, addTask, toggleTask, deleteTask } from './api';

global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetchTasks calls the correct URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, text: 'Test task', completed: false }]
    } as Response);
    
    const data = await fetchTasks();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/tasks');
    expect(data).toHaveLength(1);
    expect(data[0].text).toBe('Test task');
  });

  it('addTask sends a POST request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 2, text: 'New task', completed: false })
    } as Response);
    
    await addTask('New task');
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/tasks', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ text: 'New task', completed: false })
    }));
  });

  it('toggleTask sends a PATCH request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, text: 'Test task', completed: true })
    } as Response);
    
    await toggleTask(1, true);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/tasks/1', expect.objectContaining({
      method: 'PATCH',
      body: JSON.stringify({ completed: true })
    }));
  });

  it('deleteTask sends a DELETE request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
    } as Response);
    
    await deleteTask(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/tasks/1', expect.objectContaining({
      method: 'DELETE'
    }));
  });
});
