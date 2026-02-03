from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from uuid import uuid4
from app.config.db_config import Base

class User(Base):

    __tablename__ = "users"

    user_id = Column(String(100), primary_key=True, default=lambda:str(uuid4()))
    name = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(100), nullable=True)
    role_id = Column(Integer, ForeignKey("roles.id"))
    area_id = Column(Integer, ForeignKey("areas.id"))
    place_id = Column(Integer, ForeignKey("places.id"))

    face_id = Column(String(100), unique=True, nullable=False)

    role = relationship("Role")
    area = relationship("Area")
    place = relationship("Place")