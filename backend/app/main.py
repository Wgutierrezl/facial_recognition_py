from app.config.db_config import engine, Base
# Importar (en código Python)
from dotenv import load_dotenv

# Cargar variables de entorno AL INICIO, antes de cualquier import

from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import UserService
from app.services.rekognition_service import RekognitionService
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.user_controller import router as user_router
from app.controllers.role_controller import router as role_router
from app.controllers.area_controller import router as area_router
from app.controllers.place_controller import router as place_router
from app.controllers.attendance_controller import router as attendance_router
from app.controllers.rekognition_controller import router as rekognition_router
load_dotenv()
# Crear tablas
Base.metadata.create_all(bind=engine)

app=FastAPI()

#health endpoint
@app.get("/health")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rekognition_router, prefix='/api')
app.include_router(role_router,prefix='/api')
app.include_router(area_router,prefix='/api')
app.include_router(place_router,prefix='/api')
app.include_router(user_router,prefix='/api')
app.include_router(attendance_router,prefix='/api')
