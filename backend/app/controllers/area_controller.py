from fastapi import Depends, HTTPException, status, APIRouter
from app.dependencie.db_dependencie import get_db
from sqlalchemy.orm import Session
from app.schemas.area_schema import AreaCreated, AreaResponse
from app.services.area_service import AreaService
from typing import List

router=APIRouter(
    prefix="/areas",
    tags=["Areas"]
)


@router.post("/createArea", response_model=AreaResponse)
def create_area(data:AreaCreated, db:Session=Depends(get_db)) -> AreaResponse:
    try:
        area_service=AreaService(db)

        area_created=area_service.create_area(data)

        if not area_created:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Area could not be created"
            )
        
        return area_created

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )
    
@router.get("/getAreaById/{area_id}", response_model=AreaResponse)
def get_area_by_id(area_id:int, db:Session=Depends(get_db)) -> AreaResponse:
    try:

        area_service=AreaService(db)

        area=area_service.get_area_by_id(area_id)

        if not area:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Area not found"
            )
        return area
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

@router.get("/getAllAreas", response_model=List[AreaResponse])
def get_all_areas(db:Session=Depends(get_db)) -> List[AreaResponse]:
    try:
        area_service=AreaService(db)

        areas=area_service.get_all_areas()

        if not areas:
            return []
        
        return areas

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )