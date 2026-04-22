import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TaskItem from './TaskItem';
import { type Todo } from '../types';

describe('TaskItem Component', () => {
  const mockTask: Todo = { id: 1, text: 'Test task', completed: false };

  it('renders the task and responds to toggle and delete actions', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Verify task text is rendered
    const taskText = screen.getByText('Test task');
    expect(taskText).toBeInTheDocument();

    // Verify toggle action
    await user.click(taskText);
    expect(mockOnToggle).toHaveBeenCalledWith(mockTask.id);

    // Verify delete action
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });
});
