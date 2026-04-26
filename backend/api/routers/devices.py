from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/devices",
    tags=["devices"]
)

@router.get('/', response_model=schemas.Device)
def get_device(db: db_dependency, user: user_dependency, device_id: int):
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@router.get('/devices', response_model=List[schemas.Device])
def get_devices(db: db_dependency, user: user_dependency):
    return db.query(models.Device).all()

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=schemas.Device)
def create_device(db: db_dependency, user: user_dependency, device: schemas.DeviceCreate):
    user_id = user.get('id')
    
    # 1. Create the physical device 
    db_device = models.Device(
        name=device.name,
        device_type_id=device.device_type_id,
        home_id=device.home_id,
        owner_id=user_id
    )
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    
    # 2. Add the sensors/feeds
    for sensor_data in device.sensors:
        db_sensor = models.Sensor(
            sensor_type=sensor_data.sensor_type,
            feed_name=sensor_data.feed_name,
            device_id=db_device.id
        )
        db.add(db_sensor)
    
    db.commit()
    db.refresh(db_device)
    return db_device

@router.delete('/{device_id}')
def delete_device(db: db_dependency, user: user_dependency, device_id: int):
    db_device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
        
    db.delete(db_device)
    db.commit()
    return {"message": "Device deleted successfully"}

@router.post('/control')
def control_device(db: db_dependency, user: user_dependency, command: schemas.DeviceControl):
    from mqtt_manager import active_mqtt_clients, ensure_mqtt_for_home
    
    # 1. Ensure MQTT client is active for this home
    client = ensure_mqtt_for_home(command.home_id, db)
    if not client:
        raise HTTPException(status_code=500, detail="Could not initialize MQTT connection")
    
    # 2. Publish the command
    try:
        client.publish(command.feed_name, command.value)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MQTT Publish failed: {str(e)}")
    
    return {"status": "success", "feed": command.feed_name, "value": command.value}
