from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from models import UserRole

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    role: UserRole
    email: str
    phone: str

class UserCreate(UserBase):
    password: str
    supervisor_id: Optional[int] = None
    admin_id: Optional[int] = None

class User(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- DeviceType Schemas ---
class DeviceTypeBase(BaseModel):
    type_name: str
    icon_url: Optional[str] = None
    admin_id: Optional[int] = None

class DeviceTypeCreate(DeviceTypeBase):
    pass

class DeviceType(DeviceTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Device Schemas ---
class DeviceBase(BaseModel):
    name: str
    adafruit_feed_name: str
    device_type_id: Optional[int] = None
    home_id: Optional[int] = None

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Home Schemas ---
class HomeBase(BaseModel):
    name: str
    adafruitiokey: str
    adafruitiouser: str
    owner_id: Optional[int] = None

class HomeCreate(HomeBase):
    pass

class Home(HomeBase):
    id: int
    created_at: datetime
    devices: List[Device] = []
    model_config = ConfigDict(from_attributes=True)
