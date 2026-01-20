from sqlalchemy.orm import Session
from app.models.place import Place

class PlaceRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_place_by_id(self, place_id: int) -> Place:
        return self.db.query(Place).filter(Place.id == place_id).first()

    def get_all_places(self) -> list[Place]:
        return self.db.query(Place).all()
    
    def create_place(self, place: Place) -> Place:
        self.db.add(place)
        self.db.commit()
        self.db.refresh(place)
        return place