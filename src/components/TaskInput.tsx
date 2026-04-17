import React, { useState } from 'react';
import { useTodoStore } from '../store/useTodoStore';

const TaskInput: React.FC = () => {
  const [input, setInput] = useState('');
  const addTask = useTodoStore((state) => state.addTask);

  const handleAdd = () => {
    if (input.trim() === '') return;
    addTask(input);
    setInput('');
  };

  return (
    <div className="input-container">
      <input
        type="text"
        placeholder="Add a new task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAdd}>Add Task</button>
    </div>
  );
};

export default TaskInput;
