# Specification: Phase III Todo AI Chatbot Frontend

## Overview
A Next.js-based frontend using OpenAI ChatKit to provide a natural language interface for managing todos. The UI will communicate with a stateless FastAPI backend.

## Requirements
- **Framework**: Next.js (App Router).
- **UI Library**: OpenAI ChatKit (`@openai/chatkit-react`).
- **Communication**: 
  - The UI must handle message streaming and tool-call visualizations natively via ChatKit.
  - It must connect to the backend's `/api/{user_id}/chat` endpoint.
- **Features**:
  - Floating chat widget or full-page chat interface.
  - Support for "Starter Prompts" (e.g., "Add a task to buy groceries").
  - Persistent conversation state using `conversation_id`.
  - Display of MCP tool invocations (task creation, completion, etc.).

## Components
- `ChatInterface`: The main wrapper for the `<ChatKit />` component.
- `ChatProvider`: Handles the session management and API communication.

## Environment Variables
- `NEXT_PUBLIC_CHATKIT_DOMAIN_KEY`: Domain key from OpenAI dashboard.
- `NEXT_PUBLIC_BACKEND_URL`: URL of the FastAPI backend.