from app.models.user import User
from sqlalchemy.orm import Session, joinedload


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: User) -> User:
        self.db.add(user_data)
        self.db.commit()
        self.db.refresh(user_data)
        return user_data

    def get_user_by_email(self, email: str) -> User:
        return (
            self.db.query(User)
                .options(joinedload(User.role))
                .filter(User.email == email)
                .first()
        )

    def get_user_by_id(self, user_id: str) -> User:
        return (
            self.db.query(User)
                .options(joinedload(User.role))
                .filter(User.user_id == user_id)
                .first()
        )

    def get_user_by_face_id(self, face_id:str) -> User:
        return (
            self.db.query(User)
                .options(joinedload(User.role))
                .filter(User.face_id == face_id)
                .first()
        )