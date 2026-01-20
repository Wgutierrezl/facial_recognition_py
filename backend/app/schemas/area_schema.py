from pydantic import BaseModel

class AreaCreated(BaseModel):
    name: str

    class Config:
        orm_mode = True

class AreaResponse(BaseModel):
    id:int
    name: str

    class Config:
        orm_mode = True