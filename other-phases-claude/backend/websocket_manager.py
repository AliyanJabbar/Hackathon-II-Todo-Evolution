from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_email: str):
        await websocket.accept()
        if user_email not in self.active_connections:
            self.active_connections[user_email] = []
        self.active_connections[user_email].append(websocket)

    def disconnect(self, websocket: WebSocket, user_email: str):
        if user_email in self.active_connections:
            self.active_connections[user_email].remove(websocket)
            if not self.active_connections[user_email]:
                del self.active_connections[user_email]

    async def broadcast(self, message: str, user_email: str):
        print(f"WebSocket broadcast: user={user_email}, connections={len(self.active_connections.get(user_email, []))}")
        if user_email in self.active_connections:
            for i, connection in enumerate(self.active_connections[user_email]):
                try:
                    print(f"Sending message to connection {i}: {message}")
                    await connection.send_text(message)
                    print(f"Message sent successfully to connection {i}")
                except Exception as e:
                    print(f"Error sending to connection {i}: {e}")
                    # Handle disconnected clients
                    pass
        else:
            print(f"No active connections for user {user_email}")

manager = ConnectionManager()
