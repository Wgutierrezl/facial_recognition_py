from typing import List
from app.models.attendance import Attendance
from datetime import date
from sqlalchemy.orm import Session, joinedload
from app.models.attendance import Attendance
from app.models.user import User
from app.schemas.attendance_schema import AttendanceResponse, AttendanceFilter, AttendanceReport

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
    
    def get_actual_attendance_user_id(self, user_id:str) -> AttendanceResponse:
        return self.db.query(Attendance).filter(Attendance.user_id==user_id,
                                                Attendance.work_date==date.today()).first()
    
    def get_all_attendance(self) ->List[AttendanceResponse]:
        return (
            self.db.query(Attendance)
                .options(joinedload(Attendance.user),
                        joinedload(Attendance.place))
                .all()
        )

    def get_report_attendances(self, data:AttendanceFilter):
        query= (
            self.db.query(Attendance)
                .options(
                    joinedload(Attendance.user)
                    .joinedload(User.area),
                    joinedload(Attendance.place),
                    )
            )

        if data.user_id:
            query=query.filter(Attendance.user_id == data.user_id)
        
        if data.place_id:
            query=query.filter(Attendance.place_id == data.place_id)

        if data.area_id:
            query=query.filter(User.area_id == data.area_id)
        
        if data.start_date:
            query=query.filter(Attendance.work_date>= data.start_date)
        
        if data.end_date:
            query=query.filter(Attendance.work_date <= data.end_date)

        return query.all()
    
    
    
    
    