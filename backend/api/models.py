from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum, DateTime, text
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

# --- Enums ---
class UserHomeRole(str, enum.Enum):
    owner = "Owner"
    manager = "Manager"
    member = "Member"

class UserHomeStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

# --- Database Models (SQLAlchemy) ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    admin_id = Column(Integer, ForeignKey("admin.id"), nullable=True)

    # Relationships
    admin = relationship("Admin", back_populates="users")
    devices = relationship("Device", back_populates="owner")

class Home(Base):
    __tablename__ = "home"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    adafruitiokey = Column(String(255), nullable=False)
    adafruitiouser = Column(String(255), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    owner = relationship("User")
    devices = relationship("Device", back_populates="home")

class UserHome(Base):
    __tablename__ = "live_in"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    home_id = Column(Integer, ForeignKey("home.id", ondelete="CASCADE"), nullable=False)
    role = Column(Enum(UserHomeRole, values_callable=lambda x: [e.value for e in x]), default=UserHomeRole.member, nullable=False)
    status = Column(Enum(UserHomeStatus), default=UserHomeStatus.pending, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    user = relationship("User", backref="user_home_associations")
    home = relationship("Home", backref="user_home_associations")

class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    users = relationship("User", back_populates="admin")
    device_types = relationship("DeviceType", back_populates="admin")

class DeviceType(Base):
    __tablename__ = "device_types"

    id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String(50), nullable=False)
    icon_url = Column(String(255), nullable=True)
    admin_id = Column(Integer, ForeignKey("admin.id"))

    # Relationships
    admin = relationship("Admin", back_populates="device_types")
    devices = relationship("Device", back_populates="device_type")

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    device_type_id = Column(Integer, ForeignKey("device_types.id"))
    home_id = Column(Integer, ForeignKey("home.id", ondelete="CASCADE"))
    owner_id = Column(Integer, ForeignKey("users.id")) # Unified owner reference
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    home = relationship("Home", back_populates="devices")
    device_type = relationship("DeviceType", back_populates="devices")
    owner = relationship("User", back_populates="devices")
    sensors = relationship("Sensor", back_populates="device", cascade="all, delete-orphan")
    cameras = relationship("Camera", back_populates="device", cascade="all, delete-orphan")

class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id", ondelete="CASCADE"), nullable=False)
    sensor_type = Column(String(50), nullable=False) # e.g., 'temperature', 'humidity'
    feed_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    device = relationship("Device", back_populates="sensors")

class Camera(Base):
    __tablename__ = "camera"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id", ondelete="CASCADE"), nullable=False)
    url = Column(String(500), nullable=False)
    person_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    device = relationship("Device", back_populates="cameras")

