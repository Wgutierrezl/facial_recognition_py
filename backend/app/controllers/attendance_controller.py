from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.schemas.attendance_schema import AttendanceEntrance, AttendanceResponse
from app.dependencie.db_dependencie import get_db
from app.dependencie.jwt_dependencie import get_current_user
from app.dependencie.role_dependencie import require_roles
from app.services.rekognition_service import RekognitionService
from app.services.attendance_service import AttendanceService

router=APIRouter(prefix='/attendance',
                 tags=['Attendance'],
                 dependencies=[Depends(get_current_user)])


@router.post('/registerEntrance', response_model=AttendanceResponse)
def register_entrance(
    place_id:int=Form(...),
    image: UploadFile = File(...),
    db:Session=Depends(get_db),
    current_user:dict=Depends(get_current_user)
) -> AttendanceResponse:
    
    try:
        attendance_create=AttendanceEntrance(
            place_id=place_id
        )

        attendance_service=AttendanceService(db)

        attendance=attendance_service.create_attendance_entrance(attendance_create,
                                                                 current_user['user_id'],
                                                                 image)
        
        if not attendance:
            raise HTTPException(status_code=400, detail='we cant create the attendance')
        
        return attendance
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")


@router.post('/registerExit', response_model=AttendanceResponse)
def register_exit(
    image: UploadFile=File(...),
    db:Session=Depends(get_db),
    current_user:dict=Depends(get_current_user)
) -> AttendanceResponse:
    
    try:

        attendance_service=AttendanceService(db)

        attendance_exit=attendance_service.create_attendance_exit(current_user['user_id'],image=image)

        if not attendance_exit:
            raise HTTPException(status_code=400, detail='we cant create the attendance exit')
        
        return attendance_exit
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")