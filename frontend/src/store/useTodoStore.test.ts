import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoStore } from './useTodoStore';

describe('useTodoStore', () => {
  beforeEach(() => {
    useTodoStore.setState({ tasks: [] });
  });

  it('should add a task', () => {
    useTodoStore.getState().addTask('Zustand task');
    const tasks = useTodoStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].text).toBe('Zustand task');
    expect(tasks[0].completed).toBe(false);
  });

  it('should toggle a task', () => {
    useTodoStore.getState().addTask('Toggle me');
    const id = useTodoStore.getState().tasks[0].id;
    useTodoStore.getState().toggleTask(id);
    expect(useTodoStore.getState().tasks[0].completed).toBe(true);
  });

  it('should delete a task', () => {
    useTodoStore.getState().addTask('Delete me');
    const id = useTodoStore.getState().tasks[0].id;
    useTodoStore.getState().deleteTask(id);
    expect(useTodoStore.getState().tasks).toHaveLength(0);
  });
});
