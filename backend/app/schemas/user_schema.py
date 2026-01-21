from pydantic import BaseModel
from app.schemas.role_schema import RoleResponse
from app.schemas.area_schema import AreaResponse
from app.schemas.place_schema import PlaceResponse
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str
    password_hash : str
    role_id : int
    area_id : int
    place_id : int

    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    user_id: str
    name: str
    email: str
    """ role_id : int
    area_id : int
    place_id : int """
    role: RoleResponse
    area: AreaResponse
    place: PlaceResponse
    face_id: str

    class Config:
        orm_mode = True
    
class UserLogin(BaseModel):
    email: str
    password: str

class SessionData(BaseModel):
    user_id:str
    name:str
    rol:str
    token:str

