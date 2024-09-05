from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session


from auth.utils import (
    ALGORITHM,
    JWT_SECRET_KEY
)

from jose import jwt
from pydantic import ValidationError

from auth.db_models import User
from db.base_db import get_db
from auth.response_models import Payload

reuseable_oauth = OAuth2PasswordBearer(
    tokenUrl="auth/login",
    scheme_name="JWT"
)


async def get_curent_user_from_tocken(token:str,db:Session=next(get_db()))->User:
    try:
        payload = jwt.decode(
            token, JWT_SECRET_KEY, algorithms=[ALGORITHM]
        )
        token_data = Payload(**payload)
        
        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except(jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user:User|None = db.query(User).get(token_data.sub)
    if user == None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_user(token: str = Depends(reuseable_oauth),db: Session = Depends(get_db)) -> User:
    return await get_curent_user_from_tocken(token,db)
