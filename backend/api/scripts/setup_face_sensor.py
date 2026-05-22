from database import SessionLocal
import models

def setup_face_sensor():
    db = SessionLocal()
    try:
        # Check if the face sensor is already registered
        face_sensor = db.query(models.Sensor).filter(models.Sensor.feed_name == "dadn.face-detect").first()
        if face_sensor:
            print("Face detection sensor already registered in the database!")
            return

        # Find the Main Door Lock device (normally device_id=5, or contains 'Door')
        device = db.query(models.Device).filter(models.Device.id == 5).first()
        if not device:
            device = db.query(models.Device).filter(models.Device.name.contains("Door")).first()
            
        if not device:
            print("Main Door Lock device not found! Cannot register face sensor.")
            return

        # Register the new face sensor feed under this device
        face_sensor = models.Sensor(
            device_id=device.id,
            sensor_type="face",
            feed_name="dadn.face-detect"
        )
        db.add(face_sensor)
        db.commit()
        print(f"Face sensor 'dadn.face-detect' registered successfully under device '{device.name}' (ID: {device.id})!")
        
    except Exception as e:
        print(f"Error registering face sensor: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    setup_face_sensor()
