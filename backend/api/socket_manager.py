from fastapi import WebSocket
from typing import List, Dict
import json

class ConnectionManager:
    def __init__(self):
        # Maps home_id to a list of active WebSockets
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, home_id: int):
        await websocket.accept()
        if home_id not in self.active_connections:
            self.active_connections[home_id] = []
        self.active_connections[home_id].append(websocket)
        print(f"DEBUG: WebSocket connected to home {home_id}")

    def disconnect(self, websocket: WebSocket, home_id: int):
        if home_id in self.active_connections:
            self.active_connections[home_id].remove(websocket)
            if not self.active_connections[home_id]:
                del self.active_connections[home_id]
        print(f"DEBUG: WebSocket disconnected from home {home_id}")

    async def broadcast_to_home(self, home_id: int, message: dict):
        if home_id in self.active_connections:
            for connection in self.active_connections[home_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception as e:
                    print(f"DEBUG: Error broadcasting to home {home_id}: {str(e)}")

manager = ConnectionManager()
