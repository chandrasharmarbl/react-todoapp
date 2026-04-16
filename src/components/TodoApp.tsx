import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<Todo[]>([]);

  const addTask = () => {
    if (input.trim() === '') return;
    const newTask: Todo = {
      id: Date.now(),
      text: input,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setInput('');
  }

  const deleteTask = (index: number) => {
    const newTasks = tasks.filter((task, _) => task.id !== index);
    setTasks(newTasks);
  }

  const toggleComplete = (index: number) => {
    const newTasks = tasks.map(task => {
      if (task.id === index) return { ...task, completed: !task.completed }
      return task;
    })
    setTasks(newTasks);
  }

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className='task-list'>
        {tasks.map((task: Todo) => (
          <li key={task.id}>
            <span
              className={`task-text ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleComplete(task.id)}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoApp;
