# Todo AI Chatbot Backend - Specification

## Overview
This backend provides a **FastAPI**-based API to power a Todo AI Chatbot. It exposes a streaming chat endpoint that allows users to manage tasks via natural language. The AI assistant interacts with a database using MCP tools, handling task CRUD operations.

The backend integrates:
- **FastAPI** for REST API and streaming responses.
- **Agentic AI** for processing natural language commands.
- **OpenRouter LLMs** for generating AI responses.
- **Database via MCP tool** for persistent task management.

---

## API Endpoints

### 1. Health Check
*   **Endpoint:** `GET /`
*   **Description:** Checks if the backend is running and returns the configured frontend URL.
*   **Response:**
    ```json
    {
      "status": "healthy",
      "web_url": "<frontend_url>"
    }
    ```

### 2. Chat Endpoint
*   **Endpoint:** `POST /chat/`
*   **Description:** Sends user messages to the AI agent and retrieves the assistant's response.
*   **Request Body:**
    ```json
    {
      "messages": [
        { "role": "user", "text": "Add a task to buy groceries" }
      ]
    }
    ```
*   **Response:** Streaming response (`text/plain`) providing incremental chatbot outputs.

#### Behavior
1.  Receives user messages.
2.  Sends messages to the Agent with Todo instructions.
3.  Logs MCP tool calls for task operations.
4.  Streams partial responses (chunks) to the frontend.

---

## Models

### ChatMessage
*   **role:** `"user" | "bot"`
*   **text:** `string`

### ChatRequest
*   **messages:** `List[ChatMessage]`

---

## AI Agent

**Name:** Todo App Productivity Assistant

### Responsibilities
*   **Read Tasks:** Fetch and list tasks.
*   **Add Tasks:** Create tasks with descriptions, priority, or deadlines.
*   **Update Tasks:** Modify existing tasks.
*   **Delete Tasks:** Remove tasks.

### Response Guidelines
*   Be concise, professional, and user-friendly.
*   Use **Markdown** for formatting task lists.
*   Only handle task-related queries.

---

## Environment Variables

| Variable | Description |
| :--- | :--- |
| `OPENROUTER_API_KEY` | API key for OpenRouter to access LLMs. |
| `WEB_URL` | Frontend URL allowed for CORS configuration. |