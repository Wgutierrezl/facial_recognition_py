from typing import List
from app.repositories.place_repository import PlaceRepository
from app.models.place import Place
from app.schemas.place_schema import PlaceCreated, PlaceResponse
from sqlalchemy.orm import Session

class PlaceService:

    def __init__(self, db:Session):
        self.db = db
        self.place_repository = PlaceRepository(db)
    
    def get_place_by_id(self, place_id:int) -> PlaceResponse | None:
        place = self.place_repository.get_place_by_id(place_id)
        if not place:
            return None
        
        return place

    def get_all_places(self) -> List[PlaceResponse]:
        places = self.place_repository.get_all_places()
        if not places:
            return []
        
        return places

    def create_place(self, data:PlaceCreated) -> PlaceResponse:
        place = Place(
            name=data.name,
            latitude=data.latitude,
            longitude=data.longitude,
            radius_meters=data.radius_meters
        )

        place_created = self.place_repository.create_place(place)
        if not place_created:
            return None
        
        return place_created