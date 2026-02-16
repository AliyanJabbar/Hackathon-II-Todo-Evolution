from fastmcp import FastMCP, Context
from sqlmodel import select
from models import Todo, engine, Session  
import httpx
import os

# Environment variables
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

mcp = FastMCP("Todo MCP Server")

# -------------------------
# Helper: Get user email safely & Normalize
# -------------------------
async def get_email(ctx: Context) -> str:
    if not ctx.request_context or not ctx.request_context.meta:
        raise Exception("Unauthorized: user_email missing in metadata")

    meta = ctx.request_context.meta
    if not hasattr(meta, "user_email"):
        raise Exception("Unauthorized: user_email missing in metadata")
    
    # Normalize email to lowercase to ensure it matches the WebSocket connection
    return meta.user_email.lower()

# -------------------------
# Tools
# -------------------------

@mcp.tool()
async def get_todos(ctx: Context):
    user_email = await get_email(ctx)
    with Session(engine) as session:
        todos = session.exec(
            select(Todo).where(Todo.user_id == user_email)
        ).all()
        return [todo.model_dump() for todo in todos]

@mcp.tool()
async def create_todo(title: str, category: str = "backlog", ctx: Context = None):
    user_email = await get_email(ctx)

    with Session(engine) as session:
        # Check for duplicates to avoid clutter
        existing_todo = session.exec(
            select(Todo).where(Todo.user_id == user_email, Todo.title == title)
        ).first()
        if existing_todo:
            return existing_todo.model_dump()

        db_todo = Todo(title=title, category=category, user_id=user_email)
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)

        # Prepare a clean dictionary for broadcast (avoids datetime serialization errors)
        broadcast_payload = {
            "user_email": user_email,
            "action": "create",
            "todo": {
                "id": db_todo.id,
                "title": db_todo.title,
                "category": db_todo.category,
                "user_id": db_todo.user_id
            }
        }

        # Broadcast the new todo to connected clients
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{BACKEND_URL}/broadcast",
                    json=broadcast_payload,
                    timeout=5
                )
        except Exception as e:
            print(f"Failed to broadcast create: {e}")

        return db_todo.model_dump()

@mcp.tool()
async def update_todo(id: int, title: str, category: str, ctx: Context):
    user_email = await get_email(ctx)

    with Session(engine) as session:
        db_todo = session.exec(
            select(Todo).where(Todo.id == id, Todo.user_id == user_email)
        ).first()
        if not db_todo:
            return {"error": "Todo not found or unauthorized"}

        db_todo.title = title
        db_todo.category = category
        session.commit()
        session.refresh(db_todo)

        # Clean payload
        broadcast_payload = {
            "user_email": user_email,
            "action": "update",
            "todo": {
                "id": db_todo.id,
                "title": db_todo.title,
                "category": db_todo.category,
                "user_id": db_todo.user_id
            }
        }

        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{BACKEND_URL}/broadcast",
                    json=broadcast_payload,
                    timeout=5
                )
        except Exception as e:
            print(f"Failed to broadcast update: {e}")

        return db_todo.model_dump()

@mcp.tool()
async def delete_todo(id: int, ctx: Context):
    user_email = await get_email(ctx)

    with Session(engine) as session:
        db_todo = session.exec(
            select(Todo).where(Todo.id == id, Todo.user_id == user_email)
        ).first()
        if not db_todo:
            return {"error": "Todo not found"}

        # Capture ID before deletion for the broadcast
        deleted_id = db_todo.id
        session.delete(db_todo)
        session.commit()

        # Clean payload
        broadcast_payload = {
            "user_email": user_email,
            "action": "delete",
            "todo": {
                "id": deleted_id
            }
        }

        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{BACKEND_URL}/broadcast",
                    json=broadcast_payload,
                    timeout=5
                )
        except Exception as e:
            print(f"Failed to broadcast delete: {e}")

        return {"message": "Todo deleted"}

# This exposes the MCP server as a Streamable HTTP app
# You can then run it with uvicorn:

# mcp_app = mcp.streamable_http_app() #when built with core mcp we need to expose an ASGI app, but in fastmcp we don't
# development command: uvicorn mcp_server:mcp_app --reload --port 8001

if __name__ == "__main__":
    mcp.run(transport="http", port=8001)