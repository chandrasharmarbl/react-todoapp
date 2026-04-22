import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders the Todo App heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /todo app/i });
    expect(heading).toBeInTheDocument();
  });
});
