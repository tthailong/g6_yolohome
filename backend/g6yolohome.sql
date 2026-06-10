-- G6 YoloHome Database Initialization Script
-- This script creates the database, tables, and populates them with initial data
-- for a ready-to-use development environment.

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS g6yolohome;
USE g6yolohome;

-- Disable foreign key checks for clean table drops and creation
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop Tables if they exist (Clean Start)
DROP TABLE IF EXISTS camera;
DROP TABLE IF EXISTS sensors;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS device_types;
DROP TABLE IF EXISTS live_in;
DROP TABLE IF EXISTS home;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS admin;

-- 3. Create Tables

CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    supervisor_id INT,
    admin_id INT
);

CREATE TABLE home (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    adafruitiokey VARCHAR(255) NOT NULL,
    adafruitiouser VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_id INT
);

CREATE TABLE live_in (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    home_id INT NOT NULL,
    role ENUM('Owner', 'Manager', 'Member') NOT NULL DEFAULT 'Member',
    status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_uh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_uh_home FOREIGN KEY (home_id) REFERENCES home(id) ON DELETE CASCADE
);

CREATE TABLE device_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    icon_url VARCHAR(255),
    admin_id INT
);

CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    device_type_id INT,
    home_id INT,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sensors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    sensor_type VARCHAR(50) NOT NULL, -- 'temperature', 'humidity', 'led', 'security', etc.
    feed_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Add Foreign Key Constraints

ALTER TABLE users
    ADD CONSTRAINT fk_user_supervisor FOREIGN KEY (supervisor_id) REFERENCES users(id),
    ADD CONSTRAINT fk_user_admin FOREIGN KEY (admin_id) REFERENCES admin(id);

ALTER TABLE home
    ADD CONSTRAINT fk_home_owner FOREIGN KEY (owner_id) REFERENCES users(id);

ALTER TABLE devices
    ADD CONSTRAINT fk_device_home FOREIGN KEY (home_id) REFERENCES home(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_device_type FOREIGN KEY (device_type_id) REFERENCES device_types(id),
    ADD CONSTRAINT fk_device_owner FOREIGN KEY (owner_id) REFERENCES users(id);

ALTER TABLE device_types
    ADD CONSTRAINT fk_type_admin FOREIGN KEY (admin_id) REFERENCES admin(id);

CREATE TABLE camera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    person_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE sensors
    ADD CONSTRAINT fk_sensor_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE;

ALTER TABLE camera
    ADD CONSTRAINT fk_camera_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Insert Initial Data
-- All passwords are set to 'password' hashed with bcrypt: $2b$12$Bqb2axk3PGOD6pJTmzM.8.cqgzrn24bitbj0edwfUjiOLdh9A.c4i

-- 4.1 Admin Account
INSERT IGNORE INTO admin (id, username, password) 
VALUES (1, 'adminapp', '$2b$12$Bqb2axk3PGOD6pJTmzM.8.cqgzrn24bitbj0edwfUjiOLdh9A.c4i');

-- 4.2 Main User (Owner)
INSERT IGNORE INTO users (id, username, email, phone, password, admin_id) 
VALUES (1, 'hailong', 'abc@gmail.com', '0123456789', '$2b$12$Bqb2axk3PGOD6pJTmzM.8.cqgzrn24bitbj0edwfUjiOLdh9A.c4i', 1);

-- 4.3 Default Home
-- Note: User needs to update adafruit credentials here
INSERT IGNORE INTO home (id, name, adafruitiokey, adafruitiouser, owner_id)
VALUES (1, 'newhome', 'YOUR_ADAFRUIT_IO_KEY', 'YOUR_ADAFRUIT_IO_USERNAME', 1);

-- 4.3.1 Seed User-Home relation (Owner accepted invitation)
INSERT IGNORE INTO live_in (user_id, home_id, role, status)
VALUES (1, 1, 'Owner', 'accepted');

-- 4.4 Device Types
INSERT IGNORE INTO device_types (id, type_name, icon_url, admin_id) VALUES 
(1, 'Environment Sensor', 'https://img.icons8.com/color/48/000000/temperature--v1.png', 1),
(2, 'Light Control', 'https://img.icons8.com/color/48/000000/light-dimming.png', 1),
(3, 'Hazard Alarm', 'https://img.icons8.com/color/48/000000/shield.png', 1),
(4, 'Fan Control', 'https://img.icons8.com/color/48/000000/fan.png', 1),
(5, 'Access Control', 'https://img.icons8.com/color/48/000000/security-lock.png', 1);

-- 4.5 Devices
INSERT IGNORE INTO devices (id, name, device_type_id, home_id, owner_id) VALUES
(1, 'Living Room DHT20', 1, 1, 1),
(2, 'Smart LED', 2, 1, 1),
(3, 'Earthquake Detector', 3, 1, 1),
(4, 'Ceiling Fan', 4, 1, 1),
(5, 'Main Door Lock', 5, 1, 1);

-- 4.6 Sensors and Feeds
INSERT IGNORE INTO sensors (id, device_id, sensor_type, feed_name) VALUES
(1, 1, 'temperature', 'dadn.dht20-temperature'),
(2, 1, 'humidity', 'dadn.dht20-humidity'),
(3, 2, 'led', 'dadn.led-state'),
(6, 2, 'brightness', 'dadn.led-sate'),
(5, 3, 'earthquake', 'dadn.earthquake-detected'),
(7, 4, 'fan', 'dadn.fan-state'),
(8, 4, 'speed', 'dadn.fan-speed'),
(9, 5, 'security', 'dadn.door-state');

-- 4.7 Camera Mock Data
INSERT IGNORE INTO camera (id, device_id, url, person_name, created_at) VALUES
(2, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780973929/yolohome_camera/osschwkvqng6acwsh38a.jpg', 'Stranger', '2026-06-09 09:58:50'),
(3, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780974338/yolohome_camera/kp36xomuugdrunuqudmc.jpg', 'Stranger', '2026-06-09 10:05:39'),
(4, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780974343/yolohome_camera/fgtsyk6ntkg0nvanjpvb.jpg', 'Long', '2026-06-09 10:05:45'),
(8, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780974408/yolohome_camera/edlax5bm8hcglxif5rd0.jpg', 'Thong', '2026-06-09 10:06:50'),
(9, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780974426/yolohome_camera/qhcq6gjkel0gthheoxgx.jpg', 'Stranger', '2026-06-09 10:07:07'),
(13, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780974480/yolohome_camera/mjz9dvxcs1deyocj9xac.jpg', 'Thong', '2026-06-09 10:08:01'),
(20, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780977273/yolohome_camera/uvgheicyyhnaotvq2fkz.jpg', 'Stranger', '2026-06-09 10:54:35'),
(21, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780984282/yolohome_camera/rbxw2zwqdyny9lvwywfe.jpg', 'Stranger', '2026-06-09 12:51:23'),
(22, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780984292/yolohome_camera/bwpkm6pju1di14jzrayi.jpg', 'Long', '2026-06-09 12:51:33'),
(23, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780984299/yolohome_camera/ckn9oi2mhqpep2nwnqay.jpg', 'Stranger', '2026-06-09 12:51:41'),
(24, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780987893/yolohome_camera/hmp69oj00xlwr7vvi2cy.jpg', 'Stranger', '2026-06-09 13:51:34'),
(25, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780987921/yolohome_camera/wjom9unabh3upyoqrhpn.jpg', 'Stranger', '2026-06-09 13:52:02'),
(26, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780987942/yolohome_camera/idotjubfzqtrrzrxhwu9.jpg', 'Thong', '2026-06-09 13:52:24'),
(27, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780987949/yolohome_camera/wzdrkeiefb8tf3hphc4j.jpg', 'Stranger', '2026-06-09 13:52:30'),
(28, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780987959/yolohome_camera/v0bpqxcq2gebpb3dgkue.jpg', 'Thong', '2026-06-09 13:52:40'),
(29, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780987966/yolohome_camera/qrdmycuepfmcaln9tbmn.jpg', 'Thong', '2026-06-09 13:52:48'),
(30, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780987977/yolohome_camera/naa85wj8kgvirumfjavd.jpg', 'Stranger', '2026-06-09 13:52:58'),
(31, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780987981/yolohome_camera/sqfggigohaxyic6jzidg.jpg', 'Thong', '2026-06-09 13:53:02'),
(32, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780987988/yolohome_camera/lzfyzlbb8wv03bmyck0g.jpg', 'Stranger', '2026-06-09 13:53:09'),
(33, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988014/yolohome_camera/viidxef7ymm0fmdbvwcr.jpg', 'Thong', '2026-06-09 13:53:36'),
(34, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988019/yolohome_camera/ccxqtepte0ulcrof9red.jpg', 'Stranger', '2026-06-09 13:53:40'),
(35, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988024/yolohome_camera/uox34gqyvtvhoqezwex5.jpg', 'Thong', '2026-06-09 13:53:45'),
(38, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988049/yolohome_camera/rxv7o6vcdfrlwlegrgyl.jpg', 'Stranger', '2026-06-09 13:54:11'),
(39, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988073/yolohome_camera/qai9ccgddinzpgwaalbg.jpg', 'Thong', '2026-06-09 13:54:35'),
(40, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988087/yolohome_camera/mokrdgeuo0eumo6d7isy.jpg', 'Stranger', '2026-06-09 13:54:48'),
(41, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988096/yolohome_camera/lioc2hzwebya4yoae273.jpg', 'Thong', '2026-06-09 13:54:57'),
(42, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988102/yolohome_camera/f7szxp5o6wreookbhb0z.jpg', 'Stranger', '2026-06-09 13:55:03'),
(43, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988127/yolohome_camera/utzhkbmltyfn8wkmh9dv.jpg', 'Thong', '2026-06-09 13:55:28'),
(44, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988133/yolohome_camera/cmrzkcglrsyhuftvh5g2.jpg', 'Stranger', '2026-06-09 13:55:34'),
(45, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988165/yolohome_camera/ajqp3amkchtfjy5ebguf.jpg', 'Stranger', '2026-06-09 13:56:06'),
(47, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988273/yolohome_camera/pl3tckp36tnnzwmsqgha.jpg', 'Stranger', '2026-06-09 13:57:54'),
(48, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988310/yolohome_camera/ra4vzw4i1aoghd6khh2r.jpg', 'Stranger', '2026-06-09 13:58:31'),
(52, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988384/yolohome_camera/iaxqumgwuaqoyyqxxwta.jpg', 'Long', '2026-06-09 13:59:45'),
(53, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988389/yolohome_camera/wgjvow29t3wh23qi9pbx.jpg', 'Stranger', '2026-06-09 13:59:50'),
(56, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780988454/yolohome_camera/qvnfew8nd0qlvw3pjvzx.jpg', 'Background', '2026-06-09 14:00:56'),
(61, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780989348/yolohome_camera/p1lfckvdpzvzaibbliv5.jpg', 'Long', '2026-06-09 14:15:49'),
(64, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780989523/yolohome_camera/purlwtjejdzd7032kq5h.jpg', 'Background', '2026-06-09 14:18:45'),
(65, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780989524/yolohome_camera/shmlz22at1naswa3jhca.jpg', 'Background', '2026-06-09 14:18:46'),
(66, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780989529/yolohome_camera/v2lcb1wkrmb4nun2u1tf.jpg', 'Stranger', '2026-06-09 14:18:50'),
(70, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780989994/yolohome_camera/p9ojpxylkihekbdaqdrc.jpg', 'Stranger', '2026-06-09 14:26:35'),
(71, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780990055/yolohome_camera/ud7jgilrs72eamw4kiz4.jpg', 'Stranger', '2026-06-09 14:27:36'),
(72, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780990103/yolohome_camera/zxhbubfgnswtc3j57gv8.jpg', 'Stranger', '2026-06-09 14:28:24'),
(73, 5, 'https://res.cloudinary.com/df3elakqp/image/upload/v1780990132/yolohome_camera/xync9ilvpmnayphy1yal.jpg', 'Stranger', '2026-06-09 14:28:54');
