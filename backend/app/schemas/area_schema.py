from pydantic import BaseModel

class AreaCreated(BaseModel):
    name: str

    orm_mode = True

class AreaResponse(BaseModel):
    id:int
    name: str

    orm_mode = True