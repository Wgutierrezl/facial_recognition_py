from pydantic import BaseModel
from datetime import date

class AttendanceEntrance(BaseModel):
    user_id:str
    place_id:int
    work_date:date
    entry_time = date     
    face_verified = str

    class Config:
        orm_mode = True

class AttendanceExit(BaseModel):
    user_id:str
    place_id:int
    work_date:date
    exit_time = date     
    total_hours = float
    face_verified = str
    
    class Config:
        orm_mode = True

class AttendanceResponse(BaseModel):
    id: int
    user_id: int
    place_id: int
    work_date: date
    entry_time: str
    exit_time: str | None
    total_hours: float | None
    face_verified: str

    class Config:
        orm_mode = True

