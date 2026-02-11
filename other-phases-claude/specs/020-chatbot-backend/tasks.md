# Todo AI Chatbot Backend - Tasks

## Phase 1: Project Setup
- [X] Initialize FastAPI project
- [X] Create routers: `todos`, `chatbot`
- [X] Setup `.env` and load with `dotenv`
- [X] Configure CORS middleware with frontend URL

## Phase 2: Database Integration
- [X] Implement `init_db()` in `models.py`
- [X] Ensure database connection is available at startup
- [X] Define task schema
- [X] Integrate MCP tool for CRUD operations

## Phase 3: Chatbot Endpoint
- [X] Create `/chat/` POST endpoint
- [X] Define `ChatMessage` and `ChatRequest` models
- [X] Implement `StreamingResponse` for chat
- [X] Pass user messages to `Agent` via `Runner.run_streamed`
- [X] Stream partial responses to frontend
- [X] Log MCP tool calls for debugging

## Phase 4: AI Agent Configuration
- [X] Configure `Agent` with task management instructions
- [X] Limit responses to task-related actions
- [X] Ensure concise, professional tone
- [X] Format task lists using Markdown

## Phase 5: LLM Integration
- [X] Setup OpenRouter client with API key
- [X] Configure model (`openai/gpt-oss-20b:free`) via `AsyncOpenAI`
- [X] Define `RunConfig` for streamed execution
- [X] Handle exceptions and return structured error messages

## Phase 6: Testing & Debugging
- [X] Test `/` health endpoint
- [X] Test `/chat/` with sample messages
- [X] Verify streaming chunks in frontend
- [X] Ensure MCP tool calls are executed correctly
- [X] Handle errors gracefully

## Phase 7: Deployment
- [X] Deploy backend to server or cloud provider
- [X] Ensure `WEB_URL` is set correctly
- [X] Test full integration with frontend Next.js app
