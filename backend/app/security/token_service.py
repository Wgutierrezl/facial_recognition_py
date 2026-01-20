from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.models.user import User

class TokenService:

    SECRET_KEY = "***REMOVED***"
    ALGORITHM = "HS256"
    EXPIRE_MINUTES = 60

    def __init__(self):
        pass

    def create_access_token(self, data:User) -> str:
        payload={
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "role":data.role.name,
            "exp": datetime.utcnow() + timedelta(minutes=self.EXPIRE_MINUTES)
        }

        token=jwt.encode(payload, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return token


    

    
