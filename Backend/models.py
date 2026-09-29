from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    active = Column(Boolean, default=True)
    owner_id = Column(Integer) # which user created it

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)