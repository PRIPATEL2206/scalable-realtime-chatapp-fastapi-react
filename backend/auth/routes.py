from fastapi import status, HTTPException ,Depends,APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from auth.utils import (
    get_hashed_password,
    create_access_token,
    create_refresh_token,
    verify_password
)
from auth.db_models import User
from auth.response_models import Response_User,TokenSchema,Request_User
from sqlalchemy.orm import Session

from db.base_db import get_db


router=APIRouter(
     prefix="/auth",
 tags=["auth"],
)


@router.post('/signup', summary="Create new user", response_model=Response_User)
async def create_user(data: Request_User,db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    
    if user is not None:
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exist"
        )
    user = {
        'email': data.email,
        'password': get_hashed_password(data.password),
    }
    newUser=User(**user)   # saving user to database
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    user["id"]=newUser.id

    return user
    


@router.post('/login', summary="Create access and refresh tokens for user", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    hashed_pass = user.password

    if not verify_password(form_data.password, hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    return {
        "access_token": create_access_token(user.email),
        "refresh_token": create_refresh_token(user.email),
    }

