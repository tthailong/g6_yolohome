from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum, DateTime, text
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

# --- Enums ---
class UserRole(str, enum.Enum):
    owner = "owner"
    member = "member"

# --- Database Models (SQLAlchemy) ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.member, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    supervisor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    admin_id = Column(Integer, ForeignKey("admin.id"), nullable=True)

    # Relationships
    supervisor = relationship("User", remote_side=[id], backref="subordinates")
    admin = relationship("Admin", back_populates="users")
    homes = relationship("Home", back_populates="owner")

class Home(Base):
    __tablename__ = "home"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    adafruitiokey = Column(String(255), nullable=False)
    adafruitiouser = Column(String(255), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    owner = relationship("User", back_populates="homes")
    devices = relationship("Device", back_populates="home")

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
    adafruit_feed_name = Column(String(100), nullable=False)
    home_id = Column(Integer, ForeignKey("home.id", ondelete="CASCADE"))
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    home = relationship("Home", back_populates="devices")
    device_type = relationship("DeviceType", back_populates="devices")
