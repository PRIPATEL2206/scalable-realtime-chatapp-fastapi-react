from fastapi import status, HTTPException ,Depends,APIRouter
from fastapi.responses import StreamingResponse
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
from auth.dependency import get_current_user
from utils.genratore_util import get_genratore
from db.base_db import get_db


router=APIRouter(
     prefix="/auth",
 tags=["auth"],
)


@router.post('/register', summary="Create new user", response_model=Response_User)
async def create_user(data: Request_User,db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    
    if user is not None:
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exist"
        )
    
    data.password = get_hashed_password(data.password)
    newUser=User(**data.model_dump())   # saving user to database
    newUser.add(db)

    return Response_User.model_validate(newUser)
    


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
        "user":Response_User.model_validate(user),
        "access_token": create_access_token(user.email),
        "refresh_token": create_refresh_token(user.email),

    }

@router.post('/users')
def get_users(user_ids:list[str]=None,db:Session=Depends(get_db)):
        return StreamingResponse(
            content=get_genratore(
                 map(
                    lambda id:Response_User.model_validate(db.query(User).get(id)).model_dump_json(),
                    user_ids
                    ) if user_ids 
                    else map(
                         lambda user:Response_User.model_validate(user).model_dump_json(),
                            db.query(User).all()
                    )
                    ),
            media_type="text/event-stream")
    