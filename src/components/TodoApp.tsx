import React, { useEffect, useState, useCallback } from 'react';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';
import type { Todo } from '../types';

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("mytasks");
    return saved ? JSON.parse(saved) : [];
  });

  const addTask = useCallback((text: string) => {
    const newTask: Todo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const deleteTask = useCallback((index: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== index));
  }, []);

  const toggleComplete = useCallback((index: number) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === index) return { ...task, completed: !task.completed }
      return task;
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem("mytasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const savedTodos = localStorage.getItem("mytasks");
    if (savedTodos) {
      setTasks(JSON.parse(savedTodos));
    }
  }, []);

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <TaskInput onAddTask={addTask} />
      <ul className='task-list'>
        {tasks.map((task: Todo) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleComplete}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  )
}

export default TodoApp;
