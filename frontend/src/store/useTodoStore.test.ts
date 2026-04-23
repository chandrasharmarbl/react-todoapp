import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoStore } from './useTodoStore';

describe('useTodoStore', () => {
  beforeEach(() => {
    useTodoStore.setState({ filter: 'All' });
    localStorage.clear();
  });

  it('should update filter state', () => {
    useTodoStore.getState().setFilter('Completed');
    expect(useTodoStore.getState().filter).toBe('Completed');
  });

  it('should persist filter to localStorage', () => {
    useTodoStore.getState().setFilter('Active');
    const saved = localStorage.getItem('mytodo-filter-zustand');
    expect(saved).not.toBeNull();
    expect(saved).toContain('Active');
  });
});
