from app.models.attendance import Attendance
from fastapi import UploadFile
from app.schemas.attendance_schema import AttendanceEntrance, AttendanceResponse
from app.repositories.attendance_repository import AttendanceRepository
from sqlalchemy.orm import Session
from datetime import date, datetime, time, timedelta
from typing import List
from app.services.rekognition_service import RekognitionService

class AttendanceService:

    def __init__(self, db:Session):
        self.db = db
        self.attendance_repository = AttendanceRepository(self.db)
        self.rekognition_service = RekognitionService()
        self.collection_id="users_collection"

    def create_attendance_entrance(self, data:AttendanceEntrance, user_id:str,image:UploadFile) -> AttendanceResponse:
        try:

            if image is None:
                raise ValueError('you must to upload a image')
            
            image_bytes=image.file.read()
            
            face_id=self.rekognition_service.search_face(self.collection_id,
                                                         image_bytes=image_bytes)
            
            if not face_id:
                raise ValueError('your face doesnt coincide with the facial rekognition')
            
            # we ask if the user check the entrance
            existing_entrance=self.attendance_repository.get_actual_attendance_user_id(user_id)

            if existing_entrance and existing_entrance.entry_time:
                raise ValueError(
                    f'you cant check the entrance, because you checked at {existing_entrance.entry_time}'
                )
            
            attendance_create=Attendance(
                user_id=user_id,
                place_id=data.place_id,
                work_date=date.today(),
                entry_time=datetime.now().time(),
                exit_time=None,
                total_hours=0,
                face_verified=face_id
            )

            attendance_data=self.attendance_repository.create_attendance(attendance_create)

            if not attendance_data:
                raise ValueError('we cant create the attendance')
            
            return attendance_data

        except Exception as e:
            raise e
    
    def create_attendance_exit(self, user_id:str, image:UploadFile) -> AttendanceResponse:
        try:

            actual_attendance=self.attendance_repository.get_attendance_today_user_id(user_id=user_id)

            if not actual_attendance:
                raise ValueError('You already checked out')
            
            image_bytes=image.file.read()
            
            facial_id=self.rekognition_service.search_face(self.collection_id,
                                                           image_bytes=image_bytes)
            
            if not facial_id:
                raise ValueError('we dont rekognition your face id')
            
            """ existing_exit=self.attendance_repository.get_actual_attendance_user_id(user_id)

            # we ask if the user check the exit
            if existing_exit.exit_time is not None:
                raise ValueError(f'you cant check the exit, because you check the exit at {existing_exit.exit_time}') """
            
            # we get the actual date that the user leave or get out
            actual_date=datetime.now().time()

            actual_attendance.exit_time=actual_date

            entry = actual_attendance.entry_time
            exit = actual_attendance.exit_time

            entry_dt = datetime.combine(date.today(), entry)
            exit_dt = datetime.combine(date.today(), exit)

            diff = exit_dt - entry_dt
            actual_attendance.total_hours = round(diff.total_seconds() / 3600, 2)

            attendance_updated=self.attendance_repository.update_attendance(actual_attendance)

            if not attendance_updated:
                raise ValueError('we cant check your leave')
            
            return attendance_updated
        except Exception as e:
            raise e
    
    def get_attendance_by_user_id(self, user_id:str) -> List[AttendanceResponse]:
        attendance=self.attendance_repository.get_attendance_by_user_id(user_id)

        if not attendance:
            return None
        
        return attendance
    
    def get_all_attendance(self) -> List[AttendanceResponse]:
        attendances=self.attendance_repository.get_all_attendance()

        if not attendances:
            return None
        
        return attendances



