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
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    # New columns
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
    owner_id = Column(Integer, ForeignKey("users.id"))

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
    devices = relationship("Device", back_populates="admin")

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    status = Column(Boolean, default=False)
    home_id = Column(Integer, ForeignKey("home.id"))
    admin_id = Column(Integer, ForeignKey("admin.id"))

    # Relationships
    home = relationship("Home", back_populates="devices")
    admin = relationship("Admin", back_populates="devices")
