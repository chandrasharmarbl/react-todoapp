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
});

