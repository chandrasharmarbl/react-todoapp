import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTodoStore } from '../store/useTodoStore';
import { addTodo } from '../api/todos';

const TaskInput: React.FC = () => {
  const taskInput = useTodoStore((state) => state.taskInput);
  const setTaskInput = useTodoStore((state) => state.setTaskInput);
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTaskInput('');
    },
  });

  const handleAdd = () => {
    if (taskInput.trim() === '') return;
    addMutation.mutate(taskInput);
  };

  return (
    <div className="input-container">
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Add a new task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          disabled={addMutation.isPending}
          style={{ flexGrow: 1 }}
        />
        <button onClick={handleAdd} disabled={addMutation.isPending}>
          {addMutation.isPending ? 'Adding...' : 'Add Task'}
        </button>
      </div>
      {addMutation.isError && <div style={{ color: 'red', marginTop: '5px' }}>Error adding task.</div>}
    </div>
  );
};

export default TaskInput;
