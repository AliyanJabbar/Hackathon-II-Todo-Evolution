# Todo AI Chatbot Backend - Implementation Plan

## Phase 1: Project Setup
- Initialize FastAPI project
- Create routers: `todos`, `chatbot`
- Setup `.env` and load with `dotenv`
- Configure CORS middleware with frontend URL

## Phase 2: Database Integration
- Implement `init_db()` in `models.py`
- Ensure database connection is available at startup
- Define task schema and MCP tool integration

## Phase 3: Chatbot Endpoint
- Create `/chat/` POST endpoint
- Define `ChatMessage` and `ChatRequest` models
- Implement streaming response with `StreamingResponse`
- Pass user messages to `Agent` via `Runner.run_streamed`
- Stream partial responses back to frontend
- Log MCP tool calls for debugging

## Phase 4: AI Agent Configuration
- Configure `Agent` with instructions for task management
- Limit responses to task-related operations only
- Ensure professional, motivational tone
- Use Markdown formatting for task lists

## Phase 5: LLM Integration
- Setup OpenRouter client with API key
- Configure model (`openai/gpt-oss-20b:free`) via `AsyncOpenAI`
- Define `RunConfig` for streamed execution
- Handle exceptions and return structured error messages

## Phase 6: Testing & Debugging
- Test `/` health endpoint
- Test `/chat/` with sample messages
- Verify streaming chunks in frontend
- Ensure MCP tool calls are correctly executed
- Handle errors gracefully

## Phase 7: Deployment
- Deploy backend to server or cloud provider
- Ensure frontend URL is correctly set in `WEB_URL`
- Test full integration with frontend Next.js app
