from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    face_id: str

    class Config:
        orm_mode = True