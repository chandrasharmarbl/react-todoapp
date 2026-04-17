import React, { useState, useMemo } from 'react';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';
import type { Todo } from '../types';
import { useTodoStore } from '../store/useTodoStore';

type FilterType = 'all' | 'active' | 'completed';

const TodoApp: React.FC = () => {
  const tasks = useTodoStore((state) => state.tasks);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter(task => !task.completed);
    if (filter === 'completed') return tasks.filter(task => task.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <div className="filter-container" style={{ marginBottom: '15px' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
        >
          <option value="all">All Tasks</option>
          <option value="active">Active Tasks</option>
          <option value="completed">Completed Tasks</option>
        </select>
      </div>
      <TaskInput />
      <ul className='task-list'>
        {filteredTasks.map((task: Todo) => (
          <TaskItem
            key={task.id}
            task={task}
          />
        ))}
      </ul>
    </div>
  )
}

export default TodoApp;
