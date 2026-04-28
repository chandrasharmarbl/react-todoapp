import React, { useTransition } from 'react';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import { useTodoStore, type FilterType } from './store/useTodoStore';
import { useFilteredTasks } from './hooks/useFilteredTasks';
import './App.css';

const App: React.FC = () => {
  const { filter, setFilter } = useTodoStore();
  const { filteredTasks, isLoading, isError } = useFilteredTasks();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (newFilter: FilterType) => {
    startTransition(() => {
      setFilter(newFilter);
    });
  };

  if (isLoading) return <div className="todo-app"><p>Loading tasks…</p></div>;
  if (isError)   return <div className="todo-app"><p>Failed to load tasks. Please try again.</p></div>;

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <TaskInput />

      <div className="filters" style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button onClick={() => handleFilterChange('All')}       className={filter === 'All'       ? 'active' : ''}>All</button>
        <button onClick={() => handleFilterChange('Active')}    className={filter === 'Active'    ? 'active' : ''}>Active</button>
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

export default App;
