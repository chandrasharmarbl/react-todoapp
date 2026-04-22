import React, { useState } from 'react';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim() === '') return;
    onAddTask(text);
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
