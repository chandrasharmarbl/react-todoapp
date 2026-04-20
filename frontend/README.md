# React Todo App

A simple and intuitive Todo application built with React, TypeScript, and Vite.

## How It Works

The application provides a straightforward interface to manage your daily tasks. You can:
- Add new tasks by typing into the input field and clicking the "Add Task" button.
- Mark tasks as completed by clicking on the task text. Completed tasks will feature a distinct visual style.
- Delete tasks that are no longer needed by clicking the "Delete" button next to the task.

### Data Persistence

The application uses the browser's `localStorage` to save your tasks. This means that even if you close the browser or refresh the page, your tasks will remain intact. When the application loads, it checks `localStorage` for any saved tasks under the key `mytasks` and initializes the state with them. Every time you add, modify, or delete a task, the changes are automatically synchronized back to `localStorage`.

## Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

Ensure you have Node.js and npm installed on your system.

### Installation

1. Clone the repository or navigate to the project directory.
2. Install the required npm packages by running:

```bash
npm install
```

### Development Setup

To run the application in development mode with Hot Module Replacement (HMR), use the following command:

```bash
npm run dev
```

This will start the Vite development server. Open the provided local URL in your browser to view the application. The page will reload automatically if you make edits to the source code.

### Production Setup

To build the application for production, run:

```bash
npm run build
```

This command will use TypeScript to compile the code and Vite to bundle the application into the `dist` directory. The output will be optimized for the best performance.

To preview the production build locally, you can run:

```bash
npm run preview
```
