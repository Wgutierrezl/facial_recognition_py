from pydantic import BaseModel
from datetime import date, time
from app.schemas.place_schema import PlaceResponse
from app.schemas.user_schema import UserResponse
from typing import Optional

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

class AttendanceFilter(BaseModel):
    user_id:Optional[str] = None
    place_id:Optional[int] = None
    area_id:Optional[int] = None
    start_date: Optional[date] = None
    end_date:Optional[date] = None

class AttendanceReport(BaseModel):
    user_name:str
    place_name:str
    area_name:str
    work_date: date
    entry_time: time
    exit_time: time | None
    total_hours: float | None

    class Config:
        orm_mode = True


