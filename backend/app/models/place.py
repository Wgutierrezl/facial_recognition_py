from app.config.db_config import Base
from sqlalchemy import Column, Integer, String
class Place(Base):

    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    latitude = Column(String(100), nullable=False)
    longitude = Column(String(100), nullable=False)
    radius_meters = Column(Integer, default=50)  # área válida