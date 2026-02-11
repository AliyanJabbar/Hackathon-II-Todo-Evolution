from fastapi import FastAPI, WebSocket, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import todos, chatbot
from models import init_db
from websocket_manager import manager
from auth import get_current_user
from jose import jwt
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv

load_dotenv()
WEB_URL = os.getenv("WEB_URL", "http://localhost:3000")
NEXTAUTH_SECRET = os.getenv("NEXTAUTH_SECRET")
ALGORITHM = "HS256"

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[WEB_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(todos.router)
app.include_router(chatbot.router)

def authenticate_websocket_token(token: str) -> str:
    """Authenticate WebSocket connection using token from query params"""
    try:
        payload = jwt.decode(token, NEXTAUTH_SECRET, algorithms=[ALGORITHM])
        user_email = payload.get("email")
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_email
    except Exception:
        raise HTTPException(status_code=401, detail="Token verification failed")

@app.websocket("/ws/todos")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    user_email = authenticate_websocket_token(token)
    await manager.connect(websocket, user_email)
    try:
        while True:
            data = await websocket.receive_text()
            # Keep connection alive, no need to process incoming messages
    except Exception:
        manager.disconnect(websocket, user_email)

@app.post("/broadcast")
async def broadcast_message(data: dict):
    """Endpoint for MCP server to broadcast WebSocket messages"""
    print(f"Received broadcast request: {data}")

    user_email = data.get("user_email")
    action = data.get("action")
    todo = data.get("todo")

    if not user_email or not action or not todo:
        print(f"Missing fields: user_email={user_email}, action={action}, todo={todo}")
        raise HTTPException(status_code=400, detail="Missing required fields: user_email, action, todo")

    print(f"Broadcasting {action} for user {user_email}: {todo}")
    print(f"Active connections: {list(manager.active_connections.keys())}")
    print(f"Connections for {user_email}: {len(manager.active_connections.get(user_email, []))}")

    message = json.dumps({
        "action": action,
        "todo": todo
    })
    await manager.broadcast(message, user_email)
    print(f"Broadcasted message to {user_email}")
    return {"status": "broadcasted"}

@app.get("/")
async def health():
    return {"status": "healthy", "web_url": WEB_URL}
