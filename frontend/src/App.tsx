import React from 'react';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import { TodoProvider, useTodoContext } from './context/TodoContext';
import './App.css';

const TodoListApp: React.FC = () => {
  const { filteredTasks, filter, setFilter } = useTodoContext();

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <TaskInput />
      
      <div className="filters" style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('Active')} className={filter === 'Active' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TodoProvider>
      <TodoListApp />
    </TodoProvider>
  );
};

export default App;
