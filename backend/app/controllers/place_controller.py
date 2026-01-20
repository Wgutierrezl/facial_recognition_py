from typing import List
from fastapi import Depends, HTTPException, status, APIRouter
from app.dependencie.db_dependencie import get_db
from sqlalchemy.orm import Session
from app.services.place_service import PlaceService
from app.schemas.place_schema import PlaceCreated, PlaceResponse

router=APIRouter(
    prefix="/places",
    tags=["Places"]
)

@router.post("/createPlace", response_model=PlaceResponse)
def create_place(data:PlaceCreated, db:Session=Depends(get_db)) -> PlaceResponse:
    try:
        place_service=PlaceService(db)

        place_created=place_service.create_place(data)

        if not place_created:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Place could not be created"
            )
        
        return place_created
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )
    
@router.get("/getPlaceById/{place_id}", response_model=PlaceResponse)
def get_place_by_id(place_id:int, db:Session=Depends(get_db)) -> PlaceResponse:
    try:

        place_service=PlaceService(db)

        place=place_service.get_place_by_id(place_id)

        if not place:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Place not found"
            )
        return place
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

@router.get("/getAllPlaces", response_model=List[PlaceResponse])
def get_all_places(db:Session=Depends(get_db)) -> List[PlaceResponse]:
    try:
        place_service=PlaceService(db)

        places=place_service.get_all_places()

        if not places:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No places found"
            )

        return places

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )