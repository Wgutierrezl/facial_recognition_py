from typing import List
from fastapi import Depends, HTTPException, status, APIRouter
from app.services.role_service import RoleService
from app.repositories.role_repository import RoleRepository
from sqlalchemy.orm import Session
from app.schemas.role_schema import RoleCreated, RoleResponse
from app.dependencie.db_dependencie import get_db
from app.dependencie.jwt_dependencie import get_current_user

router=APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

@router.post("/createRole", response_model=RoleResponse)
def create_role(data:RoleCreated, db:Session=Depends(get_db)) -> RoleResponse:
    try:
        role_service=RoleService(db)

        role_created=role_service.create_role(data)

        if not role_created:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role could not be created"
            )
        
        return role_created

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )
    

@router.get("/getRoleById/{role_id}", response_model=RoleResponse)
def get_role_by_id(role_id:int, db:Session=Depends(get_db)) -> RoleResponse:
    try:
        role_service=RoleService(db)

        role=role_service.get_role_by_id(role_id)

        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found"
            )
        
        return role

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

@router.get("/getAllRoles", response_model=List[RoleResponse])
def get_all_roles(db:Session=Depends(get_db)) -> List[RoleResponse]:
    try:
        role_service=RoleService(db)

        roles=role_service.get_all_roles()

        if not roles:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No roles found"
            )

        return roles



    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )