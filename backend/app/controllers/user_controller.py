from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate, UserResponse, SessionData, UserLogin
from app.services.user_service import UserService
from app.services.rekognition_service import RekognitionService
from app.dependencie.db_dependencie import get_db

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