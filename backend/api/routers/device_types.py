from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from deps import db_dependency
from pydantic import BaseModel
from typing import Optional

class DeviceTypeBase(BaseModel):
    type_name: str
    icon_url: Optional[str] = None
    admin_id: Optional[int] = None

class DeviceTypeCreate(DeviceTypeBase):
    pass

router = APIRouter(
    prefix="/device_types",
    tags=["Device Types"]
)

@router.get("/", response_model=List[schemas.DeviceType])
def get_device_types(db: Session = Depends(db_dependency), skip: int = 0, limit: int = 100):
    device_types = db.query(models.DeviceType).offset(skip).limit(limit).all()
    return device_types

@router.post("/", response_model=schemas.DeviceType, status_code=status.HTTP_201_CREATED)
def create_device_type(device_type: schemas.DeviceTypeCreate, db: Session = Depends(db_dependency)):
    db_device_type = models.DeviceType(**device_type.model_dump())
    db.add(db_device_type)
    db.commit()
    db.refresh(db_device_type)
    return db_device_type

@router.get("/{type_id}", response_model=schemas.DeviceType)
def get_device_type(type_id: int, db: Session = Depends(db_dependency)):
    device_type = db.query(models.DeviceType).filter(models.DeviceType.id == type_id).first()
    if device_type is None:
        raise HTTPException(status_code=404, detail="DeviceType not found")
    return device_type

@router.delete("/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_device_type(type_id: int, db: Session = Depends(db_dependency)):
    device_type = db.query(models.DeviceType).filter(models.DeviceType.id == type_id).first()
    if device_type is None:
        raise HTTPException(status_code=404, detail="DeviceType not found")
    db.delete(device_type)
    db.commit()
    return None
