import React, { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import { Todo } from './types';
import './App.css';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('todos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string) => {
    const newTask: Todo = { id: Date.now(), text, completed: false };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <TaskInput onAddTask={addTask} />
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggle={toggleTask} 
            onDelete={deleteTask} 
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
