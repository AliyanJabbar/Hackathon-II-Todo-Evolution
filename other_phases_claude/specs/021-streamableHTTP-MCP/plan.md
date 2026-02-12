This explains **how the system is built step-by-step conceptually**, not tasks.

# Todo AI Chatbot – Implementation Plan

## Phase 1 – Backend Foundation
- Set up FastAPI project
- Configure database with SQLModel
- Implement Todo models
- Add CRUD endpoints

---

## Phase 2 – Authentication
- Implement JWT verification
- Extract user_email
- Protect endpoints

---

## Phase 3 – MCP Integration
- Create MCP server
- Implement tools:
  - get_todos
  - create_todo
  - update_todo
  - delete_todo
- Add user context handling

---

## Phase 4 – AI Agent Integration
- Configure OpenAI Agents SDK
- Connect MCP server
- Define agent instructions
- Implement tool invocation flow

---

## Phase 5 – Streaming Responses
- Implement Runner.run_streamed()
- Return StreamingResponse
- Handle token streaming

---

## Phase 6 – Testing
- Test CRUD operations
- Test agent tool calls
- Test authentication flow
- Test streaming behavior

---

## Phase 7 – Deployment (Optional)
- Deploy FastAPI backend
- Deploy MCP server
- Configure environment variables

