from database import SessionLocal
import models

def setup_sensors():
    db = SessionLocal()
    try:
        # Home 1 is the main home
        home = db.query(models.Home).filter(models.Home.id == 1).first()
        if not home:
            print("Home 1 not found!")
            return

        # Ensure Temperature Sensor
        temp_sensor = db.query(models.Sensor).filter(models.Sensor.sensor_type == "temperature").first()
        if not temp_sensor:
            # Find or create a device to attach it to
            device = db.query(models.Device).filter(models.Device.home_id == home.id, models.Device.name.contains("DHT20")).first()
            if not device:
                # Need a device type
                dt = db.query(models.DeviceType).filter(models.DeviceType.type_name == "Environment Sensor").first()
                if not dt:
                    dt = models.DeviceType(type_name="Environment Sensor", admin_id=1)
                    db.add(dt)
                    db.commit()
                    db.refresh(dt)
                
                device = models.Device(name="DHT20 Monitor", home_id=home.id, device_type_id=dt.id, owner_id=home.owner_id)
                db.add(device)
                db.commit()
                db.refresh(device)
            
            temp_sensor = models.Sensor(device_id=device.id, sensor_type="temperature", feed_name="dadn.dht20-temperature")
            db.add(temp_sensor)
            
        # Ensure Humidity Sensor
        humid_sensor = db.query(models.Sensor).filter(models.Sensor.sensor_type == "humidity").first()
        if not humid_sensor:
            device = db.query(models.Device).filter(models.Device.home_id == home.id, models.Device.name.contains("DHT20")).first()
            humid_sensor = models.Sensor(device_id=device.id, sensor_type="humidity", feed_name="dadn.dht20-humidity")
            db.add(humid_sensor)

        db.commit()
        print("Temperature and Humidity sensors registered successfully!")
        
    finally:
        db.close()

if __name__ == "__main__":
    setup_sensors()
