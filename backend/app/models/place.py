from app.config.db_config import Base

class Place(Base):

    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    latitude = Column(String, nullable=False)
    longitude = Column(String, nullable=False)
    radius_meters = Column(Integer, default=50)  # área válida