import React, { useState, useMemo, useCallback } from 'react';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import { useTodos } from './hooks/useTodos';
import './App.css';

type FilterType = 'All' | 'Active' | 'Completed';

const App: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTodos();
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'Active': return tasks.filter(t => !t.completed);
      case 'Completed': return tasks.filter(t => t.completed);
      default: return tasks;
    }
  }, [tasks, filter]);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <TaskInput onAddTask={addTask} />
      
      <div className="filters" style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button onClick={() => handleFilterChange('All')} className={filter === 'All' ? 'active' : ''}>All</button>
        <button onClick={() => handleFilterChange('Active')} className={filter === 'Active' ? 'active' : ''}>Active</button>
        <button onClick={() => handleFilterChange('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task) => (
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
