from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Literal
from auth import get_current_user
from agents import Runner, Agent
from fastapi.responses import StreamingResponse
from openai.types.responses import ResponseTextDeltaEvent
from agents.mcp import MCPServerStreamableHttp, MCPToolMetaContext
import os, json
from llm_config import groq_config
from agents import ModelSettings

router = APIRouter(prefix="/chat", tags=["Chatbot"])

class ChatMessage(BaseModel):
    role: Literal["user", "bot"]
    text: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class AgentContext(BaseModel):
    user_email: str

# resolver: produce MCP "_meta"
def resolve_meta(wrapper: MCPToolMetaContext) -> dict[str, str] | None:
    # The run_context.context is your AgentContext Pydantic model,
    # so read as an attribute:
    agent_ctx = wrapper.run_context.context
    print("user_email found: ", agent_ctx.user_email)
    if not agent_ctx or not hasattr(agent_ctx, "user_email"):
        return None

    return {"user_email": str(agent_ctx.user_email)}


@router.post("/")
async def chat(request: ChatRequest, user_email: str = Depends(get_current_user)):

    async def generate_response():
        try:
            # HTTP Streamable MCP
            async with MCPServerStreamableHttp(
                name="Todo MCP HTTP",
                params={"url": "http://127.0.0.1:8001/mcp"},
                tool_meta_resolver=resolve_meta,
            ) as server:

                agent = Agent(
                    name="Todo App Productivity Assistant",
                    instructions="""
                    You are a professional AI assistant for a todo app.

                    - NEVER ask for email; user_email arrives via MPC context.
                    You have the following tools available:
                    - "get_todos"
                    - "create_todo"
                    - "update_todo"
                    - "delete_todo"

                    When you want to perform an action, output a single JSON object like:
                    {"tool":"tool_name","args":{...}}

                    Do *not* output anything else when calling a tool.  
                    Do *not* use any name other than the four valid tools above.
                    If no tool call is needed, respond with plain text — do not attempt a tool call.
                    We have 4 categories: backlog, todo, doing and done
                    """,
                    mcp_servers=[server], 
                    model_settings=ModelSettings(tool_choice="auto")
                )
                print("⚙️ Running agent...")
                result = Runner.run_streamed(
                    agent,
                    input="\n".join(f"{m.role}: {m.text}" for m in request.messages),
                    run_config=groq_config,
                    context=AgentContext(user_email=user_email),
                )

                async for event in result.stream_events():
                    if event.type == "raw_response_event" and isinstance(
                        event.data, ResponseTextDeltaEvent
                    ):
                        yield f"{json.dumps({'chunk': event.data.delta})}\n\n"

        except Exception as e:
            print("❌ Error:", str(e))
            error_data = {"error": str(e)}
            yield f"{json.dumps(error_data)}\n\n"

    return StreamingResponse(
        generate_response(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )
