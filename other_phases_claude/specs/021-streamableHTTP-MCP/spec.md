generate spec.md, plan.md and tasks.md for this, make sure that tasks include checkbox as it is filled with 'X' and plan.md should be normal text like spec.md :

spec.md
# Todo AI Chatbot – Specification

## 1. Overview
The Todo AI Chatbot is a backend service that allows users to manage tasks using natural language.  
The system uses an AI agent integrated with MCP tools to perform CRUD operations on a database.

Users can:
- Create tasks
- View tasks
- Update tasks
- Delete tasks

The assistant interprets natural language and executes structured actions through MCP tools.

---

## 2. Goals

- Provide natural language task management
- Maintain secure user-scoped data
- Stream responses in real time
- Separate AI logic, tools, and API layers

---

## 3. Architecture

System Components:

Frontend (Next.js)
        |
        v
FastAPI Backend
        |
        v
AI Agent (OpenAI Agents SDK)
        |
        v
MCP HTTP Server
        |
        v
SQL Database

---

## 4. Technologies Used

Backend:
- FastAPI
- SQLModel
- OpenAI Agents SDK
- MCP (Model Context Protocol)

AI:
- LLM via OpenAI-compatible API
- Streaming responses

Database:
- PostgreSQL / NeonDB

Authentication:
- JWT-based authentication
- user_email passed in agent context

---

## 5. API Endpoints

### Chat Endpoint
**POST** `/chat`

**Request:**
```json
{
  "messages": [
    { "role": "user", "text": "Add a task to learn FastAPI" }
  ]
}
```

**Response:**
Streaming text chunks.

---

## 6. MCP Tools

*   **get_todos**
    *   Returns all todos for the authenticated user.
*   **create_todo**
    *   Creates a new todo.
    *   **Parameters:** `title`, `category`
*   **update_todo**
    *   Updates an existing todo.
    *   **Parameters:** `id`, `title`, `category`
*   **delete_todo**
    *   Deletes a todo.
    *   **Parameters:** `id`

---

## 7. Agent Behavior

The agent:
*   Understands user intent.
*   Calls MCP tools when needed.
*   Responds professionally and concisely.
*   Does not ask for sensitive data.
*   Uses context for user identity.

---

## 8. Streaming Behavior

The backend streams:
*   Token responses from LLM.
*   Tool execution results.

Streaming is implemented using:
*   `StreamingResponse`
*   `Runner.run_streamed()`

---

## 9. Security

Security mechanisms:
*   JWT authentication.
*   User-scoped queries (Row-level security logic).
*   Context-based identity passing.

---

## 10. Future Improvements

*   Conversation memory.
*   Task prioritization.
*   Due dates.
*   Dashboard analytics.