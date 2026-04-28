# React Todo Application

A modern, high-performance Todo application built with React, TypeScript, and Vite. This project demonstrates best practices in state management, asynchronous data fetching, and component design.

## 🚀 Features

- **Asynchronous Data Fetching**: Powered by **TanStack Query (React Query)** for efficient caching, background updates, and optimistic UI.
- **Global State Management**: Uses **Zustand** with Immer and Persistence middleware for a clean, lightweight store.
- **RESTful API**: Integrated with a JSON-based backend using **json-server**.
- **Modern UI**: Responsive design with CSS modules and React `useTransition` for smooth filter transitions.
- **Type Safety**: Fully typed with TypeScript for a robust developer experience.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Backend**: JSON Server (Mock REST API)
- **Styling**: CSS (Vanilla)
- **Testing**: Vitest, React Testing Library

## 📁 Project Structure

```text
.
├── backend/            # Backend mock server
│   └── db.json         # Database file
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom hooks (Query & Logic)
│   │   ├── services/   # API service layer
│   │   ├── store/      # Zustand store
│   │   └── types.ts    # Shared TypeScript types
│   └── README.md       # Frontend-specific documentation
└── README.md           # Project documentation (this file)
```

## 🏃 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Setup and Run the Backend
The backend uses `json-server` to serve `db.json`.

```bash
cd backend
npx json-server db.json --port 3000
```
The API will be available at `http://localhost:3000/tasks`.

### 3. Setup and Run the Frontend
Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🧪 Testing

To run the frontend tests:

```bash
cd frontend
npm test
```

## 📝 API Endpoints

- `GET /tasks`: Fetch all tasks
- `POST /tasks`: Add a new task
- `PATCH /tasks/:id`: Update a task (e.g., toggle completion)
- `DELETE /tasks/:id`: Delete a task

---
Developed as a demonstration of modern React patterns.
