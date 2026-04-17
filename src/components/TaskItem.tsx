import React from 'react';
import type { Todo } from '../types';
import { useTodoStore } from '../store/useTodoStore';

interface TaskItemProps {
  task: Todo;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const deleteTask = useTodoStore((state) => state.deleteTask);

  return (
    <li>
      <span
        className={`task-text ${task.completed ? 'completed' : ''}`}
        onClick={() => toggleComplete(task.id)}
      >
        {task.text}
      </span>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
};

export default TaskItem;
