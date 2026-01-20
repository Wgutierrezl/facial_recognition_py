from sqlalchemy.orm import Session
from app.models.area import Area

class AreaRepository:

    def __init__(self, db:Session):
        self.db = db

    def get_area_by_id(self, area_id: int) -> Area:
        return self.db.query(Area).filter(Area.id == area_id).first()

    def get_all_areas(self) -> list[Area]:
        return self.db.query(Area).all()

    def create_area(self, area:Area) -> Area:
        self.db.add(area)
        self.db.commit()
        self.db.refresh(area)
        return area