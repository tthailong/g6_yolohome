-- G6 YoloHome Database Initialization Script
-- This script creates the database, tables, and populates them with initial data
-- for a ready-to-use development environment.

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS g6yolohome;
USE g6yolohome;

-- Disable foreign key checks for clean table drops and creation
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop Tables if they exist (Clean Start)
DROP TABLE IF EXISTS sensors;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS device_types;
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
    role ENUM('owner', 'member') NOT NULL DEFAULT 'member',
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

ALTER TABLE sensors
    ADD CONSTRAINT fk_sensor_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Insert Initial Data
-- All passwords are set to 'password' hashed with bcrypt: $2b$12$Bqb2axk3PGOD6pJTmzM.8.cqgzrn24bitbj0edwfUjiOLdh9A.c4i

-- 4.1 Admin Account
INSERT IGNORE INTO admin (id, username, password) 
VALUES (1, 'adminapp', '$2b$12$Bqb2axk3PGOD6pJTmzM.8.cqgzrn24bitbj0edwfUjiOLdh9A.c4i');

-- 4.2 Main User (Owner)
INSERT IGNORE INTO users (id, username, role, email, phone, password, admin_id) 
VALUES (1, 'hailong', 'owner', 'superlongblue@gmail.com', '0123456789', '$2b$12$Bqb2axk3PGOD6pJTmzM.8.cqgzrn24bitbj0edwfUjiOLdh9A.c4i', 1);

-- 4.3 Default Home
-- Note: User needs to update adafruit credentials here
INSERT IGNORE INTO home (id, name, adafruitiokey, adafruitiouser, owner_id)
VALUES (1, 'newhome', 'YOUR_ADAFRUIT_IO_KEY', 'YOUR_ADAFRUIT_IO_USERNAME', 1);

-- 4.4 Device Types
INSERT IGNORE INTO device_types (id, type_name, icon_url, admin_id) VALUES 
(1, 'Environment Sensor', 'https://img.icons8.com/color/48/000000/temperature--v1.png', 1),
(2, 'Light Control', 'https://img.icons8.com/color/48/000000/light-dimming.png', 1),
(3, 'Security System', 'https://img.icons8.com/color/48/000000/shield.png', 1);

-- 4.5 Devices
INSERT IGNORE INTO devices (id, name, device_type_id, home_id, owner_id) VALUES
(1, 'Living Room DHT20', 1, 1, 1),
(2, 'Smart LED', 2, 1, 1),
(3, 'Main Entrance Security', 3, 1, 1);

-- 4.6 Sensors and Feeds
INSERT IGNORE INTO sensors (id, device_id, sensor_type, feed_name) VALUES
(1, 1, 'temperature', 'dadn.dht20-temperature'),
(2, 1, 'humidity', 'dadn.dht20-humidity'),
(3, 2, 'led', 'dadn.led-state'),
(6, 2, 'brightness', 'dadn.led-sate'),
(5, 3, 'earthquake', 'dadn.earthquake-detected');
