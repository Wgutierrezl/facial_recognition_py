from pydantic import BaseModel
from datetime import date, time

class AttendanceEntrance(BaseModel):
    place_id:int 

    class Config:
        orm_mode = True

class AttendanceResponse(BaseModel):
    id: int
    user_id: str
    place_id: int
    work_date: date
    entry_time: time
    exit_time: time | None
    total_hours: float | None
    face_verified: str

    class Config:
        orm_mode = True

