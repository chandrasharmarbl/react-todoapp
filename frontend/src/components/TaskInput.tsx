import React from 'react';

const TaskInput: React.FC = () => {
  return (
    <div className="input-container">
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Add a new task"
          style={{ flexGrow: 1 }}
        />
        <button>Add Task</button>
      </div>
    </div>
  );
};

export default TaskInput;
