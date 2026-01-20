from typing import List
from app.repositories.area_repository import AreaRepository
from app.models.area import Area
from app.schemas.area_schema import AreaCreated, AreaResponse
from sqlalchemy.orm import Session

class AreaService:

    def __init__(self, db:Session):
        self.db = db
        self.area_repository = AreaRepository(db)
    
    def get_area_by_id(self, area_id:int) -> AreaResponse | None:
        area = self.area_repository.get_area_by_id(area_id)
        if not area:
            return None
        
        return area
    
    def get_all_areas(self) -> List[AreaResponse]:
        areas = self.area_repository.get_all_areas()
        if not areas:
            return []
        
        return areas

    def create_area(self, data:AreaCreated) -> AreaResponse:
        area = Area(
            name=data.name,
        )

        area_created = self.area_repository.create_area(area)
        if not area_created:
            return None
        
        return area_created