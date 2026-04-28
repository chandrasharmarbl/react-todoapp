import { type Todo } from '../types';

const API_URL = 'http://localhost:3000/tasks';

export const fetchTasks = async (): Promise<Todo[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const addTask = async (text: string): Promise<Todo> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, completed: false }),
  });
  if (!response.ok) {
    throw new Error('Failed to add task');
  }
  return response.json();
};

export const toggleTask = async (id: number, completed: boolean): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle task');
  }
  return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};
