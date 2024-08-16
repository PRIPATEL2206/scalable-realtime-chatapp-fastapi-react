
from fastapi import FastAPI,WebSocketDisconnect,WebSocket,status, HTTPException ,Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse

from group_manager import SocketHelper,WebSocketManager,build_msg
from auth.utils import (
    get_hashed_password,
    create_access_token,
    create_refresh_token,
    verify_password
)
from auth.db_models import User,get_db
from auth.response_models import User_in_out,TokenSchema
from uuid import uuid4
from sqlalchemy.orm import Session
from auth.dependency import get_current_user



app= FastAPI()

@app.get("/")
def home(user:User_in_out = Depends(get_current_user)):
    return {"name":user.email}


########################################## Auth ##########################################

@app.post('/signup', summary="Create new user", response_model=User_in_out)
async def create_user(data: User_in_out,db: Session = Depends(get_db)):
    # querying database to check if user already exist
    user = db.query(User).filter(User.email == data.email).first()

    if user is not None:
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exist"
        )
    user = {
        'email': data.email,
        'password': get_hashed_password(data.password),
        'id': str(uuid4())
    }
    newUser=User(**user)   # saving user to database
    db.add(newUser)
    db.commit()
    db.refresh(newUser)

    return user


@app.post('/login', summary="Create access and refresh tokens for user", response_model=TokenSchema)
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


################################ websockets ###########################################

webSocketManager = WebSocketManager()

@app.websocket("/ws/{client_id}/{group_id}")
async def websocket_endpoint(websocket:WebSocket,client_id:str,group_id:str):

    socketHelper=SocketHelper(webSocketManager,group_id,websocket)
    await socketHelper.connect()

    # await socketHelper.send_personal_msg(f"{client_id} connected")
    await socketHelper.broadcast_all(build_msg("server",f"{client_id} joined {group_id}","server_event"))
    try:
        while True:
            data = await websocket.receive_text()
            await socketHelper.broadcast(build_msg(client_id,data))

    except WebSocketDisconnect:
        await socketHelper.disconnect()

