from pydantic import BaseModel

class PlaceCreated(BaseModel):
    name: str
    latitude: str
    longitude: str
    radius_meters: int

    class Config:
        orm_mode = True
    

class PlaceResponse(BaseModel):
    id: int
    name: str
    latitude: str
    longitude: str
    radius_meters: int

    class Config:
        orm_mode = True