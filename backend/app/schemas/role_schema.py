from pydantic import BaseModel

class RoleCreated(BaseModel):
    name: str

    class Config:
        orm_mode = True

class RoleResponse(BaseModel):
    id:int
    name: str

    class Config:
        orm_mode = True