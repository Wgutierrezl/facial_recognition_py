from pydantic import BaseModel

class RoleCreated(BaseModel):
    name: str

    orm_mode = True

class RoleResponse(BaseModel):
    id:int
    name: str

    orm_mode = True