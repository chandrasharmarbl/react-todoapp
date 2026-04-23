import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskInput from './TaskInput';
import { useAddTask } from '../hooks/useTasks';
import { vi } from 'vitest';

vi.mock('../hooks/useTasks', () => ({
  useAddTask: vi.fn(),
}));

describe('TaskInput Component', () => {
  it('renders an input field and an add button', () => {
    vi.mocked(useAddTask).mockReturnValue({ mutate: vi.fn() } as any);
    render(<TaskInput />);

    const input = screen.getByPlaceholderText(/add a new task/i);
    const button = screen.getByRole('button', { name: /add task/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('calls useAddTask mutate with input text when adding a task', async () => {
    const mutateMock = vi.fn();
    vi.mocked(useAddTask).mockReturnValue({ mutate: mutateMock } as any);

    render(<TaskInput />);

    const input = screen.getByPlaceholderText(/add a new task/i);
    const button = screen.getByRole('button', { name: /add task/i });

    await userEvent.type(input, 'Learn React Query');
    await userEvent.click(button);

    expect(mutateMock).toHaveBeenCalledWith('Learn React Query');
    expect(input).toHaveValue('');
  });
});
