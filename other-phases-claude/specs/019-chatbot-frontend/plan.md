# Phase III Frontend Implementation Plan

## Phase 1: Environment & Setup
1. Create a Next.js project.
2. Install dependencies: `@openai/chatkit-react`, `lucide-react`.
3. Configure `next.config.js` to allow OpenAI domains if necessary.
4. Setup `.env.local` with Backend URL and ChatKit keys.

## Phase 2: Core Chat Interface
1. Implement `ChatKitWidget` component.
2. Integrate the `useChatKit` hook.
3. Define the `api` configuration in `useChatKit` to point to the FastAPI `/api/chat` endpoint.
4. Implement a custom `fetch` handler to manage the stateless request cycle (sending `conversation_id` and `user_id`).

## Phase 3: Theming & UX
1. Apply a "Todo App" theme (blue/slate grayscale).
2. Add starter prompts for common todo actions.
3. Add a floating toggle button for the chat interface.

## Phase 4: Integration & Testing
1. Connect to the local FastAPI server.
2. Verify conversation history persistence via the `conversation_id`.