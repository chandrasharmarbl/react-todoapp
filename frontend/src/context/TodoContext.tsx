import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { Todo } from '../types';

export type FilterType = 'All' | 'Active' | 'Completed';

interface TodoContextType {
  tasks: Todo[];
  filteredTasks: Todo[];
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  addTask: (text: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('todos');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState<FilterType>('All');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((text: string) => {
    setTasks(prev => [...prev, { id: Date.now(), text, completed: false }]);
  }, []);

  const toggleTask = useCallback((id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'Active': return tasks.filter(t => !t.completed);
      case 'Completed': return tasks.filter(t => t.completed);
      default: return tasks;
    }
  }, [tasks, filter]);

  return (
    <TodoContext.Provider value={{ tasks, filteredTasks, filter, setFilter, addTask, toggleTask, deleteTask }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodoContext must be used within TodoProvider');
  return context;
};
