from app.models.user import User
from fastapi import UploadFile
from app.schemas.user_schema import UserCreate, UserResponse
from app.dependencies import get_db
from app.repositories.user_repository import UserRepository
from sqlalchemy.orm import Session
from app.services.rekognition_service import RekognitionService

class UserService:
    def __init__(self, db: Session, rekognition_service: RekognitionService):
        self.db=db
        self.user_repository = UserRepository(db)
        self.rekognition_service = rekognition_service

    def create_user(self, user_create: UserCreate, file: UploadFile) -> UserResponse:
        try:

            user_existing = self.user_repository.get_user_by_email(user_create.email)
            if user_existing:
                raise ValueError("User with this email already exists")
            
            image_bytes = file.file.read()

            collection_id = "users_collection"

            self.rekognition_service.create_collection(collection_id)

            face_id=self.rekognition_service.index_face(
                collection_id=collection_id,
                image_bytes=image_bytes,
                external_image_id=user_create.email
            )

            user_create=User(
                name=user_create.name,
                email=user_create.email,
                face_id=face_id
            )

            return self.user_repository.create_user(user_create)
        
        except Exception as e:
            raise e
    
    def search_user_by_face(self, image:UploadFile) -> UserResponse:
        try:

            image_bytes = image.file.read()

            collection_id = "users_collection"

            face_id=self.rekognition_service.search_face(
                collection_id=collection_id,
                image_bytes=image_bytes
            )

            if not face_id:
                return None

            user = self.user_repository.get_user_by_face_id(face_id)

            return user

        except Exception as e:
            raise e