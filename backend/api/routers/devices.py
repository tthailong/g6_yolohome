from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, status

from models import Device, Admin, User
from deps import db_dependency, user_dependency, admin_dependency

router = APIRouter(
    prefix="/devices",
    tags=["devices"]
)

class DeviceBase(BaseModel):
    name: str
    status: bool
    home_id: int

class DeviceCreate(DeviceBase):
    pass

@router.get('/')
def get_device(db: db_dependency, user: user_dependency, device_id: int):
    return db.query(Device).filter(Device.id == device_id).first()

@router.get('/devices')
def get_devices(db: db_dependency, user: user_dependency):
    return db.query(Device).all()

@router.post('/', status_code=status.HTTP_201_CREATED)
def create_device(db: db_dependency, user: user_dependency, device: DeviceCreate):
    user_db = db.query(User).filter(User.id == user.get('id')).first()
    if not user_db:
         raise HTTPException(status_code=404, detail="User not found")
         
    db_device = Device(**device.model_dump(), admin_id=user_db.admin_id)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@router.delete('/')
def delete_device(db: db_dependency, user: user_dependency, device_id: int):
    db_device = db.query(Device).filter(Device.id==device_id).first()
    if db_device:
        db.delete(db_device)
        db.commit()
    return db_device
