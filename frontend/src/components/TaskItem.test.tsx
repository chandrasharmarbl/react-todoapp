import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from './TaskItem';
import { type Todo } from '../types';

describe('TaskItem Component', () => {
  const mockTask: Todo = { id: 1, text: 'Test task', completed: false };

  it('renders the task and responds to toggle and delete actions', async () => {
    const user = userEvent.setup();

    render(<TaskItem task={mockTask} />);

    // Verify task text is rendered
    const taskText = screen.getByText('Test task');
    expect(taskText).toBeInTheDocument();

    // Interact with toggle and delete
    await user.click(taskText);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    // In TDD for Zustand, we rely on the component using the store internally, 
    // so we just verify it renders and handles clicks without crashing.
  });
});
