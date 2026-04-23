from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, timedelta

import models, schemas
from deps import db_dependency, user_dependency
from adafruit_utils import AdafruitIOClient

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/sensors/history")
async def get_sensor_history(
    db: db_dependency,
    user: user_dependency,
    sensor_id: int,
    date: str = Query(..., description="Date in YYYY-MM-DD format")
):
    # 1. Verify sensor exists and belongs to user
    sensor = db.query(models.Sensor).join(models.Device).join(models.Home).filter(
        models.Sensor.id == sensor_id,
        models.Home.owner_id == user.get('id')
    ).first()
    
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found or access denied")
    
    # 2. Get Home credentials
    home = db.query(models.Home).filter(models.Home.id == sensor.device.home_id).first()
    client = AdafruitIOClient(home.adafruitiouser, home.adafruitiokey)
    
    # 3. Calculate time range
    try:
        requested_date = datetime.strptime(date, "%Y-%m-%d")
        # Go back one day and forward one day to cover all possible timezone shifts
        start_date = requested_date - timedelta(days=1)
        end_date = requested_date + timedelta(days=2)
        
        start_time = start_date.isoformat() + "Z"
        end_time = end_date.isoformat() + "Z"
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # 4. Fetch data from Adafruit
    try:
        data = await client.get_historical_data(sensor.feed_name, start_time, end_time)
        return data
    except Exception as e:
        print(f"DEBUG: Adafruit IO error for feed {sensor.feed_name}: {str(e)}")
        if hasattr(e, 'response'):
             print(f"DEBUG: Response body: {e.response.text}")
        raise HTTPException(status_code=500, detail=f"Adafruit IO error: {str(e)}")

@router.get("/summary")
async def get_dashboard_summary(
    db: db_dependency,
    user: user_dependency,
    home_id: int
):
    # 1. Verify home belongs to user
    home = db.query(models.Home).filter(
        models.Home.id == home_id,
        models.Home.owner_id == user.get('id')
    ).first()
    
    if not home:
        raise HTTPException(status_code=404, detail="Home not found")
    
    # 2. Get all sensors for this home
    sensors = db.query(models.Sensor).join(models.Device).filter(
        models.Device.home_id == home_id
    ).all()
    
    client = AdafruitIOClient(home.adafruitiouser, home.adafruitiokey)
    
    summary = []
    for sensor in sensors:
        try:
            # We wrap this in try-except to avoid failing the whole request if one feed fails
            last_val = await client.get_last_data(sensor.feed_name)
            summary.append({
                "sensor_id": sensor.id,
                "sensor_type": sensor.sensor_type,
                "device_name": sensor.device.name,
                "last_value": last_val.get('value'),
                "updated_at": last_val.get('created_at')
            })
        except Exception:
            summary.append({
                "sensor_id": sensor.id,
                "sensor_type": sensor.sensor_type,
                "device_name": sensor.device.name,
                "last_value": None,
                "error": "Could not fetch data"
            })
            
    return summary
