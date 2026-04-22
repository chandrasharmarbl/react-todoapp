import React, { useState } from 'react';
import { useTodoStore } from '../store/useTodoStore';

const TaskInput: React.FC = () => {
  const addTask = useTodoStore((state) => state.addTask);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim() === '') return;
    addTask(text);
    setText('');
  };

  return (
    <div className="input-container">
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Add a new task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <button onClick={handleAdd}>Add Task</button>
      </div>
    </div>
  );
};

export default TaskInput;
