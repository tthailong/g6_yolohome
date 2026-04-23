-- 1. Tạo cơ sở dữ liệu nếu chưa có
CREATE DATABASE IF NOT EXISTS g6yolohome;
USE g6yolohome;

-- 2. Tạo các bảng (Chưa có Foreign Keys)

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS home (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    adafruitiokey VARCHAR(255) NOT NULL,
    adafruitiouser VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_id INT
);

CREATE TABLE IF NOT EXISTS device_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL, -- Ví dụ: 'Light', 'Temperature', 'Humi'
    icon_url VARCHAR(255),          -- Để Frontend hiển thị icon tương ứng
    admin_id INT
);

-- 2. Thiết bị thực tế trong nhà của User
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,      -- Tên User đặt: 'Đèn phòng ngủ'
    device_type_id INT,              -- Liên kết tới loại thiết bị của Admin
    home_id INT,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.1 Cảm biến/Feed Adafruit (Một thiết bị có thể có nhiều sensors)
CREATE TABLE IF NOT EXISTS sensors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    sensor_type VARCHAR(50) NOT NULL, -- 'temperature', 'humidity', 'light'
    feed_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sensor_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

-- 3. Thêm các Foreign Key (Deferred Constraints)

ALTER TABLE users 
    ADD CONSTRAINT fk_user_supervisor FOREIGN KEY (supervisor_id) REFERENCES users(id),
    ADD CONSTRAINT fk_user_admin FOREIGN KEY (admin_id) REFERENCES admin(id);

ALTER TABLE home 
    ADD CONSTRAINT fk_home_owner FOREIGN KEY (owner_id) REFERENCES users(id);

ALTER TABLE devices 
    ADD CONSTRAINT fk_device_home FOREIGN KEY (home_id) REFERENCES home(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_device_type FOREIGN KEY (device_type_id) REFERENCES device_types(id);

ALTER TABLE device_types
    ADD CONSTRAINT fk_type_admin FOREIGN KEY (admin_id) REFERENCES admin(id);
-- 4. Thêm dữ liệu mẫu (Sử dụng INSERT IGNORE để tránh lỗi trùng lặp)

INSERT INTO admin (username, password) VALUES ('adminapp', 'adminapp');
-- INSERT INTO users (username, role, email, phone, password, supervisor_id, admin_id) VALUES ('hailong', 'owner', 'superlongblue@gmail.com', '0123456789', 'hashed_password', NULL, 1);
-- INSERT IGNORE INTO users (username, password) VALUES ('admin', 'hashed_password_here');
-- INSERT IGNORE INTO devices (name, status, home_id) VALUES ('Smart Lamp', false, 1);
