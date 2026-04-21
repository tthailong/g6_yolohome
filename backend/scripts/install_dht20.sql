-- Manual Installation Script for DHT20 (Yolo:Bit)
-- This script sets up 1 physical device with 2 Adafruit feeds.

USE g6yolohome;

-- 1. Ensure the 'DHT20' device type exists
INSERT IGNORE INTO device_types (type_name, icon_url, admin_id) 
VALUES ('DHT20', 'https://img.icons8.com/color/48/000000/temperature--v1.png', 1);

-- 2. Add the physical device to your latest home
SET @latest_owner = (SELECT id FROM users ORDER BY id DESC LIMIT 1);
SET @latest_home  = (SELECT id FROM home WHERE owner_id = @latest_owner ORDER BY id DESC LIMIT 1);

INSERT INTO devices (name, device_type_id, home_id, owner_id)
VALUES ('Living Room DHT20', (SELECT id FROM device_types WHERE type_name='DHT20' LIMIT 1), @latest_home, @latest_owner);

-- 3. Add the two sensors/feeds for this device
-- We use the ID of the device we just created
SET @device_id = LAST_INSERT_ID();

INSERT INTO sensors (device_id, sensor_type, feed_name)
VALUES 
(@device_id, 'temperature', 'dadn.dht20-temperature'),
(@device_id, 'humidity', 'dadn.dht20-humidity');

-- Verification
SELECT d.name as Device, s.sensor_type, s.feed_name 
FROM devices d 
JOIN sensors s ON d.id = s.device_id
WHERE d.id = @device_id;
