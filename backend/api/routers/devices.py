from fastapi import APIRouter, status, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import os
import time
from datetime import datetime, date
import cloudinary
import cloudinary.uploader

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
    
    # Check authorization (Only Owner or Admin can add devices)
    uh = db.query(models.UserHome).filter(
        models.UserHome.user_id == user_id,
        models.UserHome.home_id == device.home_id,
        models.UserHome.status == models.UserHomeStatus.accepted
    ).first()
    if not uh or uh.role == models.UserHomeRole.member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied. Only Owner or Admin can add devices.")
    
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
        
    user_id = user.get('id')
    # Check authorization (Only Owner or Admin can delete devices)
    uh = db.query(models.UserHome).filter(
        models.UserHome.user_id == user_id,
        models.UserHome.home_id == db_device.home_id,
        models.UserHome.status == models.UserHomeStatus.accepted
    ).first()
    if not uh or uh.role == models.UserHomeRole.member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied. Only Owner or Admin can delete devices.")
        
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

# --- Camera Image Cooldown & Upload System ---

class CameraCooldownManager:
    def __init__(self):
        self.current_name = None
        self.first_seen_at = None
        self.stored_for_session = False
        self.cooldown_start = None
        self.last_activity_time = None

    def process_face(self, name: str) -> str:
        now = time.time()
        name_clean = name.strip() if name else "unknown"
        
        # If no activity for 10 seconds, reset tracking entirely (e.g. people walked away)
        if self.last_activity_time and (now - self.last_activity_time >= 10.0):
            self.current_name = None
            self.first_seen_at = None
            self.stored_for_session = False
            self.cooldown_start = None
            
        self.last_activity_time = now
        
        # If no face is currently tracked, or the face name changed:
        if self.current_name is None or self.current_name != name_clean:
            self.current_name = name_clean
            self.first_seen_at = now
            self.stored_for_session = False
            self.cooldown_start = None
            return 'wait'
            
        # Same face as currently tracked
        if not self.stored_for_session:
            elapsed = now - self.first_seen_at
            if elapsed >= 2.0:
                return 'store'
            else:
                return 'wait'
        else:
            # Already stored. Check 5-minute (300 seconds) cooldown.
            elapsed_cooldown = now - self.cooldown_start
            if elapsed_cooldown >= 300.0:
                self.first_seen_at = now
                self.stored_for_session = False
                self.cooldown_start = None
                return 'wait'
            else:
                return 'cooldown'

    def mark_stored(self):
        self.stored_for_session = True
        self.cooldown_start = time.time()
        self.last_activity_time = time.time()

cooldown_manager = CameraCooldownManager()

# Configure Cloudinary
cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key = os.getenv("CLOUDINARY_API_KEY"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET")
)

@router.post('/camera/upload')
async def upload_camera_image(
    db: db_dependency,
    user: user_dependency,
    file: UploadFile = File(...),
    person_name: str = Form(...),
    device_id: int = Form(5)
):
    # 1. Clean the face name
    face_name = person_name.strip() if person_name else "unknown"
    
    # 2. Run the cooldown manager logic
    action = cooldown_manager.process_face(face_name)
    
    if action == 'wait':
        return {
            "status": "waiting",
            "message": f"Face recognized. Need 2 seconds of continuous recognition before storing.",
            "data": None
        }
    elif action == 'cooldown':
        # Calculate remaining cooldown time
        remaining = 300.0 - (time.time() - cooldown_manager.cooldown_start)
        return {
            "status": "cooldown",
            "message": f"Face '{face_name}' is in cooldown. {int(remaining)} seconds remaining.",
            "data": None
        }
        
    # action == 'store'
    # 3. Verify device exists
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        # Fallback to any device containing "Door" or the first available device
        device = db.query(models.Device).filter(models.Device.name.contains("Door")).first()
        if not device:
            device = db.query(models.Device).first()
        if not device:
            raise HTTPException(status_code=404, detail="No suitable camera device found in database.")
        device_id = device.id

    try:
        # 4. Upload image to Cloudinary
        contents = await file.read()
        upload_result = cloudinary.uploader.upload(
            contents,
            folder="yolohome_camera"
        )
        url = upload_result.get("secure_url")
        if not url:
            raise HTTPException(status_code=500, detail="Failed to retrieve secure URL from Cloudinary.")
            
        # 5. Save to camera table
        db_camera = models.Camera(
            device_id=device_id,
            url=url,
            person_name=face_name
        )
        db.add(db_camera)
        db.commit()
        db.refresh(db_camera)
        
        # 6. Mark as stored in cooldown manager to start the 5-minute cooldown
        cooldown_manager.mark_stored()
        
        # 7. Auto-unlock the door if the person is a recognized family member
        lower_name = face_name.lower()
        if lower_name != "stranger" and lower_name != "background":
            try:
                from mqtt_manager import ensure_mqtt_for_home
                mqtt_client = ensure_mqtt_for_home(device.home_id, db)
                if mqtt_client:
                    mqtt_client.publish("dadn.door-state", "0")
                    print(f"[Camera Auto-Unlock] Successfully unlocked door for recognized person: {face_name}")
                else:
                    print(f"[Camera Auto-Unlock] Failed to initialize MQTT connection for home {device.home_id}")
            except Exception as e:
                print(f"[Camera Auto-Unlock] Error publishing unlock command: {str(e)}")
        
        return {
            "status": "stored",
            "message": "Image successfully uploaded and stored in database.",
            "data": schemas.CameraResponse.model_validate(db_camera)
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Image upload/storage failed: {str(e)}")

@router.get('/camera/logs', response_model=List[schemas.CameraResponse])
def get_camera_logs(db: db_dependency, user: user_dependency, limit: int = 20):
    return db.query(models.Camera).order_by(models.Camera.created_at.desc()).limit(limit).all()

@router.get('/camera/stats')
def get_camera_stats(
    db: db_dependency,
    user: user_dependency
):
    today = date.today()
    start_of_today = datetime.combine(today, datetime.min.time())
    end_of_today = datetime.combine(today, datetime.max.time())
    
    # Query all logs from today
    logs = db.query(models.Camera).filter(
        models.Camera.created_at >= start_of_today,
        models.Camera.created_at <= end_of_today
    ).all()
    
    # Initialize 24-hour slots
    stats = []
    for h in range(24):
        stats.append({
            "hour": h,
            "family_names": set(),
            "unknown_count": 0
        })
        
    for log in logs:
        log_hour = log.created_at.hour
        name_lower = log.person_name.strip().lower()
        
        if "stranger" in name_lower:
            stats[log_hour]["unknown_count"] += 1
        else:
            stats[log_hour]["family_names"].add(log.person_name.strip())
            
    # Format the final response
    formatted_data = []
    for s in stats:
        formatted_data.append({
            "hour": s["hour"],
            "family": len(s["family_names"]),
            "unknown": s["unknown_count"]
        })
        
    return formatted_data

def get_cloudinary_public_id(url: str) -> str:
    # Extracts "folder/public_id" from Cloudinary secure URL
    if "upload/" in url:
        parts = url.split("upload/")[-1].split("/")
        if parts[0].startswith("v") and parts[0][1:].isdigit():
            public_id_with_ext = "/".join(parts[1:])
        else:
            public_id_with_ext = "/".join(parts)
        public_id = public_id_with_ext.rsplit(".", 1)[0]
        return public_id
    return None

@router.delete('/camera/{log_id}')
def delete_camera_log(
    log_id: int,
    db: db_dependency,
    user: user_dependency
):
    # 1. Fetch camera record
    log = db.query(models.Camera).filter(models.Camera.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Camera log not found")
        
    # 2. Extract public ID and destroy asset on Cloudinary
    public_id = get_cloudinary_public_id(log.url)
    if public_id:
        try:
            cloudinary.uploader.destroy(public_id)
        except Exception as e:
            print(f"[Cloudinary] Failed to delete image {public_id}: {str(e)}")
            
    # 3. Delete DB record
    try:
        db.delete(log)
        db.commit()
        return {"status": "success", "message": "Camera log deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database deletion failed: {str(e)}")


