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
    # 1. Verify sensor exists
    sensor = db.query(models.Sensor).filter(models.Sensor.id == sensor_id).first()
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
        
    # Verify user has access to the home
    uh = db.query(models.UserHome).filter(
        models.UserHome.user_id == user.get('id'),
        models.UserHome.home_id == sensor.device.home_id,
        models.UserHome.status == models.UserHomeStatus.accepted
    ).first()
    if not uh:
        raise HTTPException(status_code=403, detail="Access denied to this home's sensors")
    
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
    # 1. Verify user belongs to home
    uh = db.query(models.UserHome).filter(
        models.UserHome.user_id == user.get('id'),
        models.UserHome.home_id == home_id,
        models.UserHome.status == models.UserHomeStatus.accepted
    ).first()
    if not uh:
        raise HTTPException(status_code=403, detail="Access denied. Not a member of this home.")
        
    home = db.query(models.Home).filter(models.Home.id == home_id).first()
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
                "feed_name": sensor.feed_name,
                "last_value": last_val.get('value'),
                "updated_at": last_val.get('created_at')
            })
        except Exception:
            summary.append({
                "sensor_id": sensor.id,
                "sensor_type": sensor.sensor_type,
                "device_name": sensor.device.name,
                "feed_name": sensor.feed_name,
                "last_value": None,
                "error": "Could not fetch data"
            })
            
    return summary
@router.get("/activities")
async def get_activities(
    db: db_dependency,
    user: user_dependency,
    home_id: int,
    limit: int = Query(20, description="Number of activities to return"),
    date: str = Query(None, description="Filter activities by date (YYYY-MM-DD)")
):
    # 1. Verify user belongs to home
    uh = db.query(models.UserHome).filter(
        models.UserHome.user_id == user.get('id'),
        models.UserHome.home_id == home_id,
        models.UserHome.status == models.UserHomeStatus.accepted
    ).first()
    if not uh:
        raise HTTPException(status_code=403, detail="Access denied. Not a member of this home.")
        
    home = db.query(models.Home).filter(models.Home.id == home_id).first()
    if not home:
        raise HTTPException(status_code=404, detail="Home not found")
    
    # 2. Get relevant sensors for this home
    sensors = db.query(models.Sensor).join(models.Device).filter(
        models.Device.home_id == home_id,
        models.Sensor.sensor_type.in_(['temperature', 'humidity', 'earthquake', 'security'])
    ).all()
    
    client = AdafruitIOClient(home.adafruitiouser, home.adafruitiokey)
    
    # 3. Calculate time range if date is provided
    start_time = None
    end_time = None
    if date:
        try:
            requested_date = datetime.strptime(date, "%Y-%m-%d")
            # Precise day window
            start_time = requested_date.replace(hour=0, minute=0, second=0).isoformat() + "Z"
            end_time = requested_date.replace(hour=23, minute=59, second=59).isoformat() + "Z"
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    all_activities = []
    
    for sensor in sensors:
        # Skip door state changes from activity log as requested
        if sensor.feed_name == 'dadn.door-state':
            continue
            
        try:
            if start_time and end_time:
                # Fetch only for that day
                data_points = await client.get_historical_data(sensor.feed_name, start_time, end_time)
            else:
                # Fetch recent items for 'View All' mode
                data_points = await client.get_feed_data(sensor.feed_name, limit=100)
            
            # Process from oldest to newest to detect threshold crossings
            is_above = False
            for point in reversed(data_points):
                val_str = point.get('value', '0')
                try:
                    val = float(val_str)
                except ValueError:
                    val = 0
                
                threshold_crossed = False
                activity = None
                created_at = point.get('created_at')
                
                if sensor.sensor_type == 'temperature':
                    if val > 30:
                        if not is_above:
                            threshold_crossed = True
                            activity = {
                                "category": "CLIMATE",
                                "title": "High Temperature",
                                "description": f"{sensor.device.name} detected {val}°C.",
                                "time": created_at,
                                "theme": "climate"
                            }
                        is_above = True
                    else:
                        is_above = False
                        
                elif sensor.sensor_type == 'humidity':
                    if val > 60:
                        if not is_above:
                            threshold_crossed = True
                            activity = {
                                "category": "CLIMATE",
                                "title": "High Humidity",
                                "description": f"{sensor.device.name} detected {val}% humidity.",
                                "time": created_at,
                                "theme": "climate"
                            }
                        is_above = True
                    else:
                        is_above = False
                        
                elif sensor.sensor_type == 'earthquake':
                    # Every new entry in the earthquake feed is an event
                    activity = {
                        "category": "URGENT",
                        "title": "Earthquake Detected!",
                        "description": f"Seismic activity detected by {sensor.device.name}: {val_str}",
                        "time": created_at,
                        "theme": "urgent"
                    }
                    # We don't use 'is_above' here because each entry is a discrete event
                        
                elif sensor.sensor_type == 'security':
                    if val == 1:
                        if not is_above:
                            threshold_crossed = True
                            activity = {
                                "category": "SECURITY",
                                "title": "Intrusion Alert",
                                "description": f"Security breach detected by {sensor.device.name}.",
                                "time": created_at,
                                "theme": "security"
                            }
                        is_above = True
                    else:
                        is_above = False
                
                if activity:
                    all_activities.append(activity)
        except Exception as e:
            print(f"Error fetching activities for {sensor.feed_name}: {e}")
            continue

    # Sort by time descending
    all_activities.sort(key=lambda x: x['time'], reverse=True)
    
    return all_activities[:limit]
