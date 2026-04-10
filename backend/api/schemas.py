from pydantic import BaseModel, ConfigDict
from typing import Optional
from models import UserRole

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Device Schemas ---
class PostBase(BaseModel):
    name: str
    status: bool
    owner_id: int
