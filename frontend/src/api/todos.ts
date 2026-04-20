import type { Todo } from '../types';

const API_BASE_URL = 'http://localhost:3000/todos';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
};

export const addTodo = async (text: string): Promise<Todo> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: Date.now(),
      text,
      completed: false,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to add todo');
  }
  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};

export const toggleTodoComplete = async ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  return response.json();
};
