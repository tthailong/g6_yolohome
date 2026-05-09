from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from sqlalchemy.orm import Session

import models, schemas
from database import Base, engine, SessionLocal
from routers import auth, devices, homes, device_types, dashboard
from socket_manager import manager as socket_manager
import asyncio
from fastapi.concurrency import run_in_threadpool
from mqtt_manager import stop_all_mqtt, ensure_mqtt_for_home, set_main_loop
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Set the event loop for MQTT manager to enable broadcasting from threads
    set_main_loop(asyncio.get_running_loop())
    # Startup (MQTT now initialized on-demand)
    yield
    # Shutdown
    stop_all_mqtt()

app = FastAPI(
    title="G6 YoloHome API",
    description="Hệ thống quản lý Smart Home",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Temporarily broad for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "success", "message": "Health check complete"}

app.include_router(auth.router)
app.include_router(devices.router)
app.include_router(homes.router)
app.include_router(device_types.router)
app.include_router(dashboard.router)

@app.websocket("/ws/{home_id}")
async def websocket_endpoint(websocket: WebSocket, home_id: int):
    print(f"DEBUG: WebSocket connection attempt for home {home_id}")
    try:
        # Accept the connection first so the browser doesn't time out
        await socket_manager.connect(websocket, home_id)
        print(f"DEBUG: WebSocket connection accepted for home {home_id}")
        
        # Initialize MQTT for this home if not already started
        db = SessionLocal()
        try:
            # Run the initialization in a threadpool to keep the event loop responsive
            await run_in_threadpool(ensure_mqtt_for_home, home_id, db)
        except Exception as e:
            print(f"DEBUG: Error ensuring MQTT for home {home_id}: {str(e)}")
        finally:
            db.close()
            
        try:
            while True:
                # Keep the connection open
                await websocket.receive_text()
        except WebSocketDisconnect:
            print(f"DEBUG: WebSocket disconnected for home {home_id}")
            socket_manager.disconnect(websocket, home_id)
    except Exception as e:
        print(f"DEBUG: WebSocket error for home {home_id}: {str(e)}")