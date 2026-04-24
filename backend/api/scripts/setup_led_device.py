from database import SessionLocal
import models

def setup_led():
    db = SessionLocal()
    try:
        # Find user hailong
        user = db.query(models.User).filter(models.User.username == "hailong").first()
        if not user:
            print("User hailong not found! Creating...")
            user = models.User(username="hailong", email="hailong@example.com", phone="0123456789", password="password")
            db.add(user)
            db.commit()
            db.refresh(user)

        # Ensure Home for hailong or use Home 1
        home = db.query(models.Home).filter(models.Home.id == 1).first()
        if not home:
            print("Home 1 not found!")
            return

        # Ensure LED Device Type
        dt = db.query(models.DeviceType).filter(models.DeviceType.type_name == "Light Control").first()
        if not dt:
            dt = models.DeviceType(type_name="Light Control", admin_id=1)
            db.add(dt)
            db.commit()
            db.refresh(dt)

        # Ensure LED Device
        device = db.query(models.Device).filter(models.Device.home_id == home.id, models.Device.name == "Smart LED").first()
        if not device:
            device = models.Device(name="Smart LED", home_id=home.id, device_type_id=dt.id, owner_id=user.id)
            db.add(device)
            db.commit()
            db.refresh(device)

        # Ensure LED State Sensor/Actuator Feed
        sensor = db.query(models.Sensor).filter(models.Sensor.device_id == device.id, models.Sensor.feed_name == "dadn.led-state").first()
        if not sensor:
            sensor = models.Sensor(device_id=device.id, sensor_type="led", feed_name="dadn.led-state")
            db.add(sensor)

        db.commit()
        print("LED device registered for user hailong successfully!")
        
    finally:
        db.close()

if __name__ == "__main__":
    setup_led()
