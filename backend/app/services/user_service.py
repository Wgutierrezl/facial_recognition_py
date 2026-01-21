from app.models.user import User
from app.security.token_service import TokenService
from app.security.hash_service import HashService
from uuid import uuid4
from fastapi import UploadFile
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin, SessionData
from app.repositories.user_repository import UserRepository
from sqlalchemy.orm import Session
from app.services.rekognition_service import RekognitionService

class UserService:
    def __init__(self, db: Session, rekognition_service: RekognitionService):
        self.db=db
        self.user_repository = UserRepository(db)
        self.rekognition_service = rekognition_service
        self.token_service = TokenService()
        self.hash_service = HashService()

    def create_user(self, user_create: UserCreate, file: UploadFile) -> UserResponse:
        try:

            # Check if user with the same email already exists
            user_existing = self.user_repository.get_user_by_email(user_create.email)
            if user_existing:
                raise ValueError("User with this email already exists")
            
            image_bytes = file.file.read()

            # Define the collection ID for Rekognition
            collection_id = "users_collection"

            face_id_existing=self.rekognition_service.search_face(
                collection_id=collection_id,
                image_bytes=image_bytes
            )

            # If a face is already recognized, raise an error
            if face_id_existing:
                raise ValueError("User with this face already exists")
            

            # To ensure a clean state, delete and recreate the collection
            """ self.rekognition_service.delete_collection(collection_id) """

            # Create the collection if it doesn't exist
            self.rekognition_service.create_collection(collection_id)

            # Generate a safe external ID for the face
            safe_external_id = str(uuid4())

            # Index the face and get the face ID
            face_id=self.rekognition_service.index_face(
                collection_id=collection_id,
                image_bytes=image_bytes,
                external_image_id=safe_external_id
            )


            # Hash the user's password
            password_hashed=self.hash_service.hash_password(user_create.password_hash)

            # Create the user in the database
            user_create=User(
                name=user_create.name,
                email=user_create.email,
                password_hash=password_hashed,
                role_id=user_create.role_id,
                area_id=user_create.area_id,
                place_id=user_create.place_id,
                face_id=face_id
            )

            # Save the user and return the response
            return self.user_repository.create_user(user_create)
        
        except Exception as e:
            raise e
    
    def search_user_by_face(self, image:UploadFile) -> SessionData | None:
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

            if not user:
                return None
            
            token=self.token_service.create_access_token(user)

            session_data=SessionData(
                user_id=user.user_id,
                name=user.name,
                rol=user.role.name,
                token=token
            )

            return session_data

        except Exception as e:
            raise e
    
    def login_user_manually(self, data:UserLogin) -> SessionData | None:
        user = self.user_repository.get_user_by_email(data.email)

        if not user:
            return None
        
        if not self.hash_service.verify_password(data.password, user.password_hash):
            return None
        
        token=self.token_service.create_access_token(user)

        session_data=SessionData(
            user_id=user.user_id,
            name=user.name,
            rol=user.role.name,
            token=token
        )

        return session_data