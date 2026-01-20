from pydantic import BaseModel
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
    role_id : int
    area_id : int
    place_id : int
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

