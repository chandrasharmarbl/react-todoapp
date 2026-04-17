import React, { useEffect, useState, useCallback, useMemo } from 'react';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';
import type { Todo } from '../types';

type FilterType = 'all' | 'active' | 'completed';

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("mytasks");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filter, setFilter] = useState<FilterType>('all');

  const addTask = useCallback((text: string) => {
    const newTask: Todo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const deleteTask = useCallback((index: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== index));
  }, []);

  const toggleComplete = useCallback((index: number) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === index) return { ...task, completed: !task.completed }
      return task;
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem("mytasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const savedTodos = localStorage.getItem("mytasks");
    if (savedTodos) {
      setTasks(JSON.parse(savedTodos));
    }
  }, []);

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
      <TaskInput onAddTask={addTask} />
      <ul className='task-list'>
        {filteredTasks.map((task: Todo) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleComplete}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  )
}

export default TodoApp;
