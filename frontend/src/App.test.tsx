import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import AppWithDevTools from './AppWithDevTools';
import * as api from './services/api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('./services/api');

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderApp = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.resetAllMocks();
  });

  it('renders the Todo App heading', async () => {
    vi.mocked(api.fetchTasks).mockResolvedValueOnce([]);
    renderApp();
    const heading = screen.getByRole('heading', { name: /todo app/i });
    expect(heading).toBeInTheDocument();
  });

  it('allows a user to add a new task', async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTasks).mockResolvedValueOnce([]);
    
    renderApp();

    const input = screen.getByPlaceholderText(/add a new task/i);
    const button = screen.getByRole('button', { name: /add task/i });

    // Mock the post request and the subsequent refetch
    vi.mocked(api.addTask).mockResolvedValueOnce({ id: 1, text: 'Buy groceries', completed: false });
    vi.mocked(api.fetchTasks).mockResolvedValueOnce([{ id: 1, text: 'Buy groceries', completed: false }]);

    await user.type(input, 'Buy groceries');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
  });

  it('filters tasks correctly', async () => {
    const user = userEvent.setup();
    vi.mocked(api.fetchTasks).mockResolvedValueOnce([
      { id: 1, text: 'Active Task', completed: false },
      { id: 2, text: 'Completed Task', completed: true },
    ]);

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Active Task')).toBeInTheDocument();
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });

    // Filter by Completed
    const completedFilter = screen.getByRole('button', { name: 'Completed' });
    await user.click(completedFilter);

    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.queryByText('Active Task')).not.toBeInTheDocument();
  });
});

// ─── React Query DevTools ──────────────────────────────────────────────────────
describe('React Query DevTools', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.resetAllMocks();
  });

  it('AppWithDevTools renders the app content correctly', async () => {
    // AppWithDevTools wraps App + ReactQueryDevtools inside a QueryClientProvider.
    // The DevTools panel itself is only visible in development builds, but we
    // can verify the App tree renders as expected.
    vi.mocked(api.fetchTasks).mockResolvedValueOnce([]);
    render(<AppWithDevTools />);
    expect(screen.getByRole('heading', { name: /todo app/i })).toBeInTheDocument();
  });

  it('AppWithDevTools includes ReactQueryDevtools in the component tree', async () => {
    // ReactQueryDevtools injects a button with data-testid="react-query-devtools-panel-toggle-btn"
    // into the document when rendered. We verify it is present after mount.
    vi.mocked(api.fetchTasks).mockResolvedValueOnce([]);
    render(<AppWithDevTools />);

    // The devtools toggle button should be rendered into the document
    const devtoolsToggle = document.querySelector('[aria-label="Open React Query Devtools"]') ||
      document.querySelector('[data-testid="react-query-devtools-panel-toggle-btn"]') ||
      document.querySelector('.tsqd-open-btn');

    expect(devtoolsToggle).not.toBeNull();
  });
});

