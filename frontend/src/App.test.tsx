import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  it('renders the Todo App heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /todo app/i });
    expect(heading).toBeInTheDocument();
  });

  it('allows a user to add a new task', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new task/i);
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'Buy groceries');
    await user.click(button);

    // Verify the new task is rendered
    const taskText = screen.getByText('Buy groceries');
    expect(taskText).toBeInTheDocument();
  });

  it('filters tasks correctly', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new task/i);
    const button = screen.getByRole('button', { name: /add task/i });

    // Add 'Active Task'
    await user.type(input, 'Active Task');
    await user.click(button);

    // Add 'Completed Task'
    await user.type(input, 'Completed Task');
    await user.click(button);

    // Toggle 'Completed Task' to mark as done
    const completedTaskText = screen.getByText('Completed Task');
    await user.click(completedTaskText);

    // Filter by Completed
    const completedFilter = screen.getByRole('button', { name: 'Completed' });
    await user.click(completedFilter);

    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.queryByText('Active Task')).not.toBeInTheDocument();
  });
});

