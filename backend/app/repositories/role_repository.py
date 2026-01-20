from sqlalchemy.orm import Session
from app.models.role import Role


class RoleRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_role_by_id(self, role_id: int) -> Role:
        return self.db.query(Role).filter(Role.id == role_id).first()

    def get_all_roles(self) -> list[Role]:
        return self.db.query(Role).all()

    def create_role(self, role:Role) -> Role:
        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)
        return role