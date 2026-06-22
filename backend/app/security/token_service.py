import os
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.models.user import User

class TokenService:

    SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY environment variable is required")
    ALGORITHM = "HS256"
    EXPIRE_MINUTES = 60

    def __init__(self):
        pass

    def create_access_token(self, data:User) -> str:
        payload={
            "user_id": data.user_id,
            "name": data.name,
            "email": data.email,
            "role":data.role.name,
            "exp": datetime.utcnow() + timedelta(minutes=self.EXPIRE_MINUTES)
        }

        token=jwt.encode(payload, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return token


    

    
