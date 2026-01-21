from typing import List
from app.models.attendance import Attendance
from datetime import date
from sqlalchemy.orm import Session, joinedload
from app.models.attendance import Attendance
from app.schemas.attendance_schema import AttendanceResponse

class AttendanceRepository:

    def __init__(self, db:Session):
        self.db = db

    def create_attendance(self, attendance:Attendance) -> AttendanceResponse:
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def get_attendance_by_user_id(self, user_id:str) -> List[AttendanceResponse]:
        return (
            self.db.query(Attendance)
                .options(joinedload(Attendance.user), 
                         joinedload(Attendance.place))
                .filter(Attendance.user_id == user_id).all()
        )

    def get_attendance_by_place_id(self, place_id:int) -> List[AttendanceResponse]:
        return (
            self.db.query(Attendance)
            .options(joinedload(Attendance.user), 
                     joinedload(Attendance.place))
            .filter(Attendance.place_id == place_id).all()
        )

    def update_attendance(self, attendance:Attendance) -> AttendanceResponse:
        self.db.commit()
        self.db.refresh(attendance)
        return attendance
    
    def get_attendance_today_user_id(self, user_id:str) -> AttendanceResponse:
        return self.db.query(Attendance).filter(Attendance.user_id==user_id,
                                                Attendance.work_date==date.today(),
                                                Attendance.exit_time==None).first()
    
    
    