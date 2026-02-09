# mcp_server.py
from mcp.server.fastmcp import FastMCP, Context
from sqlmodel import Session, select
from models import Todo, engine

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
    if not category:
        category = "backlog"
    with Session(engine) as session:
        db_todo = Todo(
            title=title,
            category=category,
            user_id=user_email,
        )
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)
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
        session.delete(db_todo)
        session.commit()
        return {"message": "Todo deleted"}

# This exposes the MCP server as a Streamable HTTP app
# You can then run it with uvicorn:
mcp_app = mcp.streamable_http_app()
# uvicorn mcp_server:mcp_app --reload --port 8001
