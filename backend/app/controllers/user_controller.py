from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate, UserResponse, SessionData, UserLogin
from app.services.user_service import UserService
from app.services.rekognition_service import RekognitionService
from app.dependencie.db_dependencie import get_db
from app.dependencie.jwt_dependencie import get_current_user
from app.dependencie.role_dependencie import require_roles

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/registerUser", response_model=UserResponse)
def register_user(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role_id: int = Form(...),
    area_id: int = Form(...),
    place_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        user_create = UserCreate(name=name, email=email, password_hash=password, role_id=role_id, area_id=area_id, place_id=place_id)

        user_service = UserService(
            db=db,
            rekognition_service=RekognitionService()
        )

        return user_service.create_user(
            user_create=user_create,
            file=file
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")

@router.post("/searchUserByFace", response_model=SessionData)
def search_user_by_face(
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
) -> SessionData:
    try:
        user_service = UserService(
            db=db,
            rekognition_service=RekognitionService()
        )

        user = user_service.search_user_by_face(image=image)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")
    

@router.post("/loginManually", response_model=SessionData)
def login_user_manually(
    data: UserLogin,
    db: Session = Depends(get_db)
) -> SessionData:
    try:
        user_service = UserService(
            db=db,
            rekognition_service=RekognitionService()
        )

        session_data = user_service.login_user_manually(data=data)

        if not session_data:
            raise HTTPException(status_code=401, detail="Invalid credentials ()")

        return session_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")
    

@router.get('/getAllUsers', response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db),
                  current_user: dict = Depends(get_current_user),
                  role = Depends(require_roles('admin'))) -> List[UserResponse]:
    try:

        user_service=UserService(db, rekognition_service=RekognitionService())

        users=user_service.get_all_users()

        if not users:
            raise HTTPException(status_code=404, detail="there`s no users in the db")
        
        return users
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")
    
@router.get('/getProfile', response_model=UserResponse)
def get_user_profile(db:Session=Depends(get_db),
                     current_user:dict=Depends(get_current_user)) -> UserResponse:
    try:

        user_service=UserService(db, rekognition_service=RekognitionService())

        user_profile=user_service.get_user_by_id(current_user['user_id'])

        if user_profile is None:
            raise HTTPException(status_code=401, detail="Invalid credentials ()")
        
        return user_profile
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")
    
@router.get("/getUserById/{user_id}", response_model=UserResponse)
def get_user_by_userId(user_id:str,
                       db:Session=Depends(get_db),
                       current_user:dict=Depends(get_current_user),
                       role=Depends(require_roles('admin'))) -> UserResponse:
    try:

        _service=UserService(db, rekognition_service=RekognitionService())

        user=_service.get_user_by_id(user_id)

        if user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials ()")
        
        return user
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error (): {str(e)}")

