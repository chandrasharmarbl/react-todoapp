# React Todo Application

This project is a React-based Todo application that demonstrates various state management techniques and architectural evolutions in a frontend application, integrated with a mock backend.

## Project Evolution

This application was intentionally built in stages to showcase and solve common state management challenges in React:

### Phase 1: Local Component State
The application started as a plain React application. All state was managed in the root component using native `useState` hooks to hold the array of Todos. We passed this array and its associated handler functions down to child components via props. As the component hierarchy grew, this resulted in extensive prop drilling.

### Phase 2: Local Storage Persistence
To make the application more practical, we introduced data persistence using the browser's `localStorage` API, tightly synchronized via `useEffect`. This allowed the user's tasks to survive page reloads and browser closures.

### Phase 3: Global State Management (Zustand)
To solve the prop drilling issues from Phase 1, we introduced Zustand. We moved all the Todo data, functions (add, delete, toggle), and the `localStorage` persistence logic into a single, centralized global store. This allowed any component deeply nested in the tree to access tasks and perform actions directly without relying on bloated props from parent components.

### Phase 4: Server State Management (TanStack React Query)
In the final phase, we transitioned from isolated local storage to a client-server architecture:
- We set up a mock backend REST API using `json-server` to act as our remote database.
- We introduced TanStack React Query to handle server state, caching, and data fetching (`useQuery`).
- Mutations to the database (`add`, `delete`, `toggle`) were migrated to `useMutation`.
- We implemented Optimistic Updates for task toggling to ensure the UI feels instantly responsive, even while network operations execute in the background.
- With React Query taking over the complex array management and caching responsibilities, our Zustand store was significantly simplified. Zustand is now used strictly to hold the transient state of the Task Input field across our components, separating global UI state from global server state.

## Running the Application

This project requires two separate terminals to run correctly, as both the frontend application and the backend mock server must be active concurrently.

### 1. Start the Backend API
Start the `json-server` from the root of the project to serve the mock database.
```bash
npx json-server --watch backend/db.json --port 3000
```
This API will be exposed at `http://localhost:3000/todos`.

### 2. Start the Frontend Application
Open a second terminal, navigate into the frontend directory, install dependencies if you haven't already, and start the Vite development server.
```bash
cd frontend
npm install
npm run dev
```
The application will launch and is typically accessible at `http://localhost:5173/`.
