from typing import List
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
    
@router.get('/getMyAttendance', response_model=List[AttendanceResponse])
def get_my_attendance(db:Session=Depends(get_db),
                      current_user:dict=Depends(get_current_user)) -> List[AttendanceResponse]:
    try:

        _service=AttendanceService(db)

        attendance=_service.get_attendance_by_user_id(current_user['user_id'])

        if not attendance:
            raise HTTPException(status_code=404, detail='you dont have attendance')
        
        return attendance
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")
    
@router.get('/getAttendanceByUserId/{user_id}', response_model=List[AttendanceResponse])
def get_my_attendance(user_id:str,
                      db:Session=Depends(get_db),
                      current_user:dict=Depends(get_current_user),
                      role=Depends(require_roles('admin'))) -> List[AttendanceResponse]:
    try:

        _service=AttendanceService(db)

        attendance=_service.get_attendance_by_user_id(user_id)

        if not attendance:
            raise HTTPException(status_code=404, detail='the users doesnt have attendance')
        
        return attendance
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")

@router.get('/getAllAttendance', response_model=List[AttendanceResponse])
def get_all_attendances(db:Session=Depends(get_db),
                        current_user:dict=Depends(get_current_user),
                        role=Depends(require_roles('admin'))) -> List[AttendanceResponse]:
    try:

        _service=AttendanceService(db)

        attendances=_service.get_all_attendance()

        if attendances is None:
            raise HTTPException(status_code=404, detail='there`s no attendances')
        
        return attendances
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")
    
@router.get('/getActualAttendance',response_model=AttendanceResponse)
def get_actual_attendance(db:Session=Depends(get_db),
                          current_user:dict=Depends(get_current_user)) -> AttendanceResponse:
    try:
        
        _service=AttendanceService(db)
        
        actual_attendance=_service.get_actual_attendance(current_user['user_id'])
        
        if actual_attendance is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='you dont have check the entrance'
            )
            
        return actual_attendance
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"there was an error {str(e)}"
        )
