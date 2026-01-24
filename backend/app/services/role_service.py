from typing import List
from app.repositories.role_repository import RoleRepository
from app.models.role import Role
from app.schemas.role_schema import RoleCreated, RoleResponse
from sqlalchemy.orm import Session


class RoleService:

    def __init__(self, db: Session):
        self.db = db
        self.role_repository = RoleRepository(db)

    
    def get_role_by_id(self, role_id:int) -> RoleResponse | None:
        role = self.role_repository.get_role_by_id(role_id)
        if not role:
            return None
        
        return role

    def get_all_roles(self) -> List[RoleResponse]:
        roles=self.role_repository.get_all_roles()

        if not roles:
            return []
        
        return roles

    def create_role(self, data:RoleCreated) -> RoleResponse:
        role=Role(
            name=data.name
        )

        role_created=self.role_repository.create_role(role)
        if not role_created:
            return None
    
        return role_created

