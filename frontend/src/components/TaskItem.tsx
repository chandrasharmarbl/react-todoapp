import React from 'react';
import { type Todo } from '../types';
import { useTodoStore } from '../store/useTodoStore';

interface TaskItemProps {
  task: Todo;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const toggleTask = useTodoStore((state) => state.toggleTask);
  const deleteTask = useTodoStore((state) => state.deleteTask);

  return (
    <li>
      <span
        className={`task-text ${task.completed ? 'completed' : ''}`}
        onClick={() => toggleTask(task.id)}
        style={{ cursor: 'pointer', flexGrow: 1 }}
      >
        {task.text}
      </span>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
};

export default TaskItem;
