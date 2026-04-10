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
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    supervisor_id INT,
    admin_id INT
);

CREATE TABLE IF NOT EXISTS home (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    owner_id INT
);

CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    home_id INT,
    admin_id INT
);

-- 3. Thêm các Foreign Key (Deferred Constraints)

ALTER TABLE users 
    ADD CONSTRAINT fk_user_supervisor FOREIGN KEY (supervisor_id) REFERENCES users(id),
    ADD CONSTRAINT fk_user_admin FOREIGN KEY (admin_id) REFERENCES admin(id);

ALTER TABLE home 
    ADD CONSTRAINT fk_home_owner FOREIGN KEY (owner_id) REFERENCES users(id);

ALTER TABLE devices 
    ADD CONSTRAINT fk_device_home FOREIGN KEY (home_id) REFERENCES home(id),
    ADD CONSTRAINT fk_device_admin FOREIGN KEY (admin_id) REFERENCES admin(id);

-- 4. Thêm dữ liệu mẫu (Sử dụng INSERT IGNORE để tránh lỗi trùng lặp)

-- INSERT IGNORE INTO users (username, password) VALUES ('admin', 'hashed_password_here');
-- INSERT IGNORE INTO devices (name, status, home_id) VALUES ('Smart Lamp', false, 1);
