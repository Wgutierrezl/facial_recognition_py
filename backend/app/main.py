from app.config.db_config import engine, Base
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import UserService
from app.services.rekognition_service import RekognitionService
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.user_controller import router as user_router


# Crear tablas
Base.metadata.create_all(bind=engine)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)