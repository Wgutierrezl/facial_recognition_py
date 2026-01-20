from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.config.db_config import Base

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)
    role_id = Column(Integer, ForeignKey("roles.id"))
    area_id = Column(Integer, ForeignKey("areas.id"))
    place_id = Column(Integer, ForeignKey("places.id"))

    face_id = Column(String, unique=True, nullable=False)

    role = relationship("Role")
    area = relationship("Area")
    place = relationship("Place")