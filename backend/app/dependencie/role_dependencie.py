from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from app.dependencie.jwt_dependencie import get_current_user as current_user
from app.security.token_service import TokenService

def require_roles(*roles:str):
    def role_checker(data:dict=Depends(current_user)):
        if data.get("role") not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to perform this action"
            )
        return data
    return role_checker
