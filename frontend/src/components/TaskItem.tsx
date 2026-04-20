import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Todo } from '../types';
import { deleteTodo, toggleTodoComplete } from '../api/todos';

interface TaskItemProps {
  task: Todo;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: toggleTodoComplete,
    onMutate: async (updatedTodoReq) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData<Todo[]>(['todos'], (old) => {
        if (!old) return old;
        return old.map((t) =>
          t.id === updatedTodoReq.id ? { ...t, completed: updatedTodoReq.completed } : t
        );
      });

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <li>
      <span
        className={`task-text ${task.completed ? 'completed' : ''}`}
        onClick={() => toggleMutation.mutate({ id: task.id, completed: !task.completed })}
        style={{ cursor: 'pointer', flexGrow: 1 }}
      >
        {task.text}
      </span>
      <button
        onClick={() => deleteMutation.mutate(task.id)}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? '...' : 'Delete'}
      </button>
    </li>
  );
};

export default TaskItem;
