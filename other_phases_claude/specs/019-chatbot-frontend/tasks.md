# Phase III Todo AI Chatbot Frontend - Tasks

## Phase 1: Environment & Setup
- [X] Create a Next.js project
- [X] Install dependencies: `@openai/chatkit-react`, `lucide-react`
- [X] Configure `next.config.js` to allow OpenAI domains if necessary
- [X] Setup `.env.local` with `NEXT_PUBLIC_BACKEND_URL`

## Phase 2: Core Chat Interface
- [X] Implement `ChatKitWidget` component
- [X] Integrate `useChatKit` hook
- [X] Define the `api` configuration in `useChatKit` to point to FastAPI `/api/{user_id}/chat` endpoint
- [X] Implement a custom `fetch` handler to manage stateless requests, sending `conversation_id` and `user_id`

## Phase 3: Theming & UX
- [X] Apply "Todo App" theme (blue/slate grayscale)
- [X] Add starter prompts for common todo actions (e.g., "Add a task to buy groceries")
- [X] Add a floating toggle button for the chat interface

## Phase 4: Integration & Testing
- [X] Connect frontend to local FastAPI server
- [X] Verify conversation history persistence using `conversation_id`
- [X] Test message streaming and MCP tool invocation visualization
- [X] Ensure UI handles stateless interactions correctly
