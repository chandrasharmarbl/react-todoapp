import React from 'react';
import { type Todo } from '../types';
import { useToggleTask, useDeleteTask } from '../hooks/useTasks';

interface TaskItemProps {
  task: Todo;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { mutate: toggleTask } = useToggleTask();
  const { mutate: deleteTask } = useDeleteTask();

  return (
    <li>
      <span
        className={`task-text ${task.completed ? 'completed' : ''}`}
        onClick={() => toggleTask({ id: task.id, completed: !task.completed })}
        style={{ cursor: 'pointer', flexGrow: 1 }}
      >
        {task.text}
      </span>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
};

export default TaskItem;
