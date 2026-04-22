import React from 'react';
import TaskInput from './components/TaskInput';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <TaskInput />
    </div>
  );
};

export default App;
