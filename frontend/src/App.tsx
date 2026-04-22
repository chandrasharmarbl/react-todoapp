import React from 'react';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import { useTodos } from './hooks/useTodos';
import './App.css';

const App: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTodos();

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
