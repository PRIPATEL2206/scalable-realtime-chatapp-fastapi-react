
from fastapi import APIRouter,WebSocketDisconnect,WebSocket,Depends,HTTPException,status
from chat_websockets.user_massage_manager  import UserSocketManager, build_msg,UserSocketHelper
from auth.dependency import get_curent_user_from_tocken,get_current_user
from db.base_db import get_db
from chat_websockets.request_models import Req_Chat,Req_Group
from chat_websockets.response_models import Res_Group,Res_Chat
from chat_websockets.db_models import Group,Chat
from auth.db_models import User
from sqlalchemy.orm import Session
import json


router = APIRouter(
    prefix="/ws",
 tags=["chats_websocket"],
)

userSocketManager = UserSocketManager()

@router.post("/group")
def create_group(req_group:Req_Group,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    group=Group(**req_group.model_dump())
    group.users=[user]
    group.created_by = user.id
    db.add(group)
    db.commit()
    db.refresh(group)
    return Res_Group.model_validate(group)

@router.get("/groups")
def get_all_groups(db:Session=Depends(get_db)):
    return [ Res_Group.model_validate(group) for group in  db.query(Group).all()]
     


# {
#     "group_id":"",
# "msg":"ok"
# }

# localhost:8000/ws/chats

# Authorization

@router.websocket("/chats")
async def websocket_endpoint(websocket:WebSocket,db:Session=Depends(get_db)):
    try :
        token=websocket.headers.get("Authorization")
        user = await get_curent_user_from_tocken(token=token)
        socketHelper = UserSocketHelper(userSocketManager,user,websocket)

    except :
        raise  HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    await socketHelper.connect()
    print(user.email + " joined")
    try:
        while True:
            data = json.loads( await websocket.receive_text())
            chat=Chat(**Req_Chat(**data).model_dump())
            
            chat.sender=user
            db.add(chat)
            db.commit()
            db.refresh(chat)
            chat_res=Res_Chat.model_validate(chat)
            await socketHelper.broadcast_all_in_group(chat.group_id,str({
                "event":"massage_recive",
                "chat":chat_res.model_dump()
                }))
            
    except WebSocketDisconnect:
        await socketHelper.disconnect()


