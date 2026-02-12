# mcp_server.py
from fastmcp import FastMCP, Context
from sqlmodel import Session, select
from models import Todo, engine
import httpx
import json
import os
from dotenv import load_dotenv

load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

mcp = FastMCP("Todo MCP Server")

async def get_email(ctx: Context) -> str:
    """
    Reads user_email from the MCP request metadata.
    Metadata is available as attributes of `ctx.request_context.meta`.
    """
    # Request context may not be fully established early,
    # so check carefully if meta is present
    if not ctx.request_context or not ctx.request_context.meta:
        await ctx.error("Unauthorized: user_email missing in metadata")
        raise Exception("Unauthorized: user_email missing in context")

    meta = ctx.request_context.meta
    # Metadata fields are accessible via attribute access
    if not hasattr(meta, "user_email"):
        await ctx.error("Unauthorized: user_email missing in metadata")
        raise Exception("Unauthorized: user_email missing in context")

    user_email = meta.user_email
    print(user_email, "user_email in get_email()")
    return user_email

@mcp.tool()
async def get_todos(ctx: Context):
    """
    Get all todos for a user.
    """
    user_email = await get_email(ctx)
    with Session(engine) as session:
        todos = session.exec(
            select(Todo).where(Todo.user_id == user_email)
        ).all()
        return [todo.model_dump() for todo in todos]

@mcp.tool()
async def create_todo(title: str, category: str, ctx: Context):
    """
    Create a new todo.
    """
    user_email = await get_email(ctx)
    print(f"MCP: Creating todo '{title}' for user {user_email}")

    # Check if todo with same title already exists
    with Session(engine) as session:
        existing_todo = session.exec(
            select(Todo).where(Todo.user_id == user_email, Todo.title == title)
        ).first()

        if existing_todo:
            print(f"MCP: Todo with title '{title}' already exists, returning existing")
            return existing_todo.model_dump()

        if not category:
            category = "backlog"

        db_todo = Todo(
            title=title,
            category=category,
            user_id=user_email,
        )
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)

        print(f"MCP: Created todo {db_todo.id}, broadcasting...")

        # Broadcast the new todo to connected clients via HTTP call
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{BACKEND_URL}/broadcast",
                    json={
                        "user_email": user_email,
                        "action": "create",
                        "todo": {
                            "id": db_todo.id,
                            "title": db_todo.title,
                            "category": db_todo.category,
                            "user_id": db_todo.user_id
                        }
                    }
                )
                print(f"MCP: Broadcast response: {response.status_code}")
                if response.status_code != 200:
                    print(f"MCP: Broadcast error: {response.text}")
        except Exception as e:
            print(f"MCP: Broadcast failed: {e}")

        return db_todo.model_dump()

@mcp.tool()
async def update_todo(id: int, title: str, category: str, ctx: Context):
    """
    Update a todo.
    """
    user_email = await get_email(ctx)
    with Session(engine) as session:
        db_todo = session.exec(
            select(Todo).where(
                Todo.id == id,
                Todo.user_id == user_email
            )
        ).first()
        if not db_todo:
            return {"error": "Todo not found or unauthorized"}
        db_todo.title = title
        db_todo.category = category
        session.commit()
        session.refresh(db_todo)

        # Broadcast the updated todo to connected clients via HTTP call
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{BACKEND_URL}/broadcast",
                json={
                    "user_email": user_email,
                    "action": "update",
                    "todo": {
                        "id": db_todo.id,
                        "title": db_todo.title,
                        "category": db_todo.category,
                        "user_id": db_todo.user_id
                    }
                }
            )

        return db_todo.model_dump()

@mcp.tool()
async def delete_todo(id: int, ctx: Context):
    """
    Delete a todo.
    """
    user_email = await get_email(ctx)
    with Session(engine) as session:
        db_todo = session.exec(
            select(Todo).where(
                Todo.id == id,
                Todo.user_id == user_email
            )
        ).first()
        if not db_todo:
            return {"error": "Todo not found"}

        # Store todo data before deletion for broadcasting
        deleted_todo = {
            "id": db_todo.id,
            "title": db_todo.title,
            "category": db_todo.category,
            "user_id": db_todo.user_id
        }

        session.delete(db_todo)
        session.commit()

        # Broadcast the deleted todo to connected clients via HTTP call
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{BACKEND_URL}/broadcast",
                json={
                    "user_email": user_email,
                    "action": "delete",
                    "todo": deleted_todo
                }
            )

        return {"message": "Todo deleted"}

# This exposes the MCP server as a Streamable HTTP app
# You can then run it with uvicorn:

# mcp_app = mcp.streamable_http_app() #when built with core mcp we need to expose an ASGI app, but in fastmcp we don't
# development command: uvicorn mcp_server:mcp_app --reload --port 8001


# if __name__ == "__main__":
#     mcp.run(transport="http", port=8001)
