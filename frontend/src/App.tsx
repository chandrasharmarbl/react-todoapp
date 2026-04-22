import React, { useTransition } from 'react';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import { TodoProvider, useTodoContext, type FilterType } from './context/TodoContext';
import './App.css';

const TodoListApp: React.FC = () => {
  const { filteredTasks, filter, setFilter } = useTodoContext();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (newFilter: FilterType) => {
    startTransition(() => {
      setFilter(newFilter);
    });
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <TaskInput />
      
      <div className="filters" style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button onClick={() => handleFilterChange('All')} className={filter === 'All' ? 'active' : ''}>All</button>
        <button onClick={() => handleFilterChange('Active')} className={filter === 'Active' ? 'active' : ''}>Active</button>
        <button onClick={() => handleFilterChange('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
      </div>

      <ul className="task-list" style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
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
