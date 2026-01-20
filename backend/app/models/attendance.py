from sqlalchemy import Column, Integer, Date, Time, Float, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String
from app.config.db_config import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False)

    work_date = Column(Date, nullable=False)        # Día trabajado
    entry_time = Column(Time, nullable=False)       # Hora de entrada
    exit_time = Column(Time, nullable=True)         # Hora de salida

    total_hours = Column(Float, nullable=True)      # Horas trabajadas

    face_verified = Column(String, default="yes")   # Validación Rekognition

    user = relationship("User")
    place = relationship("Place")
