import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from './TaskItem';
import { type Todo } from '../types';
import { useToggleTask, useDeleteTask } from '../hooks/useTasks';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../hooks/useTasks', () => ({
  useToggleTask: vi.fn(),
  useDeleteTask: vi.fn(),
}));

describe('TaskItem Component', () => {
  const mockTask: Todo = { id: 1, text: 'Test task', completed: false };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the task', () => {
    vi.mocked(useToggleTask).mockReturnValue({ mutate: vi.fn() } as any);
    vi.mocked(useDeleteTask).mockReturnValue({ mutate: vi.fn() } as any);

    render(<TaskItem task={mockTask} />);
    
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('calls useToggleTask mutate with id and inverted completed status on click', async () => {
    const toggleMutateMock = vi.fn();
    vi.mocked(useToggleTask).mockReturnValue({ mutate: toggleMutateMock } as any);
    vi.mocked(useDeleteTask).mockReturnValue({ mutate: vi.fn() } as any);

    render(<TaskItem task={mockTask} />);

    const taskText = screen.getByText('Test task');
    await userEvent.click(taskText);

    expect(toggleMutateMock).toHaveBeenCalledWith({ id: 1, completed: true });
  });

  it('calls useDeleteTask mutate with id on delete button click', async () => {
    const deleteMutateMock = vi.fn();
    vi.mocked(useToggleTask).mockReturnValue({ mutate: vi.fn() } as any);
    vi.mocked(useDeleteTask).mockReturnValue({ mutate: deleteMutateMock } as any);

    render(<TaskItem task={mockTask} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    expect(deleteMutateMock).toHaveBeenCalledWith(1);
  });
});
