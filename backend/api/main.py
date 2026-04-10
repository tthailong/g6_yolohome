from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from sqlalchemy.orm import Session

import models, schemas
from database import Base, engine, SessionLocal
from routers import auth
from deps import db_dependency

app = FastAPI(
    title="G6 YoloHome API",
    description="Hệ thống quản lý Smart Home",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "success", "message": "Health check complete"}

app.include_router(auth.router)
