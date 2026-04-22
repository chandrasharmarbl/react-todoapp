import { render, screen } from '@testing-library/react';
import TaskInput from './TaskInput';

describe('TaskInput Component', () => {
  it('renders an input field and an add button', () => {
    render(<TaskInput onAddTask={() => { }} />);

    const input = screen.getByPlaceholderText(/add a new task/i);
    const button = screen.getByRole('button', { name: /add task/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});
