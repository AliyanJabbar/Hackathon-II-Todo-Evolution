---
id: 0007
title: "Connect frontend Next.js and backend FastAPI with API integration"
stage: "spec"
date: "2025-12-21"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "007-frontend-backend-integration"
branch: "001-frontend-backend-integration"
user: "Aliyan Jabbar"
command: "/sp.specify connect the frontend (Next.js) and backend (Fastapi) use the context7 mcp to get their updated documentation. For this you have to setup the BACKEND_URL in .env.local of frontend folder in phase-II, then use that BACKEND_URL to make api calls. The details of APIs are in the backend folder of phase-II in file of main.py."
labels: ["integration", "api", "frontend", "backend", "nextjs", "fastapi"]
links:
  spec: "specs/007-frontend-backend-integration/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "specs/007-frontend-backend-integration/spec.md"
  - "specs/007-frontend-backend-integration/checklists/requirements.md"
  - "frontend/.env.local"
  - "frontend/src/services/api.ts"
  - "frontend/src/components/home/demo-section.tsx"
  - "backend/main.py"
tests: []
outcome: "Successfully created specification for frontend-backend integration, implemented API service to connect Next.js frontend with FastAPI backend, added CORS middleware to backend, and updated the Kanban board component to use backend API for todo operations."
evaluation: "The implementation successfully connects the frontend and backend, allowing CRUD operations on todo items through the API. The API service properly handles all required endpoints (GET, POST, PUT, DELETE) and the frontend component now uses backend data instead of local state."
---

# Connect frontend Next.js and backend FastAPI with API integration

## User Input
connect the frontend (Next.js) and backend (Fastapi) use the context7 mcp to get their updated documentation. For this you have to setup the BACKEND_URL in .env.local of frontend folder in phase-II, then use that BACKEND_URL to make api calls. The details of APIs are in the backend folder of phase-II in file of main.py.

## Response Summary
Successfully implemented the integration between the Next.js frontend and FastAPI backend by:

1. Created a comprehensive specification for the frontend-backend integration
2. Set up the BACKEND_URL in frontend/.env.local
3. Created an API service (frontend/src/services/api.ts) to handle all API calls to the backend
4. Updated the demo-section.tsx component to use backend data instead of local state
5. Added CORS middleware to the backend to allow frontend API calls
6. Implemented full CRUD functionality (create, read, update, delete) for todo items

The Kanban board now properly syncs with the backend API, allowing users to create, move, and delete tasks that are persisted in the database.

## Key Changes
- Created API service with functions for getTodos, createTodo, updateTodo, and deleteTodo
- Updated the demo section to fetch and sync data with the backend
- Added CORS middleware to FastAPI backend
- Modified drag-and-drop functionality to update backend when tasks are moved between columns
- Added proper error handling for API calls