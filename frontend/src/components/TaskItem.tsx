import React from 'react';
import { type Todo } from '../types';
import { useTodoContext } from '../context/TodoContext';

interface TaskItemProps {
  task: Todo;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, deleteTask } = useTodoContext();

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
