from pydantic import BaseModel
from datetime import date, time
from app.schemas.place_schema import PlaceResponse
from app.schemas.user_schema import UserResponse

class AttendanceEntrance(BaseModel):
    place_id:int 

    class Config:
        orm_mode = True

class AttendanceResponse(BaseModel):
    id: int
    """ user_id: str """
    user: UserResponse
    """ place_id: int """
    place: PlaceResponse
    work_date: date
    entry_time: time
    exit_time: time | None
    total_hours: float | None
    face_verified: str

    class Config:
        orm_mode = True

