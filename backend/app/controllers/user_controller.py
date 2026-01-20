from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate, UserResponse
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
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        user_create = UserCreate(name=name, email=email)

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
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/searchUserByFace", response_model=UserResponse)
def search_user_by_face(
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
) -> UserResponse:
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
        raise HTTPException(status_code=500, detail="Internal Server Error")
