import React, { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
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

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <TaskInput onAddTask={addTask} />
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
